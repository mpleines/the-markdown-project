import { FunctionComponent } from "react";
import { Button } from "./ui/button";

interface SidebarProps {
  
}
 
const Sidebar: FunctionComponent<SidebarProps> = () => {
  return (
    <div className="border-r flex flex-col gap-2 ">
      {/* TODO: replace with real entries from DB */}
      {Array.from(new Array(10)).map(item => (
        <Button key={item} variant="ghost" className="w-full justify-start">Journal Entry 22.01.24</Button>
      ))}
      
    </div>
  );
}
 
export default Sidebar;