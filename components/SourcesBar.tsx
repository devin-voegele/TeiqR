'use client';

import { Source } from '@/types/chat';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SourcesBarProps {
  sources: Source[];
}

export default function SourcesBar({ sources }: SourcesBarProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="space-y-3"
    >
      <div className="flex items-center gap-2">
        <LinkIcon className="w-3.5 h-3.5 text-accent" />
        <h4 className="text-sm font-semibold text-gray-400">Sources</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => (
          <motion.a
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-3 py-2 bg-card/50 border border-border/50 rounded-xl hover:border-accent/50 hover:bg-card transition-all duration-200 text-sm backdrop-blur-sm hover:shadow-lg hover:shadow-accent/10 hover:scale-105"
            title={source.snippet}
          >
            {source.favicon_url && (
              <img
                src={source.favicon_url}
                alt=""
                className="w-4 h-4 rounded"
                onError={(e: any) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <span className="text-gray-300 group-hover:text-white transition-colors truncate max-w-[200px] font-medium">
              {source.title}
            </span>
            <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-accent transition-colors flex-shrink-0" />
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
