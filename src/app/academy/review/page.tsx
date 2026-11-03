import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader, Panel } from "@/components/academy/ui";
import { campus } from "@/lib/academy/campus";
import { extrasMeta } from "@/lib/academy/extras";
import { credentials, credentialSource } from "@/lib/credentials";

export const metadata: Metadata = { title: "Content review" };

export default function ReviewPage() {
  const missing = credentials.filter((c) => c.status === "to-complete");
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader
        eyebrow="Facilitators & content owners"
        title="Content review"
        lead={`${campus.meta.name} v${campus.meta.version} · ${campus.meta.date} · owner ${campus.meta.owner} · ${campus.meta.status}`}
      />
      <p className="mb-6 max-w-3xl text-sm text-muted">{campus.meta.note}</p>

      <section>
        <h2 className="text-2xl font-bold">Conflicts register</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-panel text-xs uppercase tracking-wider text-sodexo">
              <tr>
                <th className="p-3">Topic</th>
                <th className="p-3">Sources say</th>
                <th className="p-3">Proposed resolution</th>
                <th className="p-3">Owner</th>
              </tr>
            </thead>
            <tbody>
              {campus.conflicts.map((c) => (
                <tr key={c.topic} className="border-t border-line align-top">
                  <td className="p-3 font-semibold text-navy">{c.topic}</td>
                  <td className="p-3">{c.sources_say}</td>
                  <td className="p-3">{c.proposed_resolution}</td>
                  <td className="p-3">{c.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-2">
        <Panel title="Credentials to complete">
          <p className="text-sm">
            {missing.length} pages of “{credentialSource.name}” are empty placeholders (owner {credentialSource.owner}):
          </p>
          <p className="mt-2 text-sm font-semibold text-navy">{missing.map((c) => c.client).join(" · ")}</p>
          <p className="mt-2 text-xs text-muted">{credentialSource.note}</p>
        </Panel>
        <Panel title="New Academy v2 content to validate">
          <ul className="space-y-1 text-sm">
            <li>• 12 scenario challenges and 4 Credential Quests ({extrasMeta.status}, owner {extrasMeta.owner})</li>
            <li>• Generated quizzes, podcast scripts and motion explainers (derived from the method cards)</li>
            <li>• Three role-based learning paths</li>
            <li>• Glossary and XP ranks</li>
          </ul>
        </Panel>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Sources</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {campus.sources.map((s) => (
            <article key={s.id} className="rounded-2xl border border-line p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-navy"><span className="font-mono text-xs text-muted">{s.id}</span> {s.name}</p>
                {s.url && (
                  <a href={s.url} target="_blank" rel="noreferrer" className="shrink-0 text-sodexo" aria-label={`Open ${s.name}`}><ArrowUpRight size={16} /></a>
                )}
              </div>
              <p className="mt-1 text-xs text-muted">{s.version} · {s.status} · owner {s.owner}</p>
              {s.gap && <p className="mt-2 text-sm"><span className="font-semibold">Gap:</span> {s.gap}</p>}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
