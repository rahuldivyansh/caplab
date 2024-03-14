import React from 'react'
import Link from 'next/link';
import styles from "./LoginForm.module.css";
import Button from '@/src/components/ui/Button';
import Form from '@/src/components/ui/Form';
import Layout from '@/src/components/ui/Layout';
import Typography from '@/src/components/ui/Typography';
import { useAuth } from '@/src/providers/Auth';
import { LOGOTEXT } from '@/src/constants';
import useDevice from '@/src/hooks/general/useDevice';
import useGeolocation from '@/src/hooks/general/useGeolocation';

const EnableLocationMessage = () => {
    return <Layout.Col className="gap-2 bg-yellow-200 text-yellow-600 p-2 rounded border border-yellow-400">
        <Typography.Caption className="text-center">Please enable location to continue</Typography.Caption>
        <Typography.Caption className="text-center">Location is required for security purposes</Typography.Caption>
    </Layout.Col>

}

const LoginFormBlock = () => {
    const auth = useAuth();
    const device = useDevice();
    const geolocation = useGeolocation();
    const onSubmit = async (data) => {
        await auth.loginWithEmailAndPassword({ ...data, device, geolocation });
    }
    return (
        <Layout.Container className={styles.main_container}>
            <Typography.Heading className={styles.login_text}>Login</Typography.Heading>
            <Form onSubmit={onSubmit} autoComplete="off">
                <Layout.Col className={styles.form_col_layout}>
                    <Form.Input type="email" placeholder="Enter email" name="email" />
                    <Form.Input type="password" placeholder="Enter password" name="password" />
                    <Link href="/forgot-password" className='text-right'><Typography.Caption className="text-primary">Forgot password?</Typography.Caption></Link>
                    <Button className="btn-primary font-bold" loading={auth.loading} disabled={auth.loading}>Login</Button>
                </Layout.Col>
            </Form>
        </Layout.Container>
    )
}

export default LoginFormBlock;