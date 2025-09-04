'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePWAInstall, useIsMobile } from '@/hooks/usePWA';
import { Download, X, Smartphone } from 'lucide-react';

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();
  const isMobile = useIsMobile();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if already installed, not installable, or dismissed
  if (isInstalled || !isInstallable || isDismissed) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installPWA();
    if (!success) {
      // Fallback instructions for browsers that don't support the install prompt
      alert(
        'To install the Alumni Network app:\n' +
        '1. Open browser menu (⋮)\n' +
        '2. Select "Add to Home Screen" or "Install App"\n' +
        '3. Tap "Add" or "Install"'
      );
    }
  };

  return (
    <Card className="mx-4 my-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Install Alumni Network</h3>
              <p className="text-sm text-gray-600">
                {isMobile 
                  ? 'Get quick access from your home screen'
                  : 'Install the app for a better experience'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Free
            </Badge>
            <Button 
              size="sm" 
              onClick={handleInstall}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-1" />
              Install
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsDismissed(true)}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Offline indicator component
export function OfflineIndicator() {
  const [showOffline, setShowOffline] = useState(false);

  // This would typically use the useOnlineStatus hook
  // For now, we'll just show it when offline
  if (!showOffline) return null;

  return (
    <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>You're offline. Some features may be limited.</span>
      </div>
    </div>
  );
}

// PWA update notification
export function PWAUpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      // Trigger service worker update
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!showUpdate) return null;

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:w-96 shadow-lg border-green-200 bg-green-50 z-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-green-900">Update Available</h4>
            <p className="text-sm text-green-700">
              A new version of the app is ready to install.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowUpdate(false)}
            >
              Later
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
