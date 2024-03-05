"use client";

import { FunctionComponent } from "react";
import { Button } from "./ui/button";
import { signOut } from "@/app/login/actions";

interface HeaderProps {
    
}

const Header: FunctionComponent<HeaderProps> = () => {
  return (
    <nav className="top-0 h-16 w-full bg-black flex justify-between items-center p-2">
      <div className="text-white">The Markdown Project</div>
      <div>
        <Button onClick={() => signOut()} variant="secondary">Logout</Button>
      </div>
    </nav>  
  );
}
 
export default Header;