import GroupDocsBlock from '@/src/components/blocks/Groups/docs';
import DashboardLayout from '@/src/components/layouts/Dashboard';
import Button from '@/src/components/ui/Button';
import Layout from '@/src/components/ui/Layout';
import Typography from '@/src/components/ui/Typography';
import { ROLES } from '@/src/constants/roles';
import withAuthPage from '@/src/middlewares/withAuthPage';
import { Tab } from '@headlessui/react';
import React, { Fragment } from 'react'
import StatusComponent from '@/src/components/blocks/Groups/status';
import GroupMembersBlock from '@/src/components/blocks/Groups/members';
import supabaseClient from '@/src/services/supabase';
import GroupProvider from '@/src/providers/Group';
import GroupAboutBlock from '@/src/components/blocks/Groups/about';
import Avatar from '@/src/components/elements/Avatar';

const TAB_LABELS = ["about", "status", "documents", "members", "settings"];

const GroupPage = (props) => {
    const { group } = props;
    const { id, num, session } = group
    return (
        <DashboardLayout>
            <Layout.Col>
                <Layout.Col className="p-2 gap-2">
                    <Typography.Subtitle className="font-semibold">Group - {num}</Typography.Subtitle>
                    <Typography.Caption className="font-semibold">{session}</Typography.Caption>
                    <Layout.Col className="gap-1">
                        <Typography className=" text-xs text-gray-500">Created by</Typography>
                        <Layout.Row className="items-center gap-1">
                            <Avatar seed={group.users.name} />
                            <Typography className="font-semibold text-gray-800 capitalize">{group.users.name}</Typography>
                        </Layout.Row>
                    </Layout.Col>
                </Layout.Col>
                <Tab.Group>
                    <Tab.List className="flex border-b shadow-sm overflow-x-scroll scroll-bar-none sticky top-0">
                        <Layout.Row className="flex-nowrap">
                            {TAB_LABELS.map((label, index) =>
                                <Tab
                                    as={Fragment}
                                    key={`group-page-tab-${index}`}
                                >{({ selected }) => <Button className={`uppercase text-sm font-semibold hover:bg-secondary rounded-none py-3 px-4 border-b-2 outline-none ${selected ? "text-primary border-primary" : " border-white"}`}>{label}</Button>}
                                </Tab>
                            )}
                        </Layout.Row>
                    </Tab.List>
                    <GroupProvider group={group}>
                        <Tab.Panels>
                            <Tab.Panel>
                                <GroupAboutBlock />
                            </Tab.Panel>
                            <Tab.Panel className="overflow-x-scroll outline-none bg-gray-100 scroll-bar-none">
                                <StatusComponent />
                            </Tab.Panel>
                            <Tab.Panel>
                                <GroupDocsBlock groupId={id} />
                            </Tab.Panel>
                            <Tab.Panel>
                                <GroupMembersBlock groupId={id} />
                            </Tab.Panel>
                            <Tab.Panel>
                                <Typography>Settings</Typography>
                            </Tab.Panel>
                        </Tab.Panels>
                    </GroupProvider>
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
    const { data: groupData, error: groupError } = await supabaseClient.from('groups').select('*,users(name,email,uid)').eq('id', id).single();
    if (groupError || !groupData) return {
        notFound: true
    }

    return {
        props: {
            info: "can be accessed by teachers and students only",
            group: groupData,
        },
    }
})