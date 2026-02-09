"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { motion } from "framer-motion";
import { Plus, User, MessageSquare, Pencil, Trash2, MoreVertical } from "lucide-react";
import { db, getAllCharacters, deleteCharacter, type Character } from "@/lib/db";
import { CharacterWizard } from "./CharacterWizard";
import { CharacterProfileSheet } from "./CharacterProfileSheet";

interface CharacterSidebarTabProps {
  onSelectCharacter: (character: Character) => void;
  activeCharacterId?: number | null;
}

export function CharacterSidebarTab({ onSelectCharacter, activeCharacterId }: CharacterSidebarTabProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [profileCharacter, setProfileCharacter] = useState<Character | null>(null);
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
                onEdit={() => setEditingCharacter(character)}
                onViewProfile={() => setProfileCharacter(character)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Character Wizard Modal (Create New) */}
      <CharacterWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onSave={(character) => {
          setShowWizard(false);
          onSelectCharacter(character);
        }}
      />

      {/* Character Wizard Modal (Edit Existing) */}
      <CharacterWizard
        isOpen={!!editingCharacter}
        onClose={() => setEditingCharacter(null)}
        existingCharacter={editingCharacter || undefined}
        onSave={(character) => {
          setEditingCharacter(null);
          onSelectCharacter(character);
        }}
      />

      {/* Character Profile Sheet */}
      <CharacterProfileSheet
        isOpen={!!profileCharacter}
        onClose={() => setProfileCharacter(null)}
        character={profileCharacter}
        onDeleted={() => setProfileCharacter(null)}
        onUpdated={(updated) => {
          setProfileCharacter(updated);
          onSelectCharacter(updated);
        }}
      />
    </div>
  );
}

interface CharacterCardProps {
  character: Character;
  isActive: boolean;
  onClick: () => void;
  onEdit: () => void;
  onViewProfile: () => void;
}

function CharacterCard({ character, isActive, onClick, onEdit, onViewProfile }: CharacterCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const threadCount = useLiveQuery(
    async () => {
      if (!character.id) return 0;
      return db.threads.where("characterId").equals(character.id).count();
    },
    [character.id],
    0
  );

  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu(!showMenu);
        }}
        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
          isActive
            ? "bg-blue-600/20 border border-blue-600/50"
            : "bg-zinc-800 hover:bg-zinc-700 border border-transparent"
        }`}
      >
        {/* Avatar */}
        <div
          className="shrink-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile();
          }}
        >
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

      {/* Hover action buttons */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700 text-zinc-400 hover:text-blue-400 hover:border-blue-500/50 transition-all"
          aria-label="Edit character"
        >
          <Pencil size={13} />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-all"
          aria-label="More options"
        >
          <MoreVertical size={13} />
        </motion.button>
      </div>

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute right-2 top-full mt-1 z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl overflow-hidden min-w-[160px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              onViewProfile();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors text-left"
          >
            <User size={14} />
            View Profile
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(false);
              onEdit();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors text-left"
          >
            <Pencil size={14} />
            Edit Character
          </button>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              setShowMenu(false);
              if (character.id && confirm(`Delete ${character.name}? This will also delete all associated chats.`)) {
                await deleteCharacter(character.id);
              }
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-900/30 transition-colors text-left"
          >
            <Trash2 size={14} />
            Delete Character
          </button>
        </div>
      )}
    </div>
  );
}
