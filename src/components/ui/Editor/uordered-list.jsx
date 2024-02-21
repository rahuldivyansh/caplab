import React from 'react'
import Button from '../Button';
import { ListIcon } from 'lucide-react';
import { ICON_DIMENSIONS } from './constants';
import ControllerButton from './controller-button';

const EditorUnorderedListController = ({ editor }) => {
    return (
        <ControllerButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
        >
            <ListIcon width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </ControllerButton>
    )
}

export default EditorUnorderedListController;