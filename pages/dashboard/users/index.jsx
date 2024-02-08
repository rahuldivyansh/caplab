import DashboardLayout from '@/src/components/layouts/Dashboard'
import Button from '@/src/components/ui/Button'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import Link from 'next/link'
import React from 'react'

const UsersPage = () => {
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
      </Layout.Col>
    </DashboardLayout>
  )
}

export default UsersPage