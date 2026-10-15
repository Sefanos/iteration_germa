import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Germa Paysages — La nature prend forme.",
  description:
    "Germa Paysages Sàrl, aménagements extérieurs à Monthey et à Etoy : conception, réalisation et entretien de jardins en Valais et sur le canton de Vaud.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#18352A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CH" className={`${instrument.variable} ${manrope.variable}`}>
      <body className="min-h-dvh bg-limestone text-charcoal">{children}</body>
    </html>
  );
}
