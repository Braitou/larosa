import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});

// Fonction pour créer un Payment Intent
export async function createPaymentIntent(
  amount: number,
  currency: string = "eur",
  metadata?: Record<string, string>
) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Stripe utilise les centimes
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
}

// Fonction pour créer un transfert vers le compte LaRosa (95%)
export async function createTransfer(
  amount: number,
  destinationAccountId: string,
  paymentIntentId: string
) {
  const transferAmount = Math.round(amount * 0.95 * 100); // 95% pour LaRosa

  return await stripe.transfers.create({
    amount: transferAmount,
    currency: "eur",
    destination: destinationAccountId,
    transfer_group: paymentIntentId,
  });
}

// Fonction pour vérifier une signature webhook
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}





