import { ArrowUpRight, FlaskConical, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Eyebrow, SectionPill } from "@/components/academy/ui";
import { BrandPanel } from "@/components/platform/brand";
import { CopyButton } from "@/components/platform/copy-button";
import { campus, SECTION_TONE } from "@/lib/academy/campus";
import { promptTemplate } from "@/lib/academy/learning";
import { OS_URL, osAgents } from "@/lib/os/agents";

export const metadata: Metadata = { title: "CoDesign OS" };

export default function OsPage() {
  const sections = campus.sections.filter((s) => osAgents.some((a) => a.sections[0] === s.code));
  const prompts = campus.blocks
    .map((b) => ({ block: b, tpl: promptTemplate(b) }))
    .filter((p) => p.tpl !== null);

  return (
    <main>
      <BrandPanel className="py-14 md:py-20" seed={11}>
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/75">CoDesign OS</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold !text-white md:text-5xl">Human-led, AI-supported.</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            Every agent below is wired into a method block. Each one drafts a CoDesign artefact; a person always checks it against the evidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={OS_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 font-semibold text-navy">
              <Lock size={16} /> Open CoDesign OS <ArrowUpRight size={16} />
            </a>
            <Link href="/academy/lab" className="inline-flex items-center gap-2 rounded-xl border border-white/50 px-4 py-2.5 font-semibold text-white hover:bg-white/10">
              <FlaskConical size={16} /> Practise in the Agent Lab
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/70">CoDesign OS needs its own sign-in. Agent names follow the live OS (read 3 Nov 2026); teach names, not a count.</p>
        </div>
      </BrandPanel>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <Eyebrow>Agent map</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold">Agents by phase</h2>
        <div className="mt-8 space-y-10">
          {sections.map((s) => (
            <div key={s.code}>
              <SectionPill code={s.code} />
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {osAgents
                  .filter((a) => a.sections[0] === s.code)
                  .map((agent) => (
                    <article key={agent.slug} className="flex flex-col rounded-2xl border border-line bg-white p-5 transition hover:shadow-md">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold">{agent.name}</h3>
                        <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: SECTION_TONE[s.code].bg }} aria-hidden />
                      </div>
                      {agent.notes.length > 0 && <p className="mt-1 text-xs italic text-muted">{agent.notes.join(" · ")}</p>}
                      <ul className="mt-3 flex-1 space-y-1 text-sm">
                        {agent.blocks.map((b) => (
                          <li key={b.id}>
                            <Link href={`/academy/blocks/${b.id}`} className="text-navy hover:underline">
                              <span className="font-mono text-xs text-muted">{b.id}</span> {b.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 flex gap-2">
                        <Link href={`/academy/lab?agent=${agent.slug}`} className="inline-flex items-center gap-1.5 rounded-lg bg-sodexo px-3 py-1.5 text-sm font-semibold text-white">
                          <FlaskConical size={14} /> Try in Lab
                        </Link>
                        <a href={agent.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-navy hover:border-sodexo">
                          Open in OS <ArrowUpRight size={14} />
                        </a>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6" id="prompts">
        <Eyebrow>Prompt library</Eyebrow>
        <h2 className="mt-2 text-3xl font-bold">{prompts.length} ready-to-use prompts</h2>
        <p className="mt-2 max-w-3xl text-muted">
          Replace the [brackets] with your own content. Use fictional or approved data only, and run the human checks before anything leaves your hands.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {prompts.map(({ block, tpl }) => (
            <article key={block.id} className="rounded-2xl bg-panel p-5">
              <div className="flex items-center justify-between gap-2">
                <Link href={`/academy/blocks/${block.id}`} className="font-semibold text-navy hover:underline">
                  <span className="font-mono text-xs text-muted">{block.id}</span> {block.name}
                </Link>
                <CopyButton text={tpl!.template} />
              </div>
              {tpl!.intro && <p className="mt-1 text-xs text-muted">{tpl!.intro}</p>}
              <p className="mt-3 whitespace-pre-wrap rounded-xl bg-white p-3 font-mono text-[12.5px] leading-relaxed text-ink">{tpl!.template}</p>
              <p className="mt-2 text-xs text-muted"><span className="font-semibold text-navy">Human check:</span> {block.verify}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
