import { requireAuth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PerplexityLayout from '@/components/PerplexityLayout';

export default async function AppPage() {
  const user = await requireAuth();

  if (!user) {
    redirect('/auth/login');
  }

  return <PerplexityLayout userId={user.id} user={user} />;
}
