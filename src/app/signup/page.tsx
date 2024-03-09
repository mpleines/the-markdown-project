import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Metadata } from 'next';
import { signup } from '../login/actions';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign up to The Markdown Project',
};

export default function SignUp() {
  return (
    <section className="h-screen flex justify-center items-center flex-col ">
      <h1 className="text-4xl font-extrabold">Sign up</h1>
      <h2 className="text-xl text-neutral-500 font-medium">
        Sign up to the Markdown Project
      </h2>
      <form className="flex flex-col gap-2 mt-6 w-1/3 min-w-72">
        <Input autoFocus placeholder="Email" name="email"/>
        <Input type="password" placeholder="Password" name="password"/>
        <Button formAction={signup}>Sign up</Button>
      </form>
    </section>
  );
}
