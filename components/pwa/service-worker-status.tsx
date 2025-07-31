
'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

export default function ServiceWorkerStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [swStatus, setSwStatus] = useState<'installing' | 'installed' | 'error' | null>(null);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    // Register service worker status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          setSwStatus('installed');
          
          registration.addEventListener('updatefound', () => {
            setSwStatus('installing');
            const newWorker = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  setSwStatus('installed');
                }
              });
            }
          });
        }
      }).catch(() => {
        setSwStatus('error');
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!swStatus) return null;

  return (
    <div className="fixed top-20 right-4 z-40 pwa-only">
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className="flex items-center space-x-1 rtl:space-x-reverse"
      >
        {isOnline ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        <span className="text-xs">
          {isOnline ? 'متصل' : 'وضع عدم الاتصال'}
        </span>
      </Badge>
    </div>
  );
}
