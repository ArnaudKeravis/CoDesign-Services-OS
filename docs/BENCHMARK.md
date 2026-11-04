# L&D platform benchmark — CoDesign Academy v2

Goal: make the CoDesign Academy simple, interactive and motivating for non-designers (Sales/BRM, site and operations managers) as well as for the CoDesign team, while keeping the method rigorous (levels N0–N4, human-led AI, sourced credentials).

The benchmark covers the patterns each platform is known for, based on their public product experience. It is a design input, not a feature-by-feature audit.

## Platforms reviewed

| Platform | Type | What it does best | Pattern we take |
|---|---|---|---|
| Salesforce Trailhead | Corporate, gamified | Trails, modules and units; points, ranks and badges; hands-on challenges checked in a sandbox ("Playground") | **XP ranks + badges**, **hands-on lab** with a safe sandbox (our Agent Lab), modules grouped into trails (our paths) |
| Duolingo | Consumer micro-learning | Daily streaks, XP, short lessons, instant feedback, friendly mascot | **Streaks**, **daily challenge**, **instant feedback**, a **mascot coach** (Didi) |
| Brilliant | Interactive STEM | Learn by doing: every concept is an interactive problem | **Interactive first**: quiz, step ordering, journey stage picking, dot-voting |
| Coursera / edX | MOOC | Structured courses, video + quiz + peer-graded assignment, certificates | **Lesson = video + reading + quiz + assignment** per block; model answer after submission |
| LinkedIn Learning | Corporate video library | Short expert videos, role-based learning paths, skills tagging | **Role-based paths** (Sales/BRM, Facilitator, Practitioner), short explainers |
| Degreed | Learning experience platform | Skill profiles, self-assessment and certified skill levels | **Self-check before/after** per block; separate **self-assessed** from **certified** levels |
| 360Learning | Collaborative learning | Peer-authored courses, comments, reactions, expert reviewers | Content owners and review status on every record; content review page (next: comments) |
| Docebo / Cornerstone | Enterprise LMS | Compliance, cohorts, assignments, reporting, SSO | Planned for v3 with login: cohorts, facilitator console, reporting |
| IDEO U | Design thinking courses | Case-based learning, real project stories, workbooks | **Fictional case packs** + **real credentials** side by side, workbook-style exercises |
| Miro Academy | Tool training | Templates in context, learn inside the tool | Every block links to its **Miro frame** and templates |
| Khan Academy | Mastery learning | Mastery levels, hints, retry until mastered | Retry quizzes, "pass with 3/5", block completion = read + quiz + exercise |
| Spotify / podcast apps | Audio | Episodes, playlists, speed control, transcripts | **Podcast per block** with transcript, playback speed and playlist (Watch & listen) |
| Google Skillshop | Certification | Short modules leading to an assessed certification | XP ranks never grant N3: certification needs coach observation with the rubric |

## Principles we keep

1. **One block, five ways in.** Every method card can be read, watched, heard, practised and applied. Learners choose; completion asks for the three that prove understanding (read, quiz, exercise).
2. **Interactive before informative.** Each screen asks the learner to do something within a few seconds (choose, order, vote, write).
3. **Reward activity, certify competence.** XP, ranks, streaks and badges reward learning activity. N-levels stay competency levels confirmed by a coach — "attending a session never grants N3".
4. **Human-led, AI-supported, visibly.** The Agent Lab and the coach show AI drafts as drafts. Reuse is unlocked only after the human checklist.
5. **Real proof, honestly framed.** Credentials are searchable everywhere, with the reminder that a credential proves a project exists; figures are internal until verified.
6. **Privacy by default.** First name only, progress stored in the browser, no tracking cookies. Optional team access code.
7. **Brand-consistent.** The V3 template kit: navy titles, Sodexo blue, the flowing wave panel, section colours, level colours, 12–16 px radii, generous whitespace.

## What v2 ships

| Need from the brief | v2 feature |
|---|---|
| Simple, clear, UX/UI optimised | Platform header (CoDesign · OS · Academy), 3-entry landing, Academy sub-nav, campus map as a Double Diamond, lessons in six lanes (A–F) |
| More exercises | Per block: 4–5 question quiz, process ordering, case exercise with model answer and self-check; 12 scenario challenges; 4 Credential Quests; journey and HMW activities in case packs |
| Videos | 35 motion explainers (animated scenes + narration + captions) generated from the cards |
| Podcasts | 35 two-voice "CoDesign in five" episodes with transcript and speed control |
| Gamification, rewards, levels | XP, six ranks, 18 badges, day streaks, daily challenge, progress rings, path progress |
| Avatar / chat helper | Avatar builder; Didi coach chat grounded in campus, credentials, agents and glossary (live AI optional) |
| Credential search | Credentials library (45 deck pages imported) with search, segment/theme/format filters, slide preview, copy-with-source |
| OS agents and prompts in the training | OS agent map, prompt library, Agent Lab with prefilled fictional cases and human checks; links into the live OS |

## Next (v3)

- Staff login (SSO or magic link) and server-side progress; facilitator console for live sessions (join code, push activities, unlock answer keys) as specified in the Cursor kit prompts M2–M4.
- Real recorded videos and studio podcasts in the existing slots; image slots for examples.
- Coach-scored rubric for N2–N4, cohort leaderboards (opt-in), Miro export.
- Comments and reactions on blocks (360Learning pattern) for content feedback.
