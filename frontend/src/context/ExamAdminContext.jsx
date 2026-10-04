import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useToast } from './ToastContext';
import { useCentralData } from './CentralDataContext';

const ExamAdminContext = createContext(null);

export function ExamAdminProvider({ children }) {
  const {
    students: allStudents,
    exams: allExams,
    examResults: allExamResults,
    announcements: allAnnouncements,
    updateStudent: centralUpdateStudent,
    addAnnouncement: centralAddAnnouncement,
    deleteAnnouncement: centralDeleteAnnouncement,
    publishExamResult: centralPublishExamResult,
  } = useCentralData();

  const { success, info } = useToast();

  const students = allStudents;
  const exams = allExams;
  const schedules = allExams;
  const results = allExamResults;

  const announcements = useMemo(() => {
    return allAnnouncements.filter(
      (a) =>
        a.department === 'Examination Department' ||
        a.category === 'Examination' ||
        a.audience === 'All Students' ||
        a.audience === 'All Users'
    );
  }, [allAnnouncements]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: 'Published Result Gazette', details: 'Published Results for Data Structures & Algorithms SE', user: 'Prof. Akash Mhetre', timestamp: '02 Oct 2026 11:30 AM', type: 'Result' },
    { id: 2, action: 'Published Result Gazette', details: 'Published Results for Database Management Systems SE', user: 'Prof. Akash Mhetre', timestamp: '28 Sep 2026 03:15 PM', type: 'Result' },
    { id: 3, action: 'Generated Hall Tickets', details: 'Generated Hall Tickets for TE Computer A & B (17 Candidates)', user: 'Prof. Akash Mhetre', timestamp: '25 Sep 2026 09:45 AM', type: 'Hall Ticket' },
    { id: 4, action: 'Created Exam Schedule', details: 'Scheduled Unit Test 2 & In-Sem Exam timetable', user: 'Prof. Akash Mhetre', timestamp: '20 Sep 2026 02:00 PM', type: 'Schedule' },
  ]);

  const logAction = useCallback((action, details) => {
    const newLog = {
      id: Date.now(),
      action,
      details,
      user: 'Prof. Akash Mhetre',
      timestamp: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      type: 'Activity',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  }, []);

  const createSchedule = (sched) => {
    logAction('Created Exam Schedule', `Added exam schedule for ${sched.name}`);
    success(`Exam schedule for "${sched.name}" created.`);
  };

  const updateSchedule = (id, updated) => {
    logAction('Updated Exam Schedule', `Modified exam schedule ID #${id}`);
    success('Schedule updated successfully.');
  };

  const deleteSchedule = (id) => {
    logAction('Deleted Exam Schedule', `Removed schedule ID #${id}`);
    info('Schedule removed.');
  };

  const createExam = (examData) => {
    logAction('Created Exam', `Created exam entry "${examData.name}"`);
    success(`Exam "${examData.name}" created successfully.`);
  };

  const updateExam = (id, updated) => {
    logAction('Updated Exam', `Updated exam entry #${id}`);
    success('Exam details updated.');
  };

  const deleteExam = (id) => {
    logAction('Deleted Exam', `Deleted exam #${id}`);
    info('Exam removed.');
  };

  const updateStudentMarks = (prn, internalMarks, endSemMarks) => {
    const total = (Number(internalMarks) || 0) + (Number(endSemMarks) || 0);
    const result = total >= 40 ? 'Pass' : 'Fail';
    centralUpdateStudent(prn, {
      internal_marks: Number(internalMarks),
      internal: Number(internalMarks),
      endSem: Number(endSemMarks),
      total,
      result,
    });
    logAction('Updated Marks', `Updated scores for candidate ${prn} (Total: ${total})`);
    success(`Marks updated for candidate ${prn}.`);
  };

  const batchSaveInternalMarks = (marksList) => {
    marksList.forEach(({ prn, internal }) => {
      centralUpdateStudent(prn, {
        internal_marks: Number(internal),
        internal: Number(internal),
      });
    });
    logAction('Batch Saved Marks', `Saved internal marks for ${marksList.length} candidates`);
    success(`Internal marks successfully saved for ${marksList.length} students.`);
  };

  const publishResult = (id) => {
    centralPublishExamResult(id);
    logAction('Published Results', `Published results gazette for ID #${id}`);
    success(`Result gazette published.`);
  };

  const unpublishResult = (id) => {
    logAction('Unpublished Results', `Reverted gazette to Draft for ID #${id}`);
    info(`Result reverted to draft.`);
  };

  const generateHallTicketsForClass = (targetClass) => {
    students.forEach((s) => {
      if (!targetClass || targetClass === 'All Classes' || s.class === targetClass || s.class_name === targetClass) {
        centralUpdateStudent(s.id, { hallTicketStatus: 'Generated' });
      }
    });
    logAction('Generated Hall Tickets', `Generated hall tickets for ${targetClass || 'All Classes'}`);
    success(`Hall tickets generated successfully for ${targetClass || 'All Classes'}.`);
  };

  const regenerateSingleHallTicket = (prn) => {
    centralUpdateStudent(prn, { hallTicketStatus: 'Generated' });
    logAction('Regenerated Hall Ticket', `Regenerated hall ticket for candidate ${prn}`);
    success(`Hall ticket regenerated for ${prn}.`);
  };

  const createAnnouncement = (annData) => {
    centralAddAnnouncement({
      ...annData,
      department: 'Examination Department',
      author: 'Prof. Akash Mhetre',
    });
    logAction('Created Announcement', `Posted announcement "${annData.title}"`);
    success('Announcement broadcasted successfully.');
  };

  const updateAnnouncement = (id, updatedData) => {
    logAction('Updated Announcement', `Updated announcement ID #${id}`);
    success('Announcement updated.');
  };

  const deleteAnnouncement = (id) => {
    centralDeleteAnnouncement(id);
    logAction('Deleted Announcement', `Removed announcement ID #${id}`);
    success('Announcement removed.');
  };

  return (
    <ExamAdminContext.Provider
      value={{
        students,
        schedules,
        exams,
        results,
        announcements,
        auditLogs,
        createSchedule,
        updateSchedule,
        deleteSchedule,
        createExam,
        updateExam,
        deleteExam,
        updateStudentMarks,
        batchSaveInternalMarks,
        publishResult,
        unpublishResult,
        generateHallTicketsForClass,
        regenerateSingleHallTicket,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        logAction,
      }}
    >
      {children}
    </ExamAdminContext.Provider>
  );
}

export function useExamAdmin() {
  const context = useContext(ExamAdminContext);
  if (!context) {
    throw new Error('useExamAdmin must be used within an ExamAdminProvider');
  }
  return context;
}
