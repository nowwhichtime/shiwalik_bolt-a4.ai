import React from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Award, User } from 'lucide-react';
import { Student } from '../../contexts/StudentContext';
import { useAuth } from '../../contexts/AuthContext';

interface StudentCardProps {
  student: Student;
}

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const { isEditorMode } = useAuth();

  return (
    <div
      className="group relative bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
    >
      {/* Edit Button */}
      {isEditorMode && (
        <button className="absolute top-3 right-3 z-10 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-0 group-hover:scale-100">
          <Edit3 className="h-4 w-4" />
        </button>
      )}

      <Link to={`/student/${student.id}`} className="block p-6">
        {/* Student Photo */}
        <div className="relative mb-4">
          <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-4 border-gray-200 dark:border-white/20 group-hover:border-purple-400/50 transition-all duration-300">
            <img
              src={student.photo}
              alt={student.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=8b5cf6&color=fff&size=96`;
              }}
            />
          </div>
          
          {/* House Badge */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full border border-gray-200 dark:border-white/20">
              {student.house}
            </span>
          </div>
        </div>

        {/* Student Info */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
            {student.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
            Class {student.class}{student.section} • Roll {student.rollNumber}
          </p>

          {/* Quick Info */}
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {student.bloodGroup}
            </div>
            {student.achievements.length > 0 && (
              <div className="flex items-center">
                <Award className="h-3 w-3 mr-1" />
                {student.achievements.length}
              </div>
            )}
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-200/30 dark:from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      </Link>
    </div>
  );
};

export default StudentCard;