import React from 'react'
import DashboardLayout from '@/src/components/layouts/Dashboard'
import Button from '@/src/components/ui/Button'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import { ROLES } from '@/src/constants/roles'
import { useAuth } from '@/src/providers/Auth'
import withAuthPage from '@/src/middlewares/withAuthPage'
import Link from 'next/link'
import useFetch from '@/src/hooks/general/useFetch'
import { RotateLoader } from 'react-spinners'

const ALLOWED_ROLES = [ROLES.TEACHER];

const GroupsPage = () => {
    const auth = useAuth();
    const groups = useFetch({ method: "GET", url: "/api/groups", get_autoFetch: true })
    const role = auth.data?.app_meta?.role
    return (
        <DashboardLayout>
            <Layout.Col className="p-2 gap-4">
                <Layout.Row className="justify-between flex-grow">
                    <Typography.Subtitle className="font-semibold">
                        Groups
                    </Typography.Subtitle>
                    {ALLOWED_ROLES.includes(role) &&
                        <Link href="/dashboard/groups/add">
                            <Button className="btn-primary">Add Group</Button>
                        </Link>
                    }
                </Layout.Row>
                <Layout.Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {groups.loading && <>loading...</>}
                    {groups.error && "error loading groups"}
                    {groups.data !== null && groups.data.map((group, index) => (
                        <Layout.Card key={`group-${index}`}>
                            <Typography.Heading className="font-semibold">Group-{group.num}</Typography.Heading>
                            <Typography>Session-{group.session}</Typography>
                        </Layout.Card>
                    ))}
                </Layout.Grid>
            </Layout.Col>
        </DashboardLayout>
    )
}

export default GroupsPage

export const getServerSideProps = withAuthPage(async (ctx) => {
    return {
        props: {
            info: "can be accessed by authenticated users only"
        },
    }
})