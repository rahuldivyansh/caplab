import React from 'react'
import Link from 'next/link'
import DashboardIcon from "@heroicons/react/20/solid/ChartBarIcon";
import UsersIcon from "@heroicons/react/20/solid/UsersIcon";
import GroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import MenuIcon from "@heroicons/react/20/solid/Bars3Icon";
import Logo from '@/src/components/elements/Logo'
import Layout from '@/src/components/ui/Layout'
import Button from '../../ui/Button';
import { useDashboardLayout } from '@/src/providers/Dashboard';
import { ROLES } from '@/src/constants/roles';
import { useAuth } from '@/src/providers/Auth';
const ICON = {
    WIDTH: 20,
    HEIGHT: 20
}
const LINKS = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        Icon: <DashboardIcon width={ICON.WIDTH} height={ICON.HEIGHT} />,
        access: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]
    },
    {
        title: 'Users',
        href: '/dashboard/users',
        Icon: <UsersIcon width={ICON.WIDTH} height={ICON.HEIGHT} />,
        access: [ROLES.ADMIN]
    },
    {
        title: 'Groups',
        href: '/dashboard/groups',
        Icon: <GroupIcon width={ICON.WIDTH} height={ICON.HEIGHT} />,
        access: [ROLES.TEACHER, ROLES.STUDENT]
    }
]

const Sidebar = () => {
    const dashboard = useDashboardLayout();
    const user = useAuth();
    const role = user.data?.app_meta?.role;
    const toggleSidebar = () => {
        dashboard.setSidebarCollapsed(prev => !prev);
    }
    return (
        <Layout.Col className={`border-r dark:border-white/5 fixed sm:relative bg-background-light dark:bg-background-dark z-[3000] p-3 gap-4 h-full transition-all ease-in-out ${dashboard.sidebarCollapsed ? "w-full sm:w-1/4" : "hidden sm:block w-auto"}`}>
            <Layout.Row className="justify-between items-center">
                {dashboard.sidebarCollapsed && <Logo />}
                <Button onClick={toggleSidebar} className="btn-icon"><MenuIcon width={24} height={24} /></Button>
            </Layout.Row>
            <Layout.Col className="gap-2">
                {
                    LINKS.map((link, index) => (
                        link.access.includes(role) ? <Link key={`sidebarLink_${index}`} href={link.href} prefetch className={`flex text-gray-900 dark:text-white gap-2 px-2 py-2 hover:bg-slate-200 dark:hover:bg-white/10  active1:bg-slate-300 rounded-md font-semibold transition-all items-center ${dashboard.sidebarCollapsed ? "" : "justify-center aspect-square"}`}>
                            {link.Icon}
                            {dashboard.sidebarCollapsed && link.title}
                        </Link> : null
                    ))
                }
            </Layout.Col>
        </Layout.Col>
    )
}

export default Sidebar