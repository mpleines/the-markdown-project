import Head from "next/head";
import { Inter as FontSans } from "next/font/google"
import { Button } from "@/components/ui/button";
import { File, Mail } from '@geist-ui/icons'
import Link from "next/link";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function Home() {
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
          <div className="flex">
            <File size={64}/>
            <h1 className="text-7xl font-extrabold">The Markdown Project</h1>
          </div>
          <p className="mt-4 text-neutral-500 text-xl font-medium">Streamline your note-taking with The Markdown Project - where simplicity meets creativity.</p>
          <Button asChild type="submit" className="mt-8">
            <Link href="/login">
              <Mail/>
              <span className="ml-2">Login with Email</span>
            </Link>
          </Button>
    </>
  );
}
