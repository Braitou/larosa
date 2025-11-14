import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParkingSquare } from "lucide-react";
import { register } from "../actions";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-main">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-lg bg-blue-primary flex items-center justify-center group-hover:bg-blue-secondary transition-colors">
              <ParkingSquare className="w-7 h-7 text-background-main" />
            </div>
            <span className="font-fraunces text-3xl font-bold text-blue-primary">
              LaRosa
            </span>
          </Link>
        </div>

        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Créer un compte</CardTitle>
            <CardDescription>
              Rejoignez LaRosa et réservez vos parkings en ligne
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={register} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    type="text"
                    placeholder="Jean"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input
                    id="nom"
                    name="nom"
                    type="text"
                    placeholder="Dupont"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jean.dupont@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 6 caractères"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                />
              </div>

              {/* Role caché - admin par défaut pour créer des comptes admin/gardien */}
              <input type="hidden" name="role" value="admin" />

              <Button type="submit" className="w-full">
                Créer mon compte
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-text-secondary">
                Vous avez déjà un compte ?{" "}
              </span>
              <Link
                href="/login"
                className="text-blue-primary font-medium hover:text-blue-secondary"
              >
                Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Retour accueil */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-blue-primary"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}




