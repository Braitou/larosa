# Parcours Utilisateur LaRosa MVP

## 🎬 Vue d'ensemble

Le parcours utilisateur est conçu pour être **simple, rapide et sans friction**. Aucune création de compte n'est requise.

---

## 👤 Parcours Client (Réservation)

### 1️⃣ Page d'accueil
- Landing page avec présentation LaRosa
- CTA principal : **"Réserver une place"**
- Clique → redirigé vers `/reserver`

---

### 2️⃣ Formulaire Multi-Étapes

#### **Étape 1/4 : Informations de contact**
Route : `/reserver/contact`

**Formulaire :**
```
┌─────────────────────────────────────────┐
│ Qui effectue la réservation ?           │
├─────────────────────────────────────────┤
│ Prénom*       │ Nom*                    │
│ [________]    │ [________]              │
│                                         │
│ Email*                                  │
│ [____________________________]          │
│                                         │
│ Téléphone*                              │
│ [____________________________]          │
│                                         │
│ Nom de la société*                      │
│ [____________________________]          │
│                                         │
│ Référence du projet (facultatif)       │
│ [____________________________]          │
│                                         │
│ ☑ Informations de facturation          │
│   identiques                            │
└─────────────────────────────────────────┘
```

**Si case décochée, afficher :**
```
┌─────────────────────────────────────────┐
│ Informations de facturation             │
├─────────────────────────────────────────┤
│ Société*                                │
│ [____________________________]          │
│                                         │
│ Adresse postale*                        │
│ [____________________________]          │
│ [____________________________]          │
│ [____________________________]          │
│                                         │
│ N° TVA (facultatif)                     │
│ [____________________________]          │
│                                         │
│ Référence projet (facultatif)          │
│ [____________________________]          │
└─────────────────────────────────────────┘
```

**Bouton :** `Suivant →`

---

#### **Étape 2/4 : Choix des véhicules**
Route : `/reserver/vehicules`

**Formulaire :**
```
┌─────────────────────────────────────────┐
│ Combien de véhicules souhaitez-vous    │
│ garer ?                                 │
├─────────────────────────────────────────┤
│                                         │
│ 🚚 Véhicules lourds (35€ HT/nuit)      │
│ ┌─────┬─────┬─────┐                    │
│ │  -  │  0  │  +  │                    │
│ └─────┴─────┴─────┘                    │
│                                         │
│ 🚐 Véhicules légers (30€ HT/nuit)      │
│ ┌─────┬─────┬─────┐                    │
│ │  -  │  0  │  +  │                    │
│ └─────┴─────┴─────┘                    │
│                                         │
│ Total : 0 véhicule(s)                  │
└─────────────────────────────────────────┘
```

**Validation :** Au moins 1 véhicule (lourd ou léger)

**Boutons :** `← Retour` | `Suivant →`

---

#### **Étape 3/4 : Parking et dates**
Route : `/reserver/parking-dates`

**Formulaire :**
```
┌─────────────────────────────────────────┐
│ Où et quand ?                           │
├─────────────────────────────────────────┤
│                                         │
│ Choisissez votre parking :              │
│                                         │
│ ○ Parking LaRosa Bobigny                │
│   54 rue Andrée, 93000 Bobigny          │
│   📊 145/150 places disponibles         │
│                                         │
│ ○ Parking LaRosa Saint-Denis            │
│   32 av. du President Wilson            │
│   93200 La Plaine Saint-Denis           │
│   📊 150/150 places disponibles         │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│ Date d'arrivée*                         │
│ [📅 JJ/MM/AAAA]                         │
│                                         │
│ Date de départ*                         │
│ [📅 JJ/MM/AAAA]                         │
│                                         │
│ 📌 Nombre de nuits : 3                  │
│                                         │
│ ⚠️ Attention : 5 véhicules réservent    │
│    15 places (5 véhicules × 3 nuits)    │
└─────────────────────────────────────────┘
```

**Calcul automatique :**
- Nombre de nuits = `date_départ - date_arrivée`
- Places nécessaires = `(nb_lourds + nb_légers) × nb_nuits` *(pour info)*
- Vérification disponibilité en temps réel

