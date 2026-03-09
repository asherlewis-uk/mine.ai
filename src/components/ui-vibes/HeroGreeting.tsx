'use client';

import React from 'react';
import styles from './HeroGreeting.module.css';

interface HeroGreetingProps {
  heading: string;
  subtitle?: string;
  className?: string;
}

export const HeroGreeting: React.FC<HeroGreetingProps> = ({
  heading,
  subtitle,
  className = '',
}) => (
  <div className={`${styles['hero-greeting']} ${className}`}>
    <h1 className={styles['hero-heading']}>{heading}</h1>
    {subtitle && <p className={styles['hero-subtitle']}>{subtitle}</p>}
  </div>
);
