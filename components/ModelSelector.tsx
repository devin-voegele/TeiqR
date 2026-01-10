'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ModelSelectorProps {
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

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:bg-[#252525] transition-colors"
      >
        <div className="text-left">
          <div className="text-sm font-medium text-white">{currentModel.name}</div>
          <div className="text-xs text-gray-500">{currentModel.provider}</div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full mt-2 right-0 w-64 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-2xl z-20">
            <div className="py-1">
              {MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-[#2A2A2A] transition-colors ${
                    selectedModel === model.id ? 'bg-[#2A2A2A]' : ''
                  }`}
                >
                  <div className="text-sm font-medium text-white">{model.name}</div>
                  <div className="text-xs text-gray-500">{model.provider}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
