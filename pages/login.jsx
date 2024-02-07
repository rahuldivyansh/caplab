import React from 'react'
import LoginFormBlock from '@/src/components/blocks/Login/Form'
import NavbarFixed from '@/src/components/sections/Navbar/NavbarFixed'
import Layout from '@/src/components/ui/Layout'

const LoginPage = () => {
    return (
        <Layout>
            <NavbarFixed />
            <Layout.Container>
                <LoginFormBlock />
            </Layout.Container>
        </Layout>
    )
}

export default LoginPage