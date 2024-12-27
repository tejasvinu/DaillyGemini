import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import PropTypes from 'prop-types';
import { LoadingSpinner } from './Spinner';

function NotesWidget({ notes, handleAddNote, handleDeleteNote, handleUpdateNote, isLoading, error }) {
  const [newNote, setNewNote] = useState('');
  const [filter, setFilter] = useState(0); // 0: All, 1: Active, 2: Completed

  const handleAddNoteInternal = () => {
    if (!newNote.trim()) return;
    handleAddNote(newNote.trim());
    setNewNote('');
  };

  const handleDrag = (result) => {
    if (!result.destination) return;
    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    // handleReorderNotes(items);
  };

  const toggleStatus = (noteId) => {
    const note = notes.find(n => n._id === noteId);
    if (note) {
      const newStatus = note.status === 'active' ? 'completed' : 'active';
      handleUpdateNote(noteId, newStatus); // Updated to use handleUpdateNote
    }
  };

  const filteredNotes = notes.filter(note => 
    filter === 0 || 
    (filter === 1 && note.status === 'active') || 
    (filter === 2 && note.status === 'completed')
  );

  if (error) {
    return <div className="bg-red-900/20 text-red-400 p-3 rounded-lg text-sm">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-7xl px-2 md:px-4 lg:px-6 mx-auto">
      <div className="w-full rounded-2xl shadow-xl relative bg-gray-800">
        <div className="absolute inset-2 bg-gray-800 rounded-xl" />
        <div className="relative h-full p-4 md:p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Tasks & Notes
            </h2>
            <div className="flex gap-3 text-sm">
              {['All', 'Active', 'Completed'].map((label, i) => (
                <button
                  key={label}
                  onClick={() => setFilter(i)}
                  className={`transition-colors duration-200
                    ${i === filter 
                      ? 'text-blue-400 font-medium' 
                      : 'text-gray-400 hover:text-blue-400'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 p-3 rounded-lg transition-all duration-200
                bg-gray-700 border-gray-600 text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a task or note..."
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNoteInternal()}
            />
            <button
              onClick={handleAddNoteInternal}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 
                       text-white p-3 rounded-lg transition-colors duration-200"
              disabled={isLoading || !newNote.trim()}
            >
              <FiPlus />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <LoadingSpinner label="Getting your Notes..." />
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDrag}>
              <Droppable droppableId="notes">
                {(provided) => (
                  <ul 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className="overflow-y-auto max-h-96 space-y-3"
                  >
                    {filteredNotes.map((note, index) => (
                      <Draggable key={note._id} draggableId={note._id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center justify-between p-3 rounded-lg
                              group transition-all duration-200 hover:shadow-md
                              bg-gray-700 border border-gray-600"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <button
                                onClick={() => toggleStatus(note._id)}
                                className="transition-colors duration-200
                                  text-gray-400 hover:text-blue-400"
                              >
                                {note.status === 'active' ? '⚪' : '✔️'}
                              </button>
                              <span className={`break-words cursor-pointer transition-all duration-200
                                ${note.status === 'completed'
                                  ? 'text-gray-400 line-through'
                                  : 'text-gray-200'}`}>
                                {note.content}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteNote(note._id)}
                              className="opacity-0 group-hover:opacity-100 
                                       text-gray-400 hover:text-red-500
                                       transition-all duration-200 ml-3"
                            >
                              <FiTrash2 />
                            </button>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );
}

NotesWidget.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  })).isRequired,
  handleAddNote: PropTypes.func.isRequired,
  handleDeleteNote: PropTypes.func.isRequired,
  handleUpdateNote: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

export default NotesWidget;