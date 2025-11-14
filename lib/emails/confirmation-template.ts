import { formatDate } from "date-fns";
import { fr } from "date-fns/locale";

interface Vehicle {
  type: "lourd" | "leger";
  code_confirmation: string;
}

interface ReservationEmailData {
  contact_nom: string;
  contact_prenom: string;
  contact_email: string;
  parking_nom: string;
  parking_adresse: string;
  date_debut: string;
  date_fin: string;
  nombre_nuits: number;
  vehicles: Vehicle[];
  montant_total_ht: number;
}

export function generateConfirmationEmailHTML(data: ReservationEmailData): string {
  const dateDebut = formatDate(new Date(data.date_debut), "EEEE d MMMM yyyy", { locale: fr });
  const dateFin = formatDate(new Date(data.date_fin), "EEEE d MMMM yyyy", { locale: fr });

  const vehiculesHTML = data.vehicles
    .map(
      (vehicle, index) => `
    <tr>
      <td style="padding: 16px; border-bottom: 1px solid #e5d5c1; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; color: #1E355E;">
        Véhicule ${index + 1} - ${vehicle.type === "lourd" ? "Lourd (>3.5T)" : "Léger (<3.5T)"}
      </td>
      <td style="padding: 16px; border-bottom: 1px solid #e5d5c1; text-align: right;">
        <span style="display: inline-block; background: #1E355E; color: white; padding: 12px 24px; border-radius: 8px; font-family: 'Fraunces', Georgia, serif; font-size: 24px; font-weight: 700; letter-spacing: 2px;">
          ${vehicle.code_confirmation}
        </span>
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@700&family=Manrope:wght@400;600&display=swap" rel="stylesheet">
  <title>Confirmation de réservation - LaRosa Parking</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF4EC; font-family: 'Manrope', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FAF4EC; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E355E 0%, #2E4A7C 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; font-family: 'Fraunces', Georgia, serif; font-size: 32px; font-weight: 700; color: white; letter-spacing: -0.02em;">
                LaRosa Parking
              </h1>
              <p style="margin: 10px 0 0 0; font-family: 'Manrope', Arial, sans-serif; font-size: 16px; color: rgba(255, 255, 255, 0.9);">
                Confirmation de réservation
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; font-family: 'Manrope', Arial, sans-serif; font-size: 16px; color: #324C7A; line-height: 1.6;">
                Bonjour <strong style="color: #1E355E;">${data.contact_prenom} ${data.contact_nom}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; font-family: 'Manrope', Arial, sans-serif; font-size: 16px; color: #324C7A; line-height: 1.6;">
                Votre réservation a été confirmée avec succès ! 🎉
              </p>

              <!-- Reservation Details Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F1E6D8; border-radius: 12px; margin-bottom: 30px; overflow: hidden;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 16px 0; font-family: 'Fraunces', Georgia, serif; font-size: 20px; font-weight: 700; color: #1E355E; letter-spacing: -0.02em;">
                      📍 Détails de la réservation
                    </h2>
                    
                    <p style="margin: 0 0 8px 0; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; color: #324C7A;">
                      <strong style="color: #1E355E;">Parking :</strong> ${data.parking_nom}
                    </p>
                    <p style="margin: 0 0 16px 0; font-family: 'Manrope', Arial, sans-serif; font-size: 14px; color: #324C7A;">
                      ${data.parking_adresse}
                    </p>
                    
                    <p style="margin: 0 0 8px 0; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; color: #324C7A;">
                      <strong style="color: #1E355E;">Arrivée :</strong> ${dateDebut}
                    </p>
                    <p style="margin: 0 0 8px 0; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; color: #324C7A;">
                      <strong style="color: #1E355E;">Départ :</strong> ${dateFin}
                    </p>
                    <p style="margin: 0 0 16px 0; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; color: #324C7A;">
                      <strong style="color: #1E355E;">Durée :</strong> ${data.nombre_nuits} nuit${data.nombre_nuits > 1 ? "s" : ""}
                    </p>
                    
                    <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-size: 18px; color: #1E355E; font-weight: 600;">
                      <strong>Total payé :</strong> ${(data.montant_total_ht * 1.2).toFixed(2)} € TTC
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Validation Codes Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F1E6D8; border-radius: 12px; margin-bottom: 30px; overflow: hidden;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 16px 0; font-family: 'Fraunces', Georgia, serif; font-size: 20px; font-weight: 700; color: #1E355E; letter-spacing: -0.02em;">
                      🔑 Vos codes de validation
                    </h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden;">
                      ${vehiculesHTML}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Important Instructions Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1E355E 0%, #2E4A7C 100%); border-radius: 12px; margin-bottom: 30px; overflow: hidden;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 16px 0; font-family: 'Fraunces', Georgia, serif; font-size: 20px; font-weight: 700; color: white; letter-spacing: -0.02em;">
                      ⚠️ Instructions importantes
                    </h2>
                    
                    <p style="margin: 0 0 12px 0; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; color: rgba(255, 255, 255, 0.95); line-height: 1.6;">
                      <strong style="color: white;">À l'arrivée</strong> : Le chauffeur doit fournir le code au gardien du parking ainsi que la plaque d'immatriculation de son véhicule.
                    </p>
                    
                    <p style="margin: 0 0 12px 0; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; color: rgba(255, 255, 255, 0.95); line-height: 1.6;">
                      <strong style="color: white;">Au départ</strong> : Le chauffeur devra redonner le même code pour quitter le parking.
                    </p>
                    
                    <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-size: 15px; color: white; line-height: 1.6; font-weight: 600;">
                      ⚠️ Attention ! Un code = un véhicule.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Footer Note -->
              <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-size: 14px; color: #324C7A; line-height: 1.6; text-align: center;">
                Conservez cet email précieusement.<br>
                En cas de problème, contactez-nous avec votre numéro de réservation.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #F1E6D8; padding: 30px; text-align: center; border-top: 1px solid #e5d5c1;">
              <p style="margin: 0 0 8px 0; font-family: 'Fraunces', Georgia, serif; font-size: 18px; font-weight: 700; color: #1E355E;">
                LaRosa Parking
              </p>
              <p style="margin: 0; font-family: 'Manrope', Arial, sans-serif; font-size: 13px; color: #324C7A;">
                Parkings sécurisés pour camions de production
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

