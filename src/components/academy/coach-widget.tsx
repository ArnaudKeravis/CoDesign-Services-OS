"use client";

import { ArrowRight, Loader2, MessageCircle, Send, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/academy/cn";

type Msg = { role: "user" | "assistant"; content: string; links?: { title: string; href: string; kind: string }[] };

const SUGGESTIONS = [
  "How do I build a good persona?",
  "Credentials for stadium F&B",
  "Which agent helps with journey maps?",
  "How do XP and levels work?",
];

function DidiFace({ size = 36 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <path d="M32 4 L60 32 L32 60 L4 32 Z" fill="#1a6aff" />
      <path d="M32 4 L60 32 L32 32 Z" fill="#ffffff" fillOpacity={0.2} />
      <circle cx="24" cy="30" r="3.2" fill="white" />
      <circle cx="40" cy="30" r="3.2" fill="white" />
      <path d="M24 39 Q32 45 40 39" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M44 12 l2.4 -4 l2.4 4 z" fill="#ef3e42" />
    </svg>
  );
}

export function CoachWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"ai" | "offline" | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Hi, I'm Didi, your CoDesign coach. Ask me about any method block, credential, OS agent or how the Academy works.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || busy) return;
    setInput("");
    const history = messages.filter((m) => m.role === "user" || m !== messages[0]).map(({ role, content }) => ({ role, content }));
    setMessages((list) => [...list, { role: "user", content: message }]);
    setBusy(true);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, history, page: pathname }),
      });
      const json = (await res.json()) as { reply?: string; links?: Msg["links"]; mode?: "ai" | "offline" };
      setMode(json.mode ?? null);
      setMessages((list) => [...list, { role: "assistant", content: json.reply ?? "Sorry, I couldn't answer that.", links: json.links }]);
    } catch {
      setMessages((list) => [...list, { role: "assistant", content: "I'm offline right now. Try the search on the Learn page." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-navy py-2 pl-2 pr-4 text-white shadow-[0_12px_30px_-8px_rgba(41,56,150,0.7)] transition hover:bg-navy-deep",
          open && "pr-2",
        )}
        aria-expanded={open}
        aria-controls="didi-panel"
      >
        <span className="animate-float"><DidiFace size={34} /></span>
        {open ? <X size={18} aria-label="Close coach" /> : <span className="text-sm font-semibold">Ask Didi</span>}
      </button>

      {open && (
        <section
          id="didi-panel"
          className="fixed bottom-20 right-5 z-50 flex h-[min(560px,calc(100vh-7rem))] w-[min(400px,calc(100vw-2.5rem))] animate-rise flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-2xl"
          aria-label="Didi, CoDesign coach"
        >
          <header className="brand-gradient flex items-center gap-3 px-4 py-3 text-white">
            <DidiFace size={38} />
            <div className="flex-1">
              <p className="font-bold">Didi · CoDesign coach</p>
              <p className="text-xs text-white/80">
                {mode === "ai" ? "AI mode · grounded in the campus" : "Answers from the campus, credentials and OS"}
              </p>
            </div>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto bg-panel/50 p-4" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm",
                    m.role === "user" ? "rounded-br-md bg-sodexo text-white" : "rounded-bl-md bg-white text-ink shadow-sm",
                  )}
                >
                  {m.content}
                  {m.links && m.links.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1 border-t border-line pt-2">
                      {m.links.map((l) => (
                        <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex items-center gap-1 text-xs font-semibold text-sodexo hover:underline">
                          <ArrowRight size={12} /> {l.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-muted">
                <Loader2 size={14} className="animate-spin" /> Didi is thinking…
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-line bg-white px-3 py-1 text-xs text-navy hover:border-sodexo">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form
            className="flex items-center gap-2 border-t border-line p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <MessageCircle size={18} className="text-muted" aria-hidden />
            <label className="sr-only" htmlFor="didi-input">Message Didi</label>
            <input
              id="didi-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a block, a credential, an agent…"
              className="flex-1 bg-transparent text-sm outline-none"
              autoComplete="off"
            />
            <button type="submit" disabled={busy || !input.trim()} className="rounded-full bg-navy p-2 text-white disabled:opacity-40" aria-label="Send">
              <Send size={15} />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
