# M2 — Live session core

Build milestone M2. Follow the project rules.

1. Session creation from a template (Format A, Format B, Rehearsal 60). Facilitator can duplicate, edit agenda items and timings, choose blocks per item and the learning route (study / practise / observe / defer). Generate a 6-character join code and QR code.
2. `/join` and `/s/[code]`: participant enters a first name, is auto-assigned to a group (4–6 people) or picks one; sees "what to do now", time left, the block card in short form, the group's case pack, a help button.
3. `/facilitate/[sessionId]`: agenda timeline with live countdown, current item on air, next item preview, "push to participants", timer controls (+2 min, pause, skip), group grid with live progress and submissions, raise-hand queue, private notes, role rotation at breaks (facilitator, evidence keeper, scribe, challenger, presenter) with a role card on each phone.
4. `/present/[sessionId]`: projector layout, 28 px minimum, big timer, instructions, live results.
5. Realtime with Supabase channels: agenda state, pushes, submissions, polls. Target latency under 1 s with 30 participants.
6. Live interactions: poll (single/multi), word cloud, 1–5 confidence check, dot voting.
7. Session close: summary (decisions, owners, next steps), feedback form (5 questions from the content file), export Markdown.
Acceptance (Playwright): facilitator creates a Format A session, 12 simulated participants join in 3 groups with different segments, a poll is pushed, answered and shown on the projector. Stop and report.
