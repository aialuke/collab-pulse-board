
import React, { createContext, useContext, useState, useEffect } from 'react';

export type NotificationItem = {
  id: string;
  message: string;
  timeAgo: string;
  read: boolean;
};

interface NotificationsContextType {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  unreadCount: number;
}

const defaultNotifications: NotificationItem[] = [
  {
    id: '1',
    message: 'Your feedback was upvoted',
    timeAgo: '2 minutes ago',
    read: false,
  },
  {
    id: '2',
    message: 'New comment on your feedback',
    timeAgo: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    message: 'Your feedback status was updated to "In Progress"',
    timeAgo: '3 hours ago',
    read: false,
  },
];

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {},
  unreadCount: 0,
});

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cleared, setCleared] = useState(false);

  // Load notifications from localStorage on initial render
  useEffect(() => {
    const storedNotifications = localStorage.getItem('notifications');
    const wasCleared = localStorage.getItem('notificationsCleared') === 'true';
    
    setCleared(wasCleared);
    
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error('Error parsing notifications from localStorage:', error);
        // Only set default notifications if they weren't previously cleared
        if (!wasCleared) {
          setNotifications(defaultNotifications);
        } else {
          setNotifications([]);
        }
      }
    } else if (!wasCleared) {
      // Only set default notifications if they weren't previously cleared
      setNotifications(defaultNotifications);
    }
  }, []);

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
    
    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<NotificationItem, 'read'>) => {
    // Reset the cleared state when adding a new notification
    if (cleared) {
      setCleared(false);
      localStorage.removeItem('notificationsCleared');
    }
    setNotifications(prev => [{ ...notification, read: false }, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    setCleared(true);
    localStorage.setItem('notificationsCleared', 'true');
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        unreadCount,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
