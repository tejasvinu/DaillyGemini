// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { notesService } from './services/notesService';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Header from './components/Header';
import NotesWidget from './components/NotesWidget';
import CalendarEvents from './components/CalendarEvents';
import MediaPlayer from './components/MediaPlayer';
import Login from './components/Login';
import Register from './components/Register';
import Callback from './components/Callback';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async (newNote) => {
      if (newNote.trim()) {
          try {
              setIsLoading(true);
              const savedNote = await notesService.addNote(newNote.trim());
              setNotes([...notes, savedNote]);
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
      setNotes(notes.filter((note) => note._id !== id));
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
          <Navbar />
          <div className="container mx-auto px-4 pt-20 pb-8 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/callback" element={<Callback />} />
              <Route
                path="/login"
                element={<AuthCard element={<Login />} />}
              />
              <Route
                path="/register"
                element={<AuthCard element={<Register />} />}
              />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard
                      currentTime={currentTime}
                      notes={notes}
                      handleAddNote={handleAddNote}
                      handleDeleteNote={handleDeleteNote}
                      isLoading={isLoading}
                      error={error}
                      mockEvents={mockEvents}
                    />
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

// Helper component for Login and Register routes
const AuthCard = ({ element }) => (
  <div className="my-12 bg-gray-800/50 rounded-xl p-8 shadow-2xl max-w-md mx-auto">
    {element}
  </div>
);

// Dashboard component
const Dashboard = ({ currentTime, notes, handleAddNote, handleDeleteNote, isLoading, error, mockEvents }) => (
  <div className="space-y-6 md:space-y-8">
    <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-xl">
      <Header currentTime={currentTime} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      <WidgetCard>
        <NotesWidget
          notes={notes}
          handleAddNote={handleAddNote}
          handleDeleteNote={handleDeleteNote}
          isLoading={isLoading}
          error={error}
        />
      </WidgetCard>
      <WidgetCard>
        <CalendarEvents mockEvents={mockEvents} />
      </WidgetCard>
      <WidgetCard className="md:col-span-2 lg:col-span-1">
        <MediaPlayer />
      </WidgetCard>
    </div>
  </div>
);

// Widget Card component
const WidgetCard = ({ children, className = '' }) => (
  <div className={`bg-gray-800/50 rounded-xl p-4 md:p-6 shadow-xl transition-transform hover:scale-[1.02] ${className}`}>
    {children}
  </div>
);

export default App;