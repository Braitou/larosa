# LaRosa - Plateforme de Réservation de Parkings Sécurisés

## 📋 Contexte du Projet

LaRosa est une plateforme web SaaS permettant de digitaliser la réservation et la gestion de parkings sécurisés pour camions de production audiovisuelle à Paris.

### Problème résolu
- **Avant** : Réservations par téléphone/email, aucune visibilité sur les places, gestion papier, risque de déplacement inutile
- **Après** : Réservation en ligne avec paiement, visibilité temps réel, confirmation par code, gestion digitale complète

### Utilisateurs
- **Régisseurs/Conducteurs** : Réservent et paient en ligne
- **Gardiens** : Valident les arrivées/départs via code de confirmation
- **Administrateurs LaRosa** : Gèrent les parkings, tarifs, et consultent les statistiques

### Modèle économique
Commission de 5% sur chaque transaction via Stripe Connect (split automatique 95/5)

---

## 🛠️ Stack Technique

### Frontend & Backend
- **Framework** : Next.js 15 (App Router) + TypeScript
- **UI** : React 19
- **Styling** : Tailwind CSS
- **Composants** : Shadcn/ui
- **Icônes** : Lucide React (uniquement)

### Base de données & Auth
- **BaaS** : Supabase
- **Database** : PostgreSQL
- **Auth** : Supabase Auth
- **Real-time** : Supabase Real-time (pour disponibilité des places)

### Paiements
- **Provider** : Stripe Connect (Express accounts)
- **Split** : 95% LaRosa / 5% Commission

### Services & Outils
- **Hébergement** : Vercel
- **Emails** : Resend
- **Validation** : Zod + React Hook Form
- **Dates** : date-fns
- **State Management** : @tanstack/react-query

---

## 🎨 Design System

### Palette de Couleurs

```css
/* Backgrounds */
--background-main: #FAF4EC;
--background-card: #F1E6D8;

/* Bleus */
--blue-primary: #1E355E;    /* Boutons, titres */
--blue-secondary: #2E4A7C;  /* Hover */

/* Texte */
--text-primary: #1E355E;    /* Titres */
--text-secondary: #324C7A;  /* Paragraphes */
```

### Typographie

**Titres (h1, h2, h3)**
- Police : **Fraunces**
- Weight : 700
- Line-height : 1.1 - 1.2
- Letter-spacing : -0.02em

**Corps de texte**
- Police : **Manrope**
- Weight : 400 - 600
- Line-height : 1.6

### Icônes
- Librairie : **Lucide React** (uniquement)

### Principes UI/UX
- Design simple, léché et professionnel
- Responsive first (mobile + desktop)
- Feedback visuel clair à chaque étape
- Navigation intuitive avec minimum de clics

---

## 🗄️ Architecture Base de Données

### Tables principales

**users** (Admin/Gardien uniquement)
- id, email, role (gardien/admin)
- nom, prenom, telephone
- created_at, updated_at

**parkings**
- id, nom, adresse, ville
- capacite_totale (150 places)
- places_disponibles (temps réel)
- tarif_vehicule_lourd (35€ HT)
- tarif_vehicule_leger (30€ HT)
- created_at, updated_at

**reservations** (Anonyme - sans compte utilisateur)
- id, parking_id
- **Informations contact**
  - contact_nom, contact_prenom
  - contact_email, contact_telephone
  - contact_societe
  - reference_projet (nullable)
- **Informations facturation**
  - facturation_identique (boolean)
  - facturation_societe (nullable)
  - facturation_adresse (nullable)
  - facturation_tva (nullable)
  - facturation_reference (nullable)
- **Dates & tarifs**
  - date_debut, date_fin
  - nombre_nuits (calculé)
  - nombre_vehicules_lourds
  - nombre_vehicules_legers
  - montant_total_ht
- **Paiement & statut**
  - stripe_payment_intent_id
  - statut (en_attente/confirmee/annulee)
  - paid_at
- created_at, updated_at

**vehicles** (Un par véhicule de la réservation)
- id, reservation_id
- type (lourd/leger)
- code_confirmation (6 chiffres unique)
- statut (en_attente/arrive/parti)
- checked_in_at (nullable)
- checked_out_at (nullable)
- created_at

**transactions**
- id, reservation_id
- montant_total_ht
- stripe_payment_intent_id
- statut (succeeded/pending/failed)
- created_at

---

## 🗺️ Roadmap MVP Simplifié

> **Note importante** : Cette roadmap a été simplifiée pour un MVP sans création de compte utilisateur. L'authentification (Phases 1-3 déjà complétées) reste en place pour les admin/gardiens et sera réutilisée plus tard.

