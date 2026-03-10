# mine.ai Codex Migration Pack v3

This pack is the cleaned, re-optimized handoff for migrating the current chat context into your repo and then into Codex safely.

## What changed in v3

This version reflects the later clarifications from the conversation:

- Codex clean-room flow is now the primary path.
- The repo inventory/classification has been updated from actual Codex inspection.
- `README.md` at repo root should stay in place for now.
- `.nano-banana-config.json` must be handled as a security item first, not casual clutter.
- `src/app/ui-vibes`, `src/pages/UIVibesDemo.tsx`, and `src/components/ui-vibes` are currently wired together and must not be moved blindly.
- `ui_workflow` was manually removed during the scan and should stay gone.
- The immediate next step is **folder creation only**, not broad restructuring.

## Intended repo destination

Put these files in:

```text
docs/context/
```

## Core doctrine

- Human owns architecture and sequencing.
- Codex gets one bounded task at a time.
- No new complexity until proof-of-life is real.
- Runtime evidence beats elegant speculation.
- Repo cleanup must happen before broad product-code fixes.
