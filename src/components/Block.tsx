import { marked } from 'marked';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { useEditorStore } from './Editor';
import { createClient } from '@/utils/supabase/client';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { useNotesStore } from '@/stores/notesStore';

export type BlockType = {
  id: string;
  content: string;
  tag: string;
};

interface BlockProps {
  block: BlockType;
  addBlock: (ref: HTMLElement, currentBlockId: string) => void;
  removeBlock: (ref: HTMLElement, blockId: string) => void;
}

export const setCaretToEnd = (element: HTMLElement) => {
  const range = document.createRange();
  const selection = window.getSelection();
  if (selection == null) {
    return;
  }

  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  element.focus();
};

const Block: React.FunctionComponent<BlockProps> = ({ block, addBlock, removeBlock }) => {
  const supabase = createClient();
  const [tagName, setTagName] = useState(block.tag ?? '');
  const ref = useRef<HTMLElement>();
  const plainText = useRef<string>(block.content ?? '');
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const getBlocks = useEditorStore((state) => state.getBlocks);
  const noteId = useEditorStore((state) => state.noteId);
  const updateNoteTitle = useNotesStore((state) => state.updateNoteTitle);

  const getTagName = (text: string) => {
    const html = marked(text);
    const div = document.createElement('div');
    div.innerHTML = html;
    const tag = div.firstElementChild?.tagName.toLowerCase();

    return tag;
  };

  const replaceSpecialChars = (str: string) => {
    return str.replace(/&nbsp;/g, ' ');
  };

  const saveToDatabaseDebounced = useDebouncedCallback(async () => {
    const rows = getBlocks();
    const title = rows[0].content;

    await supabase.from('notes').update({ title, rows }).eq('id', noteId);
  }, 1000);

  const handleInputChange = (event: ContentEditableEvent) => {
    const targetValue = event.target.value;
    plainText.current = targetValue;

    const trimmedString = replaceSpecialChars(targetValue).trim();
    const tag = getTagName(trimmedString);
    setTagName(tag ?? 'p');

    if (noteId != null && getBlocks()[0].id === block.id) {
      updateNoteTitle(noteId, targetValue);
    }

    updateBlock(block.id, { content: targetValue, tag: tagName });
    saveToDatabaseDebounced();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (ref.current == null) {
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      addBlock(ref.current, block.id);
    }

    if (event.key === 'Backspace' && !plainText.current) {
      event.preventDefault();
      removeBlock(ref.current, block.id);
    }
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
      setCaretToEnd(ref.current);
    }
  }, [tagName]);

  return (
    <ContentEditable
      style={{ padding: '2px' }}
      innerRef={ref as any}
      key={`block-${tagName}-${block.id}`}
      html={plainText.current}
      tagName={tagName}
      onChange={handleInputChange}
      onKeyDown={(event) => handleKeyDown(event as any)}
    />
  );
};

export default Block;
