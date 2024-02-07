import React from 'react'
import Navbar from '@/src/components/sections/Navbar';
import Layout from '@/src/components/ui/Layout';
import Typography from '@/src/components/ui/Typography';
import Sidebar from './Sidebar';

const DashboardLayout = (props) => {
    return (
        <Layout.Grid className="grid-cols-4 fixed inset-0">
            <Sidebar />
            <Layout.Col className="col-span-3">
                <Layout.Row className="justify-end items-center border-b p-2">
                    <Navbar />
                </Layout.Row>
                <Layout.Col>
                    {props.children}
                </Layout.Col>
            </Layout.Col>
        </Layout.Grid>
    )
}

export default DashboardLayout;