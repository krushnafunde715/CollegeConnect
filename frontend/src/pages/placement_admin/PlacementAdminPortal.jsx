import React from 'react';
import { PlacementAdminProvider } from '../../context/PlacementAdminContext';
import { ErrorBoundary } from '../../components/ErrorBoundary';

// Placement Admin Sub-Modules
import { PlacementAdminDashboard } from './modules/PlacementAdminDashboard';
import { StudentProfilesModule } from './modules/StudentProfilesModule';
import { PlacementDrivesModule } from './modules/PlacementDrivesModule';
import { CompaniesModule } from './modules/CompaniesModule';
import { ApplicationsModule } from './modules/ApplicationsModule';
import { PlacementAnnouncementsModule } from './modules/PlacementAnnouncementsModule';
import { PlacementReportsModule } from './modules/PlacementReportsModule';
import { PlacementAccessHistoryModule } from './modules/PlacementAccessHistoryModule';
import { PlacementHelpSupportModule } from './modules/PlacementHelpSupportModule';

function PlacementAdminPortalContent({ activeTab = 'dashboard', setActiveTab }) {
  const handleNavigate = (tab) => {
    if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  return (
    <ErrorBoundary onReset={() => handleNavigate('dashboard')}>
      <div className="w-full space-y-6">
        {/* 1. DASHBOARD */}
        {activeTab === 'dashboard' && (
          <PlacementAdminDashboard onNavigateTab={handleNavigate} />
        )}

        {/* 2. STUDENTS / PLACEMENT PROFILES */}
        {activeTab === 'students' && (
          <StudentProfilesModule onNavigateTab={handleNavigate} />
        )}

        {/* 3. PLACEMENT DRIVES */}
        {activeTab === 'drives' && (
          <PlacementDrivesModule onNavigateTab={handleNavigate} />
        )}

        {/* 4. COMPANIES & PARTNERS */}
        {activeTab === 'companies' && (
          <CompaniesModule onNavigateTab={handleNavigate} />
        )}

        {/* 5. APPLICATIONS */}
        {activeTab === 'applications' && (
          <ApplicationsModule onNavigateTab={handleNavigate} />
        )}

        {/* 6. ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <PlacementAnnouncementsModule onNavigateTab={handleNavigate} />
        )}

        {/* 7. REPORTS */}
        {activeTab === 'reports' && (
          <PlacementReportsModule onNavigateTab={handleNavigate} />
        )}

        {/* 8. ACCESS HISTORY */}
        {activeTab === 'access_history' && (
          <PlacementAccessHistoryModule onNavigateTab={handleNavigate} />
        )}

        {/* 9. HELP & SUPPORT */}
        {activeTab === 'help_support' && (
          <PlacementHelpSupportModule onNavigateTab={handleNavigate} />
        )}
      </div>
    </ErrorBoundary>
  );
}

export function PlacementAdminPortal({ activeTab = 'dashboard', setActiveTab }) {
  return (
    <PlacementAdminProvider>
      <PlacementAdminPortalContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </PlacementAdminProvider>
  );
}
