import { FunctionComponent, RefObject, useState } from "react";
import { Set } from "typescript";
import Block, { BlockType, setCaretToEnd } from "./Block";

interface BlocksProps {}

const DEFAULT_BLOCK: BlockType = {
  id: new Date().toISOString(),
  html: "",
  tag: "p",
};

const Blocks: FunctionComponent<BlocksProps> = () => {
  const [blocks, setBlocks] = useState<BlockType[]>([DEFAULT_BLOCK]);

  const addBlock = (ref: HTMLElement) => {
    const id = new Date().toISOString(); // FIXME: generate uuid
    const block = {
      id,
      html: "",
      tag: "p",
    };

    setBlocks([...blocks, block]);

    ref.focus();
    setCaretToEnd(ref);
  };

  const removeBlock = (ref: HTMLElement, blockId: string) => {
    if (blocks.length < 2) {
      return;
    }

    const previousBlock = ref.previousElementSibling as HTMLElement;
    console.log("previous block: ", previousBlock);

    const blockIndex = blocks.map(({ id }) => id).indexOf(blockId);
    const modifiedBlocks = [...blocks];
    modifiedBlocks.splice(blockIndex, 1);
    setBlocks(modifiedBlocks);

    setCaretToEnd(previousBlock);
    previousBlock?.focus();
  };

  return (
    <div>
      {blocks.map((block) => (
        <Block
          block={block}
          key={block.id}
          addBlock={addBlock}
          removeBlock={removeBlock}
        />
      ))}
    </div>
  );
};

export default Blocks;
