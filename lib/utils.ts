import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate une plaque d'immatriculation française au format AA-123-BB
 * @param plaque - Plaque au format AA123BB ou AA-123-BB
 * @returns Plaque formatée AA-123-BB
 */
export function formatPlaque(plaque: string | null | undefined): string {
  if (!plaque) return "Inconnue";
  
  // Retirer tous les tirets et espaces existants
  const cleaned = plaque.replace(/[-\s]/g, "").toUpperCase();
  
  // Format français : 2 lettres, 3 chiffres, 2 lettres
  if (cleaned.length >= 7) {
    const letters1 = cleaned.slice(0, 2);
    const numbers = cleaned.slice(2, 5);
    const letters2 = cleaned.slice(5, 7);
    return `${letters1}-${numbers}-${letters2}`;
  }
  
  // Si le format n'est pas valide, retourner tel quel
  return cleaned;
}

/**
 * Formate une plaque pendant la saisie (auto-formatage)
 * @param value - Valeur saisie
 * @returns Valeur formatée avec tirets automatiques
 */
export function formatPlaqueInput(value: string): string {
  // Retirer tous les caractères non alphanumériques
  const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  
  // Limiter à 7 caractères (format français)
  const limited = cleaned.slice(0, 7);
  
  // Ajouter les tirets automatiquement
  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 5) {
    return `${limited.slice(0, 2)}-${limited.slice(2)}`;
  } else {
    return `${limited.slice(0, 2)}-${limited.slice(2, 5)}-${limited.slice(5)}`;
  }
}

/**
 * Formate un numéro de téléphone français avec des espaces
 * @param phone - Numéro au format 0634601200 ou 06 34 60 12 00
 * @returns Numéro formaté 06 34 60 12 00
 */
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  
  // Retirer tous les espaces, tirets, points existants
  const cleaned = phone.replace(/[\s\-\.]/g, "");
  
  // Format français : 10 chiffres (06 34 60 12 00)
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
  }
  
  // Si le format n'est pas valide, retourner tel quel
  return phone;
}





