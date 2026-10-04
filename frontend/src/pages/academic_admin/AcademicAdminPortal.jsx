import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CompEngDataProvider, useCompEngData } from '../../context/CompEngDataContext';
import { AcademicAdminHeader } from './components/AcademicAdminHeader';

// Computer Engineering Sub-Modules
import { CompEngDashboard } from './modules/CompEngDashboard';
import { CompEngStudents } from './modules/CompEngStudents';
import { CompEngFaculty } from './modules/CompEngFaculty';
import { CompEngClasses } from './modules/CompEngClasses';
import { CompEngAttendance } from './modules/CompEngAttendance';
import { CompEngSubjects } from './modules/CompEngSubjects';
import { CompEngExams } from './modules/CompEngExams';
import { CompEngAcademics } from './modules/CompEngAcademics';
import { CompEngAnnouncements } from './modules/CompEngAnnouncements';
import { CompEngReports } from './modules/CompEngReports';
import { CompEngAccessHistory } from './modules/CompEngAccessHistory';
import { CompEngHelpSupport } from './modules/CompEngHelpSupport';

function AcademicAdminPortalContent({ activeTab = 'dashboard', setActiveTab }) {
  const { departmentName = 'Computer Engineering' } = useAuth();
  const {
    students,
    classes,
    faculty,
    subjects,
    announcements,
    activities,
    corrections,
    createClass,
    addStudent,
    updateStudent,
    deleteStudent,
    updateClassTeacher,
    addAnnouncement,
    deleteAnnouncement,
    togglePinAnnouncement,
    addSubject,
    reviewCorrection,
  } = useCompEngData();

  const stats = {
    student_count: students.length,
    class_count: classes.length,
    faculty_count: faculty.length,
    pending_corrections: corrections.filter((c) => c.status === 'pending').length,
  };

  return (
    <div className="w-full space-y-4 max-w-full">
      {activeTab !== 'dashboard' && (
        <AcademicAdminHeader onNavigateTab={setActiveTab} />
      )}
      {/* Module Rendering Router */}
      {activeTab === 'dashboard' && (
        <CompEngDashboard
          departmentName={departmentName || 'Computer Engineering'}
          stats={stats}
          classes={classes}
          faculty={faculty}
          students={students}
          corrections={corrections}
          announcements={announcements}
          activities={activities}
          onNavigateTab={setActiveTab || (() => {})}
          onOpenAddStudent={() => setActiveTab && setActiveTab('students')}
          onOpenCreateClass={() => setActiveTab && setActiveTab('classes')}
          onOpenAssignTeacher={() => setActiveTab && setActiveTab('faculty')}
          onOpenAddAnnouncement={() => setActiveTab && setActiveTab('announcements')}
          onReviewCorrection={reviewCorrection}
        />
      )}

      {activeTab === 'students' && (
        <CompEngStudents
          students={students}
          classes={classes}
          onAddStudent={addStudent}
          onUpdateStudent={updateStudent}
          onDeleteStudent={deleteStudent}
          departmentName={departmentName || 'Computer Engineering'}
        />
      )}

      {activeTab === 'faculty' && (
        <CompEngFaculty
          faculty={faculty}
          classes={classes}
          departmentName={departmentName || 'Computer Engineering'}
        />
      )}

      {activeTab === 'classes' && (
        <CompEngClasses
          classes={classes}
          students={students}
          faculty={faculty}
          onCreateClass={createClass}
          departmentName={departmentName || 'Computer Engineering'}
        />
      )}

      {activeTab === 'attendance' && (
        <CompEngAttendance
          students={students}
          classes={classes}
          departmentName={departmentName || 'Computer Engineering'}
        />
      )}

      {activeTab === 'subjects' && (
        <CompEngSubjects
          subjects={subjects}
          classes={classes}
          faculty={faculty}
          onAddSubject={addSubject}
          departmentName={departmentName || 'Computer Engineering'}
        />
      )}

      {activeTab === 'exams' && (
        <CompEngExams
          students={students}
          classes={classes}
          subjects={subjects}
          departmentName={departmentName || 'Computer Engineering'}
        />
      )}

      {activeTab === 'academics' && (
        <CompEngAcademics
          subjects={subjects}
          corrections={corrections}
          classes={classes}
          onAddSubject={addSubject}
          onReviewCorrection={reviewCorrection}
          departmentName={departmentName || 'Computer Engineering'}
        />
      )}

      {activeTab === 'announcements' && (
        <CompEngAnnouncements
          announcements={announcements}
          onAddAnnouncement={addAnnouncement}
          onDeleteAnnouncement={deleteAnnouncement}
          onTogglePin={togglePinAnnouncement}
          departmentName={departmentName || 'Computer Engineering'}
        />
      )}

      {activeTab === 'reports' && (
        <CompEngReports
          students={students}
          classes={classes}
          faculty={faculty}
          departmentName={departmentName || 'Computer Engineering'}
        />
      )}

      {activeTab === 'access_history' && (
        <CompEngAccessHistory
          activities={activities}
          departmentName={departmentName || 'Computer Engineering'}
        />
      )}

      {activeTab === 'help_support' && (
        <CompEngHelpSupport
          departmentName={departmentName || 'Computer Engineering'}
        />
      )}
    </div>
  );
}

export function AcademicAdminPortal(props) {
  return (
    <CompEngDataProvider>
      <AcademicAdminPortalContent {...props} />
    </CompEngDataProvider>
  );
}
