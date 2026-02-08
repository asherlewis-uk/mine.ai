import { Clock } from "lucide-react";

interface DateDividerProps {
  label: string;
}

export function DateDivider({ label }: DateDividerProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-3">
      <div className="flex-1 h-px bg-zinc-800/60" />
      <span className="text-[10px] font-medium text-zinc-600 flex items-center gap-1">
        <Clock size={10} />
        {label}
      </span>
      <div className="flex-1 h-px bg-zinc-800/60" />
    </div>
  );
}
