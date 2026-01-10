import { OpenRouterMessage, OpenRouterResult, Source } from '@/types/chat';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function callOpenRouterChat(params: {
  messages: OpenRouterMessage[];
  model?: string;
  stream?: boolean;
}): Promise<OpenRouterResult | ReadableStream> {
  const { messages, model = 'anthropic/claude-sonnet-4.5', stream = false } = params;

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'TeiqR',
    },
    body: JSON.stringify({
      model,
      messages,
      stream,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  if (stream) {
    return response.body!;
  }

  const data = await response.json();
  const text = data.choices[0]?.message?.content || '';
  
  const sources: Source[] = [];

  return { text, sources };
}

export async function* streamOpenRouterChat(params: {
  messages: OpenRouterMessage[];
  model?: string;
}): AsyncGenerator<{ type: 'delta' | 'done'; content?: string; sources?: Source[] }> {
  const { messages, model = 'anthropic/claude-sonnet-4.5' } = params;

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Title': 'TeiqR',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            yield { type: 'done', sources: [] };
            return;
          }

          try {
            const parsed = JSON.parse(data);
            
            // Check if choices array exists and has content
            if (parsed.choices && parsed.choices.length > 0) {
              const content = parsed.choices[0]?.delta?.content;
              
              if (content) {
                yield { type: 'delta', content };
              }
            } else if (parsed.error) {
              console.error('OpenRouter API error:', parsed.error);
              throw new Error(parsed.error.message || 'API error');
            }
          } catch (e) {
            // Only log if it's not a JSON parse error for empty data
            if (data.trim()) {
              console.error('Error parsing SSE data:', e, 'Data:', data);
            }
          }
        }
      }
    }

    yield { type: 'done', sources: [] };
  } finally {
    reader.releaseLock();
  }
}
