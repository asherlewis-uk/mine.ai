import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  role: "user" | "ai";
  className?: string;
  characterAvatar?: string; // Optional character avatar (base64 or URL)
}

export function Avatar({ role, className, characterAvatar }: AvatarProps) {
  // If a character avatar is provided for AI role, use it
  if (role === "ai" && characterAvatar) {
    return (
      <div className={cn("shrink-0 w-8 h-8", className)}>
        <img
          src={characterAvatar}
          alt="Character"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full shrink-0 w-8 h-8",
        role === "ai"
          ? "bg-zinc-800 text-blue-400"
          : "bg-gradient-to-br from-blue-600 to-indigo-600 text-zinc-100",
        className,
      )}
    >
      {role === "ai" ? <Bot size={15} /> : <User size={15} />}
    </div>
  );
}
