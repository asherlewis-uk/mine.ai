import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";

export function WelcomeBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-8 px-6"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/10 flex items-center justify-center mb-4">
        <Sparkles size={26} className="text-blue-400" />
      </div>
      <h2 className="text-lg font-semibold text-zinc-100 mb-1 text-balance text-center tracking-tight">
        Welcome to mine.ai
      </h2>
      <p className="text-[13px] text-zinc-500 text-center max-w-[260px] leading-relaxed">
        Your personal AI assistant. Ask me anything to get started.
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-5">
        {["Write code", "Explain concepts", "Brainstorm ideas"].map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-900/80 rounded-full px-3 py-1.5 border border-zinc-800/60"
          >
            <ChevronRight size={11} className="text-blue-400" />
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
