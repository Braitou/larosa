import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  Shield,
  Smartphone,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-2 bg-blue-primary/10 rounded-full">
              <span className="text-sm font-medium text-blue-primary">
                Réservez en 2 minutes
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl">
              Parkings sécurisés pour vos{" "}
              <span className="text-blue-primary bg-gradient-to-r from-blue-primary to-blue-secondary bg-clip-text text-transparent">
                productions
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-text-secondary max-w-2xl mx-auto">
              Réserver en ligne votre place de Parking à Paris. <br /> Simple, rapide et sécurisé.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-lg px-8 transform transition-all hover:scale-105 hover:shadow-xl" asChild>
                <Link href="/reserver">Réserver une place</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              <div className="hover:scale-110 transition-transform">
                <p className="font-fraunces text-4xl font-bold text-blue-primary">
                  24/7
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  Accès sécurisé
                </p>
              </div>
              <div className="hover:scale-110 transition-transform">
                <p className="font-fraunces text-4xl font-bold text-blue-primary">
                  2min
                </p>
                <p className="text-sm text-text-secondary mt-1">
                  Pour réserver
                </p>
              </div>
              <div className="hover:scale-110 transition-transform">
                <p className="font-fraunces text-4xl font-bold text-blue-primary">
                  100%
                </p>
                <p className="text-sm text-text-secondary mt-1">Paiement sécurisé</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-background-card py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl mb-4">
                Pourquoi choisir LaRosa ?
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                La solution pour garantir la sécurité de vos véhicules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
              <Card className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-primary/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Clock className="w-6 h-6 text-background-main" />
                  </div>
                  <h3 className="text-xl font-bold">Réservation instantanée</h3>
                  <p className="text-text-secondary">
                    Plus besoin d'appeler. Réservez votre place en quelques
                    clics et recevez votre confirmation immédiatement.
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-primary/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Shield className="w-6 h-6 text-background-main" />
                  </div>
                  <h3 className="text-xl font-bold">100% sécurisé</h3>
                  <p className="text-text-secondary">
                    Parkings surveillés 24/7 avec gardien et système de vidéosurveillance.
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-primary/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Smartphone className="w-6 h-6 text-background-main" />
                  </div>
                  <h3 className="text-xl font-bold">Code de confirmation</h3>
                  <p className="text-text-secondary">
                    Recevez un code unique par email. Présentez-le à l'arrivée,
                    c'est tout. Simple et efficace.
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-primary/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <CheckCircle2 className="w-6 h-6 text-background-main" />
                  </div>
                  <h3 className="text-xl font-bold">Paiement sécurisé</h3>
                  <p className="text-text-secondary">
                    Payez en ligne par carte bancaire. Transaction sécurisée par
                    Stripe, leader mondial du paiement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl mb-4">Comment ça marche ?</h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                3 étapes pour réserver votre parking
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-primary text-background-main flex items-center justify-center font-fraunces font-bold text-xl shadow-lg">
                  1
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-bold mb-2">
                    Choisissez votre parking
                  </h3>
                  <p className="text-text-secondary">
                    Sélectionnez le parking le plus proche de votre lieu de
                    tournage et vérifiez la disponibilité en temps réel.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-primary text-background-main flex items-center justify-center font-fraunces font-bold text-xl shadow-lg">
                  2
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-bold mb-2">
                    Réservez et payez en ligne
                  </h3>
                  <p className="text-text-secondary">
                    Remplissez vos informations, choisissez vos dates et payez
                    en ligne de manière sécurisée. Vous recevez immédiatement un
                    code de confirmation.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-primary text-background-main flex items-center justify-center font-fraunces font-bold text-xl shadow-lg">
                  3
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-xl font-bold mb-2">
                    Présentez-vous au parking
                  </h3>
                  <p className="text-text-secondary">
                    Arrivez au parking avec votre code. Le gardien vous valide et
                    vous accédez à votre place. C'est tout !
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button size="lg" className="transform transition-all hover:scale-105 hover:shadow-xl" asChild>
                <Link href="/reserver">Réserver maintenant</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-primary py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-5xl text-background-main mb-6">
              Prêt à simplifier vos tournages ?
            </h2>
            <p className="text-xl text-background-main/80 mb-8 max-w-2xl mx-auto">
              Rejoignez les centaines de productions qui nous font confiance pour
              sécuriser leur matériel.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 transform transition-all hover:scale-105 hover:shadow-2xl"
              asChild
            >
              <Link href="/reserver">Réserver maintenant</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

