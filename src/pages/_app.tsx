import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { trpc } from "../utils/trpc";
import { GeistMono } from "geist/font/mono";

function App({ Component, pageProps }: AppProps) {
  return <main className={GeistMono.className}><Component {...pageProps} /></main>;
}

export default trpc.withTRPC(App);
