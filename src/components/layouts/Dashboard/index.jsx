import React from 'react'
import Navbar from '@/src/components/sections/Dashboard/Navbar';
import Layout from '@/src/components/ui/Layout';
import Typography from '@/src/components/ui/Typography';
import Sidebar from './Sidebar';
import DashboardLayoutProvider from '@/src/providers/Dashboard';

const DashboardLayout = (props) => {
    return (
        <DashboardLayoutProvider>
            <Layout.Row className="fixed inset-0 w-full">
                <Sidebar />
                <Layout.Col className="col-span-3 w-3/4 flex-1 overflow-auto">
                    <Layout.Row className="justify-end items-center border-b p-2 sticky top-0 bg-white z-40">
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