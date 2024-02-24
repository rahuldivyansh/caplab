import React from 'react'
import Navbar from '@/src/components/sections/Dashboard/Navbar';
import Layout from '@/src/components/ui/Layout';
import Typography from '@/src/components/ui/Typography';
import Sidebar from './Sidebar';
import DashboardLayoutProvider, { useDashboardLayout } from '@/src/providers/Dashboard';
import { twMerge } from 'tailwind-merge';

const DashboardNavbar = (props) => {
    const dashboard = useDashboardLayout();
    return (
        <Layout.Row className={twMerge("items-center border-b p-2 sticky top-0 bg-white z-40", dashboard.sidebarCollapsed ? "justify-end" : "justify-between")}>
            <Navbar withLogo={!dashboard.sidebarCollapsed} />
        </Layout.Row>
    )
}

const DashboardLayout = (props) => {
    return (
        <DashboardLayoutProvider>
            <Layout.Row className="fixed inset-0 w-full">
                <Sidebar />
                <Layout.Col className="col-span-3 w-3/4 flex-1 overflow-auto">
                    <DashboardNavbar />
                    <Layout.Col>
                        {props.children}
                    </Layout.Col>
                </Layout.Col>
            </Layout.Row>
        </DashboardLayoutProvider>
    )
}

export default DashboardLayout;