'use client';

import { useState, useEffect, useCallback } from 'react';
import { Message, Conversation } from '@/types/chat';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ModelSelector from './ModelSelector';
import { createClient } from '@/lib/supabaseClient';

export default function ChatLayout({ userId }: { userId: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet');
  const supabase = createClient();

  const loadConversations = useCallback(async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setConversations(data);
    }
  }, [supabase, userId]);

  const loadMessages = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  }, [supabase]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
    } else {
      setMessages([]);
    }
  }, [currentConversationId, loadMessages]);

  const handleNewChat = () => {
    setCurrentConversationId(undefined);
    setMessages([]);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConversationId,
          message: content,
          model: selectedModel,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

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
                  const filtered = prev.filter((m) => m.id !== 'temp-assistant');
                  return [
                    ...filtered,
                    {
                      id: 'temp-assistant',
                      conversation_id: newConversationId || '',
                      role: 'assistant' as const,
                      content: assistantMessage,
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />

      <div className="flex-1 flex flex-col">
        <div className="border-b border-border bg-primary p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-foreground">TeiqR</h1>
          <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
        </div>

        <MessageList messages={messages} isLoading={isLoading} />

        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
