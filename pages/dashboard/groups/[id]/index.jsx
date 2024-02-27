import GroupDocsBlock from '@/src/components/blocks/Groups/docs';
import DashboardLayout from '@/src/components/layouts/Dashboard';
import Button from '@/src/components/ui/Button';
import Layout from '@/src/components/ui/Layout';
import Typography from '@/src/components/ui/Typography';
import { ROLES } from '@/src/constants/roles';
import withAuthPage from '@/src/middlewares/withAuthPage';
import { Tab } from '@headlessui/react';
import React, { Fragment } from 'react'
import GroupStatusBlock from '@/src/components/blocks/Groups/status';
import GroupMembersBlock from '@/src/components/blocks/Groups/members';
import GroupAboutBlock from '@/src/components/blocks/Groups/about';
import GroupDiscussions from '@/src/components/blocks/Groups/discussions';
import supabaseClient from '@/src/services/supabase';
import GroupProvider from '@/src/providers/Group';
import Avatar from '@/src/components/elements/Avatar';
import { File, Info, ListTodo, MessageCircle, Settings, Users } from 'lucide-react';

const TAB_LABELS = [{ label: "about", Icon: <Info className="ml-2" size={20}/> }, { label: "status", Icon: <ListTodo className="ml-2" size={20}/> }, { label: "documents", Icon: <File className="ml-2" size={20} /> }, { label: "members", Icon: <Users className="ml-2" size={20}/> }, { label: "discussions", Icon: <MessageCircle className="ml-2" size={20} /> }, { label: "settings", Icon: <Settings className="ml-2" size={20} /> }];



const GroupPage = (props) => {
    const { group } = props;
    const { id, num, session } = group
    return (
        <DashboardLayout>
            <Layout.Col>
                <Layout.Col className="p-2 gap-2 bg-white">
                    <Layout.Row className="flex-wrap justify-between md:items-center">
                        <Typography className="font-bold">Group - {num}</Typography>
                        <Layout.Row className="items-center gap-1">
                            <Avatar seed={group.users?.name || "user"} />
                            <Typography.Caption className="font-semibold text-gray-800 uppercase">{group.users?.name}</Typography.Caption>
                        </Layout.Row>
                    </Layout.Row>
                    <Typography.Caption className="font-semibold">{session}</Typography.Caption>
                </Layout.Col>
                <Tab.Group>
                    <Tab.List className="flex border-b shadow-sm overflow-x-scroll scroll-bar-none sticky top-[3.5rem] sm:top-[3.8rem] right-0 z-10 bg-white">
                        <Layout.Row className="flex-nowrap">
                            {TAB_LABELS.map((tab, index) =>
                                <Tab
                                    as={Fragment}
                                    key={`group-page-tab-${index}`}
                                >{({ selected }) => <Button className={`uppercase text-xs font-bold hover:bg-secondary rounded-none py-3 px-4 border-b-2 outline-none ${selected ? "text-primary border-primary" : " border-white"}`}>{tab.label} {tab.Icon}</Button>}
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
                                <GroupStatusBlock />
                            </Tab.Panel>
                            <Tab.Panel>
                                <GroupDocsBlock groupId={id} />
                            </Tab.Panel>
                            <Tab.Panel>
                                <GroupMembersBlock groupId={id} />
                            </Tab.Panel>
                            <Tab.Panel as={Fragment}>
                                <GroupDiscussions />
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