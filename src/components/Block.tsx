import { marked } from 'marked';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { useEditorStore } from './Editor';
import { createClient } from '@/utils/supabase/client';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import { useNotesStore } from '@/stores/notesStore';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';

const markdownCharMap = {
  h1: '# ',
  h2: '## ',
  h3: '### ',
  h4: '#### ',
  h5: '##### ',
  h6: '###### ',
};

type TagName = keyof typeof markdownCharMap;

const FORMATTING_OPTIONS = [
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Heading 4', value: 'h4' },
  { label: 'Heading 5', value: 'h5' },
  { label: 'Heading 6', value: 'h6' },
];

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
  const [showBlockControls, setShowBlockControls] = useState(false);
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
    return str.replace(/&nbsp;(?=\S)/g, ' ');
  };

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

  const handleMenuItemClick = (newTagName: TagName) => {
    let newText = plainText.current.replace('/', markdownCharMap[newTagName] + ' ');
    if (!newText.startsWith(markdownCharMap[newTagName] + ' ')) {
      newText = newText.replace(markdownCharMap[newTagName], markdownCharMap[newTagName] + ' ');
    }

    setTagName(newTagName);
    plainText.current = newText;

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

  return (
    <div style={{ position: 'relative' }}>
      <ContentEditable
        style={{ padding: '2px' }}
        innerRef={ref as any}
        key={`block-${tagName}-${block.id}`}
        html={plainText.current}
        tagName={tagName}
        onChange={handleInputChange}
        onKeyDown={(event) => handleKeyDown(event as any)}
      />

      {showBlockControls && (
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger />
          <DropdownMenuContent side="bottom" alignOffset={-10}>
            <DropdownMenuLabel>Formatting</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {FORMATTING_OPTIONS.map(({ label, value }) => (
                <DropdownMenuItem key={value} onClick={() => handleMenuItemClick(value)}>
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default Block;
