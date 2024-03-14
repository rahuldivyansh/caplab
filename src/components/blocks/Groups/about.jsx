import { useGroup } from '@/src/providers/Group'
import React, { useEffect, useState } from 'react'
import Layout from '../../ui/Layout'
import Typography from '../../ui/Typography'
import Button from '../../ui/Button'
import useFetch from '@/src/hooks/general/useFetch'
import { toast } from 'react-toastify'
import Editor from '../../ui/Editor'
import { Check, LucidePencil } from 'lucide-react'
import { ICON_DIMENSIONS } from '../../ui/Editor/constants'

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

    return <Layout.Col className="gap-2 w-full">
        <Layout.Card className="w-full">
            <Layout.Row className="flex-wrap justify-between items-center">
                <Typography className="font-semibold">{edit ? "Save Changes" : "Description"}</Typography>
                <Button onClick={handleEdit} className="capitalize aspect-square transition-all bg-primary text-white border" loading={saveDescription.loading}>{edit ? <Check width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} /> : <LucidePencil width={ICON_DIMENSIONS.WIDTH} height={ICON_DIMENSIONS.HEIGHT} />}</Button>
            </Layout.Row>
        </Layout.Card>
        <Editor content={description} disabled={!edit} onChange={onChange} />
    </Layout.Col>
}

const GroupAboutBlock = () => {
    const group = useGroup()
    return (
        <Layout.Col className="p-2 gap-2 max-w-3xl mx-auto container min-h-screen">
            <Layout.Col className="gap-2 items-start">
                <Layout.Card className="w-full divide-y dark:divide-white/5">
                    <GroupDetail value={group?.num} identifier="Group number" />
                    <GroupDetail value={group?.session} identifier="Session" />
                    <GroupDetail value={`${group?.users?.name?.toUpperCase()} (${group?.users?.email})`} identifier="Owner" />
                </Layout.Card>
                <ProjectDescriptionEditor />
            </Layout.Col>
        </Layout.Col>
    )
}

export default GroupAboutBlock