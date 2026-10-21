import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ResearchGate } from "@/components/ResearchGate";
import { site } from "@/config/site";
import "./globals.css";

const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(`https://www.${site.domain}`),
  title: { default: `${site.name} | Research-Grade Peptides`, template: `%s | ${site.name}` },
  description: `${site.tagline}. For laboratory research use only. Not for human consumption.`,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <CartProvider>
          <div className="bg-ink py-2 text-center text-xs font-medium tracking-wide text-white/90">
            FOR LABORATORY RESEARCH USE ONLY · NOT FOR HUMAN OR VETERINARY USE
          </div>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ResearchGate />
        </CartProvider>
      </body>
    </html>
  );
}
