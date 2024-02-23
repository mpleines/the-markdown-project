import Head from "next/head";
import { trpc } from "@/utils/trpc";
import Editor from "@/components/Editor";
import { GeistSans } from "geist/font/sans";

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
      <main className={GeistSans.className}>
        <Editor />
      </main>
    </>
  );
}
