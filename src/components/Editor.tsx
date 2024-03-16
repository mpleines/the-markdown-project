'use client';

import React, { FunctionComponent, useEffect, useState } from 'react';
import Blocks from './Blocks';
import { create } from 'zustand';
import { BlockType } from './Block';
import { GeistMono } from 'geist/font/mono';
import { v4 as uuidv4 } from 'uuid';
import { Database } from 'types/supabase';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { redirect, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useNotesStore } from '@/stores/notesStore';

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
  const router = useRouter();
  const setBlocks = useEditorStore((state) => state.setBlocks);
  const setNoteId = useEditorStore((state) => state.setNoteId);
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const fetchNotes = useNotesStore((state) => state.fetchNotes);

  const handleDeleteNote = async (id: number) => {
    await deleteNote(id);
    await fetchNotes();
    router.push('/editor');
    toast('Note has been deleted.');
  };

  setNoteId(note.id);
  setBlocks(note.rows as BlockType[]);

  return (
    <div className={GeistMono.className}>
      <div className="justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Blocks />
    </div>
  );
};

export default Editor;
