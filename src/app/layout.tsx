import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import StyledComponentsRegistry from "@/lib/registry";
import { GlobalStyle } from "@/styles/GlobalStyle";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { ConsentBanner } from "@/components/ConsentBanner";
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
  "Espetinhos de morango e uva, pão de mel, bombom no pote, lanche e suco natural. " +
  "Feitos na hora na zona sul de São Paulo, com retirada no Parque Regina e entrega nos bairros vizinhos. Pedidos pelo WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL("https://doces-da-pati.vercel.app"),
  title: "Os Doces da Pati — Doces artesanais na zona sul de SP",
  description: descricao,
  icons: {
    icon: "/produtos/logo-doces-da-pati.png",
    apple: "/produtos/logo-doces-da-pati.png",
  },
  keywords: [
    "doces artesanais",
    "espetinho de morango",
    "pão de mel",
    "bombom no pote",
    "zona sul São Paulo",
    "Parque Regina",
    "Campo Limpo",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Os Doces da Pati",
    title: "Os Doces da Pati — Doces artesanais na zona sul de SP",
    description: descricao,
    url: "https://doces-da-pati.vercel.app",
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
    title: "Os Doces da Pati — Doces artesanais na zona sul de SP",
    description: descricao,
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${karla.variable}`}>
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
