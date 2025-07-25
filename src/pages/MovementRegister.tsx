import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, User, Phone, FileText, Plus, Camera } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import LeaveApplicationModal from '../components/leave/LeaveApplicationModal';

const MovementRegister: React.FC = () => {
  const { leaveRequests, updateRequestStatus } = useNotifications();
  const { isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'all'>('pending');
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  const pendingRequests = leaveRequests.filter(req => req.status === 'pending');
  const allRequests = leaveRequests.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const displayRequests = selectedTab === 'pending' ? pendingRequests : allRequests;

  const handleApproval = (id: string, status: 'approved' | 'rejected') => {
    updateRequestStatus(id, status);
    
    // Show success message for approved requests
    if (status === 'approved') {
      // Create and show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-[300] bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 translate-x-full';
      notification.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div>
            <p class="font-semibold">Leave Approved!</p>
            <p class="text-sm opacity-90">Student has been notified</p>
          </div>
        </div>
      `;
      
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 100);
      
      // Remove after 4 seconds
      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 4000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-purple-600 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
            Movement Register
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Digital leave request system with approval workflow
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-yellow-400" />
              <span className="text-yellow-300 text-sm font-medium">Pending</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{pendingRequests.length}</h3>
            <p className="text-yellow-300">Awaiting Approval</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <span className="text-green-300 text-sm font-medium">Approved</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {leaveRequests.filter(req => req.status === 'approved').length}
            </h3>
            <p className="text-green-300">This Month</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <FileText className="h-8 w-8 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{leaveRequests.length}</h3>
            <p className="text-purple-300">All Requests</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-8 w-fit">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              selectedTab === 'pending'
                ? 'bg-white text-gray-900'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            Pending ({pendingRequests.length})
          </button>
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              selectedTab === 'all'
                ? 'bg-white text-gray-900'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            All Requests ({leaveRequests.length})
          </button>
        </div>

        {/* Apply for Leave Section */}
        <div className="mb-12 text-center">
          <button
            onClick={() => setIsApplicationModalOpen(true)}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Plus className="h-6 w-6 mr-3" />
            Apply for Leave
          </button>
          <p className="text-gray-400 mt-4 text-sm">
            Click to submit a new leave request with all required details
          </p>
        </div>

        {/* Leave Requests Log */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Leave Requests Log</h2>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 mb-8 w-fit mx-auto">
            <button
              onClick={() => setSelectedTab('pending')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                selectedTab === 'pending'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Pending ({pendingRequests.length})
            </button>
            <button
              onClick={() => setSelectedTab('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                selectedTab === 'all'
                  ? 'bg-white text-gray-900'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              All Requests ({leaveRequests.length})
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {displayRequests.length > 0 ? (
            displayRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{request.studentName}</h3>
                        <p className="text-gray-300 text-sm mb-2">{request.class}</p>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Submitted on {new Date(request.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="capitalize ml-1">{request.status}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-400 text-sm mb-1">Exit Date</p>
                      <p className="text-white font-semibold">
                        {new Date(request.exitDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-400 text-sm mb-1">Return Date</p>
                      <p className="text-white font-semibold">
                        {new Date(request.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-400 text-sm mb-1">Reason</p>
                      <p className="text-white font-semibold">{request.reason}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-400 text-sm mb-1">Parent Contact</p>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-green-400 mr-2" />
                        <a
                          href={`tel:${request.parentContact}`}
                          className="text-white font-semibold hover:text-green-400 transition-colors"
                        >
                          {request.parentContact}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Photo Display for Admin */}
                  {isAuthenticated && request.photoUrl && (
                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                      <div className="flex items-center mb-3">
                        <Camera className="h-5 w-5 text-purple-400 mr-2" />
                        <p className="text-gray-300 font-semibold">Photo with Parent/Guardian</p>
                      </div>
                      <div className="bg-white p-2 rounded-lg inline-block">
                        <img
                          src={request.photoUrl}
                          alt="Student with parent/guardian"
                          className="max-w-xs max-h-48 rounded object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons for Admins */}
                  {isAuthenticated && request.status === 'pending' && (
                    <div className="flex space-x-3 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleApproval(request.id, 'approved')}
                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(request.id, 'rejected')}
                        className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No requests found</h3>
              <p className="text-gray-400">
                {selectedTab === 'pending' ? 'No pending requests at the moment' : 'No leave requests have been submitted yet'}
              </p>
            </div>
          )}
        </div>

        {/* Leave Application Modal */}
        <LeaveApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default MovementRegister;