import React from 'react'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import KeyValue from '@/src/components/ui/Description/KeyValue'


const DashboardStudentsBlock = ({ count }) => {

    return (
        <Layout.Card>
            <KeyValue keyData="Students" value={count} direction='row'/>
        </Layout.Card>
    )
}

export default DashboardStudentsBlock