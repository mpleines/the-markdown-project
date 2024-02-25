import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Metadata } from "next";
import { Info } from '@geist-ui/icons';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to The Markdown Project',
}

export default function Login() {
  return (
    <>
      <h1 className="text-4xl font-extrabold">Welcome Back</h1>
      <h2 className="text-xl text-neutral-500 font-medium">Sign in to your account</h2>
      <form className="flex gap-2 mt-2">
        <Input placeholder="Email" name="email"/>
        <Button>Login</Button>
      </form>
      <div className="flex gap-1 items-center mt-4">
        <Info size={12}/>
        <p className="text-neutral-500 text-xs text-center ">We are using magic links to log you into your account. No other personal information needed. <span className="underline">No registration needed.</span></p>
      </div>
    </>
  );
}