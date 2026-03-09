 
 -*****************
                                                                                                                                                                                                                                                                     
 ----
 import React, { useState } from 'react';
import {
  Home,
  MessageSquare,
  Clock,
  Settings,
  Folder,
  Star,
  Compass,
  Globe,
  User,
} from 'lucide-react';
import {
  GlassCard,
  HeroGreeting,
  ActionPill,
  CircleFAB,
  ChatBubble,
  ChatComposer,
  NavDrawer,
} from '@/components/ui-vibes';
import '@/components/ui-vibes/vibes-tokens.css';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: <Home size={18} /> },
  { id: 'chats', label: 'Chats', icon: <MessageSquare size={18} /> },
  { id: 'history', label: 'History', icon: <Clock size={18} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  { id: 'files', label: 'Files', icon: <Folder size={18} /> },
  { id: 'favorites', label: 'Favorites', icon: <Star size={18} /> },
];

export default function UIVibesDemo() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [messages, setMessages] = useState([
    {
      id: '1',
      variant: 'incoming' as const,
      sender: 'mine.ai',
      text: 'Hey there! How can I help you today?',
      time: '2m ago',
    },
    {
      id: '2',
      variant: 'incoming' as const,
      sender: 'mine.ai',
      text: 'I can assist with code, answer questions, or just chat.',
      time: '2m ago',
    },
    {
      id: '3',
      variant: 'outgoing' as const,
      sender: 'You',
      text: 'Show me the spectral-edge variant!',
      time: '1m ago',
    },
  ]);

  const handleSend = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        variant: 'outgoing' as const,
        sender: 'You',
        text,
        time: 'now',
      },
    ]);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080808',
        color: 'rgba(255,255,255,0.92)',
        position: 'relative',
        overflow: 'auto',
      }}
    >
      {/* ─── NavDrawer ──────────────────────────────────────────── */}
      <NavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={NAV_ITEMS}
        activeId={activeNav}
        onSelect={(id) => {
          setActiveNav(id);
          setDrawerOpen(false);
        }}
        title="Menu"
        userName="Demo User"
        userAvatar={<User size={24} style={{ color: 'rgba(255,255,255,0.5)' }} />}
        footer={
          <GlassCard accentMode="teal-core">
            <span style={{ fontSize: '0.8125rem' }}>Upgrade to Pro</span>
          </GlassCard>
        }
      />

      {/* ─── Page content ─────────────────────────────────────── */}
      <div style={{ maxWidth: 440, margin: '0 auto', padding: '0 16px' }}>

        {/* Hamburger */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0' }}>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              padding: 8,
            }}
            aria-label="Open menu"
          >
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <path d="M1 1h20M1 8h20M1 15h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ─── Hero ───────────────────────────────────────────── */}
        <HeroGreeting
          heading="Hello, I'm mine.ai"
          subtitle="How can I help you today?"
        />

        {/* ─── Action pills ───────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', padding: '12px 0 32px' }}>
          <ActionPill label="Explore" icon={<Compass size={14} />} />
          <ActionPill label="Browse" icon={<Globe size={14} />} />
        </div>

        {/* ─── Spectral-edge GlassCard ────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <GlassCard accentMode="spectral-edge">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 6 }}>
              Spectral Edge
            </h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.7, lineHeight: 1.6 }}>
              Prismatic gradient border with green→cyan→magenta→orange transitions
              and soft multi-tone diffused cinematic halo.
            </p>
          </GlassCard>
        </div>

        {/* ─── Teal-core GlassCard ────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <GlassCard accentMode="teal-core">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 6 }}>
              Teal Core
            </h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.7, lineHeight: 1.6 }}>
              Solid cyan-teal luminous edge with single-color atmospheric halo.
            </p>
          </GlassCard>
        </div>

        {/* ─── Chat section ───────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 16 }}>
            Chat
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                variant={msg.variant}
                senderName={msg.sender}
                timestamp={msg.time}
                avatar={
                  msg.variant === 'incoming' ? (
                    <User size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />
                  ) : undefined
                }
              >
                {msg.text}
              </ChatBubble>
            ))}
          </div>
        </div>

        {/* ─── Composer ───────────────────────────────────────── */}
        <div style={{ paddingBottom: 32 }}>
          <ChatComposer
            onSend={handleSend}
            onMicClick={() => {}}
            onPlusClick={() => {}}
          />
        </div>

        {/* ─── FAB showcase ───────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 16 }}>
            CircleFAB
          </h2>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <CircleFAB
              icon={<Compass size={20} />}
              ariaLabel="Explore"
              accentMode="teal-core"
            />
            <CircleFAB
              icon={<Star size={20} />}
              ariaLabel="Favorite"
              accentMode="spectral-edge"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
