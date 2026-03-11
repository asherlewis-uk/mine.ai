# 07 — Session Handoff

## Current strategic position

mine.ai is the active rescue target.

The repo is no longer being approached through the old over-scoped “have one model build the whole house” mindset.

## What was learned

Old belief:
- one strong model can build the whole house

Revised belief:
- even a strong model usually handles only one bounded floor, room, or subsystem reliably
- project coherence still requires human scope control
- environment trust matters
- clean-room setup is better than trying to repair in a spiritually haunted editor state

## Current operational posture

- Codex clean-room environment is the preferred execution surface
- structure cleanup comes before product repair
- context pack goes into `docs/context`
- one bounded prompt at a time
- no work on `main`

## Known repo-specific truths

- `ui_workflow` was manually removed during scan and should stay gone
- `.nano-banana-config.json` contains a plaintext API key and must be handled separately
- `ui-vibes` is currently wired together and should not be moved casually
- root `README.md` stays put for now
