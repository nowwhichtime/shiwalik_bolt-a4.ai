import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface NotificationDropdownProps {
  children: React.ReactNode;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { leaveRequests, updateRequestStatus } = useNotifications();
  const { isAuthenticated } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pendingRequests = leaveRequests.filter(req => req.status === 'pending');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApproval = (id: string, status: 'approved' | 'rejected') => {
    updateRequestStatus(id, status);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 max-h-96 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Notifications ({pendingRequests.length})
            </h3>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
              No pending notifications
            </div>
          ) : (
            <div className="space-y-1">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.studentName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {request.class} • {request.reason}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(request.exitDate).toLocaleDateString()} - {new Date(request.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Clock className="h-4 w-4 text-yellow-500 ml-2 flex-shrink-0" />
                  </div>

                  {isAuthenticated && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleApproval(request.id, 'approved')}
                        className="flex items-center px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs rounded-md transition-colors"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(request.id, 'rejected')}
                        className="flex items-center px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded-md transition-colors"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;