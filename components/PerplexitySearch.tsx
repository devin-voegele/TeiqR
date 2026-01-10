'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, ArrowRight, Zap, TrendingUp, Brain, Code, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './FileUpload';
import CompactModelSelector from './CompactModelSelector';

interface PerplexitySearchProps {
  onSend: (message: string, files?: File[]) => void;
  isLoading: boolean;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

export default function PerplexitySearch({ onSend, isLoading, selectedModel, onModelChange }: PerplexitySearchProps) {
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [focusedSuggestion, setFocusedSuggestion] = useState<number | null>(null);
  const [typingText, setTypingText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fullText = 'Ask anything. Get intelligent answers.';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypingText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim(), selectedFiles);
      setInput('');
      setSelectedFiles([]);
    }
  };

  const examplePrompts = [
    'Explain quantum computing in simple terms',
    'Write a Python script for data analysis',
    'Best practices for React development',
    'How does machine learning work?',
    'Create a marketing strategy for a startup',
    'Debug this code and explain the issue',
  ];

  const handleExampleClick = (example: string) => {
    setInput(example);
    setShowExamples(false);
    inputRef.current?.focus();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
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

  const suggestions = [
    { text: 'Explain quantum computing', icon: Brain, color: 'from-gray-600 to-gray-500' },
    { text: 'Best practices for React', icon: Code, color: 'from-gray-600 to-gray-500' },
    { text: 'How does AI work?', icon: Sparkles, color: 'from-gray-600 to-gray-500' },
    { text: 'Latest in web development', icon: TrendingUp, color: 'from-gray-600 to-gray-500' },
  ];

  return (
    <div 
      className="h-full flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden pt-20 lg:pt-0"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-blue-500/10 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#0F0F0F]/90 border-2 border-dashed border-blue-500 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">📁</div>
            <div className="text-xl text-white font-medium">Drop files here</div>
            <div className="text-sm text-gray-400 mt-2">Images, PDFs, and text files supported</div>
          </div>
        </div>
      )}
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 150, 0],
            y: [0, -150, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 150, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"
        />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-transparent">
                TeiqR
              </span>
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center justify-center gap-2 text-gray-500 text-sm sm:text-base"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Assistant</span>
            </motion.div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-gray-400 text-lg sm:text-xl md:text-2xl font-light px-4 max-w-2xl mx-auto"
          >
            {typingText}<motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-0.5 h-6 bg-blue-500 ml-1"
            />
          </motion.p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          onSubmit={handleSubmit}
          className="relative mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1">
                <CompactModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />
                <FileUpload
                  onFilesSelected={(files) => setSelectedFiles(prev => [...prev, ...files])}
                  selectedFiles={selectedFiles}
                  onRemoveFile={(index) => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                />
              </div>
              <Search className="absolute left-24 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={handlePaste}
                onFocus={() => !input && setShowExamples(true)}
                onBlur={() => setTimeout(() => setShowExamples(false), 200)}
                placeholder="Ask me anything... (Drag & drop or paste files)"
                disabled={isLoading}
                className="w-full pl-28 sm:pl-32 pr-12 sm:pr-14 py-5 sm:py-6 md:py-7 bg-[#0F0F0F]/90 backdrop-blur-xl border border-[#1F1F1F] rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300 text-base sm:text-lg disabled:opacity-50 hover:border-[#2A2A2A] shadow-xl"
              />
              
              {/* Example prompts dropdown */}
              <AnimatePresence>
                {showExamples && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 right-0 max-w-full bg-[#0F0F0F]/95 backdrop-blur-xl border border-[#1F1F1F] rounded-xl shadow-2xl overflow-hidden max-h-[200px] overflow-y-auto z-10"
                  >
                    <div className="p-2">
                      {examplePrompts.map((example, index) => (
                        <button
                          key={index}
                          onClick={() => handleExampleClick(example)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-300 hover:bg-[#1A1A1A] rounded-lg transition-colors group"
                        >
                          <Search className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                          <span className="group-hover:text-white transition-colors">{example}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute right-5 top-1/2 -translate-y-1/2"
                >
                  <Sparkles className="w-5 h-5 text-blue-500" />
                </motion.div>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105 active:scale-95 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30"
                >
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#2A2A2A] rounded-full">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 text-blue-500" />
            </motion.div>
            <span className="text-xs text-gray-500">Powered by Claude Sonnet 4.5 via OpenRouter</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
