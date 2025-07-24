import React, { useRef, useState } from 'react';
import { Upload, Edit3, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface EditableImageProps {
  src: string;
  alt: string;
  onImageChange: (newImageSrc: string) => void;
  className?: string;
}

const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  onImageChange,
  className = ''
}) => {
  const { isEditorMode } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageChange(result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert('Error reading file');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isEditorMode) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!isEditorMode) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div 
      className={`relative group ${isEditorMode ? 'cursor-pointer' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <img
        src={src}
        alt={alt}
        className={`${className} ${isDragOver ? 'opacity-50' : ''} transition-opacity`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=dc2626&color=fff&size=300`;
        }}
      />
      
      {isEditorMode && (
        <>
          {/* Drag & Drop Overlay */}
          {isDragOver && (
            <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center rounded-lg">
              <div className="text-center text-white">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-semibold">Drop image here</p>
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  <span>Change Photo</span>
                </>
              )}
            </button>
          </div>
          
          {/* Edit Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
            disabled={isUploading}
          >
            <Edit3 className="h-4 w-4" />
          </button>

          {/* Drag & Drop Instructions */}
          <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Click to upload or drag & drop an image
          </div>
        </>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default EditableImage;