import Avatar from '@/src/components/elements/Avatar'
import EmptyElement from '@/src/components/elements/Empty'
import { LoaderElement } from '@/src/components/elements/Loaders'
import Button from '@/src/components/ui/Button'
import CustomComboBox from '@/src/components/ui/ComboBox'
import Layout from '@/src/components/ui/Layout'
import Modal from '@/src/components/ui/Modal'
import Typography from '@/src/components/ui/Typography'
import { ROLES } from '@/src/constants/roles'
import useFetch from '@/src/hooks/general/useFetch'
import { useAuth } from '@/src/providers/Auth'
import { useGroup } from '@/src/providers/Group'
import { TrashIcon } from '@heroicons/react/20/solid'
import { set } from 'nprogress'
import React, { useEffect, useMemo, useRef, useState } from 'react'

const AddMemberBlock = ({ groupId, getMembers, members }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [newValue, setNewValue] = useState([])
    const membersToAdd = useRef([])
    const users = useFetch({ method: "GET", url: "/api/users", get_autoFetch: true })
    const addMember = useFetch({ method: "POST", url: `/api/members/${groupId}` })
    const availableMembers = () => {
        if (!users.data || !members) return []
        if (Array.isArray(users.data) && users.data.length == 0) return [];
        if (Array.isArray(members) && members.length === 0) return users.data;
        return users.data.filter((user) => !members.find((member) => member.uid === user.uid))
    }


    const onModalClose = () => {
        setModalOpen(prev => !prev)
    }
    const onOptionChange = (values) => {
        console.log(values)
        membersToAdd.current = values
    }
    const handleAddMember = async () => {
        if (membersToAdd.current.length === 0) return;
        const emailToUidMapper = users.data.reduce((acc, curr) => {
            acc[curr.email] = curr.uid;
            return acc;
        }, {})
        const updatedMembers = membersToAdd.current.map((item) => (emailToUidMapper[item.value]))
        console.log(updatedMembers)
        const { data, error } = await addMember.dispatch({ members: updatedMembers })
        if (error) {
            console.log(error)
            return
        }
        if (data) {
            await getMembers()
            onModalClose()
        }
    }

    return (
        <>
            <Modal open={modalOpen} onClose={onModalClose} >
                <Layout.Col className="gap-4 p-4 h-screen lg:min-w-[500px]">
                    <CustomComboBox placeholder="Select Members" list={availableMembers().map(member => ({ value: member.email, displayValue: member.name }))} onChange={onOptionChange} multiple={true} />
                    <Button className="btn-primary" loading={addMember.loading} onClick={handleAddMember}>Add</Button>
                </Layout.Col>
            </Modal>
            <Button className="btn-primary" loading={addMember.loading} onClick={onModalClose} >Add</Button>
        </>
    )

}

const Wrapper = ({ children, groupId, getMembers, members }) => {
    const auth = useAuth();
    const ALLOWED_ROLES = [ROLES.TEACHER]
    const role = auth.data?.app_meta?.role;
    return (
        <Layout.Col className="p-4 gap-2 min-h-screen">
            {ALLOWED_ROLES.includes(role) && <Layout.Col className="sm:items-end"><AddMemberBlock groupId={groupId} getMembers={getMembers} members={members} /></Layout.Col>}
            {children}
        </Layout.Col>
    )
}

const RemoveMemberButton = ({ member, groupId, getMembers }) => {
    const removeMember = useFetch({ method: "DELETE", url: `/api/members/${groupId}/${member.id}` })
    const handleRemove = async () => {
        const { data, error } = await removeMember.dispatch();
        if (error) {
            console.log(error)
            return
        }
        if (data) {
            await getMembers()
        }
    }
    return <Button onClick={handleRemove} className="btn-icon flex-1" loading={removeMember.loading}><TrashIcon width={16} height={16} className="text-red-500" /></Button>

}

const GroupMembersBlock = ({ groupId }) => {
    const group = useGroup()
    const auth = useAuth();
    const { id: currentUserId } = auth.data
    const members = useFetch({ method: "GET", url: `/api/members/${groupId}`, get_autoFetch: true })

    if (members.loading) return <Wrapper><LoaderElement /></Wrapper>
    if (members.error) return <Wrapper>error loading members</Wrapper>
    if (!members.data) return <Wrapper><EmptyElement /></Wrapper>

    return (
        <Wrapper getMembers={members.dispatch} members={members.data} groupId={groupId}>
            <Layout.Col>
                <Layout.Col className="divide-y">
                    {members.data.map((member, index) => (
                        <Layout.Row key={`member-${index}`} className="gap-2 py-2 items-center justify-between max-w-md">
                            <Layout.Row className="items-center gap-1 flex-1">
                                <Avatar seed={member.name} />
                                <Layout.Col className="overflow-hidden">
                                    <Typography.Caption className="capitalize font-semibold line-clamp-1">{member.name}</Typography.Caption>
                                    <Typography.Caption className="line-clamp-1">{member.email}</Typography.Caption>
                                </Layout.Col>
                            </Layout.Row>
                            {currentUserId === group.owner && <RemoveMemberButton member={member} groupId={groupId} getMembers={members.dispatch} />}
                        </Layout.Row>
                    ))}
                </Layout.Col>
            </Layout.Col>
        </Wrapper>
    )
}

export default GroupMembersBlock