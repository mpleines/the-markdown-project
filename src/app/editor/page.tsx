import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/');
  }

  return (
    <section className="pl-4">
      <span>Select a note in the sidebar</span>
    </section>
  );
}
