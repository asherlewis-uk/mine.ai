'use client';

import React, { type ReactNode } from 'react';
import styles from './ChatBubble.module.css';

type BubbleVariant = 'incoming' | 'outgoing';

interface ChatBubbleProps {
  variant: BubbleVariant;
  children: ReactNode;
  senderName?: string;
  timestamp?: string;
  avatar?: string | ReactNode;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  variant,
  children,
  senderName,
  timestamp,
  avatar,
  className = '',
}) => {
  const variantCls =
    variant === 'outgoing'
      ? styles['chat-bubble--outgoing']
      : styles['chat-bubble--incoming'];

  const rowCls =
    variant === 'outgoing'
      ? styles['chat-bubble-row--outgoing']
      : '';

  const renderAvatar = () => {
    if (!avatar) return null;
    return (
      <div className={styles['chat-bubble-avatar']}>
        {typeof avatar === 'string' ? (
          <img src={avatar} alt={senderName ?? 'avatar'} />
        ) : (
          avatar
        )}
      </div>
    );
  };

  return (
    <div className={`${styles['chat-bubble-row']} ${rowCls} ${className}`}>
      {renderAvatar()}
      <div className={`${styles['chat-bubble']} ${variantCls}`}>
        {(senderName || timestamp) && (
          <div className={styles['chat-bubble-meta']}>
            {senderName && (
              <span className={styles['chat-bubble-sender']}>{senderName}</span>
            )}
            {timestamp && (
              <span className={styles['chat-bubble-time']}>{timestamp}</span>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
