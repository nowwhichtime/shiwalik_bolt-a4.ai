import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, Droplets, Award, BookOpen, Users, Edit3 } from 'lucide-react';
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
      <div className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-gradient-to-br dark:from-red-950 dark:via-red-900 dark:to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Student Not Found</h1>
          <Link
            to="/students"
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdateField = (field: string, value: any) => {
    updateStudent(student.id, { [field]: value });
  };

  const handleUpdateNestedField = (parentField: string, childField: string, value: any) => {
    const updatedParent = { ...student[parentField as keyof typeof student], [childField]: value };
    updateStudent(student.id, { [parentField]: updatedParent });
  };

  const handleUpdateArrayField = (field: string, newArray: string[]) => {
    updateStudent(student.id, { [field]: newArray });
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-gradient-to-br dark:from-red-950 dark:via-red-900 dark:to-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/students"
            className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 dark:bg-red-800/50 dark:hover:bg-red-700/50 text-gray-900 dark:text-white rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Students
          </Link>
          
          {isEditorMode && (
            <div className="flex items-center px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full">
              <Edit3 className="h-4 w-4 mr-2" />
              Editor Mode Active
            </div>
          )}
        </div>

        {/* Student Profile Card */}
        <div className="bg-white dark:bg-red-950/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-red-800/30 overflow-hidden mb-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Student Photo */}
              <div className="flex-shrink-0">
                <EditableImage
                  src={student.photo}
                  alt={student.name}
                  onImageChange={(newSrc) => handleUpdateField('photo', newSrc)}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20"
                />
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <EditableContent
                  content={student.name}
                  onSave={(value) => handleUpdateField('name', value)}
                  className="text-3xl font-bold mb-2"
                />
                
                <div className="flex flex-wrap gap-4 text-red-100 mb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Class </span>
                    <EditableContent
                      content={student.class.toString()}
                      onSave={(value) => handleUpdateField('class', parseInt(value))}
                      className="ml-1"
                    />
                    <EditableContent
                      content={student.section}
                      onSave={(value) => handleUpdateField('section', value)}
                      className="ml-1"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Roll </span>
                    <EditableContent
                      content={student.rollNumber}
                      onSave={(value) => handleUpdateField('rollNumber', value)}
                      className="ml-1"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <Droplets className="h-4 w-4 mr-2" />
                    <EditableContent
                      content={student.bloodGroup}
                      onSave={(value) => handleUpdateField('bloodGroup', value)}
                    />
                  </div>
                </div>

                <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                  <EditableContent
                    content={student.house}
                    onSave={(value) => handleUpdateField('house', value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 dark:bg-red-900/20 rounded-xl">
                    <Calendar className="h-5 w-5 text-red-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                      <EditableContent
                        content={new Date(student.dateOfBirth).toLocaleDateString()}
                        onSave={(value) => handleUpdateField('dateOfBirth', value)}
                        className="font-semibold text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-gray-50 dark:bg-red-900/20 rounded-xl">
                    <MapPin className="h-5 w-5 text-red-600 mr-3 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Address</p>
                      <EditableContent
                        content={student.address}
                        onSave={(value) => handleUpdateField('address', value)}
                        className="text-gray-900 dark:text-white"
                        multiline
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-red-900/20 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Identification Mark</p>
                    <EditableContent
                      content={student.identificationMark}
                      onSave={(value) => handleUpdateField('identificationMark', value)}
                      className="text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Hobbies */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Hobbies & Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {student.hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-300 rounded-full text-sm"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Achievements</h4>
                  <div className="space-y-2">
                    {student.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start">
                        <Award className="h-4 w-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Family Information */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Family Information</h3>
                
                {/* Father Details */}
                <div className="bg-gray-50 dark:bg-red-900/20 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Father</h4>
                  <div className="flex items-start space-x-4">
                    <EditableImage
                      src={student.parentDetails.father.photo}
                      alt={student.parentDetails.father.name}
                      onImageChange={(newSrc) => handleUpdateNestedField('parentDetails', 'father', { ...student.parentDetails.father, photo: newSrc })}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <EditableContent
                        content={student.parentDetails.father.name}
                        onSave={(value) => handleUpdateNestedField('parentDetails', 'father', { ...student.parentDetails.father, name: value })}
                        className="font-semibold text-gray-900 dark:text-white"
                      />
                      <EditableContent
                        content={student.parentDetails.father.occupation}
                        onSave={(value) => handleUpdateNestedField('parentDetails', 'father', { ...student.parentDetails.father, occupation: value })}
                        className="text-gray-600 dark:text-gray-400 text-sm"
                      />
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4 mr-2" />
                        <EditableContent
                          content={student.parentDetails.father.contact}
                          onSave={(value) => handleUpdateNestedField('parentDetails', 'father', { ...student.parentDetails.father, contact: value })}
                        />
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4 mr-2" />
                        <EditableContent
                          content={student.parentDetails.father.email}
                          onSave={(value) => handleUpdateNestedField('parentDetails', 'father', { ...student.parentDetails.father, email: value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mother Details */}
                <div className="bg-gray-50 dark:bg-red-900/20 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Mother</h4>
                  <div className="flex items-start space-x-4">
                    <EditableImage
                      src={student.parentDetails.mother.photo}
                      alt={student.parentDetails.mother.name}
                      onImageChange={(newSrc) => handleUpdateNestedField('parentDetails', 'mother', { ...student.parentDetails.mother, photo: newSrc })}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <EditableContent
                        content={student.parentDetails.mother.name}
                        onSave={(value) => handleUpdateNestedField('parentDetails', 'mother', { ...student.parentDetails.mother, name: value })}
                        className="font-semibold text-gray-900 dark:text-white"
                      />
                      <EditableContent
                        content={student.parentDetails.mother.occupation}
                        onSave={(value) => handleUpdateNestedField('parentDetails', 'mother', { ...student.parentDetails.mother, occupation: value })}
                        className="text-gray-600 dark:text-gray-400 text-sm"
                      />
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4 mr-2" />
                        <EditableContent
                          content={student.parentDetails.mother.contact}
                          onSave={(value) => handleUpdateNestedField('parentDetails', 'mother', { ...student.parentDetails.mother, contact: value })}
                        />
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4 mr-2" />
                        <EditableContent
                          content={student.parentDetails.mother.email}
                          onSave={(value) => handleUpdateNestedField('parentDetails', 'mother', { ...student.parentDetails.mother, email: value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 border border-red-200 dark:border-red-700/50">
                  <h4 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">Emergency Contact</h4>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-red-600 mr-2" />
                    <EditableContent
                      content={student.parentDetails.emergencyContact}
                      onSave={(value) => handleUpdateNestedField('parentDetails', 'emergencyContact', value)}
                      className="font-semibold text-red-800 dark:text-red-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Records */}
        {student.academicRecords.length > 0 && (
          <div className="bg-white dark:bg-red-950/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-red-800/30 p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Academic Records</h3>
            
            {student.academicRecords.map((record, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{record.semester}</h4>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{record.percentage}%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Grade: {record.grade}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {record.subjects.map((subject, subIndex) => (
                    <div key={subIndex} className="bg-gray-50 dark:bg-red-900/20 rounded-xl p-4">
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">{subject.name}</h5>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-red-600">{subject.marks}</span>
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-800/30 text-red-800 dark:text-red-300 rounded text-sm font-semibold">
                          {subject.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;