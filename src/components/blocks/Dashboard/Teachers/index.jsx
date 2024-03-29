import React from 'react'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import useFetch from '@/src/hooks/general/useFetch'
import { useAuth } from '@/src/providers/Auth'
import { ROLES } from '@/src/constants/roles'
import KeyValue from '@/src/components/ui/Description/KeyValue'

const ALLOWED_ROLES = [ROLES.ADMIN];

const DashboardTeachersBlock = ({ count }) => {
    return (
        <Layout.Card>
           <KeyValue keyData="teachers" value={count} direction='row'/>
        </Layout.Card>
    )
}

export default DashboardTeachersBlock