//components/NotesWidget.js
import { useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';

function NotesWidget({ notes, handleAddNote, handleDeleteNote, isLoading, error }) {
  const [newNote, setNewNote] = useState('');

  const handleAddNoteInternal = () => {
    handleAddNote(newNote);
    setNewNote('');
  };

  if (error) {
    return <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Notes</h2>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-50 placeholder-gray-400 transition-all"
          placeholder="Add a note..."
          disabled={isLoading}
          onKeyDown={(e) => e.key === 'Enter' && handleAddNoteInternal()}
        />
        <button
          onClick={handleAddNoteInternal}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded-lg transition-colors min-w-[60px]"
          disabled={isLoading || !newNote.trim()}
        >
          <FiPlus />
        </button>
      </div>
      {isLoading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <ul className="overflow-y-auto max-h-96 space-y-3">
          {notes.map((note) => (
            <li key={note._id} className="flex items-start justify-between bg-gray-50 p-4 rounded-lg group">
              <span className="break-words text-gray-700">{note.content}</span>
              <button
                onClick={() => handleDeleteNote(note._id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-3 px-2"
              >
                <FiX />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotesWidget;