import { createClient } from '@/utils/supabase/server';
import { useNotesStore } from '@/stores/notesStore';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/');
  }

  return (
    <section className="pl-4 grid place-items-center ">
      <div className="text-neutral-500 flex items-center gap-2 mt-4 mb-2">
        No note selected, start by adding a new note or select a note in the sidebar.
      </div>
    </section>
  );
}
