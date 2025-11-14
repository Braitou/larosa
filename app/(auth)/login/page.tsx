"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParkingSquare, AlertCircle } from "lucide-react";
import { login } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Connexion..." : "Se connecter"}
    </Button>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction] = useFormState(login, { error: null, success: false });

  // Rediriger côté client quand la connexion réussit
  useEffect(() => {
    if (state?.success && state?.role) {
      if (state.role === "admin") {
        router.push("/admin/dashboard");
      } else if (state.role === "gardien") {
        router.push("/gardien/dashboard");
      } else {
        router.push("/client/dashboard");
      }
    }
  }, [state, router]);

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
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte LaRosa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              {state?.success && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-green-900">
                      <AlertCircle className="w-4 h-4" />
                      <p className="text-sm">✅ Connexion réussie ! Redirection...</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {state?.error && !state?.success && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-red-900">
                      <AlertCircle className="w-4 h-4" />
                      <p className="text-sm">{state.error}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemple@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-primary hover:text-blue-secondary"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>

              <SubmitButton />
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-text-secondary">
                Pas encore de compte ?{" "}
              </span>
              <Link
                href="/register"
                className="text-blue-primary font-medium hover:text-blue-secondary"
              >
                Créer un compte
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




