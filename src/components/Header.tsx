'use client';

import { FunctionComponent } from 'react';
import { Button } from './ui/button';
import { signOut } from '@/app/login/actions';
import { File } from '@geist-ui/icons';
import Link from 'next/link';

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  return (
    <nav className="top-0 h-16 w-full flex justify-between items-center py-2 px-4">
      <div>
        <Link href="/" className="flex items-center gap-1">
          <File size={20} />
          <div className="font-extrabold">The Markdown Project</div>
        </Link>
      </div>
      <div>
        <Button onClick={() => signOut()} variant="secondary">
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Header;
