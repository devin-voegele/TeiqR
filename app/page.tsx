import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sparkles, MessageSquare, Shield, Zap, Search, ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/app');
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 animate-pulse-slow"></div>
      
      <nav className="relative border-b border-border/50 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">TeiqR</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-gray-300 hover:text-white transition-all duration-200"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-all duration-200 font-medium shadow-lg shadow-accent/20 hover:shadow-accent/40"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 mb-8 animate-slide-down">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm text-gray-400">Powered by Claude 3.5 Sonnet</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight animate-slide-up">
            Ask deeper.
            <br />
            <span className="bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">TeiqR</span> digs through the noise.
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
            Get intelligent answers with sources and context that matter. Powered by Anthropit&apos;s Claude via OpenRouter.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Link
              href="/auth/signup"
              className="group px-8 py-4 bg-accent text-white rounded-xl hover:bg-accent-hover transition-all duration-300 font-medium text-lg shadow-2xl shadow-accent/30 hover:shadow-accent/50 hover:scale-105 flex items-center gap-2"
            >
              Start chatting
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-card/50 border border-border hover:border-gray-600 text-foreground rounded-xl hover:bg-card transition-all duration-300 font-medium text-lg backdrop-blur-sm"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="group bg-card/30 border border-border/50 rounded-2xl p-8 hover:bg-card/50 hover:border-accent/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/10 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Search className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Perplexity-style answers</h3>
            <p className="text-gray-400 leading-relaxed">
              Get comprehensive answers with inline citations and sources, just like Perplexity.
            </p>
          </div>

          <div className="group bg-card/30 border border-border/50 rounded-2xl p-8 hover:bg-card/50 hover:border-accent/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/10 animate-slide-up" style={{animationDelay: '0.4s'}}>
            <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Powered by Anthropic</h3>
            <p className="text-gray-400 leading-relaxed">
              Leverage Claude 3.5 Sonnet and Haiku via OpenRouter for intelligent responses.
            </p>
          </div>

          <div className="group bg-card/30 border border-border/50 rounded-2xl p-8 hover:bg-card/50 hover:border-accent/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/10 animate-slide-up" style={{animationDelay: '0.5s'}}>
            <div className="w-14 h-14 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Conversation history</h3>
            <p className="text-gray-400 leading-relaxed">
              All you&apos;re conversations are saved securely in Supabase for easy access anytime.
            </p>
          </div>
        </div>
      </main>

      <footer className="relative border-t border-border/50 mt-32 py-8 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p className="text-sm">&copy; 2024 TeiqR. Built with Next.js, Supabase, and OpenRouter.</p>
        </div>
      </footer>
    </div>
  );
}
