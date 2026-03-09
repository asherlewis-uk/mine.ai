'use client';

import React, { useEffect, type ReactNode } from 'react';
import styles from './NavDrawer.module.css';

interface NavItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  activeId?: string;
  onSelect: (id: string) => void;
  title?: string;
  userName?: string;
  userAvatar?: string | ReactNode;
  footer?: ReactNode;
  className?: string;
}

export const NavDrawer: React.FC<NavDrawerProps> = ({
  open,
  onClose,
  items,
  activeId,
  onSelect,
  title = 'Menu',
  userName,
  userAvatar,
  footer,
  className = '',
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const renderAvatar = () => {
    if (!userAvatar) return null;
    return (
      <div className={styles['nav-drawer-profile-avatar']}>
        {typeof userAvatar === 'string' ? (
          <img src={userAvatar} alt={userName ?? 'user'} />
        ) : (
          userAvatar
        )}
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles['nav-drawer-backdrop']} ${
          open ? styles['nav-drawer-backdrop--open'] : ''
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <nav
        className={`${styles['nav-drawer']} ${
          open ? styles['nav-drawer--open'] : ''
        } ${className}`}
        aria-label="Navigation"
      >
        {/* Header */}
        <div className={styles['nav-drawer-header']}>
          <div className={styles['nav-drawer-title']}>{title}</div>
          <div className={styles['nav-drawer-divider']} />
        </div>

        {/* Profile */}
        {userName && (
          <div className={styles['nav-drawer-profile']}>
            {renderAvatar()}
            <span className={styles['nav-drawer-profile-name']}>
              {userName}
            </span>
          </div>
        )}

        {/* Items */}
        <div className={styles['nav-drawer-items']}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles['nav-drawer-item']} ${
                item.id === activeId ? styles['nav-drawer-item--active'] : ''
              }`}
              onClick={() => onSelect(item.id)}
            >
              {item.icon && (
                <span className={styles['nav-drawer-item-icon']}>
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          ))}
        </div>

        {/* Footer */}
        {footer && (
          <div className={styles['nav-drawer-footer']}>{footer}</div>
        )}
      </nav>
    </>
  );
};
