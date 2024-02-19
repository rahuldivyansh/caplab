import { useGroup } from '@/src/providers/Group'
import React, { useState } from 'react'
import Layout from '../../ui/Layout'
import Typography from '../../ui/Typography'
import Editor from '../../ui/Editor'
import Button from '../../ui/Button'
import useFetch from '@/src/hooks/general/useFetch'
import { toast } from 'react-toastify'

const GroupDetail = ({ indentifier, value }) => {
    return (
        <Layout.Col className="justify-between sm:flex-row py-2">
            <Typography className="font-semibold capitalize">{indentifier}</Typography>
            <Typography>{value}</Typography>
        </Layout.Col>
    )
}

const GroupAboutBlock = () => {
    const group = useGroup()
    const [edit, setEdit] = useState(false)
    const [content, setContent] = useState(group.description)
    const saveDescription = useFetch({ method: "PUT", url: `/api/groups/${group.id}` })
    const onEditorUpdate = (editor) => {
        setContent(editor.getJSON())
    }
    const handleEdit = () => {
        setEdit(async prev => {
            if (prev) {
                const { data, error } = await saveDescription.dispatch({ description: content })
                if (data) {
                    group.description = content
                    toast.success("description updated successfully")
                }
            }
            return !prev
        })
    }
    const editorProps = {
        editable: () => false
    }
    return (
        <Layout.Col className="">
            <Layout.Col className="gap-2 max-w-md divide-y p-4">
                <GroupDetail indentifier="number" value={group.num} />
                <GroupDetail indentifier="session" value={group.session} />
                <GroupDetail indentifier="owner" value={group.users.name} />
            </Layout.Col>
            <Layout.Col className="gap-2 items-start bg-gray-50 p-4">
                <Button onClick={handleEdit} className="capitalize btn-primary" loading={saveDescription.loading}>{edit ? "save" : "edit"}</Button>
                {!edit && <Editor className="w-full bg-white rounded-md border" defaultValue={group.description || "Add project description to get started"} onUpdate={onEditorUpdate} editorProps={editorProps} />}
                {edit && <Editor className="w-full bg-white rounded-md border" defaultValue={group.description || "Add project description to get started"} onUpdate={onEditorUpdate} />}

            </Layout.Col>
        </Layout.Col>
    )
}

export default GroupAboutBlock