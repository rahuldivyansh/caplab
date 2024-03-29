import React, { useEffect, useMemo } from 'react'
import { useAuth } from '@/src/providers/Auth';
import DashboardStudentsBlock from '../Students';
import DashboardTeachersBlock from '../Teachers';
import { ROLES } from '@/src/constants/roles';
import useFetch from '@/src/hooks/general/useFetch';

const ALLOWED_ROLES = [ROLES.ADMIN];

const AdminOnlyBlock = () => {
  const auth = useAuth();
  const role = auth.data?.app_meta?.role;
  const users = useFetch({ method: "GET", url: "/api/users", get_autoFetch: false });
  const usersTypeCount  = useMemo(() => {
    if (users.data) {
      const students = users.data.filter(user => user.role === ROLES.STUDENT);
      const teachers = users.data.filter(user => user.role === ROLES.TEACHER);
      return {
        students: students.length,
        teachers: teachers.length
      }
    }
    return {
      students: 0,
      teachers: 0
    }
  }, [users.data]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        await users.dispatch();
      } catch (error) {
        console.error(error);
      }
    };
    role === ROLES.ADMIN &&
      getUsers();
  }, [role]);
  if (role === undefined || !ALLOWED_ROLES.includes(role)) return null;
  return (
    <>
      <DashboardStudentsBlock count={usersTypeCount.students} />
      <DashboardTeachersBlock count={usersTypeCount.teachers} />
    </>
  )
}

export default AdminOnlyBlock