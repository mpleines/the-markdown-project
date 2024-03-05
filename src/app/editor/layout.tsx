import { Metadata } from 'next'
import Header from '@/components/Header'
 
export const metadata: Metadata = {
  title: 'Getting Started',
  description: 'Get started using The Markdown Project',
}

export default function EditorLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>
        <Header/>
        <aside>
          {/* TODO: add sidebar */}
        </aside>
        {children}
      </section>
    )
  }