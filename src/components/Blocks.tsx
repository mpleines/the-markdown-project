import { FunctionComponent, useState } from "react";
import Block, { BlockType } from "./Block";

interface BlocksProps {}

const DEFAULT_BLOCK = {
  html: "",
  tag: "p",
};

const Blocks: FunctionComponent<BlocksProps> = () => {
  const [blocks, setBlocks] = useState<BlockType[]>([DEFAULT_BLOCK]);

  return (
    <div>
      {blocks.map((block) => (
        <Block block={block} key="testtestteasdasdasdasdas" />
      ))}
    </div>
  );
};

export default Blocks;
