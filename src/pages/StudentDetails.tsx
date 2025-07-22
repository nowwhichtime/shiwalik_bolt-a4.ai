import React, { useState, useMemo } from 'react';
import { Search, Filter, Upload, Plus } from 'lucide-react';
import { useStudents } from '../contexts/StudentContext';
import { useAuth } from '../contexts/AuthContext';
import StudentCard from '../components/student/StudentCard';
import StudentHoverCard from '../components/student/StudentHoverCard';

const StudentDetails: React.FC = () => {
  const { students, searchQuery, setSearchQuery, classFilter, setClassFilter } = useStudents();
  const { isEditorMode } = useAuth();

  const classes = Array.from(new Set(students.map(s => s.class))).sort((a, b) => a - b);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = !searchQuery || 
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.parentDetails.father.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.parentDetails.mother.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.includes(searchQuery);
      
      const matchesClass = !classFilter || student.class.toString() === classFilter;
      
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, classFilter]);

  const handleExcelImport = () => {
    // Implement Excel import functionality
    console.log('Excel import triggered');
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-purple-600 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
            Student Directory
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive profiles of all Shiwalik House students
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, parent name, or roll number..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white dark:bg-white/10 backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-xl text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls} className="bg-white dark:bg-gray-800">
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isEditorMode && (
            <div className="flex gap-3">
              <button
                onClick={handleExcelImport}
                className="flex items-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
              >
                <Upload className="h-5 w-5 mr-2" />
                Import Excel
              </button>
              <button className="flex items-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105">
                <Plus className="h-5 w-5 mr-2" />
                Add Student
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing <span className="text-gray-900 dark:text-white font-semibold">{filteredStudents.length}</span> student{filteredStudents.length !== 1 ? 's' : ''}
            {(searchQuery || classFilter) && (
              <span className="ml-2 text-purple-600 dark:text-purple-300">
                {searchQuery && `matching "${searchQuery}"`}
                {searchQuery && classFilter && ' and '}
                {classFilter && `in Class ${classFilter}`}
              </span>
            )}
          </p>
        </div>

        {/* Student Grid */}
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-500 dark:text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No students found</p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                Try adjusting your search criteria or filters
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetails;