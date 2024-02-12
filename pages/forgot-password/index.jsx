import React, { useState } from 'react'
import Button from '@/src/components/ui/Button'
import Form from '@/src/components/ui/Form'
import Input from '@/src/components/ui/Form/Input'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import useFetch from '@/src/hooks/general/useFetch'
import { useAuth } from '@/src/providers/Auth'
import Cookies from 'cookies'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

const ResetPasswordForm = () => {
    const router = useRouter();
    const resetPassword = useFetch({ method: "POST", url: '/api/auth/forgot-password' })
    const handleSubmit = async (body) => {
        if (body.password !== body.confirm_password) {
            toast.error("passwords do not match");
            return;
        }
        try {
            const { data, error, loading } = await resetPassword.dispatch(body);
            if (error) throw error;
            if (data) {
                toast.success("password reset successfully")
                router.push("/login")
            }
        } catch (error) {
            toast.error("password reset failed")
        }
    }
    return <Form onSubmit={handleSubmit}>
        <Layout.Col className="gap-2">
            <Input type="password" name="password" placeholder="Enter new password..." required />
            <Input type="password" name="confirm_password" placeholder="Confirm password..." required />
            <Button className="btn-primary" loading={resetPassword.loading}>Submit</Button>
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

const ForgotPasswordPage = (props) => {
    const user = useAuth();
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
                        {!props.auth && <Typography.Caption className="font-normal">Enter your email to recover your password.</Typography.Caption>}
                        {props.auth && <Typography.Caption className="font-normal">Enter your new password.</Typography.Caption>}
                    </Layout.Col>
                    {!props.auth && !status && <ConfirmEmailForm onConfirm={onConfirm} />}
                    {!props.auth && status && <>an email sent to you. close this tab to reset the password.</>}
                    {props.auth && <ResetPasswordForm />}
                </Layout.Card>
            </Layout.Col>
        </Layout.Container>
    )
}

export default ForgotPasswordPage


export const getServerSideProps = async (ctx) => {
    const { query, req, res } = ctx;
    const cookies = new Cookies(req, res);
    if (query.access_token && query.refresh_token) {
        cookies.set("access_token", query.access_token, { httpOnly: true });
        cookies.set("refresh_token", query.refresh_token, { httpOnly: true });
        return {
            props: {
                auth: true
            }
        }
    }
    return {
        props: {
            auth: false
        }
    }
}