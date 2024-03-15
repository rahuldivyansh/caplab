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
        if (body.role === '-1') return toast.error("select role")
        try {
            const { error, data } = await addUser.dispatch({ ...body, name: new String(body.name).toLowerCase(), role: parseInt(body.role) })
            if (error) throw error;
            if (data) {
                toast.success("user added")
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
                <Typography.Heading className="font-semibold capitalize">add user</Typography.Heading>
                <Form onSubmit={onSubmit}>
                    <Layout.Col className="gap-2 max-w-md">
                        <Input type="text" placeholder="Enter name" name="name" required />
                        <Input type="email" placeholder="Enter email" name="email" required />
                        <select name="role" className="input capitalize">
                            <option value={-1} className="dark:text-background-dark">Select Role</option>
                            {ROLES.map((role, index) => (
                                <option key={`form_user_role_${index}`} value={role.value} className='capitalize dark:text-background-dark'>{role.role}</option>
                            ))}
                        </select>
                        <Button className="btn-primary sm:max-w-20" loading={addUser.loading}>Submit</Button>
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
            info: "can be accessed by admin only",
            
        },
    }
})