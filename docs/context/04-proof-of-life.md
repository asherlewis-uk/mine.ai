# 04 — Proof-of-Life

## Definition

Proof-of-life for mine.ai is the smallest believable working product.

It is not the polished app.
It is the first honest heartbeat.

## Required flow

### 1. Boot
The app starts without fatal runtime failure.

### 2. Render
The core shell renders:
- main layout
- sidebar
- thread area
- input area
- settings access point

### 3. Configure
The user can save:
- API endpoint
- model name
- minimum required options

### 4. Validate
The app can test the configured endpoint honestly.

### 5. Send
A user message is created and persisted locally.

### 6. Receive
An AI response is streamed or received and persisted correctly.

### 7. Reload
On reopen or reload:
- threads still exist
- messages still exist
- selected thread can be reopened

## Current first repair target

The first safe bounded task is:

Audit the boot and shell render path for mine.ai. Determine whether the main layout, sidebar, thread list, input area, and settings entry point render successfully. Fix only localized obvious breaks; otherwise report findings without broad changes.
