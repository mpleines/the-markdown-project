import { Note } from '@/components/Editor';
import { createClient } from '@/utils/supabase/client';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface NotesState {
  notes: Note[];
  notesGroupedByParentId: GroupedNotes;
  fetchNotes: () => Promise<void>;
  fetchNotesAndGroupByParent: () => Promise<void>;
  updateNoteTitle: (noteId: number, title: string) => void;
  addBlankNote: () => Promise<string>;
  deleteNote: (id: number) => Promise<void>;
  deleteNoteWithAllChildren: (id: number) => Promise<void>;
}

export type GroupedNotes = {
  [id: number]: {
    note: Note;
    children: GroupedNotes | null;
  };
};

function groupNotesByParentId(notes: Note[]) {
  const noteMap: Map<number, Note[]> = new Map();

  notes.forEach((note) => {
    const parentId = note.parent_id || 0; // Use 0 for root-level grouping
    if (!noteMap.has(parentId)) {
      noteMap.set(parentId, []);
    }
    noteMap.get(parentId)?.push(note);
  });

  function buildGroupedNotes(parentId: number) {
    if (!noteMap.get(parentId)) {
      return null;
    }

    const groupedNotes: GroupedNotes = {};

    const notesForParentId = noteMap.get(parentId);
    if (notesForParentId != null && notesForParentId?.length > 0) {
      notesForParentId.forEach((note) => {
        groupedNotes[note.id] = {
          note,
          children: buildGroupedNotes(note.id), // Recursively find children
        };
      });
    }

    return groupedNotes;
  }

  return buildGroupedNotes(0);
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  notesGroupedByParentId: {},
  fetchNotes: async () => {
    const supabase = createClient();
    const { data } = await supabase.from('notes').select();
    if (data != null) {
      set({ notes: data });
    }
  },
  async fetchNotesAndGroupByParent() {
    const supabase = createClient();
    const { data } = await supabase.from('notes').select();
    if (data == null) {
      set({ notesGroupedByParentId: {} });
      return;
    }

    const notesGroupedByParentId = groupNotesByParentId(data);
    set({ notesGroupedByParentId });
  },
  updateNoteTitle: (noteId: number, title: string) => {
    set((state) => ({
      notes: state.notes.map((note) => (note.id === noteId ? { ...note, title } : note)),
    }));
  },
  addBlankNote: async () => {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (userData.user == null) {
      // TODO: better error handling
      return;
    }

    const newNote: Partial<Note> = {
      title: '',
      user_id: userData.user.id,
      rows: [
        {
          id: uuidv4(),
          tag: 'h1',
          content: '',
        },
      ],
    };

    const { data } = await supabase.from('notes').insert(newNote).select();
    const id = data?.[0].id;

    return id;
  },
  deleteNote: async (noteId: number) => {
    const supabase = createClient();
    await supabase.from('notes').delete().eq('id', noteId);
  },
  deleteNoteWithAllChildren: async (noteId: number) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('notes')
      .delete()
      .or(`parent_id.eq.${noteId},id.eq.${noteId}`);

    if (error) {
      console.error('Error deleting notes:', error);
    } else {
      console.log('Deleted notes:', data);
    }
  },
}));
