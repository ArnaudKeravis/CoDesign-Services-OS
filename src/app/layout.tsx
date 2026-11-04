import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import { ProgressProvider } from "@/components/academy/progress-provider";
import { CoDesignLockup, SodexoWordmark } from "@/components/platform/brand";
import { PlatformHeader } from "@/components/platform/header";

import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "CoDesign Services · Sodexo", template: "%s · CoDesign" },
  description: "Sodexo CoDesign Services platform: method, credentials, CoDesign OS agents and the CoDesign Academy.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body className="min-h-screen bg-white">
        <ProgressProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2">
            Skip to content
          </a>
          <PlatformHeader />
          <div id="main">{children}</div>
          <footer className="mt-16 border-t border-line bg-panel">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-6">
              <div className="flex items-center gap-3">
                <span className="brand-gradient flex h-8 items-center rounded-md px-2">
                  <SodexoWordmark className="text-[15px]" />
                </span>
                <CoDesignLockup />
                <span>Digital & AI Strategy and Experience team</span>
              </div>
              <nav className="flex flex-wrap gap-4" aria-label="Footer">
                <Link href="/codesign" className="hover:text-navy">CoDesign</Link>
                <Link href="/codesign/credentials" className="hover:text-navy">Credentials</Link>
                <Link href="/os" className="hover:text-navy">OS</Link>
                <Link href="/academy" className="hover:text-navy">Academy</Link>
                <Link href="/academy/review" className="hover:text-navy">Content review</Link>
              </nav>
              <p className="text-xs">Internal use only · no tracking cookies · progress stays on this device</p>
            </div>
          </footer>
        </ProgressProvider>
      </body>
    </html>
  );
}
