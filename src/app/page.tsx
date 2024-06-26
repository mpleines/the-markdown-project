import { Button } from '@/components/ui/button';
import { File, Mail } from '@geist-ui/icons';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (data?.user) {
    redirect('/editor');
  }

  return (
    <section className="h-screen flex pt-32 items-center flex-col ">
      <div className="flex">
        <File size={64} />
        <h1 className="text-7xl font-extrabold">The Markdown Project</h1>
      </div>
      <p className="mt-4 text-neutral-500 text-xl font-medium">
        Streamline your note-taking with The Markdown Project - where simplicity meets creativity.
      </p>
      <Button asChild type="submit" className="mt-8">
        <Link href="/login">
          <Mail />
          <span className="ml-2">Login with Email</span>
        </Link>
      </Button>
    </section>
  );
}
