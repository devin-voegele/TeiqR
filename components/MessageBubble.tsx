'use client';

import { Message } from '@/types/chat';
import SourcesBar from './SourcesBar';
import LoadingDots from './LoadingDots';
import { User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  isLoading?: boolean;
}

export default function MessageBubble({ message, isLoading }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}
    >
      <div className={`flex gap-3 max-w-4xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-br from-accent to-accent-hover' 
            : 'bg-gradient-to-br from-purple-500 to-accent'
        } shadow-lg`}>
          {isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-white" />
          )}
        </div>

        <div className="flex-1">
          <div
            className={`rounded-2xl px-5 py-4 ${
              isUser
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'bg-card/50 text-foreground border border-border/50 backdrop-blur-sm'
            } transition-all duration-200 hover:shadow-xl ${
              isUser ? 'hover:shadow-accent/30' : 'hover:border-border'
            }`}
          >
            {isLoading ? (
              <LoadingDots />
            ) : (
              <div className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</div>
            )}
          </div>

          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-4">
              <SourcesBar sources={message.sources} />
            </div>
          )}

          <div className="flex items-center gap-2 mt-2">
            <div className="text-xs text-gray-500">
              {new Date(message.created_at).toLocaleTimeString()}
            </div>
            {!isUser && message.model && (
              <>
                <span className="text-xs text-gray-600">•</span>
                <div className="text-xs text-gray-500">
                  {message.model.split('/')[1] || message.model}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
