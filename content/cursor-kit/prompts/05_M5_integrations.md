# M5 — Miro, admin and AI

1. Miro: "Open in Miro" deep links everywhere; read-only board embed on section pages and the projector view; export a group's output (journey map, ideas, votes) as stickies or a table into that group's practice frame via REST API v2 (OAuth app, board uXjVH3p2QFs=), each item tagged with block ID and group. Fallback: CSV / PNG download. Integration test against a sandbox board.
2. Admin: content editor (Tiptap) with version history and review status; ImageSlot upload with caption "why it is good", source and "sharing approved"; link manager with availability linked/gap, owner, date checked; audit log.
3. AI assistance (feature flag, server route only): send the block prompt + the group's FICTIONAL case data to Claude; show the draft beside the human-check checklist; the facilitator must tick every check before the draft can be copied. Block file uploads in demo mode. Rate limit per session.
4. French UI for facilitator and admin screens.
Acceptance: full Playwright flow join → push → submit → unlock → export to Miro. Stop and report.
