# TeiqR - Quick Setup Guide

Follow these steps to get TeiqR running locally.

## Prerequisites

- **Node.js 18+**: [Download here](https://nodejs.org/)
- **pnpm**: Install with `npm install -g pnpm`
- **Supabase Account**: [Sign up here](https://supabase.com)
- **OpenRouter Account**: [Sign up here](https://openrouter.ai)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd TeiqR
pnpm install
```

### 2. Set Up Supabase Database

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name, database password, and region
   - Wait for the project to be created

2. **Run the database schema**
   - In your Supabase dashboard, go to the **SQL Editor**
   - Click "New Query"
   - Copy the entire contents of `supabase/schema.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

3. **Get your Supabase credentials**
   - Go to **Project Settings** > **API**
   - Copy the **Project URL**
   - Copy the **anon/public** key
   - (Optional) Copy the **service_role** key for server-side operations

### 3. Set Up OpenRouter

1. **Create an account** at [openrouter.ai](https://openrouter.ai)
2. **Add credits** to your account (required for API usage)
3. **Generate an API key**:
   - Go to your account settings
   - Click "API Keys"
   - Create a new key
   - Copy the key (you won't be able to see it again)

### 4. Configure Environment Variables

1. **Copy the example file**:
```bash
cp .env.example .env.local
```

2. **Edit `.env.local`** and fill in your values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Only needed for server-side admin operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Start the Development Server

```bash
pnpm dev
```

The app will be available at **http://localhost:3000**

### 6. Create Your First Account

1. Open http://localhost:3000
2. Click "Sign up"
3. Enter your email, password, and optional username
4. You'll be automatically logged in and redirected to the chat interface

## Verification Checklist

- [ ] Dependencies installed successfully
- [ ] Supabase project created
- [ ] Database schema executed in Supabase SQL Editor
- [ ] All environment variables set in `.env.local`
- [ ] Development server running without errors
- [ ] Can access the landing page at http://localhost:3000
- [ ] Can sign up and log in
- [ ] Can send a message and receive a response

## Common Issues

### "Cannot find module" errors
**Solution**: Run `pnpm install` again

### Supabase connection errors
**Solution**: 
- Double-check your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Ensure the schema was executed successfully
- Check that your Supabase project is active

### OpenRouter API errors
**Solution**:
- Verify your `OPENROUTER_API_KEY` is correct
- Ensure you have credits in your OpenRouter account
- Check the OpenRouter status page for any outages

### "Failed to send message" errors
**Solution**:
- Check browser console for detailed error messages
- Verify OpenRouter API key is valid
- Ensure you're logged in
- Check that the conversation was created successfully

### Build errors
**Solution**:
```bash
rm -rf .next
rm -rf node_modules
pnpm install
pnpm dev
```

## Next Steps

Once everything is working:

1. **Customize the UI**: Edit components in the `components/` folder
2. **Adjust AI behavior**: Modify the system prompt in `app/api/chat/route.ts`
3. **Add more models**: Update `components/ModelSelector.tsx`
4. **Deploy**: Follow the deployment guide in README.md

## Getting Help

- Check the main [README.md](./README.md) for detailed documentation
- Review the [Supabase documentation](https://supabase.com/docs)
- Check [OpenRouter documentation](https://openrouter.ai/docs)
- Look at the browser console for error messages

## Production Deployment

When ready to deploy:

1. Set up environment variables in your hosting platform
2. Update `NEXT_PUBLIC_APP_URL` to your production URL
3. Run `pnpm build` to verify the build works
4. Deploy to Vercel, Netlify, or your preferred platform

For detailed deployment instructions, see the README.md file.
