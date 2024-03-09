import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Metadata } from 'next';
import { login, signup } from './actions';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to The Markdown Project',
};

export default function Login() {
  return (
    <section className="h-screen flex justify-center items-center flex-col ">
      <h1 className="text-4xl font-extrabold">Welcome Back</h1>
      <h2 className="text-xl text-neutral-500 font-medium">
        Sign in to your account
      </h2>
      <form className="flex flex-col gap-2 mt-6 w-1/3 lg:w-1/6 min-w-72">
        <Input autoFocus placeholder="Email" name="email"/>
        <Input type="password" placeholder="Password" name="password"/>
        <Button formAction={login}>Sign In</Button>
        <Button asChild variant="ghost">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </form>
    </section>
  );
}
