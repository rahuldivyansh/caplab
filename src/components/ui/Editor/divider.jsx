import React from 'react'
import Button from '../Button'
import { Slash } from 'lucide-react'
import { ICON_DIMENSIONS } from './constants'

const EditorDividerController = ({ editor }) => {
    return (
        <Button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="border btn-icon dark:border-white/10">
            <Slash width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />
        </Button>
    )
}

export default EditorDividerController