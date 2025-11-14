import Link from "next/link";
import { ParkingSquare, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-blue-primary flex items-center justify-center">
                <ParkingSquare className="w-6 h-6 text-background-main" />
              </div>
              <span className="font-fraunces text-2xl font-bold text-blue-primary">
                LaRosa
              </span>
            </div>
            <p className="text-sm text-text-secondary">
              La solution digitale pour réserver vos parkings sécurisés pour
              productions audiovisuelles à Paris.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-fraunces font-bold text-blue-primary mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/parkings"
                  className="text-sm text-text-secondary hover:text-blue-primary transition-colors"
                >
                  Nos Parkings
                </Link>
              </li>
              <li>
                <Link
                  href="/tarifs"
                  className="text-sm text-text-secondary hover:text-blue-primary transition-colors"
                >
                  Tarifs
                </Link>
              </li>
              <li>
                <Link
                  href="/comment-ca-marche"
                  className="text-sm text-text-secondary hover:text-blue-primary transition-colors"
                >
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-text-secondary hover:text-blue-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="font-fraunces font-bold text-blue-primary mb-4">
              Légal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-sm text-text-secondary hover:text-blue-primary transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/cgv"
                  className="text-sm text-text-secondary hover:text-blue-primary transition-colors"
                >
                  CGV
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-sm text-text-secondary hover:text-blue-primary transition-colors"
                >
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-fraunces font-bold text-blue-primary mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:contact@larosa.fr"
                  className="hover:text-blue-primary transition-colors"
                >
                  contact@larosa.fr
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <Phone className="w-4 h-4" />
                <a
                  href="tel:+33123456789"
                  className="hover:text-blue-primary transition-colors"
                >
                  01 23 45 67 89
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Paris, Île-de-France</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-text-secondary">
            © {new Date().getFullYear()} LaRosa. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}





