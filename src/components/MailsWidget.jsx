import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { mailsService } from '../services/MailsService';
import Modal from './Modal';
import { LoadingSpinner } from './Spinner';

export default function MailsWidget() {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasCachedSummary, setHasCachedSummary] = useState(false);

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
    const cached = mailsService.getCachedSummary();
    setHasCachedSummary(!!cached);
  }, []);

  const fetchSummary = async () => {
    try {
      setSummaryLoading(true);
      const data = await mailsService.getMailsSummary();
      setSummary(data.summary);
      setHasCachedSummary(true);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSummaryLoading(false);
    }
  };

  const displayCachedSummary = async () => {
    const cached = mailsService.getCachedSummary();
    if (cached) {
      setSummary(cached.summary);
      setIsModalOpen(true);
    }
  };

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
      <div className="flex justify-center items-center p-12">
        <LoadingSpinner label="Getting your mails..." />
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
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Recent Emails</h2>
        <div className="flex gap-2">
          <button 
            onClick={fetchSummary} 
            className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-orange-600 transition-colors"
            disabled={summaryLoading}
          >
            {summaryLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              'New Summary'
            )}
          </button>
          
          {hasCachedSummary && (
            <button 
              onClick={displayCachedSummary}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              View Latest
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-3 max-h-[400px] overflow-y-auto mt-4">
        {mails.map(mail => {
          const from = getHeaderValue(mail.payload?.headers, 'From');
          const subject = getHeaderValue(mail.payload?.headers, 'Subject');
          const date = getHeaderValue(mail.payload?.headers, 'Date');
          
          return (
            <div 
              key={mail.id} 
              className="p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {from.split('<')[0].trim() || from}
                  </p>
                  <p className="text-gray-300 truncate mt-1">{subject}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                  {formatDate(date)}
                </span>
              </div>
            </div>
          );
        })}
        {mails.length === 0 && (
          <div className="text-center text-gray-400 py-8 bg-gray-700/50 rounded-lg">
            No recent emails
          </div>
        )}
      </div>

      {isModalOpen && summary && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="bg-gray-800 rounded-lg w-full max-w-3xl mx-auto">
            <div className="flex items-center justify-between border-b border-gray-700 p-4">
              <h3 className="text-xl font-bold text-white">Email Summary</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}