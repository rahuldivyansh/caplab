import React from 'react'
import Button from '../Button'

const StrikeThroughController = ({ editor }) => {
    return (
        <Button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={
                !editor.can()
                    .chain()
                    .focus()
                    .toggleStrike()
                    .run()
            }
            className={editor.isActive('strike') ? 'is-active' : ''}
        >
            S
        </Button>
    )
}

export default StrikeThroughController