### ✅ Phase 1 : Setup & Configuration [TERMINÉE]
- [x] Initialiser le projet Next.js 15 avec TypeScript
- [x] Configurer Tailwind CSS
- [x] Installer et configurer Shadcn/ui
- [x] Setup Supabase (compte + projet)
- [x] Créer les variables d'environnement
- [x] Installer les dépendances principales (Zod, React Hook Form, date-fns, etc.)

### ✅ Phase 2 : Design System & Composants de Base [TERMINÉE]
- [x] Intégrer les fonts (Fraunces + Manrope)
- [x] Configurer la palette de couleurs dans Tailwind
- [x] Créer les composants UI de base (Button, Card, Input, etc.)
- [x] Créer le layout principal (Header, Footer)
- [x] Créer la page d'accueil (landing)

### ✅ Phase 3 : Auth Admin/Gardien [TERMINÉE]
- [x] Authentification admin/gardien (login/logout)
- [x] Protection des routes dashboard
- [x] Dashboard de base (sera amélioré en Phase 7)

### ✅ Phase 4 : Configuration des Parkings & Base de Données
- [x] Adapter le schéma de base de données pour réservations anonymes
  - [x] Table `reservations` : ajouter champs contact et facturation
  - [x] Table `vehicles` : stocker les véhicules et leurs codes individuels
  - [x] Supprimer la contrainte `user_id` obligatoire
- [x] Insérer les 2 parkings de démo
  - [x] Bobigny : 54 rue Andrée, 93000 Bobigny (150 places)
  - [x] Saint-Denis : 32 av. du President Wilson, 93200 La Plaine Saint-Denis (150 places)
- [x] Définir les tarifs (35€ HT véhicule lourd, 30€ HT véhicule léger)
- [x] Mettre à jour les types TypeScript
- [x] Créer les validations Zod
- [x] Créer les utilitaires de calcul
- [x] Créer la page de liste des parkings

### ✅ Phase 5 : Formulaire de Réservation Multi-Étapes (Sans Compte) [TERMINÉE]
- [x] **Étape 1** : Informations de contact
  - [x] Nom, Prénom, Email, Téléphone
  - [x] Nom de la société
  - [x] Référence du projet (facultatif)
  - [x] Case à cocher "Informations de facturation identiques"
  - [x] Si décochée : Formulaire facturation (Société, Adresse, N° TVA, Référence)
- [x] **Étape 2** : Choix des véhicules
  - [x] Nombre de véhicules lourds (35€ HT/nuit)
  - [x] Nombre de véhicules légers (30€ HT/nuit)
  - [x] Compteurs +/- pour ajuster les quantités
- [x] **Étape 3** : Sélection parking et dates
  - [x] Choix entre Bobigny et Saint-Denis
  - [x] Date picker : date d'arrivée + date de départ
  - [x] Calcul automatique du nombre de nuits
  - [x] Affichage de la disponibilité en temps réel
  - [x] Vérification des places suffisantes
- [x] **Étape 4** : Récapitulatif
  - [x] Résumé complet de la commande
  - [x] Détail des véhicules et tarifs
  - [x] Total HT
  - [x] CGV à accepter
- [x] Validation des formulaires avec Zod
- [x] Navigation entre étapes (précédent/suivant)
- [x] Persistance des données avec localStorage
- [x] Indicateur de progression visuel

### ✅ Phase 6 : Paiement Stripe [TERMINÉE]
- [x] Créer compte Stripe (mode test)
- [x] Intégration Stripe Checkout
- [x] Création du Payment Intent via API route
- [x] Page de paiement sécurisée
- [x] Gestion des webhooks Stripe
- [x] Enregistrement de la transaction après paiement réussi
- [x] Génération des codes uniques (1 code par véhicule, 6 chiffres)
- [x] Page de confirmation post-paiement avec tous les codes
- [x] Guide de configuration Stripe (STRIPE_SETUP.md)

### ✅ Phase 7 : Dashboard Unifié Admin/Gardien [TERMINÉE]
- [x] Layout dashboard avec onglets (Bobigny / Saint-Denis)
- [x] Par parking, afficher :
  - [x] Nombre de véhicules actuellement garés
  - [x] Nombre de véhicules à venir (réservations futures)
  - [x] Nombre de véhicules qui doivent partir aujourd'hui
  - [x] Nombre de places disponibles
- [x] Interface de validation des arrivées
  - [x] Input pour saisir le code à 6 chiffres
  - [x] Vérification et validation du code
  - [x] Marquage du véhicule comme "arrivé"
  - [x] Affichage des messages de succès/erreur
  - [x] Décrémentation automatique des places disponibles
