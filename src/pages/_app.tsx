import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { trpc } from "../utils/trpc";
import { GeistMono } from "geist/font/mono";
import { cn } from '@/lib/utils';

function App({ Component, pageProps }: AppProps) {
  return (
    <main className={cn("min-h-screen bg-background antialiased", GeistMono.className)}>
      <Component {...pageProps} />
    </main>
  );
}

export default trpc.withTRPC(App);
