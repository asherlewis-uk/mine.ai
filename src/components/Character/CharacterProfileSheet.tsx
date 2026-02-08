"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit, Download, Trash2, User } from "lucide-react";
import { deleteCharacter, type Character } from "@/lib/db";
import { CharacterWizard } from "./CharacterWizard";

interface CharacterProfileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  character: Character | null;
  onDeleted?: () => void;
  onUpdated?: (character: Character) => void;
}

export function CharacterProfileSheet({
  isOpen,
  onClose,
  character,
  onDeleted,
  onUpdated,
}: CharacterProfileSheetProps) {
  const [showEditWizard, setShowEditWizard] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!character?.id) return;
    
    try {
      await deleteCharacter(character.id);
      onDeleted?.();
      onClose();
    } catch (error) {
      console.error("Failed to delete character:", error);
    }
  };

  const handleExport = () => {
    if (!character) return;

    const dataStr = JSON.stringify(character, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${character.name.toLowerCase().replace(/\s+/g, "-")}-character.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!character) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && !showEditWizard && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={onClose}
            />

            {/* Sheet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50"
            >
              <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
                {/* Header */}
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors p-1 z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Avatar & Name */}
                  <div className="flex flex-col items-center pt-6 pb-4 px-6">
                    {character.avatar ? (
                      <img
                        src={character.avatar}
                        alt={character.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-zinc-800 mb-4"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center mb-4">
                        <User className="w-10 h-10 text-zinc-600" />
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-white mb-1">{character.name}</h2>
                    <p className="text-sm text-zinc-400">{character.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                {character.description && (
                  <div className="px-6 py-4 border-t border-zinc-800">
                    <p className="text-sm text-zinc-300">{character.description}</p>
                  </div>
                )}

                {/* Menu Options */}
                <div className="px-4 py-4 border-t border-zinc-800 space-y-2">
                  <button
                    onClick={() => setShowEditWizard(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-left"
                  >
                    <Edit className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Edit Character</p>
                      <p className="text-xs text-zinc-400">Modify name, avatar, and personality</p>
                    </div>
                  </button>

                  <button
                    onClick={handleExport}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-left"
                  >
                    <Download className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Export Character</p>
                      <p className="text-xs text-zinc-400">Download as JSON file</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-800 hover:bg-red-900/50 rounded-lg transition-colors text-left"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">Delete Character</p>
                      <p className="text-xs text-zinc-400">Permanently remove this character</p>
                    </div>
                  </button>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                  <div className="px-4 py-4 border-t border-zinc-800 bg-red-900/20">
                    <p className="text-sm text-white mb-3">
                      Are you sure you want to delete <strong>{character.name}</strong>? This will also delete all associated chat history.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Wizard */}
      <CharacterWizard
        isOpen={showEditWizard}
        onClose={() => setShowEditWizard(false)}
        existingCharacter={character}
        onSave={(updatedCharacter) => {
          setShowEditWizard(false);
          onUpdated?.(updatedCharacter);
        }}
      />
    </>
  );
}
