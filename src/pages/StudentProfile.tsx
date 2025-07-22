import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit3, Phone, Mail, Award, Heart, MapPin, Calendar, Hash } from 'lucide-react';
import { useStudents } from '../contexts/StudentContext';
import { useAuth } from '../contexts/AuthContext';
import EditableContent from '../components/ui/EditableContent';
import EditableImage from '../components/ui/EditableImage';

const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { students, updateStudent } = useStudents();
  const { isEditorMode } = useAuth();
  
  const student = students.find(s => s.id === id);

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Student Not Found</h2>
          <Link
            to="/students"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Students
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdateField = (field: string, value: any) => {
    if (student) {
      updateStudent(student.id, { [field]: value });
    }
  };

  const handleUpdateNestedField = (parentField: string, childField: string, value: any) => {
    if (student) {
      updateStudent(student.id, {
        [parentField]: {
          ...student[parentField as keyof typeof student],
          [childField]: value
        }
      });
    }
  };

  const InfoCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = 
    ({ title, children, className = '' }) => (
      <div className={`bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30 transition-all duration-300 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
          {isEditorMode && (
            <button className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
              <Edit3 className="h-4 w-4" />
            </button>
          )}
        </div>
        {children}
      </div>
    );

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-transparent">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/students"
            className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Students
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                <EditableContent
                  content={student.name}
                  onSave={(value) => handleUpdateField('name', value)}
                  className="text-4xl font-bold text-gray-900 dark:text-white"
                />
              </h1>
              <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
                <span>
                  Class <EditableContent
                    content={student.class.toString()}
                    onSave={(value) => handleUpdateField('class', parseInt(value))}
                  />
                  <EditableContent
                    content={student.section}
                    onSave={(value) => handleUpdateField('section', value)}
                  />
                </span>
                <span>•</span>
                <span>
                  Roll <EditableContent
                    content={student.rollNumber}
                    onSave={(value) => handleUpdateField('rollNumber', value)}
                  />
                </span>
                <span>•</span>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full">
                  <EditableContent
                    content={student.house}
                    onSave={(value) => handleUpdateField('house', value)}
                  /> House
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info & Photo */}
          <div className="lg:col-span-1 space-y-8">
            {/* Student Photo */}
            <div className="bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-white/20 hover:border-gray-300 dark:hover:border-white/30 transition-all duration-300">
              <div className="relative">
                <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-gray-200 dark:border-white/20 mb-4">
                  <EditableImage
                    src={student.photo}
                    alt={student.name}
                    onImageChange={(newSrc) => handleUpdateField('photo', newSrc)}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <InfoCard title="Personal Information">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Calendar className="h-5 w-5 mr-3 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      <EditableContent
                        content={student.dateOfBirth}
                        onSave={(value) => handleUpdateField('dateOfBirth', value)}
                        placeholder="YYYY-MM-DD"
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Heart className="h-5 w-5 mr-3 text-red-500 dark:text-red-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Blood Group</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      <EditableContent
                        content={student.bloodGroup}
                        onSave={(value) => handleUpdateField('bloodGroup', value)}
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Hash className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Identification Mark</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      <EditableContent
                        content={student.identificationMark}
                        onSave={(value) => handleUpdateField('identificationMark', value)}
                        type="textarea"
                      />
                    </p>
                  </div>
                </div>

                <div className="flex items-start text-gray-600 dark:text-gray-300">
                  <MapPin className="h-5 w-5 mr-3 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      <EditableContent
                        content={student.address}
                        onSave={(value) => handleUpdateField('address', value)}
                        type="textarea"
                      />
                    </p>
                  </div>
                </div>
              </div>
            </InfoCard>

            {/* Hobbies & Interests */}
            <InfoCard title="Hobbies & Interests">
              <div className="flex flex-wrap gap-2">
                {student.hobbies.map((hobby, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-sm font-medium"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </InfoCard>
          </div>

          {/* Right Column - Family & Academic Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Family Information */}
            <InfoCard title="Family Information">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Father */}
                <div className="text-center">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-blue-500/30 mx-auto mb-4">
                    <img
                      src={student.parentDetails.father.photo}
                      alt={student.parentDetails.father.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.parentDetails.father.name)}&background=3b82f6&color=fff&size=96`;
                      }}
                    />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{student.parentDetails.father.name}</h4>
                  <p className="text-blue-300 text-sm mb-3">{student.parentDetails.father.occupation}</p>
                  <div className="space-y-2">
                    <a
                      href={`tel:${student.parentDetails.father.contact}`}
                      className="flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">{student.parentDetails.father.contact}</span>
                    </a>
                    <a
                      href={`mailto:${student.parentDetails.father.email}`}
                      className="flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm">{student.parentDetails.father.email}</span>
                    </a>
                  </div>
                </div>

                {/* Mother */}
                <div className="text-center">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-pink-500/30 mx-auto mb-4">
                    <img
                      src={student.parentDetails.mother.photo}
                      alt={student.parentDetails.mother.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.parentDetails.mother.name)}&background=ec4899&color=fff&size=96`;
                      }}
                    />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{student.parentDetails.mother.name}</h4>
                  <p className="text-pink-300 text-sm mb-3">{student.parentDetails.mother.occupation}</p>
                  <div className="space-y-2">
                    <a
                      href={`tel:${student.parentDetails.mother.contact}`}
                      className="flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">{student.parentDetails.mother.contact}</span>
                    </a>
                    <a
                      href={`mailto:${student.parentDetails.mother.email}`}
                      className="flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="text-sm">{student.parentDetails.mother.email}</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-center">
                  <Phone className="h-5 w-5 mr-3 text-red-400" />
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Emergency Contact</p>
                    <a
                      href={`tel:${student.parentDetails.emergencyContact}`}
                      className="text-white font-medium hover:text-red-300 transition-colors"
                    >
                      {student.parentDetails.emergencyContact}
                    </a>
                  </div>
                </div>
              </div>
            </InfoCard>

            {/* Academic Performance */}
            <InfoCard title="Academic Performance">
              {student.academicRecords.length > 0 ? (
                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-bold text-white mb-2">
                      {student.academicRecords[0].semester}
                    </h4>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-400">
                          {student.academicRecords[0].percentage}%
                        </p>
                        <p className="text-gray-400 text-sm">Overall</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-pink-400">
                          {student.academicRecords[0].grade}
                        </p>
                        <p className="text-gray-400 text-sm">Grade</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {student.academicRecords[0].subjects.map((subject, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-semibold text-white">{subject.name}</h5>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            subject.grade === 'A+' ? 'bg-green-100 text-green-700' :
                            subject.grade === 'A' ? 'bg-blue-100 text-blue-700' :
                            subject.grade === 'B+' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {subject.grade}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-white">{subject.marks}</span>
                          <span className="text-gray-400 text-sm">/ 100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No academic records available</p>
              )}
            </InfoCard>

            {/* Achievements */}
            <InfoCard title="Achievements & Awards">
              {student.achievements.length > 0 ? (
                <div className="space-y-3">
                  {student.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-yellow-500/30 transition-all duration-300"
                    >
                      <Award className="h-6 w-6 text-yellow-400 mr-4 flex-shrink-0" />
                      <span className="text-white font-medium">{achievement}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No achievements recorded</p>
              )}
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;