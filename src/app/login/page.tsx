'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Metadata } from 'next';
import { login } from './actions';
import Link from 'next/link';
import { useState } from 'react';

export default function Login() {
  const [errorCode, setErrorCode] = useState<number | null>(null);

  const handleLogin = async (formData: FormData) => {
    const error = await login(formData);
    if (error?.status) {
      setErrorCode(error.status);
    }
  };

  return (
    <section className="h-screen flex justify-center items-center flex-col ">
      <h1 className="text-4xl font-extrabold">Welcome Back</h1>
      <h2 className="text-xl text-neutral-500 font-medium">Sign in to your account</h2>
      <form className="flex flex-col gap-2 mt-6 w-1/3 lg:w-1/6 min-w-72" action={handleLogin}>
        <Input autoFocus placeholder="Email" name="email" />
        <Input type="password" placeholder="Password" name="password" />
        <Button type="submit">Sign In</Button>
        <Button asChild variant="ghost">
          <Link href="/signup">Sign Up</Link>
        </Button>
      </form>
      {errorCode === 400 && <span style={{ color: 'red' }}>Username or Password incorrect</span>}
    </section>
  );
}
