import React from 'react'
import Button from '../Button'
import { CodeIcon } from 'lucide-react'
import ControllerButton from './controller-button'
import { ICON_COLOR, ICON_DIMENSIONS } from './constants'

const EditorCodeController = ({ editor }) => {
    const active = editor.isActive('code')
    const color = active ? ICON_COLOR.ACTIVE : ICON_COLOR.INACTIVE
    return (
        <ControllerButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={
                !editor.can()
                    .chain()
                    .focus()
                    .toggleCode()
                    .run()
            }
            active={active}
        >
            <CodeIcon width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} color={color} />
        </ControllerButton>
    )
}

export default EditorCodeController