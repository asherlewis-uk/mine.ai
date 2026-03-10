# 10 — Codex Prompts Sequenced

These are the updated prompts in the correct order.

## Prompt A — Folder creation only

```md
Good. Proceed with a non-destructive structure setup, but handle security-sensitive residue carefully.

Goal:
Create the destination folders only, and do not move any existing files yet.

Create these folders at repo root:
- docs/context
- docs/reference
- docs/design-references
- archive/experiments
- archive/tooling

Rules:
- Do not move files yet.
- Do not edit product code.
- Do not delete anything.
- Do not modify or relocate `.nano-banana-config.json` yet.
- Do not touch `src/app/ui-vibes`, `src/pages/UIVibesDemo.tsx`, or `src/components/ui-vibes`.

After creating the folders:
1. Show exactly what was created.
2. Show the resulting repo tree at the top two levels.
3. Stop and wait.

Output format:
1. Changes made
2. Updated tree
3. No-risk confirmation
```

## Prompt B — Context ingestion audit

Use after manually placing this pack into `docs/context/`.

```md
Audit the newly added handoff files in docs/context.

Goal:
Verify that docs/context now contains the authoritative recovery pack.

Tasks:
1. List all files present in docs/context.
2. Confirm whether these exact files exist:
   - README.md
   - 01-current-truth.md
   - 02-recovery-plan.md
   - 03-agent-operating-contract.md
   - 04-proof-of-life.md
   - 05-task-slices.md
   - 06-visual-reference-index.md
   - 07-session-handoff.md
   - 08-first-agent-prompt-template.md
   - 09-codex-clean-room-walkthrough.md
   - 10-codex-prompts-sequenced.md
3. If any are missing, report exactly which are missing.
4. Do not edit the file contents yet unless there is an obvious filename conflict.

Output format:
1. Present files
2. Missing files
3. Confirmation of docs/context as active authority
```

## Prompt C — Move reference docs only

```md
Proceed with a limited repo-structure cleanup.

Goal:
Move loose reference docs out of the repo root into docs/reference.

Move these files if they exist:
- ARCHITECTURE.md -> docs/reference/
- COMPONENTS.md -> docs/reference/
- SETUP.md -> docs/reference/
- INTEGRATION_GUIDE.txt -> docs/reference/

Rules:
- Only move the listed files.
- Do not move README.md yet.
- Do not edit product code.
- Do not move anything else yet.

After moving:
1. Show exactly what moved.
2. Show the updated root tree.
3. Stop and wait.
```

## Prompt D — Move design references only

```md
Proceed with the next limited cleanup step.

Goal:
Move design-reference material out of the repo root into docs/design-references.

Move this if it exists:
- UI_ELEMMENT_VIBES -> docs/design-references/

Rules:
- Treat this as design memory, not active runtime code.
- Do not touch src/ yet.
- Do not move ui-vibes folders inside src in this step.
- Do not modify file contents unless absolutely required by the move itself.

After moving:
1. Show what moved.
2. Show the updated tree.
3. Stop and wait.
```

## Prompt E — Quarantine experiments only

```md
Proceed with the next limited cleanup step.

Goal:
Move obvious experiment / alternate-build clutter out of the active root and into archive/experiments.

Move these if they exist:
- storefront-landing-page -> archive/experiments/
- mine.ai rebuild -> archive/experiments/

Rules:
- These are to be treated as non-canonical experiments unless evidence proves otherwise.
- Do not move anything inside src/ in this step.
- Do not touch active product code.
- Do not delete these folders; move them intact.

After moving:
1. Show exactly what moved.
2. Show the updated root tree.
3. Report whether any references from active code appear to point into these folders.
4. Stop and wait.
```

## Prompt F — Quarantine tooling residue, excluding security item

```md
Proceed with the next limited cleanup step.

Goal:
Move likely agent/tool-governance residue out of the active root into archive/tooling.

Move these if they exist:
- .agents -> archive/tooling/
- .windsurf -> archive/tooling/
- skills-lock.json -> archive/tooling/

Rules:
- Treat these as archived tooling residue, not current active governance.
- Do not delete them.
- Do not rewrite them.
- Do not touch product code.
- Do not touch `.nano-banana-config.json` in this step.

After moving:
1. Show exactly what moved.
2. Show the updated root tree.
3. Confirm that active repo governance is now centered on docs/context.
4. Stop and wait.
```

## Prompt G — Handle security item

```md
Inspect `.nano-banana-config.json` as a security-sensitive residue item.

Goal:
Determine the safest way to prevent plaintext secret exposure without introducing unrelated changes.

Rules:
- Do not expose the full secret value in your response.
- Do not commit the file as-is.
- Propose the minimum safe handling path.
- Do not touch product code.

Tasks:
1. Confirm whether the file contains a plaintext credential.
2. Recommend one of:
   - remove and rotate
   - move to ignored local-only location
   - replace with redacted/example config and ignore real file
3. Explain the safest next action before any cleanup commit.

Output format:
1. Risk confirmation
2. Recommended handling
3. Minimal next step
```

## Prompt H — Remove pure noise

```md
Proceed with the next limited cleanup step.

Goal:
Remove pure noise from the repo root and prevent it from coming back.

Tasks:
1. Remove hs_err_pid242624.log if it exists.
2. Update .gitignore to ignore:
   - hs_err_pid*
   - replay_pid*

Rules:
- Make only these changes.
- Do not broadly rewrite .gitignore.
- Preserve existing ignore rules.
- Do not touch product code.

After changing:
1. Show the exact .gitignore diff.
2. Confirm whether the crash log was removed.
3. Stop and wait.
```

## Prompt I — Structure-only commit

```md
Proceed to create a structure-only cleanup commit.

Goal:
Commit the repo cleanup before any product-code repair begins.

Rules:
- Stage only the structural cleanup changes.
- Do not bundle product-code fixes into this commit.
- Use this commit message exactly:

chore: containerize mine.ai recovery context and quarantine repo noise

Tasks:
1. Show me the staged file list before committing.
2. Commit with the exact message above.
3. Show the resulting commit hash.
4. Stop and wait.
```

## Prompt J — First product-code slice

```md
You are now allowed to inspect one bounded product-code slice.

Goal:
Audit the boot and shell render path for mine.ai.

Task:
Determine whether the main layout, sidebar, thread list, input area, and settings entry point render successfully. Fix only the minimum code required to get the shell rendering if the break is obvious and localized. Otherwise report findings without broad changes.

Files in scope:
- src/app/layout.tsx
- src/app/page.tsx
- src/components/Sidebar.tsx
- src/components/ChatArea.tsx
- src/components/ChatHeader.tsx
- src/components/ChatInput.tsx

Files explicitly out of scope:
- streaming API logic
- DB schema changes
- Capacitor native files
- styling redesign
- feature expansion

Required behavior:
1. Start by summarizing what you believe the current implementation does.
2. State all assumptions before changing anything.
3. If the code contradicts assumptions, stop and report instead of improvising.
4. Make only the minimum changes required for this task.
5. Do not add unrelated cleanup or modernization.
6. Explain how success is being checked.
7. Identify remaining risks and evidence gaps.

Output format:
1. Findings
2. Assumptions
3. Changes made
4. Verification result
5. Risks / unresolved issues
```
