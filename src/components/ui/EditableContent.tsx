import React, { useState } from 'react';
import { Edit3, Check, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface EditableContentProps {
  content: string;
  onSave: (newContent: string) => void;
  className?: string;
  multiline?: boolean;
}

const EditableContent: React.FC<EditableContentProps> = ({
  content,
  onSave,
  className = '',
  multiline = false
}) => {
  const { isEditorMode } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditorMode) {
    return <span className={className}>{content}</span>;
  }

  if (isEditing) {
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} bg-white dark:bg-red-900/30 border-2 border-red-400 dark:border-red-500 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none w-full shadow-lg`}
            rows={3}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} bg-white dark:bg-red-900/30 border-2 border-red-400 dark:border-red-500 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent w-full shadow-lg`}
            autoFocus
          />
        )}
        
        <div className="flex items-center space-x-2 mt-3">
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold text-sm"
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold text-sm"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`${className} relative group cursor-pointer hover:bg-red-100 dark:hover:bg-red-800/30 rounded-lg px-2 py-1 transition-all duration-200 border-2 border-transparent hover:border-red-300 dark:hover:border-red-600`}
      onClick={() => setIsEditing(true)}
    >
      {content}
      <Edit3 className="h-4 w-4 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 -right-2 bg-white dark:bg-red-900 rounded-full p-1 shadow-lg border border-red-200 dark:border-red-700" />
    </span>
  );
};

export default EditableContent;