import React from 'react'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import useFetch from '@/src/hooks/general/useFetch'
import { useAuth } from '@/src/providers/Auth'
import { ROLES } from '@/src/constants/roles'

const ALLOWED_ROLES = [ROLES.ADMIN];

const DashboardTeachersBlock = () => {
    const auth = useAuth();
    const role = auth.data?.app_meta?.role
    const teachers = useFetch({ method: "GET", url: "/groups", get_autoFetch: false })
    console.log(role);
    if (role === undefined || !ALLOWED_ROLES.includes(role)) return null;
    return (
        <Layout.Card>
            <Typography className="font-semibold">
                Teachers
            </Typography>
        </Layout.Card>
    )
}

export default DashboardTeachersBlock