import React from 'react';
import { TeacherProvider } from '../../context/TeacherContext';
import { TeacherHeader } from './components/TeacherHeader';
import { TeacherDashboard } from './modules/TeacherDashboard';
import { TeacherStudents } from './modules/TeacherStudents';
import { TeacherAcademicRecords } from './modules/TeacherAcademicRecords';
import { TeacherAttendance } from './modules/TeacherAttendance';
import { TeacherStudentRequests } from './modules/TeacherStudentRequests';
import { TeacherAnnouncements } from './modules/TeacherAnnouncements';
import { TeacherAccessHistory } from './modules/TeacherAccessHistory';
import { TeacherHelpSupport } from './modules/TeacherHelpSupport';
import { ErrorBoundary } from '../../components/ErrorBoundary';

function TeacherPortalContent({ activeTab, setActiveTab }) {
  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TeacherDashboard onNavigateTab={setActiveTab} />;
      case 'students':
      case 'classes':
        return <TeacherStudents onNavigateTab={setActiveTab} />;
      case 'academic_records':
      case 'marks':
        return <TeacherAcademicRecords onNavigateTab={setActiveTab} />;
      case 'attendance':
        return <TeacherAttendance onNavigateTab={setActiveTab} />;
      case 'requests':
        return <TeacherStudentRequests onNavigateTab={setActiveTab} />;
      case 'announcements':
        return <TeacherAnnouncements onNavigateTab={setActiveTab} />;
      case 'access_history':
        return <TeacherAccessHistory onNavigateTab={setActiveTab} />;
      case 'help_support':
        return <TeacherHelpSupport onNavigateTab={setActiveTab} />;
      default:
        return <TeacherDashboard onNavigateTab={setActiveTab} />;
    }
  };

  return (
    <div className="w-full transition-all duration-200 space-y-4 max-w-full">
      {activeTab !== 'dashboard' && (
        <TeacherHeader onNavigateTab={setActiveTab} />
      )}
      <ErrorBoundary onReset={() => setActiveTab && setActiveTab('dashboard')}>
        {renderModule()}
      </ErrorBoundary>
    </div>
  );
}

export function TeacherPortal({ activeTab = 'dashboard', setActiveTab }) {
  return (
    <TeacherProvider>
      <TeacherPortalContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </TeacherProvider>
  );
}
