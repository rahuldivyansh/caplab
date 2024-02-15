import DashboardLayout from '@/src/components/layouts/Dashboard';
import Button from '@/src/components/ui/Button';
import Layout from '@/src/components/ui/Layout';
import Typography from '@/src/components/ui/Typography';
import { ROLES } from '@/src/constants/roles';
import withAuthPage from '@/src/middlewares/withAuthPage';
import { Tab } from '@headlessui/react';
import React, { Fragment } from 'react'
import DashboardGroupsStatusBlock from '@/src/components/blocks/Groups';

const TAB_LABELS = ["status", "documents", "settings"];

const GroupPage = (props) => {
    return (
        <DashboardLayout>
            <Layout.Col>
                <Typography.Subtitle className="font-semibold p-4">Group - {props.id}</Typography.Subtitle>
                <Tab.Group>
                    <Tab.List className="flex border-b shadow-sm">
                        {TAB_LABELS.map((label, index) =>
                            <Tab
                                as={Fragment}
                                key={`group-page-tab-${index}`}
                            >{({ selected }) => <Button className={`capitalize font-semibold hover:bg-secondary rounded-none py-3 px-4 border-b-2 ${selected ? "text-primary border-primary" : " border-white"}`}>{label}</Button>}
                            </Tab>
                        )}
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                        <DashboardGroupsStatusBlock/>
                            {/* <Typography></Typography> */}
                        </Tab.Panel>
                        <Tab.Panel>
                            <Typography>Documents</Typography>
                        </Tab.Panel>
                        <Tab.Panel>
                            <Typography>Settings</Typography>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </Layout.Col>
        </DashboardLayout>
    )
}

export default GroupPage;

export const getServerSideProps = withAuthPage(async (ctx) => {
    const { id } = ctx.query;
    const { req } = ctx;
    const { role } = req;
    if (!id) return {
        notFound: true
    }
    const ALLOWED_ROLES = [ROLES.TEACHER, ROLES.STUDENT];
    if (!ALLOWED_ROLES.includes(role)) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            info: "can be accessed by teachers and students only",
            id
        },
    }
})