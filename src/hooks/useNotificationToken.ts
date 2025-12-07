import { useState, useEffect } from 'react';
import { requestNotificationPermission } from '@/lib/firebase';
import { useSession } from 'next-auth/react';

export const useNotificationToken = () => {
  const { data: session } = useSession();
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const saveTokenToBackend = async (currentToken: string) => {
    try {
      await fetch('/api/notifications/save-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: currentToken, platform: 'web' }),
      });
    } catch (error) {
      console.error('Error saving token to backend:', error);
    }
  };

  const removeTokenFromBackend = async (currentToken: string) => {
    try {
      await fetch('/api/notifications/save-token', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: currentToken }),
      });
    } catch (error) {
      console.error('Error removing token from backend:', error);
    }
  };

  const requestPermission = async () => {
    const currentToken = await requestNotificationPermission();
    if (currentToken) {
      setToken(currentToken);
      setPermission('granted');
      if (session?.user) {
        await saveTokenToBackend(currentToken);
      }
    } else {
      setPermission(Notification.permission);
    }
    return currentToken;
  };

  return {
    token,
    permission,
    requestPermission,
    removeTokenFromBackend,
  };
};
