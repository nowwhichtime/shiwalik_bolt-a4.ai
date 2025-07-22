import React, { useState, useRef } from 'react';
import { Edit3, Save, X, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface EditableContentProps {
  content: string;
  onSave: (newContent: string) => void;
  type?: 'text' | 'textarea' | 'image';
  className?: string;
  placeholder?: string;
}

const EditableContent: React.FC<EditableContentProps> = ({
  content,
  onSave,
  type = 'text',
  className = '',
  placeholder = 'Enter content...'
}) => {
  const { isEditorMode } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(content);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Create a FileReader to convert the image to base64 or handle upload
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditValue(result);
        onSave(result);
        setIsUploading(false);
        setIsEditing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isEditorMode && type !== 'image') {
    return <span className={className}>{content}</span>;
  }

  if (!isEditorMode && type === 'image') {
    return (
      <img
        src={content}
        alt="Content"
        className={className}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://via.placeholder.com/300x300?text=No+Image';
        }}
      />
    );
  }

  if (type === 'image') {
    return (
      <div className="relative group">
        <img
          src={content}
          alt="Content"
          className={`${className} ${isEditorMode ? 'cursor-pointer' : ''}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        {isEditorMode && (
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
                  <Upload className="h-4 w-4" />
                  <span>Upload Image</span>
                </>
              )}
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        {type === 'textarea' ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            autoFocus
          />
        )}
        <button
          onClick={handleSave}
          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Save className="h-4 w-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="group relative inline-flex items-center">
      <span className={className}>{content}</span>
      {isEditorMode && (
        <button
          onClick={() => setIsEditing(true)}
          className="ml-2 p-1 bg-orange-500 hover:bg-orange-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit3 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default EditableContent;