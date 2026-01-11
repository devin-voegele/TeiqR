import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sparkles, ArrowLeft, Zap } from 'lucide-react';

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/app');
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-accent/5 to-transparent animate-pulse-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(168,85,247,0.15),transparent_50%)]" />
      
      {/* Floating orbs */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}} />
      
      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-accent" />
            <span className="text-4xl font-bold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
              TeiqR
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Create an account
          </h1>
          <p className="text-gray-400">Start asking smarter questions today</p>
        </div>

        {/* Feature badges */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-xs text-accent">
            <Zap className="w-3 h-3" />
            Free to start
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-400">
            <Sparkles className="w-3 h-3" />
            AI-powered
          </div>
        </div>

        {/* Auth card with glassmorphism */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-accent rounded-2xl blur opacity-20" />
          
          <div className="relative bg-[#0F0F0F]/80 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl p-8 shadow-2xl">
            <AuthForm mode="signup" />

            <div className="mt-8 pt-6 border-t border-[#2A2A2A] text-center text-sm">
              <span className="text-gray-400">Already have an account?</span>{' '}
              <Link 
                href="/auth/login" 
                className="text-accent hover:text-accent-hover transition-colors font-medium inline-flex items-center gap-1 group"
              >
                Log in
                <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Secure
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Encrypted
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            Private
          </div>
        </div>
      </div>
    </div>
  );
}
