import React, { createContext, useContext, useState, useMemo } from 'react';
import { useToast } from './ToastContext';
import { useCentralData } from './CentralDataContext';

const TeacherContext = createContext(null);

export function TeacherProvider({ children }) {
  const {
    students: allStudents,
    subjects: allSubjects,
    requests: allRequests,
    announcements: allAnnouncements,
    activities: allActivities,
    updateRequestStatus: centralUpdateRequestStatus,
    addAnnouncement: centralAddAnnouncement,
    deleteAnnouncement: centralDeleteAnnouncement,
    updateStudent: centralUpdateStudent,
  } = useCentralData();

  const { success, info } = useToast();

  // Filter students specifically for Prof. Amit Sharma's assigned class: TE Computer Engineering - Division A
  const students = useMemo(() => {
    return allStudents.filter(
      (s) =>
        (s.class === 'TE' || s.class_name === 'TE') &&
        (s.division === 'A' || s.div === 'A')
    );
  }, [allStudents]);

  // Filter subjects for TE Semester V
  const subjects = useMemo(() => {
    return allSubjects.filter(
      (s) => (s.class_name === 'TE' || s.class === 'TE') && s.semester === 'V'
    );
  }, [allSubjects]);

  // Requests related to TE A students or assigned to Prof. Sonal Kadam
  const requests = useMemo(() => {
    const studentPrnSet = new Set(students.map((s) => (s.prn || s.college_id || '').toUpperCase()));
    return allRequests.filter(
      (r) =>
        studentPrnSet.has((r.studentPrn || r.prn || '').toUpperCase()) ||
        r.assignedTo === 'Prof. Sonal Kadam' ||
        !r.assignedTo
    );
  }, [allRequests, students]);

  // Announcements
  const announcements = useMemo(() => {
    return allAnnouncements.filter(
      (a) =>
        a.audience === 'TE Computer Engineering – Division A' ||
        a.audience === 'Class (All)' ||
        a.audience === 'All Students & Faculty' ||
        a.audience === 'TE & BE Students' ||
        a.audience === 'All Students' ||
        a.audience === 'All Users'
    );
  }, [allAnnouncements]);

  const [accessHistory, setAccessHistory] = useState([
    { id: 1, datetime: 'Oct 04, 2026 10:15 AM', action: 'Recorded Attendance', student: 'TE Computer A (All)', dataAccessed: 'Attendance Register', purpose: 'Daily Lecture Attendance' },
    { id: 2, datetime: 'Oct 03, 2026 04:30 PM', action: 'Reviewed Request', student: 'Riya Deshmukh', dataAccessed: 'Student Correction Request', purpose: 'Attendance Credit Verification' },
    { id: 3, datetime: 'Oct 02, 2026 11:20 AM', action: 'Updated Marks', student: 'TE Computer A (All)', dataAccessed: 'Internal Marks Records', purpose: 'Continuous Assessment Evaluation' },
    { id: 4, datetime: 'Sep 29, 2026 09:45 AM', action: 'Published Announcement', student: 'Class (All)', dataAccessed: 'Announcement Feed', purpose: 'Project Synopsis Submission Deadline' },
  ]);

  const events = [
    { id: 1, title: 'Unit Test 2 Commences', date: 'Oct 15, 2026', time: '10:00 AM', venue: 'Hall A-101', type: 'Exam' },
    { id: 2, title: 'Project Phase - I Review', date: 'Oct 10, 2026', time: '02:00 PM', venue: 'Software Lab 3', type: 'Review' },
    { id: 3, title: 'TCS Campus Drive', date: 'Oct 15, 2026', time: '09:00 AM', venue: 'Campus Auditorium', type: 'Placement' },
  ];

  const activities = allActivities;

  // Real Calculated Class Profile and Attendance
  const presentCount = students.filter((s) => s.todayStatus === 'Present' || s.todayStatus !== 'Absent').length;
  const absentCount = students.length - presentCount;
  const attendancePct = students.length > 0 ? Math.round((presentCount / students.length) * 100) : 100;

  const [attendanceStats, setAttendanceStats] = useState({
    date: 'Oct 03, 2026',
    percentage: attendancePct,
    present: presentCount,
    absent: absentCount,
    onLeave: 0,
    late: 0,
    total: students.length,
  });

  const teacherProfile = {
    name: 'Prof. Sonal Kadam',
    role: 'Class Teacher',
    department: 'Computer Engineering',
    assignedClass: 'TE Computer Engineering – Division A',
    academicYear: '2026–27',
    semester: 'V (Current)',
    classStrength: students.length,
    activeCount: students.filter((s) => s.status === 'Active' || s.account_status === 'active').length,
    inactiveCount: students.filter((s) => s.status !== 'Active' && s.account_status !== 'active').length,
    email: 'sonal.kadam@comp.nmiet.edu.in',
  };

  const updateRequestStatus = (id, newStatus, remarks = '') => {
    centralUpdateRequestStatus(id, newStatus, 'Prof. Sonal Kadam');

    const logEntry = {
      id: Date.now(),
      datetime: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: `Request ${newStatus}`,
      student: requests.find((r) => r.id === id)?.studentName || 'Student',
      dataAccessed: 'Student Request',
      purpose: `Actioned as ${newStatus}${remarks ? `: ${remarks}` : ''}`,
    };
    setAccessHistory((prev) => [logEntry, ...prev]);
    success(`Request ${id} marked as "${newStatus}".`);
  };

  const addAnnouncement = (newAnn) => {
    centralAddAnnouncement({
      ...newAnn,
      department: 'Computer Engineering',
      author: 'Prof. Sonal Kadam',
      audience: 'TE Computer Engineering – Division A',
    });

    const logEntry = {
      id: Date.now(),
      datetime: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: 'Published Announcement',
      student: 'Class (All)',
      dataAccessed: 'Announcement Feed',
      purpose: `Published notice: ${newAnn.title}`,
    };
    setAccessHistory((prev) => [logEntry, ...prev]);
    success('Announcement published successfully.');
  };

  const deleteAnnouncement = (id) => {
    centralDeleteAnnouncement(id);
    info('Announcement removed.');
  };

  const updateStudentAttendance = (date, statusMap) => {
    let pres = 0;
    let abs = 0;
    let onLv = 0;
    let lt = 0;

    Object.entries(statusMap).forEach(([studentId, st]) => {
      if (st === 'Present') pres++;
      else if (st === 'Absent') abs++;
      else if (st === 'On Leave') onLv++;
      else if (st === 'Late') lt++;

      centralUpdateStudent(studentId, {
        todayStatus: st,
      });
    });

    const total = students.length || 1;
    const pct = Math.round((pres / total) * 100);
    setAttendanceStats({
      date,
      percentage: pct,
      present: pres,
      absent: abs,
      onLeave: onLv,
      late: lt,
      total: students.length,
    });

    const logEntry = {
      id: Date.now(),
      datetime: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: 'Recorded Attendance',
      student: 'TE Computer A (All)',
      dataAccessed: 'Class Register',
      purpose: `Attendance for ${date} (${pres} Present, ${abs} Absent)`,
    };
    setAccessHistory((prev) => [logEntry, ...prev]);
    success(`Attendance for ${date} saved: ${pres} Present, ${abs} Absent.`);
  };

  return (
    <TeacherContext.Provider
      value={{
        teacherProfile,
        students,
        subjects,
        requests,
        announcements,
        accessHistory,
        events,
        activities,
        attendanceStats,
        updateRequestStatus,
        addAnnouncement,
        deleteAnnouncement,
        updateStudentAttendance,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeacher() {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error('useTeacher must be used within a TeacherProvider');
  }
  return context;
}