**Validation :**
- Date d'arrivée >= aujourd'hui
- Date de départ > date d'arrivée
- Parking sélectionné a assez de places

**Boutons :** `← Retour` | `Suivant →`

---

#### **Étape 4/4 : Récapitulatif**
Route : `/reserver/recapitulatif`

**Affichage :**
```
┌─────────────────────────────────────────┐
│ Récapitulatif de votre réservation      │
├─────────────────────────────────────────┤
│                                         │
│ 👤 Contact                              │
│ Jean Dupont                             │
│ jean.dupont@email.com                   │
│ 06 12 34 56 78                          │
│ Société : Production XYZ                │
│                                         │
│ 📍 Parking                              │
│ Parking LaRosa Saint-Denis              │
│ 32 av. du President Wilson              │
│ 93200 La Plaine Saint-Denis             │
│                                         │
│ 📅 Dates                                │
│ Du 15/11/2024 au 18/11/2024             │
│ 3 nuits                                 │
│                                         │
│ 🚚 Véhicules                            │
│ • 2 véhicules lourds                    │
│ • 3 véhicules légers                    │
│ Total : 5 véhicules                     │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│ 💰 Détail des tarifs                    │
│                                         │
│ 2 véh. lourds × 3 nuits × 35€   210€   │
│ 3 véh. légers × 3 nuits × 30€   270€   │
│                                         │
│ Total HT                        480€    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│ ☐ J'accepte les CGV                    │
│                                         │
└─────────────────────────────────────────┘
```

**Boutons :** `← Retour` | `Payer 480€`

---

### 3️⃣ Paiement Stripe
Route : `/reserver/paiement`

- Redirection vers Stripe Checkout
- Paiement sécurisé par carte bancaire
- Montant : Total HT

**Stripe crée :**
- Payment Intent
- Enregistre le paiement

**Après paiement réussi :**
- Webhook Stripe déclenché
- Création de la réservation dans la BDD
- Génération de 5 codes uniques (1 par véhicule)
- Envoi email de confirmation
- Redirection vers `/reserver/confirmation`

---

### 4️⃣ Page de confirmation
Route : `/reserver/confirmation/[reservation_id]`

**Affichage :**
```
┌─────────────────────────────────────────┐
│ ✅ Réservation confirmée !              │
├─────────────────────────────────────────┤
│                                         │
│ Un email de confirmation avec vos       │
│ codes d'accès a été envoyé à :          │
│ jean.dupont@email.com                   │
│                                         │
│ 📋 Vos codes de validation :            │
│                                         │
│ Véhicule lourd 1    │ 123456            │
│ Véhicule lourd 2    │ 789012            │
│ Véhicule léger 1    │ 345678            │
│ Véhicule léger 2    │ 901234            │
│ Véhicule léger 3    │ 567890            │
│                                         │
│ ⚠️ Important : Chaque chauffeur doit    │
│ présenter son code au gardien lors      │
│ de l'arrivée au parking.                │
│                                         │
│ 📍 Parking LaRosa Saint-Denis           │
│ 32 av. du President Wilson              │
│ 93200 La Plaine Saint-Denis             │
│                                         │
│ 📅 Du 15/11/2024 au 18/11/2024          │
│                                         │
│ [Télécharger le PDF] [Retour accueil]  │
└─────────────────────────────────────────┘
```

---

### 5️⃣ Email de confirmation

**Sujet :** `Réservation LaRosa confirmée - Parking Saint-Denis`

**Contenu :**
```
Bonjour Jean,

Votre réservation est confirmée ! ✅

📋 CODES DE VALIDATION
────────────────────────────────────
Véhicule lourd 1     123456
Véhicule lourd 2     789012
Véhicule léger 1     345678
Véhicule léger 2     901234
Véhicule léger 3     567890

⚠️ Chaque chauffeur doit présenter son code
au gardien à l'arrivée.

📍 PARKING
────────────────────────────────────
Parking LaRosa Saint-Denis
32 avenue du Président Wilson
93200 La Plaine Saint-Denis
Tél : 01 23 45 67 89

📅 DATES
────────────────────────────────────
Arrivée : 15/11/2024
Départ :  18/11/2024
(3 nuits)

🚚 VÉHICULES
────────────────────────────────────
2 véhicules lourds
3 véhicules légers
Total : 5 véhicules

💰 MONTANT PAYÉ
────────────────────────────────────
480€ HT

📋 INSTRUCTIONS
────────────────────────────────────
1. Distribuez les codes aux chauffeurs
2. À l'arrivée, le chauffeur donne son code
3. Le gardien valide et ouvre l'accès
4. Au départ, le gardien valide la sortie

Des questions ?
Contactez-nous : contact@larosa.fr

Merci de votre confiance !
L'équipe LaRosa

[Voir ma réservation]
```

