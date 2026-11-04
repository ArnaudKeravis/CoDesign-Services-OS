import { agentTrainings } from "@/lib/os/training";

export const dynamic = "force-static";

const DATA = {
  entries: [
    { label: "CoDesign", path: "/codesign" },
    { label: "Academy", path: "/academy" },
  ],
  agents: agentTrainings.map((t) => ({
    slug: t.slug,
    name: t.name,
    level: t.level,
    tone: t.levelTone,
    guide: t.guide,
    blocks: t.blocks.map((b) => ({ id: b.id, name: b.name, lesson: b.lesson })),
    steps: t.steps.filter((s) => s.id !== "use").map((s) => ({ label: s.label, detail: s.detail, href: s.href })),
  })),
};

/**
 * Loaded by CoDesign OS pages with
 *   <script src="https://<academy-host>/os-bridge.js" defer></script>
 * Options (data attributes on the script tag):
 *   data-nav="<css selector>" header element to append the Academy tab to, or "off"
 *   data-panel="<css selector>" container for the training card on agent pages (default: floating card)
 *   data-academy="<origin>" override the Academy origin (default: the script's own origin)
 */
const SCRIPT = `(() => {
  if (window.__codesignAcademyBridge) return;
  window.__codesignAcademyBridge = true;
  const script = document.currentScript;
  const opts = (script && script.dataset) || {};
  const BASE = (opts.academy || (script ? new URL(script.src).origin : "")).replace(/\\/$/, "");
  const DATA = ${JSON.stringify(DATA)};
  const abs = (p) => (/^https?:/.test(p) ? p : BASE + p);
  const css = "--cd-ink:var(--ink,#0A0A0A);--cd-muted:var(--ink-muted,#6B6B6B);--cd-line:var(--line,#E5E3DC);--cd-paper:var(--paper,#fff);--cd-accent:var(--define,#2563EB);font-family:var(--font-body,'Inter Tight',system-ui,sans-serif);";

  function rewriteLinks() {
    document.querySelectorAll("[data-academy-href]").forEach((a) => a.setAttribute("href", abs(a.getAttribute("data-academy-href"))));
  }

  function addTab() {
    if (opts.nav === "off" || document.querySelector("[data-codesign-academy-tab]")) return;
    const nav = (opts.nav ? [opts.nav] : ["header nav", "nav", ".nav", "header"]).map((sel) => document.querySelector(sel)).find(Boolean);
    const link = document.createElement("a");
    link.href = abs("/academy");
    link.textContent = "Academy";
    link.setAttribute("data-codesign-academy-tab", "");
    link.title = "CoDesign Academy: learn and practise the method and the agents";
    if (nav) {
      const sample = Array.from(nav.querySelectorAll("a")).pop();
      if (sample) link.className = sample.className.replace(/\\b(active|is-active|current|selected)\\b/g, "").trim();
      else link.style.cssText = "margin-left:12px;font-weight:600;color:inherit;text-decoration:none;";
      const badge = document.createElement("span");
      badge.textContent = "NEW";
      badge.style.cssText = "margin-left:6px;padding:1px 5px;border-radius:999px;background:var(--define,#2563EB);color:#fff;font-size:9px;font-weight:700;letter-spacing:.06em;vertical-align:middle;";
      link.appendChild(badge);
      nav.appendChild(link);
    } else {
      link.style.cssText = css + "position:fixed;top:14px;right:16px;z-index:9999;padding:8px 14px;border-radius:999px;background:var(--cd-ink);color:#fff;font-size:13px;font-weight:600;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.18);";
      document.body.appendChild(link);
    }
  }

  function agentFromPath() {
    const m = location.pathname.match(/\\/agents\\/([a-z0-9-]+?)(?:-agent)?(?:\\.html)?\\/?$/);
    return m ? DATA.agents.find((a) => a.slug === m[1]) : undefined;
  }

  function addPanel(agent) {
    const host = document.createElement("div");
    host.setAttribute("data-codesign-academy-panel", "");
    const target = opts.panel ? document.querySelector(opts.panel) : null;
    const floating = !target;
    const root = host.attachShadow({ mode: "open" });
    const steps = agent.steps.map((s, i) =>
      '<li><a href="' + abs(s.href) + '" target="_blank" rel="noopener"><span class="n">' + (i + 1) + '</span><span><b>' + s.label + '</b><small>' + s.detail + '</small></span></a></li>'
    ).join("");
    const blocks = agent.blocks.map((b) => '<a class="chip" href="' + abs(b.lesson) + '" target="_blank" rel="noopener">' + b.id + " " + b.name + "</a>").join("");
    root.innerHTML =
      '<style>' +
      ':host{' + css + '}' +
      '.card{background:var(--cd-paper);border:1px solid var(--cd-line);border-radius:16px;box-shadow:0 18px 48px rgba(10,10,10,.14);color:var(--cd-ink);width:340px;max-width:calc(100vw - 32px);overflow:hidden}' +
      '.fixed{position:fixed;right:16px;bottom:16px;z-index:9998}' +
      '.head{display:flex;align-items:center;gap:10px;padding:12px 14px;cursor:pointer;background:linear-gradient(160deg,#1238c4,#1a6aff);color:#fff;border:0;width:100%;text-align:left;font:inherit}' +
      '.head b{font-size:14px}.head small{display:block;font-size:11px;color:#fff;opacity:.85}' +
      '.lvl{margin-left:auto;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;background:#fff;color:' + agent.tone + '}' +
      '.body{padding:12px 14px 14px}.body[hidden]{display:none}' +
      'ol{list-style:none;margin:0;padding:0;display:grid;gap:6px}' +
      'ol a{display:flex;gap:10px;align-items:flex-start;padding:8px 10px;border:1px solid var(--cd-line);border-radius:10px;color:inherit;text-decoration:none;font-size:13px}' +
      'ol a:hover{border-color:var(--cd-accent)}' +
      '.n{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:#f3f6fc;color:#293896;font-weight:700;font-size:11px}' +
      'small{display:block;color:var(--cd-muted);font-size:11.5px;margin-top:1px}' +
      '.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.chip{font-size:11.5px;padding:3px 8px;border-radius:8px;background:#f3f6fc;color:#293896;text-decoration:none}' +
      '.foot{display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:12px}.foot a{color:var(--cd-accent);font-weight:600;text-decoration:none}' +
      '.here{color:var(--cd-muted)}' +
      '</style>' +
      '<div class="card' + (floating ? ' fixed' : '') + '">' +
      '<button class="head" type="button" aria-expanded="' + (!floating) + '"><span><b>Train on this agent</b><small>CoDesign Academy · ' + agent.name + '</small></span><span class="lvl">' + agent.level + '</span></button>' +
      '<div class="body"' + (floating ? ' hidden' : '') + '>' +
      '<ol>' + steps + '<li><a aria-current="page"><span class="n">5</span><span><b>Use it here, in CoDesign OS</b><small class="here">Approved inputs only. The draft is never final.</small></span></a></li></ol>' +
      '<div class="chips">' + blocks + '</div>' +
      '<div class="foot"><a href="' + abs(agent.guide) + '" target="_blank" rel="noopener">Full agent guide →</a><a href="' + abs("/academy") + '" target="_blank" rel="noopener">Academy</a></div>' +
      '</div></div>';
    const head = root.querySelector(".head");
    const body = root.querySelector(".body");
    head.addEventListener("click", () => {
      body.hidden = !body.hidden;
      head.setAttribute("aria-expanded", String(!body.hidden));
    });
    (target || document.body).appendChild(host);
  }

  function run() {
    rewriteLinks();
    addTab();
    const agent = agentFromPath();
    if (agent) addPanel(agent);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
`;

export function GET() {
  return new Response(SCRIPT, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=3600",
      "access-control-allow-origin": "*",
    },
  });
}
