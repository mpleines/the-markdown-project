'use client';

import { useEffect } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Plus } from '@geist-ui/icons';
import { truncateString } from '@/utils/truncateString';
import { useNotesStore } from '@/stores/notesStore';

interface SidebarProps {}

const Sidebar = () => {
  const params = useParams();
  const router = useRouter();

  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const notes = useNotesStore((state) => state.notes);
  const addBlankNote = useNotesStore((state) => state.addBlankNote);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNewNote = async () => {
    const newNoteId = await addBlankNote();
    await fetchNotes();
    router.push(`/editor/${newNoteId}`);
  };

  return (
    <div className="border-r flex flex-col gap-2 p-2">
      <Button className="w-full justify-start gap-2" variant="secondary" onClick={addNewNote}>
        <Plus size="16" />
        <span>Add new note</span>
      </Button>
      {notes?.map((note) => (
        <Button
          asChild
          variant={params.id == String(note.id) ? 'default' : 'ghost'}
          className="w-full justify-start"
          key={note.id}
        >
          <Link href={`/editor/${note.id}`}>{truncateString(note.title)}</Link>
        </Button>
      ))}
    </div>
  );
};

export default Sidebar;
