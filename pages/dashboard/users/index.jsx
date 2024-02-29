import React, { useMemo, useState } from 'react'
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
import { set } from 'nprogress'
import Input from '@/src/components/ui/Form/Input'
import { LoaderElement } from '@/src/components/elements/Loaders'


const DeleteUserBlock = (props) => {
  const { user } = props;
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const deleteUser = useFetch({ method: "DELETE", url: `/api/users/${user.uid}` })
  const deleteUserHandler = async () => {
    try {
      await deleteUser.dispatch()
      toast.success("User deleted")
      props.getUsers();
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

const UpdateRoleElement = (props) => {
  const { user } = props;
  const [role, setRole] = useState(user.role)
  const updateRole = useFetch({ method: "PUT", url: `/api/roles/${user.uid}` })
  const updateRoleHandler = async (e) => {
    try {
      const { value } = e.target;
      const { data, error } = await updateRole.dispatch({ role: parseInt(value) })
      if (error) throw error
      toast.success("role updated")
      setRole(data?.role)
    } catch (error) {
      toast.error("error updating role")
    }
  }
  console.log("role", role)
  return (
    <Layout.Row className="gap-2">
      <select disabled={updateRole.loading} value={role} onChange={updateRoleHandler} className="p-2 border capitalize rounded-md  transition-all w-full text-center">
        {Object.keys(REV_ROLES).map((role) => {
          return <option key={role} value={role}>{REV_ROLES[role]}</option>
        })}
      </select>
    </Layout.Row>
  )

}

const UsersTableBlock = ({ searchValue }) => {
  const users = useFetch({ method: "GET", url: "/api/users", get_autoFetch: true })
  const filteredUsers = useMemo(() => {
    if (users.data) {
      if (!searchValue) return users.data;
      return users.data.filter((user) => {
        return Object.values(user).some((value) => value.toString().toLowerCase().includes(searchValue.toLowerCase()))
      })
    }
    return []
  }, [searchValue, users.data])
  const columns = [
    { field: "name", headerName: "Name", cellRenderer: (params) => <Typography.Caption className="capitalize">{params.data.name}</Typography.Caption>, },
    { field: "email", headerName: "Email" },
    {
      field: "role",
      headerName: "Role",
      cellRenderer: (params) => <UpdateRoleElement user={params.data} />
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
            <DeleteUserBlock user={params.data} getUsers={users.dispatch} />
          </Layout.Row>
        )
      },
    }]
  if (users.loading) {
    return <LoaderElement />
  }
  if (users.error) {
    return <div>Error...</div>
  }
  if (users.data) {

    return <Layout.Col className="ag-theme-quartz text-black h-[90dvh] justify-start">
      <AgGridReact columnDefs={columns} rowData={filteredUsers} />
    </Layout.Col>
  }
  return <></>
}

const UsersPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const handleChange = (e) => {
    setSearchValue(e.target.value)
  }
  return (
    <DashboardLayout>
      <Layout.Col className="p-2 gap-2">
        <Typography.Title className="font-semibold capitalize">users</Typography.Title>
        <Layout.Row className="justify-end items-center gap-2">
          <Input type="text" placeholder="Search user" className="py-2" onChange={handleChange} />
          <Link href="/dashboard/users/add">
            <Button className="btn-primary">
              Add User
            </Button>
          </Link>
        </Layout.Row>
        <UsersTableBlock searchValue={searchValue} />
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
