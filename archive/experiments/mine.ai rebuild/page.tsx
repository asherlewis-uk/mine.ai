'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MessageSquare, Users, Settings, Activity, Plus, Send, MoreVertical, 
  LayoutDashboard, Shield, Image as ImageIcon, Code, RefreshCw, 
  Menu, ArrowLeft, Trash2, Info, X, Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Message, Thread, Character, Model, UserProfile, SystemSettings, 
  DEFAULT_USER, DEFAULT_SETTINGS, DEFAULT_CHARACTERS 
} from '@/lib/types';
import { AdminProfile } from '@/components/AdminProfile';
import { ChatMessageContent } from '@/components/ChatMessageContent';
import { Avatar } from '@/components/Avatar';

export default function MineAiUltimate() {
  const [activeView, setActiveView] = useState<'dashboard' | 'chat' | 'characters' | 'admin' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [isRefetching, setIsRefetching] = useState(false);
  
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showThreadMenu, setShowThreadMenu] = useState(false);
  const [showThreadDetails, setShowThreadDetails] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const touchStartX = useRef(0);

  const activeThread = threads.find(t => t.id === activeThreadId);
  const activeCharacter = DEFAULT_CHARACTERS.find(c => c.id === activeThread?.characterId) || DEFAULT_CHARACTERS[0];

  // Persistence logic
  useEffect(() => {
    const u = localStorage.getItem('mine_user');
    const s = localStorage.getItem('mine_settings');
    const t = localStorage.getItem('mine_threads');
    if (u) setUserProfile(JSON.parse(u));
    if (s) setSettings(JSON.parse(s));
    if (t) setThreads(JSON.parse(t));
    fetchModels();
  }, []);

  useEffect(() => { localStorage.setItem('mine_user', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('mine_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('mine_threads', JSON.stringify(threads)); }, [threads]);

  const fetchModels = useCallback(async () => {
    setIsRefetching(true);
    try {
      const res = await fetch('/api/models');
      if (res.ok) setAvailableModels((await res.json()).models || []);
    } finally { setIsRefetching(false); }
  }, []);

  // Neural Interaction logic
  const generateResponse = useCallback(async (threadId: string, msgs: Message[], char: Character) => {
    setIsGenerating(true);
    const ac = new AbortController();
    abortControllerRef.current = ac;

    try {
      const sanitizedBio = userProfile.bio ? `\n\n[USER BIO]: ${userProfile.bio}` : '';
      const systemContext = `${settings.globalSystemPrompt}\n\n[CHARACTER]: ${char.systemPrompt}${sanitizedBio}`;
      
      const res = await fetch(settings.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: settings.activeModel,
          messages: [{ role: 'system', content: systemContext }, ...msgs.map(m => ({ role: m.role, content: m.content }))],
          temperature: settings.temperature,
          stream: settings.streamResponse
        }),
        signal: ac.signal
      });

      if (!res.body) throw new Error('Link severed');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const aid = Date.now().toString();
      let content = '';

      setThreads(p => p.map(t => t.id === threadId ? { ...t, messages: [...t.messages, { id: aid, role: 'assistant', content: '', timestamp: Date.now() }] } : t));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.trim());
        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.message?.content) {
              content += json.message.content;
              setThreads(p => p.map(t => {
                if (t.id !== threadId) return t;
                const m = [...t.messages];
                if (m[m.length - 1].id === aid) m[m.length - 1].content = content;
                return { ...t, messages: m, lastMessage: content.slice(0, 50) + '...' };
              }));
            }
          } catch(e) {}
        }
      }
    } finally { setIsGenerating(false); abortControllerRef.current = null; }
  }, [settings, userProfile]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const msg: Message = { id: Date.now().toString(), role: 'user', content: inputText, timestamp: Date.now() };
    const tid = activeThreadId || Date.now().toString();
    
    if (!activeThreadId) {
      const nt: Thread = { id: tid, title: inputText.slice(0, 30), lastMessage: inputText, timestamp: Date.now(), characterId: activeCharacter.id, messages: [msg], modelId: settings.activeModel };
      setThreads([nt, ...threads]);
      setActiveThreadId(tid);
      setActiveView('chat');
      generateResponse(tid, [msg], activeCharacter);
    } else {
      setThreads(p => p.map(t => t.id === tid ? { ...t, lastMessage: inputText, messages: [...t.messages, msg] } : t));
      const hist = [...(threads.find(t => t.id === tid)?.messages || []), msg];
      generateResponse(tid, hist, activeCharacter);
    }
    setInputText('');
  };

  // UI Handlers
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 70) setIsSidebarOpen(diff < 0);
  };

  return (
    <div className={`flex h-screen w-full bg-black text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-hidden ${settings.theme}`} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      
      {/* Dynamic Sidebar */}
      <motion.nav animate={{ width: isSidebarOpen ? 280 : 0 }} className={`fixed md:relative z-50 h-full flex flex-col border-r border-white/5 bg-zinc-950 md:bg-zinc-950/50 backdrop-blur-xl transition-all duration-300 ${isSidebarOpen ? 'w-[280px]' : 'w-0 md:w-[260px]'}`}>
        <div className="p-6 flex items-center justify-between mb-4 overflow-hidden whitespace-nowrap">
           <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">M</div><span className="font-bold text-lg">mine.ai</span></div>
           <button onClick={() => setIsSidebarOpen(false)} className="md:hidden"><X className="w-5 h-5 text-zinc-500" /></button>
        </div>
        <div className="flex-1 px-3 space-y-1 overflow-hidden">
           {[{ id: 'dashboard', i: LayoutDashboard, l: 'Dashboard' }, { id: 'chat', i: MessageSquare, l: 'Chat' }, { id: 'characters', i: Users, l: 'Personas' }, { id: 'admin', i: Shield, l: 'Admin' }, { id: 'settings', i: Settings, l: 'Settings' }].map(item => (
              <button key={item.id} onClick={() => { setActiveView(item.id as any); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeView === item.id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><item.i className="w-5 h-5" /><span className="font-medium text-sm">{item.l}</span></button>
           ))}
        </div>
        <div className="p-4 border-t border-white/5"><button onClick={() => { setActiveView('admin'); setIsSidebarOpen(false); }} className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/5"><div className={`w-8 h-8 rounded-full ${userProfile.avatarColor} flex items-center justify-center text-xs font-bold text-white`}>{userProfile.name.charAt(0)}</div><div className="text-left overflow-hidden"><div className="text-sm font-medium text-white truncate">{userProfile.name}</div><div className="text-xs text-zinc-500">System Admin</div></div></button></div>
      </motion.nav>

      {/* Main Container */}
      <main className="flex-1 relative flex flex-col h-full w-full">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 to-black pointer-events-none" />
         
         {/* Mobile Navbar */}
         <div className="md:hidden h-14 border-b border-white/5 bg-zinc-950 flex items-center px-4 z-40 relative">
            <button onClick={() => setIsSidebarOpen(true)} className="text-zinc-400 p-2"><Menu className="w-6 h-6" /></button>
            <span className="ml-2 font-medium text-sm uppercase tracking-widest">{activeView}</span>
         </div>

         <AnimatePresence mode="wait">
            <motion.div key={activeView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden relative z-10">
               {activeView === 'admin' && <AdminProfile profile={userProfile} onUpdate={setUserProfile} />}
               {activeView === 'dashboard' && (
                  <div className="p-10 flex flex-col items-center justify-center h-full text-zinc-500 text-center space-y-6">
                    <div className="relative"><div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full" /><Activity className="w-20 h-20 text-white relative z-10 opacity-70" /></div>
                    <div><h2 className="text-3xl text-white font-light">Neural Link Active</h2><p className="mt-2 text-zinc-400">Welcome back, ${userProfile.name}. System optimal.</p></div>
                    <button onClick={() => { setActiveThreadId(null); setActiveView('chat'); }} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center gap-3 transition-all hover:scale-[1.05] shadow-2xl shadow-indigo-900/40"><Plus className="w-5 h-5" /> Initialize Context</button>
                  </div>
               )}
               {activeView === 'chat' && (
                  <div className="flex flex-col h-full relative">
                    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-md shrink-0">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setActiveView('dashboard')} className="md:hidden"><ArrowLeft className="w-5 h-5 text-zinc-400" /></button>
                            <Avatar char={activeCharacter} size="sm" />
                            <h2 className="text-sm font-medium text-white flex items-center gap-2">{activeCharacter.name}<span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-500 uppercase tracking-tighter">{settings.activeModel.split(':')[0]}</span></h2>
                        </div>
                        <div className="flex gap-2 relative">
                            <button onClick={() => setShowThreadMenu(!showThreadMenu)} className="p-2 text-zinc-400 hover:text-white"><MoreVertical className="w-5 h-5" /></button>
                            {showThreadMenu && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50">
                                    <button onClick={() => { setShowThreadDetails(true); setShowThreadMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 rounded-xl flex items-center gap-2"><Info className="w-4 h-4" /> Details</button>
                                    <button onClick={() => deleteThread(activeThreadId!)} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-2 mt-1"><Trash2 className="w-4 h-4" /> Delete</button>
                                </div>
                            )}
                        </div>
                    </header>
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
                       {!activeThread ? <div className="h-full flex items-center justify-center text-zinc-600 font-light italic">Waiting for neural link...</div> : activeThread.messages.map(msg => (
                          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             {msg.role !== 'user' && <Avatar char={activeCharacter} size="sm" />}
                             <div className={`p-4 rounded-2xl max-w-[85%] md:max-w-[75%] shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-zinc-900 border border-white/10 text-zinc-300 rounded-tl-sm'}`}><ChatMessageContent content={msg.content} /></div>
                          </div>
                       ))}
                       <div ref={chatEndRef} />
                    </div>
                    <div className="p-4 border-t border-white/5 bg-zinc-950/80 backdrop-blur shrink-0">
                       <div className="max-w-4xl mx-auto relative rounded-2xl bg-zinc-900 border border-white/10 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all p-2">
                          <textarea value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} className="w-full bg-transparent border-0 text-white placeholder-zinc-600 focus:ring-0 resize-none px-4 py-2 min-h-[60px]" placeholder={`Query ${activeCharacter.name}...`} />
                          <div className="flex justify-between items-center px-2 py-1">
                             <div className="flex gap-1"><button className="p-2 text-zinc-500 hover:text-white"><ImageIcon className="w-4 h-4" /></button><button className="p-2 text-zinc-500 hover:text-white"><Wand2 className="w-4 h-4" /></button></div>
                             <button onClick={handleSend} disabled={!inputText.trim() || isGenerating} className={`p-2 rounded-xl shadow-lg transition-all ${isGenerating ? 'bg-red-500 animate-pulse' : 'bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30'}`}><Send className="w-5 h-5" /></button>
                          </div>
                       </div>
                    </div>
                  </div>
               )}
            </motion.div>
         </AnimatePresence>
      </main>
    </div>
  );
}

