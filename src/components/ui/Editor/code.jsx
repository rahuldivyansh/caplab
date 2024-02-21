import React from 'react'
import Button from '../Button'
import { CodeIcon } from 'lucide-react'
import ControllerButton from './controller-button'
import { ICON_DIMENSIONS } from './constants'

const EditorCodeController = ({ editor }) => {
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
            active={editor.isActive('code')}
        >
            <CodeIcon width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </ControllerButton>
    )
}

export default EditorCodeController