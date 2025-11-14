import { z } from "zod";

// Étape 1 : Informations de contact
export const contactSchema = z.object({
  contact_prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  contact_nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  contact_email: z.string().email("Email invalide"),
  contact_telephone: z
    .string()
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      "Numéro de téléphone français invalide"
    ),
  contact_adresse: z.string().min(5, "L'adresse est requise"),
  contact_societe: z.string().min(2, "Le nom de la société est requis"),
  reference_projet: z.string().optional(),
  facturation_identique: z.boolean().default(true),
  // Champs de facturation (conditionnels)
  facturation_societe: z.string().optional(),
  facturation_adresse: z.string().optional(),
  facturation_tva: z.string().optional(),
  facturation_reference: z.string().optional(),
}).refine(
  (data) => {
    // Si facturation_identique = false, les champs de facturation sont requis
    if (!data.facturation_identique) {
      return (
        data.facturation_societe &&
        data.facturation_societe.length >= 2 &&
        data.facturation_adresse &&
        data.facturation_adresse.length >= 5
      );
    }
    return true;
  },
  {
    message: "Les informations de facturation sont requises",
    path: ["facturation_societe"],
  }
);

// Étape 2 : Choix des véhicules
export const vehiculesSchema = z.object({
  nombre_vehicules_lourds: z.number().min(0, "Le nombre doit être positif"),
  nombre_vehicules_legers: z.number().min(0, "Le nombre doit être positif"),
}).refine(
  (data) => data.nombre_vehicules_lourds + data.nombre_vehicules_legers > 0,
  {
    message: "Vous devez réserver au moins un véhicule",
    path: ["nombre_vehicules_lourds"],
  }
);

// Étape 3 : Parking et dates
export const parkingDatesSchema = z.object({
  parking_id: z.string().uuid("Parking invalide"),
  date_debut: z.string().refine((date) => {
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  }, "La date d'arrivée doit être aujourd'hui ou dans le futur"),
  date_fin: z.string(),
}).refine(
  (data) => {
    const debut = new Date(data.date_debut);
    const fin = new Date(data.date_fin);
    return fin > debut;
  },
  {
    message: "La date de départ doit être après la date d'arrivée",
    path: ["date_fin"],
  }
);

// Schema complet pour la réservation
export const reservationCompleteSchema = contactSchema
  .merge(vehiculesSchema)
  .merge(parkingDatesSchema);

export type ContactFormData = z.infer<typeof contactSchema>;
export type VehiculesFormData = z.infer<typeof vehiculesSchema>;
export type ParkingDatesFormData = z.infer<typeof parkingDatesSchema>;
export type ReservationCompleteData = z.infer<typeof reservationCompleteSchema>;

