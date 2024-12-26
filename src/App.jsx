// App.js
import React, { useState, useEffect, createContext, useContext } from 'react';
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
import Googlecallback from './components/googlecallback';
import MailsWidget from './components/MailsWidget';
import UserInfoWidget from './components/UserInfoWidget';
import Chatbot from './components/Chatbot';
import FloatingAssistant from './components/FloatingAssistant';
import Learning from './components/Learning';
import AdventureGame from './components/AdventureGame';

const ThemeContext = createContext();

const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPrefs = window.localStorage.getItem('color-theme');
    if (typeof storedPrefs === 'string') {
      return storedPrefs;
    }
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    if (userMedia.matches) {
      return 'dark';
    }
  }
  return 'light';
};

export const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  const rawSetTheme = (rawTheme) => {
    const root = window.document.documentElement;
    const isDark = rawTheme === 'dark';
    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(rawTheme);
    localStorage.setItem('color-theme', rawTheme);
  };

  useEffect(() => {
    rawSetTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

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

  const handleUpdateNote = async (id, status) => {
    try {
      setIsLoading(true);
      const updatedNote = await notesService.updateNote(id, status);
      setNotes(notes.map(note => note._id === id ? updatedNote : note));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-black text-white font-sans">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-8 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/callback" element={<Callback />} />
                <Route path="/googlecallback" element={<Googlecallback />} />
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
                        handleUpdateNote={handleUpdateNote}
                        isLoading={isLoading}
                        error={error}
                      />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/chatbot"
                  element={
                    <PrivateRoute>
                      <div className="h-[calc(100vh-6rem)]">
                        <Chatbot />
                      </div>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/advent"
                  element={
                    <PrivateRoute>
                      <div className="min-h-[calc(100vh-6rem)]">
                        <AdventureGame />
                      </div>
                    </PrivateRoute>
                  }
                />
                <Route path="/learning" element={<Learning />} />
              </Routes>
            </div>
            <FloatingAssistant />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Helper component for Login and Register routes
const AuthCard = ({ element }) => (
  <div className="my-12 bg-gray-800/50 rounded-xl p-8 shadow-2xl max-w-md mx-auto">
    {element}
  </div>
);

// Dashboard component
const Dashboard = ({ currentTime, notes, handleAddNote, handleDeleteNote, handleUpdateNote, isLoading, error }) => (
  <div className="space-y-6 md:space-y-8">
    <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-xl">
      <Header currentTime={currentTime} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
      <WidgetCard>
        <UserInfoWidget />
      </WidgetCard>
      <WidgetCard>
        <NotesWidget
          notes={notes}
          handleAddNote={handleAddNote}
          handleDeleteNote={handleDeleteNote}
          handleUpdateNote={handleUpdateNote}
          isLoading={isLoading}
          error={error}
        />
      </WidgetCard>
      <WidgetCard>
        <CalendarEvents />
      </WidgetCard>
      <WidgetCard className="md:col-span-2 lg:col-span-1">
        <MediaPlayer />
      </WidgetCard>
      <WidgetCard>
        <MailsWidget />
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