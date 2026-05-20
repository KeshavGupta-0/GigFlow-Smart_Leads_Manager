import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center text-white font-bold">
            GF
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">GigFlow</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {user && (
            <div className="flex items-center gap-4 border-l pl-4 dark:border-gray-700">
              <div className="flex items-center gap-2 hidden sm:flex">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                <Badge variant={user.role || 'sales_user'}>
                  {user.role === 'admin' ? 'Admin' : 'Sales'}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <LogOut size={16} />
                <span className="hidden sm:block">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
