'use client';

import React, { type ReactNode } from 'react';
import type { AccentMode } from './types';
import styles from './CircleFAB.module.css';

interface CircleFABProps {
  icon: ReactNode;
  onClick?: () => void;
  accentMode?: AccentMode;
  ariaLabel: string;
  className?: string;
}

export const CircleFAB: React.FC<CircleFABProps> = ({
  icon,
  onClick,
  accentMode = 'teal-core',
  ariaLabel,
  className = '',
}) => {
  const modeCls =
    accentMode === 'teal-core'
      ? styles['circle-fab--teal-core']
      : styles['circle-fab--spectral-edge'];

  return (
    <button
      type="button"
      className={`${styles['circle-fab']} ${modeCls} ${className}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className={styles['circle-fab-icon']}>{icon}</span>
    </button>
  );
};
