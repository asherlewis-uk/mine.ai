"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";
import { Plus, User, MessageSquare } from "lucide-react";
import { db, getAllCharacters, type Character } from "@/lib/db";
import { CharacterWizard } from "./CharacterWizard";

interface CharacterSidebarTabProps {
  onSelectCharacter: (character: Character) => void;
  activeCharacterId?: number | null;
}

export function CharacterSidebarTab({ onSelectCharacter, activeCharacterId }: CharacterSidebarTabProps) {
  const [showWizard, setShowWizard] = useState(false);
  const characters = useLiveQuery(() => getAllCharacters(), []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800">
        <button
          onClick={() => setShowWizard(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Create Character</span>
        </button>
      </div>

      {/* Character List */}
      <div className="flex-1 overflow-y-auto">
        {!characters || characters.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Characters Yet</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Create your first AI character to start personalized conversations.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors text-sm"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                isActive={activeCharacterId === character.id}
                onClick={() => onSelectCharacter(character)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Character Wizard Modal */}
      <CharacterWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onSave={(character) => {
          setShowWizard(false);
          onSelectCharacter(character);
        }}
      />
    </div>
  );
}

interface CharacterCardProps {
  character: Character;
  isActive: boolean;
  onClick: () => void;
}

function CharacterCard({ character, isActive, onClick }: CharacterCardProps) {
  const threadCount = useLiveQuery(
    async () => {
      if (!character.id) return 0;
      return db.threads.where("characterId").equals(character.id).count();
    },
    [character.id],
    0
  );

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
        isActive
          ? "bg-blue-600/20 border border-blue-600/50"
          : "bg-zinc-800 hover:bg-zinc-700 border border-transparent"
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        {character.avatar ? (
          <img
            src={character.avatar}
            alt={character.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
            <User className="w-6 h-6 text-zinc-400" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate">{character.name}</h3>
        <p className="text-xs text-zinc-400 truncate">{character.subtitle || character.description}</p>
      </div>

      {/* Thread Count */}
      {threadCount > 0 && (
        <div className="flex items-center gap-1 text-xs text-zinc-500">
          <MessageSquare className="w-3 h-3" />
          <span>{threadCount}</span>
        </div>
      )}
    </motion.button>
  );
}
