
import React from 'react';
import { Bell, Check, Trash2 } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationsContext';
import { toast } from '@/hooks/use-toast';

export function NotificationsMenu() {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    unreadCount 
  } = useNotifications();
  
  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllAsRead();
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
    });
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearNotifications();
    toast({
      title: "Notifications",
      description: "All notifications cleared",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative group hover:bg-teal-500">
          <Bell className="h-5 w-5 text-teal-500 group-hover:text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-yellow text-neutral-900">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-white border-neutral-200 text-neutral-900">
        <div className="flex items-center justify-end p-2">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs" 
              onClick={handleMarkAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs" 
              onClick={handleClearAll}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-neutral-200" />
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-neutral-500">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={`hover:bg-teal-500/10 ${notification.read ? 'bg-neutral-50' : 'bg-white'}`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex flex-col w-full">
                  <div className={`text-sm ${notification.read ? 'text-neutral-600' : 'font-medium'}`}>
                    {notification.message}
                  </div>
                  <div className="text-xs text-muted-foreground">{notification.timeAgo}</div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
