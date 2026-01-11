import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/app');
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-purple-500/5 to-transparent animate-pulse-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      
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
            Welcome back
          </h1>
          <p className="text-gray-400">Log in to continue your journey</p>
        </div>

        {/* Auth card with glassmorphism */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-500 rounded-2xl blur opacity-20" />
          
          <div className="relative bg-[#0F0F0F]/80 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl p-8 shadow-2xl">
            <AuthForm mode="login" />

            <div className="mt-8 pt-6 border-t border-[#2A2A2A] text-center text-sm">
              <span className="text-gray-400">Don&apos;t have an account?</span>{' '}
              <Link 
                href="/auth/signup" 
                className="text-accent hover:text-accent-hover transition-colors font-medium inline-flex items-center gap-1 group"
              >
                Sign up
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
