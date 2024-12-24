import React from 'react';
import { useNavigate } from 'react-router-dom';

function FloatingAssistant() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/chatbot')}
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center z-50 group"
      aria-label="Open Assistant"
    >
      <svg 
        className="w-7 h-7 text-white" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
      <span className="absolute right-16 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Open Assistant
      </span>
    </button>
  );
}

export default FloatingAssistant;
