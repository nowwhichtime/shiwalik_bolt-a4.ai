import React, { useState, useRef } from 'react';
import { X, Upload, User, Calendar, Phone, FileText, Camera, Clock } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

interface LeaveApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeaveApplicationModal: React.FC<LeaveApplicationModalProps> = ({ isOpen, onClose }) => {
  const { addLeaveRequest, addNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    studentName: '',
    class: '',
    section: 'A',
    house: 'Shiwalik',
    exitDate: '',
    returnDate: '',
    parentType: 'father',
    parentName: '',
    parentContact: '',
    reason: '',
    photo: null as File | null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        addNotification('Photo size should be less than 5MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, photo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.studentName || !formData.class || !formData.exitDate || 
        !formData.returnDate || !formData.parentName || !formData.parentContact || 
        !formData.reason) {
      addNotification('Please fill in all required fields');
      return;
    }

    if (new Date(formData.exitDate) >= new Date(formData.returnDate)) {
      addNotification('Return date must be after exit date');
      return;
    }

    if (!formData.photo) {
      addNotification('Please upload a photo with your parent/guardian');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const leaveRequest = {
        studentId: Date.now().toString(),
        studentName: formData.studentName,
        class: `${formData.class}${formData.section}`,
        exitDate: formData.exitDate,
        returnDate: formData.returnDate,
        reason: formData.reason,
        parentContact: formData.parentContact,
        status: 'pending' as const,
        parentType: formData.parentType,
        parentName: formData.parentName,
        house: formData.house,
        photoUrl: photoPreview // In real app, this would be uploaded to server
      };

      addLeaveRequest(leaveRequest);
      addNotification('Leave application submitted successfully! Awaiting admin approval.');
      
      // Reset form
      setFormData({
        studentName: '',
        class: '',
        section: 'A',
        house: 'Shiwalik',
        exitDate: '',
        returnDate: '',
        parentType: 'father',
        parentName: '',
        parentContact: '',
        reason: '',
        photo: null
      });
      setPhotoPreview(null);
      
      onClose();
    } catch (error) {
      addNotification('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-red-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-red-800/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-6 w-6 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Leave Application</h2>
                <p className="text-blue-100">Fill in all details carefully</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Student Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-red-700/50 rounded-xl bg-white dark:bg-red-900/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Class *
                  </label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-red-700/50 rounded-xl bg-white dark:bg-red-900/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section *
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-red-700/50 rounded-xl bg-white dark:bg-red-900/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {['A', 'B', 'C', 'D'].map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    House
                  </label>
                  <input
                    type="text"
                    name="house"
                    value={formData.house}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-red-700/50 rounded-xl bg-white dark:bg-red-900/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Leave Dates */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Leave Duration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exit Date *
                  </label>
                  <input
                    type="date"
                    name="exitDate"
                    value={formData.exitDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-red-700/50 rounded-xl bg-white dark:bg-red-900/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Return Date *
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleInputChange}
                    required
                    min={formData.exitDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-red-700/50 rounded-xl bg-white dark:bg-red-900/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Parent/Guardian Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Parent/Guardian Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Accompanying Person *
                  </label>
                  <select
                    name="parentType"
                    value={formData.parentType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-red-700/50 rounded-xl bg-white dark:bg-red-900/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Parent/Guardian Name *
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-red-700/50 rounded-xl bg-white dark:bg-red-900/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="parentContact"
                      value={formData.parentContact}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-red-700/50 rounded-xl bg-white dark:bg-red-900/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reason for Leave */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Leave *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-red-700/50 rounded-xl bg-white dark:bg-red-900/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Please provide a detailed reason for the leave request..."
              />
            </div>

            {/* Photo Upload */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Photo with Parent/Guardian *
              </h3>
              
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-red-700/50 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  {photoPreview ? (
                    <div className="space-y-4">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click to change photo
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          Upload Photo
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Take a photo with your parent/guardian before leaving
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          Maximum file size: 5MB • Supported formats: JPG, PNG
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-red-700/50">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-300 dark:border-red-700/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-red-800/50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="animate-spin h-5 w-5 mr-2" />
                    Processing Application...
                  </>
                ) : (
                  <>
                    <FileText className="h-5 w-5 mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplicationModal;