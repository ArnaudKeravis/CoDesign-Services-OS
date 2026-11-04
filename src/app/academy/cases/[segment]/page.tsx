import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseExplorer } from "@/components/academy/case-explorer";
import { BlockChip, FictionalBanner, Panel } from "@/components/academy/ui";
import { CredentialTile } from "@/components/credentials/credential-tile";
import { campus, isSegment, SEGMENT_TONE } from "@/lib/academy/campus";
import { credentialsForSegment } from "@/lib/credentials";

export function generateStaticParams() {
  return campus.segments.map((segment) => ({ segment }));
}

export async function generateMetadata({ params }: { params: Promise<{ segment: string }> }): Promise<Metadata> {
  const { segment } = await params;
  return { title: `${segment} case pack` };
}

export default async function CasePage({ params }: { params: Promise<{ segment: string }> }) {
  const { segment } = await params;
  if (!isSegment(segment)) notFound();
  const pack = campus.case_packs[segment];
  const tone = SEGMENT_TONE[segment];
  const blocks = campus.blocks.filter((b) => b.primary === segment).slice(0, 8);
  const real = credentialsForSegment(segment, 3);

  return (
    <main>
      <div className="border-b border-line" style={{ background: `linear-gradient(135deg, ${tone}1a 0%, #fff 60%)` }}>
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <Link href="/academy/cases" className="inline-flex items-center gap-1 text-sm text-muted hover:text-navy"><ArrowLeft size={14} /> All case packs</Link>
          <span className="mt-4 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: tone }}>{segment}</span>
          <h1 className="mt-2 text-3xl font-bold md:text-5xl">{pack.name}</h1>
          <p className="mt-2 text-muted">{pack.client}</p>
          <div className="mt-4 max-w-xl"><FictionalBanner /></div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Panel title="Challenge"><p className="text-sm">{pack.challenge}</p></Panel>
          <Panel title="Users"><p className="text-sm">{pack.users}</p></Panel>
          <Panel title="Constraints"><p className="text-sm">{pack.constraints}</p></Panel>
        </div>
        <div className="flex items-start gap-4 rounded-3xl bg-navy p-6 text-white">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 text-2xl font-bold">{pack.persona.charAt(0)}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/70">Persona</p>
            <p className="mt-1 text-lg">{pack.persona}</p>
          </div>
        </div>
        <CaseExplorer segment={segment} pack={pack} tone={tone} />
        <div className="grid gap-4 md:grid-cols-3">
          <Panel title="Workshop inputs"><p className="text-sm">{pack.workshop_inputs}</p></Panel>
          <Panel title="Ideas">
            <ul className="space-y-1 text-sm">{pack.ideas.map((i) => <li key={i}>• {i}</li>)}</ul>
          </Panel>
          <Panel title="Priorities & test">
            <p className="text-sm">{pack.priorities}</p>
            <p className="mt-2 text-sm">{pack.test}</p>
          </Panel>
        </div>
        <section>
          <h2 className="text-xl font-bold">Practise these blocks on this case</h2>
          <div className="mt-3 flex flex-wrap gap-2">{blocks.map((b) => <BlockChip key={b.id} block={b} />)}</div>
        </section>
        <section>
          <h2 className="text-xl font-bold">Real credentials to look at</h2>
          <p className="mt-1 text-sm text-muted">{pack.credentials}</p>
          {real.length > 0 ? (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {real.map((c) => (
                <Link key={c.id} href={`/academy/credentials?id=${c.id}`}><CredentialTile credential={c} compact /></Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 rounded-xl bg-panel p-4 text-sm text-muted">No verified credential in this segment yet — use a cross-sector case and say so openly.</p>
          )}
        </section>
      </div>
    </main>
  );
}
