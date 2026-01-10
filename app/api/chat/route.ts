import { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { streamOpenRouterChat } from '@/lib/openrouter';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { conversationId, message, model, files } = await request.json();

    if (!message) {
      return new Response('Message is required', { status: 400 });
    }

    // Detect if this is an image generation request
    const isImageRequest = model?.includes('image') || 
      message.toLowerCase().includes('generate image') ||
      message.toLowerCase().includes('create image') ||
      message.toLowerCase().includes('draw') ||
      message.toLowerCase().includes('picture of');

    let currentConversationId = conversationId;

    if (!currentConversationId) {
      const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
      
      const { data: newConversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title,
        })
        .select()
        .single();

      if (convError) throw convError;
      currentConversationId = newConversation.id;
    }

    const { data: userMessage, error: userMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversationId,
        role: 'user',
        content: message,
      })
      .select()
      .single();

    if (userMsgError) throw userMsgError;

    const { data: previousMessages } = await supabase
      .from('messages')
      .select('role, content')
      .eq('conversation_id', currentConversationId)
      .order('created_at', { ascending: true })
      .limit(10);

    // Handle image generation separately
    if (isImageRequest && model?.includes('image')) {
      try {
        // Note: OpenRouter may not support image generation endpoint
        // Using chat completion with image generation prompt instead
        const imageResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'TeiqR',
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'system',
                content: 'You are an AI that generates images. Respond with a detailed description of the image that was requested.'
              },
              {
                role: 'user',
                content: `Generate an image: ${message}`
              }
            ],
            stream: false,
          }),
        });

        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          console.error('Image generation error:', errorText);
          throw new Error(`Image generation failed: ${imageResponse.status} ${errorText}`);
        }

        const imageData = await imageResponse.json();
        const responseText = imageData.choices?.[0]?.message?.content;

        // For now, we'll return a message explaining image generation isn't directly supported
        if (responseText) {
          await supabase.from('messages').insert({
            conversation_id: currentConversationId,
            role: 'assistant',
            content: `I understand you want to generate an image. However, direct image generation through OpenRouter is not currently available. The model responded with: ${responseText}\n\nFor actual image generation, you would need to use a dedicated image generation service like DALL-E, Midjourney, or Stable Diffusion.`,
            model: model || 'openai/gpt-5-image-mini',
          });

        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', currentConversationId);

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            if (!conversationId) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'conversationId', conversationId: currentConversationId })}\n\n`)
              );
            }
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'delta', content: `I understand you want to generate an image. However, direct image generation through OpenRouter is not currently available.\n\nFor actual image generation, you would need to use a dedicated image generation service like DALL-E, Midjourney, or Stable Diffusion.` })}\n\n`)
            );
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
            );
            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }
      } catch (imageError: any) {
        console.error('Image generation error:', imageError);
        // Fall back to regular chat if image generation fails
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            if (!conversationId) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'conversationId', conversationId: currentConversationId })}\n\n`)
              );
            }
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'delta', content: `Sorry, image generation failed: ${imageError.message}. Please try again or use a different model.` })}\n\n`)
            );
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
            );
            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }
    }

    // Build the user message with file context
    let userMessageContent: any = message;
    
    // If files are provided, format them for the AI
    if (files && files.length > 0) {
      const hasImages = files.some((f: any) => f.type === 'image');
      
      if (hasImages) {
        // For vision models, use content array format
        userMessageContent = [
          { type: 'text', text: message },
          ...files.filter((f: any) => f.type === 'image').map((f: any) => ({
            type: 'image_url',
            image_url: { url: f.data }
          }))
        ];
      } else {
        // For text and PDF files, prepend content to message
        const fileTexts = await Promise.all(
          files.map(async (f: any) => {
            if (f.type === 'pdf') {
              // For PDFs, extract text using pdf-parse
              try {
                const pdfParse = (await import('pdf-parse')).default;
                const buffer = Buffer.from(f.data, 'base64');
                const pdfData = await pdfParse(buffer);
                return `File: ${f.filename}\n\`\`\`\n${pdfData.text}\n\`\`\``;
              } catch (error) {
                console.error('PDF parsing error:', error);
                return `File: ${f.filename}\n[PDF content could not be extracted]`;
              }
            } else if (f.type === 'text') {
              return `File: ${f.filename}\n\`\`\`\n${f.data}\n\`\`\``;
            }
            return '';
          })
        );
        userMessageContent = fileTexts.filter(Boolean).join('\n\n') + '\n\n' + message;
      }
    }

    const messages = [
      {
        role: 'system' as const,
        content: 'You are TeiqR, an AI assistant that answers questions concisely and helpfully. Provide clear, accurate information. When images or files are provided, analyze them thoroughly and reference them in your response.',
      },
      ...(previousMessages || []).map((m: any) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      {
        role: 'user' as const,
        content: userMessageContent,
      },
    ];

    // Remove the last user message since we're adding it with files
    messages.pop();
    messages.push({
      role: 'user' as const,
      content: userMessageContent,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          if (!conversationId) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'conversationId', conversationId: currentConversationId })}\n\n`)
            );
          }

          let fullResponse = '';

          for await (const chunk of streamOpenRouterChat({ messages, model })) {
            if (chunk.type === 'delta' && chunk.content) {
              fullResponse += chunk.content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'delta', content: chunk.content })}\n\n`)
              );
            } else if (chunk.type === 'done') {
              await supabase.from('messages').insert({
                conversation_id: currentConversationId,
                role: 'assistant',
                content: fullResponse,
                sources: chunk.sources || [],
                model: model || 'anthropic/claude-sonnet-4.5',
              });

              await supabase
                .from('conversations')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', currentConversationId);

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'done', sources: chunk.sources || [] })}\n\n`)
              );
            }
          }

          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return new Response(error.message || 'Internal server error', { status: 500 });
  }
}
