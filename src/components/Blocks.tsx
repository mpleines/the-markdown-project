import { FunctionComponent } from "react";
import Block, { BlockType, setCaretToEnd } from "./Block";

import { create } from 'zustand'

interface BlocksProps {}

const DEFAULT_BLOCK: BlockType = {
  id: new Date().toISOString(),
  html: "",
  tag: "p",
};

interface EditorState {
  blocks: BlockType[];
  addBlock: (block: BlockType, currentBlockId: string) => void;
  removeBlock: (blockId: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  blocks: [DEFAULT_BLOCK],
  addBlock: (block: BlockType, currentBlockId: string) => set((state) => {
    const currentBlockIndex = state.blocks.findIndex(block => block.id === currentBlockId);
    const modified = state.blocks
      .slice(0, currentBlockIndex + 1)
      .concat(block, state.blocks.slice(currentBlockIndex + 1));

    return { blocks: modified }
  }),
  removeBlock: (blockId: string) => set((state) => ({ blocks: state.blocks.filter(({ id }) => id !== blockId)})),
}));

const Blocks: FunctionComponent<BlocksProps> = () => {
  const blocks = useEditorStore((state) => state.blocks);
  const addNewBlock = useEditorStore((state) => state.addBlock);
  const remove = useEditorStore((state) => state.removeBlock);

  const addBlock = (ref: HTMLElement, currentBlockId: string) => {
    const id = new Date().toISOString(); // FIXME: generate uuid

    addNewBlock({
      id,
      html: "",
      tag: "p",
    }, currentBlockId);

    ref.focus();
    setCaretToEnd(ref);
  };

  const removeBlock = (ref: HTMLElement, blockId: string) => {
    if (blocks.length < 2) {
      return;
    }
  
    remove(blockId);
  
    const previousBlock = ref.previousElementSibling as HTMLElement;
    if (previousBlock) {
      setCaretToEnd(previousBlock);
      previousBlock.focus();
    }
  };

  return (
    <div>
      {blocks.map((block) => (
        <Block
          key={block.id}
          block={block}
          addBlock={addBlock}
          removeBlock={removeBlock}
        />
      ))}
    </div>
  );
};

export default Blocks;
