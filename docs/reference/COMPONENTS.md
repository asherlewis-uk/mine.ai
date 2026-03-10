# 📦 Component Reference

## Core Components

### `src/app/page.tsx` - Main Orchestrator
**Purpose**: Coordinates all app logic, database operations, and streaming  
**Key Features**:
- Database initialization with `useLiveQuery`
- Thread management (create, switch, delete)
- Streaming API integration
- Auto-scroll to latest message
- Connection status tracking

**State Management**:
```typescript
- activeThreadId: Current chat thread
- isTyping: AI response in progress
- modelStatus: "online" | "offline" | "unknown"
- inputValue: User's current message draft
```

---

## UI Components (src/components/)

### `Avatar.tsx`
Simple user/AI avatar with icon differentiation.

### `ChatArea.tsx`
**Purpose**: Renders message list with reactive DB queries  
**Props**:
- `threadId: string | null` - Current thread to display
- `isTyping: boolean` - Show typing indicator

**Features**:
- Uses `useLiveQuery` for real-time updates
- Shows welcome banner when empty
- Includes date divider

---

### `ChatBubble.tsx`
**Purpose**: Individual message component with markdown support  
**Props**:
- `message: Message` - Message data from DB

**Features**:
- Markdown rendering for AI messages (react-markdown + remark-gfm)
- Plain text for user messages
- Timestamp display
- Optional "thinking" block integration

**Styling**:
- AI: Left-aligned, zinc background
- User: Right-aligned, blue gradient

---

### `ChatHeader.tsx`
**Purpose**: Top navigation bar  
**Props**:
- `onMenuClick: () => void` - Open sidebar
- `onSettingsClick: () => void` - Open settings
- `onClearChat?: () => void` - Clear current thread
- `modelStatus?: "online" | "offline" | "unknown"` - Connection indicator

**Features**:
- iOS safe area support (top notch)
- Connection status LED
- Glassmorphism styling

---

### `ChatInput.tsx`
**Purpose**: Message input with auto-grow  
**Props**:
- `value: string` - Current input
- `onChange: (value: string) => void` - Input handler
- `onSubmit: () => void` - Send message
- `isTyping: boolean` - Disable during AI response

**Features**:
- Auto-grow textarea (max 4 rows)
- Enter to send, Shift+Enter for new line
- Attachment/voice placeholders
- iOS safe area support (bottom home indicator)

---

### `DateDivider.tsx`
Simple horizontal date separator between message groups.

---

### `SettingsSheet.tsx`
**Purpose**: Bottom sheet for API configuration  
**Props**:
- `isOpen: boolean`
- `onClose: () => void`

**Features**:
- API URL configuration
- Model name input
- System prompt customization
- Temperature slider (0.0 - 2.0)
- Chain of thought toggle
- **Test Connection** button with status indicator
- Saves to Dexie `settings` table

**Connection Testing**:
```typescript
- Sends minimal API request
- 10-second timeout
- Displays detailed error messages
- Visual feedback (idle/testing/success/error)
```

---

### `Sidebar.tsx`
**Purpose**: Thread list and navigation  
**Props**:
- `isOpen: boolean`
- `onClose: () => void`
- `activeThreadId: string | null`
- `onSelectThread: (id: string) => void`

**Features**:
- Uses `useLiveQuery` to show all threads
- Sorted by `updatedAt` (most recent first)
- "New Chat" button
- Delete thread with confirmation
- iOS safe area support (full height)

---

### `ThinkingBlock.tsx`
**Purpose**: Collapsible "chain of thought" display  
**Props**:
- `content: string` - Thinking/reasoning text

**Styling**:
- Amber color scheme
- Collapsible `<details>` element
- Brain icon indicator

---

### `ThreadItem.tsx`
**Purpose**: Single thread in sidebar list  
**Props**:
- `thread: Thread` - Thread data
- `isActive: boolean` - Highlight current thread
- `onClick: () => void` - Select thread

**Features**:
- Shows title and relative timestamp
- Hover effects
- Active state highlighting

---

### `TypingIndicator.tsx`
Animated three-dot indicator shown during AI responses.

---

### `WelcomeBanner.tsx`
Empty state shown when no messages exist in current thread.

---

## Database Layer (src/lib/)

### `db.ts` - Dexie.js Schema
**Tables**:
```typescript
threads: { id, title, updatedAt }
messages: { id, threadId, role, content, thinking, timestamp }
settings: { key, value }
```

**Helper Functions**:
```typescript
// Threads
createThread(title?: string): Promise<Thread>
updateThreadTitle(id, title): Promise<void>
deleteThread(id): Promise<void>
touchThread(id): Promise<void>  // Update timestamp

// Messages
addMessage(threadId, role, content, thinking?): Promise<Message>
updateMessage(id, updates): Promise<void>
getThreadMessages(threadId): Promise<Message[]>

// Settings
getSetting(key): Promise<value>
setSetting(key, value): Promise<void>
getAllSettings(): Promise<Settings>

// Init
initializeDatabase(): Promise<void>  // Creates welcome thread
```

---

### `api.ts` - Streaming Client
**Main Function**:
```typescript
streamAIResponse(options: StreamOptions): Promise<void>
```

**Options**:
```typescript
{
  apiUrl: string;           // User-configured endpoint
  modelName: string;        // Model identifier
  systemPrompt: string;     // AI personality
  temperature: number;      // 0.0 - 2.0
  messages: Array;          // Chat history
  onChunk: (chunk) => void; // Stream handler
  onThinking?: (text) => void;
  onComplete: () => void;
  onError: (error) => void;
}
```

**Features**:
- OpenAI-compatible streaming
- Server-Sent Events (SSE) parsing
- Handles multiple response formats
- Error handling with detailed messages

**Test Function**:
```typescript
testAPIConnection(apiUrl, modelName): Promise<{ success, error? }>
```

---

## Styling

### iOS Safe Area Support
All layout components use:
```css
padding-top: calc(0.75rem + env(safe-area-inset-top));
padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
```

### Themes
- Dark mode only (zinc/blue palette)
- Glassmorphism effects (backdrop-blur)
- Gradient accents (blue-to-indigo)

---

## State Flow

### Sending a Message
```
User types → handleSend() → 
  1. Save user message to DB
  2. Create empty AI message
  3. Call streamAIResponse()
  4. Stream chunks → updateMessage(content)
  5. useLiveQuery auto-updates UI
```

### Thread Switching
```
User clicks thread → setActiveThreadId() →
  useLiveQuery refetches messages →
  ChatArea re-renders with new data
```

### Settings Update
```
User configures → SettingsSheet saves to DB →
  getAllSettings() reads on next send →
  Applied to API call
```

---

## Testing Checklist

- [ ] New chat creation
- [ ] Thread switching
- [ ] Thread deletion
- [ ] Message sending
- [ ] Streaming responses
- [ ] Markdown rendering
- [ ] Chain of thought display
- [ ] Settings persistence
- [ ] Connection testing
- [ ] iOS safe area rendering
- [ ] Keyboard handling (Enter/Shift+Enter)
- [ ] Auto-scroll to latest message
