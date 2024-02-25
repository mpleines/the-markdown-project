import Head from "next/head";
import { trpc } from "@/utils/trpc";
import Editor from "@/components/Editor";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { File, Mail } from '@geist-ui/icons'

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function Home() {
  // const hello = trpc.hello.useQuery({ text: "pretty neat" });

  return (
    <>
      <Head>
        <title>The Markdown Project</title>
        <meta
          name="description"
          content="Get marked down with The Markdown Project!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen">
        <main className={cn(fontSans.className, "pt-48 flex flex-col items-center")}>
          <div className="flex">
            <File size={64}/>
            <h1 className="text-7xl font-extrabold">The Markdown Project</h1>
          </div>
          <p className="mt-4 text-neutral-500 text-xl font-medium">Streamline your note-taking with The Markdown Project - where simplicity meets creativity.</p>
          <Button type="submit" className="mt-8">
            <Mail/>
            <span className="ml-2">Login with Email</span>
          </Button>
        </main>
        <footer className="fixed bottom-0 p-4 flex justify-center w-screen">
          <p className="text-neutral-500 text-sm font-medium">© 2024, made by Maik Pleines</p>
        </footer>
      </div>
    </>
  );
}
