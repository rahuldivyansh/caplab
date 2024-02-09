import React from 'react'
import Link from 'next/link'
import DashboardLayout from '@/src/components/layouts/Dashboard'
import Button from '@/src/components/ui/Button'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import { REV_ROLES, ROLES } from '@/src/constants/roles'
import useFetch from '@/src/hooks/general/useFetch'
import withAuthPage from '@/src/middlewares/withAuthPage'
import DataGrid from 'react-data-grid';

const columns = [{
  name: 'Name',
  key: 'name'
}, {
  name: 'Email',
  key: 'email'
}, {
  name: 'Role',
  key: 'role'
}]


const UsersPage = () => {
  const users = useFetch({ method: "GET", url: "/api/users", get_autoFetch: true })
  return (
    <DashboardLayout>
      <Layout.Col className="p-2">
        <Typography.Title>Users</Typography.Title>
        <Layout.Col className="md:flex-row justify-end">
          <Link href="/dashboard/users/add">
            <Button className="btn-primary">
              Add User
            </Button>
          </Link>
        </Layout.Col>
        {users.data && <DataGrid columns={columns} rows={users.data.map(item => ({ ...item, role: REV_ROLES[item.role] }))} />}
      </Layout.Col>
    </DashboardLayout>
  )
}

export default UsersPage

export const getServerSideProps = withAuthPage(async (ctx) => {
  const { req } = ctx;
  if (req.role !== ROLES.ADMIN) {
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
