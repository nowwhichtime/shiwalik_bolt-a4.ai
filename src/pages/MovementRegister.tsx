import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, User, Phone, FileText } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

const MovementRegister: React.FC = () => {
  const { leaveRequests, updateRequestStatus } = useNotifications();
  const { isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'all'>('pending');

  const pendingRequests = leaveRequests.filter(req => req.status === 'pending');
  const allRequests = leaveRequests.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const displayRequests = selectedTab === 'pending' ? pendingRequests : allRequests;

  const handleApproval = (id: string, status: 'approved' | 'rejected') => {
    updateRequestStatus(id, status);
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

        {/* Google Form Integration Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Submit Leave Request</h2>
              <p className="text-gray-300 mb-6">
                Use the form below to submit a new leave request. All submissions will be reviewed by the house administration.
              </p>
              
              {/* Placeholder for Google Form */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Google Form Integration</h3>
                  <p className="text-gray-400 mb-4">
                    The leave request form will be embedded here once Google Forms is configured.
                  </p>
                  <p className="text-sm text-gray-500">
                    Form will include: Student details, dates, reason, parent contact, and photo uploads
                  </p>
                </div>
              </div>
            </div>
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
            <div className="text-center py-16">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-white mb-2">No Requests Found</h3>
              <p className="text-gray-400">
                {selectedTab === 'pending' 
                  ? 'No pending leave requests at the moment.' 
                  : 'No leave requests have been submitted yet.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovementRegister;