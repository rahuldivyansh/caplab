import React from 'react'
import DashboardLayout from '@/src/components/layouts/Dashboard';
import Typography from '@/src/components/ui/Typography';
import withAuthPage from '@/src/middlewares/withAuthPage';
import Layout from '@/src/components/ui/Layout';
import { useAuth } from '@/src/providers/Auth';
import DashboardGroupsBlock from '@/src/components/blocks/Dashboard/Groups';
import DashboardTeachersBlock from '@/src/components/blocks/Dashboard/Teachers';
import DashboardStudentsBlock from '@/src/components/blocks/Dashboard/Students';


const MainSection = () => {
    return (
        <Layout.Grid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <DashboardGroupsBlock />
            <DashboardTeachersBlock/>
            <DashboardStudentsBlock/>
        </Layout.Grid>
    )
}

const DashboardPage = () => {
    const auth = useAuth();
    const name = auth.data?.app_meta?.name || "User";
    return (
        <DashboardLayout>
            <Layout.Col className="p-2">
                <Typography.Subtitle className="font-semibold">
                    Welcome back, {name}!
                </Typography.Subtitle>
                <MainSection />
            </Layout.Col>
        </DashboardLayout>
    )
}

export default DashboardPage;

export const getServerSideProps = withAuthPage(async (ctx) => {
    return {
        props: {
            info: "can be accessed by authenticated users only"
        },
    }
})