import { Metadata } from 'next'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
 
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
      <section className="h-screen">
        <Header/>
        <div className="h-full grid grid-cols-6 pt-2 border-t">
          <div className="h-full col-span-1 hidden lg:block">
            <Sidebar/>
          </div>
          <div className="col-span-4">
            {children}
          </div>
        </div>
      </section>
    )
  }