# 02 — Recovery Plan

## Mission

Rescue mine.ai by reducing it to a small, verified, believable working baseline.

## The correct sequence

1. Create clean-room Codex environment
2. Inspect repo without changing it
3. Create destination folders
4. Ingest the context pack into `docs/context`
5. Move only low-risk documentation/design/experiment clutter
6. Handle security-sensitive residue separately
7. Commit structure cleanup
8. Start one bounded proof-of-life repair slice

## Phase 1 — Repo Reality Audit
Already completed once via Codex inspection.

Outputs already known:
- root inventory
- classification map
- ambiguity risks
- do-not-touch-yet items

## Phase 2 — Structure Establishment
Create only:
- `docs/context`
- `docs/reference`
- `docs/design-references`
- `archive/experiments`
- `archive/tooling`

No broad moves yet.

## Phase 3 — Context Containerization
Put this pack into:
- `docs/context/`

This makes the repo itself the source of truth instead of the chat.

## Phase 4 — Safe Cleanup
Move only:
- `ARCHITECTURE.md` -> `docs/reference/`
- `COMPONENTS.md` -> `docs/reference/`
- `SETUP.md` -> `docs/reference/`
- `INTEGRATION_GUIDE.txt` -> `docs/reference/`
- `UI_ELEMMENT_VIBES/` -> `docs/design-references/`
- `storefront-landing-page/` -> `archive/experiments/`
- `mine.ai rebuild/` -> `archive/experiments/`
- `.agents/` -> `archive/tooling/`
- `.windsurf/` -> `archive/tooling/`
- `skills-lock.json` -> `archive/tooling/`

Do not casually move:
- `README.md`
- `.nano-banana-config.json`
- `ui-vibes` files/folders

## Phase 5 — Security Handling
Handle `.nano-banana-config.json` deliberately:
- inspect
- rotate or remove secret
- ensure it is not committed as-is
- only then archive/delete/ignore as appropriate

## Phase 6 — Proof-of-Life Restoration
Target flow:
1. app boots
2. sidebar and thread list render
3. settings save locally
4. one user message persists
5. one AI response persists
6. reload preserves thread history

## Do not touch yet

- `src/app/ui-vibes/page.tsx`
- `src/pages/UIVibesDemo.tsx`
- `src/components/ui-vibes`
- mobile build/runtime files unless a task explicitly targets them
- broad styling redesign
- streaming refactors before shell truth is established
