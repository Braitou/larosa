# LaRosa - Plateforme de Réservation de Parkings Sécurisés

> Digitalisation de la réservation de parkings sécurisés pour camions de production audiovisuelle à Paris

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)](https://supabase.com/)

## 🚀 Quick Start

### Prérequis

- Node.js 18+ 
- Un compte Supabase (gratuit)
- Un compte Stripe (mode test)

### Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd larosa
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer Supabase**

Suis le guide complet dans [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

Résumé :
- Crée un projet sur [supabase.com](https://supabase.com)
- Copie tes clés API
- Exécute le schéma SQL fourni
- Configure les variables d'environnement

4. **Variables d'environnement**

Crée un fichier `.env.local` :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role

# Stripe (mode test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Lancer le serveur de développement**

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) dans ton navigateur.

## 📁 Structure du Projet

```
larosa/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Pages d'authentification
│   ├── (public)/          # Pages publiques
│   ├── (client)/          # Dashboard client
│   ├── (gardien)/         # Dashboard gardien
│   ├── (admin)/           # Dashboard admin
│   └── api/               # API Routes
├── components/
│   ├── ui/                # Composants Shadcn/ui
│   ├── forms/             # Formulaires
│   ├── dashboard/         # Composants dashboard
│   └── shared/            # Composants partagés
├── lib/
│   ├── supabase/          # Configuration Supabase
│   ├── validations/       # Schémas Zod
│   ├── stripe.ts          # Configuration Stripe
│   └── utils.ts           # Utilitaires
├── types/
│   └── database.types.ts  # Types TypeScript Supabase
├── PROJECT.md             # Roadmap & documentation du projet
└── SUPABASE_SETUP.md      # Guide de configuration Supabase
```

## 🎨 Design System

### Couleurs

- **Background** : `#FAF4EC` (principal), `#F1E6D8` (cards)
- **Bleu** : `#1E355E` (primary), `#2E4A7C` (secondary/hover)
- **Texte** : `#1E355E` (titres), `#324C7A` (paragraphes)

### Typographie

- **Titres** : Fraunces (700)
- **Corps** : Manrope (400-600)

### Icônes

- Lucide React uniquement

## 🛠️ Stack Technique

### Core
- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript 5
- **Styling** : Tailwind CSS 3
- **UI Components** : Shadcn/ui

### Backend & Database
- **BaaS** : Supabase
- **Database** : PostgreSQL
- **Auth** : Supabase Auth
- **Real-time** : Supabase Realtime

### Intégrations
- **Paiements** : Stripe Connect
- **Emails** : Resend
- **State** : TanStack React Query
- **Forms** : React Hook Form + Zod
- **Dates** : date-fns

## 📦 Scripts Disponibles

```bash
npm run dev          # Lancer le serveur de développement (Turbopack)
npm run build        # Build de production
npm run start        # Lancer en production
npm run lint         # Linter le code
```

## 🗺️ Roadmap

Voir [PROJECT.md](./PROJECT.md) pour la roadmap complète du MVP.

### Phase actuelle : Phase 1 ✅
- [x] Setup Next.js 15 + TypeScript
- [x] Configuration Tailwind CSS
- [x] Installation Shadcn/ui
- [x] Configuration Supabase
- [x] Variables d'environnement

### Prochaine phase : Phase 2
- [ ] Design system
- [ ] Composants de base
- [ ] Page d'accueil

## 👥 Utilisateurs

### Clients (Régisseurs)
- Consultation des parkings disponibles
- Réservation en ligne avec paiement
- Gestion de leurs réservations

### Gardiens
- Validation des arrivées via code
- Gestion des départs
- Vue temps réel du parking

### Administrateurs (LaRosa)
- Gestion des parkings
- Configuration des tarifs
- Statistiques et reporting

## 🔒 Sécurité

- ✅ Row Level Security (RLS) sur Supabase
- ✅ Authentification sécurisée
- ✅ Paiements via Stripe (PCI compliant)
- ✅ Variables d'environnement protégées
- ✅ Middleware de protection des routes

## 📝 License

Propriétaire - Tous droits réservés

---

**Développé avec ❤️ pour moderniser l'industrie audiovisuelle parisienne**





