import React from 'react';
import { ExamAdminProvider } from '../../context/ExamAdminContext';

// Examination Admin Sub-Modules
import { ExamAdminDashboard } from './modules/ExamAdminDashboard';
import { ExamScheduleModule } from './modules/ExamScheduleModule';
import { ExamManagementModule } from './modules/ExamManagementModule';
import { StudentExamRecordsModule } from './modules/StudentExamRecordsModule';
import { InternalMarksModule } from './modules/InternalMarksModule';
import { ResultsManagementModule } from './modules/ResultsManagementModule';
import { HallTicketsModule } from './modules/HallTicketsModule';
import { ExamReportsModule } from './modules/ExamReportsModule';
import { AnnouncementsModule } from './modules/AnnouncementsModule';
import { AccessHistoryModule } from './modules/AccessHistoryModule';
import { HelpSupportModule } from './modules/HelpSupportModule';

function ExamAdminPortalContent({ activeTab = 'dashboard', setActiveTab }) {
  return (
    <div className="w-full space-y-6">
      {/* 1. DASHBOARD */}
      {activeTab === 'dashboard' && (
        <ExamAdminDashboard onNavigateTab={setActiveTab || (() => {})} />
      )}

      {/* 2. EXAM SCHEDULE */}
      {activeTab === 'schedules' && (
        <ExamScheduleModule onNavigateTab={setActiveTab || (() => {})} />
      )}

      {/* 3. EXAM MANAGEMENT */}
      {activeTab === 'exam_management' && (
        <ExamManagementModule onNavigateTab={setActiveTab || (() => {})} />
      )}

      {/* 4. STUDENT EXAMINATION RECORDS */}
      {activeTab === 'student_records' && (
        <StudentExamRecordsModule onNavigateTab={setActiveTab || (() => {})} />
      )}

      {/* 5. INTERNAL MARKS */}
      {activeTab === 'internal_marks' && (
        <InternalMarksModule onNavigateTab={setActiveTab || (() => {})} />
      )}

      {/* 6. RESULTS MANAGEMENT */}
      {activeTab === 'results' && (
        <ResultsManagementModule onNavigateTab={setActiveTab || (() => {})} />
      )}

      {/* 7. HALL TICKETS */}
      {activeTab === 'hall_tickets' && (
        <HallTicketsModule onNavigateTab={setActiveTab || (() => {})} />
      )}

      {/* 8. EXAMINATION REPORTS */}
      {activeTab === 'reports' && (
        <ExamReportsModule onNavigateTab={setActiveTab || (() => {})} />
      )}

      {/* 9. ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <AnnouncementsModule onNavigateTab={setActiveTab || (() => {})} />
      )}

      {/* 10. ACCESS HISTORY */}
      {activeTab === 'access_history' && (
        <AccessHistoryModule onNavigateTab={setActiveTab || (() => {})} />
      )}

      {/* 11. HELP & SUPPORT */}
      {activeTab === 'help_support' && (
        <HelpSupportModule onNavigateTab={setActiveTab || (() => {})} />
      )}
    </div>
  );
}

export function ExamAdminPortal({ activeTab = 'dashboard', setActiveTab }) {
  return (
    <ExamAdminProvider>
      <ExamAdminPortalContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </ExamAdminProvider>
  );
}
