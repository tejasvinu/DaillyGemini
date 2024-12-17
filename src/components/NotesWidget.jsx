import { FiX } from 'react-icons/fi';

function NotesWidget({ notes, newNote, setNewNote, handleAddNote, handleDeleteNote, isLoading, error }) {
  if (error) {
    return <div className="bg-red-100 p-4 rounded-xl">{error}</div>;
  }

  return (
    <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-orange-800 mb-4">Quick Notes</h2>
      <form onSubmit={handleAddNote} className="mb-4">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full p-2 border rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Add a note..."
          disabled={isLoading}
        />
      </form>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note._id} className="p-2 bg-white/60 rounded-lg text-orange-900 hover:bg-white/80 transition-colors flex justify-between items-center">
              <span>{note.content}</span>
              <button 
                onClick={() => handleDeleteNote(note._id)}
                className="text-orange-600 hover:text-orange-800"
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
