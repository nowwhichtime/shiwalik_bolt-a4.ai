import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Upload, Download, UserPlus } from 'lucide-react';
import { useStudents } from '../contexts/StudentContext';
import { useAuth } from '../contexts/AuthContext';
import StudentCard from '../components/student/StudentCard';
import AddStudentModal from '../components/student/AddStudentModal';

const StudentDetails: React.FC = () => {
  const { students, searchQuery, setSearchQuery, classFilter, setClassFilter } = useStudents();
  const { isAuthenticated, isEditorMode } = useAuth();
  const [sortBy, setSortBy] = useState<'name' | 'class' | 'performance'>('name');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const classes = Array.from(new Set(students.map(s => s.class))).sort((a, b) => a - b);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.rollNumber.includes(searchQuery) ||
                           student.parentDetails.father.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           student.parentDetails.mother.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesClass = classFilter === '' || student.class.toString() === classFilter;
      
      return matchesSearch && matchesClass;
    });

    // Sort students
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'class':
          return a.class - b.class || a.name.localeCompare(b.name);
        case 'performance':
          const aPerf = a.academicRecords[0]?.percentage || 0;
          const bPerf = b.academicRecords[0]?.percentage || 0;
          return bPerf - aPerf;
        default:
          return 0;
      }
    });

    return filtered;
  }, [students, searchQuery, classFilter, sortBy]);

  const handleExcelImport = () => {
    // TODO: Implement Excel import functionality
    console.log('Excel import functionality to be implemented');
  };

  const handleExcelExport = () => {
    // TODO: Implement Excel export functionality
    console.log('Excel export functionality to be implemented');
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-red-600 dark:from-white dark:to-red-200 bg-clip-text text-transparent">
            Student Directory
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Complete student profiles and management system
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students, parents, or roll numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-red-700/50 rounded-xl bg-white dark:bg-red-900/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Admin Controls */}
            {isAuthenticated && isEditorMode && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </button>
                <button
                  onClick={handleExcelImport}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Excel
                </button>
                <button
                  onClick={handleExcelExport}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Excel
                </button>
              </div>
            )}
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Class Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-red-700/50 rounded-lg bg-white dark:bg-red-900/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls.toString()}>Class {cls}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'class' | 'performance')}
                className="px-3 py-2 border border-gray-300 dark:border-red-700/50 rounded-lg bg-white dark:bg-red-900/30 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="class">Class</option>
                <option value="performance">Performance</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
              {filteredAndSortedStudents.length} of {students.length} students
            </div>
          </div>
        </div>

        {/* Student Grid */}
        {filteredAndSortedStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 dark:bg-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Students Found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || classFilter 
                ? 'Try adjusting your search criteria or filters.'
                : 'No students have been added yet.'
              }
            </p>
          </div>
        )}
      </div>
      
      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default StudentDetails;