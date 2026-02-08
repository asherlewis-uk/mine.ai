import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { ThinkingBlock } from "./ThinkingBlock";
import type { Message } from "@/lib/db";

interface ChatBubbleProps {
  message: Message;
  bubbleStyle?: "default" | "modern" | "compact";
  characterAvatar?: string; // Optional character avatar
}

const messageVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 30, mass: 0.8 },
  },
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function ChatBubble({ message, bubbleStyle = "default", characterAvatar }: ChatBubbleProps) {
  const isAI = message.role === "ai";

  // Define bubble style variants
  const getBubbleClasses = () => {
    const baseClasses = "px-4 py-2.5 text-[13.5px] leading-relaxed tracking-tight";
    
    if (bubbleStyle === "modern") {
      // Modern: Sleek with minimal borders, larger radius
      return cn(
        baseClasses,
        "rounded-3xl",
        isAI
          ? "bg-zinc-900/60 text-zinc-100 border border-zinc-700/40 backdrop-blur-sm"
          : "bg-gradient-to-br from-blue-600 to-purple-600 text-zinc-100 shadow-xl shadow-blue-600/20"
      );
    }
    
    if (bubbleStyle === "compact") {
      // Compact: Smaller padding, tighter spacing
      return cn(
        "px-3 py-1.5 text-[13px] leading-snug tracking-tight rounded-xl",
        isAI
          ? "bg-zinc-900 text-zinc-100 border border-zinc-800/60"
          : "bg-blue-600 text-zinc-100 shadow-md"
      );
    }
    
    // Default: Original styling
    return cn(
      baseClasses,
      "rounded-2xl",
      isAI
        ? "bg-zinc-900 text-zinc-100 rounded-tl-md border border-zinc-800/60"
        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-zinc-100 rounded-tr-md shadow-lg shadow-blue-600/10"
    );
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      layout
      className={cn(
        "flex gap-2.5 px-4 py-1.5",
        isAI ? "justify-start" : "justify-end",
      )}
    >
      {isAI && <Avatar role="ai" className="mt-1" characterAvatar={characterAvatar} />}
      <div
        className={cn(
          "flex flex-col max-w-[80%]",
          isAI ? "items-start" : "items-end",
        )}
      >
        <div className={getBubbleClasses()}>
          {isAI ? (
            <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:my-2 prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-code:text-blue-300 prose-code:bg-zinc-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-headings:mt-3 prose-headings:mb-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>
        {isAI && message.thinking && (
          <div className="w-full">
            <ThinkingBlock content={message.thinking} />
          </div>
        )}
        <span className="text-[10px] text-zinc-500 mt-1 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
      {!isAI && <Avatar role="user" className="mt-1" />}
    </motion.div>
  );
}