---

## 🛡️ Parcours Gardien (Dashboard)

### 1️⃣ Login
Route : `/login`

- Email + mot de passe
- Authentification Supabase
- Redirection vers `/gardien/dashboard` ou `/admin/dashboard`

---

### 2️⃣ Dashboard unifié
Route : `/gardien/dashboard` (même route pour admin)

**Layout avec onglets :**
```
┌─────────────────────────────────────────┐
│ LaRosa Dashboard                [Déco]  │
├─────────────────────────────────────────┤
│                                         │
│ [Bobigny] [Saint-Denis]  ← Onglets     │
│                                         │
├─────────────────────────────────────────┤
│ 📊 Parking Saint-Denis                  │
│                                         │
│ ┌──────┐ ┌──────┐ ┌──────┐            │
│ │  12  │ │  8   │ │  5   │            │
│ │Garés │ │Venir │ │Sortir│            │
│ └──────┘ └──────┘ └──────┘            │
│                                         │
│ 📋 Validation des arrivées              │
│                                         │
│ Code à 6 chiffres :                     │
│ [______]  [Valider]                     │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│ Réservations aujourd'hui :              │
│                                         │
│ ┌───────────────────────────────────┐  │
│ │ 15/11 - Prod XYZ                  │  │
│ │ 5 véhicules (2L, 3l)              │  │
│ │ ✅ 3 arrivés │ ⏳ 2 en attente    │  │
│ └───────────────────────────────────┘  │
│                                         │
│ ┌───────────────────────────────────┐  │
│ │ 15/11 - Prod ABC                  │  │
│ │ 2 véhicules (1L, 1l)              │  │
│ │ ✅ 2 arrivés                       │  │
│ └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

### 3️⃣ Validation d'une arrivée

**Flow :**
1. Chauffeur arrive et donne code : `123456`
2. Gardien saisit code et clique "Valider"
3. **Si code valide :**
   - ✅ Message : "Véhicule lourd 1 - Prod XYZ validé !"
   - Affichage des infos :
     - Type de véhicule
     - Nom de la réservation
     - Dates
   - Bouton "Confirmer l'arrivée"
   - → Met à jour statut du véhicule : `arrive`
   - → Décrémente `places_disponibles` du parking
4. **Si code invalide :**
   - ❌ Message : "Code invalide ou déjà utilisé"

---

### 4️⃣ Validation d'un départ

**Flow :**
1. Liste des véhicules présents (statut = `arrive`)
2. Bouton "Marquer comme parti" sur chaque véhicule
3. Clic → Confirmation
4. → Met à jour statut : `parti`
5. → Incrémente `places_disponibles` du parking

---

## 🔄 États et Statuts

### Statut Réservation
- `en_attente` : Créée mais pas encore payée
- `confirmee` : Payée avec succès
- `annulee` : Annulée (future feature)

### Statut Véhicule
- `en_attente` : Créé, pas encore arrivé
- `arrive` : Code validé par gardien, véhicule présent
- `parti` : Départ validé par gardien

---

## 📊 Disponibilité en Temps Réel

### Calcul des places
```
places_disponibles = capacite_totale - nombre_vehicules_presents
```

Où `nombre_vehicules_presents` = nombre de véhicules avec statut `arrive`

### Mise à jour
- À chaque validation d'arrivée : `-1`
- À chaque validation de départ : `+1`

---

## 🎯 Points Clés

✅ Aucun compte utilisateur requis pour réserver
✅ Un code par véhicule (pas par réservation)
✅ Email avec tous les codes
✅ Dashboard unifié gardien/admin
✅ Temps réel pour disponibilité
✅ Simple et rapide

---

**Prêt pour le développement ! 🚀**



