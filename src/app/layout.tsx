import type { Metadata } from "next";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  title: "JUSTICE IA — Le droit accessible à tous",
  description: "Votre espace pour comprendre le droit français, explorer les sources officielles et préparer vos démarches. Première version en démonstration.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
