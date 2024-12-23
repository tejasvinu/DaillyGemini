import React, { useEffect, useState } from 'react';
// Removed import { useAuth } from '../context/AuthContext';
import { mailsService } from '../services/MailsService';

export default function MailsWidget() {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Removed: const { token } = useAuth();

  useEffect(() => {
    const fetchMails = async () => {
      try {
        const data = await mailsService.getMails();
        setMails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMails();
  }, []); // Removed dependency on `token`

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getHeaderValue = (headers, name) => {
    const header = headers?.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header?.value || '';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 text-center">
        <p>Error loading emails: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h2 className="text-xl font-bold mb-4">Recent Emails</h2>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {mails.map(mail => {
          const from = getHeaderValue(mail.payload?.headers, 'From');
          const subject = getHeaderValue(mail.payload?.headers, 'Subject');
          const date = getHeaderValue(mail.payload?.headers, 'Date');
          
          return (
            <div 
              key={mail.id} 
              className="p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {from.split('<')[0].trim() || from}
                  </p>
                  <p className="text-sm text-gray-300 truncate">{subject}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {formatDate(date)}
                </span>
              </div>
            </div>
          );
        })}
        {mails.length === 0 && (
          <p className="text-center text-gray-400 py-4">No recent emails</p>
        )}
      </div>
    </div>
  );
}