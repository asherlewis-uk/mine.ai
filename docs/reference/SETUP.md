# 🚀 Quick Start Guide - mine.ai

## Prerequisites
- Node.js 18+ installed
- A local AI server running (Ollama, LM Studio, etc.)

## Installation

```bash
# Dependencies are already installed
# If you need to reinstall:
npm install
```

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Initial Setup

### 1. Configure Your AI Endpoint

1. Click the **Settings icon** (sliders) in the top-right
2. Enter your API endpoint:
   - **Ollama**: `http://localhost:11434/v1/chat/completions`
   - **LM Studio**: `http://localhost:1234/v1/chat/completions`
   - **Remote**: Your Cloudflare tunnel or ngrok URL
3. Enter your model name (e.g., `llama2`, `mistral`, `qwen2.5`)
4. Click **Test Connection** to verify
5. Click **Save Settings**

### 2. Start Chatting

- Type your message in the input box
- Press Enter (or Shift+Enter for new line)
- Watch the AI response stream in real-time
- All conversations are saved locally in IndexedDB

## Setting Up Ollama (Recommended)

```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama2

# Start the server (runs on port 11434)
ollama serve
```

Then use: `http://localhost:11434/v1/chat/completions`

## Setting Up LM Studio

1. Download from [lmstudio.ai](https://lmstudio.ai)
2. Download a model (e.g., `TheBloke/Mistral-7B-Instruct-v0.2-GGUF`)
3. Start the local server (Settings → Enable Local Server)
4. Default port: `http://localhost:1234/v1/chat/completions`

## Project Structure

```
mine-ai/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # Modular UI components
│   └── lib/
│       ├── db.ts      # Dexie.js database layer
│       └── api.ts     # Streaming API client
├── public/            # Static assets
└── ARCHITECTURE.md    # Detailed architecture docs
```

## Key Features

✅ **100% Local** - No backend server, all data on your device  
✅ **Streaming Responses** - Real-time AI output  
✅ **Thread Management** - Multiple conversation threads  
✅ **Markdown Support** - Rich text formatting in responses  
✅ **Chain of Thought** - See AI reasoning (if enabled)  
✅ **Mobile Ready** - iOS safe area support built-in  

## Building for Production

```bash
npm run build
npm start
```

## Mobile Deployment (Capacitor)

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android

# Initialize
npx cap init "mine.ai" "com.yourcompany.mineai"

# Build and sync
npm run build
npx cap sync

# Open in IDE
npx cap open ios     # Xcode
npx cap open android # Android Studio
```

## Troubleshooting

### "Connection Failed"
- Ensure your AI server is running
- Check the API URL is correct
- Verify no firewall blocking localhost
- Try `127.0.0.1` instead of `localhost`

### "No Messages Showing"
- Check browser console for errors
- Clear IndexedDB: DevTools → Application → IndexedDB → Delete
- Refresh the page

### "Streaming Not Working"
- Verify your API endpoint supports streaming
- Check CORS is enabled on your local server
- Some models don't support streaming - disable it in API settings

## Database Inspection

Open Chrome DevTools:
1. **Application tab** → IndexedDB → MineAIDatabase
2. View `threads`, `messages`, and `settings` tables
3. Export/delete data as needed

## Need Help?

- Check `ARCHITECTURE.md` for detailed technical docs
- Verify your API endpoint with curl:
  ```bash
  curl http://localhost:11434/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
      "model": "llama2",
      "messages": [{"role": "user", "content": "Hello"}],
      "stream": false
    }'
  ```

## Next Steps

1. ✅ Configure your AI endpoint
2. ✅ Test the connection
3. ✅ Start a conversation
4. 🚀 Deploy to mobile with Capacitor
5. 📱 Submit to App Store / Play Store

---

**Privacy Note**: All your data stays on your device. The only network requests are to the AI endpoint you configure. No analytics, no tracking, no cloud sync.
