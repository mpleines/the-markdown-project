import Head from "next/head";
import { Inter } from "@next/font/google";
import { trpc } from "@/utils/trpc";
import { marked } from "marked";
import Editor from "@/components/Editor";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const hello = trpc.hello.useQuery({ text: "pretty neat" });

  if (!hello.data) {
    return <div>Loading...</div>;
  }

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
      <main className={inter.className}>
        <Editor />
      </main>
    </>
  );
}
