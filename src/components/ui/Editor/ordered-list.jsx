import { ListOrdered } from 'lucide-react'
import React from 'react'
import { ICON_DIMENSIONS } from './constants'
import ControllerButton from './controller-button'

const EditorOrderedListController = ({ editor }) => {
    return (
        <ControllerButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
        >
            <ListOrdered width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </ControllerButton>
    )
}

export default EditorOrderedListController