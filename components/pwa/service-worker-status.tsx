
'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Wifi, WifiOff, Circle, CheckCircle2, AlertCircle } from 'lucide-react';

type ServiceWorkerStatus = 'installing' | 'installed' | 'activated' | 'error' | null;

export default function ServiceWorkerStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [swStatus, setSwStatus] = useState<ServiceWorkerStatus>(null);
  const [isPWA, setIsPWA] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const checkPWAMode = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone;
      const isInWebAppChrome = window.matchMedia('(display-mode: minimal-ui)').matches;
      
      setIsPWA(isStandalone || isInWebAppiOS || isInWebAppChrome);
    };

    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Initialize online status
    setIsOnline(navigator.onLine);

    // Add event listeners for network status
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check PWA mode
    checkPWAMode();

    // Service Worker registration and status monitoring
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          // Check current service worker state
          if (registration.active) {
            setSwStatus('activated');
          } else if (registration.installing) {
            setSwStatus('installing');
          } else if (registration.waiting) {
            setSwStatus('installed');
          }

          // Listen for service worker updates
          registration.addEventListener('updatefound', () => {
            setSwStatus('installing');
            const newWorker = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                switch (newWorker.state) {
                  case 'installed':
                    setSwStatus('installed');
                    break;
                  case 'activated':
                    setSwStatus('activated');
                    break;
                  case 'redundant':
                    setSwStatus('error');
                    break;
                }
              });
            }
          });

          // Show status indicator after SW is ready
          setShowStatus(true);
        }
      }).catch(() => {
        setSwStatus('error');
        setShowStatus(true);
      });
    }

    // Auto-hide status after 10 seconds if online and working
    const timer = setTimeout(() => {
      if (isOnline && swStatus === 'activated') {
        setShowStatus(false);
      }
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
    };
  }, [isOnline, swStatus]);

  // Always show when offline or if there are issues
  const shouldShow = !isOnline || swStatus === 'error' || swStatus === 'installing' || showStatus;

  if (!shouldShow) return null;

  const getStatusIcon = () => {
    if (!isOnline) {
      return <WifiOff className="h-3 w-3" />;
    }
    
    switch (swStatus) {
      case 'activated':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'installing':
        return <Circle className="h-3 w-3 animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Wifi className="h-3 w-3" />;
    }
  };

  const getStatusVariant = () => {
    if (!isOnline) return "destructive";
    if (swStatus === 'error') return "destructive";
    if (swStatus === 'installing') return "secondary";
    return "default";
  };

  const getStatusText = () => {
    if (!isOnline) {
      return 'وضع عدم الاتصال';
    }
    
    switch (swStatus) {
      case 'activated':
        return isPWA ? 'تطبيق جاهز' : 'متصل';
      case 'installing':
        return 'جاري التحديث...';
      case 'installed':
        return 'تم التثبيت';
      case 'error':
        return 'خطأ في الاتصال';
      default:
        return 'متصل';
    }
  };

  const getTooltipText = () => {
    if (!isOnline) {
      return 'أنت غير متصل بالإنترنت. يتم عرض المحتوى المحفوظ محليًا.';
    }
    
    switch (swStatus) {
      case 'activated':
        return isPWA 
          ? 'التطبيق مثبت ويعمل في وضع عدم الاتصال'
          : 'متصل بالإنترنت. المحتوى محدث.';
      case 'installing':
        return 'جاري تحديث التطبيق...';
      case 'installed':
        return 'تم تثبيت التحديث. سيطبق عند إعادة التشغيل.';
      case 'error':
        return 'حدث خطأ في خدمة التطبيق';
      default:
        return 'متصل بالإنترنت';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="fixed top-20 right-4 z-40">
            <Badge 
              variant={getStatusVariant()}
              className="flex items-center space-x-1 rtl:space-x-reverse cursor-help shadow-md"
            >
              {getStatusIcon()}
              <span className="text-xs font-medium">
                {getStatusText()}
              </span>
              {isPWA && swStatus === 'activated' && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-1 rtl:mr-1 rtl:ml-0" />
              )}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-xs">
          <p className="text-sm text-right">
            {getTooltipText()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
