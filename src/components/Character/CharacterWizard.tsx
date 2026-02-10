"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, User, Image as ImageIcon, MessageSquare, FileText, Sparkles } from "lucide-react";
import { createCharacter, updateCharacter, type Character } from "@/lib/db";
import { Avatar } from "@/components/Avatar";

interface CharacterWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (character: Character) => void;
  existingCharacter?: Character; // For editing
}

type WizardStep = "name" | "photo" | "greetings" | "details";

export function CharacterWizard({ isOpen, onClose, onSave, existingCharacter }: CharacterWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("name");
  const [name, setName] = useState(existingCharacter?.name || "");
  const [avatar, setAvatar] = useState(existingCharacter?.avatar || "");
  const [subtitle, setSubtitle] = useState(existingCharacter?.subtitle || "");
  const [description, setDescription] = useState(existingCharacter?.description || "");
  const [definition, setDefinition] = useState(existingCharacter?.definition || "");
  const [greetings, setGreetings] = useState<string[]>(existingCharacter?.greetings || []);
  const [useAiGreeting, setUseAiGreeting] = useState(existingCharacter?.useAiGreeting || false);
  const [currentGreeting, setCurrentGreeting] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps: WizardStep[] = ["name", "photo", "greetings", "details"];
  const currentStepIndex = steps.indexOf(currentStep);
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAddGreeting = () => {
    if (currentGreeting.trim() && currentGreeting.length <= 4096) {
      setGreetings([...greetings, currentGreeting.trim()]);
      setCurrentGreeting("");
    }
  };

  const handleRemoveGreeting = (index: number) => {
    setGreetings(greetings.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const handleSave = async () => {
    try {
      const characterData = {
        name,
        avatar,
        subtitle,
        description,
        definition,
        greetings,
        useAiGreeting,
      };

      let character: Character;
      if (existingCharacter?.id) {
        await updateCharacter(existingCharacter.id, characterData);
        character = { ...existingCharacter, ...characterData, updatedAt: new Date() };
      } else {
        character = await createCharacter(characterData);
      }

      onSave?.(character);
      onClose();
    } catch (error) {
      console.error("Failed to save character:", error);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "name":
        return name.trim().length > 0;
      case "photo":
        return true; // Optional
      case "greetings":
        return useAiGreeting || greetings.length > 0;
      case "details":
        return subtitle.trim().length > 0 && description.trim().length > 0;
      default:
        return true;
    }
  };

  const getStepIcon = (step: WizardStep) => {
    switch (step) {
      case "name": return User;
      case "photo": return ImageIcon;
      case "greetings": return MessageSquare;
      case "details": return FileText;
    }
  };

  const getStepTitle = (step: WizardStep) => {
    switch (step) {
      case "name": return "Character Name";
      case "photo": return "Character Photo";
      case "greetings": return "Greetings";
      case "details": return "Character Details";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50"
          >
            <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
                <div className="flex items-center gap-3">
                  {React.createElement(getStepIcon(currentStep), { className: "w-5 h-5 text-blue-500" })}
                  <h2 className="text-lg font-semibold text-white">{getStepTitle(currentStep)}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-zinc-400 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="px-6 py-3 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex gap-2">
                  {steps.map((step, index) => (
                    <div
                      key={step}
                      className={`flex-1 h-1.5 rounded-full transition-colors ${
                        index <= currentStepIndex ? "bg-blue-500" : "bg-zinc-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {currentStep === "name" && (
                    <motion.div
                      key="name"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-zinc-400 mb-4">
                        Give your character a memorable name. This will be displayed in conversations.
                      </p>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Joe, Sarah, Dr. Watson..."
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    </motion.div>
                  )}

                  {currentStep === "photo" && (
                    <motion.div
                      key="photo"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-zinc-400 mb-4">
                        Upload a photo or image to represent your character.
                      </p>
                      
                      <div className="flex flex-col items-center gap-4">
                        {/* Avatar Preview */}
                        <div className="relative">
                          {avatar ? (
                            <img 
                              src={avatar} 
                              alt={name} 
                              className="w-32 h-32 rounded-full object-cover border-4 border-zinc-700"
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center">
                              <User className="w-12 h-12 text-zinc-600" />
                            </div>
                          )}
                        </div>

                        {/* Upload Button */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700"
                        >
                          {avatar ? "Change Photo" : "Upload Photo"}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === "greetings" && (
                    <motion.div
                      key="greetings"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-zinc-400 mb-4">
                        Add greeting messages that your character will use to start conversations.
                      </p>

                      {/* AI Greeting Toggle */}
                      <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-zinc-300">Use AI Greeting for New Chats</span>
                        </div>
                        <button
                          onClick={() => setUseAiGreeting(!useAiGreeting)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            useAiGreeting ? "bg-blue-600" : "bg-zinc-700"
                          }`}
                        >
                          <motion.div
                            animate={{ x: useAiGreeting ? 24 : 2 }}
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          />
                        </button>
                      </div>

                      {useAiGreeting && (
                        <p className="text-xs text-blue-400 px-1">
                          The AI will automatically generate a greeting when starting new chats with this character.
                        </p>
                      )}

                      {/* Greeting Input */}
                      <div className={`space-y-2 transition-opacity ${useAiGreeting ? "opacity-40 pointer-events-none" : ""}`}>
                        <textarea
                          value={currentGreeting}
                          onChange={(e) => setCurrentGreeting(e.target.value.slice(0, 4096))}
                          placeholder="Type a greeting message..."
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={3}
                          disabled={useAiGreeting}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">{currentGreeting.length}/4096</span>
                          <div className="flex gap-2">
                            <button
                              onClick={handleAddGreeting}
                              disabled={!currentGreeting.trim() || useAiGreeting}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg transition-colors text-sm"
                            >
                              Add Greeting
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Greetings List */}
                      {greetings.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-zinc-300">Added Greetings</h4>
                          <div className="space-y-2">
                            {greetings.map((greeting, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-3 bg-zinc-800 rounded-lg border border-zinc-700"
                              >
                                <p className="flex-1 text-sm text-zinc-300">{greeting}</p>
                                <button
                                  onClick={() => handleRemoveGreeting(index)}
                                  className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </motion.div>
                  )}

                  {currentStep === "details" && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <p className="text-sm text-zinc-400 mb-4">
                        Define your character's personality and behavior with detailed instructions.
                      </p>

                      {/* Subtitle */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Tagline</label>
                        <input
                          type="text"
                          value={subtitle}
                          onChange={(e) => setSubtitle(e.target.value)}
                          placeholder="A short tagline..."
                          className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Description</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="A brief description of the character..."
                          className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={3}
                        />
                      </div>

                      {/* Definition */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Definition (Instructions)</label>
                        <textarea
                          value={definition}
                          onChange={(e) => setDefinition(e.target.value.slice(0, 32000))}
                          placeholder="Detailed personality, behavior, and response style instructions..."
                          className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={8}
                        />
                        <span className="text-xs text-zinc-500">{definition.length}/32,000</span>
                      </div>

                      {/* Preview */}
                      {greetings.length > 0 && (
                        <div className="mt-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                          <h4 className="text-sm font-medium text-zinc-300 mb-3">Preview</h4>
                          <div className="flex gap-3 items-start">
                            <Avatar role="ai" characterAvatar={avatar} />
                            <div className="flex-1 bg-zinc-700 rounded-2xl rounded-tl-sm p-3">
                              <p className="text-sm text-zinc-200">{greetings[0]}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-zinc-800 flex justify-between">
                <button
                  onClick={handleBack}
                  disabled={isFirstStep}
                  className="px-4 py-2 text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="flex gap-2">
                  {!isLastStep ? (
                    <button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      disabled={!canProceed()}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg transition-colors"
                    >
                      {existingCharacter ? "Update" : "Create"} Character
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
