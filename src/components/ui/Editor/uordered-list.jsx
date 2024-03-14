import React from 'react'
import Button from '../Button';
import { ListIcon } from 'lucide-react';
import { ICON_COLOR, ICON_DIMENSIONS } from './constants';
import ControllerButton from './controller-button';

const EditorUnorderedListController = ({ editor }) => {
    const active = editor.isActive('bulletList');
    const color = active ? ICON_COLOR.ACTIVE : ICON_COLOR.INACTIVE;
    return (
        <ControllerButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={active}
        >
            <ListIcon width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </ControllerButton>
    )
}

export default EditorUnorderedListController;