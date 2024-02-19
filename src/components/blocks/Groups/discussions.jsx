import supabaseBrowser from '@/src/services/supabase-browser'
import React, { useEffect, useState } from 'react'
import Button from '../../ui/Button'

const GroupDiscussions = () => {
    const [messages, setMessages] = useState([])
    const addMessage = async () => {
        await supabaseBrowser.from('messages').insert({
            payload: `new message at ${Date.now()}`
        })
    }
    useEffect(() => {
        const subscribe = async () => {
            const subscribe = supabaseBrowser.channel('custom-insert-channel')
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'messages' },
                    (payload) => {
                        setMessages(prev => [...prev, payload.new])
                    }
                )
                .subscribe()
        }
        const getMessages = async () => {
            const { data } = await supabaseBrowser.from('messages').select()
            setMessages(data)
        }
        subscribe()
        getMessages()
    }, [])
    return (
        <div>
            <Button onClick={addMessage}>add</Button>
            <div>
                {messages.map((message, index) => <p key={index}>{message.payload}</p>)}
            </div>
        </div>
    )
}

export default GroupDiscussions