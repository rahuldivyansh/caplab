import React from 'react'
import Button from '../Button';
import ControllerButton from './controller-button';

const EditorHeadingController = ({ editor, level }) => {
    return (
        <ControllerButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level })}
        >
            {`H${level}`}
        </ControllerButton>)
}

export default EditorHeadingController;

EditorHeadingController.defaultProps = {
    level: 1
}