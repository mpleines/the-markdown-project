import { marked } from "marked";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

export type BlockType = {
  id: string;
  html: string;
  tag: string;
};

interface BlockProps {
  block: BlockType;
  addBlock: (ref: HTMLElement) => void;
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

const Block: React.FunctionComponent<BlockProps> = ({
  block,
  addBlock,
  removeBlock,
}) => {
  const text = useRef("");
  const [tagName, setTagName] = useState("");
  const ref = useRef<HTMLElement>();

  const getTagName = (text: string) => {
    const html = marked(text);
    const div = document.createElement("div");
    div.innerHTML = html;
    const tag = div.firstElementChild?.tagName.toLowerCase();

    return tag;
  };

  const replaceSpecialChars = (str: string) => {
    return str.replace(/&nbsp;/g, ' ');
  }

  const handleInputChange = (event: ContentEditableEvent) => {
    const targetValue = event.target.value;
    const trimmedString = replaceSpecialChars(targetValue)
      .trim();
    const tag = getTagName(trimmedString);
    setTagName(tag ?? "p");
    text.current = targetValue;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (ref.current == null) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      addBlock(ref.current);
    }

    if (event.key === "Backspace" && !text.current) {
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
      key={tagName}
      html={text.current}
      tagName={tagName}
      onChange={handleInputChange}
      onKeyDown={(event) => handleKeyDown(event as any)}
    />
  );
};

export default Block;
