import React, { useState } from 'react'
import Link from 'next/link'
import DashboardLayout from '@/src/components/layouts/Dashboard'
import Button from '@/src/components/ui/Button'
import Layout from '@/src/components/ui/Layout'
import Typography from '@/src/components/ui/Typography'
import { REV_ROLES, ROLES } from '@/src/constants/roles'
import useFetch from '@/src/hooks/general/useFetch'
import withAuthPage from '@/src/middlewares/withAuthPage'
import DataGrid from 'react-data-grid';
import { AgGridReact } from 'ag-grid-react'
import { toast } from 'react-toastify'
import Modal from '@/src/components/ui/Modal'
import { useRouter } from 'next/router'


const DeleteUserBlock = (props) => {
  const { user } = props;
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const deleteUser = useFetch({ method: "DELETE", url: `/api/users/${user.uid}` })
  const deleteUserHandler = async () => {
    try {
      await deleteUser.dispatch()
      toast.success("User deleted")
      router.reload()
    } catch (error) {
      toast.error("error deleting user")
    }
  }
  const toggleDialog = () => {
    setDialogOpen(!dialogOpen)
  }
  return (
    <>
      <Modal title="Remove user" open={dialogOpen} onClose={toggleDialog}>
        <Layout.Col className="gap-8 p-4">
          <Typography.Caption>
            Are you sure to remove this user. This action is irreversible.
          </Typography.Caption>
          <Layout.Row className="gap-2 justify-end">
            <Button className="btn-sm bg-red-500 text-white" onClick={deleteUserHandler} loading={deleteUser.loading}>Remove</Button>
            <Button className="btn-sm bg-secondary" onClick={toggleDialog}>Cancel</Button>
          </Layout.Row>
        </Layout.Col>
      </Modal>
      <Button className="btn-sm bg-red-500 text-white" onClick={toggleDialog}>Remove</Button>
    </>

  )

}

const UsersTableBlock = () => {
  const users = useFetch({ method: "GET", url: "/api/users", get_autoFetch: true })

  const columns = [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    {
      field: "role",
      headerName: "Role",
      cellRenderer: (params) => {
        return <Typography.Caption className="capitalize">{REV_ROLES[params.data.role]}</Typography.Caption>
      }
    },
    {
      field: "uid", headerName: "UID",
      editable: true
    },
    {
      headerName: "Actions",
      cellRenderer: (params) => {
        return (
          <Layout.Row className="h-full items-center justify-center">
            <DeleteUserBlock user={params.data} />
          </Layout.Row>
        )
      },
    }]
  if (users.loading) {
    return <div>Loading...</div>
  }
  if (users.error) {
    return <div>Error...</div>
  }
  if (users.data) {

    return <Layout.Col className="ag-theme-quartz text-black h-56 justify-start">
      <AgGridReact columnDefs={columns} rowData={users.data} />
    </Layout.Col>
  }
  return <></>
}

const UsersPage = () => {
  return (
    <DashboardLayout>
      <Layout.Col className="p-2 gap-2">
        <Typography.Title>Users</Typography.Title>
        <Layout.Col className="md:flex-row justify-end">
          <Link href="/dashboard/users/add">
            <Button className="btn-primary">
              Add User
            </Button>
          </Link>
        </Layout.Col>
        <UsersTableBlock />
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
