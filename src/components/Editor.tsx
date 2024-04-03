'use client';

import React, { FunctionComponent } from 'react';
import Blocks from './Blocks';
import { create } from 'zustand';
import { BlockType } from './Block';
import { GeistMono } from 'geist/font/mono';
import { v4 as uuidv4 } from 'uuid';
import { Database } from 'types/supabase';

const DEFAULT_BLOCK: BlockType = {
  id: uuidv4(),
  content: '',
  tag: 'p',
};

interface EditorState {
  noteId: number | null;
  setNoteId: (id: number) => void;
  blocks: BlockType[];
  addBlock: (block: BlockType, currentBlockId: string) => void;
  removeBlock: (blockId: string) => void;
  updateBlock: (blockId: string, updatedBlock: Partial<BlockType>) => void;
  setBlocks: (blocks: BlockType[]) => void;
  getBlocks: () => BlockType[];
  title: string | null;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  noteId: null,
  setNoteId: (id: number) => set(() => ({ noteId: id })),
  title: null,
  blocks: [DEFAULT_BLOCK],
  addBlock: (block: BlockType, currentBlockId: string) =>
    set((state) => {
      const currentBlockIndex = state.blocks.findIndex((block) => block.id === currentBlockId);
      const modified = state.blocks
        .slice(0, currentBlockIndex + 1)
        .concat(block, state.blocks.slice(currentBlockIndex + 1));

      return { blocks: modified };
    }),
  removeBlock: (blockId: string) =>
    set((state) => ({ blocks: state.blocks.filter(({ id }) => id !== blockId) })),
  updateBlock: (blockId: string, updatedBlock: Partial<BlockType>) =>
    set((state) => {
      return {
        blocks: state.blocks.map((block) =>
          block.id === blockId ? { ...block, ...updatedBlock } : block
        ),
      };
    }),
  setBlocks: (rows: BlockType[]) => {
    set((state) => ({ ...state, blocks: rows }));
  },
  getBlocks: () => get().blocks,
}));

export type Note = Database['public']['Tables']['notes']['Row'];

interface EditorProps {
  note: Note;
}

const Editor: FunctionComponent<EditorProps> = ({ note }) => {
  const setBlocks = useEditorStore((state) => state.setBlocks);
  const setNoteId = useEditorStore((state) => state.setNoteId);

  setNoteId(note.id);
  setBlocks(note.rows as BlockType[]);

  return (
    <div className={GeistMono.className}>
      <Blocks />
    </div>
  );
};

export default Editor;
