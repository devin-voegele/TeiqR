export interface Source {
  title: string;
  url: string;
  snippet?: string;
  favicon_url?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: Source[];
  model?: string;
  image_url?: string;
  files?: { name: string; type: string; size: number }[];
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  username?: string;
  created_at: string;
  updated_at: string;
}

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResult {
  text: string;
  sources?: Source[];
}
