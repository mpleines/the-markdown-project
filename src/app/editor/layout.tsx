import { Metadata } from 'next';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Getting Started',
  description: 'Get started using The Markdown Project',
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className="sticky top-0 border-b bg-white">
        <Header />
      </div>
      <div className="grid grid-cols-6 pt-2 ">
        <div className="border-r col-span-1 hidden lg:block sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] overflow-y-auto">
          <div className="">
            <Sidebar />
          </div>
        </div>
        <div className="col-span-4 top-[var(--header-height)]">{children}</div>
      </div>
    </section>
  );
}
