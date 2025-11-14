"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParkingSquare, CheckCircle2, Clock, Truck, Car, AlertCircle, Home } from "lucide-react";
import Link from "next/link";

// Données de démo
const parkings = [
  {
    id: "1",
    nom: "Parking LaRosa Bobigny",
    ville: "Bobigny",
    places_disponibles: 145,
    capacite_totale: 150,
  },
  {
    id: "2",
    nom: "Parking LaRosa Saint-Denis",
    ville: "Saint-Denis",
    places_disponibles: 138,
    capacite_totale: 150,
  },
];

const reservationsDemo = [
  {
    id: "1",
    contact_prenom: "Jean",
    contact_nom: "Dupont",
    contact_societe: "Production XYZ",
    date_debut: "2024-11-14",
    date_fin: "2024-11-17",
    nombre_nuits: 3,
    vehicles: [
      { id: "1", type: "lourd", code_confirmation: "123456", statut: "arrive" },
      { id: "2", type: "lourd", code_confirmation: "789012", statut: "en_attente" },
      { id: "3", type: "leger", code_confirmation: "345678", statut: "en_attente" },
    ],
  },
  {
    id: "2",
    contact_prenom: "Marie",
    contact_nom: "Martin",
    contact_societe: "Films & Co",
    date_debut: "2024-11-14",
    date_fin: "2024-11-15",
    nombre_nuits: 1,
    vehicles: [
      { id: "4", type: "leger", code_confirmation: "901234", statut: "arrive" },
      { id: "5", type: "leger", code_confirmation: "567890", statut: "arrive" },
    ],
  },
];

export default function DemoDashboard() {
  const [selectedParkingId, setSelectedParkingId] = useState("1");
  const [codeInput, setCodeInput] = useState("");
  const [validationMessage, setValidationMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleValidateCode = () => {
    if (codeInput === "789012") {
      setValidationMessage({
        type: "success",
        message: "✅ Véhicule lourd validé avec succès !",
      });
      setCodeInput("");
    } else if (codeInput.length === 6) {
      setValidationMessage({
        type: "error",
        message: "Code invalide ou déjà utilisé",
      });
      setCodeInput("");
    }
  };

  const selectedParking = parkings.find((p) => p.id === selectedParkingId);
  const vehiculesPresents = 3;
  const reservationsAujourdhui = 2;
  const departsAujourdhui = 1;

  return (
    <div className="min-h-screen bg-background-main">
      {/* Header */}
      <header className="border-b border-border bg-background-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ParkingSquare className="w-8 h-8 text-blue-primary" />
            <div>
              <h1 className="font-fraunces text-2xl font-bold text-blue-primary">
                Dashboard Gardien
              </h1>
              <p className="text-sm text-text-secondary">LaRosa Parkings - Mode Démo</p>
            </div>
          </div>

          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Retour
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Info démo */}
        <Card className="mb-6 bg-blue-primary/5 border-blue-primary/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-primary" />
              <p className="text-sm text-blue-primary">
                <strong>Mode Démo</strong> - Ceci est une prévisualisation du dashboard avec des données fictives
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sélection du parking */}
        <Tabs
          value={selectedParkingId}
          onValueChange={setSelectedParkingId}
          className="space-y-6"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            {parkings.map((parking) => (
              <TabsTrigger key={parking.id} value={parking.id}>
                {parking.ville}
              </TabsTrigger>
            ))}
          </TabsList>

          {parkings.map((parking) => (
            <TabsContent key={parking.id} value={parking.id} className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-text-secondary">
                      Places disponibles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-primary">
                      {parking.places_disponibles}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">
                      / {parking.capacite_totale} places
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-text-secondary">
                      Véhicules présents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-primary">
                      {vehiculesPresents}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-text-secondary">
                      Arrivées aujourd'hui
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-primary">
                      {reservationsAujourdhui}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-text-secondary">
                      Départs aujourd'hui
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-primary">
                      {departsAujourdhui}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Validation des arrivées */}
              <Card>
                <CardHeader>
                  <CardTitle>Validation des arrivées</CardTitle>
                  <p className="text-sm text-text-secondary">
                    Saisissez le code à 6 chiffres du chauffeur
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label htmlFor="code">Code de confirmation</Label>
                      <Input
                        id="code"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="text-2xl font-mono text-center"
                      />
                      <p className="text-xs text-text-secondary mt-2">
                        💡 Essaie avec le code: <strong>789012</strong>
                      </p>
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleValidateCode}
                        size="lg"
                        disabled={codeInput.length !== 6}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Valider
                      </Button>
                    </div>
                  </div>

                  {validationMessage && (
                    <Card
                      className={
                        validationMessage.type === "success"
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2">
                          {validationMessage.type === "success" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                          <p
                            className={
                              validationMessage.type === "success"
                                ? "text-green-900"
                                : "text-red-900"
                            }
                          >
                            {validationMessage.message}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* Liste des réservations */}
              <Card>
                <CardHeader>
                  <CardTitle>Réservations actives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reservationsDemo.map((reservation) => (
                      <Card key={reservation.id} className="bg-background-main">
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-semibold">
                                  {reservation.contact_prenom} {reservation.contact_nom}
                                </p>
                                <p className="text-sm text-text-secondary">
                                  {reservation.contact_societe}
                                </p>
                              </div>
                              <div className="text-right text-sm">
                                <p className="text-text-secondary">
                                  {reservation.date_debut} - {reservation.date_fin}
                                </p>
                                <p className="text-xs text-text-secondary">
                                  {reservation.nombre_nuits} {reservation.nombre_nuits === 1 ? "nuit" : "nuits"}
                                </p>
                              </div>
                            </div>

                            {/* Liste des véhicules */}
                            <div className="space-y-2 pt-3 border-t">
                              {reservation.vehicles.map((vehicle) => (
                                <div
                                  key={vehicle.id}
                                  className="flex items-center justify-between p-2 bg-background-card rounded"
                                >
                                  <div className="flex items-center gap-3">
                                    {vehicle.type === "lourd" ? (
                                      <Truck className="w-4 h-4 text-text-secondary" />
                                    ) : (
                                      <Car className="w-4 h-4 text-text-secondary" />
                                    )}
                                    <span className="text-sm">
                                      Code: <span className="font-mono font-semibold">{vehicle.code_confirmation}</span>
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {vehicle.statut === "en_attente" && (
                                      <Badge variant="outline">En attente</Badge>
                                    )}
                                    {vehicle.statut === "arrive" && (
                                      <>
                                        <Badge className="bg-green-500">Présent</Badge>
                                        <Button size="sm" variant="outline">
                                          Marquer départ
                                        </Button>
                                      </>
                                    )}
                                    {vehicle.statut === "parti" && (
                                      <Badge variant="secondary">Parti</Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}


