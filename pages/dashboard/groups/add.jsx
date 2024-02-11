import DashboardLayout from '@/src/components/layouts/Dashboard'
import Button from '@/src/components/ui/Button'
import Form from '@/src/components/ui/Form'
import Input from '@/src/components/ui/Form/Input'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import { ROLES } from '@/src/constants/roles'
import useFetch from '@/src/hooks/general/useFetch'
import withAuthPage from '@/src/middlewares/withAuthPage'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

const AddGroupPage = () => {
    const router = useRouter();
    const addGroup = useFetch({ method: "POST", url: "/api/groups" });
    const handleSubmit = async (body) => {
        const payload = {
            num: parseInt(body.num),
            session: parseInt(body.session)
        }
        try {
            await addGroup.dispatch(payload)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        if (addGroup.error) {
            toast.error("error adding group")
        }
        if (addGroup.data) {
            toast.success("Group added")
            router.push("/dashboard/groups")
        }
    }, [addGroup.error, addGroup.data, addGroup.loading])
    return (
        <DashboardLayout>
            <Layout.Col className="p-2 gap-4">
                <Layout.Col className="md:flex-row justify-between">
                    <Typography.Subtitle className="font-semibold">
                        Add Group
                    </Typography.Subtitle>
                </Layout.Col>
                <Form onSubmit={handleSubmit}>
                    <Layout.Col className="gap-2 md:items-start">
                        <Typography.Heading>General Info</Typography.Heading>
                        <Input type="number" name="num" placeholder="Enter group number..." min={1} required />
                        <Input type="number" name="session" placeholder="Enter session..." min={2000} max={9999} required />
                        <Button className="btn-primary" loading={addGroup.loading}>Submit</Button>
                    </Layout.Col>
                </Form>
            </Layout.Col>
        </DashboardLayout>
    )
}

export default AddGroupPage


export const getServerSideProps = withAuthPage(async (ctx) => {
    const { req } = ctx;
    const { role } = req
    const ALLOWED_ROLES = [ROLES.TEACHER];
    if (role === undefined || !ALLOWED_ROLES.includes(role)) {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            },
        }
    }
    return {
        props: {
            info: "can be accessed by authenticated users only"
        },
    }
})