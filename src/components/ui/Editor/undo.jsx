import React from 'react'
import Button from '../Button'
import { Undo } from 'lucide-react'
import { ICON_DIMENSIONS } from './constants'

const EditorUndoController = ({ editor }) => {
    return (
        <Button
            type="button"
            className="border btn-icon"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={
                !editor.can()
                    .chain()
                    .focus()
                    .undo()
                    .run()
            }
        >
            <Undo width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </Button>
    )
}

export default EditorUndoController