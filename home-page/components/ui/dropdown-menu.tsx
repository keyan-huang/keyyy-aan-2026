'use client';

import { Menu } from '@base-ui/react/menu';
import type { ComponentProps } from 'react';

export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;
export const DropdownMenuItem = Menu.Item;

type DropdownMenuContentProps = ComponentProps<typeof Menu.Popup> &
  Pick<ComponentProps<typeof Menu.Positioner>, 'align' | 'sideOffset'>;

export function DropdownMenuContent({
  align = 'start',
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        align={align}
        sideOffset={sideOffset}
        style={{ zIndex: 50 }}
      >
        <Menu.Popup {...props} />
      </Menu.Positioner>
    </Menu.Portal>
  );
}
