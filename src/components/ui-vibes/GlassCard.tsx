'use client';

import React, { useEffect, useRef, type ReactNode } from 'react';
import type { AccentMode } from './types';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  accentMode?: AccentMode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  accentMode = 'spectral-edge',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--px', `${e.clientX - rect.left}px`);
      card.style.setProperty('--py', `${e.clientY - rect.top}px`);
    };
    document.addEventListener('pointermove', onPointer);
    return () => document.removeEventListener('pointermove', onPointer);
  }, []);

  const borderCls =
    accentMode === 'teal-core'
      ? styles['glass-card-border--teal-core']
      : styles['glass-card-border--spectral-edge'];

  const glowCls =
    accentMode === 'teal-core'
      ? styles['glass-card-glow--teal-core']
      : styles['glass-card-glow--spectral-edge'];

  return (
    <div
      ref={cardRef}
      className={`${styles['glass-card-container']} ${className}`}
    >
      <div className={`${styles['glass-card-glow']} ${glowCls}`} />
      <div className={`${styles['glass-card-border']} ${borderCls}`} />
      <div className={styles['glass-card-surface']}>
        <div className={styles['glass-card-content']}>{children}</div>
      </div>
    </div>
  );
};
