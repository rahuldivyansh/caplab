import React from 'react'
import Button from '../Button'
import ControllerButton from './controller-button'
import { Bold } from 'lucide-react'
import { ICON_COLOR, ICON_DIMENSIONS } from './constants'

const EditorBoldController = ({ editor }) => {
    const active = editor.isActive('bold')
    const color = active ? ICON_COLOR.ACTIVE : ICON_COLOR.INACTIVE
    return (
        <ControllerButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
                !editor.can()
                    .chain()
                    .focus()
                    .toggleBold()
                    .run()
            }
            active={editor.isActive('bold')}
        >
            <Bold width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} color={color} />
        </ControllerButton>
    )
}

export default EditorBoldController