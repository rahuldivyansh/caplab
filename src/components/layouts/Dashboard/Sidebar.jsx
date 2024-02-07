import Logo from '@/src/components/elements/Logo'
import Layout from '@/src/components/ui/Layout'
import React from 'react'

const Sidebar = () => {
    return (
        <Layout.Col className="border-r h-full p-2">
            <Layout.Col className="py-3">
                <Logo />
            </Layout.Col>
        </Layout.Col>
    )
}

export default Sidebar