# mine.ai - Privacy-First Local AI Assistant

## 🚀 Architecture Overview

This is a **thick client** mobile application built with Next.js 14 and designed for deployment to iOS App Store and Google Play Store via Capacitor. **No backend server** — everything runs locally on the user's device.

## 🏗️ Core Architecture

### **Stack**
- **Framework**: Next.js 14 (App Router)
- **Mobile Runtime**: Capacitor (for iOS/Android deployment)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Dexie.js (IndexedDB wrapper)
- **Markdown**: react-markdown + remark-gfm

### **Privacy-First Design**
- ✅ **100% Local Storage**: All chat history stored in IndexedDB via Dexie.js
- ✅ **No Backend**: Zero server-side data collection
- ✅ **User-Controlled API**: Users configure their own AI endpoints (local or remote)
- ✅ **Offline First**: App fully functional without internet (except API calls)

---

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with iOS safe area support
│   ├── page.tsx            # Main chat orchestrator
│   └── globals.css         # Global styles + safe area CSS
├── components/
│   ├── Avatar.tsx          # User/AI avatar component
│   ├── ChatArea.tsx        # Message list with live DB queries
│   ├── ChatBubble.tsx      # Individual message (with markdown)
│   ├── ChatHeader.tsx      # Top navigation bar
│   ├── ChatInput.tsx       # Message input with auto-grow
│   ├── DateDivider.tsx     # Date separator
│   ├── SettingsSheet.tsx   # Bottom sheet for API config + test connection
│   ├── Sidebar.tsx         # Thread list + new chat
│   ├── ThinkingBlock.tsx   # Collapsible "chain of thought"
│   ├── ThreadItem.tsx      # Single thread in sidebar
│   ├── TypingIndicator.tsx # AI typing animation
│   └── WelcomeBanner.tsx   # Empty state
└── lib/
    ├── db.ts               # Dexie.js schema + helper functions
    ├── api.ts              # Streaming API client
    └── utils.ts            # Tailwind cn() helper
```

---

## 🗄️ Database Schema (Dexie.js)

### **Tables**

#### `threads`
```typescript
{
  id: string;           // Primary key
  title: string;        // Auto-generated from first message
  updatedAt: Date;      // For sorting
}
```

#### `messages`
```typescript
{
  id: string;           // Primary key
  threadId: string;     // Foreign key → threads
  role: "user" | "ai";
  content: string;      // Message body
  thinking?: string;    // Optional chain-of-thought
  timestamp: Date;
}
```

#### `settings`
```typescript
{
  key: string;          // Primary key
  value: any;           // JSON-serializable
}
```

**Default Settings:**
- `apiUrl`: User's AI endpoint (e.g., `http://192.168.1.50:11434/v1/chat/completions`)
- `modelName`: Model identifier (e.g., `llama2`, `mistral`)
- `systemPrompt`: AI personality/instructions
- `temperature`: 0.0 - 2.0 (creativity control)
- `thinkingEnabled`: Show/hide chain-of-thought

---

## 🔌 Dynamic API Integration

### **User-Configurable Endpoints**
Users can point the app to:
- **Local LLMs**: Ollama (`http://localhost:11434/v1/chat/completions`)
- **LM Studio**: (`http://localhost:1234/v1/chat/completions`)
- **Remote Tunnels**: Cloudflare tunnels, Tailscale, ngrok
- **Cloud APIs**: Any OpenAI-compatible endpoint

### **Streaming Implementation**
```typescript
// src/lib/api.ts
export async function streamAIResponse(options: StreamOptions) {
  // 1. Fetch with ReadableStream
  // 2. Parse SSE chunks line-by-line
  // 3. Update DB incrementally (reactive UI via useLiveQuery)
  // 4. Handle errors gracefully
}
```

**Flow:**
1. User sends message → saved to `messages` table
2. Create empty AI message in DB
3. Stream API response → update message `content` field chunk-by-chunk
4. `useLiveQuery` hook auto-updates UI reactively
5. On complete, finalize message

---

## 🎨 Mobile Optimizations

### **iOS Safe Area Insets**
```css
/* src/app/globals.css */
padding-top: calc(0.75rem + env(safe-area-inset-top));
padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
```

Components using safe areas:
- `ChatHeader` (top notch)
- `ChatInput` (bottom home indicator)
- `Sidebar` (full-height safe areas)
- `SettingsSheet` (bottom inset)

### **Viewport Configuration**
```typescript
// src/app/layout.tsx
export const viewport: Viewport = {
  viewportFit: "cover", // ← Essential for notch support
  userScalable: false,  // Prevent zoom on inputs
};
```

---

## 🧪 Test Connection Feature

The `SettingsSheet` includes a **Test Connection** button that:
1. Sends a minimal API request to the configured endpoint
2. 10-second timeout protection
3. Displays success/error with detailed messages
4. Helps users validate their setup before chatting

---

## 🚢 Deployment Checklist

### **Capacitor Setup** (iOS/Android)
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android

# Initialize
npx cap init

# Build & sync
npm run build
npx cap sync
npx cap open ios    # Opens Xcode
npx cap open android # Opens Android Studio
```

### **App Store Requirements**
- ✅ Privacy policy (all data local, no tracking)
- ✅ App icon (512x512, 192x192)
- ✅ Screenshots (6.5" iPhone, 12.9" iPad)
- ✅ Description highlighting "Local AI" and "Privacy"

---

## 📱 Key Features

### **1. Thread Management**
- Auto-generate thread titles from first user message
- Delete threads (with cascade delete of messages)
- Sort by `updatedAt` (most recent first)

### **2. Markdown Support**
- AI responses rendered with `react-markdown`
- GitHub-flavored markdown (tables, code blocks, etc.)
- Syntax highlighting ready

### **3. Chain of Thought**
- Collapsible "thinking" blocks
- Optional (toggle in settings)
- Helps users understand AI reasoning

### **4. Reactive UI**
- `useLiveQuery` from Dexie React hooks
- Zero manual state management for messages/threads
- DB updates → instant UI updates

---

## 🔒 Security & Privacy

- **No Analytics**: No Firebase, Google Analytics, or trackers
- **No Cloud Sync**: Data never leaves device
- **User Owns API Keys**: No centralized credentials
- **Open Source Ready**: Auditable codebase

---

## 🧩 Future Enhancements

- [ ] Export chat history (JSON/Markdown)
- [ ] Voice input (Web Speech API + Capacitor plugin)
- [ ] Image attachment support
- [ ] Multi-model switching (within a thread)
- [ ] Theme customization
- [ ] Biometric unlock (iOS Face ID / Android fingerprint)

---

## 📜 License

MIT (or your choice) - This is a template for App Store deployment.

---

## 🤝 Contributing

This architecture is designed for **App Store compliance**. If you fork this project:
1. Update `manifest.json` with your app details
2. Replace placeholder icons in `/public`
3. Add your privacy policy URL (required for App Store)
4. Test on real iOS/Android devices before submission

**Happy Shipping! 🚀**
