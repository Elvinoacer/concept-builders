'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { initialChatMessages, Message } from '@/lib/dummydata';

const SupportChatPage = () => {
    const [messages, setMessages] = useState<Message[]>(initialChatMessages);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const userMessage: Message = {
            id: messages.length + 1,
            type: 'sent',
            sender: {
                name: 'You',
                avatar: ''
            },
            content: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, userMessage]);
        setNewMessage('');

        // Simulate a support reply
        setTimeout(() => {
            const supportReply: Message = {
                id: messages.length + 2,
                type: 'received',
                sender: {
                    name: 'Support Team',
                    avatar: '/images/concept-builders-logo-free-bg.png'
                },
                content: 'Thank you for your message. An agent will be with you shortly to discuss the modifications.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, supportReply]);
        }, 1500);
    };

    return (
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 flex flex-col">
            <div className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-4xl h-[70vh] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
                    <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4">
                        <Image src="/images/concept-builders-logo-free-bg.png" alt="Support" width={40} height={40} className="rounded-full" />
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Live Support Chat</h1>
                            <p className="text-sm text-green-500 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </header>

                    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                        <AnimatePresence initial={false}>
                            {messages.map(msg => (
                                <motion.div
                                    key={msg.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    className={`flex items-end gap-3 ${msg.sender.name === 'You' ? 'justify-end' : ''}`}
                                >
                                    {msg.sender.name !== 'You' && (
                                        <Image src={msg.sender.avatar} alt={msg.sender.name} width={32} height={32} className="rounded-full self-start" />
                                    )}
                                    <div className={`max-w-md p-3 rounded-2xl ${msg.sender.name === 'You' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                        <p className="text-sm">{msg.content}</p>
                                        <p className={`text-xs mt-1 opacity-70 ${msg.sender.name === 'You' ? 'text-blue-100' : ''}`}>{msg.time}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <footer className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <Input
                                type="text"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" disabled={!newMessage.trim()}>
                                <span className="material-symbols-outlined">send</span>
                            </Button>
                        </form>
                    </footer>
                </div>
            </div>
        </main>
    );
};

export default SupportChatPage;
