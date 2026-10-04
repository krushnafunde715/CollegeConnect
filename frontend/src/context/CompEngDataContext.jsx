import React, { createContext, useContext } from 'react';
import { useToast } from './ToastContext';
import { useCentralData } from './CentralDataContext';

const CompEngDataContext = createContext(null);

export function CompEngDataProvider({ children }) {
  const {
    students: allStudents,
    classes: allClasses,
    faculty: allFaculty,
    subjects: allSubjects,
    exams: allExams,
    announcements: allAnnouncements,
    requests: allRequests,
    activities: allActivities,
    addStudent: centralAddStudent,
    updateStudent: centralUpdateStudent,
    deleteStudent: centralDeleteStudent,
    createClass: centralCreateClass,
    addSubject: centralAddSubject,
    addAnnouncement: centralAddAnnouncement,
    deleteAnnouncement: centralDeleteAnnouncement,
    togglePinAnnouncement: centralTogglePinAnnouncement,
    updateRequestStatus: centralUpdateRequestStatus,
  } = useCentralData();

  const { success, error: toastError } = useToast();

  // Filter for Computer Engineering department
  const students = allStudents.filter(
    (s) => s.department === 'Computer Engineering' || s.dept === 'Computer Engineering' || s.department === 'Computer'
  );

  const classes = allClasses.filter(
    (c) => c.dept === 'Computer Engineering' || c.dept === 'Computer' || !c.dept
  );

  const faculty = allFaculty.filter(
    (f) => f.dept === 'Computer Engineering' || f.dept === 'Computer'
  );

  const subjects = allSubjects.filter(
    (s) => s.dept === 'Computer Engineering' || s.dept === 'Computer' || !s.dept
  );

  const announcements = allAnnouncements.filter(
    (a) =>
      a.department === 'Computer Engineering' ||
      a.department === 'Administration' ||
      a.audience === 'All Students & Faculty' ||
      a.audience === 'All Students' ||
      a.audience === 'All Users'
  );

  const corrections = allRequests.map((r) => ({
    id: r.id,
    student_id: r.studentPrn || r.prn,
    student_name: r.studentName,
    college_id: r.studentPrn || r.prn,
    field_name: r.type,
    requested_value: r.description,
    current_value: r.type === 'Attendance Correction' ? 'Absent' : 'Original Data',
    status: r.status?.toLowerCase() || 'pending',
    created_at: r.date,
    class_name: 'TE Computer A',
    reason: r.details || r.description,
  }));

  const activities = allActivities.filter(
    (act) => act.dept === 'Academic' || act.dept === 'Computer Engineering' || !act.dept
  );

  const examSchedules = allExams;

  // Helper Methods
  const getClassStudentCount = (className) => {
    return students.filter(
      (s) =>
        s.current_class_name === className ||
        s.className === className ||
        `${s.class_name} ${s.division}` === className ||
        `${s.class} ${s.division}` === className
    ).length;
  };

  const createClass = async (classData) => {
    const formattedName = `${classData.year_level} ${classData.division}`;
    const newClass = centralCreateClass({
      name: formattedName,
      year: classData.year_level,
      division: classData.division,
      dept: 'Computer Engineering',
      classTeacher: classData.class_teacher_name || 'Prof. Sonal Kadam',
      room: classData.classroom || 'Classroom 309',
      semester: classData.year_level === 'SE' ? 'III' : classData.year_level === 'TE' ? 'V' : 'VII',
    });
    success(`Class ${formattedName} created successfully.`);
    return { success: true, newClass };
  };

  const addStudent = async (studentData) => {
    const prn = (studentData.prn || studentData.college_id || '').trim().toUpperCase();
    const fullName = (studentData.full_name || studentData.name || '').trim();

    if (!prn || !fullName) {
      toastError('Student Name and PRN are required.');
      return { success: false, message: 'Student Name and PRN are required.' };
    }

    const prnExists = allStudents.some((s) => (s.prn || s.college_id || '').toUpperCase() === prn);
    if (prnExists) {
      toastError(`Student with PRN "${prn}" already exists.`);
      return { success: false, message: `Duplicate PRN ${prn} detected.` };
    }

    const newStudentObj = centralAddStudent({
      ...studentData,
      department: 'Computer Engineering',
      dept: 'Computer Engineering',
      name: fullName,
      full_name: fullName,
      prn,
      college_id: prn,
    });

    success(`Student ${fullName} (${prn}) enrolled successfully.`);
    return { success: true, student: newStudentObj };
  };

  const updateStudent = (idOrPrn, updatedData) => {
    centralUpdateStudent(idOrPrn, updatedData);
    success(`Student record updated successfully.`);
  };

  const deleteStudent = (idOrPrn) => {
    centralDeleteStudent(idOrPrn);
    success(`Student record removed.`);
  };

  const updateClassTeacher = (className, newTeacherName) => {
    success(`Class Teacher for ${className} updated to ${newTeacherName}.`);
  };

  const recordAttendanceSession = (className, subject, date, sessionMarksMap) => {
    students.forEach((s) => {
      const studentClass = s.current_class_name || `${s.class_name} ${s.division}`;
      if (studentClass === className) {
        const isPresent = sessionMarksMap[s.id] === 'P' || sessionMarksMap[s.prn] === 'P';
        const newPresent = isPresent ? (s.present || 20) + 1 : (s.present || 20);
        const newAbsent = isPresent ? (s.absent || 4) : (s.absent || 4) + 1;
        const total = newPresent + newAbsent;
        const newRate = ((newPresent / total) * 100).toFixed(1);
        centralUpdateStudent(s.id, {
          present: newPresent,
          absent: newAbsent,
          attendance_rate: `${newRate}`,
          attendance: `${Math.round(newRate)}%`,
        });
      }
    });
    success(`Attendance recorded for ${className}. Student rates updated.`);
  };

  const updateStudentMarks = (prn, subject, examType, newMarks) => {
    centralUpdateStudent(prn, {
      internal_marks: parseInt(newMarks) || 0,
      ut2_score: parseInt(newMarks) || 0,
    });
    success(`Marks updated for student ${prn}.`);
  };

  const createExamSchedule = (scheduleData) => {
    success('Exam schedule created successfully.');
  };

  const addAnnouncement = (notice) => {
    centralAddAnnouncement({
      ...notice,
      department: 'Computer Engineering',
      author: 'Ms. Anjali Deshmukh',
    });
    success('Notice published to department bulletin.');
  };

  const deleteAnnouncement = (id) => {
    centralDeleteAnnouncement(id);
    success('Notice removed from department feed.');
  };

  const togglePinAnnouncement = (id) => {
    centralTogglePinAnnouncement(id);
  };

  const addSubject = (sub) => {
    centralAddSubject({
      ...sub,
      dept: 'Computer Engineering',
    });
    success(`Course ${sub.code} (${sub.name}) added to catalog.`);
  };

  const updateSubject = (id, subData) => {
    success(`Subject ${subData.code || ''} updated.`);
  };

  const deleteSubject = (id) => {
    success('Subject removed from catalog.');
  };

  const reviewCorrection = async (requestId, decision, notes = 'Reviewed by Comp Eng Admin') => {
    const newStatus = decision === 'approved' ? 'Approved' : decision === 'rejected' ? 'Rejected' : 'Under Review';
    centralUpdateRequestStatus(requestId, newStatus, 'Ms. Anjali Deshmukh');
    success(`Rectification request ${decision}.`);
  };

  const value = {
    students,
    classes,
    faculty,
    subjects,
    examSchedules,
    announcements,
    activities,
    corrections,
    getClassStudentCount,
    createClass,
    addStudent,
    updateStudent,
    deleteStudent,
    updateClassTeacher,
    recordAttendanceSession,
    updateStudentMarks,
    createExamSchedule,
    addAnnouncement,
    deleteAnnouncement,
    togglePinAnnouncement,
    addSubject,
    updateSubject,
    deleteSubject,
    reviewCorrection,
  };

  return (
    <CompEngDataContext.Provider value={value}>
      {children}
    </CompEngDataContext.Provider>
  );
}

export function useCompEngData() {
  const context = useContext(CompEngDataContext);
  if (!context) {
    throw new Error('useCompEngData must be used within a CompEngDataProvider');
  }
  return context;
}
