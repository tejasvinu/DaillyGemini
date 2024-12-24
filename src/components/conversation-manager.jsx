import { useState, useEffect } from 'react'

// Simple Button component
const Button = ({ children, onClick, className, variant }) => {
    const baseStyles = "px-4 py-2 rounded-md"
    const variantStyles = variant === "ghost" 
        ? "hover:bg-gray-200 text-gray-700" 
        : "bg-blue-500 text-white hover:bg-blue-600"

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles} ${className || ''}`}
        >
            {children}
        </button>
    )
}

// Simple ScrollArea component
const ScrollArea = ({ children, className }) => {
    return (
        <div className={`overflow-y-auto ${className || ''}`}>
            {children}
        </div>
    )
}

export function ConversationManager({ onNewChat, onLoadConversation }) {
        const [conversations, setConversations] = useState([])

        useEffect(() => {
                const storedConversations = localStorage.getItem('conversations')
                if (storedConversations) {
                        setConversations(JSON.parse(storedConversations))
                }
        }, [])

        const handleLoadConversation = (conversation) => {
                onLoadConversation(conversation)
        }

        return (
                <div className="w-64 bg-gray-100 p-4">
                        <Button onClick={onNewChat} className="w-full mb-4">New Chat</Button>
                        <ScrollArea className="h-[calc(100vh-8rem)]">
                                {conversations.map((conversation) => (
                                        <Button
                                                key={conversation.id}
                                                onClick={() => handleLoadConversation(conversation)}
                                                variant="ghost"
                                                className="w-full justify-start mb-2 overflow-hidden"
                                        >
                                                {conversation.name}
                                        </Button>
                                ))}
                        </ScrollArea>
                </div>
        )
}
