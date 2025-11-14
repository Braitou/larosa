# Configuration Resend pour LaRosa

Ce document explique comment configurer Resend pour l'envoi d'emails transactionnels.

---

## 📧 Qu'est-ce que Resend ?

Resend est un service d'envoi d'emails transactionnels moderne, avec une API simple et une excellente délivrabilité.

**Utilisé pour** :
- Emails de confirmation de réservation
- Emails avec codes de validation
- (Futur) Emails de rappel avant arrivée

---

## 🔧 Configuration

### 1. Créer un compte Resend

1. Allez sur [resend.com](https://resend.com)
2. Créez un compte gratuit
3. Accédez au Dashboard

### 2. Obtenir la clé API

1. Dans le Dashboard Resend, allez dans **API Keys**
2. Cliquez sur **Create API Key**
3. Donnez un nom : `LaRosa Production` ou `LaRosa Development`
4. Sélectionnez les permissions : **Full access** (ou **Send emails** minimum)
5. Copiez la clé (commence par `re_...`)

### 3. Ajouter la clé dans `.env.local`

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🧪 Mode Test (MVP actuel)

Pour tester sans domaine vérifié, utilisez l'adresse d'envoi par défaut :

```
onboarding@resend.dev
```

**Limitations du mode test** :
- Les emails sont envoyés uniquement à l'adresse email de votre compte Resend
- Pas de domaine personnalisé
- Parfait pour le développement !

---

## 🌐 Production : Configurer un domaine personnalisé

### Pourquoi un domaine ?

Pour envoyer des emails depuis `noreply@larosa.com` ou `reservation@larosa.com`, vous devez vérifier votre domaine.

### Étapes

1. **Acheter un domaine** (ex: `larosa.com`)
2. **Ajouter le domaine dans Resend** :
   - Dashboard → **Domains** → **Add Domain**
   - Entrez votre domaine : `larosa.com`
3. **Configurer les DNS** :
   - Resend vous donnera 3 enregistrements DNS à ajouter :
     - **SPF** (TXT record)
     - **DKIM** (TXT record)
     - **DMARC** (TXT record)
   - Allez dans votre registrar (OVH, Gandi, Cloudflare, etc.)
   - Ajoutez ces enregistrements DNS
4. **Attendre la vérification** (peut prendre jusqu'à 48h)
5. **Changer l'expéditeur dans le code** :

```typescript
// Dans lib/emails/send-confirmation.ts
from: "LaRosa Parking <reservation@larosa.com>", // Au lieu de onboarding@resend.dev
```

---

## 📨 Template d'email actuel

Le template est dans `lib/emails/confirmation-template.ts`.

**Design** :
- ✅ Couleurs du projet (#1E355E, #F1E6D8, etc.)
- ✅ Fonts Fraunces & Manrope (via Google Fonts)
- ✅ Cards arrondies (12px border-radius)
- ✅ Codes de validation bien visibles (gros, en gras, fond bleu)
- ✅ Instructions importantes dans un bloc coloré

**Contenu** :
- Nom du client
- Détails du parking (nom, adresse)
- Dates d'arrivée et de départ
- Nombre de nuits
- Total payé (TTC)
- **Tableau des codes** (1 ligne par véhicule)
- Instructions pour l'arrivée et le départ

---

## 🧪 Tester l'envoi d'email

1. Faites une réservation test sur le site
2. Complétez le paiement Stripe (mode test)
3. Vérifiez votre boîte email (celle du compte Resend en mode test)
4. Vérifiez que l'email :
   - ✅ S'affiche correctement
   - ✅ Contient tous les codes
   - ✅ Les instructions sont claires
   - ✅ Le design est conforme

---

## 📊 Dashboard Resend

Dans le Dashboard, vous pouvez :
- **Logs** : Voir tous les emails envoyés
- **Analytics** : Taux d'ouverture, de clic, etc.
- **Domains** : Gérer vos domaines vérifiés
- **API Keys** : Créer/révoquer des clés

---

## 🚀 Optimisations futures

- [ ] Email de rappel 24h avant arrivée
- [ ] Email de satisfaction après départ
- [ ] Notifications de modifications de réservation
- [ ] Email de facture détaillée (PDF)
- [ ] Support multi-langues (FR/EN)

---

## ⚠️ Bonnes pratiques

1. **Ne jamais commiter la clé API** (toujours dans `.env.local`)
2. **Vérifier le domaine en production** (pour éviter le spam)
3. **Tester les emails sur différents clients** (Gmail, Outlook, Apple Mail)
4. **Ajouter un lien de désinscription** (si emails marketing)
5. **Monitorer les bounces et plaintes** (Dashboard Resend)

---

## 📝 Support

- **Documentation Resend** : https://resend.com/docs
- **API Reference** : https://resend.com/docs/api-reference
- **Support** : support@resend.com

---

**Dernière mise à jour** : 14 novembre 2025

