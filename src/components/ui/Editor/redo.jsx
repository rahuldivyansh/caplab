import React from 'react'
import Button from '../Button'
import { Redo } from 'lucide-react'
import { ICON_DIMENSIONS } from './constants'

const EditorRedoController = ({ editor }) => {
    const disabled = !editor.can()
        .chain()
        .focus()
        .redo()
        .run()
    return (
        <Button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className="border btn-icon"
            disabled={
                disabled
            }
        >
            <Redo color={disabled ? "grey" : "black"} width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </Button>
    )
}

export default EditorRedoController