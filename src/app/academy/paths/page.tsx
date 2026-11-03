import type { Metadata } from "next";

import { PathProgress } from "@/components/academy/path-progress";
import { BlockChip, Eyebrow, PageHeader, Panel } from "@/components/academy/ui";
import { blockById, campus, expandRouteToken } from "@/lib/academy/campus";

export const metadata: Metadata = { title: "Learning paths" };

const ROLE_PATHS = [
  {
    title: "Spot and sell CoDesign",
    audience: "Sales / BRM · N0–N1",
    tone: "#1a6aff",
    tokens: ["01.*", "02.01", "02.02", "02.03", "06.X6"],
  },
  {
    title: "Facilitate a workshop",
    audience: "Facilitators & champions · N1–N2",
    tone: "#2ea36a",
    tokens: ["04.05", "04.06", "04.07", "05.01", "05.02", "05.03", "05.05", "05.06", "05.07", "06.01"],
  },
  {
    title: "Run an engagement end to end",
    audience: "Practitioners · N2–N3",
    tone: "#ec6a1e",
    tokens: ["03.01", "03.02", "03.03", "03.04", "04.01", "04.02", "04.03", "04.04", "05.04", "06.02", "06.03", "06.X1-X6"],
  },
];

const ROUTE_LABEL: Record<string, string> = {
  study: "Study before",
  practise: "Practise in the session",
  observe: "Observe the facilitator",
  defer: "Later / out of scope",
};

export default function PathsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageHeader eyebrow="Paths" title="Pick a path that fits your role" lead="Paths group the blocks you need for a job to be done. Completing a path builds toward a level; a coach confirms N3 and above." />
      <div className="grid gap-5 lg:grid-cols-3">
        {ROLE_PATHS.map((p) => (
          <PathProgress key={p.title} title={p.title} audience={p.audience} tone={p.tone} blockIds={p.tokens.flatMap(expandRouteToken)} />
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">Role paths are proposed by Academy v2 — to validate with Diane.</p>

      <section className="mt-14 space-y-10">
        <div>
          <Eyebrow>Training sessions</Eyebrow>
          <h2 className="mt-1 text-3xl font-bold">Workshop formats</h2>
        </div>
        {(["A", "B"] as const).map((code) => {
          const format = campus.workshop_formats[code];
          const total = format.agenda.reduce((sum, item) => sum + item.minutes, 0);
          return (
            <div key={code} className="rounded-3xl border border-line bg-white p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-2xl font-bold">Format {code} · {format.name}</h3>
                <span className="text-sm text-muted">{format.agenda[0].start}–{format.agenda[format.agenda.length - 1].end} · {total} min</span>
              </div>
              <div className="mt-5 flex h-10 overflow-hidden rounded-xl" aria-hidden>
                {format.agenda.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center border-r border-white text-[10px] font-semibold text-white"
                    style={{ width: `${(item.minutes / total) * 100}%`, background: /break|lunch/i.test(item.activity) ? "#c7cede" : ["#293896", "#1a6aff", "#8e5cc8", "#ec6a1e", "#2ea36a", "#e0508f"][i % 6] }}
                    title={item.activity}
                  >
                    {item.minutes >= 20 ? item.start : ""}
                  </div>
                ))}
              </div>
              <ol className="mt-4 grid gap-x-6 gap-y-1.5 text-sm md:grid-cols-2">
                {format.agenda.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-24 shrink-0 font-mono text-xs text-muted">{item.start}–{item.end}</span>
                    <span className="text-navy">{item.activity}</span>
                    <span className="ml-auto text-xs text-muted">{item.minutes}′</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {(Object.keys(ROUTE_LABEL) as (keyof typeof format.learning_route)[]).map((key) => (
                  <Panel key={key} title={ROUTE_LABEL[key]}>
                    <div className="flex flex-wrap gap-1.5">
                      {format.learning_route[key].flatMap(expandRouteToken).map((id) => {
                        const b = blockById(id);
                        return b ? <BlockChip key={id} block={b} className="px-2 py-1 text-xs" /> : null;
                      })}
                    </div>
                  </Panel>
                ))}
              </div>
            </div>
          );
        })}

        <div className="grid gap-5 md:grid-cols-2">
          <Panel title="Internal rehearsal · 60 min">
            <ol className="space-y-1.5 text-sm">
              {campus.rehearsal_template.map((r) => (
                <li key={r.segment} className="flex justify-between"><span>{r.segment}</span><span className="text-muted">{r.minutes}′</span></li>
              ))}
            </ol>
          </Panel>
          <Panel title="Proposed calendar">
            <ul className="space-y-2 text-sm">
              {campus.proposed_calendar.map((c) => (
                <li key={c.when}>
                  <span className="font-semibold text-navy">{c.when}</span> — {c.what}
                  <span className="block text-xs text-muted">{c.owner} · {c.status}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>
    </main>
  );
}
