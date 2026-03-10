# 08 — First Agent Prompt Template

Use this as the default shape for mine.ai Codex tasks.

```md
You are working on the mine.ai repository.

Goal:
Restore or inspect one bounded slice only. Do not broaden scope.

Task:
[INSERT SINGLE TASK HERE]

In scope:
- [file/folder A]
- [file/folder B]

Out of scope:
- [file/folder X]
- [file/folder Y]

Required behavior:
1. Summarize what you believe the current implementation/state is.
2. State all assumptions before changing anything.
3. If the filesystem/code contradicts assumptions, stop and report instead of improvising.
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
