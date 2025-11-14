"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ParkingSquare, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background-main/95 backdrop-blur supports-[backdrop-filter]:bg-background-main/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-blue-primary flex items-center justify-center group-hover:bg-blue-secondary transition-colors">
            <ParkingSquare className="w-6 h-6 text-background-main" />
          </div>
          <span className="font-fraunces text-2xl font-bold text-blue-primary">
            LaRosa
          </span>
        </Link>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/parkings"
            className="text-sm font-medium text-text-secondary hover:text-blue-primary transition-colors"
          >
            Nos Parkings
          </Link>
          <Link
            href="/tarifs"
            className="text-sm font-medium text-text-secondary hover:text-blue-primary transition-colors"
          >
            Tarifs
          </Link>
          <Link
            href="/comment-ca-marche"
            className="text-sm font-medium text-text-secondary hover:text-blue-primary transition-colors"
          >
            Comment ça marche
          </Link>
        </nav>

        {/* Actions Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Connexion</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Réserver maintenant</Link>
          </Button>
        </div>

        {/* Menu Mobile */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-blue-primary" />
          ) : (
            <Menu className="w-6 h-6 text-blue-primary" />
          )}
        </button>
      </div>

      {/* Menu Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background-main">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/parkings"
              className="text-sm font-medium text-text-secondary hover:text-blue-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nos Parkings
            </Link>
            <Link
              href="/tarifs"
              className="text-sm font-medium text-text-secondary hover:text-blue-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tarifs
            </Link>
            <Link
              href="/comment-ca-marche"
              className="text-sm font-medium text-text-secondary hover:text-blue-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Comment ça marche
            </Link>
            <div className="pt-4 border-t border-border flex flex-col gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Réserver maintenant</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}





