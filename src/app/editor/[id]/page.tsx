import Editor, { useEditorStore } from '@/components/Editor';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Page({ params }: { params: { id: string }}) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/')
  }

  // fetch note
  const { data: note, error: notesError, } = await supabase.from("notes").select().eq("id", params.id).maybeSingle();

  return (
    <section className="pl-4">
      <Editor note={note}/>
    </section>
  );
}
