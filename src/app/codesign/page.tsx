import { ArrowRight, Library } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { BlockChip, Eyebrow, LevelBar } from "@/components/academy/ui";
import { CredentialTile } from "@/components/credentials/credential-tile";
import { BrandPanel, CoDesignLockup } from "@/components/platform/brand";
import { blocksInSection, campus, LEVEL_TONE, SECTION_TONE } from "@/lib/academy/campus";
import { credentials } from "@/lib/credentials";

export const metadata: Metadata = { title: "CoDesign Services" };

const FEATURED = ["eli-lilly-2026-the-cell", "roland-garros-2026-fnb", "clariane-2025-dining"];

export default function CoDesignPage() {
  const featured = FEATURED.map((id) => credentials.find((c) => c.id === id)).filter((c) => c !== undefined);
  return (
    <main>
      <BrandPanel className="py-14 md:py-20" seed={3}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <CoDesignLockup />
          <h1 className="mt-6 max-w-3xl text-4xl font-bold !text-white md:text-5xl">The five phases at a glance</h1>
          <p className="mt-4 max-w-2xl text-lg italic text-white/85">
            Presales frames the opportunity; the Double Diamond then diverges and converges twice — first on the problem, then on the solution.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/codesign/credentials" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-navy">
              <Library size={18} /> Search credentials
            </Link>
            <Link href="/academy" className="inline-flex items-center gap-2 rounded-xl border border-white/50 px-4 py-2.5 font-semibold text-white hover:bg-white/10">
              Learn the method <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </BrandPanel>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-4 md:grid-cols-5">
          {campus.sections
            .filter((s) => s.code !== "01")
            .map((s) => {
              const tone = SECTION_TONE[s.code];
              const blocks = blocksInSection(s.code).filter((b) => b.type === "source_block");
              return (
                <div key={s.code} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-panel">
                  <div className="px-4 py-3 text-center font-semibold text-white" style={{ background: tone.bg }}>
                    {tone.short}
                  </div>
                  <ol className="flex-1 space-y-2 p-4 text-sm">
                    {blocks.map((b, i) => (
                      <li key={b.id} className="flex gap-2">
                        <span className="font-semibold" style={{ color: tone.bg }}>{i + 1}</span>
                        <Link href={`/academy/blocks/${b.id}`} className="text-navy hover:underline">{b.name}</Link>
                      </li>
                    ))}
                  </ol>
                  <p className="px-4 pb-4 text-xs italic text-muted">{tone.motion}</p>
                </div>
              );
            })}
        </div>
        <div className="mt-6 rounded-2xl border border-sodexo/30 bg-panel-2 px-5 py-4 text-sm">
          <span className="mr-3 text-xs font-bold uppercase tracking-wider text-sodexo">Principle</span>
          <span className="italic text-navy">Human-led, AI-supported. Every AI draft is checked by a person against the evidence before it reaches a client.</span>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <Eyebrow>Competency levels</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold">How far do you want to go?</h2>
        <p className="mt-2 italic text-sodexo">Every building block carries the level it takes to run it. The levels are cumulative.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {campus.levels.map((l, i) => (
            <div key={l.code} className="overflow-hidden rounded-2xl bg-panel">
              <div className="h-1.5" style={{ background: LEVEL_TONE[l.code] }} />
              <div className="p-5">
                <p className="font-display text-3xl font-bold" style={{ color: LEVEL_TONE[l.code] }}>{l.code}</p>
                <p className="mt-2 font-semibold text-navy">{l.label.replace(/^N\d\s/, "")}</p>
                <p className="mt-1 text-sm text-muted">
                  {[
                    "Understand CoDesign · recognise opportunities.",
                    "Contribute to an engagement · use templates & methods.",
                    "Facilitate selected activities of the journey.",
                    "Deliver standard engagements end-to-end.",
                    "Own the method · train · guarantee quality.",
                  ][i]}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4"><LevelBar level="N3" /></div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-4 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Eyebrow>Credentials</Eyebrow>
            <h2 className="mt-2 text-3xl font-bold">Recent proof of what we do</h2>
          </div>
          <Link href="/codesign/credentials" className="hidden items-center gap-1 font-semibold text-sodexo md:inline-flex">
            All credentials <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {featured.map((c) => (
            <Link key={c.id} href={`/codesign/credentials?id=${c.id}`}>
              <CredentialTile credential={c} />
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {campus.blocks
            .filter((b) => ["02.01", "02.02", "04.02", "05.01", "06.02"].includes(b.id))
            .map((b) => (
              <BlockChip key={b.id} block={b} />
            ))}
        </div>
      </section>
    </main>
  );
}
