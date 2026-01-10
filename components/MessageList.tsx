'use client';

import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      {messages.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-foreground/40">
            <h2 className="text-2xl font-semibold mb-2">Start a conversation</h2>
            <p>Ask me anything and I'll help you find answers.</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && (
            <MessageBubble
              message={{
                id: 'loading',
                conversation_id: '',
                role: 'assistant',
                content: '',
                created_at: new Date().toISOString(),
              }}
              isLoading
            />
          )}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}
