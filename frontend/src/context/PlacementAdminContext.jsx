import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useToast } from './ToastContext';
import { useCentralData } from './CentralDataContext';

const PlacementAdminContext = createContext(null);

export function PlacementAdminProvider({ children }) {
  const {
    students: allStudents,
    companies: allCompanies,
    placementDrives: allDrives,
    placementApplications: allApplications,
    announcements: allAnnouncements,
    addPlacementDrive: centralAddDrive,
    addCompany: centralAddCompany,
    updateStudent: centralUpdateStudent,
    addAnnouncement: centralAddAnnouncement,
    deleteAnnouncement: centralDeleteAnnouncement,
  } = useCentralData();

  const { success, info } = useToast();

  const students = allStudents;
  const companies = allCompanies;
  const drives = allDrives;
  const applications = allApplications;

  const announcements = useMemo(() => {
    return allAnnouncements.filter(
      (a) =>
        a.department === 'Placement Department' ||
        a.category === 'Placement' ||
        a.audience === 'TE & BE Students' ||
        a.audience === 'All Students' ||
        a.audience === 'All Users'
    );
  }, [allAnnouncements]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: 'Published Placement Drive', details: 'Announced TCS Digital & Ninja Hiring 2026-27 (7.5 LPA)', user: 'Prof. Satyajit Sirsat', timestamp: '02 Oct 2026 02:15 PM', type: 'Drive' },
    { id: 2, action: 'Updated Student Status', details: 'Rahul Deshmukh marked as Placed (TCS, 7.5 LPA)', user: 'Prof. Satyajit Sirsat', timestamp: '25 Sep 2026 05:30 PM', type: 'Student' },
    { id: 3, action: 'Shortlisted Candidates', details: 'Shortlisted 3 candidates for Infosys Specialist Programmer Round 1', user: 'Prof. Satyajit Sirsat', timestamp: '24 Sep 2026 11:00 AM', type: 'Application' },
    { id: 4, action: 'Added Partner Company', details: 'Added Capgemini to active recruiters directory', user: 'Prof. Satyajit Sirsat', timestamp: '20 Sep 2026 10:45 AM', type: 'Company' },
  ]);

  const logAction = useCallback((action, details) => {
    const newLog = {
      id: Date.now(),
      action,
      details,
      user: 'Prof. Satyajit Sirsat',
      timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      type: 'Activity',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, []);

  const addDrive = (driveData) => {
    const newDrive = centralAddDrive(driveData);
    logAction('Added Drive', `Scheduled placement drive for ${driveData.company}`);
    success(`Placement drive for ${driveData.company} added.`);
    return newDrive;
  };

  const updateDrive = (id, updated) => {
    logAction('Updated Drive', `Updated placement drive ID #${id}`);
    success('Placement drive updated successfully.');
  };

  const deleteDrive = (id) => {
    logAction('Deleted Drive', `Removed placement drive ID #${id}`);
    info('Placement drive removed.');
  };

  const addCompany = (companyData) => {
    const newComp = centralAddCompany(companyData);
    logAction('Added Company', `Added ${companyData.name} to partners`);
    success(`Company "${companyData.name}" added successfully.`);
    return newComp;
  };

  const updateCompany = (id, updated) => {
    logAction('Updated Company', `Updated company profile #${id}`);
    success('Company profile updated.');
  };

  const deleteCompany = (id) => {
    logAction('Deleted Company', `Removed company #${id}`);
    info('Company removed.');
  };

  const updateStudentProfile = (prn, updatedData) => {
    centralUpdateStudent(prn, updatedData);
    logAction('Updated Student Profile', `Updated placement profile for ${prn}`);
    success(`Placement record for ${prn} updated.`);
  };

  const updateApplicationStatus = (appId, newStatus) => {
    logAction('Updated Application', `Application #${appId} updated to ${newStatus}`);
    success(`Application #${appId} marked as "${newStatus}".`);
  };

  const deleteApplication = (appId) => {
    logAction('Deleted Application', `Removed application #${appId}`);
    info('Application removed.');
  };

  const addAnnouncement = (annData) => {
    centralAddAnnouncement({
      ...annData,
      department: 'Placement Department',
      author: 'Prof. Satyajit Sirsat',
      category: 'Placement',
    });
    logAction('Published Announcement', `Posted placement bulletin "${annData.title}"`);
    success('Placement announcement published.');
  };

  const updateAnnouncement = (id, updatedData) => {
    logAction('Updated Announcement', `Updated bulletin ID #${id}`);
    success('Announcement updated.');
  };

  const deleteAnnouncement = (id) => {
    centralDeleteAnnouncement(id);
    logAction('Deleted Announcement', `Removed bulletin ID #${id}`);
    info('Announcement removed.');
  };

  return (
    <PlacementAdminContext.Provider
      value={{
        students,
        drives,
        companies,
        applications,
        announcements,
        auditLogs,
        addDrive,
        updateDrive,
        deleteDrive,
        addCompany,
        updateCompany,
        deleteCompany,
        updateStudentProfile,
        updateApplicationStatus,
        deleteApplication,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        logAction,
      }}
    >
      {children}
    </PlacementAdminContext.Provider>
  );
}

export function usePlacementAdmin() {
  const context = useContext(PlacementAdminContext);
  if (!context) {
    throw new Error('usePlacementAdmin must be used within a PlacementAdminProvider');
  }
  return context;
}
