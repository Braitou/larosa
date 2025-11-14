# 🎯 GUIDE ULTRA-SIMPLE : CRÉER UN COMPTE ADMIN

**Suit ces étapes DANS L'ORDRE. Ça prendra 3 minutes max.**

---

## ✅ Étape 1 : Migration SQL (1 min)

Ouvre **Supabase SQL Editor** et copie-colle TOUT ce bloc :

```sql
-- SIMPLIFICATION TOTALE
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile during signup" ON users;
DROP POLICY IF EXISTS "Gardiens can view their parking reservations" ON reservations;
DROP POLICY IF EXISTS "Gardiens can update reservations" ON reservations;

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
TRUNCATE TABLE users CASCADE;

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin'));
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'admin';
```

Clique **Run** ✅

---

## ✅ Étape 2 : Désactiver confirmation email (30 secondes)

1. Dans **Supabase Dashboard**
2. **Authentication** > **Providers**
3. Clique sur **Email**
4. **Décoche** "Confirm email"
5. **Save**

✅

---

## ✅ Étape 3 : Supprimer ton compte existant (30 secondes)

1. Dans **Supabase Dashboard**
2. **Authentication** > **Users**
3. Trouve ton utilisateur
4. Clique sur les **3 points** > **Delete user**

✅

---

## ✅ Étape 4 : Créer un nouveau compte (1 min)

1. Va sur **http://localhost:3000/register**
2. Remplis :
   - Prénom : Test
   - Nom : Admin
   - Email : admin@test.com
   - Téléphone : 0612345678
   - Mot de passe : test123456
   - Confirmation : test123456
3. Clique **"Créer mon compte"**

✅ Tu seras **automatiquement redirigé** vers `/admin/dashboard` !

---

## ✅ Étape 5 : Vérifier (optionnel)

Dans **SQL Editor** :

```sql
SELECT * FROM users;
```

Tu devrais voir ton utilisateur avec `role = 'admin'` ✅

---

## 🎉 C'EST TERMINÉ !

Tu es maintenant connecté en tant qu'admin !

Tu peux :
- Te déconnecter et te reconnecter sur `/login`
- Créer d'autres comptes admin via `/register`
- Tous les comptes créés seront **automatiquement admin**

---

## 🚨 Si ça ne marche TOUJOURS pas

Vérifie que tu as bien cette clé dans `.env.local` :

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

Elle se trouve dans **Supabase Dashboard** > **Settings** > **API** > **service_role** (secret)

Sans cette clé, le register ne peut pas créer le compte.

---

**Exécute les 4 premières étapes et ça DOIT fonctionner. Promis ! 💪**

