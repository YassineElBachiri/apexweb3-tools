'use client';

import { useState } from 'react';
import { getSource } from '@/lib/substack-sources';
import { useSubscribe } from '@/hooks/useSubscribe';

interface InlineSubscribeProps {
  source: string;
}

export function InlineSubscribe({ source }: InlineSubscribeProps) {
  const { status, error, subscribe } = useSubscribe();
  const [email, setEmail] = useState('');
  const sourceData = getSource(source);

  const handleSubmit = () => {
    if (email.trim()) {
      subscribe(email, source);
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full max-w-3xl mx-auto my-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center justify-center text-green-800 dark:text-green-300">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        <span className="font-medium">You&apos;re subscribed. Check your inbox.</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto my-8 p-6 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-start gap-4 flex-1">
        <div className="mt-1 bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg text-indigo-600 dark:text-indigo-400 hidden sm:block">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{sourceData.headline}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{sourceData.subline}</p>
        </div>
      </div>
      
      <div className="w-full md:w-auto flex flex-col gap-2">
        <div className="flex w-full sm:w-auto gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={sourceData.placeholder}
            disabled={status === 'loading'}
            className={`flex-1 sm:w-64 px-4 py-2 bg-white dark:bg-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors
              ${status === 'error' ? 'border-red-500 animate-[shake_0.5s_ease-in-out]' : 'border-gray-300 dark:border-gray-600'}
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
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex-shrink-0 disabled:opacity-70 flex items-center justify-center min-w-[120px]"
          >
            {status === 'loading' ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              sourceData.cta
            )}
          </button>
        </div>
        {status === 'error' && error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
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
