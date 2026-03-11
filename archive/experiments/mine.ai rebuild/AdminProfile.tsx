'use client';
import React from 'react';
import { Shield, Fingerprint } from 'lucide-react';
import { UserProfile } from '@/lib/types';

export const AdminProfile: React.FC<{ profile: UserProfile; onUpdate: (p: UserProfile) => void }> = ({ profile, onUpdate }) => {
  const colors = ['bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500'];
  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
      <header className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-light text-white mb-2 flex items-center gap-3"><Shield className="w-8 h-8 text-indigo-400" /> Admin Protocol</h1>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="rounded-3xl bg-zinc-900 border border-white/5 p-8 flex flex-col items-center text-center">
             <div className={`w-32 h-32 rounded-full ${profile.avatarColor} flex items-center justify-center text-4xl font-bold text-white shadow-2xl mb-6 ring-4 ring-zinc-800`}>{profile.name.charAt(0)}</div>
             <h2 className="text-xl font-medium text-white">{profile.name}</h2>
          </div>
          <div className="rounded-3xl bg-zinc-900 border border-white/5 p-6">
             <div className="flex gap-3 flex-wrap justify-center">{colors.map(c => <button key={c} onClick={() => onUpdate({...profile, avatarColor: c})} className={`w-10 h-10 rounded-full ${c} ring-2 ring-offset-2 ring-offset-zinc-950 transition-all ${profile.avatarColor === c ? 'ring-white scale-110' : 'ring-transparent'}`} />)}</div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-zinc-900 border border-white/5 p-6 flex flex-col backdrop-blur-sm">
             <label className="text-sm text-zinc-400 mb-2 flex items-center gap-2"><Fingerprint className="w-4 h-4" /> User Context Injection</label>
             <textarea value={profile.bio} onChange={e => onUpdate({...profile, bio: e.target.value})} className="w-full h-48 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

