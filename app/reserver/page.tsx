"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StepsIndicator } from "@/components/reserver/steps-indicator";
import { contactSchema, type ContactFormData } from "@/lib/validations/reservation";
import { getReservationState, setReservationState } from "@/lib/store/reservation-store";
import { useState } from "react";
import { ArrowRight, User } from "lucide-react";

const steps = [
  { number: 1, title: "Contact", description: "Vos informations" },
  { number: 2, title: "Véhicules", description: "Nombre et type" },
  { number: 3, title: "Parking", description: "Lieu et dates" },
  { number: 4, title: "Récapitulatif", description: "Validation" },
];

export default function ReserverContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parkingId = searchParams.get("parking");

  const [showFacturation, setShowFacturation] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      facturation_identique: true,
      ...getReservationState(),
    },
  });

  // Watch facturation_identique pour afficher/masquer les champs
  const facturationIdentique = watch("facturation_identique");

  useEffect(() => {
    setShowFacturation(!facturationIdentique);
  }, [facturationIdentique]);

  const onSubmit = async (data: ContactFormData) => {
    // Sauvegarder dans le store
    setReservationState(data);

    // Passer à l'étape suivante
    const params = new URLSearchParams();
    if (parkingId) params.set("parking", parkingId);
    
    router.push(`/reserver/vehicules?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Indicateur de progression */}
        <StepsIndicator currentStep={1} steps={steps} />

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations de contact
            </CardTitle>
            <CardDescription>
              Qui effectue la réservation ? Ces informations serviront pour la
              confirmation et la facturation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Contact</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_prenom">
                      Prénom <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contact_prenom"
                      {...register("contact_prenom")}
                      placeholder="Jean"
                    />
                    {errors.contact_prenom && (
                      <p className="text-sm text-red-500">
                        {errors.contact_prenom.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_nom">
                      Nom <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="contact_nom"
                      {...register("contact_nom")}
                      placeholder="Dupont"
                    />
                    {errors.contact_nom && (
                      <p className="text-sm text-red-500">
                        {errors.contact_nom.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    {...register("contact_email")}
                    placeholder="jean.dupont@email.com"
                  />
                  {errors.contact_email && (
                    <p className="text-sm text-red-500">
                      {errors.contact_email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_telephone">
                    Téléphone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contact_telephone"
                    type="tel"
                    {...register("contact_telephone")}
                    placeholder="06 12 34 56 78"
                  />
                  {errors.contact_telephone && (
                    <p className="text-sm text-red-500">
                      {errors.contact_telephone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_adresse">
                    Adresse <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="contact_adresse"
                    {...register("contact_adresse")}
                    placeholder="123 rue de la Paix&#10;75001 Paris"
                    rows={2}
                  />
                  {errors.contact_adresse && (
                    <p className="text-sm text-red-500">
                      {errors.contact_adresse.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_societe">
                    Nom de la société <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contact_societe"
                    {...register("contact_societe")}
                    placeholder="Production XYZ"
                  />
                  {errors.contact_societe && (
                    <p className="text-sm text-red-500">
                      {errors.contact_societe.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reference_projet">
                    Référence du projet (facultatif)
                  </Label>
                  <Input
                    id="reference_projet"
                    {...register("reference_projet")}
                    placeholder="PROD-2024-001"
                  />
                </div>
              </div>

              {/* Facturation */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="facturation_identique"
                    {...register("facturation_identique")}
                    className="w-4 h-4 rounded border-border text-blue-primary focus:ring-blue-primary"
                  />
                  <Label
                    htmlFor="facturation_identique"
                    className="font-normal cursor-pointer"
                  >
                    Les informations de facturation sont identiques
                  </Label>
                </div>

                {showFacturation && (
                  <div className="space-y-4 pt-4 animate-in slide-in-from-top-2">
                    <h3 className="font-semibold text-lg">
                      Informations de facturation
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="facturation_societe">
                        Société <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="facturation_societe"
                        {...register("facturation_societe")}
                        placeholder="Société du client"
                      />
                      {errors.facturation_societe && (
                        <p className="text-sm text-red-500">
                          {errors.facturation_societe.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facturation_adresse">
                        Adresse postale <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="facturation_adresse"
                        {...register("facturation_adresse")}
                        placeholder="123 rue de la Paix&#10;75001 Paris&#10;France"
                        rows={3}
                      />
                      {errors.facturation_adresse && (
                        <p className="text-sm text-red-500">
                          {errors.facturation_adresse.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facturation_tva">N° TVA (facultatif)</Label>
                      <Input
                        id="facturation_tva"
                        {...register("facturation_tva")}
                        placeholder="FR12345678901"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facturation_reference">
                        Référence projet (facultatif)
                      </Label>
                      <Input
                        id="facturation_reference"
                        {...register("facturation_reference")}
                        placeholder="REF-CLIENT-001"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Boutons de navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/parkings")}
                >
                  Annuler
                </Button>

                <Button type="submit" disabled={isSubmitting}>
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

