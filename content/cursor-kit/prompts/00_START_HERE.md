# Paste this into Cursor Agent (first message)

Read @.cursor/rules/codesign-campus.mdc, @content/campus-content.json and @reference/V3_new_approach_codesign_template_kit.pdf (if present).

You are a senior product engineer and learning-experience designer. We are building "CoDesign Method Campus — Live", the web app Sodexo CoDesign Services uses DURING training sessions and for self-study. The Miro board stays the canonical campus; this app is the dynamic layer: facilitator console, participant devices, timed agendas, interactive exercises, live polls and votes, answer keys that unlock at the right moment, self-assessment, progress tracking and exports back to Miro.

## Users
- Participant: often a non-designer (sales/BRM, site or operations manager), on a laptop or phone. Joins with a 6-character code, gets a group, a role and a fictional case pack (WORK, PLAY, HEAL or LEARN). Sees only what the facilitator has opened.
- Facilitator (Diane, Noël, regional champions): runs sessions from templates, pushes blocks and activities, watches group progress, unlocks answer keys, runs polls, scores observed work with the rubric.
- Admin / content owner (Diane, Gabriel): edits content, fills image slots, manages links and templates, publishes versions.
- Coach / observer: reads group outputs and scores them.
- Self-study learner: browses the library, does exercises alone, takes the maturity check.

## Before writing code
1. Summarise the JSON: counts of sections, lanes, blocks, case packs, formats; list any field that is missing or inconsistent.
2. Propose the information architecture (routes) and the component list on one page, as `docs/ARCHITECTURE.md`.
3. Propose the Postgres schema (below) as migrations, with RLS policies explained in one line each.
4. Write `DECISIONS.md` with every default you chose.
Then stop and wait for my "go".

## Routes
/ (campus map) · /sections/[code] · /blocks/[id] (tabs: method, training, practice, examples, enablers, assessment) · /cases/[segment] · /formats · /me · /join · /s/[code] (participant live view) · /facilitate/[sessionId] · /present/[sessionId] (projector) · /admin (content, links, images, templates, users, analytics, audit)

## Data model
sections(code, name, subtitle, colour, icon, order)
lanes(code, name, icon)
blocks(id PK '04.02', section_code, type source_block|foundation|proposed_extension, name, sub_stage, target_level, primary_segment, objective, who, accountable, when_to_use, inputs, steps jsonb, output, min_standard, quality, mistakes, handoff, example, variants jsonb, credential, tools, deck_refs, ai_prompt, human_checks, manual_fallback, learning_objective, explanation, exercise jsonb, miro_frame_url, version, status, updated_by, updated_at)
block_answer_keys(block_id, sample_answer, success_criteria)  -- facilitator-only
block_links(block_id, kind template|credential|os_agent|deck|other, label, url, availability linked|gap, owner, checked_at)
block_images(block_id, slot, storage_path, caption_why_good, source, sharing_approved)
case_packs(segment, name, client, challenge, users, constraints, evidence jsonb, persona, journey jsonb, insights jsonb, hmw jsonb, workshop_inputs, ideas jsonb, priorities, test_plan, credentials, is_fictional default true)
session_templates(id, name, format A|B|rehearsal, agenda jsonb, learning_route jsonb)
sessions(id, template_id, title, join_code, facilitator_id, starts_at, timezone, status draft|live|closed, current_item)
agenda_items(session_id, order, title, minutes, block_ids, activity_type, state pending|live|done)
groups(session_id, name, segment) · participants(session_id, display_name, group_id, role)
activities(session_id, block_id, type exercise|poll|vote|quiz|challenge, config jsonb, answer_key_unlocked)
submissions(activity_id, group_id, participant_id, payload jsonb, status draft|submitted, submitted_at)
self_assessments(user_id, block_id, step 1-4, moment before|after, created_at)
rubric_scores(scored_user_id, block_id, scorer_id, dimension, score 1-4, comment, artifact_url)
feedback(session_id, participant_id, answers jsonb)
audit_log(actor, action, entity, before, after, at)

## Session templates to seed (from the JSON)
- Format A training — half day, 09:00–13:00, 240 min (9 agenda items).
- Format B training — full day, 09:00–17:00, 480 min (15 agenda items).
- Internal rehearsal — 60 min: objective 5, explanation 10, worked example 10, Claude/OS demonstration 10, participant practice 15, debrief 10.
Unit test: Format A sums to 240 and Format B to 480.

## Build plan (one milestone per prompt in /prompts, stop after each)
M1 foundations · M2 live session core · M3 exercises · M4 assessment · M5 integrations.
At the end of each milestone give me: how to run it, screenshots of key screens, the changelog, known issues and the next step.
