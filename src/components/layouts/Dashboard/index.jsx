import React from 'react'
import Navbar from '@/src/components/sections/Navbar';
import Layout from '@/src/components/ui/Layout';
import Typography from '@/src/components/ui/Typography';
import Sidebar from './Sidebar';
import DashboardLayoutProvider from '@/src/providers/Dashboard';

const DashboardLayout = (props) => {
    return (
        <DashboardLayoutProvider>
            <Layout.Row className="fixed inset-0 w-full">
                <Sidebar />
                <Layout.Col className="col-span-3 w-3/4 flex-1">
                    <Layout.Row className="justify-end items-center border-b p-2">
                        <Navbar />
                    </Layout.Row>
                    <Layout.Col>
                        {props.children}
                    </Layout.Col>
                </Layout.Col>
            </Layout.Row>
        </DashboardLayoutProvider>
    )
}

export default DashboardLayout;