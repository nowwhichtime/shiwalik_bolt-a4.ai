import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AccountDropdownProps {
  children: React.ReactNode;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isEditorMode, logout, toggleEditorMode } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    setIsOpen(false);
    // Trigger login modal
    window.dispatchEvent(new CustomEvent('openLoginModal'));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-red-950 rounded-xl shadow-lg border border-gray-200 dark:border-red-700/50 py-2 z-50">
          {isAuthenticated ? (
            <>
              <div className="px-4 py-2 border-b border-gray-200 dark:border-red-700/50">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Welcome, {user?.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
              </div>
              
              {user?.isAdmin && (
                <button
                  onClick={() => {
                    toggleEditorMode();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-red-800/50 transition-colors"
                >
                  {isEditorMode ? 'Disable Editor Mode' : 'Enable Editor Mode'}
                </button>
              )}
              
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-red-800/50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-red-800/50 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountDropdown;