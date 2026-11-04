import { ArrowLeft, ArrowUpRight, ClipboardCheck, FlaskConical } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LevelBar, Panel, SectionPill } from "@/components/academy/ui";
import { CredentialTile } from "@/components/credentials/credential-tile";
import { TrainingSteps } from "@/components/os/training-steps";
import { BrandPanel } from "@/components/platform/brand";
import { CopyButton } from "@/components/platform/copy-button";
import { blockById } from "@/lib/academy/campus";
import { humanChecks, promptTemplate } from "@/lib/academy/learning";
import { credentialsForBlock } from "@/lib/credentials";
import { agentBySlug, osAgents } from "@/lib/os/agents";
import { trainingFor } from "@/lib/os/training";

export function generateStaticParams() {
  return osAgents.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${agentBySlug(slug)?.name ?? "Agent"} agent` };
}

export default async function AgentGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const agent = agentBySlug(slug);
  if (!agent) notFound();
  const training = trainingFor(agent);
  const blocks = agent.blocks.map((b) => blockById(b.id)).filter((b) => b !== undefined);
  const main = blocks[0];
  const prompts = blocks.map((b) => ({ block: b, tpl: promptTemplate(b) })).filter((p) => p.tpl);
  const creds = credentialsForBlock(main, 3);

  return (
    <main>
      <BrandPanel className="py-12 md:py-16" seed={slug.length}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Link href="/os" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white"><ArrowLeft size={14} /> All agents</Link>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/75">CoDesign OS agent</p>
          <h1 className="mt-2 text-4xl font-bold !text-white md:text-5xl">{agent.name}</h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={agent.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-navy">
              Open in CoDesign OS <ArrowUpRight size={16} />
            </a>
            <Link href={`/academy/lab?agent=${agent.slug}`} className="inline-flex items-center gap-2 rounded-xl border border-white/50 px-4 py-2.5 font-semibold text-white hover:bg-white/10">
              <FlaskConical size={16} /> Try it in the Agent Lab
            </Link>
          </div>
        </div>
      </BrandPanel>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold">When to use it</h2>
            <div className="mt-4 space-y-4">
              {blocks.map((b) => (
                <article key={b.id} className="rounded-2xl border border-line p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <SectionPill code={b.id.slice(0, 2)} />
                      <Link href={`/academy/blocks/${b.id}`} className="font-semibold text-navy hover:underline">{b.id} {b.name}</Link>
                    </div>
                    <LevelBar level={b.lvl} compact />
                  </div>
                  <p className="mt-3 text-sm italic text-sodexo">{b.obj}</p>
                  <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                    <p><span className="font-semibold text-navy">When: </span>{b.when}</p>
                    <p><span className="font-semibold text-navy">Output: </span>{b.output}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {prompts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">Prompt to start from</h2>
              <div className="mt-4 space-y-4">
                {prompts.map(({ block, tpl }) => (
                  <div key={block.id} className="rounded-2xl bg-panel p-5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-navy">{block.id} {block.name}</p>
                      <CopyButton text={tpl!.template} />
                    </div>
                    <p className="mt-3 whitespace-pre-wrap rounded-xl bg-white p-4 font-mono text-[12.5px] leading-relaxed">{tpl!.template}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <Panel title="Human checks before you reuse a draft">
            <ul className="space-y-1.5 text-sm">
              {humanChecks(main).map((c) => (
                <li key={c} className="flex gap-2"><ClipboardCheck size={15} className="mt-0.5 shrink-0 text-s05" /> {c}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs font-bold uppercase tracking-wider text-sodexo">If the agent is unavailable</p>
            <p className="text-sm">{main.fallback}</p>
          </Panel>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <TrainingSteps training={training} />
          {creds.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-semibold text-navy">Credentials where this kind of output was delivered</p>
              <div className="grid gap-3">
                {creds.map((c) => (
                  <Link key={c.id} href={`/codesign/credentials?id=${c.id}`}><CredentialTile credential={c} compact /></Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
