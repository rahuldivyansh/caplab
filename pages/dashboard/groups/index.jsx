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
import { ScaleLoader } from 'react-spinners'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import Avatar from '@/src/components/elements/Avatar'
import { LoaderElement } from '@/src/components/elements/Loaders'

const ALLOWED_ROLES = [ROLES.TEACHER];

const GroupsPage = () => {
    const auth = useAuth();
    const groups = useFetch({ method: "GET", url: "/api/groups", get_autoFetch: true })
    const role = auth.data?.app_meta?.role
    return (
        <DashboardLayout>
            <Layout.Col className="p-4 md:p-12 lg:p-16 gap-4">
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
                {groups.loading && <LoaderElement/>}
                {groups.error && "error loading groups"}
                <ResponsiveMasonry
                    className='gap-2'
                    columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
                >
                    <Masonry gutter={8}>

                        {groups.data !== null && groups.data.map((group, index) => (
                            <Link href={`/dashboard/groups/${group.id}`} key={`group-${index}`}>
                                <Layout.Card className="active:border-primary gap-2 flex flex-col">
                                    <Layout.Row className="items-center gap-2 justify-between">
                                        <Layout.Row className="gap-2 items-center">
                                            <Avatar seed={`GP-${group.num}-${group.session}`} />
                                            <Typography className="font-semibold uppercase">Group-{group.num}</Typography>
                                        </Layout.Row>
                                        <Typography className="font-semibold">{group.session}</Typography>
                                    </Layout.Row>
                                    <Layout.Row className="gap-2 items-start flex-wrap text-xs">
                                        {group.keywords && group.keywords.map((keyword, index) => (
                                            <Typography.Caption key={`keyword-${index}`} className="capitalize bg-primary/10 text-primary px-2 py-1 rounded-full">{keyword}</Typography.Caption>
                                        ))}
                                    </Layout.Row>
                                </Layout.Card>
                            </Link>
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
            </Layout.Col>
        </DashboardLayout>
    )
}

export default GroupsPage

export const getServerSideProps = withAuthPage(async (ctx) => {
    const { req } = ctx;
    const { role } = req
    const ALLOWED_ROLES = [ROLES.TEACHER, ROLES.STUDENT];
    if (role === undefined || !ALLOWED_ROLES.includes(role)) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            info: "can be accessed by students and teachers only"
        },
    }
})