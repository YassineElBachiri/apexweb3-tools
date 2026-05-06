import { useState } from 'react';

type SubscribeStatus = 'idle' | 'loading' | 'success' | 'error';

type UseSubscribeReturn = {
  status: SubscribeStatus;
  error: string | null;
  subscribe: (email: string, source: string) => Promise<void>;
  reset: () => void;
};

export function useSubscribe(): UseSubscribeReturn {
  const [status, setStatus] = useState<SubscribeStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const subscribe = async (email: string, source: string) => {
    if (status === 'loading') return;
    
    setStatus('loading');
    setError(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source,
          referring_url: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setError(data.error || 'Failed to subscribe');
      }
    } catch (err) {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setError(null);
  };

  return {
    status,
    error,
    subscribe,
    reset,
  };
}
