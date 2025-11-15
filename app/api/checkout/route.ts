import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      // Contact
      contact_prenom,
      contact_nom,
      contact_email,
      contact_telephone,
      contact_adresse,
      contact_societe,
      reference_projet,
      // Facturation
      facturation_identique,
      facturation_societe,
      facturation_adresse,
      facturation_tva,
      facturation_reference,
      // Véhicules
      nombre_vehicules_lourds,
      nombre_vehicules_legers,
      // Parking et dates
      parking_id,
      date_debut,
      date_fin,
    } = body;

    // Récupérer les infos du parking
    const supabase = await createClient();
    const { data: parking, error: parkingError } = await supabase
      .from("parkings")
      .select("*")
      .eq("id", parking_id)
      .single();

    if (parkingError || !parking) {
      return NextResponse.json(
        { error: "Parking non trouvé" },
        { status: 404 }
      );
    }

    // Calculer le nombre de nuits
    const dateDebutObj = new Date(date_debut);
    const dateFinObj = new Date(date_fin);
    const nombreNuits = Math.ceil(
      (dateFinObj.getTime() - dateDebutObj.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculer le montant total
    const montantLourds =
      nombre_vehicules_lourds * nombreNuits * parking.tarif_vehicule_lourd;
    const montantLegers =
      nombre_vehicules_legers * nombreNuits * parking.tarif_vehicule_leger;
    const montantTotal = montantLourds + montantLegers;

    // Créer une réservation confirmée immédiatement (simplification MVP)
    const { data: reservation, error: reservationError } = await supabase
      .from("reservations")
      .insert({
        parking_id,
        contact_nom,
        contact_prenom,
        contact_email,
        contact_telephone,
        contact_adresse,
        contact_societe,
        reference_projet: reference_projet || null,
        facturation_identique,
        facturation_societe: facturation_societe || null,
        facturation_adresse: facturation_adresse || null,
        facturation_tva: facturation_tva || null,
        facturation_reference: facturation_reference || null,
        date_debut,
        date_fin,
        nombre_nuits: nombreNuits,
        nombre_vehicules_lourds,
        nombre_vehicules_legers,
        montant_total_ht: montantTotal,
        statut: "confirmee", // Confirmée directement pour le MVP
        paid_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (reservationError || !reservation) {
      console.error("Erreur création réservation:", reservationError);
      return NextResponse.json(
        { error: "Erreur lors de la création de la réservation" },
        { status: 500 }
      );
    }

    // Créer les véhicules avec leurs codes immédiatement
    const vehicules: Array<{ type: "lourd" | "leger" }> = [];

    for (let i = 0; i < nombre_vehicules_lourds; i++) {
      vehicules.push({ type: "lourd" });
    }

    for (let i = 0; i < nombre_vehicules_legers; i++) {
      vehicules.push({ type: "leger" });
    }

    // Générer les codes et créer les véhicules
    // Générer les codes côté serveur (plus simple pour le MVP)
    const vehiculesToInsert = vehicules.map(() => {
      // Générer un code à 6 chiffres
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      return {
        reservation_id: reservation.id,
        type: vehicules[vehicules.indexOf(vehicules[0])].type,
        code_confirmation: code,
        statut: "en_attente" as const,
      };
    });

    // Créer tous les véhicules
    console.log(`🚗 Création de ${vehicules.length} véhicules pour la réservation ${reservation.id}`);
    
    const vehiclesCreated: Array<{ type: "lourd" | "leger"; code_confirmation: string }> = [];
    
    for (let i = 0; i < vehicules.length; i++) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      console.log(`   → Véhicule ${i + 1}/${vehicules.length} : ${vehicules[i].type} - Code: ${code}`);
      
      const { data: vehicleData, error: vehicleError } = await supabase
        .from("vehicles")
        .insert({
          reservation_id: reservation.id,
          type: vehicules[i].type,
          code_confirmation: code,
          statut: "en_attente",
        })
        .select()
        .single();

      if (vehicleError) {
        console.error("❌ Erreur création véhicule:", vehicleError);
      } else {
        console.log(`   ✅ Véhicule créé:`, vehicleData.id);
        vehiclesCreated.push({
          type: vehicleData.type,
          code_confirmation: vehicleData.code_confirmation,
        });
      }
    }

    console.log(`✅ Tous les véhicules ont été créés pour la réservation ${reservation.id}`);

    // Réserver les places de manière atomique (anti-overbooking)
    const totalVehicules = nombre_vehicules_lourds + nombre_vehicules_legers;
    console.log(`📊 Réservation atomique de ${totalVehicules} places pour le parking ${parking_id}`);
    
    const { data: reservationResult, error: reservationPlacesError } = await supabase.rpc(
      "reserve_parking_places",
      {
        parking_id_param: parking_id,
        nombre_places_param: totalVehicules,
      }
    );

    if (reservationPlacesError || !reservationResult?.success) {
      console.error("❌ Erreur réservation places:", reservationResult);
      
      // Supprimer la réservation et les véhicules créés
      await supabase.from("vehicles").delete().eq("reservation_id", reservation.id);
      await supabase.from("reservations").delete().eq("id", reservation.id);
      
      return NextResponse.json(
        {
          error: "Places insuffisantes",
          details: reservationResult?.message || "Impossible de réserver les places",
          places_disponibles: reservationResult?.places_disponibles || 0,
        },
        { status: 400 }
      );
    }
    
    console.log(`✅ Places réservées avec succès - Restantes: ${reservationResult.places_restantes}`);

    // Note : L'email sera envoyé APRÈS le paiement Stripe réussi (depuis la page de confirmation)

    // Créer la transaction
    await supabase.from("transactions").insert({
      reservation_id: reservation.id,
      montant_total_ht: montantTotal,
      stripe_payment_intent_id: "stripe_payment_intent_placeholder", // Pour le MVP
      statut: "succeeded",
    });

    // Créer les lignes d'items pour Stripe
    const lineItems = [];

    if (nombre_vehicules_lourds > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `Véhicule lourd - ${parking.nom}`,
            description: `${nombre_vehicules_lourds} véhicule(s) × ${nombreNuits} nuit(s)`,
          },
          unit_amount: Math.round(
            (parking.tarif_vehicule_lourd * nombreNuits * 100)
          ),
        },
        quantity: nombre_vehicules_lourds,
      });
    }

    if (nombre_vehicules_legers > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `Véhicule léger - ${parking.nom}`,
            description: `${nombre_vehicules_legers} véhicule(s) × ${nombreNuits} nuit(s)`,
          },
          unit_amount: Math.round(
            (parking.tarif_vehicule_leger * nombreNuits * 100)
          ),
        },
        quantity: nombre_vehicules_legers,
      });
    }

    // Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: contact_email,
      client_reference_id: reservation.id,
      metadata: {
        reservation_id: reservation.id,
        parking_id,
        nombre_vehicules_lourds: nombre_vehicules_lourds.toString(),
        nombre_vehicules_legers: nombre_vehicules_legers.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/reserver/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/reserver/recapitulatif`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Erreur checkout:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session de paiement" },
      { status: 500 }
    );
  }
}


