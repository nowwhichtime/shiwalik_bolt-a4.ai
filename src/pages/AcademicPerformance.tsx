import React, { useState, useMemo } from 'react';
import { TrendingUp, Award, Users, BookOpen } from 'lucide-react';
import { useStudents } from '../contexts/StudentContext';
import { useAuth } from '../contexts/AuthContext';
import EditableContent from '../components/ui/EditableContent';

const AcademicPerformance: React.FC = () => {
  const { isEditorMode } = useAuth();
  const { students } = useStudents();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [pageContent, setPageContent] = useState({
    title: 'Academic Performance',
    subtitle: 'Track academic excellence and achievements across all classes'
  });

  const classes = Array.from(new Set(students.map(s => s.class))).sort((a, b) => a - b);

  const classData = useMemo(() => {
    return classes.map(cls => {
      const classStudents = students.filter(s => s.class === cls);
      const studentsWithRecords = classStudents.filter(s => s.academicRecords.length > 0);
      
      if (studentsWithRecords.length === 0) {
        return {
          class: cls,
          students: classStudents,
          averagePercentage: 0,
          topPerformers: [],
          totalStudents: classStudents.length
        };
      }

      const averagePercentage = studentsWithRecords.reduce((sum, student) => 
        sum + student.academicRecords[0].percentage, 0) / studentsWithRecords.length;

      const topPerformers = studentsWithRecords
        .sort((a, b) => b.academicRecords[0].percentage - a.academicRecords[0].percentage)
        .slice(0, 3);

      return {
        class: cls,
        students: classStudents,
        averagePercentage: Math.round(averagePercentage * 10) / 10,
        topPerformers,
        totalStudents: classStudents.length
      };
    });
  }, [students, classes]);

  const filteredData = selectedClass 
    ? classData.filter(data => data.class.toString() === selectedClass)
    : classData;

  const overallStats = {
    totalStudents: students.length,
    averagePercentage: Math.round((classData.reduce((sum, data) => 
      sum + (data.averagePercentage * data.totalStudents), 0) / students.length) * 10) / 10,
    topAchievers: students.reduce((sum, student) => sum + student.achievements.length, 0),
    excellenceRate: Math.round((students.filter(s => 
      s.academicRecords.length > 0 && s.academicRecords[0].percentage >= 90).length / students.length) * 100)
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-purple-600 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">
            <EditableContent
              content={pageContent.title}
              onSave={(value) => setPageContent(prev => ({ ...prev, title: value }))}
            />
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            <EditableContent
              content={pageContent.subtitle}
              onSave={(value) => setPageContent(prev => ({ ...prev, subtitle: value }))}
            />
          </p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{overallStats.totalStudents}</h3>
            <p className="text-blue-300">Students</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Average</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{overallStats.averagePercentage}%</h3>
            <p className="text-purple-300">Performance</p>
          </div>

          <div className="bg-gradient-to-br from-pink-900/50 to-pink-800/50 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-8 w-8 text-pink-400" />
              <span className="text-pink-300 text-sm font-medium">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{overallStats.topAchievers}</h3>
            <p className="text-pink-300">Achievements</p>
          </div>

          <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30">
            <div className="flex items-center justify-between mb-4">
              <BookOpen className="h-8 w-8 text-orange-400" />
              <span className="text-orange-300 text-sm font-medium">Excellence</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{overallStats.excellenceRate}%</h3>
            <p className="text-orange-300">Rate (90%+)</p>
          </div>
        </div>

        {/* Class Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedClass('')}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                selectedClass === '' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
              }`}
            >
              All Classes
            </button>
            {classes.map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls.toString())}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  selectedClass === cls.toString()
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
                }`}
              >
                Class {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Class Performance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredData.map(classInfo => (
            <div
              key={classInfo.class}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 overflow-hidden"
            >
              {/* Class Header */}
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Class {classInfo.class}</h3>
                    <p className="text-gray-300">{classInfo.totalStudents} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-purple-400">{classInfo.averagePercentage}%</p>
                    <p className="text-gray-300 text-sm">Average</p>
                  </div>
                </div>
              </div>

              {/* Top Performers */}
              <div className="p-6">
                <h4 className="text-lg font-bold text-white mb-4">Top Performers</h4>
                {classInfo.topPerformers.length > 0 ? (
                  <div className="space-y-3">
                    {classInfo.topPerformers.map((student, index) => (
                      <div
                        key={student.id}
                        className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            'bg-amber-600 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20">
                            <img
                              src={student.photo}
                              alt={student.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=8b5cf6&color=fff&size=48`;
                              }}
                            />
                          </div>

                          <div className="flex-1">
                            <h5 className="font-semibold text-white">{student.name}</h5>
                            <p className="text-gray-400 text-sm">Roll {student.rollNumber}</p>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold text-purple-400">
                              {student.academicRecords[0]?.percentage || 0}%
                            </p>
                            <p className="text-sm text-gray-400">
                              {student.academicRecords[0]?.grade || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-6">No academic records available</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Highlights */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Recent Achievements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.filter(s => s.achievements.length > 0).slice(0, 6).map(student => (
              <div
                key={student.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-yellow-400/50">
                    <img
                      src={student.photo}
                      alt={student.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=8b5cf6&color=fff&size=48`;
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{student.name}</h4>
                    <p className="text-gray-400 text-sm">Class {student.class}{student.section}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {student.achievements.slice(0, 2).map((achievement, index) => (
                    <div key={index} className="flex items-start">
                      <Award className="h-4 w-4 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{achievement}</span>
                    </div>
                  ))}
                  {student.achievements.length > 2 && (
                    <p className="text-purple-300 text-sm">
                      +{student.achievements.length - 2} more achievements
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicPerformance;