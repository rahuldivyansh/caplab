import React from 'react'
import Button from '../Button';
import ControllerButton from './controller-button';
import { ICON_COLOR } from './constants';

const EditorHeadingController = ({ editor, level }) => {
    const active = editor.isActive('heading', { level })
    return (
        <ControllerButton
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
            active={active}
        >
            {`H${level}`}
        </ControllerButton>)
}

export default EditorHeadingController;

EditorHeadingController.defaultProps = {
    level: 1
}