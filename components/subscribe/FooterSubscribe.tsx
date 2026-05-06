'use client';

import { useState, useEffect } from 'react';
import { getSource } from '@/lib/beehiiv-sources';
import { useSubscribe } from '@/hooks/useSubscribe';

export function FooterSubscribe() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { status, error, subscribe } = useSubscribe();
  const [email, setEmail] = useState('');
  
  const sourceData = getSource('footer');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSubscribed(localStorage.getItem('apex_subscribed') === '1');
    }
  }, []);

  useEffect(() => {
    if (status === 'success') {
      localStorage.setItem('apex_subscribed', '1');
      setIsSubscribed(true);
    }
  }, [status]);

  const handleSubmit = () => {
    if (email.trim()) {
      subscribe(email, 'footer');
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center text-green-600 dark:text-green-400 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          You're subscribed. Check your inbox.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-8 border-t border-gray-200 dark:border-gray-800">
      <div>
        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{sourceData.headline}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{sourceData.subline}</p>
      </div>
      
      <div className="w-full md:w-auto flex flex-col gap-2">
        <div className="flex w-full sm:w-auto gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={sourceData.placeholder}
            disabled={status === 'loading'}
            className={`flex-1 sm:w-64 px-4 py-2 text-sm bg-white dark:bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors
              ${status === 'error' ? 'border-red-500 animate-[shake_0.5s_ease-in-out]' : 'border-gray-300 dark:border-gray-700'}
            `}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0 disabled:opacity-70 flex items-center justify-center min-w-[110px]"
          >
            {status === 'loading' ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              sourceData.cta
            )}
          </button>
        </div>
        {status === 'error' && error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}} />
    </div>
  );
}
