"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StepsIndicator } from "@/components/reserver/steps-indicator";
import { vehiculesSchema, type VehiculesFormData } from "@/lib/validations/reservation";
import { getReservationState, setReservationState } from "@/lib/store/reservation-store";
import { ArrowRight, ArrowLeft, Truck, Car, Plus, Minus } from "lucide-react";
import { getTotalVehicules } from "@/lib/utils/reservation";

const steps = [
  { number: 1, title: "Contact", description: "Vos informations" },
  { number: 2, title: "Véhicules", description: "Nombre et type" },
  { number: 3, title: "Parking", description: "Lieu et dates" },
  { number: 4, title: "Récapitulatif", description: "Validation" },
];

export default function ReserverVehiculesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parkingId = searchParams.get("parking");

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VehiculesFormData>({
    resolver: zodResolver(vehiculesSchema),
    defaultValues: {
      nombre_vehicules_lourds: 0,
      nombre_vehicules_legers: 0,
      ...getReservationState(),
    },
  });

  const nombreLourds = watch("nombre_vehicules_lourds");
  const nombreLegers = watch("nombre_vehicules_legers");
  const totalVehicules = getTotalVehicules(nombreLourds, nombreLegers);

  const onSubmit = async (data: VehiculesFormData) => {
    // Sauvegarder dans le store
    setReservationState(data);

    // Passer à l'étape suivante
    const params = new URLSearchParams();
    if (parkingId) params.set("parking", parkingId);
    
    router.push(`/reserver/parking-dates?${params.toString()}`);
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    if (parkingId) params.set("parking", parkingId);
    router.push(`/reserver?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Indicateur de progression */}
        <StepsIndicator currentStep={2} steps={steps} />

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle>Choix des véhicules</CardTitle>
            <CardDescription>
              Combien de véhicules souhaitez-vous garer ? Vous pouvez réserver
              des véhicules lourds et/ou légers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Véhicules lourds */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-primary/10 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-6 h-6 text-blue-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Véhicules lourds</h3>
                      <p className="text-sm text-text-secondary">
                        Camions de plus de 3,5 tonnes
                      </p>
                      <p className="text-lg font-bold text-blue-primary mt-2">
                        35€ HT / nuit
                      </p>
                    </div>
                  </div>

                  <Controller
                    name="nombre_vehicules_lourds"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newValue = Math.max(0, field.value - 1);
                            setValue("nombre_vehicules_lourds", newValue);
                          }}
                          disabled={field.value === 0}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>

                        <div className="w-16 text-center">
                          <span className="text-3xl font-bold text-blue-primary">
                            {field.value}
                          </span>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newValue = field.value + 1;
                            setValue("nombre_vehicules_lourds", newValue);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  />
                </div>
              </div>

              <div className="border-t" />

              {/* Véhicules légers */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-primary/10 flex items-center justify-center flex-shrink-0">
                      <Car className="w-6 h-6 text-blue-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Véhicules légers</h3>
                      <p className="text-sm text-text-secondary">
                        Utilitaires de moins de 3,5 tonnes
                      </p>
                      <p className="text-lg font-bold text-blue-primary mt-2">
                        30€ HT / nuit
                      </p>
                    </div>
                  </div>

                  <Controller
                    name="nombre_vehicules_legers"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newValue = Math.max(0, field.value - 1);
                            setValue("nombre_vehicules_legers", newValue);
                          }}
                          disabled={field.value === 0}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>

                        <div className="w-16 text-center">
                          <span className="text-3xl font-bold text-blue-primary">
                            {field.value}
                          </span>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const newValue = field.value + 1;
                            setValue("nombre_vehicules_legers", newValue);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Total */}
              {totalVehicules > 0 && (
                <Card className="bg-blue-primary/5 border-blue-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        Total de véhicules
                      </span>
                      <span className="text-2xl font-bold text-blue-primary">
                        {totalVehicules}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Erreur de validation */}
              {errors.nombre_vehicules_lourds && (
                <p className="text-sm text-red-500 text-center">
                  {errors.nombre_vehicules_lourds.message}
                </p>
              )}

              {/* Boutons de navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>

                <Button type="submit" disabled={totalVehicules === 0}>
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



