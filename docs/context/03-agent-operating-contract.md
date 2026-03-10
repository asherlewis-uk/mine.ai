# 03 — Agent Operating Contract

## Purpose

Define how Codex is allowed to work on mine.ai.

## Core doctrine

The human owns:
- architecture
- scope
- sequencing
- acceptance criteria
- truth arbitration

Codex may own:
- one bounded implementation slice
- one bug investigation
- one structural cleanup slice
- one test-focused repair
- one constrained document update

## Allowed task size

A task should cover one unit only, such as:
- one folder-creation step
- one move batch
- one security-handling step
- one shell-render audit
- one settings persistence audit
- one response-path audit

## Forbidden task shapes

Do not ask Codex to:
- finish the app
- fix everything
- modernize the whole repo
- rebuild all screens
- make it production-ready
- clean the entire repo and fix code in the same pass
- infer architecture from vibes

## Required task structure

Every task should specify:
1. objective
2. files/folders in scope
3. files/folders out of scope
4. assumptions
5. verification method
6. risk notes
7. output format

## Absolute rule

No agent gets to create new complexity until the current flow is proven end-to-end.

## Current best environment practice

Use Codex in a clean environment/worktree, not the previously over-tinkered VS Code context.
