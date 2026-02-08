import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Thread } from "@/lib/db";

interface ThreadItemProps {
  thread: Thread;
  isActive: boolean;
  onClick: () => void;
}

function formatThreadDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export function ThreadItem({ thread, isActive, onClick }: ThreadItemProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors",
        isActive
          ? "bg-blue-600/10 text-zinc-100"
          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200",
      )}
    >
      <div className="shrink-0 mt-0.5">
        <MessageSquare
          size={15}
          className={cn(isActive ? "text-blue-400" : "text-zinc-600")}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-medium truncate tracking-tight">
            {thread.title}
          </span>
          <span className="text-[10px] text-zinc-600 shrink-0">
            {formatThreadDate(thread.updatedAt)}
          </span>
        </div>
      </div>
    </motion.button>
  );
}
