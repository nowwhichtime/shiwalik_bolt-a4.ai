import React, { createContext, useContext, useState } from 'react';

interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  exitDate: string;
  returnDate: string;
  reason: string;
  parentContact: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface NotificationContextType {
  leaveRequests: LeaveRequest[];
  pendingCount: number;
  addLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'submittedAt'>) => void;
  updateRequestStatus: (id: string, status: 'approved' | 'rejected') => void;
  notifications: string[];
  addNotification: (message: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      studentId: '1',
      studentName: 'Arjun Sharma',
      class: '10th A',
      exitDate: '2024-01-15',
      returnDate: '2024-01-17',
      reason: 'Family Function',
      parentContact: '+91 9876543210',
      status: 'pending',
      submittedAt: '2024-01-10T10:30:00Z'
    },
    {
      id: '2',
      studentId: '5',
      studentName: 'Priya Singh',
      class: '9th B',
      exitDate: '2024-01-20',
      returnDate: '2024-01-22',
      reason: 'Medical Checkup',
      parentContact: '+91 9876543211',
      status: 'pending',
      submittedAt: '2024-01-12T14:15:00Z'
    }
  ]);
  
  const [notifications, setNotifications] = useState<string[]>([]);

  const pendingCount = leaveRequests.filter(req => req.status === 'pending').length;

  const addLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'submittedAt'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    };
    setLeaveRequests(prev => [...prev, newRequest]);
    addNotification(`New leave request from ${request.studentName}`);
  };

  const updateRequestStatus = (id: string, status: 'approved' | 'rejected') => {
    setLeaveRequests(prev =>
      prev.map(req =>
        req.id === id ? { ...req, status } : req
      )
    );
  };

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        leaveRequests,
        pendingCount,
        addLeaveRequest,
        updateRequestStatus,
        notifications,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};