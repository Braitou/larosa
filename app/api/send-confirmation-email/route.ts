import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendConfirmationEmail } from "@/lib/emails/send-confirmation";

export async function POST(req: NextRequest) {
  try {
    const { reservation_id } = await req.json();

    if (!reservation_id) {
      return NextResponse.json(
        { error: "reservation_id requis" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Récupérer la réservation avec le parking et les véhicules
    const { data: reservation, error: reservationError } = await supabase
      .from("reservations")
      .select(`
        *,
        parking:parkings(nom, adresse)
      `)
      .eq("id", reservation_id)
      .single();

    if (reservationError || !reservation) {
      console.error("❌ Réservation non trouvée:", reservationError);
      return NextResponse.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }

    // Récupérer les véhicules
    const { data: vehicles, error: vehiclesError } = await supabase
      .from("vehicles")
      .select("type, code_confirmation")
      .eq("reservation_id", reservation_id);

    if (vehiclesError || !vehicles || vehicles.length === 0) {
      console.error("❌ Véhicules non trouvés:", vehiclesError);
      return NextResponse.json(
        { error: "Véhicules non trouvés" },
        { status: 404 }
      );
    }

    // Envoyer l'email
    try {
      await sendConfirmationEmail({
        to: reservation.contact_email,
        contact_nom: reservation.contact_nom,
        contact_prenom: reservation.contact_prenom,
        parking_nom: reservation.parking.nom,
        parking_adresse: reservation.parking.adresse,
        date_debut: reservation.date_debut,
        date_fin: reservation.date_fin,
        nombre_nuits: reservation.nombre_nuits,
        vehicles: vehicles as Array<{ type: "lourd" | "leger"; code_confirmation: string }>,
        montant_total_ht: reservation.montant_total_ht,
      });

      console.log("✅ Email de confirmation envoyé avec succès pour la réservation", reservation_id);

      return NextResponse.json({ success: true });
    } catch (emailError) {
      console.error("❌ Erreur lors de l'envoi de l'email:", emailError);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Erreur dans send-confirmation-email:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

