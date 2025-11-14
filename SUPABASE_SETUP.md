# Configuration Supabase pour LaRosa

## Étape 1 : Créer un compte et un projet

1. Va sur [https://supabase.com](https://supabase.com)
2. Crée un compte gratuit
3. Crée un nouveau projet :
   - Nom : `larosa` ou `larosa-mvp`
   - Région : Europe (Frankfurt) ou proche de Paris
   - Password : Choisis un mot de passe fort pour la base de données

## Étape 2 : Copier les clés API

1. Dans ton projet Supabase, va dans **Settings** > **API**
2. Copie les valeurs suivantes :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Ne jamais exposer côté client !)

3. Crée un fichier `.env.local` à la racine du projet :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role

# Stripe (à remplir plus tard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend (à remplir plus tard)
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Étape 3 : Créer le schéma de base de données

Va dans **SQL Editor** et exécute le script suivant :

```sql
-- Activation de l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table users (profils utilisateurs)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'gardien', 'admin')),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  telephone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table parkings
CREATE TABLE parkings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  adresse TEXT NOT NULL,
  ville TEXT NOT NULL,
  capacite_totale INTEGER NOT NULL DEFAULT 0,
  places_disponibles INTEGER NOT NULL DEFAULT 0,
  tarifs JSONB NOT NULL DEFAULT '{}',
  horaires TEXT NOT NULL,
  stripe_account_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table reservations
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parking_id UUID REFERENCES parkings(id) ON DELETE CASCADE,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  type_camion TEXT NOT NULL,
  plaque_immatriculation TEXT NOT NULL,
  nom_production TEXT NOT NULL,
  societe_production TEXT NOT NULL,
  code_confirmation TEXT NOT NULL,
  statut TEXT NOT NULL CHECK (statut IN ('en_attente', 'confirmee', 'arrivee', 'terminee', 'annulee')) DEFAULT 'en_attente',
  montant_total NUMERIC(10, 2) NOT NULL,
  stripe_payment_intent_id TEXT,
  checked_in_at TIMESTAMPTZ,
  checked_out_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  montant_total NUMERIC(10, 2) NOT NULL,
  commission NUMERIC(10, 2) NOT NULL,
  montant_parking NUMERIC(10, 2) NOT NULL,
  stripe_transfer_id TEXT,
  statut TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_parking_id ON reservations(parking_id);
CREATE INDEX idx_reservations_code ON reservations(code_confirmation);
CREATE INDEX idx_reservations_dates ON reservations(date_debut, date_fin);
CREATE INDEX idx_transactions_reservation ON transactions(reservation_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parkings_updated_at BEFORE UPDATE ON parkings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Étape 4 : Configurer Row Level Security (RLS)

Exécute ce script pour sécuriser les tables :

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parkings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policies pour users
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Policies pour parkings (lecture publique)
CREATE POLICY "Anyone can view parkings"
  ON parkings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can manage parkings"
  ON parkings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    )
  );

-- Policies pour reservations
CREATE POLICY "Users can view own reservations"
  ON reservations FOR SELECT
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Gardiens can view their parking reservations"
  ON reservations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role IN ('gardien', 'admin')
    )
  );

CREATE POLICY "Users can create own reservations"
  ON reservations FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Gardiens can update reservations"
  ON reservations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role IN ('gardien', 'admin')
    )
  );

-- Policies pour transactions (admins seulement)
CREATE POLICY "Only admins can view transactions"
  ON transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id::text = auth.uid()::text 
      AND users.role = 'admin'
    )
  );
```

## Étape 5 : Insérer le parking de démo

```sql
INSERT INTO parkings (nom, adresse, ville, capacite_totale, places_disponibles, tarifs, horaires)
VALUES (
  'Parking LaRosa Saint-Denis',
  '32 Avenue du Président Wilson',
  'Saint-Denis',
  50,
  50,
  '{
    "petit_utilitaire": 45,
    "camion_20m3": 75,
    "semi_remorque": 120
  }'::jsonb,
  '24h/24 - 7j/7'
);
```

## Étape 6 : Configurer l'authentification

1. Va dans **Authentication** > **Providers**
2. Active **Email** (déjà activé par défaut)
3. Configure les URLs de redirection dans **URL Configuration** :
   - Site URL : `http://localhost:3000`
   - Redirect URLs : `http://localhost:3000/auth/callback`

## Étape 7 : Tester la connexion

Redémarre le serveur Next.js :
```bash
npm run dev
```

La connexion Supabase est maintenant configurée ! ✅

## Notes importantes

- ⚠️ Ne JAMAIS commit le fichier `.env.local`
- 🔒 La `service_role` key donne un accès complet à la base, ne jamais l'exposer côté client
- 📊 Les policies RLS protègent automatiquement les données selon le rôle de l'utilisateur
- 🔄 Pour régénérer les types TypeScript : `npx supabase gen types typescript --project-id "YOUR_PROJECT_ID" > types/database.types.ts`





