import supabaseBrowser from '@/src/services/supabase-browser'
import React, { useEffect, useState } from 'react'
import Button from '../../ui/Button'
import { useGroup } from '@/src/providers/Group'
import { useAuth } from '@/src/providers/Auth'

import { toast } from 'react-toastify'
import Layout from '../../ui/Layout'
import Form from '../../ui/Form'
import Input from '../../ui/Form/Input'
import { Send } from 'lucide-react'
import useFetch from '@/src/hooks/general/useFetch'
import Avatar from '../../elements/Avatar'
import Typography from '../../ui/Typography'

const ChatHead = ({ message, currentUserId }) => {
    console.log(message.sent_by)
    if (message.sent_by.uid === currentUserId) return (<Layout.Row className="justify-end">
        <Layout.Col className="overflow-hidden max-w-[50%]">
            <Typography.Body className="bg-primary text-white p-2 rounded-md break-all">
                {message.payload}
            </Typography.Body>
        </Layout.Col>
    </Layout.Row>)
    return (<Layout.Row className="justify-start items-center gap-2 overflow-hidden">
        <Avatar seed={message.sent_by?.name || "user"} />
        <Layout.Col className="overflow-hidden max-w-[50%]">
            <Typography.Body className="bg-secondary text-black p-2 rounded-md overflow-hidden break-all">
                {message.payload}
            </Typography.Body>
        </Layout.Col>
    </Layout.Row>)
}

const GroupDiscussions = () => {
    const auth = useAuth();
    const userId = auth.data?.id
    const [messages, setMessages] = useState([])
    const [membersMap, setMembersMap] = useState({})
    const group = useGroup()
    const membersList = useFetch({ method: "GET", url: `/api/members/${group.id}`, get_autoFetch: false })
    const onSubmit = async (body) => {
        const { data, error } = await supabaseBrowser.from('messages').insert({
            payload: btoa(body.payload),
            group_id: group.id,
            sent_by: userId
        }).select("*").single()
        if (error) {
            console.log(error)
            toast.error("unable to send message")
        }
        if (data) {
            setMessages(prev => [...prev, { ...data[0], payload: body.payload, sent_by: { name: auth.data.app_meta.name, uid: userId } }])
        }

    }
    useEffect(() => {
        const getMessages = async () => {
            const currentUser = {
                uid: auth.data.id,
                email: auth.data.email,
                name: auth.data.app_meta.name,
                role: auth.data.app_meta.role
            }
            const initialUser = currentUser.uid === group.users?.uid ? currentUser : group.users

            const { data, error } = await membersList.dispatch()
            const currentMembersMap = await data.reduce((acc, member) => {
                acc[member.uid] = member
                return acc
            }, { [initialUser.uid]: initialUser })
            if (currentMembersMap) {
                const { data } = await supabaseBrowser.from('messages').select("*").eq('group_id', group.id)
                if (data.length === 0) return
                const currentMessages = data.map(message => ({
                    ...message,
                    payload: atob(message.payload),
                    sent_by: { name: currentMembersMap[message.sent_by]?.name, uid: message.sent_by },
                }))
                setMessages(currentMessages)
                setMembersMap(currentMembersMap)
            }
        }
        getMessages()
    }, [])
    useEffect(() => {
        const subscribe = async () => {
            const { id } = group;
            const channel = `group_discussion_chat:${id}`
            supabaseBrowser.channel(channel)
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'messages' },
                    (payload) => {
                        if (payload.new.group_id === id && payload.new.sent_by !== userId) {
                            setMessages(prev => [...prev,
                            { ...payload.new, payload: atob(payload.new.payload), sent_by: { name: membersMap[payload.new.sent_by]?.name, uid: payload.sent_by } }])
                        }
                    }
                )
                .subscribe()
        }
        if (userId && membersMap && Object.keys(membersMap).length > 0)
            subscribe()

    }, [membersMap, userId])
    console.log(group, "group")
    return (
        <>
            <Layout.Col className="w-full h-full relative overflow-y-auto mx-auto container max-w-lg pb-2 pt-2 px-2 md:px-0">
                <Layout.Col className="gap-2 overflow-hidden">
                    {messages && messages.map((message, index) => (<ChatHead message={message} currentUserId={userId} key={`message-${index}`} />))}
                </Layout.Col>
            </Layout.Col>
            <Layout.Col className="sticky w-full left-0 right-0 bottom-0 bg-white border-t">
                <Form onSubmit={onSubmit}>
                    <Layout.Row className="p-2 border-t max-w-lg mx-auto container">
                        <Input name="payload" required className="flex-grow" placeholder="Enter message..." />
                        <Button type="submit" className="btn-icon flex-shrink"><Send /></Button>
                    </Layout.Row>
                </Form>
            </Layout.Col>
        </>
    )
}

export default GroupDiscussions