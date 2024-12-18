import { useState, useEffect } from 'react';
import Header from './components/Header';
import NotesWidget from './components/NotesWidget';
import CalendarEvents from './components/CalendarEvents';
import MediaPlayer from './components/MediaPlayer';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { notesService } from './services/notesService';
import Callback from './components/Callback';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchNotes();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const fetchedNotes = await notesService.getAllNotes();
      setNotes(fetchedNotes);
      console.log(fetchedNotes);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      try {
        setIsLoading(true);
        const savedNote = await notesService.addNote(newNote.trim());
        setNotes([...notes, savedNote]);
        setNewNote('');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      setIsLoading(true);
      await notesService.deleteNote(id);
      setNotes(notes.filter(note => note._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const mockEvents = [
    { title: 'Daily Standup', time: '10:00 AM' },
    { title: 'Client Meeting', time: '2:00 PM' },
    { title: 'Code Review', time: '4:00 PM' },
  ];

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 p-8 transition-all duration-500">
          <div className="max-w-8xl mx-auto space-y-8">
            {/* Navbar with glass effect */}
            <div className="backdrop-blur-sm bg-white/30 rounded-xl shadow-lg mb-8">
              <Navbar />
            </div>

            <Routes>
              <Route path="/callback" element={<Callback />} />
              <Route path="/login" element={
                <div className="backdrop-blur-sm bg-white/40 rounded-xl p-8 shadow-lg max-w-md mx-auto">
                  <Login />
                </div>
              } />
              <Route path="/register" element={
                <div className="backdrop-blur-sm bg-white/40 rounded-xl p-8 shadow-lg max-w-md mx-auto">
                  <Register />
                </div>
              } />
              
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <div className="space-y-8">
                      <div className="backdrop-blur-sm bg-white/30 rounded-xl p-6 shadow-lg">
                        <Header currentTime={currentTime} />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="backdrop-blur-sm bg-white/40 rounded-xl p-6 shadow-lg transition-transform hover:scale-[1.02]">
                          <NotesWidget 
                            notes={notes} 
                            newNote={newNote} 
                            setNewNote={setNewNote} 
                            handleAddNote={handleAddNote} 
                            handleDeleteNote={handleDeleteNote}
                            isLoading={isLoading}
                            error={error}
                          />
                        </div>
                        
                        <div className="backdrop-blur-sm bg-white/40 rounded-xl p-6 shadow-lg transition-transform hover:scale-[1.02]">
                          <CalendarEvents mockEvents={mockEvents} />
                        </div>
                        
                        <div className="backdrop-blur-sm bg-white/40 rounded-xl p-6 shadow-lg transition-transform hover:scale-[1.02]">
                          <MediaPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
                        </div>
                      </div>
                    </div>
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
