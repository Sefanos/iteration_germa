import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Germa Paysages, du trait au jardin",
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
  themeColor: "#1E2D24",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CH" className={`${schibsted.variable} ${instrumentSans.variable} ${plexMono.variable}`}>
      <body className="min-h-dvh bg-canvas text-ink">{children}</body>
    </html>
  );
}
