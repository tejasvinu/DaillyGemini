// components/CalendarEvents.js
import { FiCalendar } from 'react-icons/fi';

function CalendarEvents({ mockEvents }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FiCalendar className="mr-2" />
        Today's Schedule
      </h2>
      <ul className="space-y-3">
        {mockEvents.map((event, index) => (
          <li key={index} className="bg-gray-600 p-3 rounded-lg flex items-center justify-between hover:ring-2 ring-gray-400 transition">
            <span className="font-medium">{event.title}</span>
            <span className="text-sm text-gray-300">{event.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CalendarEvents;