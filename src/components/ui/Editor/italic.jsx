import React from 'react'
import Button from '../Button'

const EditorItalicController = ({ editor }) => {
    return (
        <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
                !editor.can()
                    .chain()
                    .focus()
                    .toggleItalic()
                    .run()
            }
            className={`btn-icon border italic flex-1 ${editor.isActive('italic') ? 'is-active' : ''}`}
        >
            I
        </Button>
    )
}

export default EditorItalicController