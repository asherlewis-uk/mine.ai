import { Brain, ChevronDown } from "lucide-react";

interface ThinkingBlockProps {
  content: string;
}

export function ThinkingBlock({ content }: ThinkingBlockProps) {
  return (
    <details className="group mt-2 mb-1">
      <summary className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-amber-400/70 hover:text-amber-400 transition-colors select-none list-none">
        <Brain size={12} className="text-amber-500/60" />
        <span>Chain of Thought</span>
        <ChevronDown
          size={12}
          className="transition-transform duration-200 group-open:rotate-180 text-amber-500/40"
        />
      </summary>
      <div className="mt-1.5 border-l-4 border-amber-500/50 bg-amber-500/[0.04] rounded-r-lg px-3 py-2.5">
        <p className="text-[12px] italic leading-relaxed text-zinc-400/90 tracking-tight">
          {content}
        </p>
      </div>
    </details>
  );
}
