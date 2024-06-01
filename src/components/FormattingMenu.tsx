import React from 'react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';

export const FORMATTING_OPTIONS = [
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
  { label: 'Heading 4', value: 'h4' },
  { label: 'Heading 5', value: 'h5' },
  { label: 'Heading 6', value: 'h6' },
];

type TagName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

interface FormattingMenuProps {
  handleMenuItemClick: (newTagName: TagName) => void;
}

const FormattingMenu: React.FC<FormattingMenuProps> = ({ handleMenuItemClick }) => {
  return (
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
  );
};

export default FormattingMenu;
