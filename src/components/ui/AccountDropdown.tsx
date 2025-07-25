import React, { useState, useRef, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AccountDropdownProps {
  children: React.ReactNode;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setIsOpen(false);
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
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
                  onClick={handleLogoutClick}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-red-800/50 transition-colors flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={cancelLogout} />
          
          <div className="relative w-full max-w-sm bg-white dark:bg-red-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-red-800/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white text-center">
              <LogOut className="h-8 w-8 mx-auto mb-3" />
              <h2 className="text-xl font-bold">Confirm Logout</h2>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to logout? You'll need to login again to access admin features.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-red-700/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-red-800/50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountDropdown;