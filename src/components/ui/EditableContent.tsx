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
            className={`${className} bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded px-2 py-1 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none w-full`}
            rows={3}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-600 rounded px-2 py-1 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent w-full`}
            autoFocus
          />
        )}
        
        <div className="flex items-center space-x-1 mt-2">
          <button
            onClick={handleSave}
            className="p-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            <Check className="h-3 w-3" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <span
      className={`${className} relative group cursor-pointer hover:bg-red-100 dark:hover:bg-red-800/20 rounded px-1 transition-colors`}
      onClick={() => setIsEditing(true)}
    >
      {content}
      <Edit3 className="h-3 w-3 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-1 -right-1 bg-white dark:bg-red-900 rounded-full p-0.5" />
    </span>
  );
};

export default EditableContent;