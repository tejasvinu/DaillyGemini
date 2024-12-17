import React from 'react';
import { FiCalendar } from 'react-icons/fi';

function CalendarEvents({ mockEvents }) {
  return (
    <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-teal-800 mb-4 flex items-center">
        <FiCalendar className="mr-2" />
        Today's Schedule
      </h2>
      <div className="space-y-3">
        {mockEvents.map((event, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-white/60 rounded-lg hover:bg-white/80 transition-colors">
            <span className="text-teal-900">{event.title}</span>
            <span className="text-teal-700">{event.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarEvents;
