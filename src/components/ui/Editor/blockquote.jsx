import React from 'react'
import Button from '../Button'
import ControllerButton from './controller-button'
import { QuoteIcon } from 'lucide-react'
import { ICON_DIMENSIONS } from './constants'

const EditorBlockquoteController = ({ editor }) => {
    return (
        <ControllerButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
        >
            <QuoteIcon width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </ControllerButton>
    )
}

export default EditorBlockquoteController