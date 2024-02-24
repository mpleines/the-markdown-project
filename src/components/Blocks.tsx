import { FunctionComponent } from "react";
import Block, { BlockType, setCaretToEnd } from "./Block";
import { useEditorStore } from "./Editor";

interface BlocksProps {
  // TODO: define props
}

const Blocks: FunctionComponent<BlocksProps> = () => {
  const blocks = useEditorStore((state) => state.blocks);
  const addNewBlock = useEditorStore((state) => state.addBlock);
  const remove = useEditorStore((state) => state.removeBlock);

  const addBlock = (ref: HTMLElement, currentBlockId: string) => {
    const id = new Date().toISOString(); // FIXME: generate uuid

    addNewBlock({
      id,
      html: "",
      tag: "p",
    }, currentBlockId);

    ref.focus();
    setCaretToEnd(ref);
  };

  const removeBlock = (ref: HTMLElement, blockId: string) => {
    if (blocks.length < 2) {
      return;
    }
  
    remove(blockId);
  
    const previousBlock = ref.previousElementSibling as HTMLElement;
    if (previousBlock) {
      setCaretToEnd(previousBlock);
      previousBlock.focus();
    }
  };

  return (
    <div>
      {blocks.map((block) => (
        <Block
          key={block.id}
          block={block}
          addBlock={addBlock}
          removeBlock={removeBlock}
        />
      ))}
    </div>
  );
};

export default Blocks;
