import Editor from '@/components/Editor';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { logout } from '../login/actions';

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

  return (
    <div>
      <Button onClick={logout}>Logout</Button>
      <Editor />
    </div>
  );
}
