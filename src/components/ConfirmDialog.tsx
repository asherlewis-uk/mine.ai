"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Alert Dialog (single-button informational) ─────────────────
interface AlertDialogProps {
  isOpen: boolean;
  title: string;
  message: string | ReactNode;
  buttonLabel?: string;
  onClose: () => void;
}

export function AlertDialog({
  isOpen,
  title,
  message,
  buttonLabel = "OK",
  onClose,
}: AlertDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-w-sm w-full overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <h3 className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {title}
                </h3>
                <div className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                  {message}
                </div>
              </div>
              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full px-4 py-2.5 rounded-xl text-[14px] font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  {buttonLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Confirm Dialog ──────────────────────────────────────────────
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-w-sm w-full overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <h3 className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {title}
                </h3>
                <div className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {message}
                </div>
              </div>
              <div className="flex gap-3 px-6 pb-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 px-4 py-2.5 rounded-xl text-[14px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-[14px] font-medium text-white transition-colors ${
                    destructive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Prompt Dialog ───────────────────────────────────────────────
interface PromptDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function PromptDialog({
  isOpen,
  title,
  message,
  defaultValue = "",
  placeholder = "",
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, defaultValue]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm(value);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, onConfirm, value]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-w-sm w-full overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <h3 className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {title}
                </h3>
                {message && (
                  <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
                    {message}
                  </p>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-xl text-[14px] bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500/40 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                />
              </div>
              <div className="flex gap-3 px-6 pb-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 px-4 py-2.5 rounded-xl text-[14px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={() => onConfirm(value)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-[14px] font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Select Dialog (replaces prompt() for selection lists) ──────
interface SelectDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  options: string[];
  currentValue?: string;
  onSelect: (value: string) => void;
  onCancel: () => void;
}

export function SelectDialog({
  isOpen,
  title,
  message,
  options,
  currentValue,
  onSelect,
  onCancel,
}: SelectDialogProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-w-sm w-full overflow-hidden">
              <div className="px-6 pt-6 pb-2">
                <h3 className="text-[17px] font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                  {title}
                </h3>
                {message && (
                  <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">
                    {message}
                  </p>
                )}
              </div>
              <div className="px-4 pb-2 max-h-[300px] overflow-y-auto">
                {options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onSelect(option)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-[14px] transition-colors mb-1 ${
                      currentValue === option
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {option}
                    {currentValue === option && " ✓"}
                  </button>
                ))}
              </div>
              <div className="px-6 pb-6 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full px-4 py-2.5 rounded-xl text-[14px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
