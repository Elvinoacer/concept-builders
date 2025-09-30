import { Message } from ".";

export const initialChatMessages: Message[] = [
    {
        id: 1,
        type: 'received',
        sender: {
            name: 'Support Team',
            avatar: '/images/concept-builders-logo-free-bg.png'
        },
        content: 'Hello! Welcome to Concept Builders support. How can we help you today?',
        time: '10:30 AM'
    },
    {
        id: 2,
        type: 'sent',
        sender: {
            name: 'You',
            avatar: ''
        },
        content: 'Hi, I have a question about modifying a plan.',
        time: '10:31 AM'
    },
    {
        id: 3,
        type: 'received',
        sender: {
            name: 'Support Team',
            avatar: '/images/concept-builders-logo-free-bg.png'
        },
        content: 'Of course! I can help with that. Which plan are you interested in?',
        time: '10:32 AM'
    },
];
