import React from 'react'
import Button from '../Button'
import { Strikethrough } from 'lucide-react'
import { ICON_DIMENSIONS } from './constants'
import ControllerButton from './controller-button'

const EditorStrikeThroughController = ({ editor }) => {
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
            activeTarget="strike"
        >
            <Strikethrough width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </ControllerButton>
    )
}

export default EditorStrikeThroughController