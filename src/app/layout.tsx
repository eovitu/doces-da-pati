import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import StyledComponentsRegistry from "@/lib/registry";
import { GlobalStyle } from "@/styles/GlobalStyle";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Os Doces da Pati | Vitrine",
  description: "Doces artesanais na zona sul de São Paulo — pedidos pelo WhatsApp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
