import React from 'react'
import { ROLES as IMPORTED_ROLES } from '@/src/constants/roles'
import DashboardLayout from '@/src/components/layouts/Dashboard'
import Button from '@/src/components/ui/Button'
import Form from '@/src/components/ui/Form'
import Input from '@/src/components/ui/Form/Input'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import useFetch from '@/src/hooks/general/useFetch'
import withAuthPage from '@/src/middlewares/withAuthPage'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const ROLES = [
    { role: "admin", value: 0 },
    { role: "student", value: 1 },
    { role: "teacher", value: 2 }
]

const AddUserPage = () => {
    const addUser = useFetch({ method: "POST", url: "/api/auth/register" })
    const router = useRouter()
    const onSubmit = async (body) => {
        if (body.role === '-1') return toast.error("Select role")
        try {
            const response = await addUser.dispatch(body)
            const data = await response.data;
            if (data) {
                toast.success("User added")
                router.push("/dashboard/users")
            }
        } catch (error) {
            console.log(error)
            toast.error("error adding user")
        }
    }
    return (
        <DashboardLayout>
            <Layout.Col className="p-2 gap-2">
                <Typography.Title>Add User</Typography.Title>
                <Form onSubmit={onSubmit}>
                    <Layout.Col className="gap-2 sm:items-start">
                        <Input type="text" placeholder="Enter name" name="name" />
                        <Input type="email" placeholder="Enter email" name="email" />
                        <select name="role" className="input capitalize">
                            <option value={-1}>Select Role</option>
                            {ROLES.map((role, index) => (
                                <option key={`form_user_role_${index}`} value={role.value} className='capitalize'>{role.role}</option>
                            ))}
                        </select>
                        <Button className="btn-primary" loading={addUser.loading}>Submit</Button>
                    </Layout.Col>
                </Form>
            </Layout.Col>
        </DashboardLayout>
    )
}

export default AddUserPage


export const getServerSideProps = withAuthPage(async (ctx) => {
    const { req } = ctx;
    if (req.role !== IMPORTED_ROLES.ADMIN) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            info: "can be accessed by admin only"
        }, // will be passed to the page component as props
    }
})