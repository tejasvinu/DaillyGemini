// components/CalendarEvents.js
import { useState, useEffect } from 'react';
import { FiCalendar, FiRefreshCw } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { calendarService } from '../services/CalendarService';

function CalendarEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id} className="bg-gray-600 p-3 rounded-lg flex items-center justify-between hover:ring-2 ring-gray-400 transition">
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
    </div>
  );
}

export default CalendarEvents;