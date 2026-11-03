# CoDesign-Services-OS

Sodexo CoDesign Services platform: **CoDesign** (offer, method, credentials), **OS** (CoDesign OS agent map and prompt library) and the **CoDesign Academy v2**.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # curriculum and v2 logic tests
npm run build      # production build (needs internet for Google Fonts)
```

Optional environment variables (see `.env.example`):

| Variable | Effect |
|---|---|
| `ACCESS_CODE` | Puts the whole platform behind a shared team code. **Set it on any deployment**: the credentials include internal contract figures. |
| `ANTHROPIC_API_KEY` | Turns on live AI for the Didi coach and the Agent Lab (server-side only). Without it, both run in offline mode grounded in the campus content. |
| `ANTHROPIC_MODEL` | Model id, default `claude-sonnet-4-5`. |

## Map

| Route | What |
|---|---|
| `/` | Landing page with the three entries |
| `/codesign`, `/codesign/credentials` | Five phases, levels, credentials library |
| `/os` | Agent map by phase, prompt library, links into the live OS |
| `/academy` | Dashboard: profile and avatar, XP/rank/streak, campus map, up next, daily challenge |
| `/academy/learn`, `/academy/blocks/[id]` | 35 blocks; each lesson has six lanes: Method · Watch & listen · Practice · Examples & credentials · AI & tools · Self-check |
| `/academy/challenges` | 12 scenario challenges |
| `/academy/lab` | Agent Lab: fill a prompt with a fictional case, run, tick human checks |
| `/academy/cases/[segment]` | WORK / PLAY / HEAL / LEARN fictional case packs with activities |
| `/academy/credentials` | Credential Quest + library |
| `/academy/media` | All motion explainers and podcasts |
| `/academy/paths` | Role paths, Format A/B learning routes, rehearsal, calendar |
| `/academy/me` | Rank ladder, badges, maturity, history, glossary, export/reset |
| `/academy/review` | Conflicts register, sources, content to complete |

## Content

- `src/lib/academy/data/*.json` — campus content from the CoDesign Academy pack (v2.1, owner Diane). Identical to the Miro export in the Cursor kit (`content/cursor-kit`).
- `src/lib/academy/data/challenges.json` — new in v2: scenario challenges, Credential Quests, glossary (draft for review).
- `src/lib/credentials/credentials.json` + `public/credentials/p01–p45.jpg` — imported from "Digital & AI — Credentials (GOOD VERSION)". Nine deck pages are empty placeholders and show as "To complete".
- Quizzes, podcast scripts and motion explainers are generated from the method cards in `src/lib/academy/learning.ts`, so they stay in sync when the content changes.
- `docs/BENCHMARK.md` — L&D platform benchmark behind the v2 design.

## Things to know

- Progress, profile and answers are stored in the browser (`localStorage`). There is no account yet.
- Model answers unlock after a learner submits their own answer; they are in the page bundle, so they are not secret.
- Case packs are fictional training data and are labelled as such everywhere.
- Narration uses the browser's built-in speech; recorded video and studio audio are marked "to add".
