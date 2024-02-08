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
const ICON = {
    WIDTH: 20,
    HEIGHT: 20
}
const LINKS = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        Icon: <DashboardIcon width={ICON.WIDTH} height={ICON.HEIGHT} />
    },
    {
        title: 'Users',
        href: '/dashboard/users',
        Icon: <UsersIcon width={ICON.WIDTH} height={ICON.HEIGHT} />
    },
    {
        title: 'Groups',
        href: '/dashboard/groups',
        Icon: <GroupIcon width={ICON.WIDTH} height={ICON.HEIGHT} />
    }
]

const Sidebar = () => {
    const dashboard = useDashboardLayout();
    const toggleSidebar = () => {
        dashboard.setSidebarCollapsed(prev => !prev);
    }
    return (
        <Layout.Col className={`border-r h-full transition-all ease-in-out ${dashboard.sidebarCollapsed ? "w-1/2 lg:w-1/4":"w-auto"}`}>
            <Layout.Row className="p-2 justify-between items-center border-b">
                {dashboard.sidebarCollapsed && <Logo />}
                <Button onClick={toggleSidebar} className="btn-icon"><MenuIcon width={24} height={24} /></Button>
            </Layout.Row>
            <Layout.Col className="gap-2">
                {
                    LINKS.map((link, index) => (
                        <Link key={`sidebarLink_${index}`} href={link.href} prefetch className={`flex text-gray-900 gap-2 px-2 py-2 hover:bg-slate-200 active1:bg-slate-300 rounded-md font-semibold transition-all items-center ${dashboard.sidebarCollapsed ? "":"justify-center aspect-square"}`}>
                            {link.Icon}
                            {dashboard.sidebarCollapsed && link.title}
                        </Link>
                    ))
                }
            </Layout.Col>
        </Layout.Col>
    )
}

export default Sidebar