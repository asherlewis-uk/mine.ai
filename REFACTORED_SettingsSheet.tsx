"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Mail,
  PlusSquare,
  ArrowUpCircle,
  Bell,
  Database,
  Archive,
  Shield,
  Globe,
  Moon,
  Palette,
  Smartphone,
  Type,
  Bug,
  HelpCircle,
  FileText,
  Lock,
  LogOut,
  Check,
  Brain,
  Server,
  MessageSquare,
} from "lucide-react";
import { db, getSetting, setSetting, getAllSettings } from "@/lib/db";

// ─── Types ───────────────────────────────────────────────────────
type Screen = "root" | "personalization" | "security" | "data" | "about" | "ai";

// ─── Accent Colors ───────────────────────────────────────────────
const ACCENT_COLORS = [
  { name: "Blue", hex: "#3b82f6", class: "bg-blue-500" },
  { name: "Green", hex: "#22c55e", class: "bg-green-500" },
  { name: "Orange", hex: "#f97316", class: "bg-orange-500" },
  { name: "Pink", hex: "#ec4899", class: "bg-pink-500" },
  { name: "Purple", hex: "#a855f7", class: "bg-purple-500" },
];

// ─── iOS Toggle ──────────────────────────────────────────────────
function IOSToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[31px] w-[51px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-green-500" : "bg-zinc-600"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-[27px] w-[27px] rounded-full bg-white shadow-lg transition-transform duration-200 ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────
function Section({
  title,
  footer,
  children,
}: {
  title?: string;
  footer?: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-6">
      {title && (
        <h3 className="mb-1.5 px-4 text-sm font-medium text-zinc-500">
          {title}
        </h3>
      )}
      <div className="mx-0 overflow-hidden rounded-xl bg-zinc-900/80">
        {children}
      </div>
      {footer && (
        <p className="mt-1.5 px-4 text-xs text-zinc-500 leading-relaxed">
          {footer}
        </p>
      )}
    </div>
  );
}

// ─── Row (nav / info / toggle) ───────────────────────────────────
function Row({
  icon,
  label,
  value,
  onClick,
  toggle,
  toggleValue,
  onToggle,
  isLast = false,
  destructive = false,
}: {
  icon?: ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  isLast?: boolean;
  destructive?: boolean;
}) {
  const content = (
    <div
      className={`flex min-h-[48px] items-center gap-3 px-4 py-3 ${
        !isLast ? "border-b border-zinc-800/60" : ""
      }`}
    >
      {icon && (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-zinc-400">
          {icon}
        </span>
      )}
      <span
        className={`flex-1 text-[16px] ${destructive ? "text-red-400" : "text-zinc-100"}`}
      >
        {label}
      </span>
      {toggle && onToggle && (
        <IOSToggle checked={toggleValue ?? false} onChange={onToggle} />
      )}
      {!toggle && value && (
        <span className="text-[15px] text-zinc-500">{value}</span>
      )}
      {!toggle && onClick && (
        <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
      )}
    </div>
  );

  if (onClick && !toggle) {
    return (
      <button
        type="button"
        className="w-full text-left active:bg-zinc-800/60 transition-colors"
        onClick={onClick}
      >
        {content}
      </button>
    );
  }
  return content;
}

// ─── Sub-page header ─────────────────────────────────────────────
function SubHeader({
  title,
  onBack,
  rightAction,
}: {
  title: string;
  onBack: () => void;
  rightAction?: ReactNode;
}) {
  return (
    <div className="relative flex h-14 items-center justify-center px-4 border-b border-zinc-800/40">
      <button
        type="button"
        onClick={onBack}
        className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 active:bg-zinc-800"
        aria-label="Back"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <h2 className="text-[17px] font-semibold text-zinc-100">{title}</h2>
      {rightAction && <div className="absolute right-3">{rightAction}</div>}
    </div>
  );
}

// ─── Accent color dropdown ───────────────────────────────────────
function AccentColorRow({
  selected,
  onSelect,
  isLast = false,
}: {
  selected: string;
  onSelect: (hex: string) => void;
  isLast?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const current = ACCENT_COLORS.find((c) => c.hex === selected) || ACCENT_COLORS[0];

  return (
    <div
      ref={dropdownRef}
      className={`relative ${!isLast ? "border-b border-zinc-800/60" : ""}`}
    >
      <button
        type="button"
        className="flex min-h-[48px] w-full items-center gap-3 px-4 py-3 text-left active:bg-zinc-800/60 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center text-zinc-400">
          <Palette className="h-5 w-5" />
        </span>
        <span className="flex-1 text-[16px] text-zinc-100">Accent color</span>
        <span className="flex items-center gap-2 text-[15px] text-zinc-500">
          <span
            className={`inline-block h-3 w-3 rounded-full ${current.class}`}
          />
          {current.name}
        </span>
      </button>

      {open && (
        <div className="absolute right-4 top-full z-50 mt-1 w-52 overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900 shadow-2xl">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-zinc-800 transition-colors"
              onClick={() => {
                onSelect(c.hex);
                setOpen(false);
              }}
            >
              {selected === c.hex ? (
                <Check className="h-4 w-4 text-zinc-300" />
              ) : (
                <span className="h-4 w-4" />
              )}
              <span className={`h-3.5 w-3.5 rounded-full ${c.class}`} />
              <span className="text-[15px] text-zinc-100">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Appearance select ───────────────────────────────────────────
function AppearanceRow({
  value,
  onChange,
  isLast = false,
}: {
  value: string;
  onChange: (v: string) => void;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex min-h-[48px] items-center gap-3 px-4 py-3 ${
        !isLast ? "border-b border-zinc-800/60" : ""
      }`}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-zinc-400">
        <Moon className="h-5 w-5" />
      </span>
      <span className="flex-1 text-[16px] text-zinc-100">Appearance</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none rounded-full bg-zinc-700/70 py-1.5 pl-3 pr-7 text-[14px] text-zinc-300 outline-none"
        >
          <option>System</option>
          <option>Light</option>
          <option>Dark</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Sub-screens
// ═══════════════════════════════════════════════════════════════

function AISettingsScreen({ onBack }: { onBack: () => void }) {
  const settings = useLiveQuery(() => getAllSettings());
  const [localApiUrl, setLocalApiUrl] = useState("");
  const [localModelName, setLocalModelName] = useState("");
  const [localTemperature, setLocalTemperature] = useState(0.7);
  const [localThinking, setLocalThinking] = useState(true);

  useEffect(() => {
    if (settings) {
      setLocalApiUrl(settings.apiUrl);
      setLocalModelName(settings.modelName);
      setLocalTemperature(settings.temperature);
      setLocalThinking(settings.thinkingEnabled);
    }
  }, [settings]);

  const handleSave = async () => {
    await setSetting("apiUrl", localApiUrl);
    await setSetting("modelName", localModelName);
    await setSetting("temperature", localTemperature);
    await setSetting("thinkingEnabled", localThinking);
    onBack();
  };

  if (!settings) return null;

  return (
    <div className="flex h-full flex-col">
      <SubHeader
        title="AI Configuration"
        onBack={onBack}
        rightAction={
          <button
            type="button"
            onClick={handleSave}
            className="flex h-10 items-center justify-center rounded-full border border-zinc-700 px-4 text-[15px] text-zinc-300 active:bg-zinc-800"
          >
            Save
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
        <Section title="API Endpoint">
          <div className="px-4 py-3">
            <input
              type="text"
              value={localApiUrl}
              onChange={(e) => setLocalApiUrl(e.target.value)}
              placeholder="http://localhost:11434/v1/chat/completions"
              className="w-full bg-transparent text-[15px] text-zinc-200 outline-none placeholder:text-zinc-600"
            />
          </div>
        </Section>

        <Section title="Model Name">
          <div className="px-4 py-3">
            <input
              type="text"
              value={localModelName}
              onChange={(e) => setLocalModelName(e.target.value)}
              placeholder="llama2"
              className="w-full bg-transparent text-[15px] text-zinc-200 outline-none placeholder:text-zinc-600"
            />
          </div>
        </Section>

        <Section title="Temperature" footer={`Current: ${localTemperature}`}>
          <div className="px-4 py-3">
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={localTemperature}
              onChange={(e) => setLocalTemperature(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </Section>

        <Section title="Features">
          <Row
            icon={<Brain className="h-5 w-5" />}
            label="Show thinking process"
            toggle
            toggleValue={localThinking}
            onToggle={setLocalThinking}
            isLast
          />
        </Section>
      </div>
    </div>
  );
}

function PersonalizationScreen({ onBack }: { onBack: () => void }) {
  const systemPrompt = useLiveQuery(() => getSetting("systemPrompt"));
  const [localPrompt, setLocalPrompt] = useState("");

  useEffect(() => {
    if (systemPrompt) {
      setLocalPrompt(systemPrompt);
    }
  }, [systemPrompt]);

  const handleSave = async () => {
    await setSetting("systemPrompt", localPrompt);
    onBack();
  };

  return (
    <div className="flex h-full flex-col">
      <SubHeader
        title="Personalization"
        onBack={onBack}
        rightAction={
          <button
            type="button"
            onClick={handleSave}
            className="flex h-10 items-center justify-center rounded-full border border-zinc-700 px-4 text-[15px] text-zinc-300 active:bg-zinc-800"
          >
            Save
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
        <Section
          title="Custom instructions"
          footer="Tell the AI how to respond. This affects all conversations."
        >
          <div className="px-4 py-3">
            <textarea
              value={localPrompt}
              onChange={(e) => setLocalPrompt(e.target.value)}
              rows={6}
              className="w-full resize-none bg-transparent text-[15px] text-zinc-200 outline-none placeholder:text-zinc-600 leading-relaxed"
              placeholder="You are a helpful AI assistant..."
            />
          </div>
        </Section>

        <Section title="Memory">
          <Row
            icon={<Brain className="h-5 w-5" />}
            label="Memory (Coming Soon)"
            onClick={() => {}}
            isLast
          />
        </Section>
      </div>
    </div>
  );
}

function SecurityScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <SubHeader title="Security" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
        <div className="flex h-full items-center justify-center">
          <p className="text-zinc-500 text-[15px]">Coming Soon</p>
        </div>
      </div>
    </div>
  );
}

function DataScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <SubHeader title="Data Controls" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
        <Section title="Export & Delete">
          <Row
            icon={<Database className="h-5 w-5" />}
            label="Export all data"
            onClick={() => alert("Export feature coming soon!")}
          />
          <Row
            icon={<Archive className="h-5 w-5" />}
            label="Delete all data"
            onClick={() => {
              if (confirm("This will delete ALL data. Continue?")) {
                db.delete().then(() => {
                  window.location.reload();
                });
              }
            }}
            destructive
            isLast
          />
        </Section>
      </div>
    </div>
  );
}

function AboutScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <SubHeader title="About" onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
        <Section title="Information">
          <Row icon={<Bug className="h-5 w-5" />} label="Report bug" onClick={() => {}} />
          <Row
            icon={<HelpCircle className="h-5 w-5" />}
            label="Help Center"
            onClick={() => {}}
          />
          <Row
            icon={<FileText className="h-5 w-5" />}
            label="Terms of Use"
            onClick={() => {}}
          />
          <Row
            icon={<Lock className="h-5 w-5" />}
            label="Privacy Policy"
            onClick={() => {}}
          />
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center">
              <span className="h-4 w-4 rounded-full bg-zinc-400" />
            </span>
            <div className="flex flex-col">
              <span className="text-[16px] text-zinc-100">mine.ai</span>
              <span className="text-[13px] text-zinc-500">1.0.0</span>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main settings modal
// ═══════════════════════════════════════════════════════════════

export function SettingsSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [screen, setScreen] = useState<Screen>("root");

  // Load settings from DB
  const hapticEnabled = useLiveQuery(() => getSetting("haptic_enabled"));
  const spellingEnabled = useLiveQuery(() => getSetting("spelling_enabled"));
  const accentColor = useLiveQuery(() => getSetting("accent_color"));
  const appearance = useLiveQuery(() => getSetting("appearance"));

  const handleHapticToggle = async (value: boolean) => {
    await setSetting("haptic_enabled", value);
  };

  const handleSpellingToggle = async (value: boolean) => {
    await setSetting("spelling_enabled", value);
  };

  const handleAccentColorChange = async (hex: string) => {
    await setSetting("accent_color", hex);
    // Apply CSS variable
    document.documentElement.style.setProperty("--accent-color", hex);
  };

  const handleAppearanceChange = async (value: string) => {
    await setSetting("appearance", value);
  };

  // Reset to root when closing
  useEffect(() => {
    if (!isOpen) {
      setScreen("root");
    }
  }, [isOpen]);

  // Apply accent color on load
  useEffect(() => {
    if (accentColor) {
      document.documentElement.style.setProperty("--accent-color", accentColor);
    }
  }, [accentColor]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />

      {/* modal container */}
      <div className="relative z-10 flex h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-zinc-950 sm:h-[85vh] sm:rounded-3xl">
        {screen === "ai" && <AISettingsScreen onBack={() => setScreen("root")} />}
        {screen === "personalization" && (
          <PersonalizationScreen onBack={() => setScreen("root")} />
        )}
        {screen === "security" && <SecurityScreen onBack={() => setScreen("root")} />}
        {screen === "data" && <DataScreen onBack={() => setScreen("root")} />}
        {screen === "about" && <AboutScreen onBack={() => setScreen("root")} />}

        {screen === "root" && (
          <>
            {/* header */}
            <div className="relative flex h-14 shrink-0 items-center justify-center border-b border-zinc-800/40">
              <h2 className="text-[17px] font-semibold text-zinc-100">
                Settings
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 active:bg-zinc-800"
                aria-label="Close settings"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* scrollable body */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8">
              {/* ── AI Configuration ──────────────────── */}
              <Section title="AI Configuration">
                <Row
                  icon={<Server className="h-5 w-5" />}
                  label="API & Model"
                  onClick={() => setScreen("ai")}
                />
                <Row
                  icon={<MessageSquare className="h-5 w-5" />}
                  label="Personalization"
                  onClick={() => setScreen("personalization")}
                  isLast
                />
              </Section>

              {/* ── Account ─────────────────────────── */}
              <Section title="Account">
                <Row icon={<Mail className="h-5 w-5" />} label="Email" onClick={() => {}} />
                <Row
                  icon={<PlusSquare className="h-5 w-5" />}
                  label="Subscription"
                  value="Free Plan"
                  onClick={() => {}}
                />
                <Row
                  icon={<ArrowUpCircle className="h-5 w-5" />}
                  label="Upgrade to Pro"
                  onClick={() => {}}
                />
                <Row
                  icon={<Bell className="h-5 w-5" />}
                  label="Notifications"
                  onClick={() => {}}
                />
                <Row
                  icon={<Database className="h-5 w-5" />}
                  label="Data controls"
                  onClick={() => setScreen("data")}
                />
                <Row
                  icon={<Archive className="h-5 w-5" />}
                  label="Archived chats"
                  onClick={() => {}}
                />
                <Row
                  icon={<Shield className="h-5 w-5" />}
                  label="Security"
                  onClick={() => setScreen("security")}
                  isLast
                />
              </Section>

              {/* ── App ─────────────────────────────── */}
              <Section
                title="App"
                footer="For the best results, select the language you mainly speak."
              >
                <Row
                  icon={<Globe className="h-5 w-5" />}
                  label="App language"
                  value="English"
                  onClick={() => {}}
                />
                <AppearanceRow
                  value={appearance || "System"}
                  onChange={handleAppearanceChange}
                />
                <AccentColorRow
                  selected={accentColor || "#3b82f6"}
                  onSelect={handleAccentColorChange}
                />
                <Row
                  icon={<Smartphone className="h-5 w-5" />}
                  label="Haptic feedback"
                  toggle
                  toggleValue={hapticEnabled ?? true}
                  onToggle={handleHapticToggle}
                />
                <Row
                  icon={<Type className="h-5 w-5" />}
                  label="Correct spelling automatically"
                  toggle
                  toggleValue={spellingEnabled ?? true}
                  onToggle={handleSpellingToggle}
                  isLast
                />
              </Section>

              {/* ── About ───────────────────────────── */}
              <Section title="About">
                <Row
                  icon={<HelpCircle className="h-5 w-5" />}
                  label="About mine.ai"
                  onClick={() => setScreen("about")}
                  isLast
                />
              </Section>

              {/* ── Log out ─────────────────────────── */}
              <div className="overflow-hidden rounded-xl bg-zinc-900/80">
                <Row
                  icon={<LogOut className="h-5 w-5" />}
                  label="Clear all data"
                  onClick={() => {
                    if (confirm("Delete all threads and messages?")) {
                      db.threads.clear();
                      db.messages.clear();
                      onClose();
                    }
                  }}
                  destructive
                  isLast
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
