import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AcademyNav } from "@/components/academy/academy-nav";
import { CoachWidget } from "@/components/academy/coach-widget";

export const metadata: Metadata = {
  title: { default: "CoDesign Academy", template: "%s · CoDesign Academy" },
  description: "Learn the CoDesign method by doing — method cards, explainers, podcasts, exercises, case packs and the Agent Lab.",
};

export default function AcademyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AcademyNav />
      {children}
      <CoachWidget />
    </>
  );
}
