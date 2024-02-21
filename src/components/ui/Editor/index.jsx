import React from 'react'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Layout from '../Layout'
import EditorBoldController from './bold'
import EditorItalicController from './italic'
import EditorCodeController from './code'
import EditorParagraphController from './paragraph'
import EditorHeadingController from './heading'
import EditorUnorderedListController from './uordered-list'
import EditorOrderedListController from './ordered-list'
import EditorBlockquoteController from './blockquote'
import EditorDividerController from './divider'
import EditorUndoController from './undo'
import EditorRedoController from './redo'
import EditorStrikeThroughController from './strikethrough'

const MenuBar = () => {
    const { editor } = useCurrentEditor()

    if (!editor) {
        return null
    }
    return (
        <Layout.Card className="w-full">
            <Layout.Row className="flex-wrap gap-2 items-center justify-start">
                <EditorBoldController editor={editor} />
                <EditorItalicController editor={editor} />
                <EditorStrikeThroughController editor={editor} />
                <EditorCodeController editor={editor} />
                <EditorParagraphController editor={editor} />
                {Array.from({ length: 6 }, (_, i) => (
                    <EditorHeadingController key={i} editor={editor} level={i + 1} />
                ))}
                <EditorUnorderedListController editor={editor} />
                <EditorOrderedListController editor={editor} />
                <EditorBlockquoteController editor={editor} />
                <EditorDividerController editor={editor} />
                <EditorUndoController editor={editor} />
                <EditorRedoController editor={editor} />
            </Layout.Row>
        </Layout.Card>
    )
}

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
    }),
]



const CustomEditor = ({ disabled, content, onChange }) => {
    const handleChange = (state) => {
        onChange(state.editor?.getHTML())
    }
    return (
        <Layout.Col className="flex-grow bg-white w-full">
            <EditorProvider
                autofocus={true}
                editorProps={{
                    attributes: {
                        class: "w-full bg-white p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none"
                    }

                }} onUpdate={handleChange} slotBefore={!disabled ? <MenuBar /> : null} extensions={extensions} content={content} />
        </Layout.Col>
    )
}

CustomEditor.defaultProps = {
    disabled: false,
    content: "Editor"
}

export default CustomEditor;