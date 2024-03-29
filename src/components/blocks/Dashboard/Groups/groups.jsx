import React, { useEffect } from 'react'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import useFetch from '@/src/hooks/general/useFetch'
import { useAuth } from '@/src/providers/Auth'
import { ROLES } from '@/src/constants/roles'
import { ScaleLoader } from 'react-spinners'

const ALLOWED_ROLES = [ROLES.TEACHER, ROLES.STUDENT];

const DashboardGroupsBlock = () => {
    const auth = useAuth();
    const role = auth.data?.app_meta?.role
    const notAllowed = role === undefined || !ALLOWED_ROLES.includes(role);
    const groups = useFetch({ method: "GET", url: "/api/groups", get_autoFetch: false })

    useEffect(() => {
        const getGroups = async () => {
            try {
                await groups.dispatch()
            } catch (error) {
                console.error(error)
            }
        }
        !notAllowed && getGroups();
    }, [])

    if (notAllowed) return null
    return (
        <Layout.Card>
            <Layout.Row className="justify-between items-center">
                <Typography className="font-semibold">
                    Groups
                </Typography>
                <Typography className="font-semibold">
                    {groups.loading && <ScaleLoader className='text-gray-500' height={24} width={2} />}
                    {groups.error && "error loading groups"}
                    {groups.data !== null && groups.data.length}
                </Typography>
            </Layout.Row>
        </Layout.Card>
    )
}

export default DashboardGroupsBlock