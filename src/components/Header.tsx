'use client';

import { FunctionComponent, useEffect, useState } from 'react';
import { File, LogOut } from '@geist-ui/icons';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from '@/app/login/actions';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

interface HeaderProps {}

const Header: FunctionComponent<HeaderProps> = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then((response) => setUser(response.data.user));
  }, []);

  return (
    <nav className="top-0 h-16 w-full flex justify-between items-center py-2 px-4">
      <div>
        <Link href="/" className="flex items-center gap-1">
          <File size={20} />
          <div className="font-extrabold">The Markdown Project</div>
        </Link>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="/avatar_placeholer.png" alt="avatar fallback" />
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{user?.email ?? 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()} className="flex gap-2 ">
              <LogOut />
              <div>Logout</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Header;
