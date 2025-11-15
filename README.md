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

3. **Variables d'environnement**

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

4. **Lancer le serveur de développement**

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
└── PROJECT.md             # Roadmap & documentation du projet
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

### ✅ Statut Actuel : MVP Opérationnel (Phase 9/10)

**Fonctionnalités complétées :**
- ✅ Réservation en ligne avec formulaire multi-étapes
- ✅ Paiement sécurisé via Stripe
- ✅ Génération automatique de codes de confirmation
- ✅ Emails de confirmation automatiques
- ✅ Dashboard gardien avec gestion avancée (IN/OUT)
- ✅ Protection anti-overbooking avec transactions atomiques
- ✅ Formatage automatique des plaques d'immatriculation
- ✅ Interface moderne et responsive

**Prochaine étape : Phase 10 - Tests & Démo**

## 👥 Utilisateurs

### Clients (Régisseurs)
- ✅ Consultation des parkings disponibles en temps réel
- ✅ Réservation en ligne sans création de compte
- ✅ Paiement sécurisé par carte bancaire
- ✅ Réception des codes de confirmation par email

### Gardiens
- ✅ Validation des arrivées via code 6 chiffres
- ✅ Gestion des départs définitifs
- ✅ Suivi des sorties/retours temporaires (IN/OUT)
- ✅ Dashboard en temps réel avec 4 colonnes
- ✅ Interface mobile-friendly

### Administrateurs (LaRosa)
- ✅ Accès au dashboard gardien
- 🔜 Gestion des parkings (Phase future)
- 🔜 Configuration des tarifs (Phase future)
- 🔜 Statistiques et reporting (Phase future)

## 🔒 Sécurité & Performance

- ✅ **Anti-overbooking** : Transactions SQL atomiques avec verrouillage
- ✅ **Paiements sécurisés** : Stripe (PCI compliant)
- ✅ **Authentification** : Supabase Auth pour gardiens/admins
- ✅ **Protection des routes** : Middleware Next.js
- ✅ **Variables d'environnement** : Protégées côté serveur
- ✅ **Validation des données** : Zod + React Hook Form
- ✅ **SEO optimisé** : Meta tags et fonts optimisées

## 📝 License

Propriétaire - Tous droits réservés

---

**Développé avec ❤️ pour moderniser l'industrie audiovisuelle parisienne**





