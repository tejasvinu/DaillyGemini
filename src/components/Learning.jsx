import React, { useState, useEffect } from 'react';
import { cardService } from '../services/cardService';

// FlashCard component
function FlashCard({ question, answer }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-[320px] h-[400px] md:w-[600px] md:h-[400px] [perspective:1000px] mx-auto"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-all duration-500 ease-in-out [transform-style:preserve-3d] hover:shadow-2xl ${
        isFlipped ? '[transform:rotateY(180deg)]' : ''
      }`}>
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center">
          <span className="text-indigo-400 mb-4 text-sm">Question</span>
          <p className="text-3xl font-semibold text-gray-800 text-center leading-relaxed">{question}</p>
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-indigo-50 to-blue-100 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center [transform:rotateY(180deg)]">
          <span className="text-indigo-400 mb-4 text-sm">Answer</span>
          <p className="text-2xl text-gray-700 text-center leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

function CarouselControls({ onPrev, onNext, currentIndex, total }) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPrev, onNext]);

  return (
    <div className="w-full max-w-[320px] md:max-w-[600px] mx-auto mt-8">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between mb-4">
        <button
          onClick={onPrev}
          className="w-full sm:w-auto bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
        >
          <span className="text-xl">←</span>
          Previous
        </button>
        <button
          onClick={onNext}
          className="w-full sm:w-auto bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
        >
          Next
          <span className="text-xl">→</span>
        </button>
      </div>
      
      {/* Progress indicators */}
      <div className="flex justify-center gap-2">
        {[...Array(total)].map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'w-8 bg-indigo-600' 
                : 'w-2 bg-indigo-200'
            }`}
          />
        ))}
      </div>
      <div className="text-center mt-4 text-indigo-600 font-medium">
        Card {currentIndex + 1} of {total}
      </div>
    </div>
  );
}

// Modal component
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white/95 rounded-2xl p-4 sm:p-8 w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-end mb-4">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Learning() {
  const [cards, setCards] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [topic, setTopic] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  useEffect(() => {
    const savedFolders = JSON.parse(localStorage.getItem('folders') || '[]');
    setFolders(savedFolders);
    console.log('savedFolders:', savedFolders);
  }, []);

  const generateCards = async () => {
    try {
      const newCards = await cardService.createFlashCards(topic);
      if (newCards.length > 0) {
        const updatedFolders = [...folders, { name: topic, cards: newCards }];
        setFolders(updatedFolders);
        localStorage.setItem('folders', JSON.stringify(updatedFolders));
        setTopic('');
      }
    } catch (error) {
      console.error('Error in generateCards:', error);
      alert('Failed to generate cards. Please try again.');
    }
  };

  const sendMessage = async () => {
    if (!currentFolder || !chatMessage.trim()) return;

    const response = await cardService.chatWithAI(
      chatMessage,
      `These are flash cards about ${currentFolder.name}: ${JSON.stringify(currentFolder.cards)}`
    );

    setChatHistory([
      ...chatHistory,
      { role: 'user', content: chatMessage },
      { role: 'assistant', content: response }
    ]);
    setChatMessage('');
  };

  const handlePrevCard = () => {
    setCurrentCardIndex((prev) => 
      prev === 0 ? selectedCards.length - 1 : prev - 1
    );
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => 
      prev === selectedCards.length - 1 ? 0 : prev + 1
    );
  };

  const viewCards = (folder) => {
    setSelectedCards(folder.cards);
    setCurrentCardIndex(0);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-indigo-900 mb-6 sm:mb-8 text-center">
          AI Flash Cards
        </h1>
        
        {/* Generate Cards Section */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic for flash cards"
              className="w-full sm:w-64 p-3 border-2 text-black border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-400"
            />
            <button 
              onClick={generateCards}
              className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Generate Cards
            </button>
          </div>
        </div>

        {/* Folder Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {folders.map((folder, i) => (
            <div 
              key={i}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{folder.name}</h3>
              <div className="flex justify-between">
                <button 
                  onClick={() => viewCards(folder)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View Cards
                </button>
                <button 
                  onClick={() => setCurrentFolder(folder)}
                  className="text-green-600 hover:text-green-800"
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cards Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col items-center">
            {selectedCards.length > 0 && (
              <>
                <FlashCard
                  question={selectedCards[currentCardIndex].question}
                  answer={selectedCards[currentCardIndex].answer}
                />
                <CarouselControls
                  onPrev={handlePrevCard}
                  onNext={handleNextCard}
                  currentIndex={currentCardIndex}
                  total={selectedCards.length}
                />
              </>
            )}
          </div>
        </Modal>

        {/* Chat Interface */}
        {currentFolder && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-4 h-64 overflow-y-auto bg-gray-50 rounded-lg p-4">
              {chatHistory.map((msg, i) => (
                <div key={i} 
                  className={`mb-3 p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-indigo-100 ml-12' 
                      : 'bg-green-100 mr-12'
                  }`}
                >
                  <p className="text-gray-800">{msg.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about these cards..."
                className="flex-1 p-3 border-2 text-black border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400"
              />
              <button 
                onClick={sendMessage}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Learning;