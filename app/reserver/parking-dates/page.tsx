"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { StepsIndicator } from "@/components/reserver/steps-indicator";
import { parkingDatesSchema, type ParkingDatesFormData } from "@/lib/validations/reservation";
import { getReservationState, setReservationState } from "@/lib/store/reservation-store";
import { ArrowRight, ArrowLeft, MapPin, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { calculateNights, getTotalVehicules } from "@/lib/utils/reservation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Parking } from "@/types/database.types";

const steps = [
  { number: 1, title: "Contact", description: "Vos informations" },
  { number: 2, title: "Véhicules", description: "Nombre et type" },
  { number: 3, title: "Parking", description: "Lieu et dates" },
  { number: 4, title: "Récapitulatif", description: "Validation" },
];

export default function ReserverParkingDatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parkingIdParam = searchParams.get("parking");

  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);

  const savedState = getReservationState();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ParkingDatesFormData>({
    resolver: zodResolver(parkingDatesSchema),
    defaultValues: {
      parking_id: parkingIdParam || savedState.parking_id || "",
      date_debut: savedState.date_debut || "",
      date_fin: savedState.date_fin || "",
    },
  });

  const parkingId = watch("parking_id");
  const dateDebut = watch("date_debut");
  const dateFin = watch("date_fin");

  const nombreNuits = dateDebut && dateFin ? calculateNights(dateDebut, dateFin) : 0;
  const selectedParking = parkings.find((p) => p.id === parkingId);

  const totalVehicules = getTotalVehicules(
    savedState.nombre_vehicules_lourds || 0,
    savedState.nombre_vehicules_legers || 0
  );

  // Charger les parkings
  useEffect(() => {
    async function loadParkings() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("parkings")
        .select("*")
        .order("nom");

      if (error) {
        console.error("Erreur lors du chargement des parkings:", error);
      } else {
        setParkings(data || []);
      }
      setLoading(false);
    }

    loadParkings();
  }, []);

  const onSubmit = async (data: ParkingDatesFormData) => {
    // Sauvegarder dans le store
    setReservationState(data);

    // Passer à l'étape suivante
    router.push("/reserver/recapitulatif");
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    if (parkingIdParam) params.set("parking", parkingIdParam);
    router.push(`/reserver/vehicules?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-text-secondary">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Indicateur de progression */}
        <StepsIndicator currentStep={3} steps={steps} />

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle>Parking et dates</CardTitle>
            <CardDescription>
              Choisissez le parking et les dates de votre réservation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Sélection du parking */}
              <div className="space-y-4">
                <Label>
                  Choisissez votre parking <span className="text-red-500">*</span>
                </Label>

                <Controller
                  name="parking_id"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 gap-4">
                      {parkings.map((parking) => (
                        <button
                          key={parking.id}
                          type="button"
                          onClick={() => setValue("parking_id", parking.id)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            field.value === parking.id
                              ? "border-blue-primary bg-blue-primary/5"
                              : "border-border hover:border-blue-primary/50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-blue-primary flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-5 h-5 text-background-main" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{parking.nom}</h3>
                                <p className="text-sm text-text-secondary">
                                  {parking.adresse}, {parking.ville}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-blue-primary">
                                {parking.places_disponibles}/{parking.capacite_totale}
                              </p>
                              <p className="text-xs text-text-secondary">
                                places dispo
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                />
                {errors.parking_id && (
                  <p className="text-sm text-red-500">
                    {errors.parking_id.message}
                  </p>
                )}
              </div>

              <div className="border-t" />

              {/* Sélection des dates */}
              <div className="space-y-4">
                <Label>
                  Dates de stationnement <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-text-secondary">
                  Sélectionnez votre date d'arrivée puis votre date de départ
                </p>

                <div className="flex justify-center">
                  <Controller
                    name="date_debut"
                    control={control}
                    render={({ field }) => (
                      <Calendar
                        mode="range"
                        selected={{
                          from: dateDebut ? new Date(dateDebut) : undefined,
                          to: dateFin ? new Date(dateFin) : undefined,
                        }}
                        onSelect={(range) => {
                          if (range?.from) {
                            setValue("date_debut", format(range.from, "yyyy-MM-dd"));
                          }
                          if (range?.to) {
                            setValue("date_fin", format(range.to, "yyyy-MM-dd"));
                          }
                        }}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        locale={fr}
                        className="rounded-md border"
                        numberOfMonths={2}
                      />
                    )}
                  />
                </div>

                {(errors.date_debut || errors.date_fin) && (
                  <p className="text-sm text-red-500 text-center">
                    {errors.date_debut?.message || errors.date_fin?.message}
                  </p>
                )}

                {/* Récapitulatif des dates */}
                {dateDebut && dateFin && nombreNuits > 0 && (
                  <Card className="bg-blue-primary/5 border-blue-primary/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="w-4 h-4 text-blue-primary" />
                        <span className="font-semibold">Durée du stationnement</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-primary">
                        {nombreNuits} {nombreNuits === 1 ? "nuit" : "nuits"}
                      </p>
                      <p className="text-sm text-text-secondary mt-1">
                        Du {format(new Date(dateDebut), "dd MMMM yyyy", { locale: fr })} au{" "}
                        {format(new Date(dateFin), "dd MMMM yyyy", { locale: fr })}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Vérification disponibilité */}
              {selectedParking && totalVehicules > selectedParking.places_disponibles && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-900">
                          Places insuffisantes
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                          Ce parking dispose de {selectedParking.places_disponibles} places
                          disponibles, mais vous souhaitez réserver {totalVehicules} véhicules.
                          Veuillez choisir un autre parking ou réduire le nombre de véhicules.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Boutons de navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>

                <Button
                  type="submit"
                  disabled={
                    !parkingId ||
                    !dateDebut ||
                    !dateFin ||
                    nombreNuits === 0 ||
                    (selectedParking && totalVehicules > selectedParking.places_disponibles)
                  }
                >
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

