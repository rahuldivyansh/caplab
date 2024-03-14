import React from 'react'
import { Strikethrough } from 'lucide-react'
import { ICON_DIMENSIONS } from './constants'
import ControllerButton from './controller-button'

const EditorStrikeThroughController = ({ editor }) => {
    const active = editor.isActive('strikeThrough')
    return (
        <ControllerButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={
                !editor.can()
                    .chain()
                    .focus()
                    .toggleStrike()
                    .run()
            }
            editor={editor}
            active={active}
        >
            <Strikethrough width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </ControllerButton>
    )
}

export default EditorStrikeThroughController