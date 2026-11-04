"use client";

import { Check, Copy, ExternalLink, Search, ShieldAlert, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { campus } from "@/lib/academy/campus";
import { cn } from "@/lib/academy/cn";

import { CredentialTile, SegmentTag } from "./credential-tile";
import {
  allThemes,
  blocksForCredential,
  credentialById,
  credentialImage,
  credentials,
  searchCredentials,
  SEGMENT_LABEL,
  type Credential,
  type CredentialSegment,
} from "@/lib/credentials";

const SEGMENTS: (CredentialSegment | "ALL")[] = ["ALL", "WORK", "PLAY", "HEAL", "LEARN", "OTHER"];

function proofPoint(c: Credential): string {
  const lead = c.outcome[0] ?? c.deliverables[0] ?? "";
  return `${c.client}${c.year ? ` (${c.year})` : ""} — ${c.title}. ${c.hmw || c.challenge} Proof point: ${lead}. [Source: Digital & AI Credentials deck, p.${c.page} — verify before use]`;
}

export function CredentialDetail({ credential, onClose }: { credential: Credential; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const figures = [
    { k: "Country", v: credential.country },
    { k: "Amount", v: credential.amount },
    { k: "Type", v: credential.dealType },
    { k: "Impact", v: credential.impact },
    { k: "Year", v: credential.year ? String(credential.year) : "" },
  ];

  return (
    <div className="fixed inset-0 z-[55] flex justify-end bg-navy-deep/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={credential.client} onClick={onClose}>
      <div className="h-full w-full max-w-2xl animate-rise overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white/95 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <SegmentTag segment={credential.segment} />
            <span className="text-sm text-muted">Deck page {credential.page}</span>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-panel" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-6 p-6">
          <div>
            <h2 className="text-3xl font-bold">{credential.client}</h2>
            <p className="mt-1 text-lg italic text-sodexo">{credential.title}</p>
          </div>
          <a href={credentialImage(credential)} target="_blank" rel="noreferrer" className="relative block aspect-[16/9] overflow-hidden rounded-xl border border-line">
            <Image src={credentialImage(credential)} alt={`Slide for ${credential.client}`} fill sizes="640px" className="object-cover object-top" />
            <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-navy">
              <ExternalLink size={12} /> Open slide
            </span>
          </a>

          <div className="brand-gradient grid grid-cols-2 gap-3 rounded-xl p-4 text-white sm:grid-cols-5">
            {figures.map((f) => (
              <div key={f.k}>
                <p className="text-[10px] uppercase tracking-wider text-white/70">{f.k}</p>
                <p className="text-sm font-bold">{f.v || "—"}</p>
              </div>
            ))}
          </div>
          <p className="flex items-start gap-2 rounded-lg bg-[#fff6ef] px-3 py-2 text-xs text-[#a4470f]">
            <ShieldAlert size={14} className="mt-0.5 shrink-0" />
            Amounts and impacts are internal figures from the deck. A credential proves a project is referenced — verify figures and sharing permission in SharePoint before external use.
          </p>

          {credential.hmw && (
            <blockquote className="rounded-xl bg-panel p-4 text-base font-medium italic text-navy">{credential.hmw}</blockquote>
          )}
          {[
            { n: 1, t: "Challenge", body: credential.challenge, list: [] as string[] },
            { n: 2, t: "Approach", body: "", list: credential.approach },
            { n: 3, t: "Outcome", body: "", list: credential.outcome.length ? credential.outcome : credential.deliverables },
          ].map((step) =>
            step.body || step.list.length ? (
              <section key={step.t} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sodexo text-sm font-bold text-white">{step.n}</span>
                <div>
                  <h3 className="font-bold">{step.t}</h3>
                  {step.body && <p className="mt-1 text-sm text-ink">{step.body}</p>}
                  {step.list.length > 0 && (
                    <ul className="mt-1 space-y-1 text-sm">
                      {step.list.map((item) => (
                        <li key={item} className="flex gap-2">
                          <Check size={14} className="mt-0.5 shrink-0 text-s05" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ) : null,
          )}
          {credential.results && (
            <section className="rounded-xl border border-s05/40 bg-[#effaf4] p-4">
              <h3 className="font-bold !text-s05">Results</h3>
              <p className="mt-1 text-sm">{credential.results}</p>
            </section>
          )}
          {(credential.deliverables.length > 0 || credential.kpis.length > 0) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {credential.deliverables.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sodexo">Deliverables</h4>
                  <ul className="mt-1 text-sm">{credential.deliverables.map((d) => <li key={d}>• {d}</li>)}</ul>
                </div>
              )}
              {credential.kpis.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sodexo">KPI</h4>
                  <ul className="mt-1 text-sm">{credential.kpis.map((d) => <li key={d}>• {d}</li>)}</ul>
                </div>
              )}
            </div>
          )}
          {credential.status === "complete" && (
            <section className="rounded-xl border border-line p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider !text-sodexo">Use it in training</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {blocksForCredential(credential, campus.blocks).map((b) => (
                  <Link key={b.id} href={`/academy/blocks/${b.id}#examples`} className="rounded-lg bg-panel px-2.5 py-1 text-xs font-semibold text-navy hover:bg-panel-2">
                    {b.id} {b.name}
                  </Link>
                ))}
                <Link href="/academy/credentials" className="rounded-lg bg-sodexo px-2.5 py-1 text-xs font-semibold text-white">Credential Quest →</Link>
              </div>
            </section>
          )}
          {credential.status === "complete" && (
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(proofPoint(credential));
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1800);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-deep"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied with source" : "Copy proof point with source"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CredentialsBrowser({ basePath }: { basePath: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [segment, setSegment] = useState<CredentialSegment | "ALL">((params.get("segment") as CredentialSegment) ?? "ALL");
  const [theme, setTheme] = useState<string>("");
  const [format, setFormat] = useState<"ALL" | Credential["format"]>("ALL");
  const [drafts, setDrafts] = useState(false);
  const openId = params.get("id");
  const open = openId ? credentialById(openId) : undefined;

  const results = useMemo(
    () => searchCredentials({ query, segment, theme: theme || undefined, format, includeDrafts: drafts }),
    [query, segment, theme, format, drafts],
  );
  const themes = useMemo(() => allThemes().slice(0, 14), []);
  const toComplete = credentials.filter((c) => c.status === "to-complete").length;

  const setOpen = (id?: string) => {
    const next = new URLSearchParams(params.toString());
    if (id) next.set("id", id);
    else next.delete("id");
    router.replace(`${basePath}${next.toString() ? `?${next}` : ""}`, { scroll: false });
  };

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-4 space-y-3 border-b border-line bg-white/95 px-4 py-4 backdrop-blur md:mx-0 md:rounded-2xl md:border md:px-5">
        <label className="flex items-center gap-3 rounded-xl border border-line bg-panel px-4 py-3 focus-within:border-sodexo">
          <Search size={18} className="text-muted" aria-hidden />
          <span className="sr-only">Search credentials</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a client, sector or deliverable — e.g. “stadium F&B”, “care home dining”, “personas roadmap”"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="text-muted">
              <X size={16} />
            </button>
          )}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {SEGMENTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSegment(s)}
              aria-pressed={segment === s}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold transition",
                segment === s ? "border-navy bg-navy text-white" : "border-line text-navy hover:border-navy",
              )}
            >
              {s === "ALL" ? "All segments" : SEGMENT_LABEL[s]}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-line" aria-hidden />
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as typeof format)}
            className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-navy"
            aria-label="Format"
          >
            <option value="ALL">All formats</option>
            <option value="case-study">Case studies</option>
            <option value="card">Short cards</option>
          </select>
          <label className="flex items-center gap-1.5 text-xs text-muted">
            <input type="checkbox" checked={drafts} onChange={(e) => setDrafts(e.target.checked)} />
            Show {toComplete} pages to complete
          </label>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {themes.map(({ theme: t, count }) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(theme === t ? "" : t)}
              aria-pressed={theme === t}
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] transition",
                theme === t ? "bg-sodexo text-white" : "bg-panel text-navy hover:bg-panel-2",
              )}
            >
              {t} <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm text-muted" aria-live="polite">
        {results.length} credential{results.length === 1 ? "" : "s"}
      </p>
      <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((c) => (
          <button key={c.id} type="button" onClick={() => setOpen(c.id)} className="block h-full rounded-2xl text-left">
            <CredentialTile credential={c} />
          </button>
        ))}
      </div>
      {results.length === 0 && (
        <p className="mt-10 rounded-2xl bg-panel p-8 text-center text-muted">
          No credential matches. For LEARN (education) there is no verified credential yet: use a cross-sector case and say so openly.
        </p>
      )}
      {open && <CredentialDetail credential={open} onClose={() => setOpen()} />}
    </div>
  );
}
