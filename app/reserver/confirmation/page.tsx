"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { CheckCircle2, Truck, Car, MapPin, Calendar as CalendarIcon, Mail, AlertCircle, Home } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { clearReservationState } from "@/lib/store/reservation-store";
import { formatEuros, formatDateFr } from "@/lib/utils/reservation";
import type { Reservation, Vehicle, Parking } from "@/types/database.types";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [parking, setParking] = useState<Parking | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Session de paiement introuvable");
      setLoading(false);
      return;
    }

    async function loadConfirmation() {
      try {
        const supabase = createClient();

        // Récupérer la session Stripe
        const response = await fetch(`/api/checkout/session?session_id=${sessionId}`);
        const sessionData = await response.json();

        if (sessionData.error || !sessionData.reservation_id) {
          setError("Impossible de récupérer les détails de la réservation");
          setLoading(false);
          return;
        }

        // Récupérer la réservation
        const { data: resData, error: resError } = await supabase
          .from("reservations")
          .select("*")
          .eq("id", sessionData.reservation_id)
          .single();

        if (resError || !resData) {
          setError("Réservation introuvable");
          setLoading(false);
          return;
        }

        setReservation(resData);

        // Récupérer les véhicules avec leurs codes
        const { data: vehiclesData } = await supabase
          .from("vehicles")
          .select("*")
          .eq("reservation_id", resData.id)
          .order("created_at");

        setVehicles(vehiclesData || []);

        // Récupérer le parking
        const { data: parkingData } = await supabase
          .from("parkings")
          .select("*")
          .eq("id", resData.parking_id)
          .single();

        setParking(parkingData);

        // Envoyer l'email de confirmation (APRÈS le paiement réussi)
        try {
          await fetch("/api/send-confirmation-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reservation_id: resData.id }),
          });
          console.log("✅ Email de confirmation envoyé");
        } catch (emailError) {
          console.error("❌ Erreur envoi email:", emailError);
          // On ne bloque pas l'affichage si l'email échoue
        }

        // Nettoyer le localStorage
        clearReservationState();

        setLoading(false);
      } catch (err) {
        console.error("Error loading confirmation:", err);
        setError("Une erreur est survenue");
        setLoading(false);
      }
    }

    loadConfirmation();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg text-text-secondary">Chargement de votre confirmation...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-red-900 mb-2">Erreur</h3>
                  <p className="text-red-700">{error}</p>
                  <Button
                    onClick={() => router.push("/")}
                    className="mt-4"
                    variant="outline"
                  >
                    Retour à l'accueil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const vehiculesLourds = vehicles.filter((v) => v.type === "lourd");
  const vehiculesLegers = vehicles.filter((v) => v.type === "leger");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* En-tête succès */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold">Réservation confirmée !</h1>
            <p className="text-xl text-text-secondary">
              Votre paiement a été effectué avec succès
            </p>
          </div>

          {/* Email envoyé */}
          <Card className="bg-blue-primary/5 border-blue-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-primary mb-1">
                    Email de confirmation envoyé
                  </p>
                  <p className="text-sm text-text-secondary">
                    Un email avec tous les détails de votre réservation et vos codes de
                    validation a été envoyé à <strong>{reservation.contact_email}</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Codes de validation */}
          <Card>
            <CardHeader>
              <CardTitle>Vos codes de validation</CardTitle>
              <p className="text-sm text-text-secondary">
                Chaque chauffeur doit présenter son code au gardien à l'arrivée
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {vehiculesLourds.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Véhicules lourds
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vehiculesLourds.map((v, index) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between p-3 bg-background-card rounded-lg"
                      >
                        <span className="text-sm text-text-secondary">
                          Véhicule lourd #{index + 1}
                        </span>
                        <Badge className="text-lg font-mono px-3 py-1">
                          {v.code_confirmation}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {vehiculesLegers.length > 0 && (
                <div className={vehiculesLourds.length > 0 ? "pt-4 border-t" : ""}>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Véhicules légers
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vehiculesLegers.map((v, index) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between p-3 bg-background-card rounded-lg"
                      >
                        <span className="text-sm text-text-secondary">
                          Véhicule léger #{index + 1}
                        </span>
                        <Badge className="text-lg font-mono px-3 py-1">
                          {v.code_confirmation}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations parking */}
          {parking && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Parking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold text-lg">{parking.nom}</p>
                  <p className="text-text-secondary">
                    {parking.adresse}, {parking.ville}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary pt-3 border-t">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    Du {formatDateFr(reservation.date_debut)} au{" "}
                    {formatDateFr(reservation.date_fin)}
                  </span>
                  <Badge variant="outline">{reservation.nombre_nuits} nuits</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-background-card">
            <CardHeader>
              <CardTitle>Instructions importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-primary flex-shrink-0 mt-0.5" />
                <span>
                  Distribuez les codes aux chauffeurs concernés avant leur arrivée au parking
                </span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-primary flex-shrink-0 mt-0.5" />
                <span>
                  À l'arrivée, le chauffeur donne son code à 6 chiffres au gardien
                </span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-primary flex-shrink-0 mt-0.5" />
                <span>
                  Le gardien valide le code et autorise l'accès au parking
                </span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-primary flex-shrink-0 mt-0.5" />
                <span>
                  Au départ, le gardien valide la sortie du véhicule
                </span>
              </p>
            </CardContent>
          </Card>

          {/* Montant */}
          <Card className="bg-blue-primary text-background-main">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Montant payé</p>
                  <p className="text-3xl font-bold">
                    {formatEuros(reservation.montant_total_ht)}
                  </p>
                  <p className="text-sm opacity-75">HT</p>
                </div>
                <Badge variant="secondary" className="bg-green-500 text-white">
                  Payé
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Bouton retour */}
          <div className="flex justify-center pt-4">
            <Button onClick={() => router.push("/")} size="lg">
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


