import { resend } from "@/lib/resend";
import { generateConfirmationEmailHTML } from "./confirmation-template";

interface Vehicle {
  type: "lourd" | "leger";
  code_confirmation: string;
}

interface SendConfirmationEmailParams {
  to: string;
  contact_nom: string;
  contact_prenom: string;
  parking_nom: string;
  parking_adresse: string;
  date_debut: string;
  date_fin: string;
  nombre_nuits: number;
  vehicles: Vehicle[];
  montant_total_ht: number;
}

export async function sendConfirmationEmail(params: SendConfirmationEmailParams) {
  try {
    const html = generateConfirmationEmailHTML({
      contact_nom: params.contact_nom,
      contact_prenom: params.contact_prenom,
      contact_email: params.to,
      parking_nom: params.parking_nom,
      parking_adresse: params.parking_adresse,
      date_debut: params.date_debut,
      date_fin: params.date_fin,
      nombre_nuits: params.nombre_nuits,
      vehicles: params.vehicles,
      montant_total_ht: params.montant_total_ht,
    });

    const { data, error } = await resend.emails.send({
      from: "LaRosa Parking <onboarding@resend.dev>",
      to: params.to,
      subject: `✅ Confirmation de réservation - LaRosa Parking`,
      html,
    });

    if (error) {
      console.error("❌ Erreur Resend:", error);
      throw error;
    }

    console.log("✅ Email envoyé avec succès:", data);
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
}

