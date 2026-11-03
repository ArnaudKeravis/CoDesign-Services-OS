# M1 — Foundations (paste after you said "go")

Build milestone M1. Follow @.cursor/rules/codesign-campus.mdc.

1. Scaffold Next.js 15 + TypeScript strict + Tailwind + shadcn/ui + next-intl (EN, FR). Add Vitest and Playwright.
2. Supabase: migrations for the full data model in @prompts/00_START_HERE.md, RLS on every table. `block_answer_keys` readable only by role facilitator/admin.
3. `scripts/seed.ts`: validate @content/campus-content.json with Zod and import sections, lanes, levels, 35 blocks, links, case packs, session templates. Fail loudly on missing fields. Test: 6 sections, 6 lanes, 35 blocks (25 source, 4 foundation, 6 proposed), 4 case packs.
4. Design system components: PhasePill, LevelBar, ProcessSteps, MethodColumns, ExampleBar, PrincipleBar, LaneTabs, SegmentSwitcher, ImageSlot, CasePackBanner, ProposedRibbon, MaturityCards. Add a /styleguide page.
5. Pages (read-only):
   - `/` campus map: six sections as a horizontal row (colour, icon, block count), the taxonomy sentence, a "Start here" path and the N0–N4 ladder.
   - `/sections/[code]`: cover with pill "PROCESS SECTION n/5" (01 = "INTRODUCTION"), title, purpose, block list with level badges.
   - `/blocks/[id]`: header (pill "04 DEFINE · 2/7", sub-stage caps, LevelBar with target highlighted, title, objective in italics) then six lane tabs:
     A Method: numbered steps (two rows if more than 6) + three columns (who/when · inputs/output · quality/mistakes/handoff).
     B Training: learning objective, explanation, worked example, discussion question.
     C Practice: situation, questions, roles, timebox (exercise is read-only in M1).
     D Examples: example bar, principle or minimum-standard bar, 3 ImageSlots, segment variants, credential note.
     E Enablers: templates and links (gaps shown as "To add · owner"), tools, deck, OS agent links or "No specialised agent", prompt with copy button, human checks, manual fallback.
     F Assessment: MaturityCards (Not yet / With support / On my own / I could coach), success criteria, next action.
     Plus "Open in Miro" (miro_frame_url) and a SegmentSwitcher WORK/PLAY/HEAL/LEARN.
   - `/cases/[segment]` with the fictional banner.
6. Search and filters: section, lane, level, segment, OS agent available, template available/missing.
Acceptance: every block page renders all six lanes or a clear "To add" state; Lighthouse ≥ 90 accessibility on /blocks/04.02. Stop and report.
