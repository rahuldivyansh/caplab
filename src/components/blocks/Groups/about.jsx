import { useGroup } from '@/src/providers/Group'
import React, { useEffect, useState } from 'react'
import Layout from '../../ui/Layout'
import Typography from '../../ui/Typography'
import Button from '../../ui/Button'
import useFetch from '@/src/hooks/general/useFetch'
import dynamic from 'next/dynamic'
import { toast } from 'react-toastify'
const Editor = dynamic(() => import('../../ui/Editor').then(mod => mod.default), { ssr: false });

const GroupDetail = ({ identifier, value }) => {
    return (
        <Layout.Col className="justify-between sm:flex-row py-2">
            <Typography className="font-semibold capitalize">{identifier}</Typography>
            <Typography>{value}</Typography>
        </Layout.Col>
    )
}

const ProjectDescriptionEditor = () => {
    const [edit, setEdit] = useState(false)
    const group = useGroup()
    const [description, setDescription] = useState(group.description || "")
    const saveDescription = useFetch({ method: "PUT", url: `/api/groups/${group.id}` })
    const handleEdit = async () => {
        if (edit) {
            if (description !== group.description) {
                const { data, error } = await saveDescription.dispatch({ description })
                if (error) {
                    toast.error("unable to update description")
                }
                if (data) {
                    group.description = description
                    toast.success("Description updated")
                }
            }
            setEdit(false);
            return;
        }
        setEdit(true)
    }

    const onChange = (value) => {
        setDescription(value)
    }

    return <><Button onClick={handleEdit} className="capitalize btn-primary" loading={saveDescription.loading}>{edit ? "save" : "edit"}</Button>
        <Editor initialValue={description} disabled={!edit} onChange={onChange} /></>
}

const GroupAboutBlock = () => {
    const group = useGroup()
    return (
        <Layout.Col className="">
            <Layout.Col className="gap-2 max-w-md divide-y p-4">
                <GroupDetail identifier="number" value={group.num} />
                <GroupDetail identifier="session" value={group.session} />
                <GroupDetail identifier="owner" value={group.users?.name} />
            </Layout.Col>
            <Layout.Col className="gap-2 items-start bg-gray-50 p-4">
                <ProjectDescriptionEditor />
            </Layout.Col>
        </Layout.Col>
    )
}

export default GroupAboutBlock