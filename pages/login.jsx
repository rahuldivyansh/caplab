import React from 'react'
import LoginFormBlock from '@/src/components/blocks/Login/Form'
import NavbarFixed from '@/src/components/sections/Navbar/NavbarFixed'
import Layout from '@/src/components/ui/Layout'
import Page from '@/src/components/pages'

const LoginPage = () => {
    return (
        <Page title="Continue your account.">
            <Layout>
                <NavbarFixed />
                <Layout.Container>
                    <LoginFormBlock />
                </Layout.Container>
            </Layout>
        </Page>
    )
}

export default LoginPage