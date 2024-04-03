'use client';

import { useEffect, useState } from 'react';
import { Button, buttonVariants } from './ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Plus, Trash } from '@geist-ui/icons';
import { truncateString } from '@/utils/truncateString';
import { useNotesStore } from '@/stores/notesStore';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
} from './ui/alert-dialog';
import { toast } from 'sonner';

interface SidebarProps {}

const Sidebar = () => {
  const params = useParams();
  const router = useRouter();

  const fetchNotes = useNotesStore((state) => state.fetchNotes);
  const notes = useNotesStore((state) => state.notes);
  const addBlankNote = useNotesStore((state) => state.addBlankNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);

  const [currentAction, setCurrentAction] = useState<{ action: 'delete'; noteId: number } | null>(
    null
  );

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNewNote = async () => {
    const newNoteId = await addBlankNote();
    await fetchNotes();
    router.push(`/editor/${newNoteId}`);
  };

  const handleDeleteNote = async (id: number) => {
    await deleteNote(id);
    await fetchNotes();
    router.push('/editor');
    toast('Note has been deleted.');
  };

  return (
    <div className="border-r flex flex-col gap-2 p-2">
      <div className="justify-end">
        <AlertDialog open={currentAction?.action === 'delete'}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Note?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCurrentAction(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (currentAction?.noteId) {
                    await handleDeleteNote(currentAction.noteId);
                  }
                  setCurrentAction(null);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Button className="w-full justify-start gap-2" variant="secondary" onClick={addNewNote}>
        <Plus size="16" />
        <span>Add new note</span>
      </Button>
      {notes?.map((note) => (
        <Link
          key={note.id}
          className={cn(
            buttonVariants({
              variant: params.id == String(note.id) ? 'default' : 'ghost',
            }),
            'flex items-center justify-between'
          )}
          href={`/editor/${note.id}`}
        >
          <div>{truncateString(note.title!)}</div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({
                    variant: params.id == String(note.id) ? 'default' : 'ghost',
                  }),
                  'p-0'
                )}
              >
                <MoreHorizontal size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setCurrentAction({ action: 'delete', noteId: note.id })}
                  className="flex gap-1"
                >
                  <Trash size={16} />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
