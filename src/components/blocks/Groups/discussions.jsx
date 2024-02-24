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
import moment from 'moment'
import { decrypt, encrypt } from '@/src/utils/security/encryption'

const ChatHead = ({ message, currentUserId }) => {
    const [showMoreInfo, setShowMoreInfo] = useState(false)
    const toggleShowMoreInfo = () => setShowMoreInfo(prev => !prev)
    if (message.sent_by.uid === currentUserId) return (<Layout.Col className="justify-end items-end w-full">
        <Layout.Row className="overflow-hidden max-w-[50%] items-end" onClick={toggleShowMoreInfo}>
            <Typography.Body className="bg-primary text-white p-2 rounded-t rounded-bl break-all">
                {message.payload}
            </Typography.Body>
            <div className="border-solid rounded-bl border-t-primary border-t-[12px] border-l-transparent border-r-primary border-r-0 rotate-180 border-l-[12px] border-b-0" />
        </Layout.Row>
        {showMoreInfo && <Typography.Caption className="text-right text-gray-500 text-xs">{moment(message.created_at).format("MMMM Do YYYY, h:mm a")}</Typography.Caption>}
    </Layout.Col>)
    return (<Layout.Row className="justify-start items-start overflow-hidden">
        <Avatar seed={message.sent_by?.name || "user"} dimensions={[24, 24]} />
        <div className="border-solid border-t-secondary border-t-[12px] border-l-transparent border-r-secondary border-r-0 border-l-[12px] border-b-0" />
        <Layout.Col className="overflow-hidden max-w-[50%] items-start" onClick={toggleShowMoreInfo}>
            <Typography.Body className="bg-secondary text-black p-2 rounded-b rounded-tr overflow-hidden break-all">
                {message.payload}
            </Typography.Body>
            {showMoreInfo && <Typography.Caption className="text-left text-gray-500 text-xs">{moment(message.created_at).format("MMMM Do YYYY, h:mm a")}</Typography.Caption>}
        </Layout.Col>
    </Layout.Row>)
}

const GroupDiscussions = () => {
    const auth = useAuth();
    const userId = auth.data?.id
    const [messages, setMessages] = useState([])
    const [currentMessage, setCurrentMessage] = useState("")
    const [membersMap, setMembersMap] = useState({})
    const group = useGroup()
    const membersList = useFetch({ method: "GET", url: `/api/members/${group.id}`, get_autoFetch: false })
    const onMessageChange = (e) => {
        console.log(e.target.value)
        setCurrentMessage(e.target.value.trim());
    }
    const sendMessage = async () => {
        if (currentMessage.length === 0) return;
        const { data, error } = await supabaseBrowser.from('messages').insert({
            payload: encrypt(currentMessage),
            group_id: group.id,
            sent_by: userId
        }).select("*").single()
        if (error) {
            console.log(error)
            toast.error("unable to send message")
        }
        if (data) {
            setCurrentMessage("")
            window.scrollTo(0, document.body.scrollHeight)
            setMessages(prev => [...prev, { ...data[0], payload: currentMessage, sent_by: { name: auth.data.app_meta.name, uid: userId } }])
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
                    payload:decrypt( message.payload),
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
                            { ...payload.new, payload: decrypt(payload.new.payload), sent_by: { name: membersMap[payload.new.sent_by]?.name, uid: payload.sent_by } }])
                        }
                    }
                )
                .subscribe()
        }
        if (userId && membersMap && Object.keys(membersMap).length > 0)
            subscribe()

    }, [membersMap, userId])
    return (
        <>
            <Layout.Col className="w-full min-h-[50dvh] h-full relative overflow-y-scroll mx-auto container max-w-xl pb-2 pt-2 px-2 md:px-0">
                <Layout.Col className="gap-2">
                    {messages && messages.map((message, index) => (<ChatHead message={message} currentUserId={userId} key={`message-${index}`} />))}
                </Layout.Col>
            </Layout.Col>
            <Layout.Col className="sticky w-full left-0 right-0 bottom-0 bg-white border-t">
                <Form onSubmit={sendMessage}>
                    <Layout.Row className="p-2 max-w-xl mx-auto container gap-2 items-center">
                        <Input name="payload" value={currentMessage} onSubmit={sendMessage} onChange={onMessageChange} className="flex-grow flex-1 rounded-full font-semibold focus:ring-2 caret-primary  py-4" placeholder="Enter message..." />
                        <Button type="submit" className="aspect-square items-center justify-center text-white flex-shrink btn-primary rounded-full disabled:bg-white" disabled={currentMessage.length === 0}><Send width={20} height={20} /></Button>
                    </Layout.Row>
                </Form>
            </Layout.Col>
        </>
    )
}

export default GroupDiscussions