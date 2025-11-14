import { differenceInDays } from "date-fns";

/**
 * Calcule le nombre de nuits entre deux dates
 * Ex: 14/11 au 17/11 = 3 nuits
 */
export function calculateNights(dateDebut: string, dateFin: string): number {
  const debut = new Date(dateDebut);
  const fin = new Date(dateFin);
  return differenceInDays(fin, debut);
}

/**
 * Calcule le montant total HT d'une réservation
 */
export function calculateTotalHT(
  nombreVehiculesLourds: number,
  nombreVehiculesLegers: number,
  nombreNuits: number,
  tarifLourd: number = 35,
  tarifLeger: number = 30
): number {
  const totalLourds = nombreVehiculesLourds * nombreNuits * tarifLourd;
  const totalLegers = nombreVehiculesLegers * nombreNuits * tarifLeger;
  return totalLourds + totalLegers;
}

/**
 * Génère un code de confirmation unique à 6 chiffres
 * Note: En production, on utilisera la fonction SQL generate_vehicle_code()
 */
export function generateVehicleCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Formate un numéro de téléphone français
 */
export function formatPhoneNumber(phone: string): string {
  // Enlever tous les espaces, tirets, points
  const cleaned = phone.replace(/[\s.-]/g, "");
  
  // Formater en 06 12 34 56 78
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(?=\d)/g, "$1 ");
  }
  
  return phone;
}

/**
 * Calcule le nombre total de véhicules
 */
export function getTotalVehicules(lourds: number, legers: number): number {
  return lourds + legers;
}

/**
 * Vérifie si un parking a suffisamment de places disponibles
 */
export function hasEnoughSpace(
  placesDisponibles: number,
  nombreVehicules: number
): boolean {
  return placesDisponibles >= nombreVehicules;
}

/**
 * Formate un montant en euros
 */
export function formatEuros(montant: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(montant);
}

/**
 * Formate une date au format français
 */
export function formatDateFr(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}



