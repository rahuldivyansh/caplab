import EmptyElement from '@/src/components/elements/Empty'
import { LoaderElement } from '@/src/components/elements/Loaders'
import Button from '@/src/components/ui/Button'
import Layout from '@/src/components/ui/Layout'
import Modal from '@/src/components/ui/Modal'
import Typography from '@/src/components/ui/Typography'
import useFetch from '@/src/hooks/general/useFetch'
import React, { useState } from 'react'

const AddMemberBlock = ({ groupId, getMembers }) => {
    const [modalOpen, setModalOpen] = useState(false)
    const onModalClose = () => {
        setModalOpen(prev => !prev)
    }
    const addMember = useFetch({ method: "POST", url: `/api/members/${groupId}` })
    return (
        <>
            <Modal open={modalOpen} onClose={onModalClose}>
                add member
            </Modal>
            <Button className="btn-primary" loading={addMember.loading} onClick={onModalClose}>Add</Button>
        </>
    )

}

const Wrapper = ({ children, groupId, getMembers }) => {
    return (
        <Layout.Col className="p-4 gap-2 min-h-screen">
            <Layout.Col className="sm:items-end"><AddMemberBlock groupId={groupId} getMembers={getMembers} /></Layout.Col>
            {children}
        </Layout.Col>
    )
}

const GroupMembersBlock = ({ groupId }) => {
    const members = useFetch({ method: "GET", url: `/api/members/${groupId}`, get_autoFetch: true })
    if (members.loading) return <Wrapper><LoaderElement /></Wrapper>
    if (members.error) return <Wrapper>error loading members</Wrapper>
    if (members.data === null) return <Wrapper><EmptyElement /></Wrapper>
    return (
        <Wrapper getMembers={members.dispatch}>
            <Layout.Col>
                <Layout.Row className="gap-4">
                    {members.data.map((member, index) => (
                        <Layout.Col key={`member-${index}`} className="gap-2">
                            <Typography.Caption>{member.name}</Typography.Caption>
                            <Typography.Caption>{member.email}</Typography.Caption>
                        </Layout.Col>
                    ))}
                </Layout.Row>
            </Layout.Col>
        </Wrapper>
    )
}

export default GroupMembersBlock