# 05 — Initial Task Slices

## Slice 0 — Folder Creation Only
Create:
- `docs/context`
- `docs/reference`
- `docs/design-references`
- `archive/experiments`
- `archive/tooling`

No moves. No product-code edits.

## Slice 1 — Context Ingestion Audit
Verify that the files in this pack exist in `docs/context`.

## Slice 2 — Low-Risk Documentation Move
Move only:
- `ARCHITECTURE.md`
- `COMPONENTS.md`
- `SETUP.md`
- `INTEGRATION_GUIDE.txt`

Do not move root `README.md` yet.

## Slice 3 — Design Reference Move
Move only:
- `UI_ELEMMENT_VIBES`

## Slice 4 — Experiment Quarantine
Move only:
- `storefront-landing-page`
- `mine.ai rebuild`

## Slice 5 — Tooling Residue Quarantine
Move only:
- `.agents`
- `.windsurf`
- `skills-lock.json`

Do not touch `.nano-banana-config.json` yet.

## Slice 6 — Security Handling
Inspect and resolve `.nano-banana-config.json` safely.

## Slice 7 — Shell Render Audit
Audit:
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/Sidebar.tsx`
- `src/components/ChatArea.tsx`
- `src/components/ChatHeader.tsx`
- `src/components/ChatInput.tsx`

## Special caution slice — ui-vibes
Do not move:
- `src/app/ui-vibes`
- `src/pages/UIVibesDemo.tsx`
- `src/components/ui-vibes`

until they are explicitly reclassified and a targeted task says to do so.
