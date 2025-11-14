import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Gérer les différents types d'événements
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "payment_intent.succeeded":
        console.log("✅ Payment succeeded:", event.data.object.id);
        break;

      case "payment_intent.payment_failed":
        console.log("❌ Payment failed:", event.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const reservationId = session.client_reference_id;

  if (!reservationId) {
    console.error("No reservation_id in session");
    return;
  }

  console.log("✅ Checkout completed for reservation:", reservationId);

  const supabase = await createClient();

  // 1. Mettre à jour la réservation (statut: confirmee)
  const { data: reservation, error: updateError } = await supabase
    .from("reservations")
    .update({
      statut: "confirmee",
      stripe_payment_intent_id: session.payment_intent as string,
      paid_at: new Date().toISOString(),
    })
    .eq("id", reservationId)
    .select()
    .single();

  if (updateError) {
    console.error("Error updating reservation:", updateError);
    return;
  }

  // 2. Créer la transaction
  await supabase.from("transactions").insert({
    reservation_id: reservationId,
    montant_total_ht: reservation.montant_total_ht,
    stripe_payment_intent_id: session.payment_intent as string,
    statut: "succeeded",
  });

  // 3. Générer les codes de véhicules
  const vehicules: Array<{ type: "lourd" | "leger" }> = [];

  // Ajouter les véhicules lourds
  for (let i = 0; i < reservation.nombre_vehicules_lourds; i++) {
    vehicules.push({ type: "lourd" });
  }

  // Ajouter les véhicules légers
  for (let i = 0; i < reservation.nombre_vehicules_legers; i++) {
    vehicules.push({ type: "leger" });
  }

  // Créer les entrées de véhicules avec codes uniques
  const vehiculesToInsert = vehicules.map((v) => ({
    reservation_id: reservationId,
    type: v.type,
    code_confirmation: "", // Sera généré par la fonction SQL
    statut: "en_attente" as const,
  }));

  // Insérer les véhicules
  for (const vehicule of vehiculesToInsert) {
    // Appeler la fonction SQL pour générer un code unique
    const { data: codeData } = await supabase.rpc("generate_vehicle_code");
    
    if (codeData) {
      await supabase.from("vehicles").insert({
        ...vehicule,
        code_confirmation: codeData,
      });
    }
  }

  console.log(`✅ Created ${vehicules.length} vehicle codes for reservation ${reservationId}`);

  // 4. TODO Phase 8 : Envoyer l'email de confirmation avec les codes
  console.log("📧 TODO: Send confirmation email to", reservation.contact_email);
}


