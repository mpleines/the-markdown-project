import { Note } from '@/components/Editor';
import { createClient } from '@/utils/supabase/client';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface NotesState {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  updateNoteTitle: (noteId: number, title: string) => void;
  addBlankNote: () => Promise<string>;
  deleteNote: (id: number) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  fetchNotes: async () => {
    const supabase = createClient();
    const { data } = await supabase.from('notes').select();
    if (data != null) {
      set({ notes: data });
    }
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
          content: '# ',
        },
      ],
    };

    const { data, error } = await supabase.from('notes').insert(newNote).select();
    const id = data?.[0].id;

    return id;
  },
  deleteNote: async (noteId: number) => {
    const supabase = createClient();
    await supabase.from('notes').delete().eq('id', noteId);
  },
}));
