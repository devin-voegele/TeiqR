import { createServerSupabaseClient } from './supabaseServer';

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }
  
  return user;
}
