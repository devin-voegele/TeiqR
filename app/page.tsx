import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sparkles, MessageSquare, Shield, Zap, Search, ArrowRight, Brain, FileText, Globe, CheckCircle2, Star } from 'lucide-react';

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/app');
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 animate-pulse-slow"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.15),transparent_50%)]"></div>
      
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
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slide-up">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Ask deeper.
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent via-purple-500 to-pink-500 bg-clip-text text-transparent">
              TeiqR
            </span>
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {' '}digs through the noise.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
            Get intelligent answers with sources and context that matter. Powered by Anthropic&apos;s Claude via OpenRouter.
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

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 mb-20">
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
              All your conversations are saved securely in Supabase for easy access anytime.
            </p>
          </div>
        </div>

        {/* Additional features section */}
        <div className="mt-32 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Everything you need to research smarter
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to help you get better answers, faster.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card/20 border border-border/50 rounded-xl p-6 hover:bg-card/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Smart Context Understanding</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Claude understands nuance and context, giving you answers that actually make sense.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card/20 border border-border/50 rounded-xl p-6 hover:bg-card/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Document Analysis</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Upload PDFs, images, and text files to get insights from your documents.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card/20 border border-border/50 rounded-xl p-6 hover:bg-card/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Real-time Information</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Get up-to-date answers with sources you can verify and trust.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card/20 border border-border/50 rounded-xl p-6 hover:bg-card/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Natural Conversations</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Chat naturally like you would with a knowledgeable friend.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 mb-20">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-500 rounded-3xl blur opacity-20"></div>
            <div className="relative bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] border border-[#2A2A2A] rounded-3xl p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ready to start asking better questions?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are getting smarter answers with TeiqR.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/auth/signup"
                  className="group px-8 py-4 bg-gradient-to-r from-accent to-purple-500 hover:from-accent-hover hover:to-purple-600 text-white rounded-xl transition-all duration-300 font-medium text-lg shadow-2xl shadow-accent/30 hover:shadow-accent/50 hover:scale-105 flex items-center gap-2"
                >
                  Get started for free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  No credit card required
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative border-t border-border/50 py-12 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
                <span className="text-xl font-bold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">TeiqR</span>
              </div>
              <p className="text-sm text-gray-500">
                Ask deeper questions, get smarter answers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/auth/signup" className="hover:text-accent transition-colors">Sign up</Link></li>
                <li><Link href="/auth/login" className="hover:text-accent transition-colors">Log in</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Powered by</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Anthropic Claude</li>
                <li>OpenRouter</li>
                <li>Supabase</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-white">Built with</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>Next.js 15</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center">
            <p className="text-sm text-gray-500">&copy; 2024 TeiqR. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
