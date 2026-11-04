import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { FictionalBanner, PageHeader } from "@/components/academy/ui";
import { campus, SEGMENT_TONE } from "@/lib/academy/campus";

export const metadata: Metadata = { title: "Case packs" };

export default function CasesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader eyebrow="Case packs" title="Four practice cases, one per segment" lead="Each pack carries evidence, a persona, a journey, insights and HMW questions — everything you need to practise a block end to end." />
      <FictionalBanner />
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {campus.segments.map((segment) => {
          const pack = campus.case_packs[segment];
          return (
            <Link
              key={segment}
              href={`/academy/cases/${segment}`}
              className="group relative overflow-hidden rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="absolute inset-y-0 left-0 w-2" style={{ background: SEGMENT_TONE[segment] }} aria-hidden />
              <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: SEGMENT_TONE[segment] }}>{segment}</span>
              <h2 className="mt-3 text-2xl font-bold">{pack.name}</h2>
              <p className="mt-1 text-sm text-muted">{pack.client}</p>
              <p className="mt-3 text-sm">{pack.challenge}</p>
              <p className="mt-3 text-sm italic text-navy">{pack.persona}</p>
              <span className="mt-5 inline-flex items-center gap-1 font-semibold text-sodexo">
                Open the case <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
