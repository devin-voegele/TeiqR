'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CompactModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const MODELS = [
  { id: 'anthropic/claude-sonnet-4.5', name: 'Claude Sonnet 4.5', provider: 'Anthropic' },
  { id: 'anthropic/claude-opus-4.1', name: 'Claude Opus 4.1', provider: 'Anthropic' },
  { id: 'perplexity/sonar', name: 'Sonar', provider: 'Perplexity' },
  { id: 'openai/gpt-5-image-mini', name: 'GPT-5 Image Mini', provider: 'OpenAI' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic' },
];

export default function CompactModelSelector({ selectedModel, onModelChange }: CompactModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors group"
        title={`Current model: ${currentModel.name}`}
      >
        <Sparkles className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2 left-0 w-72 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-2 border-b border-[#2A2A2A] bg-[#0F0F0F]">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Select Model</p>
              </div>
              <div className="max-h-80 overflow-y-auto py-1">
                {MODELS.map((model) => (
                  <motion.button
                    key={model.id}
                    whileHover={{ backgroundColor: '#2A2A2A' }}
                    onClick={() => {
                      onModelChange(model.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-3 transition-colors flex items-center gap-3 ${
                      selectedModel === model.id ? 'bg-[#2A2A2A]' : ''
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{model.name}</p>
                        {selectedModel === model.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                          />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{model.provider}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
