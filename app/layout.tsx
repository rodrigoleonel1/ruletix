import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://ruletix.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icon-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  title: {
    default: "Ruletix — Ruleta personalizable online",
    template: "%s | Ruletix",
  },
  description:
    "Ruletix es una ruleta interactiva y gratuita. Personalizá las casillas, elegí colores y girá con un clic, con el mouse o con el dedo. Ideal para sorteos, juegos y decisiones al azar.",
  keywords: [
    "ruleta online",
    "ruleta personalizable",
    "sorteo online",
    "ruleta gratis",
    "ruleta interactiva",
    "ruletix",
    "girar ruleta",
    "random wheel",
    "spin wheel",
  ],
  authors: [{ name: "Ruletix" }],
  creator: "Ruletix",
  publisher: "Ruletix",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "Ruletix — Ruleta personalizable online",
    description:
      "Girá la ruleta, personalizá casillas y colores. Ideal para sorteos y juegos. Gratis y sin registro.",
    siteName: "Ruletix",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ruletix — Ruleta personalizable online",
    description:
      "Girá la ruleta, personalizá casillas y colores. Ideal para sorteos y juegos. Gratis y sin registro.",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Prevent flash: read localStorage before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('ruletix-theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
