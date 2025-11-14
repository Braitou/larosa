import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { MapPin, ParkingSquare, Clock, Euro, Truck, Car, Info, Shield, CheckCircle2 } from "lucide-react";

export default async function ParkingsPage() {
  const supabase = await createClient();

  // Récupérer tous les parkings
  const { data: parkings, error } = await supabase
    .from("parkings")
    .select("*")
    .order("nom");

  if (error) {
    console.error("Erreur lors de la récupération des parkings:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl mb-4">Nos Parkings</h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Choisissez le parking le plus proche de votre lieu de tournage
            </p>
          </div>

          {/* Liste des parkings */}
          <div className="space-y-6">
            {parkings && parkings.length > 0 ? (
              parkings.map((parking) => (
                <Card key={parking.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-primary flex items-center justify-center flex-shrink-0">
                          <ParkingSquare className="w-6 h-6 text-background-main" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl mb-2">
                            {parking.nom}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-text-secondary">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {parking.adresse}, {parking.ville}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          parking.places_disponibles > 50
                            ? "default"
                            : parking.places_disponibles > 20
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-sm"
                      >
                        {parking.places_disponibles}/{parking.capacite_totale}{" "}
                        places
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Tarifs */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Euro className="w-4 h-4" />
                          Tarifs (HT/nuit)
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-text-secondary flex items-center gap-2">
                              <Truck className="w-4 h-4" />
                              Véhicule lourd
                            </span>
                            <span className="font-semibold">
                              {parking.tarif_vehicule_lourd}€
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-text-secondary flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              Véhicule léger
                            </span>
                            <span className="font-semibold">
                              {parking.tarif_vehicule_leger}€
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Disponibilité */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Disponibilité
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-text-secondary">
                              Ouverture
                            </span>
                            <span className="font-semibold">24h/24 - 7j/7</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-secondary">
                              Surveillance
                            </span>
                            <span className="font-semibold flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Vidéosurveillance
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bouton de réservation */}
                    <Button asChild className="w-full" size="lg">
                      <Link href={`/reserver?parking=${parking.id}`}>
                        Réserver ce parking
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-text-secondary">
                    Aucun parking disponible pour le moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info supplémentaire */}
          <Card className="mt-8 bg-blue-primary/5 border-blue-primary/20">
            <CardContent className="pt-6">
              <h3 className="font-bold text-blue-primary mb-3 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Informations importantes
              </h3>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-primary flex-shrink-0 mt-0.5" />
                  <span>Tous nos parkings sont sécurisés avec vidéosurveillance 24h/24</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-primary flex-shrink-0 mt-0.5" />
                  <span>Les tarifs sont indiqués en Hors Taxes (HT) par nuit et par véhicule</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-primary flex-shrink-0 mt-0.5" />
                  <span>Vous recevrez un code de validation par véhicule après paiement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-primary flex-shrink-0 mt-0.5" />
                  <span>Chaque chauffeur devra présenter son code au gardien à l'arrivée</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

