import { useState } from 'react';
import { LoadingSpinner } from './Spinner';

function GameSummary({ history, topic, onRestart, review }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-3xl font-bold text-black mb-6">Learning Journey Summary</h2>
      <p className="text-black font-medium mb-6">Topic: {topic}</p>
      
      <div className="mb-8">
        <div className="flex items-center mb-3">
          <h3 className="text-xl font-bold text-black">Overall Rating:</h3>
          <div className="ml-3 flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-2xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                ★
              </span>
            ))}
          </div>
        </div>
        <p className="text-black leading-relaxed">{review.overallReview}</p>
      </div>

      <div className="space-y-8">
        {history.map((item, index) => {
          const analysis = review.choiceAnalysis[index];
          return (
            <div key={index} className="border-l-4 border-blue-500 pl-6 py-2">
              <p className="text-black leading-relaxed mb-3">{item.story}</p>
              <p className="text-blue-700 font-medium mb-2">Your choice: {item.choice}</p>
              {analysis && (
                <p className="text-black italic leading-relaxed">{analysis.explanation}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-black mb-4">Suggested Related Topics:</h3>
        <div className="flex flex-wrap gap-3">
          {review.suggestedTopics.map((topic, index) => (
            <span key={index} className="bg-blue-100 text-blue-900 px-4 py-2 rounded-full font-medium">
              {topic}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="mt-8 w-full p-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
      >
        Start New Adventure
      </button>
    </div>
  );
}

function AdventureGame() {
  const [story, setStory] = useState('');
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [review, setReview] = useState(null);

  // API functions remain the same
  const startNewStory = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    setGameStarted(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/game/advent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          input: 'Start a new story',
          topic: selectedTopic 
        })
      });
      const data = await response.json();
      setStory(data.story);
      setChoices(data.choices);
    } catch (error) {
      console.error('Error starting story:', error);
    } finally {
      setLoading(false);
    }
  };

  const makeChoice = async (choice) => {
    setLoading(true);
    setGameHistory([...gameHistory, { story, choice }]);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/game/advent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          input: choice,
          topic: selectedTopic
        })
      });
      const data = await response.json();
      setStory(data.story);
      setChoices(data.choices);
    } catch (error) {
      console.error('Error making choice:', error);
    } finally {
      setLoading(false);
    }
  };

  const finishGame = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/game/advent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          topic: selectedTopic,
          history: gameHistory,
          isFinal: true
        })
      });
      const finalReview = await response.json();
      setReview(finalReview);
      setIsComplete(true);
    } catch (error) {
      console.error('Error finishing game:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setIsComplete(false);
    setStory('');
    setChoices([]);
    setGameHistory([]);
    setSelectedTopic('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-black mb-12 text-center">
          Educational Adventure
        </h1>

        {!gameStarted ? (
          <div className="bg-white shadow-lg rounded-xl p-8">
            <h2 className="text-3xl font-bold text-black mb-6">Choose Your Topic</h2>
            <input
              type="text"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              placeholder="e.g. French Revolution, Machine Learning, Ethics in AI..."
              className="w-full text-black p-4 border-2 border-gray-200 rounded-xl mb-6 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            />
            <button
              onClick={startNewStory}
              disabled={!selectedTopic.trim()}
              className="w-full p-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Begin Your Adventure
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center p-12">
            <LoadingSpinner label="Preparing your adventure..." />
          </div>
        ) : isComplete ? (
          <GameSummary 
            history={gameHistory}
            topic={selectedTopic}
            onRestart={resetGame}
            review={review}
          />
        ) : (
          <div className="bg-white shadow-lg rounded-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-black font-medium">Topic: {selectedTopic}</span>
              <div className="space-x-4">
                <button
                  onClick={finishGame}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Complete Journey
                </button>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Start Over
                </button>
              </div>
            </div>
            <div className="prose max-w-none mb-8">
              <p className="text-black leading-relaxed text-lg">{story}</p>
            </div>
            
            <div className="space-y-4">
              {choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => makeChoice(choice)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 text-black rounded-xl transition-colors border-2 border-transparent hover:border-blue-500"
                >
                  {choice}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdventureGame;