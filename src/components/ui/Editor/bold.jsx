import React from 'react'
import Button from '../Button'

const EditorBoldController = ({ editor }) => {
    return (
        <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
                !editor.can()
                    .chain()
                    .focus()
                    .toggleBold()
                    .run()
            }
            className={`font-extrabold btn-icon border  flex-1 ${editor.isActive('bold') ? 'is-active' : ''}`}
        >
            B
        </Button>
    )
}

export default EditorBoldController