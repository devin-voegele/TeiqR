'use client';

import { useState, KeyboardEvent } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border/50 bg-background/95 backdrop-blur-xl p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={disabled}
              rows={1}
              className="w-full resize-none bg-card/50 border border-border/50 rounded-2xl px-5 py-4 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
              style={{
                minHeight: '56px',
                maxHeight: '200px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 200) + 'px';
              }}
            />
            {disabled && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className="px-5 py-4 bg-accent text-white rounded-2xl hover:bg-accent-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-accent/20 hover:shadow-accent/40 disabled:shadow-none"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        <div className="mt-3 text-xs text-gray-500 text-center flex items-center justify-center gap-2">
          <kbd className="px-2 py-1 bg-card/50 border border-border/50 rounded text-xs">Enter</kbd>
          <span>to send</span>
          <span className="text-gray-600">•</span>
          <kbd className="px-2 py-1 bg-card/50 border border-border/50 rounded text-xs">Shift + Enter</kbd>
          <span>for new line</span>
        </div>
      </div>
    </div>
  );
}
