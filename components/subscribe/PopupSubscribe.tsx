'use client';

import { useState, useEffect } from 'react';
import { getSource } from '@/lib/beehiiv-sources';
import { useSubscribe } from '@/hooks/useSubscribe';

interface PopupSubscribeProps {
  delay?: number;
  mode?: 'exit' | 'timed';
}

export function PopupSubscribe({ delay = 0, mode = 'exit' }: PopupSubscribeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { status, error, subscribe } = useSubscribe();
  const [email, setEmail] = useState('');
  
  const sourceData = getSource('exit-intent');

  useEffect(() => {
    // Client-side only checks
    if (typeof window === 'undefined') return;

    // Check if already subscribed
    const isSubscribed = localStorage.getItem('apex_subscribed') === '1';
    if (isSubscribed) return;

    // Check if shown this session
    const hasShown = sessionStorage.getItem('apex_popup_shown') === '1';
    if (hasShown) return;

    // Mobile check (don't show on small screens)
    if (window.innerWidth < 768) return;

    let timeoutId: NodeJS.Timeout;

    if (mode === 'timed') {
      timeoutId = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('apex_popup_shown', '1');
      }, delay);
    } else {
      // Exit intent
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
          setIsOpen(true);
          sessionStorage.setItem('apex_popup_shown', '1');
          document.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
      
      document.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delay, mode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (status === 'success') {
      localStorage.setItem('apex_subscribed', '1');
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = () => {
    if (email.trim()) {
      subscribe(email, 'exit-intent');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-[480px] p-8 relative animate-[fade-in_0.3s_ease-out]"
        role="dialog"
        aria-modal="true"
      >
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {status === 'success' ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You're in!</h3>
            <p className="text-gray-600 dark:text-gray-400">Check your inbox for your first update.</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{sourceData.headline}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">{sourceData.subline}</p>
            
            <div className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={sourceData.placeholder}
                disabled={status === 'loading'}
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white transition-colors
                  ${status === 'error' ? 'border-red-500 animate-[shake_0.5s_ease-in-out]' : 'border-gray-200 dark:border-gray-700'}
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
                className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {status === 'loading' ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  sourceData.cta
                )}
              </button>
            </div>
            {status === 'error' && error && (
              <p className="text-sm text-red-500 mt-3">{error}</p>
            )}
            
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
}
