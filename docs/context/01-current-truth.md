# 01 — Current Truth

## Intended product identity

mine.ai is a privacy-first local AI assistant.

Intended structure:
- thick-client mobile app
- Next.js + Capacitor
- Dexie local storage
- offline-first chat shell
- user-configured AI endpoints
- no backend

That is already enough product surface. Stop adding fantasy before the floor exists.

## What went wrong

The repo likely absorbed too much agent-generated complexity relative to how much system truth was being actively verified.

Failure pattern:
- architecture docs outran runtime certainty
- side experiments stayed mixed into the active root
- tooling residue and agent residue remained in place
- visual/demo systems blurred together with production systems
- project truth lived too much in chat and in your head

## What is true now

We have an evidence-based Codex inventory of the repo root.

### Classified ACTIVE_APP
- `android`
- `ios`
- `public`
- `src`
- `.gitignore`
- `capacitor.config.ts`
- `components.json`
- `eslint.config.mjs`
- `next.config.ts`
- `package-lock.json`
- `package.json`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `tsconfig.json`

### Classified REFERENCE_DOC
- `ARCHITECTURE.md`
- `COMPONENTS.md`
- `INTEGRATION_GUIDE.txt`
- `README.md`
- `SETUP.md`

### Classified DESIGN_REFERENCE
- `UI_ELEMMENT_VIBES`

### Classified EXPERIMENT
- `mine.ai rebuild`
- `storefront-landing-page`

### Classified TOOLING_RESIDUE
- `.agents`
- `.codex`
- `.git`
- `.github`
- `.next`
- `.vscode`
- `.windsurf`
- `node_modules`
- `out`
- `.nano-banana-config.json`
- `next-env.d.ts`
- `skills-lock.json`
- `tsconfig.tsbuildinfo`

### Classified NOISE
- `hs_err_pid242624.log`

## Important exceptions

### Root `README.md`
Even though Codex classified it as REFERENCE_DOC, leave it in root **for now**. Do not move it in the first documentation move.

### `.nano-banana-config.json`
This contains a plaintext API key. Treat it as a **security handling item** first, not ordinary clutter.

### `ui-vibes`
- `src/app/ui-vibes/page.tsx`
- `src/pages/UIVibesDemo.tsx`
- `src/components/ui-vibes`

These are currently wired together and must not be moved blindly.

### `ui_workflow`
This was manually removed during the scan and should remain gone. Do not restore it.
