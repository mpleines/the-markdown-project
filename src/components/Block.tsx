import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { useEditorStore } from './Editor';
import { createClient } from '@/utils/supabase/client';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { useNotesStore } from '@/stores/notesStore';
import FormattingMenu, { FORMATTING_OPTIONS, TagName } from './FormattingMenu';

export type BlockType = {
  id: string;
  content: string;
  tag: string;
};

interface BlockProps {
  block: BlockType;
  addBlock: (ref: HTMLElement, currentBlockId: string) => void;
  removeBlock: (wrapperRef: HTMLDivElement, blockId: string) => void;
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
  const [showBlockControls, setShowBlockControls] = useState(false);
  const ref = useRef<HTMLElement>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const plainText = useRef<string>(block.content ?? '');
  const updateBlock = useEditorStore((state) => state.updateBlock);
  const getBlocks = useEditorStore((state) => state.getBlocks);
  const noteId = useEditorStore((state) => state.noteId);
  const updateNoteTitle = useNotesStore((state) => state.updateNoteTitle);
  const isFirstBlock = useEditorStore((state) => state.isFirstBlock);

  const saveToDatabaseDebounced = useDebouncedCallback(async () => {
    const rows = getBlocks();
    const title = rows[0].content;

    await supabase.from('notes').update({ title, rows }).eq('id', noteId);
  }, 1000);

  const handleInputChange = (event: ContentEditableEvent) => {
    const targetValue = event.target.value;
    plainText.current = targetValue;

    const lastChar = targetValue[targetValue.length - 1];
    if (lastChar === '/') {
      setShowBlockControls(true);
    } else {
      setShowBlockControls(false);
    }

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
      removeBlock(wrapperRef.current!, block.id);
    }
  };

  const handleMenuItemClick = (newTagName: TagName) => {
    plainText.current = plainText.current.replace('/', '');
    setTagName(newTagName);
    setShowBlockControls(false);
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
      setCaretToEnd(ref.current);
    }
  }, [tagName]);

  useEffect(() => {
    if (showBlockControls && ref.current) {
      ref.current.focus();
    }
  }, [showBlockControls]);

  const placeholder = isFirstBlock(block.id)
    ? 'Unnamed'
    : tagName !== 'p'
      ? FORMATTING_OPTIONS.find((option) => option.value === tagName)?.label
      : "type '/' for formatting options";

  return (
    <div style={{ position: 'relative' }} ref={wrapperRef}>
      <ContentEditable
        style={{ padding: '2px' }}
        innerRef={ref as any}
        key={`block-${tagName}-${block.id}`}
        html={plainText.current}
        tagName={tagName}
        onChange={handleInputChange}
        onKeyDown={(event) => handleKeyDown(event as any)}
        placeholder={placeholder}
      />

      {showBlockControls && <FormattingMenu handleMenuItemClick={handleMenuItemClick} />}
    </div>
  );
};

export default Block;
