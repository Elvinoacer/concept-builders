'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const initialMessages = [
    { id: 1, author: 'Support Team', text: 'Hello! Welcome to Concept Builders support. How can we help you today?', time: '10:30 AM', avatar: '/images/concept-builders-logo-free-bg.png' },
    { id: 2, author: 'You', text: 'Hi, I have a question about modifying a plan.', time: '10:31 AM' },
    { id: 3, author: 'Support Team', text: 'Of course! I can help with that. Which plan are you interested in?', time: '10:32 AM', avatar: '/images/concept-builders-logo-free-bg.png' },
];

const SupportChatPage = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const userMessage = {
            id: messages.length + 1,
            author: 'You',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages([...messages, userMessage]);
        setNewMessage('');

        // Simulate a support reply
        setTimeout(() => {
            const supportReply = {
                id: messages.length + 2,
                author: 'Support Team',
                text: 'Thank you for your message. An agent will be with you shortly to discuss the modifications.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                avatar: '/images/concept-builders-logo-free-bg.png'
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
                                    className={`flex items-end gap-3 ${msg.author === 'You' ? 'justify-end' : ''}`}
                                >
                                    {msg.author !== 'You' && (
                                        <Image src={msg.avatar} alt={msg.author} width={32} height={32} className="rounded-full self-start" />
                                    )}
                                    <div className={`max-w-md p-3 rounded-2xl ${msg.author === 'You' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <p className={`text-xs mt-1 opacity-70 ${msg.author === 'You' ? 'text-blue-100' : ''}`}>{msg.time}</p>
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
