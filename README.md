# TeiqR - AI Assistant

A Perplexity-style AI search and chat interface powered by Anthropic's Claude via OpenRouter.

## Features

- **Intelligent Chat Interface**: Ask questions and get comprehensive answers from Claude 3.5 Sonnet and Haiku
- **Source Citations**: Perplexity-style answer presentation with inline sources
- **Conversation History**: All chats saved securely in Supabase
- **User Authentication**: Secure email/password authentication with Supabase Auth
- **Model Selection**: Choose between different Anthropic models
- **Modern UI**: Clean, dark-themed interface built with Tailwind CSS
- **Real-time Streaming**: Responses stream in real-time for a better UX

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **AI API**: OpenRouter (Anthropic models)
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- A Supabase account and project
- An OpenRouter API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd TeiqR
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy the contents of `supabase/schema.sql` and run it in the SQL Editor
4. This will create all necessary tables, indexes, and RLS policies

### 4. Get Your API Keys

**Supabase:**
- Go to Project Settings > API
- Copy your `Project URL` and `anon/public` key

**OpenRouter:**
- Sign up at [openrouter.ai](https://openrouter.ai)
- Generate an API key from your account settings

### 5. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Fill in your environment variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
TeiqR/
├── app/                      # Next.js App Router pages
│   ├── api/
│   │   └── chat/            # Chat API endpoint with streaming
│   ├── app/                 # Main chat application
│   ├── auth/                # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── settings/            # User settings page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── AuthForm.tsx         # Login/signup form
│   ├── ChatInput.tsx        # Message input component
│   ├── ChatLayout.tsx       # Main chat layout
│   ├── LoadingDots.tsx      # Loading indicator
│   ├── MessageBubble.tsx    # Individual message display
│   ├── MessageList.tsx      # Message list container
│   ├── ModelSelector.tsx    # AI model selector
│   ├── Navbar.tsx           # Navigation bar
│   ├── Sidebar.tsx          # Conversation sidebar
│   └── SourcesBar.tsx       # Source citations display
├── lib/                     # Utility functions
│   ├── auth.ts              # Authentication helpers
│   ├── openrouter.ts        # OpenRouter API integration
│   ├── supabaseClient.ts    # Browser Supabase client
│   └── supabaseServer.ts    # Server Supabase client
├── types/                   # TypeScript type definitions
│   └── chat.ts
├── supabase/               # Supabase configuration
│   └── schema.sql          # Database schema and RLS policies
├── .env.example            # Environment variables template
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Database Schema

### Tables

**profiles**
- `id` (UUID, PK): References auth.users
- `username` (TEXT): Unique username
- `created_at`, `updated_at` (TIMESTAMPTZ)

**conversations**
- `id` (UUID, PK)
- `user_id` (UUID, FK): References auth.users
- `title` (TEXT): Conversation title
- `created_at`, `updated_at` (TIMESTAMPTZ)

**messages**
- `id` (UUID, PK)
- `conversation_id` (UUID, FK): References conversations
- `role` (TEXT): 'user' | 'assistant' | 'system'
- `content` (TEXT): Message content
- `sources` (JSONB): Array of source citations
- `model` (TEXT): AI model used
- `created_at` (TIMESTAMPTZ)

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Proper authentication is required for all operations
- Messages are accessible only through owned conversations

## Available Scripts

```bash
# Development
pnpm dev          # Start development server

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Linting
pnpm lint         # Run ESLint
```

## Features in Detail

### Authentication
- Email/password authentication via Supabase Auth
- Automatic profile creation on signup
- Protected routes with server-side auth checks
- Session management with cookies

### Chat Interface
- Real-time streaming responses from OpenRouter
- Message history persistence
- Conversation management (create, view, switch)
- Model selection (Claude 3.5 Sonnet, Claude 3.5 Haiku)
- Responsive design for mobile and desktop

### AI Integration
- OpenRouter API for accessing Anthropic models
- Streaming responses for better UX
- System prompts for consistent behavior
- Error handling and retry logic

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

Make sure to:
1. Set all environment variables
2. Use Node.js 18+
3. Run `pnpm build` before deployment

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Optional |
| `OPENROUTER_API_KEY` | OpenRouter API key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app URL (for OpenRouter headers) | Yes |

## Troubleshooting

### Dependencies not installing
```bash
# Clear pnpm cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

### Supabase connection issues
- Verify your Supabase URL and keys are correct
- Check that RLS policies are properly set up
- Ensure your Supabase project is active

### OpenRouter API errors
- Verify your API key is valid
- Check your OpenRouter account has credits
- Ensure the model name is correct

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
pnpm build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions:
- Check the [Issues](https://github.com/yourusername/teiqr/issues) page
- Review the Supabase and OpenRouter documentation
- Ensure all environment variables are correctly set

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Anthropic](https://www.anthropic.com/) via [OpenRouter](https://openrouter.ai/)
- Database and Auth by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)
