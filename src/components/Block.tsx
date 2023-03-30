import { marked } from "marked";
import { useEffect, useRef, useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

export type BlockType = {
  html: string;
  tag: string;
};

interface BlockProps {
  block: BlockType;
}

const setCaretToEnd = (element: HTMLElement) => {
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

const Block: React.FunctionComponent<BlockProps> = ({ block }) => {
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

  const handleInputChange = (event: ContentEditableEvent) => {
    const markdown = event.target.value;
    const tag = getTagName(markdown);
    setTagName(tag ?? "p");
    text.current = event.target.value;
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
      setCaretToEnd(ref.current);
    }
  }, [tagName]);

  return (
    <div>
      <ContentEditable
        style={{ border: "1px solid" }}
        innerRef={ref as any}
        key={tagName}
        html={text.current}
        tagName={tagName}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default Block;
