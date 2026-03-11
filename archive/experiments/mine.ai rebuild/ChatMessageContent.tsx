import React from 'react';
import { Copy, Terminal } from 'lucide-react';

export const ChatMessageContent = ({ content }: { content: string }) => {
  const parts = content.split(/```(\w+)?\n([\s\S]*?)```/g);
  if (parts.length === 1) return <div className="whitespace-pre-wrap leading-relaxed">{content}</div>;
  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        if (index % 3 === 0) return part.trim() ? <div key={index} className="whitespace-pre-wrap">{part}</div> : null;
        if (index % 3 === 2) {
            const lang = parts[index - 1] || 'text';
            return (
                <div key={index} className="rounded-lg overflow-hidden my-4 border border-white/10 bg-zinc-950 shadow-2xl group">
                    <div className="px-4 py-2 bg-white/5 text-[10px] uppercase font-mono text-zinc-500 border-b border-white/5 flex justify-between items-center">
                        <span className="flex items-center gap-2"><Terminal className="w-3.5 h-3.5" /> {lang}</span>
                        <button className="hover:text-white" onClick={() => navigator.clipboard.writeText(part)}><Copy className="w-3.5 h-3.5" /></button>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm font-mono text-zinc-300"><code>{part}</code></pre>
                </div>
            );
        }
        return null;
      })}
    </div>
  );
};

