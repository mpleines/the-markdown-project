'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = createClient();

  // TODO: validate
  const email = formData.get('email') as string;

  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function logout() {
  const supabase = createClient();

  await supabase.auth.signOut();
  redirect('/');
}
