import React from 'react'
import ControllerButton from './controller-button'
import { Text } from 'lucide-react'
import { ICON_COLOR, ICON_DIMENSIONS } from './constants'

const EditorParagraphController = ({ editor }) => {
    const active = editor.isActive('paragraph')
    const color = active ? ICON_COLOR.ACTIVE : ICON_COLOR.INACTIVE
    return (
        <ControllerButton
            editor={editor}
            onClick={() => editor.chain().focus().setParagraph().run()}
            active={active}
        >
            <Text width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </ControllerButton>
    )
}

export default EditorParagraphController