- [x] Interface de validation des départs
  - [x] Liste des véhicules présents dans chaque réservation
  - [x] Bouton "Marquer départ" pour chaque véhicule
  - [x] Incrémentation automatique des places disponibles
- [x] Rafraîchissement automatique toutes les 30 secondes
- [x] Dashboard admin = dashboard gardien (pour le MVP)
- [x] Fonctions SQL pour gérer les places disponibles

### ✅ Phase 8 : Emails de Confirmation
- [ ] Configurer Resend avec domaine
- [ ] Template email de confirmation
  - [ ] Récapitulatif de la commande
  - [ ] Tableau des codes de validation (1 par véhicule)
  - [ ] Informations du parking (adresse, contact)
  - [ ] Instructions pour les chauffeurs
  - [ ] Dates et horaires
- [ ] Envoi automatique après paiement réussi
- [ ] Email de rappel 24h avant arrivée (optionnel)

### ✅ Phase 9 : Finitions & Optimisations
- [ ] Gestion de la disponibilité en temps réel (Supabase Realtime)
- [ ] Empêcher overbooking (vérification atomique)
- [ ] Loading states et skeletons
- [ ] Messages d'erreur explicites
- [ ] Toast notifications (sonner)
- [ ] Responsive design complet
- [ ] Optimisation des performances

### ✅ Phase 10 : Tests & Démo
- [ ] Tests du parcours complet de réservation
- [ ] Tests de validation des codes (dashboard)
- [ ] Vérification des emails
- [ ] Tests de paiement Stripe (mode test)
- [ ] Données de démo réalistes
- [ ] Préparation du pitch pour LaRosa

---

## 🔮 Phases Futures (Post-MVP)

Ces fonctionnalités ont déjà été partiellement développées et seront activées plus tard :

### Phase Future 1 : Comptes Utilisateurs
- ✅ Authentification déjà codée (réutilisable)
- [ ] Dashboard client pour voir l'historique
- [ ] Sauvegarde des informations de facturation
- [ ] Réservation rapide avec infos pré-remplies
- [ ] Gestion des favoris (parkings)

### Phase Future 2 : Fonctionnalités Avancées
- [ ] Split automatique Stripe Connect (95/5)
- [ ] Programme de fidélité
- [ ] Notifications SMS (Twilio)
- [ ] QR Codes au lieu de codes 6 chiffres
- [ ] Export PDF des factures
- [ ] API publique pour intégrations

### Phase Future 3 : Multi-parkings & Scaling
- [ ] Ajout de nouveaux parkings
- [ ] Gestion des tarifs par parking
- [ ] Statistiques avancées
- [ ] Reporting et analytics
- [ ] Système de remboursement

---

## 📁 Structure du Projet

```
larosa/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (public)/
│   │   ├── page.tsx
│   │   └── parkings/
│   ├── (client)/
│   │   ├── dashboard/
│   │   ├── reservations/
│   │   └── book/
│   ├── (gardien)/
│   │   └── dashboard/
│   ├── (admin)/
│   │   ├── dashboard/
│   │   ├── parkings/
│   │   └── analytics/
│   └── api/
│       ├── webhooks/stripe/
│       ├── reservations/
│       └── payments/
├── components/
│   ├── ui/              # Shadcn components
│   ├── forms/
│   ├── dashboard/
│   └── shared/
├── lib/
│   ├── supabase/
│   ├── stripe.ts
│   ├── validations/     # Zod schemas
│   └── utils.ts
├── types/
│   └── database.types.ts
└── middleware.ts
```

---

## 🎯 Objectif MVP

Créer un **proof of concept fonctionnel** à présenter à LaRosa démontrant :
- ✨ Interface utilisateur moderne et intuitive
- 🚀 Processus de réservation simple et rapide
- 👁️ Visibilité temps réel des places disponibles
- 💳 Paiement sécurisé avec split de commission
- 📊 Dashboards admin et gardien opérationnels

---

## 📝 Notes de Développement

### Parking de Démo
**Nom** : Parking LaRosa Saint-Denis  
**Adresse** : 32 Avenue du Président Wilson, 93210 Saint-Denis  
**Capacité** : À définir (ex: 50 places)  
**Tarifs** : À définir par type de camion

### Priorités
1. **Visual First** : Interface léchée et professionnelle
2. **UX Simple** : Minimum de friction pour réserver
3. **Fonctionnel** : Tous les flux doivent marcher de bout en bout
4. **Sécurité** : Authentification et paiements sécurisés

### Optimisations futures (post-MVP)
- Gestion de la concurrence (overbooking)
- Notifications SMS
- QR Codes
- Multi-parkings
- Programme fidélité
- Export des données
- API publique

---

**Dernière mise à jour** : 13 novembre 2025  
**Version** : 1.0 - MVP

