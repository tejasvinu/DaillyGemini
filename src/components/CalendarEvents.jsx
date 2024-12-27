// components/CalendarEvents.js
import { useState, useEffect } from 'react';
import { FiCalendar, FiRefreshCw, FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { calendarService } from '../services/CalendarService';
import Modal from './Modal';
import { LoadingSpinner } from './Spinner';

function EventDetailsModal({ event, onClose }) {
  if (!event) return null;

  return (
    <Modal onClose={onClose}>
      <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{event.summary}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded">
            <FiX className="text-xl" />
          </button>
        </div>
        
        <div className="space-y-3 text-gray-300">
          <div>
            <span className="text-gray-400">Time: </span>
            {new Date(event.start.dateTime || event.start.date).toLocaleString()}
          </div>
          <div>
            <span className="text-gray-400">Duration: </span>
            {new Date(event.end.dateTime).getHours() - new Date(event.start.dateTime).getHours()} hour(s)
          </div>
          <div>
            <span className="text-gray-400">Status: </span>
            <span className="capitalize">{event.status}</span>
          </div>
          <div>
            <span className="text-gray-400">Timezone: </span>
            {event.start.timeZone}
          </div>
          <div>
            <a 
              href={event.htmlLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              View in Google Calendar
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function CalendarEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const startAuth = async () => {
    setIsLoading(true);
    try {
      const { url } = await calendarService.getAuthUrl();
      window.location.href = url;
    } catch (err) {
      setError('Failed to start authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await calendarService.getEvents();
      console.log(data);
      setEvents(data);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('googleAuthToken')) {
      fetchEvents();
    }
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <FiCalendar className="mr-2" />
          Today's Schedule
        </div>
        {localStorage.getItem('googleAuthToken') && (
          <FiRefreshCw 
            className="cursor-pointer hover:rotate-180 transition-transform duration-500"
            onClick={fetchEvents}
          />
        )}
      </h2>
      
      {!localStorage.getItem('googleAuthToken') ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-400 mb-4">Connect your calendar to see events</p>
          <button 
            onClick={startAuth}
            disabled={isLoading}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center space-x-3 disabled:opacity-50 shadow-lg hover:shadow-xl"
          >
            <FcGoogle className="text-2xl" />
            <span>{isLoading ? 'Connecting...' : 'Connect Google Calendar'}</span>
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center p-12">
          <LoadingSpinner label="Getting your Events..." />
        </div>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li 
              key={event.id} 
              className="bg-gray-600 p-3 rounded-lg flex items-center justify-between hover:bg-gray-500 cursor-pointer transition"
              onClick={() => setSelectedEvent(event)}
            >
              <span className="font-medium">{event.summary}</span>
              <span className="text-sm text-gray-300">
                {new Date(event.start.dateTime || event.start.date).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </span>
            </li>
          ))}
          {events.length === 0 && (
            <li className="text-center py-4 text-gray-400">
              <p>No events scheduled for today</p>
              <button 
                onClick={fetchEvents}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300"
              >
                Refresh Calendar
              </button>
            </li>
          )}
        </ul>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-100 text-sm">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-300 hover:text-red-100"
          >
            Dismiss
          </button>
        </div>
      )}

      <EventDetailsModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />
    </div>
  );
}

export default CalendarEvents;