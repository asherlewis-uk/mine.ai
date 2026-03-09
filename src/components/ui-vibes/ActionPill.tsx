'use client';

import React, { type ReactNode } from 'react';
import styles from './ActionPill.module.css';

interface ActionPillProps {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const ActionPill: React.FC<ActionPillProps> = ({
  label,
  icon,
  onClick,
  className = '',
}) => (
  <button
    type="button"
    className={`${styles['action-pill']} ${className}`}
    onClick={onClick}
  >
    {icon && <span className={styles['action-pill-icon']}>{icon}</span>}
    {label}
  </button>
);
