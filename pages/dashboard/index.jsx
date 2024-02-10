import React from 'react'
import DashboardLayout from '@/src/components/layouts/Dashboard';
import Typography from '@/src/components/ui/Typography';
import withAuthPage from '@/src/middlewares/withAuthPage';

const DashboardPage = () => {
    return (
        <DashboardLayout>
            <Typography.Heading>Dashboard</Typography.Heading>
        </DashboardLayout>
    )
}

export default DashboardPage;

export const getServerSideProps = withAuthPage(async (ctx) => {
    return {
        props: {
            info: "can be accessed by authenticated users only"
        }
    }
})