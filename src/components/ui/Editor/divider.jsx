import React from 'react'
import Button from '../Button'
import { Slash } from 'lucide-react'
import { ICON_DIMENSIONS } from './constants'

const EditorDividerController = ({ editor }) => {
    return (
        <Button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Slash width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </Button>
    )
}

export default EditorDividerController