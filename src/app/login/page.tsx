import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  return (
    <main className="min-h-screen flex flex-col gap-2 items-center pt-48">
      <h1 className="text-4xl font-extrabold">Welcome Back</h1>
      <h2 className="text-xl text-neutral-500 font-medium">Sign in to your account</h2>
      <form className="flex gap-2 mt-2">
        <Input placeholder="Email" name="email"/>
        <Button>Login</Button>
      </form>
      <p className="text-neutral-500 w-1/3 text-center mt-4">We are using magic links to log you into your account. You only need you email account to sign in to The Markdown Project. No other personal information needed. <span className="underline">No registration needed.</span></p>
    </main>
  );
}