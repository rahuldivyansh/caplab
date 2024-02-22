import { ListOrdered } from 'lucide-react'
import React from 'react'
import { ICON_COLOR, ICON_DIMENSIONS } from './constants'
import ControllerButton from './controller-button'

const EditorOrderedListController = ({ editor }) => {
    const active = editor.isActive('orderedList')
    const color = active ? ICON_COLOR.ACTIVE : ICON_COLOR.INACTIVE
    return (
        <ControllerButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={active}
        >
            <ListOrdered width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} color={color} />
        </ControllerButton>
    )
}

export default EditorOrderedListController