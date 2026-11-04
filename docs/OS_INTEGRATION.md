# Integrating the Academy into CoDesign OS

Goal: from inside CoDesign OS (`sodexo-codesign-os.vercel.app`), people see an **Academy** tab in the header, land on a **start page with the three entrances** after sign-in, and find **"Train on this agent"** on every agent page. The Academy already links back to each OS agent.

The OS source is not in this repository. The OS needs three small changes, all listed below. Everything else is served by this app, so the OS never has to copy Academy content.

## 1. Deploy this app

Deploy it, e.g. to `https://codesign-academy.vercel.app`, with `ACCESS_CODE` set. Using the same code as the OS keeps sign-in simple. Below, `ACADEMY_ORIGIN` means that URL.

## 2. Add the bridge to every OS page

Before `</body>` in every OS page, or once in a shared layout or partial:

```html
<script src="ACADEMY_ORIGIN/os-bridge.js" defer></script>
```

What the bridge does:

| Where | Effect |
|---|---|
| Every page | Appends an **Academy** tab (with a NEW badge) to the header nav. It copies the class of the existing nav links, so it matches the OS style. |
| `/agents/<name>-agent` pages | Adds a **Train on this agent** card with five steps (learn the method → watch/listen → practise → try in the Lab → use it here), the target level, links to the related lessons and the full agent guide. |
| Any element with `data-academy-href="/path"` | Rewrites its `href` to the Academy, so OS pages can link to any Academy page without hard-coding the domain. |

Options, as attributes on the script tag:

- `data-nav="<css selector>"` — where to put the tab, if the OS header is not found automatically. Use `data-nav="off"` to skip the tab.
- `data-panel="<css selector>"` — render the training card inline in that element instead of as a floating card.
- `data-academy="<origin>"` — override the Academy origin.

The bridge runs in a Shadow DOM, adds no global CSS and is excluded from the Academy access gate. It contains only method content, no credentials.

## 3. Add the start page with the three entrances

1. Copy `integrations/codesign-os/start.html` to the OS root and replace `ACADEMY_ORIGIN`.
2. In the OS login page, send people to the start page after sign-in. In `safeNext()`, change the fallback from `'index.html'` to `'start.html'`.

The start page uses the OS fonts and palette (Fraunces, Inter Tight, the phase colours). Its three entries are CoDesign (`/codesign`), OS (`/`) and Academy (`/academy`).

## Links already in place on the Academy side

- Header: CoDesign · OS · Academy. The landing page has the same three entrances.
- `/os`: agent map. Every card has **How to train on it · guide**, **Try in Lab** and **Open in OS**.
- `/os/agents/<slug>`: when to use the agent, the prompt to start from, human checks, related credentials, and a **How to train on this agent** checklist that ticks itself from the learner's Academy progress.
- Lessons (`/academy/blocks/<id>`): a "Use it with CoDesign OS" strip on the Method tab, and Guide + OS links on the AI & tools tab.
- Credentials: each credential lists the blocks it helps teach and links to the Credential Quest.

## Optional, later: one domain

To serve the Academy under the OS domain (`/academy/...`), add a rewrite to the OS `vercel.json` and give this app a `basePath`. This also needs static asset paths (`/credentials/*.jpg`) prefixed with the base path. It's not required for the bridge.
