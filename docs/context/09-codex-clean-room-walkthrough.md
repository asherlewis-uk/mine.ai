# 09 — Codex Clean-Room Walkthrough

## Why Codex clean-room mode was chosen

The prior VS Code environment felt over-tinkered and untrustworthy.
A clean Codex environment gives a more trustworthy starting point for bounded tasks.

## What was already established

- Codex environment exists for `mine-ai`
- setup script was reduced to:
  - `npm install`
- work should not happen on `main`
- the first real Codex task was inspection-only

## Working branch name

Use:
- `chore/containerize-context-and-quarantine-noise`

## Important rule

Do not hide cleanup logic inside environment setup.
Environment setup is for readiness only.
Cleanup and repo surgery happen in explicit tasks.
