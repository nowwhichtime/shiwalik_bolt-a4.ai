import React, { useState } from 'react';
import { X, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginAttempts, lockoutTime } = useAuth();

  const isLockedOut = lockoutTime && new Date() < lockoutTime;
  const remainingTime = isLockedOut ? Math.ceil((lockoutTime!.getTime() - new Date().getTime()) / (1000 * 60)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLockedOut) {
      setError(`Account locked. Please try again after ${remainingTime} minutes.`);
      return;
    }

    const success = login(username, password);
    if (success) {
      setIsOpen(false);
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError('Invalid credentials. Please try again.');
      setPassword('');
    }
  };

  // Listen for global login trigger
  React.useEffect(() => {
    const handleGlobalLogin = () => setIsOpen(true);
    window.addEventListener('openLoginModal', handleGlobalLogin);
    return () => window.removeEventListener('openLoginModal', handleGlobalLogin);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
            <Lock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Access the administrative features
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter username"
              required
              disabled={isLockedOut}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter password"
              required
              disabled={isLockedOut}
            />
          </div>

          {error && (
            <div className="flex items-center p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {loginAttempts > 0 && !isLockedOut && (
            <div className="text-sm text-yellow-600 dark:text-yellow-400">
              Failed attempts: {loginAttempts}/3
            </div>
          )}

          <button
            type="submit"
            disabled={isLockedOut}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLockedOut ? `Locked (${remainingTime}m remaining)` : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Demo Credentials:</strong><br />
            Admin 1: roti / curry<br />
            Admin 2: abhi / gobi
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;