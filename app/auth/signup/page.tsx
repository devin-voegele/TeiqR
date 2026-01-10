import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/app');
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-accent">
            TeiqR
          </Link>
          <h1 className="text-2xl font-semibold mt-6 mb-2">Create an account</h1>
          <p className="text-foreground/70">Start asking smarter questions</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <AuthForm mode="signup" />

          <div className="mt-6 text-center text-sm text-foreground/70">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-accent hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
