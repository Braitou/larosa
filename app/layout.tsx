import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LaRosa | Parkings Sécurisés pour Productions Audiovisuelles",
  description:
    "Réservez en ligne votre place de parking sécurisé à Paris pour vos camions de production. Simple, rapide et sécurisé.",
  keywords: [
    "parking",
    "paris",
    "production audiovisuelle",
    "camion",
    "réservation",
    "sécurisé",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="font-manrope antialiased">
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          toastOptions={{
            duration: 4000,
            style: {
              fontFamily: "var(--font-manrope)",
            },
          }}
        />
      </body>
    </html>
  );
}
