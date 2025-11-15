// Types de la base de données LaRosa MVP
// Structure adaptée pour réservations anonymes

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: "admin";
          nom: string;
          prenom: string;
          telephone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: "admin";
          nom: string;
          prenom: string;
          telephone: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "admin";
          nom?: string;
          prenom?: string;
          telephone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      parkings: {
        Row: {
          id: string;
          nom: string;
          adresse: string;
          ville: string;
          capacite_totale: number;
          places_disponibles: number;
          tarif_vehicule_lourd: number;
          tarif_vehicule_leger: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nom: string;
          adresse: string;
          ville: string;
          capacite_totale: number;
          places_disponibles: number;
          tarif_vehicule_lourd: number;
          tarif_vehicule_leger: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nom?: string;
          adresse?: string;
          ville?: string;
          capacite_totale?: number;
          places_disponibles?: number;
          tarif_vehicule_lourd?: number;
          tarif_vehicule_leger?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          parking_id: string;
          user_id: string | null;
          // Contact
          contact_nom: string;
          contact_prenom: string;
          contact_email: string;
          contact_telephone: string;
          contact_adresse: string;
          contact_societe: string;
          reference_projet: string | null;
          // Facturation
          facturation_identique: boolean;
          facturation_societe: string | null;
          facturation_adresse: string | null;
          facturation_tva: string | null;
          facturation_reference: string | null;
          // Dates & véhicules
          date_debut: string;
          date_fin: string;
          nombre_nuits: number;
          nombre_vehicules_lourds: number;
          nombre_vehicules_legers: number;
          montant_total_ht: number;
          // Paiement
          stripe_payment_intent_id: string | null;
          statut: "en_attente" | "confirmee" | "annulee";
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parking_id: string;
          user_id?: string | null;
          contact_nom: string;
          contact_prenom: string;
          contact_email: string;
          contact_telephone: string;
          contact_adresse: string;
          contact_societe: string;
          reference_projet?: string | null;
          facturation_identique?: boolean;
          facturation_societe?: string | null;
          facturation_adresse?: string | null;
          facturation_tva?: string | null;
          facturation_reference?: string | null;
          date_debut: string;
          date_fin: string;
          nombre_nuits: number;
          nombre_vehicules_lourds: number;
          nombre_vehicules_legers: number;
          montant_total_ht: number;
          stripe_payment_intent_id?: string | null;
          statut?: "en_attente" | "confirmee" | "annulee";
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          parking_id?: string;
          user_id?: string | null;
          contact_nom?: string;
          contact_prenom?: string;
          contact_email?: string;
          contact_telephone?: string;
          contact_adresse?: string;
          contact_societe?: string;
          reference_projet?: string | null;
          facturation_identique?: boolean;
          facturation_societe?: string | null;
          facturation_adresse?: string | null;
          facturation_tva?: string | null;
          facturation_reference?: string | null;
          date_debut?: string;
          date_fin?: string;
          nombre_nuits?: number;
          nombre_vehicules_lourds?: number;
          nombre_vehicules_legers?: number;
          montant_total_ht?: number;
          stripe_payment_intent_id?: string | null;
          statut?: "en_attente" | "confirmee" | "annulee";
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          reservation_id: string;
          type: "lourd" | "leger";
          code_confirmation: string;
          plaque_immatriculation: string | null;
          statut: "en_attente" | "arrive" | "parti";
          presence_status: "in" | "out";
          checked_in_at: string | null;
          checked_out_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          reservation_id: string;
          type: "lourd" | "leger";
          code_confirmation: string;
          plaque_immatriculation?: string | null;
          statut?: "en_attente" | "arrive" | "parti";
          presence_status?: "in" | "out";
          checked_in_at?: string | null;
          checked_out_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          reservation_id?: string;
          type?: "lourd" | "leger";
          code_confirmation?: string;
          plaque_immatriculation?: string | null;
          statut?: "en_attente" | "arrive" | "parti";
          presence_status?: "in" | "out";
          checked_in_at?: string | null;
          checked_out_at?: string | null;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          reservation_id: string;
          montant_total_ht: number;
          stripe_payment_intent_id: string;
          statut: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reservation_id: string;
          montant_total_ht: number;
          stripe_payment_intent_id: string;
          statut: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          reservation_id?: string;
          montant_total_ht?: number;
          stripe_payment_intent_id?: string;
          statut?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Types utilitaires
export type Parking = Database["public"]["Tables"]["parkings"]["Row"];
export type Reservation = Database["public"]["Tables"]["reservations"]["Row"];
export type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];



