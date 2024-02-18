import { useGroup } from '@/src/providers/Group'
import React from 'react'
import Layout from '../../ui/Layout'
import Typography from '../../ui/Typography'

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
    return (
        <Layout.Col className="p-4 max-w-md divide-y">
            <GroupDetail indentifier="number" value={group.num} />
            <GroupDetail indentifier="session" value={group.session} />
            <GroupDetail indentifier="owner" value={group.users.name} />
        </Layout.Col>
    )
}

export default GroupAboutBlock