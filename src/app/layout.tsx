import { cn } from '@/lib/utils'
import '../styles/globals.css'
import { Metadata } from 'next'
import { fontSans } from './page'
 
export const metadata: Metadata = {
  title: 'Getting Started',
  description: 'Get started using The Markdown Project',
}

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>
        <main className={cn(fontSans.className, "min-h-screen")}>
          {children}
        </main>
        <footer className="fixed bottom-0 p-4 flex justify-center w-screen">
          <p className="text-neutral-500 text-sm font-medium">© 2024, made by Maik Pleines</p>
        </footer>
        </body>
      </html>
    )
  }