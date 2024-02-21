import React from 'react'
import ControllerButton from './controller-button'
import { Text } from 'lucide-react'
import { ICON_DIMENSIONS } from './constants'

const EditorParagraphController = ({ editor }) => {
    return (
        <ControllerButton
            editor={editor}
            onClick={() => editor.chain().focus().setParagraph().run()}
            activeTarget="paragraph"
        >
            <Text width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </ControllerButton>
    )
}

export default EditorParagraphController