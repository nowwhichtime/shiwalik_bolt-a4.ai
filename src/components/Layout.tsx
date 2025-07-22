import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Bell, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import AccountDropdown from './ui/AccountDropdown';
import NotificationDropdown from './ui/NotificationDropdown';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isEditorMode } = useAuth();
  const { pendingCount } = useNotifications();
  const location = useLocation();

  const menuItems = [
    { path: '/students', label: 'Student Details' },
    { path: '/academic', label: 'Academic Performance' },
    { path: '/movement', label: 'Movement Register' },
    { path: '/about', label: 'About House' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 transition-all duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-white/10 dark:dark:bg-black/20 border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors lg:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-900 dark:text-white" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-900 dark:text-white" />
                )}
              </button>
              <Link
                to="/"
                className="text-xl font-bold text-gray-900 dark:text-white ml-2 lg:ml-0 hover:text-purple-600 dark:hover:text-purple-300 transition-colors"
              >
                Shiwalik House
              </Link>
              {isEditorMode && (
                <span className="ml-3 px-2 py-1 bg-orange-500 text-white text-xs rounded-full animate-pulse">
                  Editor Mode
                </span>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-purple-100 dark:bg-white/20 text-purple-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-purple-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-gray-900 dark:text-white" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-900 dark:text-white" />
                )}
              </button>
              
              <NotificationDropdown>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors relative">
                  <Bell className="h-5 w-5 text-gray-900 dark:text-white" />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </NotificationDropdown>

              <AccountDropdown>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                  <User className="h-5 w-5 text-gray-900 dark:text-white" />
                </button>
              </AccountDropdown>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-black/40 backdrop-blur-md border-t border-gray-200 dark:border-white/10">
            <div className="px-4 py-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-purple-100 dark:bg-white/20 text-purple-900 dark:text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-purple-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;