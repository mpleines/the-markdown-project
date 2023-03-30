import { FunctionComponent } from "react";
import Blocks from "./Blocks";

interface EditorProps {}

const Editor: FunctionComponent<EditorProps> = () => {
  return (
    <div>
      <Blocks />
    </div>
  );
};

export default Editor;
