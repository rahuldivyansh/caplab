import Button from '@/src/components/ui/Button'
import Form from '@/src/components/ui/Form'
import Input from '@/src/components/ui/Form/Input'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import useFetch from '@/src/hooks/general/useFetch'
import React, { useState } from 'react'

const ResetPasswordForm = () => {
    const resetPassword = useFetch({ method: "POST", url: '/api/auth/forgot-password' })
    const handleSubmit = async (body) => {
        console.log(body)
        // try {
        //     await resetPassword.dispatch(body);
        // } catch (error) {
        //     console.log(error)
        // }
    }
    return <Form onSubmit={handleSubmit}>
        <Layout.Col className="gap-2">
            <Input type="password" name="password" placeholder="Enter new password..." required />
            <Input type="password" name="confirm_password" placeholder="Confirm password..." required />
            <Button className="btn-primary">Submit</Button>
        </Layout.Col>
    </Form>

}

const ConfirmEmailForm = (props) => {
    const getUser = useFetch({ method: "POST", url: '/api/auth/verify-email' })
    const handleSubmit = async (body) => {
        try {
            await getUser.dispatch(body);
            props.onConfirm(true)
        } catch (error) {
            props.onConfirm(false);
            console.log(error)
        }
    }
    return <Form onSubmit={handleSubmit}>
        <Layout.Col className="gap-2">
            <Input type="email" name="email" placeholder="Enter email" required />
            <Button className="btn-primary" loading={getUser.loading}>Submit</Button>
        </Layout.Col>
    </Form>
}

const ForgotPasswordPage = () => {
    const [status, setStatus] = useState(false);
    const onConfirm = (status) => {
        setStatus(status)
    }
    return (
        <Layout.Container className="max-w-sm h-full fixed inset-0">
            <Layout.Col className="justify-center h-full">
                <Layout.Card className="flex flex-col gap-4">
                    <Layout.Col>
                        <Typography.Heading className="font-semibold">Forgot Password</Typography.Heading>
                        <Typography.Caption className="font-normal">Enter your email to recover your password.</Typography.Caption>
                    </Layout.Col>
                    {!status &&<ConfirmEmailForm onConfirm={onConfirm} />}
                    {status && <ResetPasswordForm />}
                </Layout.Card>
            </Layout.Col>
        </Layout.Container>
    )
}

export default ForgotPasswordPage