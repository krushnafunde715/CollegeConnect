import React, { createContext, useContext, useState, useMemo } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';
import { useCentralData } from './CentralDataContext';

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const { user } = useAuth();
  const {
    students: allStudents,
    subjects: allSubjects,
    exams: allExams,
    examResults: allExamResults,
    placementDrives: allDrives,
    placementApplications: allApplications,
    announcements: allAnnouncements,
    requests: allRequests,
    submitPlacementApplication: centralSubmitApplication,
  } = useCentralData();

  const { success } = useToast();

  // Reference Student: Krushna Funde (ID: 1, PRN: 22CE001)
  const baseStudent = useMemo(() => {
    return (
      allStudents.find((s) => s.id === 1 || s.prn === '22CE001' || s.name === 'Krushna Funde') ||
      allStudents[0] ||
      {}
    );
  }, [allStudents]);

  const studentProfile = useMemo(() => {
    const displayName = user?.full_name || baseStudent.name || 'Krushna Funde';
    const displayFullName = baseStudent.fullName || baseStudent.full_name || 'Krushna Ashok Funde';
    const displayEmail = user?.email || baseStudent.email || 'krushna.funde@comp.nmiet.edu.in';
    const displayPrn = user?.college_id || baseStudent.prn || '22CE001';

    return {
      id: baseStudent.id || 1,
      name: displayName,
      fullName: displayFullName,
      program: 'BE Computer Engineering',
      department: baseStudent.department || 'Computer Engineering',
      prn: displayPrn,
      rollNo: baseStudent.rollNo || baseStudent.roll || '01',
      academicYear: '2026–27',
      admissionYear: '2023',
      currentYear: 'Third Year (TE)',
      class: 'TE Computer Engineering',
      division: baseStudent.division || 'A',
      batch: '2023 - 2027',
      semester: 'Semester V (Current)',
      email: displayEmail,
      phone: baseStudent.phone || '+91 98765 43210',
      dob: '15 May 2004',
      address: 'Talegaon Dabhade, Pune 410506',
      bloodGroup: 'B+',
      admissionCategory: 'Open / CAP',
      status: 'Active Student',
      cgpa: baseStudent.cgpa || '8.85',
      attendance: baseStudent.attendance || '93%',
      emergencyContact: {
        name: 'Ashok Funde (Father)',
        relation: 'Father',
        phone: '+91 98221 99881',
        address: 'Talegaon Dabhade, Pune 410506',
      },
      guardianContact: '+91 98221 99881',
    };
  }, [baseStudent, user]);

  // Current Semester Subjects for TE V
  const subjects = useMemo(() => {
    const teSubs = allSubjects.filter((s) => s.class_name === 'TE' || s.semester === 'V');
    return teSubs.map((sub, idx) => {
      const internals = [26, 24, 27, 23, 25, 28];
      const externals = [62, 58, 64, 56, 60, 67];
      const internal = internals[idx % internals.length];
      const external = externals[idx % externals.length];
      const total = internal + external;
      const grade = total >= 90 ? 'O' : total >= 80 ? 'A+' : total >= 70 ? 'A' : 'B+';
      return {
        code: sub.code,
        name: sub.name,
        credits: sub.credits,
        attendance: `${85 + (idx % 10)}%`,
        internal,
        external,
        total,
        grade,
      };
    });
  }, [allSubjects]);

  // Exam Results
  const examResults = [
    { code: '310241', name: 'Discrete Mathematics', credits: 4, grade: 'A', marks: 78, status: 'Passed' },
    { code: '310242', name: 'Data Structures & Algorithms', credits: 4, grade: 'A+', marks: 88, status: 'Passed' },
    { code: '310243', name: 'Database Management Systems', credits: 4, grade: 'O', marks: 92, status: 'Passed' },
    { code: '310244', name: 'Computer Graphics', credits: 3, grade: 'A', marks: 81, status: 'Passed' },
    { code: '310245', name: 'Digital Electronics', credits: 3, grade: 'B+', marks: 74, status: 'Passed' },
  ];

  // Exam Timetable from central exams
  const examTimetable = useMemo(() => {
    return allExams.map((ex) => ({
      date: ex.date || 'Nov 12, 2026',
      time: ex.time || '10:00 AM - 01:00 PM',
      code: `410${ex.id}01`,
      name: ex.name,
      hall: ex.venue || 'Hall A-204',
    }));
  }, [allExams]);

  // Placement Opportunities mapped to Krushna's applications
  const opportunities = useMemo(() => {
    return allDrives.map((d) => {
      const app = allApplications.find(
        (a) => (a.driveId === d.id || a.company === d.company) && (a.studentPrn === studentProfile.prn || a.studentId === studentProfile.id)
      );
      return {
        id: d.id,
        company: d.company,
        role: d.role,
        branches: Array.isArray(d.departments) ? d.departments.join(', ') : 'CS, IT, ENTC',
        type: d.jobType || 'Full Time',
        location: d.location || 'Pune',
        deadline: d.deadline || '10 Oct 2026',
        package: d.package || '7.5 LPA',
        applied: !!app,
        status: app ? app.status : 'Eligible',
      };
    });
  }, [allDrives, allApplications, studentProfile]);

  // Privacy Consents
  const [consents, setConsents] = useState([
    {
      id: 'placement_share',
      title: 'Placement Data Sharing Consent',
      desc: 'Allow Training & Placement Cell to share academic marks, resume, and contact details with verified campus recruitment partner companies.',
      category: 'Placement & Career',
      granted: true,
      lastUpdated: '01 Aug 2026',
      version: 'v2.1',
    },
    {
      id: 'emergency_contact',
      title: 'Emergency Contact & Medical Consent',
      desc: 'Permit college authorities and medical staff to access emergency guardian contact details and blood group records in critical situations.',
      category: 'Health & Safety',
      granted: true,
      lastUpdated: '15 Jul 2026',
      version: 'v1.0',
    },
    {
      id: 'library_records',
      title: 'Library & Digital Resource Analytics Consent',
      desc: 'Allow automated monitoring of digital library borrowing history and study portal activity to recommend course literature.',
      category: 'Academic Services',
      granted: false,
      lastUpdated: '10 Sep 2026',
      version: 'v1.2',
    },
  ]);

  // Announcements
  const announcements = useMemo(() => {
    return allAnnouncements.filter(
      (a) =>
        a.audience === 'All Students' ||
        a.audience === 'TE Computer Engineering – Division A' ||
        a.audience === 'TE & BE Students' ||
        a.audience === 'All Students & Faculty' ||
        a.audience === 'All Users'
    );
  }, [allAnnouncements]);

  // Requests submitted by Krushna Funde
  const requests = useMemo(() => {
    return allRequests
      .filter(
        (r) =>
          (r.studentPrn || r.prn || '').toUpperCase() === (studentProfile.prn || '').toUpperCase() ||
          r.studentName === studentProfile.name
      )
      .map((r) => {
        const title = r.title || r.type || 'Academic Request';
        const type = r.type || r.title || 'General Request';
        const description = r.description || r.desc || 'No description provided';
        const status = r.status || 'Pending';

        let statusBadge = r.statusBadge;
        let dotColor = r.dotColor;

        const s = status.toLowerCase();
        if (s === 'approved') {
          statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          dotColor = 'bg-emerald-500';
        } else if (s === 'completed') {
          statusBadge = 'bg-teal-50 text-teal-700 border-teal-200';
          dotColor = 'bg-teal-500';
        } else if (s === 'under review') {
          statusBadge = 'bg-amber-50 text-amber-700 border-amber-200';
          dotColor = 'bg-amber-500';
        } else if (s === 'rejected') {
          statusBadge = 'bg-rose-50 text-rose-700 border-rose-200';
          dotColor = 'bg-rose-500';
        } else if (s === 'forwarded') {
          statusBadge = 'bg-blue-50 text-blue-700 border-blue-200';
          dotColor = 'bg-blue-500';
        } else {
          statusBadge = 'bg-orange-50 text-orange-700 border-orange-200';
          dotColor = 'bg-orange-500';
        }

        return {
          ...r,
          id: r.id || 'REQ001',
          title,
          type,
          description,
          desc: description,
          date: r.date || 'Oct 02, 2026',
          status,
          statusBadge,
          dotColor,
          assignedTo: r.assignedTo || 'Prof. Sonal Kadam',
          details: r.details || description,
        };
      });
  }, [allRequests, studentProfile]);

  const [activities, setActivities] = useState([
    { id: 1, title: 'You applied for TCS Digital & Ninja Hiring placement drive', datetime: '2 days ago', iconType: 'briefcase', iconColor: 'bg-emerald-50 text-emerald-600' },
    { id: 2, title: 'You submitted Attendance Correction Request (Duty Leave Credit)', datetime: '3 days ago', iconType: 'file', iconColor: 'bg-blue-50 text-blue-600' },
    { id: 3, title: 'Hall ticket for Unit Test 2 was generated', datetime: '5 days ago', iconType: 'ticket', iconColor: 'bg-purple-50 text-purple-600' },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'TCS Placement Drive', desc: 'Shortlisted for Round 1 technical interview on 15 Oct.', time: '10:00 AM', unread: true },
    { id: 2, title: 'Unit Test 2 Timetable', desc: 'Exam schedule starting 15 Oct published.', time: 'Yesterday', unread: true },
    { id: 3, title: 'Attendance Update', desc: 'Attendance for Sep recorded: 93% (Good).', time: '2 days ago', unread: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Real Calculated Student Overview
  const myApplicationsCount = opportunities.filter((o) => o.applied).length;
  const myPendingRequestsCount = requests.filter((r) => r.status === 'Pending' || r.status === 'Under Review').length;

  const overview = {
    attendance: { value: studentProfile.attendance, label: 'Attendance', subtitle: '(Current Semester)' },
    upcomingExams: { count: examTimetable.length, label: 'Upcoming Exams', subtitle: 'Next 30 Days' },
    placementApplications: { count: myApplicationsCount, label: 'Placement Applications', subtitle: 'Applied' },
    pendingRequests: { count: myPendingRequestsCount, label: 'Pending Requests', subtitle: 'In Progress' },
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    success('All notifications marked as read.');
  };

  const toggleNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const applyForPlacement = (oppId) => {
    const opp = opportunities.find((o) => o.id === oppId);
    centralSubmitApplication(oppId, studentProfile);

    const newAct = {
      id: Date.now(),
      title: `You applied for ${opp?.company || 'Company'} placement drive`,
      datetime: 'Just now',
      iconType: 'briefcase',
      iconColor: 'bg-emerald-50 text-emerald-600',
    };
    setActivities((prev) => [newAct, ...prev]);
    success(`Application submitted successfully for ${opp?.company}.`);
  };

  const addRequest = (newReq) => {
    const created = {
      id: `REQ-${Date.now().toString().slice(-3)}`,
      studentName: studentProfile.name,
      studentPrn: studentProfile.prn,
      prn: studentProfile.prn,
      rollNo: studentProfile.rollNo,
      type: newReq.title || 'Student Request',
      description: newReq.details || newReq.description || 'Request details',
      date: 'Today',
      status: 'Pending',
      statusBadge: 'bg-orange-100 text-orange-800 border-orange-200',
      dotColor: 'bg-orange-500',
      assignedTo: 'Prof. Sonal Kadam',
    };

    const newAct = {
      id: Date.now(),
      title: `You submitted a ${newReq.title}`,
      datetime: 'Just now',
      iconType: 'file',
      iconColor: 'bg-blue-50 text-blue-600',
    };
    setActivities((prev) => [newAct, ...prev]);
    success('Request submitted to Class Teacher (Prof. Sonal Kadam).');
  };

  const toggleConsent = (consentId) => {
    setConsents((prev) =>
      prev.map((c) => (c.id === consentId ? { ...c, granted: !c.granted } : c))
    );
    success('Consent preference updated.');
  };

  return (
    <StudentContext.Provider
      value={{
        studentProfile,
        overview,
        subjects,
        examResults,
        examTimetable,
        opportunities,
        consents,
        announcements,
        requests,
        activities,
        notifications,
        unreadCount,
        markAllNotificationsAsRead,
        toggleNotificationRead,
        applyForPlacement,
        addRequest,
        toggleConsent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
}
