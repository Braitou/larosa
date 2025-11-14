"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ParkingSquare, LogOut, Truck, Car, Clock, Calendar as CalendarIcon } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ValidateArrivalDialog } from "@/components/dashboard/validate-arrival-dialog";
import { ValidateDepartureDialog } from "@/components/dashboard/validate-departure-dialog";
import { toast } from "sonner";
import type { Parking, Reservation, Vehicle } from "@/types/database.types";

interface ReservationWithVehicles extends Reservation {
  vehicles: Vehicle[];
}

export default function GardienDashboard() {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [selectedParkingId, setSelectedParkingId] = useState<string>("");
  const [reservations, setReservations] = useState<ReservationWithVehicles[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [arrivalDialog, setArrivalDialog] = useState<{
    open: boolean;
    vehicleType: "lourd" | "leger";
    clientName: string;
    reservationId: string;
  } | null>(null);

  const [departureDialog, setDepartureDialog] = useState<{
    open: boolean;
    vehicle: Vehicle;
    clientName: string;
  } | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");

  // Charger les parkings
  useEffect(() => {
    async function loadParkings() {
      const supabase = createClient();
      const { data } = await supabase
        .from("parkings")
        .select("*")
        .order("nom");

      if (data && data.length > 0) {
        setParkings(data);
        setSelectedParkingId(data[0].id);
      }
      setLoading(false);
    }

    loadParkings();
  }, []);

  // Charger les réservations
  useEffect(() => {
    if (!selectedParkingId) return;

    async function loadReservations() {
      const supabase = createClient();

      const { data: resData } = await supabase
        .from("reservations")
        .select("*")
        .eq("parking_id", selectedParkingId)
        .eq("statut", "confirmee")
        .order("date_debut", { ascending: true });

      if (resData) {
        const reservationsWithVehicles = await Promise.all(
          resData.map(async (res) => {
            const { data: vehicles } = await supabase
              .from("vehicles")
              .select("*")
              .eq("reservation_id", res.id)
              .order("created_at");

            return {
              ...res,
              vehicles: vehicles || [],
            };
          })
        );

        setReservations(reservationsWithVehicles);
      }
    }

    loadReservations();

    const interval = setInterval(loadReservations, 30000);
    return () => clearInterval(interval);
  }, [selectedParkingId]);

  // Grouper les réservations par colonne
  const reservationsAVenir = reservations.filter((r) =>
    r.vehicles.some((v) => v.statut === "en_attente")
  );

  const reservationsGarees = reservations.filter((r) =>
    r.vehicles.some((v) => v.statut === "arrive" && r.date_fin !== today)
  );

  const reservationsDeparts = reservations.filter((r) =>
    r.vehicles.some((v) => v.statut === "arrive" && r.date_fin === today)
  );

  // Stats
  const selectedParking = parkings.find((p) => p.id === selectedParkingId);
  const vehiculesPresents = reservations
    .flatMap((r) => r.vehicles)
    .filter((v) => v.statut === "arrive").length;

  // Validation d'arrivée
  const handleValidateArrival = async (code: string, plaque: string) => {
    if (!arrivalDialog) return;

    const supabase = createClient();

    // Chercher le véhicule avec ce code dans cette réservation
    const { data: vehicle, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("reservation_id", arrivalDialog.reservationId)
      .eq("code_confirmation", code)
      .eq("statut", "en_attente")
      .single();

    if (error || !vehicle) {
      toast.error("Code invalide ou déjà utilisé");
      throw new Error("Code invalide");
    }

    // Marquer comme arrivé avec la plaque
    const { error: updateError } = await supabase
      .from("vehicles")
      .update({
        statut: "arrive",
        checked_in_at: new Date().toISOString(),
        plaque_immatriculation: plaque,
      })
      .eq("id", vehicle.id);

    if (updateError) {
      toast.error("Erreur lors de la validation");
      throw updateError;
    }

    // Décrémenter les places disponibles
    await supabase.rpc("decrement_places_disponibles", {
      parking_id_param: selectedParkingId,
    });

    toast.success(`✅ Véhicule ${vehicle.type} validé !`);

    // Rafraîchir
    setTimeout(() => window.location.reload(), 1000);
  };

  // Validation de départ
  const handleValidateDeparture = async (code: string) => {
    if (!departureDialog) return;

    const vehicle = departureDialog.vehicle;

    // Vérifier que le code correspond
    if (code !== vehicle.code_confirmation) {
      toast.error("Code incorrect");
      throw new Error("Code incorrect");
    }

    const supabase = createClient();

    // Marquer comme parti
    const { error } = await supabase
      .from("vehicles")
      .update({
        statut: "parti",
        checked_out_at: new Date().toISOString(),
      })
      .eq("id", vehicle.id);

    if (error) {
      toast.error("Erreur lors de la validation");
      throw error;
    }

    // Incrémenter les places disponibles
    await supabase.rpc("increment_places_disponibles", {
      parking_id_param: selectedParkingId,
    });

    toast.success(`✅ Départ validé !`);

    setTimeout(() => window.location.reload(), 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-main flex items-center justify-center">
        <p className="text-text-secondary">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-main">
      {/* Header */}
      <header className="border-b border-border bg-background-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ParkingSquare className="w-8 h-8 text-blue-primary" />
              <div>
                <h1 className="font-fraunces text-2xl font-bold text-blue-primary">
                  Dashboard Gardien
                </h1>
                <p className="text-sm text-text-secondary">LaRosa Parkings</p>
              </div>
            </div>

            <form action={logout}>
              <Button variant="outline" type="submit">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </form>
          </div>

          {/* Onglets parkings */}
          <Tabs
            value={selectedParkingId}
            onValueChange={setSelectedParkingId}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              {parkings.map((parking) => (
                <TabsTrigger key={parking.id} value={parking.id}>
                  {parking.ville}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-text-secondary">Places disponibles</p>
              <p className="text-2xl font-bold text-blue-primary">
                {selectedParking?.places_disponibles}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-text-secondary">Véhicules garés</p>
              <p className="text-2xl font-bold text-green-600">
                {vehiculesPresents}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-text-secondary">À venir</p>
              <p className="text-2xl font-bold text-blue-600">
                {reservationsAVenir.reduce((acc, r) => acc + r.vehicles.filter(v => v.statut === "en_attente").length, 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-text-secondary">Départs aujourd'hui</p>
              <p className="text-2xl font-bold text-orange-600">
                {reservationsDeparts.reduce((acc, r) => acc + r.vehicles.filter(v => v.statut === "arrive").length, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Kanban 3 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne 1 : À venir (bleu) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <h2 className="font-semibold text-lg">
                À venir ({reservationsAVenir.reduce((acc, r) => acc + r.vehicles.filter(v => v.statut === "en_attente").length, 0)})
              </h2>
            </div>

            <div className="space-y-3">
              {reservationsAVenir.length === 0 ? (
                <Card className="bg-blue-50/50">
                  <CardContent className="py-8 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                    <p className="text-sm text-text-secondary">Aucun véhicule attendu</p>
                  </CardContent>
                </Card>
              ) : (
                <Accordion type="multiple" className="space-y-3">
                  {reservationsAVenir.map((reservation) => {
                    const vehiculesEnAttente = reservation.vehicles.filter(
                      (v) => v.statut === "en_attente"
                    );
                    if (vehiculesEnAttente.length === 0) return null;

                    return (
                      <AccordionItem
                        key={reservation.id}
                        value={reservation.id}
                        className="border-0"
                      >
                        <Card className="bg-blue-50/50 border-blue-200">
                          <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex items-start justify-between w-full pr-4">
                              <div className="text-left">
                                <p className="font-semibold text-blue-900">
                                  {reservation.contact_prenom} {reservation.contact_nom}
                                </p>
                                <p className="text-xs text-blue-700">
                                  {reservation.contact_societe}
                                </p>
                              </div>
                              <Badge className="bg-blue-500">
                                {vehiculesEnAttente.length} véh.
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-3">
                            <div className="space-y-2 pt-2">
                              {vehiculesEnAttente.map((vehicle) => (
                                <button
                                  key={vehicle.id}
                                  onClick={() =>
                                    setArrivalDialog({
                                      open: true,
                                      vehicleType: vehicle.type,
                                      clientName: `${reservation.contact_prenom} ${reservation.contact_nom}`,
                                      reservationId: reservation.id,
                                    })
                                  }
                                  className="w-full p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all text-left"
                                >
                                  <div className="flex items-center gap-3">
                                    {vehicle.type === "lourd" ? (
                                      <Truck className="w-5 h-5 text-blue-600" />
                                    ) : (
                                      <Car className="w-5 h-5 text-blue-600" />
                                    )}
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">
                                        Véhicule {vehicle.type}
                                      </p>
                                      <p className="text-xs text-text-secondary">
                                        Cliquez pour valider
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </AccordionContent>
                        </Card>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          </div>

          {/* Colonne 2 : Garés (vert) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <h2 className="font-semibold text-lg">
                Garés ({reservationsGarees.reduce((acc, r) => acc + r.vehicles.filter(v => v.statut === "arrive" && r.date_fin !== today).length, 0)})
              </h2>
            </div>

            <div className="space-y-3">
              {reservationsGarees.length === 0 ? (
                <Card className="bg-green-50/50">
                  <CardContent className="py-8 text-center">
                    <ParkingSquare className="w-8 h-8 mx-auto mb-2 text-green-300" />
                    <p className="text-sm text-text-secondary">Aucun véhicule garé</p>
                  </CardContent>
                </Card>
              ) : (
                <Accordion type="multiple" className="space-y-3">
                  {reservationsGarees.map((reservation) => {
                    const vehiculesGares = reservation.vehicles.filter(
                      (v) => v.statut === "arrive" && reservation.date_fin !== today
                    );
                    if (vehiculesGares.length === 0) return null;

                    return (
                      <AccordionItem
                        key={reservation.id}
                        value={reservation.id}
                        className="border-0"
                      >
                        <Card className="bg-green-50/50 border-green-200">
                          <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex items-start justify-between w-full pr-4">
                              <div className="text-left">
                                <p className="font-semibold text-green-900">
                                  {reservation.contact_prenom} {reservation.contact_nom}
                                </p>
                                <p className="text-xs text-green-700">
                                  {reservation.contact_societe}
                                </p>
                              </div>
                              <Badge className="bg-green-500">
                                {vehiculesGares.length} véh.
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-3">
                            <div className="space-y-2 pt-2">
                              {vehiculesGares.map((vehicle) => (
                                <div
                                  key={vehicle.id}
                                  className="p-3 bg-white rounded-lg border border-green-200"
                                >
                                  <div className="flex items-center gap-3">
                                    {vehicle.type === "lourd" ? (
                                      <Truck className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <Car className="w-5 h-5 text-green-600" />
                                    )}
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">
                                        {vehicle.plaque_immatriculation || "Plaque inconnue"}
                                      </p>
                                      <p className="text-xs text-text-secondary">
                                        Véhicule {vehicle.type}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </Card>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          </div>

          {/* Colonne 3 : Départs aujourd'hui (rouge/orange) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <h2 className="font-semibold text-lg">
                Départs aujourd'hui ({reservationsDeparts.reduce((acc, r) => acc + r.vehicles.filter(v => v.statut === "arrive").length, 0)})
              </h2>
            </div>

            <div className="space-y-3">
              {reservationsDeparts.length === 0 ? (
                <Card className="bg-orange-50/50">
                  <CardContent className="py-8 text-center">
                    <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-orange-300" />
                    <p className="text-sm text-text-secondary">Aucun départ prévu</p>
                  </CardContent>
                </Card>
              ) : (
                <Accordion type="multiple" className="space-y-3">
                  {reservationsDeparts.map((reservation) => {
                    const vehiculesDepart = reservation.vehicles.filter(
                      (v) => v.statut === "arrive"
                    );
                    if (vehiculesDepart.length === 0) return null;

                    return (
                      <AccordionItem
                        key={reservation.id}
                        value={reservation.id}
                        className="border-0"
                      >
                        <Card className="bg-orange-50/50 border-orange-200">
                          <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex items-start justify-between w-full pr-4">
                              <div className="text-left">
                                <p className="font-semibold text-orange-900">
                                  {reservation.contact_prenom} {reservation.contact_nom}
                                </p>
                                <p className="text-xs text-orange-700">
                                  {reservation.contact_societe}
                                </p>
                              </div>
                              <Badge className="bg-orange-500">
                                {vehiculesDepart.length} véh.
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-3">
                            <div className="space-y-2 pt-2">
                              {vehiculesDepart.map((vehicle) => (
                                <button
                                  key={vehicle.id}
                                  onClick={() =>
                                    setDepartureDialog({
                                      open: true,
                                      vehicle,
                                      clientName: `${reservation.contact_prenom} ${reservation.contact_nom}`,
                                    })
                                  }
                                  className="w-full p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-400 hover:shadow-md transition-all text-left"
                                >
                                  <div className="flex items-center gap-3">
                                    {vehicle.type === "lourd" ? (
                                      <Truck className="w-5 h-5 text-orange-600" />
                                    ) : (
                                      <Car className="w-5 h-5 text-orange-600" />
                                    )}
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">
                                        {vehicle.plaque_immatriculation || "Plaque inconnue"}
                                      </p>
                                      <p className="text-xs text-text-secondary">
                                        Véhicule {vehicle.type} - Départ aujourd'hui
                                      </p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </AccordionContent>
                        </Card>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      {arrivalDialog && (
        <ValidateArrivalDialog
          open={arrivalDialog.open}
          onOpenChange={(open) => !open && setArrivalDialog(null)}
          vehicleType={arrivalDialog.vehicleType}
          clientName={arrivalDialog.clientName}
          onValidate={handleValidateArrival}
        />
      )}

      {departureDialog && (
        <ValidateDepartureDialog
          open={departureDialog.open}
          onOpenChange={(open) => !open && setDepartureDialog(null)}
          vehicleType={departureDialog.vehicle.type}
          clientName={departureDialog.clientName}
          plaque={departureDialog.vehicle.plaque_immatriculation || "Inconnue"}
          expectedCode={departureDialog.vehicle.code_confirmation}
          onValidate={handleValidateDeparture}
        />
      )}
    </div>
  );
}
