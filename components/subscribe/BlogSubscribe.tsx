'use client';

import { useState } from 'react';
import { getSource } from '@/lib/beehiiv-sources';
import { useSubscribe } from '@/hooks/useSubscribe';

interface BlogSubscribeProps {
  category: string;
}

export function BlogSubscribe({ category }: BlogSubscribeProps) {
  const { status, error, subscribe } = useSubscribe();
  const [email, setEmail] = useState('');

  const categoryMap: Record<string, string> = {
    'security-and-audits': 'blog-security',
    'blockchain-basics': 'blog-blockchain-basics',
    'web3-and-ai': 'blog-web3-ai',
    'nfts-and-metaverse': 'blog-nfts',
    'blockchain-dev-hub': 'blog-dev',
    'reviews-and-analysis': 'blog-reviews',
  };

  const sourceKey = categoryMap[category] || `blog-${category}`;
  const sourceData = getSource(sourceKey);

  const handleSubmit = () => {
    if (email.trim()) {
      subscribe(email, sourceKey);
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full max-w-4xl mx-auto my-12 pt-12 border-t border-gray-200 dark:border-gray-800 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You're subscribed!</h3>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Check your inbox for your first update.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-12 pt-12 border-t border-gray-200 dark:border-gray-800 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{sourceData.headline}</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">{sourceData.subline}</p>
      
      <div className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={sourceData.placeholder}
            disabled={status === 'loading'}
            className={`w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors
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
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center whitespace-nowrap"
          >
            {status === 'loading' ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              sourceData.cta
            )}
          </button>
        </div>
        {status === 'error' && error && (
          <p className="text-sm text-red-500 mt-2 text-left px-1">{error}</p>
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
