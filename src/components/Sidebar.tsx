'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, buttonVariants } from './ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Plus, Trash, ChevronRight, File } from '@geist-ui/icons';
import { GroupedNotes, useNotesStore } from '@/stores/notesStore';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { toast } from 'sonner';
import { Note } from './Editor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { truncateString } from '@/utils/truncateString';

const Sidebar = () => {
  const router = useRouter();

  const fetchNotesGrouped = useNotesStore((state) => state.fetchNotesAndGroupByParent);
  const notesGroupedByParentId = useNotesStore((state) => state.notesGroupedByParentId);
  const addBlankNote = useNotesStore((state) => state.addBlankNote);
  const deleteNoteWithChildren = useNotesStore((state) => state.deleteNoteWithAllChildren);

  const [currentAction, setCurrentAction] = useState<{ action: 'delete'; noteId: number } | null>(
    null
  );

  useEffect(() => {
    fetchNotesGrouped();
  }, [fetchNotesGrouped]);

  const addNewNote = async () => {
    const newNoteId = await addBlankNote();
    await fetchNotesGrouped();
    router.push(`/editor/${newNoteId}`);
  };

  const handleDeleteNote = async (id: number) => {
    await deleteNoteWithChildren(id);
    await fetchNotesGrouped();
    router.push('/editor');
    toast('Note has been deleted.');
  };

  return (
    <div className="flex flex-col gap-2 p-2">
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

      {notesGroupedByParentId != null &&
        Object.entries(notesGroupedByParentId).map(([parentId, currentNote]) => (
          <SidebarNote key={parentId} note={currentNote} setCurrentAction={setCurrentAction} />
        ))}
    </div>
  );
};

const SidebarNote = ({
  note,
  setCurrentAction,
}: {
  note: { note: Note; children: GroupedNotes | null };
  setCurrentAction: Dispatch<
    SetStateAction<{
      action: 'delete';
      noteId: number;
    } | null>
  >;
}) => {
  const params = useParams();
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div>
      <Link
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        href={`/editor/${note.note.id}`}
        className={cn(
          'rounded-md px-2 py-1 block hover:bg-accent transition-colors duration-200 ease-in-out',
          note.note.id === Number(params.id) ? 'bg-accent' : ''
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center flex-1">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-8 w-8 mr-2"
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              {hovered ? (
                <ChevronRight
                  className={`h-4 w-4 transition-transform duration-200 ${
                    expanded ? 'transform rotate-90' : ''
                  }`}
                />
              ) : (
                <File />
              )}
            </Button>
            <span>{truncateString(note.note.title!) || 'Untitled'}</span>
          </div>
          <DropdownMenu className="mr-2">
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
                onClick={() => setCurrentAction({ action: 'delete', noteId: note.note.id })}
                className="flex gap-1"
              >
                <Trash size={16} />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>
      {note.children != null &&
        expanded === true &&
        Object.entries(note.children).map(([noteId, currentNote]) => (
          <div className="ml-2">
            <SidebarNote key={noteId} note={currentNote} setCurrentAction={setCurrentAction} />
          </div>
        ))}
    </div>
  );
};

export default Sidebar;
