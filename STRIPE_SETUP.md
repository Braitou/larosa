# Configuration Stripe pour LaRosa

## 📋 Étape 1 : Créer un compte Stripe

1. Va sur [https://stripe.com](https://stripe.com)
2. Crée un compte gratuit
3. Active le **mode Test** (toggle en haut à droite)

## 🔑 Étape 2 : Récupérer les clés API

1. Dans ton dashboard Stripe, va dans **Developers** > **API keys**
2. Tu verras deux types de clés :
   - **Publishable key** (commence par `pk_test_...`)
   - **Secret key** (commence par `sk_test_...`)

3. Copie ces valeurs dans ton `.env.local` :

```env
# Ajoute ces lignes dans .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 🔔 Étape 3 : Configurer les Webhooks (local)

Pour le développement local, on va utiliser **Stripe CLI**.

### Installer Stripe CLI (Windows)

1. Télécharge : [https://github.com/stripe/stripe-cli/releases](https://github.com/stripe/stripe-cli/releases)
2. Ou via Chocolatey : `choco install stripe-cli`

### Configurer

```bash
# 1. Login Stripe CLI
stripe login

# 2. Forward webhooks vers localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 3. Copie le webhook signing secret (commence par whsec_...)
# et ajoute-le dans .env.local
```

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Note** : Laisse `stripe listen` tourner dans un terminal pendant le développement.

## 💳 Étape 4 : Cartes de test

Stripe fournit des cartes de test pour simuler des paiements :

### Carte qui fonctionne
- **Numéro** : `4242 4242 4242 4242`
- **Expiration** : N'importe quelle date future
- **CVC** : N'importe quel 3 chiffres
- **ZIP** : N'importe quel code postal

### Autres cartes de test
- **Refusée** : `4000 0000 0000 0002`
- **Authentification requise** : `4000 0025 0000 3155`

## ✅ Configuration terminée !

Tu es prêt pour intégrer Stripe Checkout ! 🎉

---

## 📚 Ressources

- [Stripe Testing Docs](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhook Events](https://stripe.com/docs/webhooks)


