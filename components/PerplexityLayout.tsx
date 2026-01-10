'use client';

import { useState, useEffect } from 'react';
import { Message, Conversation } from '@/types/chat';
import { createClient } from '@/lib/supabaseClient';
import ThreeBackground from './ThreeBackground';
import PerplexitySidebar from './PerplexitySidebar';
import PerplexitySearch from './PerplexitySearch';
import PerplexityMessages from './PerplexityMessages';
import VerticalHeader from './VerticalHeader';
import { X, Menu, PanelLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PerplexityLayoutProps {
  userId: string;
  user: any;
}

export default function PerplexityLayout({ userId, user }: PerplexityLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-sonnet-4.5');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    } else {
      setMessages([]);
    }
  }, [currentConversationId]);

  const loadConversations = async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setConversations(data);
    }
  };

  const loadMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    setSidebarOpen(false);
  };

  const handleSendMessage = async (content: string, files?: File[]) => {
    setIsLoading(true);

    try {
      // Process files if provided
      let fileContents: any[] = [];
      let fileMetadata: { name: string; type: string; size: number }[] = [];
      
      if (files && files.length > 0) {
        for (const file of files) {
          fileMetadata.push({
            name: file.name,
            type: file.type,
            size: file.size,
          });
          
          if (file.type.startsWith('image/')) {
            // Convert image to base64
            const base64 = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
            fileContents.push({
              type: 'image',
              data: base64,
              mimeType: file.type,
            });
          } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            // Read text file
            const text = await file.text();
            fileContents.push({
              type: 'text',
              data: text,
              filename: file.name,
            });
          } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
            // For PDFs, send to backend for processing
            const arrayBuffer = await file.arrayBuffer();
            const bytes = new Uint8Array(arrayBuffer);
            
            // Convert to base64 in chunks to avoid stack overflow
            let binary = '';
            const chunkSize = 8192;
            for (let i = 0; i < bytes.length; i += chunkSize) {
              const chunk = bytes.subarray(i, i + chunkSize);
              binary += String.fromCharCode.apply(null, Array.from(chunk));
            }
            const base64 = btoa(binary);
            
            fileContents.push({
              type: 'pdf',
              data: base64,
              filename: file.name,
            });
          }
        }
      }

      const optimisticUserMessage: Message = {
        id: 'temp-user',
        conversation_id: currentConversationId || 'temp',
        role: 'user',
        content,
        files: fileMetadata.length > 0 ? fileMetadata : undefined,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, optimisticUserMessage]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConversationId,
          message: content,
          model: selectedModel,
          files: fileContents,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send message: ${errorText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body');

      let assistantMessage = '';
      let newConversationId = currentConversationId;
      let sources: any[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'conversationId') {
                newConversationId = data.conversationId;
                setCurrentConversationId(data.conversationId);
              } else if (data.type === 'delta') {
                assistantMessage += data.content;
                setMessages((prev) => {
                  const existingAssistant = prev.find((m) => m.id === 'temp-assistant');
                  const withoutTemp = prev.filter((m) => m.id !== 'temp-assistant');
                  
                  if (existingAssistant) {
                    // Update existing assistant message
                    return [
                      ...withoutTemp,
                      {
                        ...existingAssistant,
                        content: assistantMessage,
                      },
                    ];
                  } else {
                    // Create new assistant message
                    return [
                      ...prev,
                      {
                        id: 'temp-assistant',
                        conversation_id: newConversationId || '',
                        role: 'assistant' as const,
                        content: assistantMessage,
                        created_at: new Date().toISOString(),
                      },
                    ];
                  }
                });
              } else if (data.type === 'image') {
                // Handle image generation response
                setMessages((prev) => {
                  const filtered = prev.filter((m) => m.id !== 'temp-assistant' && m.id !== 'temp-user');
                  return [
                    ...filtered,
                    optimisticUserMessage,
                    {
                      id: 'temp-assistant',
                      conversation_id: newConversationId || '',
                      role: 'assistant' as const,
                      content: data.content || 'Generated image:',
                      image_url: data.imageUrl,
                      created_at: new Date().toISOString(),
                    },
                  ];
                });
              } else if (data.type === 'done') {
                sources = data.sources || [];
              }
            } catch (e) {
              console.error('Error parsing stream data:', e);
            }
          }
        }
      }

      await loadConversations();
      if (newConversationId) {
        await loadMessages(newConversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to send message'}`);
      setMessages(prev => prev.filter(m => m.id !== 'temp-user'));
    } finally {
      setIsLoading(false);
    }
  };

  const showMessages = messages.length > 0 || currentConversationId;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0A0A0A] relative">
      <ThreeBackground />
      
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:bg-[#252525] transition-colors shadow-lg"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop sidebar toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="hidden lg:block fixed top-4 left-4 z-50 p-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg hover:bg-[#252525] transition-colors shadow-lg"
      >
        <PanelLeft className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <PerplexitySidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            user={user}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Vertical Header */}
      <VerticalHeader user={user} sidebarOpen={sidebarOpen} />

      {/* Main content */}
      <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${sidebarOpen ? 'lg:ml-80' : 'lg:ml-0'}`}>
        {showMessages ? (
          <PerplexityMessages
            messages={messages}
            isLoading={isLoading}
            onSend={handleSendMessage}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        ) : (
          <PerplexitySearch
            onSend={handleSendMessage}
            isLoading={isLoading}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        )}
      </div>
    </div>
  );
}
