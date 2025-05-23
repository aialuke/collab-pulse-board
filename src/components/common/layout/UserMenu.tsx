
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from '@/components/icons';

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className={`h-8 w-8 ${isManager ? 'ring-1 ring-royal-blue-500/30' : 'ring-1 ring-teal-500/30'}`}>
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback className={isManager ? "bg-royal-blue-100 text-royal-blue-700" : "bg-teal-100 text-teal-700"}>
              {user?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border-neutral-200 text-neutral-900" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-200" />
        <DropdownMenuItem className="hover:bg-royal-blue-500/10" onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-neutral-200" />
        <DropdownMenuItem className="hover:bg-royal-blue-500/10" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
