import { FunctionComponent } from "react";
import Blocks from "./Blocks";
import { create } from "zustand";
import { BlockType } from "./Block";
import { GeistMono } from "geist/font/mono";

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

interface EditorProps {
  // TODO: define props
}

const Editor: FunctionComponent<EditorProps> = () => {
  return (
    <div className={GeistMono.className}>
      <Blocks />
    </div>
  );
};

export default Editor;
