import React from 'react';
import { StudentProvider } from '../../context/StudentContext';
import { StudentDashboard } from './modules/StudentDashboard';
import { StudentProfile } from './modules/StudentProfile';
import { StudentAcademicRecords } from './modules/StudentAcademicRecords';
import { StudentExamination } from './modules/StudentExamination';
import { StudentPlacement } from './modules/StudentPlacement';
import { StudentPrivacyCenter } from './modules/StudentPrivacyCenter';
import { StudentNotifications } from './modules/StudentNotifications';
import { StudentHelpSupport } from './modules/StudentHelpSupport';

function StudentPortalContent({ activeTab = 'dashboard', setActiveTab }) {
  const validTabs = ['dashboard', 'profile', 'academics', 'examination', 'placement', 'privacy', 'notifications', 'help_support'];
  const currentTab = validTabs.includes(activeTab) ? activeTab : 'dashboard';

  return (
    <div className="space-y-4">
      {currentTab === 'dashboard' && (
        <StudentDashboard onNavigateTab={setActiveTab} />
      )}

      {currentTab === 'profile' && (
        <StudentProfile onNavigateTab={setActiveTab} />
      )}

      {currentTab === 'academics' && (
        <StudentAcademicRecords onNavigateTab={setActiveTab} />
      )}

      {currentTab === 'examination' && (
        <StudentExamination onNavigateTab={setActiveTab} />
      )}

      {currentTab === 'placement' && (
        <StudentPlacement onNavigateTab={setActiveTab} />
      )}

      {currentTab === 'privacy' && (
        <StudentPrivacyCenter onNavigateTab={setActiveTab} />
      )}

      {currentTab === 'notifications' && (
        <StudentNotifications onNavigateTab={setActiveTab} />
      )}

      {currentTab === 'help_support' && (
        <StudentHelpSupport onNavigateTab={setActiveTab} />
      )}
    </div>
  );
}

export function StudentPortal({ activeTab = 'dashboard', setActiveTab }) {
  return (
    <StudentProvider>
      <StudentPortalContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </StudentProvider>
  );
}

export default StudentPortal;
