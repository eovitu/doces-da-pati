import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import StyledComponentsRegistry from "@/lib/registry";
import { GlobalStyle } from "@/styles/GlobalStyle";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ConsentBanner } from "@/components/ConsentBanner";
import {
  normalizeGoogleVerificationToken,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

// Display: serifada moderna, com personalidade — combina com doce artesanal.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

// Corpo: sans limpa, boa em tamanho pequeno no celular.
const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
});

const descricao =
  "Doces artesanais feitos na hora com ingredientes selecionados na Zona Sul de SP. " +
  "Espetinhos de morango e uva, pão de mel, bombom no pote, lanches e suco natural. " +
  "Retirada no Parque Regina e entrega nos bairros vizinhos. Peça já pelo WhatsApp!";

const googleSiteVerification = normalizeGoogleVerificationToken(
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
);

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  applicationName: "Os Doces da Pati",
  title: "Os Doces da Pati — Confeitaria Artesanal na Zona Sul de SP",
  description: descricao,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  keywords: [
    "Os Doces da Pati",
    "doces artesanais",
    "espetinho de morango",
    "pão de mel",
    "bombom no pote",
    "zona sul São Paulo",
    "Parque Regina",
    "Campo Limpo",
    "confeitaria artesanal",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Os Doces da Pati",
    title: "Os Doces da Pati — Confeitaria Artesanal na Zona Sul de SP",
    description: descricao,
    url: "/",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Bombom de morango no pote da Os Doces da Pati",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Os Doces da Pati — Confeitaria Artesanal na Zona Sul de SP",
    description: descricao,
    images: ["/og.jpg"],
  },
  ...(googleSiteVerification
    ? { verification: { google: googleSiteVerification } }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Os Doces da Pati",
    "alternateName": ["Doces da Pati", "Doces Pati"],
    "url": "https://doces-da-pati.vercel.app/",
    "image": "https://doces-da-pati.vercel.app/favicon.png",
  };

  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${karla.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
          <ConsentBanner />
        </StyledComponentsRegistry>
        <GoogleAnalytics />
      </body>
    </html>
  );
}