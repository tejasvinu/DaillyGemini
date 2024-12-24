import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { chatService } from '../services/chatService';

// Custom Card components
const Card = ({ children, className = '' }) => (
  <div className={`bg-gray-800 rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`p-4 border-b border-gray-700 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-xl font-semibold text-white">{children}</h2>
);

// Custom Select components
const Select = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {children({ isOpen, setIsOpen, value, onValueChange })}
    </div>
  );
};

const SelectTrigger = ({ children, className = '' }) => (
  <button
    className={`flex items-center justify-between p-2 bg-gray-700 rounded-md text-white hover:bg-gray-600 ${className}`}
    onClick={() => setIsOpen(!isOpen)}
  >
    {children}
  </button>
);

const SelectContent = ({ children, isOpen }) => (
  isOpen && (
    <div className="absolute z-50 w-full mt-1 bg-gray-700 rounded-md shadow-lg">
      {children}
    </div>
  )
);

const SelectItem = ({ value, children, onSelect }) => (
  <div
    className="px-3 py-2 text-white hover:bg-gray-600 cursor-pointer"
    onClick={() => onSelect(value)}
  >
    {children}
  </div>
);

const SelectValue = ({ value, placeholder, assistantTypes }) => {
  const selectedType = assistantTypes.find(type => type.id === value);
  return (
    <span className="text-white">
      {selectedType ? selectedType.name : placeholder}
    </span>
  );
};

// Message component
const Message = ({ message, isUser }) => (
  <div className={`flex items-start mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
    <div className={`rounded-lg p-3 max-w-[80%] ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-white'}`}>
      {message.content}
    </div>
  </div>
);

const assistantTypes = [
  { id: 'tutor', name: 'Tutor' },
  { id: 'chill', name: 'Chill' }
];

// ConversationManager component
const ConversationManager = ({ onNewChat, onLoadConversation }) => (
  <div className="w-64 bg-gray-800 p-4 border-r border-gray-700 hidden md:block">
    <button
      onClick={onNewChat}
      className="w-full mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
    >
      New Chat
    </button>
  </div>
);

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState({
    id: uuidv4(),
    name: 'New Conversation',
    messages: [],
    assistantType: 'tutor'
  });
  const scrollAreaRef = useRef(null);

  // Load conversations from localStorage on initial render
  useEffect(() => {
    const storedConversations = localStorage.getItem('conversations');
    if (storedConversations) {
      const parsed = JSON.parse(storedConversations);
      setConversations(parsed);
      if (parsed.length > 0) {
        setCurrentConversation(parsed[0]);
        setMessages(parsed[0].messages);
      }
    }
  }, []);

  // Update current conversation when messages change
  useEffect(() => {
    if (currentConversation) {
      const updatedConversation = {
        ...currentConversation,
        messages: messages
      };
      saveConversation(updatedConversation);
    }
  }, [messages]);

  const saveConversation = (conversation) => {
    const updatedConversations = conversations.map(c =>
      c.id === conversation.id ? conversation : c
    );
    if (!updatedConversations.some(c => c.id === conversation.id)) {
      updatedConversations.push(conversation);
    }
    setConversations(updatedConversations);
    localStorage.setItem('conversations', JSON.stringify(updatedConversations));
  };

  const handleNewChat = () => {
    const newConversation = {
      id: uuidv4(),
      name: `New Conversation ${conversations.length + 1}`,
      messages: [],
      assistantType: 'tutor'
    };
    setCurrentConversation(newConversation);
    setMessages([]);
    saveConversation(newConversation);
  };

  const handleLoadConversation = (conversation) => {
    setCurrentConversation(conversation);
    setMessages(conversation.messages);
  };

  const handleAssistantTypeChange = (value) => {
    setCurrentConversation(prev => ({ ...prev, assistantType: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      const data = await chatService.sendMessage(
        input, 
        messages, 
        currentConversation.assistantType
      );
      const newMessages = [...updatedMessages, { role: 'model', content: data.response }];
      setMessages(newMessages);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-gray-900 overflow-hidden">
      <ConversationManager
        onNewChat={handleNewChat}
        onLoadConversation={handleLoadConversation}
      />
      <Card className="flex-1 flex flex-col max-h-full m-2 md:m-4">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4">
          <CardTitle className="text-lg sm:text-xl">{currentConversation.name}</CardTitle>
          <Select value={currentConversation.assistantType} onValueChange={handleAssistantTypeChange}>
            {({ isOpen, setIsOpen, value, onValueChange }) => (
              <div className="relative">
                <button
                  className="w-[180px] flex items-center justify-between p-2 bg-gray-700 rounded-md text-white hover:bg-gray-600"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <SelectValue 
                    value={value} 
                    placeholder="Select assistant type"
                    assistantTypes={assistantTypes}
                  />
                  <span className="ml-2">▼</span>
                </button>
                <SelectContent isOpen={isOpen}>
                  {assistantTypes.map((type) => (
                    <SelectItem 
                      key={type.id} 
                      value={type.id}
                      onSelect={(value) => {
                        onValueChange(value);
                        setIsOpen(false);
                      }}
                    >
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </div>
            )}
          </Select>
        </CardHeader>
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
          ref={scrollAreaRef}
        >
          {messages.map((message, index) => (
            <Message key={index} message={message} isUser={message.role === 'user'} />
          ))}
        </div>
        <form 
          onSubmit={handleSubmit} 
          className="p-4 border-t border-gray-700 flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg bg-gray-700 p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </Card>
    </div>
  );
}

export default Chatbot;