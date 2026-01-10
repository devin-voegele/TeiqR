'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Message } from '@/types/chat';
import { Send, Sparkles, User as UserIcon, Paperclip } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SourcesBar from './SourcesBar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import FileUpload from './FileUpload';
import CompactModelSelector from './CompactModelSelector';

interface PerplexityMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string, files?: File[]) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export default function PerplexityMessages({
  messages,
  isLoading,
  onSend,
  selectedModel,
  onModelChange,
}: PerplexityMessagesProps) {
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate stars once and memoize to prevent re-rendering
  const stars = useMemo(() => 
    [...Array(50)].map((_, i) => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
    }))
  , []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim(), selectedFiles);
      setInput('');
      setSelectedFiles([]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const files: File[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
    
    if (files.length > 0) {
      e.preventDefault();
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 pt-24 lg:pt-20 relative">
        {/* Static stars background - fixed position */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                animation: `twinkle ${star.duration}s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
          <style jsx>{`
            @keyframes twinkle {
              0%, 100% { opacity: 0.2; }
              50% { opacity: 0.6; }
            }
          `}</style>
        </div>
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10 relative z-10">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {message.role === 'user' ? (
                <div className="flex gap-3 sm:gap-4 items-start group">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/10 group-hover:ring-blue-500/30 transition-all">
                    <UserIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                  </div>
                  <div className="flex-1 space-y-3">
                    {message.files && message.files.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.files.map((file, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#2A2A2A] rounded-lg text-xs hover:border-[#3A3A3A] transition-colors"
                          >
                            <Paperclip className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-gray-300 font-medium">{file.name}</span>
                            <span className="text-gray-600">({(file.size / 1024).toFixed(1)} KB)</span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    <div className="text-white text-base sm:text-lg leading-relaxed">{message.content}</div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 sm:gap-4 items-start group">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20 ring-2 ring-purple-500/10 group-hover:ring-purple-500/30 transition-all">
                    <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                  </div>
                  <div className="flex-1 space-y-4 sm:space-y-5">
                    {message.image_url && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-2xl overflow-hidden border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors max-w-2xl shadow-2xl"
                      >
                        <img
                          src={message.image_url}
                          alt="Generated image"
                          className="w-full h-auto"
                        />
                      </motion.div>
                    )}
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          code: ({ node, inline, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline ? (
                              <div className="relative group">
                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => navigator.clipboard.writeText(String(children))}
                                    className="px-2 py-1 text-xs bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded text-gray-400 hover:text-white transition-colors"
                                  >
                                    Copy
                                  </button>
                                </div>
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              </div>
                            ) : (
                              <code className="px-1.5 py-0.5 bg-[#2A2A2A] rounded text-sm" {...props}>
                                {children}
                              </code>
                            );
                          },
                          p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-4">{children}</ol>,
                          li: ({ children }) => <li className="text-gray-300">{children}</li>,
                          h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-3 mt-5">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-bold text-white mb-2 mt-4">{children}</h3>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-4">
                              {children}
                            </blockquote>
                          ),
                          a: ({ href, children }) => (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                              {children}
                            </a>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-4">
                              <table className="min-w-full border border-[#2A2A2A] rounded-lg">{children}</table>
                            </div>
                          ),
                          th: ({ children }) => <th className="border border-[#2A2A2A] px-4 py-2 bg-[#1A1A1A] text-left text-white font-semibold">{children}</th>,
                          td: ({ children }) => <td className="border border-[#2A2A2A] px-4 py-2 text-gray-300">{children}</td>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    {message.sources && message.sources.length > 0 && (
                      <SourcesBar sources={message.sources} />
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>{new Date(message.created_at).toLocaleTimeString()}</span>
                      {message.model && (
                        <>
                          <span>•</span>
                          <span>{message.model.split('/')[1] || message.model}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 sm:gap-3"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div 
        className="border-t border-[#1A1A1A] bg-[#0A0A0A]/98 backdrop-blur-xl p-4 sm:p-5 lg:p-6 shadow-2xl"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <CompactModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />
              <FileUpload
                onFilesSelected={(files) => setSelectedFiles(prev => [...prev, ...files])}
                selectedFiles={selectedFiles}
                onRemoveFile={(index) => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
              />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPaste={handlePaste}
              placeholder="Ask a follow-up... (Drag & drop or paste files)"
              disabled={isLoading}
              className="w-full pl-20 sm:pl-24 pr-14 sm:pr-16 py-4 sm:py-5 bg-[#0F0F0F]/90 border border-[#1F1F1F] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base hover:border-[#2A2A2A] shadow-xl"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 active:scale-95"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
