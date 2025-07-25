import React, { useState } from 'react';
import { Heart, X, QrCode } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import EditableContent from './EditableContent';

const DonateButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isEditorMode } = useAuth();
  
  const [donateContent, setDonateContent] = useState({
    message: 'Please donate to the talented students for their hard work building this website',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=student@paytm&pn=Shiwalik%20Students&am=100&cu=INR'
  });

  return (
    <>
      {/* Donate Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 group"
      >
        <Heart className="h-6 w-6 group-hover:animate-pulse" />
        <span className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full animate-bounce">
          Donate
        </span>
      </button>

      {/* Donate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white dark:bg-red-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-red-800/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Heart className="h-6 w-6 mr-3" />
                  <h2 className="text-xl font-bold">Support Our Students</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              {/* Message */}
              <div className="mb-6">
                <EditableContent
                  content={donateContent.message}
                  onSave={(value) => setDonateContent(prev => ({ ...prev, message: value }))}
                  className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
                  multiline
                />
              </div>

              {/* QR Code */}
              <div className="mb-6">
                <div className="bg-white p-4 rounded-xl inline-block shadow-lg">
                  <img
                    src={donateContent.qrCodeUrl}
                    alt="Donation QR Code"
                    className="w-48 h-48 mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Donate%20to%20Shiwalik%20Students';
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Scan to donate via UPI
                </p>
              </div>

              {/* QR Code URL Editor for Admin */}
              {isEditorMode && (
                <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-700/50">
                  <label className="block text-sm font-medium text-orange-800 dark:text-orange-300 mb-2">
                    QR Code URL (Admin Only):
                  </label>
                  <input
                    type="url"
                    value={donateContent.qrCodeUrl}
                    onChange={(e) => setDonateContent(prev => ({ ...prev, qrCodeUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-orange-300 dark:border-orange-600 rounded-lg bg-white dark:bg-orange-900/30 text-gray-900 dark:text-white text-sm"
                    placeholder="Enter QR code URL"
                  />
                </div>
              )}

              {/* Thank you message */}
              <div className="bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 p-4 rounded-xl border border-pink-200 dark:border-pink-700/50">
                <p className="text-pink-800 dark:text-pink-300 font-semibold">
                  💝 Thank you for supporting our talented students!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonateButton;