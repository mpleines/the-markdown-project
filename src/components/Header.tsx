"use client";

import { FunctionComponent } from "react";
import { Button } from "./ui/button";
import { signOut } from "@/app/login/actions";
import { File } from "@geist-ui/icons";

interface HeaderProps {
    
}

const Header: FunctionComponent<HeaderProps> = () => {
  return (
    <nav className="top-0 h-16 w-full flex justify-between items-center p-2">
      <div className="flex items-center gap-1">
        <File size={20}/>
        <div className="font-extrabold">The Markdown Project</div>
      </div>
      <div>
        <Button onClick={() => signOut()} variant="secondary">Logout</Button>
      </div>
    </nav>  
  );
}
 
export default Header;