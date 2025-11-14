"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepsIndicator } from "@/components/reserver/steps-indicator";
import { getReservationState } from "@/lib/store/reservation-store";
import { ArrowLeft, User, Truck, Car, MapPin, Calendar as CalendarIcon, FileText, CreditCard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { calculateNights, calculateTotalHT, formatEuros, formatDateFr } from "@/lib/utils/reservation";
import type { Parking } from "@/types/database.types";

const steps = [
  { number: 1, title: "Contact", description: "Vos informations" },
  { number: 2, title: "Véhicules", description: "Nombre et type" },
  { number: 3, title: "Parking", description: "Lieu et dates" },
  { number: 4, title: "Récapitulatif", description: "Validation" },
];

export default function ReserverRecapitulatifPage() {
  const router = useRouter();
  const [parking, setParking] = useState<Parking | null>(null);
  const [loading, setLoading] = useState(true);
  const [acceptCGV, setAcceptCGV] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const reservation = getReservationState();

  // Vérifier que toutes les étapes sont complètes
  useEffect(() => {
    if (
      !reservation.contact_email ||
      !reservation.parking_id ||
      !reservation.date_debut ||
      !reservation.date_fin ||
      (reservation.nombre_vehicules_lourds === 0 && reservation.nombre_vehicules_legers === 0)
    ) {
      // Manque des informations, retour à l'étape 1
      router.push("/reserver");
    }
  }, [reservation, router]);

  // Charger le parking
  useEffect(() => {
    async function loadParking() {
      if (!reservation.parking_id) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("parkings")
        .select("*")
        .eq("id", reservation.parking_id)
        .single();

      if (error) {
        console.error("Erreur lors du chargement du parking:", error);
      } else {
        setParking(data);
      }
      setLoading(false);
    }

    loadParking();
  }, [reservation.parking_id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-text-secondary">Chargement...</p>
        </div>
      </div>
    );
  }

  const nombreNuits = calculateNights(reservation.date_debut!, reservation.date_fin!);
  const totalVehicules = (reservation.nombre_vehicules_lourds || 0) + (reservation.nombre_vehicules_legers || 0);
  const montantTotal = calculateTotalHT(
    reservation.nombre_vehicules_lourds || 0,
    reservation.nombre_vehicules_legers || 0,
    nombreNuits,
    parking?.tarif_vehicule_lourd || 35,
    parking?.tarif_vehicule_leger || 30
  );

  const handlePaiement = async () => {
    if (!acceptCGV) return;

    setIsProcessing(true);

    try {
      // Créer une session Stripe Checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservation),
      });

      const data = await response.json();

      if (data.error) {
        alert("Erreur : " + data.error);
        setIsProcessing(false);
        return;
      }

      // Rediriger vers l'URL Stripe Checkout (méthode moderne)
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur : URL de paiement introuvable");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Une erreur est survenue");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Indicateur de progression */}
        <StepsIndicator currentStep={4} steps={steps} />

        {/* Titre */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Récapitulatif de votre réservation</h1>
          <p className="text-text-secondary">
            Vérifiez les informations avant de procéder au paiement
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Détails */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Nom complet</span>
                  <span className="font-semibold">
                    {reservation.contact_prenom} {reservation.contact_nom}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Email</span>
                  <span className="font-semibold">{reservation.contact_email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Téléphone</span>
                  <span className="font-semibold">{reservation.contact_telephone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Adresse</span>
                  <span className="font-semibold text-right max-w-xs whitespace-pre-line">
                    {reservation.contact_adresse}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Société</span>
                  <span className="font-semibold">{reservation.contact_societe}</span>
                </div>
                {reservation.reference_projet && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Référence projet</span>
                    <span className="font-semibold">{reservation.reference_projet}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Facturation */}
            {!reservation.facturation_identique && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Facturation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Société</span>
                    <span className="font-semibold">{reservation.facturation_societe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Adresse</span>
                    <span className="font-semibold text-right max-w-xs whitespace-pre-line">
                      {reservation.facturation_adresse}
                    </span>
                  </div>
                  {reservation.facturation_tva && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">N° TVA</span>
                      <span className="font-semibold">{reservation.facturation_tva}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Parking */}
            {parking && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Parking
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-lg">{parking.nom}</p>
                    <p className="text-text-secondary">
                      {parking.adresse}, {parking.ville}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Dates de stationnement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Arrivée</span>
                  <span className="font-semibold">
                    {formatDateFr(reservation.date_debut!)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Départ</span>
                  <span className="font-semibold">
                    {formatDateFr(reservation.date_fin!)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Nombre de nuits</span>
                  <span className="font-bold text-blue-primary">{nombreNuits}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite - Tarifs */}
          <div className="space-y-6">
            {/* Véhicules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Véhicules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {reservation.nombre_vehicules_lourds! > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-text-secondary" />
                      <span>{reservation.nombre_vehicules_lourds} lourd(s)</span>
                    </div>
                  </div>
                )}
                {reservation.nombre_vehicules_legers! > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-text-secondary" />
                      <span>{reservation.nombre_vehicules_legers} léger(s)</span>
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <div className="flex justify-between font-semibold">
                    <span>Total véhicules</span>
                    <span>{totalVehicules}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détail des tarifs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Détail des tarifs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Véhicules lourds */}
                {reservation.nombre_vehicules_lourds! > 0 && (
                  <div className="space-y-2 pb-4 border-b">
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <Truck className="w-4 h-4 text-blue-primary" />
                      Véhicules lourds
                    </h4>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Nombre de véhicules</span>
                        <span className="font-medium">{reservation.nombre_vehicules_lourds}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Nombre de nuits</span>
                        <span className="font-medium">{nombreNuits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Prix par véhicule / nuit</span>
                        <span className="font-medium">{parking?.tarif_vehicule_lourd}€</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-semibold">Sous-total</span>
                        <span className="font-bold text-blue-primary">
                          {formatEuros((reservation.nombre_vehicules_lourds || 0) * nombreNuits * (parking?.tarif_vehicule_lourd || 35))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Véhicules légers */}
                {reservation.nombre_vehicules_legers! > 0 && (
                  <div className="space-y-2 pb-4 border-b">
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <Car className="w-4 h-4 text-blue-primary" />
                      Véhicules légers
                    </h4>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Nombre de véhicules</span>
                        <span className="font-medium">{reservation.nombre_vehicules_legers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Nombre de nuits</span>
                        <span className="font-medium">{nombreNuits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Prix par véhicule / nuit</span>
                        <span className="font-medium">{parking?.tarif_vehicule_leger}€</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-semibold">Sous-total</span>
                        <span className="font-bold text-blue-primary">
                          {formatEuros((reservation.nombre_vehicules_legers || 0) * nombreNuits * (parking?.tarif_vehicule_leger || 30))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span>Total HT</span>
                  <span className="text-blue-primary">
                    {formatEuros(montantTotal)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* CGV */}
            <Card className="bg-background-card">
              <CardContent className="pt-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptCGV}
                    onChange={(e) => setAcceptCGV(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-border text-blue-primary focus:ring-blue-primary"
                  />
                  <span className="text-sm text-text-secondary">
                    J'accepte les{" "}
                    <a href="/cgv" className="text-blue-primary hover:underline">
                      conditions générales de vente
                    </a>
                  </span>
                </label>
              </CardContent>
            </Card>

            {/* Bouton de paiement */}
            <Button
              onClick={handlePaiement}
              disabled={!acceptCGV || isProcessing}
              size="lg"
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Redirection vers le paiement...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payer {formatEuros(montantTotal)}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Bouton retour */}
        <div className="flex justify-center pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/reserver/parking-dates")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Modifier ma réservation
          </Button>
        </div>
      </div>
    </div>
  );
}

