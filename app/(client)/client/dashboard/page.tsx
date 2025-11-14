import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Calendar, MapPin, ParkingSquare } from "lucide-react";
import { logout } from "@/app/(auth)/actions";

export default async function ClientDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* En-tête */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl mb-2">
                Bonjour {profile?.prenom} ! 👋
              </h1>
              <p className="text-text-secondary">
                Bienvenue sur votre tableau de bord LaRosa
              </p>
            </div>

            <form action={logout}>
              <Button variant="outline" type="submit">
                Déconnexion
              </Button>
            </form>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ParkingSquare className="w-5 h-5" />
                  Réserver un parking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary mb-4">
                  Consultez les parkings disponibles et réservez en ligne
                </p>
                <Button asChild className="w-full">
                  <Link href="/parkings">Voir les parkings</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Mes réservations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary mb-4">
                  Consultez vos réservations passées et à venir
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/client/reservations">Voir mes réservations</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Mon profil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary mb-4">
                  Gérez vos informations personnelles
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/client/profile">Voir mon profil</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Informations du compte */}
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary">Nom complet</p>
                  <p className="font-medium">
                    {profile?.prenom} {profile?.nom}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Email</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Téléphone</p>
                  <p className="font-medium">{profile?.telephone}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Type de compte</p>
                  <p className="font-medium capitalize">{profile?.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}





