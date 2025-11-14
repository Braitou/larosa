// Store simple pour gérer l'état du formulaire de réservation
// On utilise localStorage pour persister entre les étapes

export interface ReservationState {
  // Étape 1 : Contact
  contact_prenom: string;
  contact_nom: string;
  contact_email: string;
  contact_telephone: string;
  contact_adresse: string;
  contact_societe: string;
  reference_projet?: string;
  facturation_identique: boolean;
  facturation_societe?: string;
  facturation_adresse?: string;
  facturation_tva?: string;
  facturation_reference?: string;
  
  // Étape 2 : Véhicules
  nombre_vehicules_lourds: number;
  nombre_vehicules_legers: number;
  
  // Étape 3 : Parking et dates
  parking_id?: string;
  date_debut?: string;
  date_fin?: string;
}

const STORAGE_KEY = "larosa_reservation";

export function getReservationState(): Partial<ReservationState> {
  if (typeof window === "undefined") return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function setReservationState(state: Partial<ReservationState>) {
  if (typeof window === "undefined") return;
  
  try {
    const current = getReservationState();
    const updated = { ...current, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la réservation:", error);
  }
}

export function clearReservationState() {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erreur lors de la suppression de la réservation:", error);
  }
}

