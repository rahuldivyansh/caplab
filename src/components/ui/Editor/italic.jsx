import React from 'react'
import Button from '../Button'
import { Italic } from 'lucide-react'
import ControllerButton from './controller-button'
import { ICON_COLOR, ICON_DIMENSIONS } from './constants'

const EditorItalicController = ({ editor }) => {
    const active = editor.isActive('italic')
    const color = active ? ICON_COLOR.ACTIVE : ICON_COLOR.INACTIVE
    return (
        <ControllerButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
                !editor.can()
                    .chain()
                    .focus()
                    .toggleItalic()
                    .run()
            }
            active={active}
        >
            <Italic width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT}/>
        </ControllerButton>
    )
}

export default EditorItalicController