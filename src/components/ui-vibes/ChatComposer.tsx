'use client';

import React, { useState, useRef, type FormEvent } from 'react';
import { Plus, Send, Mic } from 'lucide-react';
import { CircleFAB } from './CircleFAB';
import styles from './ChatComposer.module.css';

interface ChatComposerProps {
  onSend: (message: string) => void;
  onPlusClick?: () => void;
  onMicClick?: () => void;
  placeholder?: string;
  className?: string;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  onSend,
  onPlusClick,
  onMicClick,
  placeholder = 'Ask me anything...',
  className = '',
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form
      className={`${styles['chat-composer']} ${className}`}
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        className={styles['composer-plus']}
        onClick={onPlusClick}
        aria-label="Attach"
      >
        <Plus size={18} />
      </button>

      <input
        ref={inputRef}
        type="text"
        className={styles['composer-input']}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      <div className={styles['composer-actions']}>
        <CircleFAB
          icon={<Send size={18} />}
          onClick={() => handleSubmit()}
          ariaLabel="Send message"
          accentMode="teal-core"
        />
        {onMicClick && (
          <CircleFAB
            icon={<Mic size={18} />}
            onClick={onMicClick}
            ariaLabel="Voice input"
            accentMode="teal-core"
          />
        )}
      </div>
    </form>
  );
};
