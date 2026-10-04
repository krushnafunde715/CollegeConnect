import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CentralDataContext = createContext(null);

const STORAGE_KEY = 'collegeconnect_central_data_v3';

// =========================================================================
// 1. INITIAL CENTRALIZED DATASET
// =========================================================================

export const INITIAL_DEPARTMENTS = [
  {
    id: 1,
    name: 'Computer Engineering',
    code: 'COMP',
    hod: 'Ms. Anjali Deshmukh',
    hodEmail: 'anjali.deshmukh@comp.nmiet.edu.in',
    phone: '+91 20 2710 9001',
    building: 'Main Tech Block, Floor 3',
    status: 'Active',
    color: 'bg-indigo-600',
    tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 2,
    name: 'Information Technology',
    code: 'IT',
    hod: 'Dr. M. V. Kulkarni',
    hodEmail: 'm.kulkarni@it.nmiet.edu.in',
    phone: '+91 20 2710 9002',
    building: 'IT Block, Floor 2',
    status: 'Active',
    color: 'bg-blue-600',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 3,
    name: 'Electronics & Telecommunication',
    code: 'ENTC',
    hod: 'Prof. R. M. Shinde',
    hodEmail: 'r.shinde@entc.nmiet.edu.in',
    phone: '+91 20 2710 9003',
    building: 'Telecom Wing, Floor 1',
    status: 'Active',
    color: 'bg-emerald-600',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 4,
    name: 'Mechanical Engineering',
    code: 'MECH',
    hod: 'Dr. P. R. Joshi',
    hodEmail: 'p.joshi@mech.nmiet.edu.in',
    phone: '+91 20 2710 9004',
    building: 'Mechanical Workshop Block',
    status: 'Active',
    color: 'bg-amber-600',
    tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 5,
    name: 'Civil Engineering',
    code: 'CIVIL',
    hod: 'Prof. V. K. Patil',
    hodEmail: 'v.patil@civil.nmiet.edu.in',
    phone: '+91 20 2710 9005',
    building: 'Civil Wing, Ground Floor',
    status: 'Active',
    color: 'bg-rose-600',
    tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
];

export const INITIAL_CLASSES = [
  { id: 1, name: 'SE Computer A', year: 'SE', division: 'A', class_name: 'SE', dept: 'Computer Engineering', classTeacher: 'Prof. S. N. Joshi', classTeacherEmail: 's.joshi@comp.nmiet.edu.in', room: 'Classroom 301', semester: 'III', academicYear: '2026 - 27' },
  { id: 2, name: 'SE Computer B', year: 'SE', division: 'B', class_name: 'SE', dept: 'Computer Engineering', classTeacher: 'Prof. V. B. Shinde', classTeacherEmail: 'v.shinde@comp.nmiet.edu.in', room: 'Classroom 302', semester: 'III', academicYear: '2026 - 27' },
  { id: 3, name: 'TE Computer A', year: 'TE', division: 'A', class_name: 'TE', dept: 'Computer Engineering', classTeacher: 'Prof. Sonal Kadam', classTeacherEmail: 'sonal.kadam@comp.nmiet.edu.in', room: 'Classroom 304', semester: 'V', academicYear: '2026 - 27' },
  { id: 4, name: 'TE Computer B', year: 'TE', division: 'B', class_name: 'TE', dept: 'Computer Engineering', classTeacher: 'Prof. P. N. Kulkarni', classTeacherEmail: 'p.kulkarni@comp.nmiet.edu.in', room: 'Classroom 305', semester: 'V', academicYear: '2026 - 27' },
  { id: 5, name: 'BE Computer A', year: 'BE', division: 'A', class_name: 'BE', dept: 'Computer Engineering', classTeacher: 'Dr. S. K. Mahajan', classTeacherEmail: 's.mahajan@comp.nmiet.edu.in', room: 'Classroom 307', semester: 'VII', academicYear: '2026 - 27' },
  { id: 6, name: 'BE Computer B', year: 'BE', division: 'B', class_name: 'BE', dept: 'Computer Engineering', classTeacher: 'Prof. R. P. Deshmukh', classTeacherEmail: 'r.deshmukh@comp.nmiet.edu.in', room: 'Classroom 308', semester: 'VII', academicYear: '2026 - 27' },
];

export const INITIAL_FACULTY = [
  { id: 1, name: 'Prof. Kirti Borhade', role: 'Head of Department & Academic Admin', designation: 'Associate Professor & HOD', dept: 'Computer Engineering', email: 'kirti.borhade@comp.nmiet.edu.in', phone: '+91 98220 10001', experience: '14 Years', qualification: 'M.E. Computer Engineering', assignedClass: 'Department Admin', subjects: ['Database Management Systems', 'Distributed Systems'] },
  { id: 2, name: 'Prof. Sonal Kadam', role: 'Class Teacher (TE Comp A)', designation: 'Assistant Professor', dept: 'Computer Engineering', email: 'sonal.kadam@comp.nmiet.edu.in', phone: '+91 98220 10002', experience: '9 Years', qualification: 'M.Tech Computer Science', assignedClass: 'TE Computer A', subjects: ['Machine Learning', 'Project Phase - I'] },
  { id: 3, name: 'Dr. S. K. Mahajan', role: 'Professor & Class Teacher (BE Comp A)', designation: 'Professor', dept: 'Computer Engineering', email: 's.mahajan@comp.nmiet.edu.in', phone: '+91 98220 10003', experience: '18 Years', qualification: 'Ph.D. Computer Engineering', assignedClass: 'BE Computer A', subjects: ['Artificial Intelligence', 'High Performance Computing'] },
  { id: 4, name: 'Prof. R. P. Deshmukh', role: 'Class Teacher (BE Comp B)', designation: 'Assistant Professor', dept: 'Computer Engineering', email: 'r.deshmukh@comp.nmiet.edu.in', phone: '+91 98220 10004', experience: '8 Years', qualification: 'M.E. Computer Science', assignedClass: 'BE Computer B', subjects: ['Web Technology', 'Data Structures & Algorithms'] },
  { id: 5, name: 'Prof. V. B. Shinde', role: 'Class Teacher (SE Comp B)', designation: 'Assistant Professor', dept: 'Computer Engineering', email: 'v.shinde@comp.nmiet.edu.in', phone: '+91 98220 10005', experience: '7 Years', qualification: 'M.Tech IT', assignedClass: 'SE Computer B', subjects: ['Cloud Computing', 'Operating Systems'] },
  { id: 6, name: 'Prof. P. N. Kulkarni', role: 'Class Teacher (TE Comp B)', designation: 'Assistant Professor', dept: 'Computer Engineering', email: 'p.kulkarni@comp.nmiet.edu.in', phone: '+91 98220 10006', experience: '6 Years', qualification: 'M.E. Computer Engineering', assignedClass: 'TE Computer B', subjects: ['Elective - I (Data Science)', 'Computer Networks'] },
  { id: 7, name: 'Prof. S. N. Joshi', role: 'Class Teacher (SE Comp A)', designation: 'Assistant Professor', dept: 'Computer Engineering', email: 's.joshi@comp.nmiet.edu.in', phone: '+91 98220 10007', experience: '11 Years', qualification: 'M.Tech Software Engineering', assignedClass: 'SE Computer A', subjects: ['Software Engineering', 'Discrete Mathematics'] },
  { id: 8, name: 'Prof. Akash Mhetre', role: 'Controller of Examination & Exam Admin', designation: 'Examination Officer', dept: 'Examination Department', email: 'akash.mhetre@exam.nmiet.edu.in', phone: '+91 98220 10008', experience: '15 Years', qualification: 'M.Sc., M.Ed.', assignedClass: 'Examination Department', subjects: ['Examination Oversight', 'Result Processing'] },
  { id: 9, name: 'Prof. Satyajit Sirsat', role: 'Training & Placement Officer & Placement Admin', designation: 'Placement Officer (TPO)', dept: 'Placement Department', email: 'satyajit.sirsat@placement.nmiet.edu.in', phone: '+91 98220 10009', experience: '12 Years', qualification: 'MBA HR & IT, B.E. Computer', assignedClass: 'Placement Department', subjects: ['Industry Relations', 'Career Placement'] },
];

export const INITIAL_SUBJECTS = [
  // --- TE Semester V ---
  { id: 1, code: '410241', name: 'Artificial Intelligence', short: 'AI', credits: 4, dept: 'Computer Engineering', semester: 'V', class_name: 'TE', faculty: 'Dr. S. K. Mahajan', average: '78%', highest: '96%', lowest: '46%', passRate: '100%', barColor: 'bg-emerald-500' },
  { id: 2, code: '410242', name: 'Machine Learning', short: 'ML', credits: 4, dept: 'Computer Engineering', semester: 'V', class_name: 'TE', faculty: 'Prof. Sonal Kadam', average: '74%', highest: '94%', lowest: '52%', passRate: '98%', barColor: 'bg-emerald-500' },
  { id: 3, code: '410243', name: 'Web Technology', short: 'WT', credits: 3, dept: 'Computer Engineering', semester: 'V', class_name: 'TE', faculty: 'Prof. R. P. Deshmukh', average: '81%', highest: '96%', lowest: '49%', passRate: '100%', barColor: 'bg-teal-500' },
  { id: 4, code: '410244', name: 'Cloud Computing', short: 'CC', credits: 3, dept: 'Computer Engineering', semester: 'V', class_name: 'TE', faculty: 'Prof. V. B. Shinde', average: '76%', highest: '92%', lowest: '50%', passRate: '98%', barColor: 'bg-emerald-500' },
  { id: 5, code: '410245', name: 'Elective - I (Data Science)', short: 'Elective-I', credits: 3, dept: 'Computer Engineering', semester: 'V', class_name: 'TE', faculty: 'Prof. P. N. Kulkarni', average: '72%', highest: '95%', lowest: '55%', passRate: '100%', barColor: 'bg-amber-500' },
  { id: 6, code: '410246', name: 'Project Phase - I', short: 'Project', credits: 4, dept: 'Computer Engineering', semester: 'V', class_name: 'TE', faculty: 'Prof. Sonal Kadam', average: '83%', highest: '98%', lowest: '65%', passRate: '100%', barColor: 'bg-emerald-500' },

  // --- SE Semester III ---
  { id: 7, code: '310241', name: 'Discrete Mathematics', short: 'DM', credits: 4, dept: 'Computer Engineering', semester: 'III', class_name: 'SE', faculty: 'Prof. S. N. Joshi', average: '75%', highest: '92%', lowest: '48%', passRate: '96%', barColor: 'bg-indigo-500' },
  { id: 8, code: '310242', name: 'Data Structures & Algorithms', short: 'DSA', credits: 4, dept: 'Computer Engineering', semester: 'III', class_name: 'SE', faculty: 'Prof. R. P. Deshmukh', average: '79%', highest: '95%', lowest: '50%', passRate: '98%', barColor: 'bg-blue-500' },
  { id: 9, code: '310243', name: 'Database Management Systems', short: 'DBMS', credits: 4, dept: 'Computer Engineering', semester: 'III', class_name: 'SE', faculty: 'Prof. Kirti Borhade', average: '82%', highest: '97%', lowest: '54%', passRate: '100%', barColor: 'bg-emerald-500' },
  { id: 10, code: '310244', name: 'Computer Graphics', short: 'CG', credits: 3, dept: 'Computer Engineering', semester: 'III', class_name: 'SE', faculty: 'Prof. P. N. Kulkarni', average: '73%', highest: '90%', lowest: '46%', passRate: '95%', barColor: 'bg-teal-500' },
  { id: 11, code: '310245', name: 'Digital Electronics & Logic Design', short: 'DELD', credits: 3, dept: 'Computer Engineering', semester: 'III', class_name: 'SE', faculty: 'Dr. S. K. Mahajan', average: '77%', highest: '93%', lowest: '52%', passRate: '97%', barColor: 'bg-amber-500' },

  // --- BE Semester VII ---
  { id: 12, code: '410250', name: 'High Performance Computing', short: 'HPC', credits: 4, dept: 'Computer Engineering', semester: 'VII', class_name: 'BE', faculty: 'Dr. S. K. Mahajan', average: '80%', highest: '96%', lowest: '55%', passRate: '100%', barColor: 'bg-emerald-500' },
  { id: 13, code: '410251', name: 'Deep Learning & NLP', short: 'DL', credits: 4, dept: 'Computer Engineering', semester: 'VII', class_name: 'BE', faculty: 'Prof. Sonal Kadam', average: '78%', highest: '94%', lowest: '52%', passRate: '98%', barColor: 'bg-emerald-500' },
  { id: 14, code: '410252', name: 'Design & Analysis of Algorithms', short: 'DAA', credits: 3, dept: 'Computer Engineering', semester: 'VII', class_name: 'BE', faculty: 'Prof. S. N. Joshi', average: '82%', highest: '98%', lowest: '58%', passRate: '100%', barColor: 'bg-teal-500' },
  { id: 15, code: '410253', name: 'Cyber Security & Blockchain', short: 'CSB', credits: 3, dept: 'Computer Engineering', semester: 'VII', class_name: 'BE', faculty: 'Prof. R. P. Deshmukh', average: '76%', highest: '92%', lowest: '50%', passRate: '97%', barColor: 'bg-indigo-500' },
  { id: 16, code: '410254', name: 'Major Project Phase - II', short: 'Project-II', credits: 4, dept: 'Computer Engineering', semester: 'VII', class_name: 'BE', faculty: 'Prof. Kirti Borhade', average: '88%', highest: '99%', lowest: '70%', passRate: '100%', barColor: 'bg-emerald-500' },
];

// =========================================================================
// 54 UNIQUE CENTRALIZED STUDENTS ACROSS SE, TE, BE
// (SE A: 9, SE B: 8, TE A: 9 [incl. Krushna Funde], TE B: 8, BE A: 9, BE B: 8, +2 IT, +2 ENTC)
// =========================================================================
export const INITIAL_STUDENTS = [
  // --- TE A (9 Students) - Reference Class for Prof. Sonal Kadam & Krushna Funde ---
  {
    id: 1,
    prn: '22CE001',
    college_id: '22CE001',
    roll: '01',
    rollNo: '01',
    name: 'Krushna Funde',
    full_name: 'Krushna Ashok Funde',
    fullName: 'Krushna Ashok Funde',
    department: 'Computer Engineering',
    dept: 'Computer Engineering',
    class: 'TE',
    class_name: 'TE',
    className: 'TE A',
    current_class_name: 'TE A',
    division: 'A',
    div: 'A',
    semester: 'V',
    academicYear: '2026 - 27',
    admission_year: 2023,
    admissionYear: '2023',
    email: 'krushna.funde@comp.nmiet.edu.in',
    phone: '+91 98765 43210',
    status: 'Active',
    account_status: 'active',
    todayStatus: 'Present',
    cgpa: '8.85',
    attendance: '93%',
    attendance_rate: '93.0',
    present: 42,
    absent: 3,
    onLeave: 0,
    placementStatus: 'Shortlisted',
    companyPlaced: null,
    package: null,
    role: null,
    skills: ['Java', 'Python', 'React', 'Machine Learning', 'SQL'],
    certifications: ['AWS Certified Cloud Practitioner', 'TensorFlow Developer Certificate'],
    resumeUrl: 'https://collegeconnect.edu/resumes/22CE001.pdf',
    resumeAvailable: true,
    eligible: true,
    appliedDrives: 2,
    internal_marks: 26,
    endSem: 68,
    total: 94,
    result: 'Pass',
    hallTicketStatus: 'Generated',
    seatNo: 'TE-A-01',
    marks: { ai: 84, ml: 78, wt: 82, cc: 75, elective1: 80, avg: 80, grade: 'Good' },
    attendanceStats: { present: 42, absent: 3, onLeave: 0, percentage: '93%', status: 'Good' },
    guardianContact: '+91 98221 99881',
    address: 'Talegaon Dabhade, Pune 410506',
    dob: '15 May 2004',
    date_of_birth: '2004-05-15',
    bloodGroup: 'B+',
    blood_group: 'B+',
  },
  {
    id: 2,
    prn: '22CE002',
    college_id: '22CE002',
    roll: '02',
    rollNo: '02',
    name: 'Riya Deshmukh',
    full_name: 'Riya Deshmukh',
    department: 'Computer Engineering',
    dept: 'Computer Engineering',
    class: 'TE',
    class_name: 'TE',
    className: 'TE A',
    current_class_name: 'TE A',
    division: 'A',
    div: 'A',
    semester: 'V',
    academicYear: '2026 - 27',
    admission_year: 2023,
    email: 'riya.deshmukh@comp.nmiet.edu.in',
    phone: '+91 98221 00002',
    status: 'Active',
    account_status: 'active',
    todayStatus: 'Present',
    cgpa: '9.20',
    attendance: '91%',
    attendance_rate: '91.0',
    present: 41,
    absent: 4,
    onLeave: 0,
    placementStatus: 'In Process',
    companyPlaced: null,
    package: null,
    role: null,
    skills: ['C++', 'Data Structures', 'Web Development'],
    certifications: ['HackerRank Problem Solving (Gold)'],
    resumeAvailable: true,
    eligible: true,
    appliedDrives: 1,
    internal_marks: 28,
    endSem: 71,
    total: 99,
    result: 'Pass',
    hallTicketStatus: 'Generated',
    seatNo: 'TE-A-02',
    marks: { ai: 76, ml: 88, wt: 85, cc: 79, elective1: 82, avg: 82, grade: 'Good' },
    attendanceStats: { present: 41, absent: 4, onLeave: 0, percentage: '91%', status: 'Good' },
    guardianContact: '+91 98221 00002',
    address: 'Nigdi Pradhikaran, Pune',
    dob: '2004-08-22',
    bloodGroup: 'O+',
  },
  {
    id: 3,
    prn: '22CE003',
    college_id: '22CE003',
    roll: '03',
    rollNo: '03',
    name: 'Om Jagtap',
    full_name: 'Om Jagtap',
    department: 'Computer Engineering',
    dept: 'Computer Engineering',
    class: 'TE',
    class_name: 'TE',
    className: 'TE A',
    current_class_name: 'TE A',
    division: 'A',
    div: 'A',
    semester: 'V',
    academicYear: '2026 - 27',
    admission_year: 2023,
    email: 'om.jagtap@comp.nmiet.edu.in',
    phone: '+91 98221 00003',
    status: 'Active',
    account_status: 'active',
    todayStatus: 'Present',
    cgpa: '7.85',
    attendance: '84%',
    attendance_rate: '84.0',
    present: 38,
    absent: 7,
    onLeave: 0,
    placementStatus: 'Eligible',
    companyPlaced: null,
    package: null,
    role: null,
    skills: ['Python', 'SQL', 'Django'],
    certifications: ['Python Essentials Cisco'],
    resumeAvailable: true,
    eligible: true,
    appliedDrives: 0,
    internal_marks: 22,
    endSem: 63,
    total: 85,
    result: 'Pass',
    hallTicketStatus: 'Generated',
    seatNo: 'TE-A-03',
    marks: { ai: 68, ml: 72, wt: 70, cc: 66, elective1: 75, avg: 70, grade: 'Average' },
    attendanceStats: { present: 38, absent: 7, onLeave: 0, percentage: '84%', status: 'Good' },
    guardianContact: '+91 98221 00003',
    address: 'Chinchwad, Pune',
    dob: '2004-11-10',
    bloodGroup: 'A+',
  },
  {
    id: 4,
    prn: '22CE004',
    college_id: '22CE004',
    roll: '04',
    rollNo: '04',
    name: 'Neha Patil',
    full_name: 'Neha Patil',
    department: 'Computer Engineering',
    dept: 'Computer Engineering',
    class: 'TE',
    class_name: 'TE',
    className: 'TE A',
    current_class_name: 'TE A',
    division: 'A',
    div: 'A',
    semester: 'V',
    academicYear: '2026 - 27',
    admission_year: 2023,
    email: 'neha.patil@comp.nmiet.edu.in',
    phone: '+91 98221 00004',
    status: 'Active',
    account_status: 'active',
    todayStatus: 'Present',
    cgpa: '9.45',
    attendance: '96%',
    attendance_rate: '96.0',
    present: 43,
    absent: 2,
    onLeave: 0,
    placementStatus: 'Shortlisted',
    companyPlaced: null,
    package: null,
    role: null,
    skills: ['Java', 'Spring Boot', 'React', 'Cloud'],
    certifications: ['Microsoft Azure AZ-900'],
    resumeAvailable: true,
    eligible: true,
    appliedDrives: 2,
    internal_marks: 29,
    endSem: 66,
    total: 95,
    result: 'Pass',
    hallTicketStatus: 'Generated',
    seatNo: 'TE-A-04',
    marks: { ai: 92, ml: 90, wt: 88, cc: 86, elective1: 93, avg: 90, grade: 'Excellent' },
    attendanceStats: { present: 43, absent: 2, onLeave: 0, percentage: '96%', status: 'Excellent' },
    guardianContact: '+91 98221 00004',
    address: 'Ravet, Pune',
    dob: '2004-03-14',
    bloodGroup: 'B+',
  },
  {
    id: 5,
    prn: '22CE005',
    college_id: '22CE005',
    roll: '05',
    rollNo: '05',
    name: 'Siddhant More',
    full_name: 'Siddhant More',
    department: 'Computer Engineering',
    dept: 'Computer Engineering',
    class: 'TE',
    class_name: 'TE',
    className: 'TE A',
    current_class_name: 'TE A',
    division: 'A',
    div: 'A',
    semester: 'V',
    academicYear: '2026 - 27',
    admission_year: 2023,
    email: 'siddhant.more@comp.nmiet.edu.in',
    phone: '+91 98221 00005',
    status: 'Active',
    account_status: 'active',
    todayStatus: 'Present',
    cgpa: '7.40',
    attendance: '76%',
    attendance_rate: '76.0',
    present: 35,
    absent: 10,
    onLeave: 0,
    placementStatus: 'Eligible',
    companyPlaced: null,
    package: null,
    role: null,
    skills: ['JavaScript', 'HTML/CSS', 'MySQL'],
    certifications: ['Oracle SQL Fundamentals'],
    resumeAvailable: true,
    eligible: true,
    appliedDrives: 0,
    internal_marks: 21,
    endSem: 59,
    total: 80,
    result: 'Pass',
    hallTicketStatus: 'Generated',
    seatNo: 'TE-A-05',
    marks: { ai: 58, ml: 62, wt: 60, cc: 64, elective1: 61, avg: 61, grade: 'Average' },
    attendanceStats: { present: 35, absent: 10, onLeave: 0, percentage: '76%', status: 'Needs Attention' },
    guardianContact: '+91 98221 00005',
    address: 'Pimpri, Pune',
    dob: '2004-06-30',
    bloodGroup: 'AB+',
  },
  {
    id: 6,
    prn: '22CE006',
    college_id: '22CE006',
    roll: '06',
    rollNo: '06',
    name: 'Tanvi Shinde',
    full_name: 'Tanvi Shinde',
    department: 'Computer Engineering',
    dept: 'Computer Engineering',
    class: 'TE',
    class_name: 'TE',
    className: 'TE A',
    current_class_name: 'TE A',
    division: 'A',
    div: 'A',
    semester: 'V',
    academicYear: '2026 - 27',
    admission_year: 2023,
    email: 'tanvi.shinde@comp.nmiet.edu.in',
    phone: '+91 98221 00006',
    status: 'Active',
    account_status: 'active',
    todayStatus: 'Present',
    cgpa: '8.60',
    attendance: '89%',
    attendance_rate: '89.0',
    present: 40,
    absent: 5,
    onLeave: 0,
    placementStatus: 'Eligible',
    companyPlaced: null,
    package: null,
    role: null,
    skills: ['Python', 'Data Analytics', 'Tableau'],
    certifications: ['Google Data Analytics'],
    resumeAvailable: true,
    eligible: true,
    appliedDrives: 1,
    internal_marks: 26,
    endSem: 76,
    total: 102,
    result: 'Pass',
    hallTicketStatus: 'Generated',
    seatNo: 'TE-A-06',
    marks: { ai: 80, ml: 76, wt: 78, cc: 74, elective1: 79, avg: 77, grade: 'Good' },
    attendanceStats: { present: 40, absent: 5, onLeave: 0, percentage: '89%', status: 'Good' },
    guardianContact: '+91 98221 00006',
    address: 'Akurdi, Pune',
    dob: '2004-09-18',
    bloodGroup: 'O-',
  },
  {
    id: 7,
    prn: '22CE007',
    college_id: '22CE007',
    roll: '07',
    rollNo: '07',
    name: 'Rohit Yadav',
    full_name: 'Rohit Yadav',
    department: 'Computer Engineering',
    dept: 'Computer Engineering',
    class: 'TE',
    class_name: 'TE',
    className: 'TE A',
    current_class_name: 'TE A',
    division: 'A',
    div: 'A',
    semester: 'V',
    academicYear: '2026 - 27',
    admission_year: 2023,
    email: 'rohit.yadav@comp.nmiet.edu.in',
    phone: '+91 98221 00007',
    status: 'Active',
    account_status: 'active',
    todayStatus: 'Absent',
    cgpa: '6.80',
    attendance: '71%',
    attendance_rate: '71.0',
    present: 32,
    absent: 13,
    onLeave: 0,
    placementStatus: 'Not Eligible',
    companyPlaced: null,
    package: null,
    role: null,
    skills: ['C', 'C++', 'Basic Web'],
    certifications: [],
    resumeAvailable: false,
    eligible: false,
    appliedDrives: 0,
    internal_marks: 18,
    endSem: 50,
    total: 68,
    result: 'Pass',
    hallTicketStatus: 'Not Generated',
    seatNo: 'TE-A-07',
    marks: { ai: 46, ml: 52, wt: 49, cc: 50, elective1: 55, avg: 50, grade: 'Needs Support' },
    attendanceStats: { present: 32, absent: 13, onLeave: 0, percentage: '71%', status: 'Needs Attention' },
    guardianContact: '+91 98221 00007',
    address: 'Dehu Road, Pune',
    dob: '2004-12-05',
    bloodGroup: 'B-',
  },
  {
    id: 8,
    prn: '22CE008',
    college_id: '22CE008',
    roll: '08',
    rollNo: '08',
    name: 'Pooja Khairnar',
    full_name: 'Pooja Khairnar',
    department: 'Computer Engineering',
    dept: 'Computer Engineering',
    class: 'TE',
    class_name: 'TE',
    className: 'TE A',
    current_class_name: 'TE A',
    division: 'A',
    div: 'A',
    semester: 'V',
    academicYear: '2026 - 27',
    admission_year: 2023,
    email: 'pooja.khairnar@comp.nmiet.edu.in',
    phone: '+91 98221 00008',
    status: 'Active',
    account_status: 'active',
    todayStatus: 'Present',
    cgpa: '9.30',
    attendance: '98%',
    attendance_rate: '98.0',
    present: 44,
    absent: 1,
    onLeave: 0,
    placementStatus: 'Eligible',
    companyPlaced: null,
    package: null,
    role: null,
    skills: ['Java', 'Cloud Security', 'Kubernetes'],
    certifications: ['AWS Certified Solutions Architect'],
    resumeAvailable: true,
    eligible: true,
    appliedDrives: 1,
    internal_marks: 28,
    endSem: 68,
    total: 96,
    result: 'Pass',
    hallTicketStatus: 'Generated',
    seatNo: 'TE-A-08',
    marks: { ai: 88, ml: 84, wt: 86, cc: 82, elective1: 85, avg: 85, grade: 'Excellent' },
    attendanceStats: { present: 44, absent: 1, onLeave: 0, percentage: '98%', status: 'Excellent' },
    guardianContact: '+91 98221 00008',
    address: 'Kothrud, Pune',
    dob: '2004-01-25',
    bloodGroup: 'A+',
  },
  {
    id: 9,
    prn: '22CE009',
    college_id: '22CE009',
    roll: '09',
    rollNo: '09',
    name: 'Aarav Kulkarni',
    full_name: 'Aarav Kulkarni',
    department: 'Computer Engineering',
    dept: 'Computer Engineering',
    class: 'TE',
    class_name: 'TE',
    className: 'TE A',
    current_class_name: 'TE A',
    division: 'A',
    div: 'A',
    semester: 'V',
    academicYear: '2026 - 27',
    admission_year: 2023,
    email: 'aarav.kulkarni@comp.nmiet.edu.in',
    phone: '+91 98221 00009',
    status: 'Active',
    account_status: 'active',
    todayStatus: 'Present',
    cgpa: '9.10',
    attendance: '95%',
    attendance_rate: '95.0',
    present: 43,
    absent: 2,
    onLeave: 0,
    placementStatus: 'Eligible',
    companyPlaced: null,
    package: null,
    role: null,
    skills: ['React', 'Node.js', 'MongoDB', 'GraphQL'],
    certifications: ['Meta Front-End Developer'],
    resumeAvailable: true,
    eligible: true,
    appliedDrives: 1,
    internal_marks: 27,
    endSem: 62,
    total: 89,
    result: 'Pass',
    hallTicketStatus: 'Generated',
    seatNo: 'TE-A-09',
    marks: { ai: 85, ml: 82, wt: 88, cc: 80, elective1: 84, avg: 84, grade: 'Excellent' },
    attendanceStats: { present: 43, absent: 2, onLeave: 0, percentage: '95%', status: 'Excellent' },
    guardianContact: '+91 98221 00009',
    address: 'Baner, Pune',
    dob: '2004-04-16',
    bloodGroup: 'O+',
  },

  // --- TE B (8 Students) ---
  { id: 10, prn: '22CE010', college_id: '22CE010', roll: '01', rollNo: '01', name: 'Akanksha More', full_name: 'Akanksha More', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'TE', class_name: 'TE', className: 'TE B', current_class_name: 'TE B', division: 'B', div: 'B', semester: 'V', academicYear: '2026 - 27', admission_year: 2023, email: 'akanksha.more@comp.nmiet.edu.in', phone: '+91 98221 00010', status: 'Active', account_status: 'active', cgpa: '9.05', attendance: '95%', attendance_rate: '95.0', present: 42, absent: 2, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, internal_marks: 28, endSem: 73, total: 101, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'TE-B-01' },
  { id: 11, prn: '22CE011', college_id: '22CE011', roll: '02', rollNo: '02', name: 'Prathamesh Pol', full_name: 'Prathamesh Pol', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'TE', class_name: 'TE', className: 'TE B', current_class_name: 'TE B', division: 'B', div: 'B', semester: 'V', academicYear: '2026 - 27', admission_year: 2023, email: 'prathamesh.pol@comp.nmiet.edu.in', phone: '+91 98221 00011', status: 'Active', account_status: 'active', cgpa: '8.40', attendance: '91%', attendance_rate: '91.0', present: 40, absent: 4, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, internal_marks: 25, endSem: 64, total: 89, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'TE-B-02' },
  { id: 12, prn: '22CE012', college_id: '22CE012', roll: '03', rollNo: '03', name: 'Sayali Nalawade', full_name: 'Sayali Nalawade', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'TE', class_name: 'TE', className: 'TE B', current_class_name: 'TE B', division: 'B', div: 'B', semester: 'V', academicYear: '2026 - 27', admission_year: 2023, email: 'sayali.nalawade@comp.nmiet.edu.in', phone: '+91 98221 00012', status: 'Active', account_status: 'active', cgpa: '8.80', attendance: '93%', attendance_rate: '93.0', present: 41, absent: 3, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, internal_marks: 26, endSem: 70, total: 96, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'TE-B-03' },
  { id: 13, prn: '22CE013', college_id: '22CE013', roll: '04', rollNo: '04', name: 'Rohit Shelar', full_name: 'Rohit Shelar', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'TE', class_name: 'TE', className: 'TE B', current_class_name: 'TE B', division: 'B', div: 'B', semester: 'V', academicYear: '2026 - 27', admission_year: 2023, email: 'rohit.shelar@comp.nmiet.edu.in', phone: '+91 98221 00013', status: 'Active', account_status: 'active', cgpa: '7.80', attendance: '82%', attendance_rate: '82.0', present: 36, absent: 8, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, internal_marks: 22, endSem: 57, total: 79, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'TE-B-04' },
  { id: 14, prn: '22CE014', college_id: '22CE014', roll: '05', rollNo: '05', name: 'Trupti Yadav', full_name: 'Trupti Yadav', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'TE', class_name: 'TE', className: 'TE B', current_class_name: 'TE B', division: 'B', div: 'B', semester: 'V', academicYear: '2026 - 27', admission_year: 2023, email: 'trupti.yadav@comp.nmiet.edu.in', phone: '+91 98221 00014', status: 'Active', account_status: 'active', cgpa: '8.65', attendance: '94%', attendance_rate: '94.0', present: 42, absent: 2, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, internal_marks: 27, endSem: 67, total: 94, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'TE-B-05' },
  { id: 15, prn: '22CE015', college_id: '22CE015', roll: '06', rollNo: '06', name: 'Yashraj Dhumal', full_name: 'Yashraj Dhumal', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'TE', class_name: 'TE', className: 'TE B', current_class_name: 'TE B', division: 'B', div: 'B', semester: 'V', academicYear: '2026 - 27', admission_year: 2023, email: 'yashraj.dhumal@comp.nmiet.edu.in', phone: '+91 98221 00015', status: 'Active', account_status: 'active', cgpa: '8.20', attendance: '88%', attendance_rate: '88.0', present: 39, absent: 5, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, internal_marks: 24, endSem: 61, total: 85, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'TE-B-06' },
  { id: 16, prn: '22CE016', college_id: '22CE016', roll: '07', rollNo: '07', name: 'Rupali Gite', full_name: 'Rupali Gite', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'TE', class_name: 'TE', className: 'TE B', current_class_name: 'TE B', division: 'B', div: 'B', semester: 'V', academicYear: '2026 - 27', admission_year: 2023, email: 'rupali.gite@comp.nmiet.edu.in', phone: '+91 98221 00016', status: 'Active', account_status: 'active', cgpa: '9.35', attendance: '96%', attendance_rate: '96.0', present: 43, absent: 1, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, internal_marks: 29, endSem: 74, total: 103, result: 'Pass', hallTicketStatus: 'Not Generated', seatNo: 'TE-B-07' },
  { id: 17, prn: '22CE017', college_id: '22CE017', roll: '08', rollNo: '08', name: 'Abhishek Tambe', full_name: 'Abhishek Tambe', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'TE', class_name: 'TE', className: 'TE B', current_class_name: 'TE B', division: 'B', div: 'B', semester: 'V', academicYear: '2026 - 27', admission_year: 2023, email: 'abhishek.tambe@comp.nmiet.edu.in', phone: '+91 98221 00017', status: 'Active', account_status: 'active', cgpa: '7.10', attendance: '74%', attendance_rate: '74.0', present: 33, absent: 11, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, internal_marks: 20, endSem: 48, total: 68, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'TE-B-08' },

  // --- SE A (9 Students) ---
  { id: 18, prn: '23CE001', college_id: '23CE001', roll: '01', rollNo: '01', name: 'Aditya Kulkarni', full_name: 'Aditya Kulkarni', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE A', current_class_name: 'SE A', division: 'A', div: 'A', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'aditya.kulkarni.se@comp.nmiet.edu.in', phone: '+91 98220 11221', status: 'Active', account_status: 'active', cgpa: '9.42', attendance: '94%', attendance_rate: '94.0', present: 23, absent: 1, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 28, endSem: 68, total: 96, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-A-01' },
  { id: 19, prn: '23CE002', college_id: '23CE002', roll: '02', rollNo: '02', name: 'Sneha Pawar', full_name: 'Sneha Pawar', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE A', current_class_name: 'SE A', division: 'A', div: 'A', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'sneha.pawar@comp.nmiet.edu.in', phone: '+91 98220 22332', status: 'Active', account_status: 'active', cgpa: '8.85', attendance: '88%', attendance_rate: '88.0', present: 21, absent: 3, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 26, endSem: 72, total: 98, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-A-02' },
  { id: 20, prn: '23CE003', college_id: '23CE003', roll: '03', rollNo: '03', name: 'Rohit Jadhav', full_name: 'Rohit Jadhav', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE A', current_class_name: 'SE A', division: 'A', div: 'A', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'rohit.jadhav@comp.nmiet.edu.in', phone: '+91 98220 33443', status: 'Active', account_status: 'active', cgpa: '8.40', attendance: '82%', attendance_rate: '82.0', present: 20, absent: 4, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 22, endSem: 64, total: 86, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-A-03' },
  { id: 21, prn: '23CE004', college_id: '23CE004', roll: '04', rollNo: '04', name: 'Pooja Jadhav', full_name: 'Pooja Jadhav', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE A', current_class_name: 'SE A', division: 'A', div: 'A', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'pooja.jadhav@comp.nmiet.edu.in', phone: '+91 98220 44554', status: 'Active', account_status: 'active', cgpa: '8.90', attendance: '92%', attendance_rate: '92.0', present: 22, absent: 2, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 26, endSem: 70, total: 96, result: 'Pass', hallTicketStatus: 'Not Generated', seatNo: 'SE-A-04' },
  { id: 22, prn: '23CE005', college_id: '23CE005', roll: '05', rollNo: '05', name: 'Om Shinde', full_name: 'Om Shinde', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE A', current_class_name: 'SE A', division: 'A', div: 'A', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'om.shinde@comp.nmiet.edu.in', phone: '+91 98220 55665', status: 'Active', account_status: 'active', cgpa: '8.15', attendance: '85%', attendance_rate: '85.0', present: 20, absent: 4, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 24, endSem: 62, total: 86, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-A-05' },
  { id: 23, prn: '23CE006', college_id: '23CE006', roll: '06', rollNo: '06', name: 'Riya More', full_name: 'Riya More', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE A', current_class_name: 'SE A', division: 'A', div: 'A', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'riya.more@comp.nmiet.edu.in', phone: '+91 98220 66776', status: 'Active', account_status: 'active', cgpa: '9.30', attendance: '96%', attendance_rate: '96.0', present: 23, absent: 1, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 29, endSem: 75, total: 104, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-A-06' },
  { id: 24, prn: '23CE007', college_id: '23CE007', roll: '07', rollNo: '07', name: 'Karan Bhosale', full_name: 'Karan Bhosale', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE A', current_class_name: 'SE A', division: 'A', div: 'A', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'karan.bhosale@comp.nmiet.edu.in', phone: '+91 98220 77887', status: 'Active', account_status: 'active', cgpa: '7.60', attendance: '79%', attendance_rate: '79.0', present: 19, absent: 5, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 20, endSem: 58, total: 78, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-A-07' },
  { id: 25, prn: '23CE008', college_id: '23CE008', roll: '08', rollNo: '08', name: 'Anjali Gaikwad', full_name: 'Anjali Gaikwad', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE A', current_class_name: 'SE A', division: 'A', div: 'A', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'anjali.gaikwad.se@comp.nmiet.edu.in', phone: '+91 98220 88998', status: 'Active', account_status: 'active', cgpa: '8.75', attendance: '90%', attendance_rate: '90.0', present: 22, absent: 2, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 25, endSem: 67, total: 92, result: 'Pass', hallTicketStatus: 'Not Generated', seatNo: 'SE-A-08' },
  { id: 26, prn: '23CE009', college_id: '23CE009', roll: '09', rollNo: '09', name: 'Tanmay Joshi', full_name: 'Tanmay Joshi', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE A', current_class_name: 'SE A', division: 'A', div: 'A', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'tanmay.joshi@comp.nmiet.edu.in', phone: '+91 98220 99009', status: 'Active', account_status: 'active', cgpa: '8.10', attendance: '84%', attendance_rate: '84.0', present: 20, absent: 4, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 23, endSem: 60, total: 83, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-A-09' },

  // --- SE B (8 Students) ---
  { id: 27, prn: '23CE010', college_id: '23CE010', roll: '01', rollNo: '01', name: 'Neha Sawant', full_name: 'Neha Sawant', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE B', current_class_name: 'SE B', division: 'B', div: 'B', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'neha.sawant@comp.nmiet.edu.in', phone: '+91 98220 11010', status: 'Active', account_status: 'active', cgpa: '8.95', attendance: '93%', attendance_rate: '93.0', present: 22, absent: 2, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 27, endSem: 70, total: 97, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-B-01' },
  { id: 28, prn: '23CE011', college_id: '23CE011', roll: '02', rollNo: '02', name: 'Vikas Sharma', full_name: 'Vikas Sharma', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE B', current_class_name: 'SE B', division: 'B', div: 'B', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'vikas.sharma@comp.nmiet.edu.in', phone: '+91 98220 11011', status: 'Active', account_status: 'active', cgpa: '8.25', attendance: '86%', attendance_rate: '86.0', present: 21, absent: 3, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 24, endSem: 65, total: 89, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-B-02' },
  { id: 29, prn: '23CE012', college_id: '23CE012', roll: '03', rollNo: '03', name: 'Pooja Mane', full_name: 'Pooja Mane', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE B', current_class_name: 'SE B', division: 'B', div: 'B', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'pooja.mane@comp.nmiet.edu.in', phone: '+91 98220 11012', status: 'Active', account_status: 'active', cgpa: '9.15', attendance: '95%', attendance_rate: '95.0', present: 23, absent: 1, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 28, endSem: 74, total: 102, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-B-03' },
  { id: 30, prn: '23CE013', college_id: '23CE013', roll: '04', rollNo: '04', name: 'Siddharth Rao', full_name: 'Siddharth Rao', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE B', current_class_name: 'SE B', division: 'B', div: 'B', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'siddharth.rao@comp.nmiet.edu.in', phone: '+91 98220 11013', status: 'Active', account_status: 'active', cgpa: '8.00', attendance: '83%', attendance_rate: '83.0', present: 20, absent: 4, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 22, endSem: 61, total: 83, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-B-04' },
  { id: 31, prn: '23CE014', college_id: '23CE014', roll: '05', rollNo: '05', name: 'Gauri Kadam', full_name: 'Gauri Kadam', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE B', current_class_name: 'SE B', division: 'B', div: 'B', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'gauri.kadam@comp.nmiet.edu.in', phone: '+91 98220 11014', status: 'Active', account_status: 'active', cgpa: '8.70', attendance: '91%', attendance_rate: '91.0', present: 22, absent: 2, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 26, endSem: 69, total: 95, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-B-05' },
  { id: 32, prn: '23CE015', college_id: '23CE015', roll: '06', rollNo: '06', name: 'Harshvardhan Shinde', full_name: 'Harshvardhan Shinde', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE B', current_class_name: 'SE B', division: 'B', div: 'B', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'harsh.shinde@comp.nmiet.edu.in', phone: '+91 98220 11015', status: 'Active', account_status: 'active', cgpa: '7.45', attendance: '77%', attendance_rate: '77.0', present: 18, absent: 6, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 21, endSem: 56, total: 77, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-B-06' },
  { id: 33, prn: '23CE016', college_id: '23CE016', roll: '07', rollNo: '07', name: 'Divya Thorat', full_name: 'Divya Thorat', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE B', current_class_name: 'SE B', division: 'B', div: 'B', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'divya.thorat@comp.nmiet.edu.in', phone: '+91 98220 11016', status: 'Active', account_status: 'active', cgpa: '9.10', attendance: '94%', attendance_rate: '94.0', present: 23, absent: 1, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 28, endSem: 73, total: 101, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'SE-B-07' },
  { id: 34, prn: '23CE017', college_id: '23CE017', roll: '08', rollNo: '08', name: 'Kunal Sonawane', full_name: 'Kunal Sonawane', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'SE', class_name: 'SE', className: 'SE B', current_class_name: 'SE B', division: 'B', div: 'B', semester: 'III', academicYear: '2026 - 27', admission_year: 2024, email: 'kunal.sonawane@comp.nmiet.edu.in', phone: '+91 98220 11017', status: 'Active', account_status: 'active', cgpa: '7.20', attendance: '75%', attendance_rate: '75.0', present: 18, absent: 6, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, internal_marks: 19, endSem: 52, total: 71, result: 'Pass', hallTicketStatus: 'Not Generated', seatNo: 'SE-B-08' },

  // --- BE A (9 Students) ---
  { id: 35, prn: '21CE001', college_id: '21CE001', roll: '01', rollNo: '01', name: 'Omkar Gole', full_name: 'Omkar Gole', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE A', current_class_name: 'BE A', division: 'A', div: 'A', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'omkar.gole@comp.nmiet.edu.in', phone: '+91 98220 22001', status: 'Active', account_status: 'active', cgpa: '9.25', attendance: '95%', attendance_rate: '95.0', present: 43, absent: 2, placementStatus: 'Placed', companyPlaced: 'Capgemini', package: '6.8 LPA', role: 'Software Engineer', skills: ['Java', 'Spring', 'Docker'], resumeAvailable: true, eligible: true, appliedDrives: 3, internal_marks: 28, endSem: 75, total: 103, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-A-01' },
  { id: 36, prn: '21CE002', college_id: '21CE002', roll: '02', rollNo: '02', name: 'Monika Koli', full_name: 'Monika Koli', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE A', current_class_name: 'BE A', division: 'A', div: 'A', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'monika.koli@comp.nmiet.edu.in', phone: '+91 98220 22002', status: 'Active', account_status: 'active', cgpa: '8.90', attendance: '92%', attendance_rate: '92.0', present: 41, absent: 4, placementStatus: 'Placed', companyPlaced: 'Wipro', package: '6.5 LPA', role: 'Project Engineer', skills: ['Python', 'Django', 'PostgreSQL'], resumeAvailable: true, eligible: true, appliedDrives: 2, internal_marks: 27, endSem: 72, total: 99, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-A-02' },
  { id: 37, prn: '21CE003', college_id: '21CE003', roll: '03', rollNo: '03', name: 'Shubham Bhise', full_name: 'Shubham Bhise', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE A', current_class_name: 'BE A', division: 'A', div: 'A', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'shubham.bhise@comp.nmiet.edu.in', phone: '+91 98220 22003', status: 'Active', account_status: 'active', cgpa: '8.30', attendance: '88%', attendance_rate: '88.0', present: 40, absent: 5, placementStatus: 'In Process', companyPlaced: null, package: null, role: null, skills: ['React', 'Node.js'], resumeAvailable: true, eligible: true, appliedDrives: 2, internal_marks: 24, endSem: 64, total: 88, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-A-03' },
  { id: 38, prn: '21CE004', college_id: '21CE004', roll: '04', rollNo: '04', name: 'Tejaswini Dixit', full_name: 'Tejaswini Dixit', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE A', current_class_name: 'BE A', division: 'A', div: 'A', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'tejaswini.dixit@comp.nmiet.edu.in', phone: '+91 98220 22004', status: 'Active', account_status: 'active', cgpa: '9.40', attendance: '96%', attendance_rate: '96.0', present: 43, absent: 2, placementStatus: 'Placed', companyPlaced: 'Infosys', package: '9.5 LPA', role: 'Specialist Programmer', skills: ['Java', 'Microservices', 'Kubernetes'], resumeAvailable: true, eligible: true, appliedDrives: 3, internal_marks: 29, endSem: 71, total: 100, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-A-04' },
  { id: 39, prn: '21CE005', college_id: '21CE005', roll: '05', rollNo: '05', name: 'Digvijay Rane', full_name: 'Digvijay Rane', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE A', current_class_name: 'BE A', division: 'A', div: 'A', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'digvijay.rane@comp.nmiet.edu.in', phone: '+91 98220 22005', status: 'Active', account_status: 'active', cgpa: '7.85', attendance: '81%', attendance_rate: '81.0', present: 36, absent: 9, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, skills: ['C++', 'SQL'], resumeAvailable: true, eligible: true, appliedDrives: 1, internal_marks: 22, endSem: 58, total: 80, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-A-05' },
  { id: 40, prn: '21CE006', college_id: '21CE006', roll: '06', rollNo: '06', name: 'Pooja Bagal', full_name: 'Pooja Bagal', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE A', current_class_name: 'BE A', division: 'A', div: 'A', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'pooja.bagal@comp.nmiet.edu.in', phone: '+91 98220 22006', status: 'Active', account_status: 'active', cgpa: '9.50', attendance: '97%', attendance_rate: '97.0', present: 44, absent: 1, placementStatus: 'Shortlisted', companyPlaced: null, package: null, role: null, skills: ['Python', 'AI/ML', 'Cloud'], resumeAvailable: true, eligible: true, appliedDrives: 3, internal_marks: 29, endSem: 76, total: 105, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-A-06' },
  { id: 41, prn: '21CE007', college_id: '21CE007', roll: '07', rollNo: '07', name: 'Saurabh Kenjale', full_name: 'Saurabh Kenjale', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE A', current_class_name: 'BE A', division: 'A', div: 'A', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'saurabh.kenjale@comp.nmiet.edu.in', phone: '+91 98220 22007', status: 'Active', account_status: 'active', cgpa: '8.45', attendance: '89%', attendance_rate: '89.0', present: 40, absent: 5, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, skills: ['Java', 'SQL'], resumeAvailable: true, eligible: true, appliedDrives: 2, internal_marks: 25, endSem: 66, total: 91, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-A-07' },
  { id: 42, prn: '21CE008', college_id: '21CE008', roll: '08', rollNo: '08', name: 'Mansi Gharge', full_name: 'Mansi Gharge', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE A', current_class_name: 'BE A', division: 'A', div: 'A', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'mansi.gharge@comp.nmiet.edu.in', phone: '+91 98220 22008', status: 'Active', account_status: 'active', cgpa: '8.80', attendance: '92%', attendance_rate: '92.0', present: 41, absent: 4, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, skills: ['Web', 'UI/UX', 'Figma'], resumeAvailable: true, eligible: true, appliedDrives: 2, internal_marks: 27, endSem: 69, total: 96, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-A-08' },
  { id: 43, prn: '21CE009', college_id: '21CE009', roll: '09', rollNo: '09', name: 'Kishor Dange', full_name: 'Kishor Dange', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE A', current_class_name: 'BE A', division: 'A', div: 'A', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'kishor.dange@comp.nmiet.edu.in', phone: '+91 98220 22009', status: 'Active', account_status: 'active', cgpa: '6.90', attendance: '72%', attendance_rate: '72.0', present: 32, absent: 13, placementStatus: 'Not Eligible', companyPlaced: null, package: null, role: null, skills: ['Basic Programming'], resumeAvailable: false, eligible: false, appliedDrives: 0, internal_marks: 17, endSem: 45, total: 62, result: 'Pass', hallTicketStatus: 'Not Generated', seatNo: 'BE-A-09' },

  // --- BE B (8 Students) ---
  { id: 44, prn: '21CE010', college_id: '21CE010', roll: '01', rollNo: '01', name: 'Aishwarya Jagdale', full_name: 'Aishwarya Jagdale', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE B', current_class_name: 'BE B', division: 'B', div: 'B', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'aishwarya.jagdale@comp.nmiet.edu.in', phone: '+91 98220 33010', status: 'Active', account_status: 'active', cgpa: '9.35', attendance: '96%', attendance_rate: '96.0', present: 43, absent: 2, placementStatus: 'Placed', companyPlaced: 'Accenture', package: '8.2 LPA', role: 'Associate Software Engineer', skills: ['Java', 'Cloud', 'DevOps'], resumeAvailable: true, eligible: true, appliedDrives: 3, internal_marks: 28, endSem: 74, total: 102, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-B-01' },
  { id: 45, prn: '21CE011', college_id: '21CE011', roll: '02', rollNo: '02', name: 'Suyash Ingale', full_name: 'Suyash Ingale', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE B', current_class_name: 'BE B', division: 'B', div: 'B', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'suyash.ingale@comp.nmiet.edu.in', phone: '+91 98220 33011', status: 'Active', account_status: 'active', cgpa: '8.40', attendance: '89%', attendance_rate: '89.0', present: 40, absent: 5, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, skills: ['Python', 'SQL'], resumeAvailable: true, eligible: true, appliedDrives: 2, internal_marks: 25, endSem: 65, total: 90, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-B-02' },
  { id: 46, prn: '21CE012', college_id: '21CE012', roll: '03', rollNo: '03', name: 'Rasika Pisal', full_name: 'Rasika Pisal', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE B', current_class_name: 'BE B', division: 'B', div: 'B', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'rasika.pisal@comp.nmiet.edu.in', phone: '+91 98220 33012', status: 'Active', account_status: 'active', cgpa: '8.85', attendance: '93%', attendance_rate: '93.0', present: 42, absent: 3, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, skills: ['Data Analysis', 'PowerBI'], resumeAvailable: true, eligible: true, appliedDrives: 2, internal_marks: 27, endSem: 70, total: 97, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-B-03' },
  { id: 47, prn: '21CE013', college_id: '21CE013', roll: '04', rollNo: '04', name: 'Mayur Mandhare', full_name: 'Mayur Mandhare', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE B', current_class_name: 'BE B', division: 'B', div: 'B', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'mayur.mandhare@comp.nmiet.edu.in', phone: '+91 98220 33013', status: 'Active', account_status: 'active', cgpa: '8.05', attendance: '85%', attendance_rate: '85.0', present: 38, absent: 7, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, skills: ['Web', 'PHP'], resumeAvailable: true, eligible: true, appliedDrives: 1, internal_marks: 23, endSem: 62, total: 85, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-B-04' },
  { id: 48, prn: '21CE014', college_id: '21CE014', roll: '05', rollNo: '05', name: 'Namrata Ghadge', full_name: 'Namrata Ghadge', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE B', current_class_name: 'BE B', division: 'B', div: 'B', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'namrata.ghadge@comp.nmiet.edu.in', phone: '+91 98220 33014', status: 'Active', account_status: 'active', cgpa: '8.75', attendance: '91%', attendance_rate: '91.0', present: 41, absent: 4, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, skills: ['Java', 'SQL'], resumeAvailable: true, eligible: true, appliedDrives: 2, internal_marks: 26, endSem: 68, total: 94, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-B-05' },
  { id: 49, prn: '21CE015', college_id: '21CE015', roll: '06', rollNo: '06', name: 'Ajinkya Gujar', full_name: 'Ajinkya Gujar', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE B', current_class_name: 'BE B', division: 'B', div: 'B', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'ajinkya.gujar@comp.nmiet.edu.in', phone: '+91 98220 33015', status: 'Active', account_status: 'active', cgpa: '7.50', attendance: '78%', attendance_rate: '78.0', present: 35, absent: 10, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, skills: ['C++', 'Testing'], resumeAvailable: true, eligible: true, appliedDrives: 1, internal_marks: 21, endSem: 57, total: 78, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-B-06' },
  { id: 50, prn: '21CE016', college_id: '21CE016', roll: '07', rollNo: '07', name: 'Shraddha Babar', full_name: 'Shraddha Babar', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE B', current_class_name: 'BE B', division: 'B', div: 'B', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'shraddha.babar@comp.nmiet.edu.in', phone: '+91 98220 33016', status: 'Active', account_status: 'active', cgpa: '9.20', attendance: '95%', attendance_rate: '95.0', present: 43, absent: 2, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, skills: ['Python', 'Django', 'AWS'], resumeAvailable: true, eligible: true, appliedDrives: 2, internal_marks: 28, endSem: 73, total: 101, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-B-07' },
  { id: 51, prn: '21CE017', college_id: '21CE017', roll: '08', rollNo: '08', name: 'Rahul Deshmukh', full_name: 'Rahul Deshmukh', department: 'Computer Engineering', dept: 'Computer Engineering', class: 'BE', class_name: 'BE', className: 'BE B', current_class_name: 'BE B', division: 'B', div: 'B', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'rahul.deshmukh@comp.nmiet.edu.in', phone: '+91 98220 33017', status: 'Active', account_status: 'active', cgpa: '9.42', attendance: '94%', attendance_rate: '94.0', present: 42, absent: 3, placementStatus: 'Placed', companyPlaced: 'TCS', package: '7.5 LPA', role: 'System Engineer', skills: ['Java', 'Spring Boot', 'React', 'Docker'], resumeAvailable: true, eligible: true, appliedDrives: 3, internal_marks: 28, endSem: 75, total: 103, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-B-08' },

  // --- Cross-Department Students (IT & ENTC) for Inter-departmental Verification ---
  { id: 52, prn: '22IT001', college_id: '22IT001', roll: '01', rollNo: '01', name: 'Aditya Joshi', full_name: 'Aditya Joshi', department: 'Information Technology', dept: 'Information Technology', class: 'TE', class_name: 'TE', className: 'TE IT A', current_class_name: 'TE IT A', division: 'A', div: 'A', semester: 'V', academicYear: '2026 - 27', admission_year: 2023, email: 'aditya.joshi@it.nmiet.edu.in', phone: '+91 98220 44001', status: 'Active', account_status: 'active', cgpa: '8.85', attendance: '92%', attendance_rate: '92.0', present: 41, absent: 4, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, internal_marks: 26, endSem: 68, total: 94, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'TE-IT-01' },
  { id: 53, prn: '22IT002', college_id: '22IT002', roll: '02', rollNo: '02', name: 'Pooja Kadam', full_name: 'Pooja Kadam', department: 'Information Technology', dept: 'Information Technology', class: 'TE', class_name: 'TE', className: 'TE IT A', current_class_name: 'TE IT A', division: 'A', div: 'A', semester: 'V', academicYear: '2026 - 27', admission_year: 2023, email: 'pooja.kadam@it.nmiet.edu.in', phone: '+91 98220 44002', status: 'Active', account_status: 'active', cgpa: '8.60', attendance: '90%', attendance_rate: '90.0', present: 40, absent: 5, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, internal_marks: 25, endSem: 66, total: 91, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'TE-IT-02' },
  { id: 54, prn: '21ET001', college_id: '21ET001', roll: '01', rollNo: '01', name: 'Sameer Shinde', full_name: 'Sameer Shinde', department: 'Electronics & Telecommunication', dept: 'Electronics & Telecommunication', class: 'BE', class_name: 'BE', className: 'BE ENTC A', current_class_name: 'BE ENTC A', division: 'A', div: 'A', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'sameer.shinde@entc.nmiet.edu.in', phone: '+91 98220 55001', status: 'Active', account_status: 'active', cgpa: '8.40', attendance: '88%', attendance_rate: '88.0', present: 39, absent: 6, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, internal_marks: 24, endSem: 62, total: 86, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-ET-01' },
  { id: 55, prn: '21ET002', college_id: '21ET002', roll: '02', rollNo: '02', name: 'Priya Salve', full_name: 'Priya Salve', department: 'Electronics & Telecommunication', dept: 'Electronics & Telecommunication', class: 'BE', class_name: 'BE', className: 'BE ENTC A', current_class_name: 'BE ENTC A', division: 'A', div: 'A', semester: 'VII', academicYear: '2026 - 27', admission_year: 2022, email: 'priya.salve@entc.nmiet.edu.in', phone: '+91 98220 55002', status: 'Active', account_status: 'active', cgpa: '8.75', attendance: '93%', attendance_rate: '93.0', present: 42, absent: 3, placementStatus: 'Eligible', companyPlaced: null, package: null, role: null, internal_marks: 27, endSem: 70, total: 97, result: 'Pass', hallTicketStatus: 'Generated', seatNo: 'BE-ET-02' },
];

export const INITIAL_EXAMS = [
  { id: 1, name: 'Data Structures & Algorithms', class: 'SE', semester: 'III', type: 'End Semester', status: 'Upcoming', academicYear: '2026 - 27', scheme: 'SPPU 2019 Course Pattern', date: '15 Apr 2025', time: '09:00 AM', venue: 'Hall A-101', duration: '3 hrs', totalStudents: 17 },
  { id: 2, name: 'Operating Systems & Web Tech', class: 'TE', semester: 'V', type: 'In-Sem Examination', status: 'Upcoming', academicYear: '2026 - 27', scheme: 'SPPU 2019 Course Pattern', date: '18 Apr 2025', time: '02:00 PM', venue: 'Hall B-202', duration: '3 hrs', totalStudents: 17 },
  { id: 3, name: 'High Performance Computing', class: 'BE', semester: 'VII', type: 'End Semester', status: 'Upcoming', academicYear: '2026 - 27', scheme: 'SPPU 2019 Course Pattern', date: '22 Apr 2025', time: '09:00 AM', venue: 'Hall C-303', duration: '3 hrs', totalStudents: 17 },
  { id: 4, name: 'Database Management Systems', class: 'SE', semester: 'III', type: 'Unit Test 2', status: 'Scheduled', academicYear: '2026 - 27', scheme: 'SPPU 2019 Course Pattern', date: '25 Apr 2025', time: '02:00 PM', venue: 'Hall A-102', duration: '1 hr', totalStudents: 17 },
  { id: 5, name: 'Machine Learning & AI', class: 'TE', semester: 'V', type: 'Unit Test 2', status: 'Scheduled', academicYear: '2026 - 27', scheme: 'SPPU 2019 Course Pattern', date: '28 Apr 2025', time: '09:00 AM', venue: 'Hall B-204', duration: '1 hr', totalStudents: 17 },
];

export const INITIAL_EXAM_RESULTS = [
  { id: 1, examName: 'Data Structures & Algorithms', class: 'SE', semester: 'III', appeared: 17, passed: 16, passPct: '94.1%', status: 'Published', publishedDate: '02 Oct 2026', verifiedBy: 'Mr. Suresh Patil' },
  { id: 2, examName: 'Database Management Systems', class: 'SE', semester: 'III', appeared: 17, passed: 15, passPct: '88.2%', status: 'Published', publishedDate: '28 Sep 2026', verifiedBy: 'Mr. Suresh Patil' },
  { id: 3, examName: 'Machine Learning & AI', class: 'TE', semester: 'V', appeared: 17, passed: 16, passPct: '94.1%', status: 'Draft', publishedDate: null, verifiedBy: null },
  { id: 4, examName: 'Computer Networks', class: 'BE', semester: 'VII', appeared: 17, passed: 15, passPct: '88.2%', status: 'Draft', publishedDate: null, verifiedBy: null },
];

export const INITIAL_COMPANIES = [
  { id: 1, name: 'TCS (Tata Consultancy Services)', industry: 'IT & Software Services', location: 'Pune / Pan India', tier: 'Tier 1 Partner', packageRange: '3.6 - 7.5 LPA', activeDrives: 1, totalHired: 2, contactPerson: 'Vikram Mehta (HR Head)', contactEmail: 'campus.hiring@tcs.com', rating: 4.8, status: 'Active' },
  { id: 2, name: 'Infosys', industry: 'IT Consulting & Services', location: 'Pune / Bengaluru', tier: 'Tier 1 Partner', packageRange: '6.5 - 9.5 LPA', activeDrives: 1, totalHired: 1, contactPerson: 'Pooja Nair (Lead Recruiter)', contactEmail: 'talent.acquisition@infosys.com', rating: 4.7, status: 'Active' },
  { id: 3, name: 'Capgemini', industry: 'Management & IT Consulting', location: 'Pune / Mumbai', tier: 'Global Partner', packageRange: '4.5 - 6.8 LPA', activeDrives: 1, totalHired: 1, contactPerson: 'Anand Roy (Campus Lead)', contactEmail: 'india.campus@capgemini.com', rating: 4.6, status: 'Active' },
  { id: 4, name: 'Accenture', industry: 'Technology Services & Digital', location: 'Pune / Hyderabad', tier: 'Global Partner', packageRange: '5.0 - 8.2 LPA', activeDrives: 1, totalHired: 1, contactPerson: 'Shweta Rao (HR Partner)', contactEmail: 'campus.india@accenture.com', rating: 4.8, status: 'Active' },
  { id: 5, name: 'Wipro Technologies', industry: 'Information Technology', location: 'Pune / Bangalore', tier: 'Tier 1 Partner', packageRange: '3.5 - 6.5 LPA', activeDrives: 0, totalHired: 1, contactPerson: 'Sanjay Deshmukh (Recruitment)', contactEmail: 'manager.campus@wipro.com', rating: 4.5, status: 'Active' },
];

export const INITIAL_PLACEMENT_DRIVES = [
  {
    id: 1,
    company: 'TCS (Tata Consultancy Services)',
    role: 'Software Developer / System Engineer',
    departments: ['Computer', 'IT', 'ENTC'],
    cgpaCutoff: 7.5,
    package: '7.5 LPA',
    date: '15 Oct 2026',
    deadline: '30 Aug 2024',
    time: '09:00 AM - 05:00 PM',
    status: 'Upcoming',
    location: 'NMIET Campus Auditorium / Virtual',
    jobType: 'Full Time',
    rounds: ['Online Aptitude & Coding', 'Technical Interview', 'HR Interview'],
    applicantsCount: 4,
  },
  {
    id: 2,
    company: 'Infosys',
    role: 'Specialist Programmer & System Engineer',
    departments: ['Computer', 'IT'],
    cgpaCutoff: 8.0,
    package: '9.5 LPA',
    date: '18 Oct 2026',
    deadline: '05 Sep 2024',
    time: '10:00 AM - 04:00 PM',
    status: 'Upcoming',
    location: 'Campus Tech Hall 2',
    jobType: 'Full Time',
    rounds: ['HackWithInfy Coding Test', 'Technical Discussion', 'HR Round'],
    applicantsCount: 3,
  },
  {
    id: 3,
    company: 'Capgemini',
    role: 'Software Engineer',
    departments: ['Computer', 'IT', 'ENTC', 'Mechanical'],
    cgpaCutoff: 7.0,
    package: '6.8 LPA',
    date: '22 Oct 2026',
    deadline: '10 Sep 2024',
    time: '09:30 AM - 05:30 PM',
    status: 'Upcoming',
    location: 'Main Auditorium',
    jobType: 'Full Time',
    rounds: ['Pseudo-code Assessment', 'English Test', 'Game-based Aptitude', 'Technical & HR'],
    applicantsCount: 2,
  },
  {
    id: 4,
    company: 'Accenture',
    role: 'Associate Software Engineer (ASE)',
    departments: ['Computer', 'IT', 'ENTC'],
    cgpaCutoff: 7.2,
    package: '8.2 LPA',
    date: '28 Oct 2026',
    deadline: '15 Sep 2024',
    time: '09:00 AM - 04:30 PM',
    status: 'Scheduled',
    location: 'Virtual Proctored Drive',
    jobType: 'Full Time',
    rounds: ['Cognitive & Technical Assessment', 'Coding Test', 'Communication Test', 'Interview'],
    applicantsCount: 2,
  },
  {
    id: 5,
    company: 'Wipro Technologies',
    role: 'Project Engineer (Elite NLTH)',
    departments: ['Computer', 'IT', 'ENTC', 'Civil'],
    cgpaCutoff: 6.8,
    package: '6.5 LPA',
    date: '05 Nov 2026',
    deadline: '20 Sep 2024',
    time: '10:00 AM - 05:00 PM',
    status: 'Draft',
    location: 'Lab Block A & B',
    jobType: 'Full Time',
    rounds: ['Aptitude Test', 'Written Communication', 'Online Coding', 'Technical + HR'],
    applicantsCount: 1,
  },
];

export const INITIAL_PLACEMENT_APPLICATIONS = [
  { id: 1, studentId: 1, studentPrn: '22CE001', studentName: 'Krushna Funde', department: 'Computer', class: 'TE', driveId: 1, company: 'TCS (Tata Consultancy Services)', role: 'Software Developer', date: '01 Oct 2026', status: 'Shortlisted for Round 1', cgpa: '8.85', package: '7.5 LPA' },
  { id: 2, studentId: 1, studentPrn: '22CE001', studentName: 'Krushna Funde', department: 'Computer', class: 'TE', driveId: 2, company: 'Infosys', role: 'System Engineer', date: '03 Oct 2026', status: 'Under Review', cgpa: '8.85', package: '6.5 LPA' },
  { id: 3, studentId: 51, studentPrn: '21CE017', studentName: 'Rahul Deshmukh', department: 'Computer', class: 'BE', driveId: 1, company: 'TCS (Tata Consultancy Services)', role: 'System Engineer', date: '25 Sep 2026', status: 'Placed', cgpa: '9.42', package: '7.5 LPA' },
  { id: 4, studentId: 38, studentPrn: '21CE004', studentName: 'Tejaswini Dixit', department: 'Computer', class: 'BE', driveId: 2, company: 'Infosys', role: 'Specialist Programmer', date: '26 Sep 2026', status: 'Placed', cgpa: '9.40', package: '9.5 LPA' },
  { id: 5, studentId: 35, studentPrn: '21CE001', studentName: 'Omkar Gole', department: 'Computer', class: 'BE', driveId: 3, company: 'Capgemini', role: 'Software Engineer', date: '27 Sep 2026', status: 'Placed', cgpa: '9.25', package: '6.8 LPA' },
  { id: 6, studentId: 36, studentPrn: '21CE002', studentName: 'Monika Koli', department: 'Computer', class: 'BE', driveId: 5, company: 'Wipro Technologies', role: 'Project Engineer', date: '28 Sep 2026', status: 'Placed', cgpa: '8.90', package: '6.5 LPA' },
  { id: 7, studentId: 44, studentPrn: '21CE010', studentName: 'Aishwarya Jagdale', department: 'Computer', class: 'BE', driveId: 4, company: 'Accenture', role: 'Associate Software Engineer', date: '29 Sep 2026', status: 'Placed', cgpa: '9.35', package: '8.2 LPA' },
  { id: 8, studentId: 2, studentPrn: '22CE002', studentName: 'Riya Deshmukh', department: 'Computer', class: 'TE', driveId: 1, company: 'TCS (Tata Consultancy Services)', role: 'Software Developer', date: '02 Oct 2026', status: 'Under Review', cgpa: '9.20', package: '7.5 LPA' },
];

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Unit Test 2 Schedule & Guidelines Released',
    desc: 'Unit Test 2 for SE, TE, and BE classes is scheduled starting 15th October. Check the detailed subject timetable and syllabus in the Exam section.',
    date: 'Oct 03, 2026',
    category: 'Academic',
    categoryPill: 'bg-blue-100 text-blue-800 border-blue-200',
    audience: 'All Students & Faculty',
    department: 'Computer Engineering',
    author: 'Prof. Kirti Borhade',
    dotColor: 'bg-blue-500',
    status: 'Published',
    isPinned: true,
  },
  {
    id: 2,
    title: 'TCS Digital & Ninja Placement Drive 2026-27 Registration',
    desc: 'Registration is now open for eligible TE and BE Computer, IT, and ENTC students with CGPA >= 7.5. Deadline for registering on the portal is 10th October.',
    date: 'Oct 02, 2026',
    category: 'Placement',
    categoryPill: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    audience: 'TE & BE Students',
    department: 'Placement Department',
    author: 'Prof. Satyajit Sirsat',
    dotColor: 'bg-emerald-500',
    status: 'Published',
    isPinned: true,
  },
  {
    id: 3,
    title: 'End Semester Examination Form Submission Deadline',
    desc: 'All eligible students must verify their internal marks and complete the university examination form clearance before 12th October.',
    date: 'Sep 30, 2026',
    category: 'Examination',
    categoryPill: 'bg-purple-100 text-purple-800 border-purple-200',
    audience: 'All Students',
    department: 'Examination Department',
    author: 'Prof. Akash Mhetre',
    dotColor: 'bg-purple-500',
    status: 'Published',
    isPinned: false,
  },
  {
    id: 4,
    title: 'Project Phase - I Synopsis Submission Notice',
    desc: 'TE Computer Engineering Division A students must submit their project synopsis, problem statement, and guide consent forms by 10th October.',
    date: 'Sep 28, 2026',
    category: 'Academic',
    categoryPill: 'bg-blue-100 text-blue-800 border-blue-200',
    audience: 'TE Computer Engineering – Division A',
    department: 'Computer Engineering',
    author: 'Prof. Sonal Kadam',
    dotColor: 'bg-blue-500',
    status: 'Published',
    isPinned: false,
  },
  {
    id: 5,
    title: 'DPDP Student Privacy & Academic Consent Policy Compliance',
    desc: 'In accordance with DPDP regulations, emergency contact and medical records have been updated with explicit purpose limitation and consent safeguards.',
    date: 'Sep 25, 2026',
    category: 'General',
    categoryPill: 'bg-amber-100 text-amber-800 border-amber-200',
    audience: 'All Users',
    department: 'Administration',
    author: 'Kartik Bhegade',
    dotColor: 'bg-amber-500',
    status: 'Published',
    isPinned: false,
  },
  {
    id: 6,
    title: 'Campus Recruitment Orientation Session with Industry Experts',
    desc: 'An interactive session on resume building, technical interview preparation, and coding assessments on 8th October in Seminar Hall.',
    date: 'Sep 20, 2026',
    category: 'Placement',
    categoryPill: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    audience: 'All Students',
    department: 'Placement Department',
    author: 'Prof. Satyajit Sirsat',
    dotColor: 'bg-emerald-500',
    status: 'Published',
    isPinned: false,
  },
];

export const INITIAL_STUDENT_REQUESTS = [
  { id: 'REQ001', studentName: 'Siddhant More', studentPrn: '22CE005', prn: '22CE005', rollNo: '05', roll: '05', type: 'Profile Update', title: 'Profile Update Request', description: 'Update my contact number and address', desc: 'Update my contact number and address', date: 'Oct 01, 2026', status: 'Under Review', statusBadge: 'bg-amber-100 text-amber-800 border-amber-200', dotColor: 'bg-amber-500', assignedTo: 'Prof. Sonal Kadam', details: 'Student submitted updated residential proof and parent authorization for change of mobile contact to +91 98221 00005.' },
  { id: 'REQ002', studentName: 'Riya Deshmukh', studentPrn: '22CE002', prn: '22CE002', rollNo: '02', roll: '02', type: 'Attendance Correction', title: 'Attendance Correction (Hackathon)', description: 'Mark absent as present for 28 Sep (Hackathon)', desc: 'Mark absent as present for 28 Sep (Hackathon)', date: 'Sep 29, 2026', status: 'Approved', statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200', dotColor: 'bg-emerald-500', assignedTo: 'Prof. Sonal Kadam', details: 'Student was participating in State Level Smart India Hackathon preliminary rounds with official department sanction.' },
  { id: 'REQ003', studentName: 'Om Jagtap', studentPrn: '22CE003', prn: '22CE003', rollNo: '03', roll: '03', type: 'Academic Record Clarification', title: 'Academic Record Clarification', description: 'Internal marks score error in WT', desc: 'Internal marks score error in WT', date: 'Sep 27, 2026', status: 'Forwarded', statusBadge: 'bg-blue-100 text-blue-800 border-blue-200', dotColor: 'bg-blue-500', assignedTo: 'Prof. Kirti Borhade', details: 'Student requested re-evaluation of Web Technology Test 1 question 3B where 4 marks were omitted in total addition.' },
  { id: 'REQ004', studentName: 'Neha Patil', studentPrn: '22CE004', prn: '22CE004', rollNo: '04', roll: '04', type: 'Subject Enrollment', title: 'Subject Enrollment', description: 'Add Elective-II Honors Course', desc: 'Add Elective-II Honors Course', date: 'Sep 25, 2026', status: 'Pending', statusBadge: 'bg-orange-100 text-orange-800 border-orange-200', dotColor: 'bg-orange-500', assignedTo: 'Prof. Sonal Kadam', details: 'Student meets prerequisite CGPA > 8.5 and requests enrollment in Data Science Honors track.' },
  { id: 'REQ005', studentName: 'Tanvi Shinde', studentPrn: '22CE006', prn: '22CE006', rollNo: '06', roll: '06', type: 'Profile Update', title: 'Emergency Contact Update', description: 'Update emergency contact details', desc: 'Update emergency contact details', date: 'Sep 22, 2026', status: 'Approved', statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200', dotColor: 'bg-emerald-500', assignedTo: 'Prof. Sonal Kadam', details: 'Updated guardian contact verified and approved under DPDP consent policies.' },
  { id: 'REQ006', studentName: 'Rohit Yadav', studentPrn: '22CE007', prn: '22CE007', rollNo: '07', roll: '07', type: 'Medical Leave', title: 'Medical Leave Request', description: 'Medical leave approval (3 days)', desc: 'Medical leave approval (3 days)', date: 'Sep 20, 2026', status: 'Rejected', statusBadge: 'bg-rose-100 text-rose-800 border-rose-200', dotColor: 'bg-rose-500', assignedTo: 'Prof. Sonal Kadam', details: 'Medical certificate missing authorized clinic seal and registration number.' },
  { id: 'REQ007', studentName: 'Krushna Funde', studentPrn: '22CE001', prn: '22CE001', rollNo: '01', roll: '01', type: 'Attendance Correction', title: 'Attendance Correction (Duty Leave)', description: 'Duty leave credit for Campus Placement Drive assistance', desc: 'Duty leave credit for Campus Placement Drive assistance', date: 'Oct 02, 2026', status: 'Under Review', statusBadge: 'bg-amber-100 text-amber-800 border-amber-200', dotColor: 'bg-amber-500', assignedTo: 'Prof. Sonal Kadam', details: 'Student volunteered for placement drive logistics and submitted signed duty chit.' },
  { id: 'REQ008', studentName: 'Pooja Khairnar', studentPrn: '22CE008', prn: '22CE008', rollNo: '08', roll: '08', type: 'Academic Record Clarification', title: 'Cloud Computing Grade Discrepancy', description: 'Cloud Computing assignment grade discrepancy', desc: 'Cloud Computing assignment grade discrepancy', date: 'Sep 15, 2026', status: 'Approved', statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200', dotColor: 'bg-emerald-500', assignedTo: 'Prof. Sonal Kadam', details: 'Assignment score updated from 22/30 to 28/30 after reviewing late submission waiver.' },
  { id: 'REQ009', studentName: 'Krushna Funde', studentPrn: '22CE001', prn: '22CE001', rollNo: '01', roll: '01', type: 'Bonafide Certificate', title: 'Bonafide Certificate Application', description: 'Application for passport verification and education loan renewal', desc: 'Application for passport verification and education loan renewal', date: 'Sep 24, 2026', status: 'Approved', statusBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200', dotColor: 'bg-emerald-500', assignedTo: 'Prof. Kirti Borhade', details: 'Official digitally signed bonafide certificate issued and sent to registered student email.' },
];

export const INITIAL_ACTIVITIES = [
  { id: 1, action: 'Student Registered', text: 'New student added: Krushna Funde (PRN 22CE001)', target: 'TE Computer A', time: '1 hour ago', user: 'Prof. Kirti Borhade', dept: 'Academic' },
  { id: 2, action: 'Placement Drive Scheduled', text: 'TCS Placement Drive scheduled for 15 Oct 2026', target: 'BE & TE', time: '2 hours ago', user: 'Prof. Satyajit Sirsat', dept: 'Placement' },
  { id: 3, action: 'Exam Result Published', text: 'Data Structures SE End Semester Result published', target: 'SE Computer', time: '1 day ago', user: 'Prof. Akash Mhetre', dept: 'Examination' },
  { id: 4, action: 'Attendance Submitted', text: 'Daily attendance recorded for TE Computer A (42 Present, 3 Absent)', target: 'TE Computer A', time: '1 day ago', user: 'Prof. Sonal Kadam', dept: 'Academic' },
  { id: 5, action: 'Student Placed', text: 'Rahul Deshmukh placed at TCS (7.5 LPA)', target: 'BE Computer B', time: '2 days ago', user: 'Prof. Satyajit Sirsat', dept: 'Placement' },
  { id: 6, action: 'Student Request Approved', text: 'Attendance Correction approved for Riya Deshmukh', target: 'TE Computer A', time: '3 days ago', user: 'Prof. Sonal Kadam', dept: 'Academic' },
];

// =========================================================================
// 2. CENTRAL DATA PROVIDER COMPONENT
// =========================================================================

export function CentralDataProvider({ children }) {
  // Try loading from localStorage, else fallback to initial clean dataset
  const [departments, setDepartments] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_departments`);
      return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
    } catch {
      return INITIAL_DEPARTMENTS;
    }
  });

  const [classes, setClasses] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_classes`);
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  const [faculty, setFaculty] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_faculty`);
      return saved ? JSON.parse(saved) : INITIAL_FACULTY;
    } catch {
      return INITIAL_FACULTY;
    }
  });

  const [subjects, setSubjects] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_subjects`);
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  // Clean up legacy v1/v2 cached storage on mount
  useEffect(() => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('collegeconnect_central_data_v1') || key.startsWith('collegeconnect_central_data_v2')) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((s) => {
          if (s.id === 1 || s.prn === '22CE001') {
            return {
              ...s,
              name: 'Krushna Funde',
              fullName: 'Krushna Ashok Funde',
              full_name: 'Krushna Ashok Funde',
              email: 'krushna.funde@comp.nmiet.edu.in',
            };
          }
          return s;
        });
      }
      return INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [exams, setExams] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_exams`);
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  const [examResults, setExamResults] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_exam_results`);
      return saved ? JSON.parse(saved) : INITIAL_EXAM_RESULTS;
    } catch {
      return INITIAL_EXAM_RESULTS;
    }
  });

  const [companies, setCompanies] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_companies`);
      return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
    } catch {
      return INITIAL_COMPANIES;
    }
  });

  const [placementDrives, setPlacementDrives] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_drives`);
      return saved ? JSON.parse(saved) : INITIAL_PLACEMENT_DRIVES;
    } catch {
      return INITIAL_PLACEMENT_DRIVES;
    }
  });

  const [placementApplications, setPlacementApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_applications`);
      return saved ? JSON.parse(saved) : INITIAL_PLACEMENT_APPLICATIONS;
    } catch {
      return INITIAL_PLACEMENT_APPLICATIONS;
    }
  });

  const [announcements, setAnnouncements] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_announcements`);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [requests, setRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_requests`);
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_REQUESTS;
    } catch {
      return INITIAL_STUDENT_REQUESTS;
    }
  });

  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_departments`, JSON.stringify(departments));
      localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
      localStorage.setItem(`${STORAGE_KEY}_faculty`, JSON.stringify(faculty));
      localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_KEY}_exams`, JSON.stringify(exams));
      localStorage.setItem(`${STORAGE_KEY}_exam_results`, JSON.stringify(examResults));
      localStorage.setItem(`${STORAGE_KEY}_companies`, JSON.stringify(companies));
      localStorage.setItem(`${STORAGE_KEY}_drives`, JSON.stringify(placementDrives));
      localStorage.setItem(`${STORAGE_KEY}_applications`, JSON.stringify(placementApplications));
      localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(announcements));
      localStorage.setItem(`${STORAGE_KEY}_requests`, JSON.stringify(requests));
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
    } catch (e) {
      console.warn('Central storage sync error:', e);
    }
  }, [departments, classes, faculty, subjects, students, exams, examResults, companies, placementDrives, placementApplications, announcements, requests, activities]);

  // =========================================================================
  // 3. CENTRALIZED SYNCHRONIZED MUTATION METHODS
  // =========================================================================

  // Add a Student (updates central student pool and activities)
  const addStudent = useCallback((newStudentData) => {
    const studentId = Date.now();
    const formattedStudent = {
      id: studentId,
      prn: newStudentData.prn || `22CE${String(studentId).slice(-3)}`,
      college_id: newStudentData.prn || `22CE${String(studentId).slice(-3)}`,
      roll: newStudentData.roll || '59',
      rollNo: newStudentData.roll || '59',
      name: newStudentData.name || newStudentData.full_name || 'New Student',
      full_name: newStudentData.name || newStudentData.full_name || 'New Student',
      department: newStudentData.department || 'Computer Engineering',
      dept: newStudentData.department || 'Computer Engineering',
      class: newStudentData.class || newStudentData.class_name || 'SE',
      class_name: newStudentData.class || newStudentData.class_name || 'SE',
      className: newStudentData.className || `${newStudentData.class || 'SE'} ${newStudentData.division || 'A'}`,
      current_class_name: newStudentData.className || `${newStudentData.class || 'SE'} ${newStudentData.division || 'A'}`,
      division: newStudentData.division || 'A',
      div: newStudentData.division || 'A',
      semester: newStudentData.semester || 'III',
      academicYear: '2026 - 27',
      admission_year: newStudentData.admission_year || 2024,
      email: newStudentData.email || 'student@comp.nmiet.edu.in',
      phone: newStudentData.phone || '+91 98220 00000',
      status: 'Active',
      account_status: 'active',
      todayStatus: 'Present',
      cgpa: newStudentData.cgpa || '8.00',
      attendance: newStudentData.attendance || '85%',
      attendance_rate: '85.0',
      present: 20,
      absent: 3,
      placementStatus: 'Eligible',
      companyPlaced: null,
      package: null,
      role: null,
      skills: ['Programming'],
      certifications: [],
      resumeAvailable: false,
      eligible: true,
      appliedDrives: 0,
      internal_marks: 24,
      endSem: 60,
      total: 84,
      result: 'Pass',
      hallTicketStatus: 'Generated',
      seatNo: `SE-A-${String(studentId).slice(-2)}`,
    };

    setStudents((prev) => [formattedStudent, ...prev]);

    setActivities((prev) => [
      {
        id: Date.now(),
        action: 'Student Added',
        text: `New student added: ${formattedStudent.name} (${formattedStudent.prn})`,
        target: formattedStudent.className,
        time: 'Just now',
        user: 'Academic Admin',
        dept: 'Academic',
      },
      ...prev,
    ]);

    return formattedStudent;
  }, []);

  // Update a Student
  const updateStudent = useCallback((studentId, updateData) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId || s.prn === studentId ? { ...s, ...updateData } : s))
    );
  }, []);

  // Delete a Student
  const deleteStudent = useCallback((studentId) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId && s.prn !== studentId));
  }, []);

  // Create a Class
  const createClass = useCallback((newClassData) => {
    const classRecord = {
      id: Date.now(),
      name: newClassData.name || `${newClassData.year || 'TE'} ${newClassData.dept || 'Computer'} ${newClassData.division || 'A'}`,
      year: newClassData.year || 'TE',
      division: newClassData.division || 'A',
      class_name: newClassData.year || 'TE',
      dept: newClassData.dept || 'Computer Engineering',
      classTeacher: newClassData.classTeacher || 'Prof. Sonal Kadam',
      classTeacherEmail: 'faculty@comp.nmiet.edu.in',
      room: newClassData.room || 'Classroom 309',
      semester: newClassData.semester || 'V',
      academicYear: '2026 - 27',
    };

    setClasses((prev) => [...prev, classRecord]);
    return classRecord;
  }, []);

  // Add Subject
  const addSubject = useCallback((newSubjectData) => {
    const subRecord = {
      id: Date.now(),
      code: newSubjectData.code || `410${Math.floor(Math.random() * 800 + 200)}`,
      name: newSubjectData.name || 'New Subject',
      short: newSubjectData.short || newSubjectData.name?.slice(0, 4).toUpperCase() || 'SUB',
      credits: Number(newSubjectData.credits) || 3,
      dept: newSubjectData.dept || 'Computer Engineering',
      semester: newSubjectData.semester || 'V',
      class_name: newSubjectData.class_name || 'TE',
      faculty: newSubjectData.faculty || 'Prof. Sonal Kadam',
      average: '78%',
      highest: '95%',
      lowest: '50%',
      passRate: '100%',
      barColor: 'bg-emerald-500',
    };

    setSubjects((prev) => [...prev, subRecord]);
    return subRecord;
  }, []);

  // Announcements
  const addAnnouncement = useCallback((newAnnouncement) => {
    const record = {
      id: Date.now(),
      title: newAnnouncement.title,
      desc: newAnnouncement.desc || newAnnouncement.description || newAnnouncement.content || '',
      date: 'Just now',
      category: newAnnouncement.category || 'General',
      categoryPill: 'bg-blue-100 text-blue-800 border-blue-200',
      audience: newAnnouncement.audience || 'All Students',
      department: newAnnouncement.department || 'Computer Engineering',
      author: newAnnouncement.author || 'Department Authority',
      dotColor: 'bg-blue-500',
      status: 'Published',
      isPinned: false,
    };
    setAnnouncements((prev) => [record, ...prev]);
    return record;
  }, []);

  const deleteAnnouncement = useCallback((id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const togglePinAnnouncement = useCallback((id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
  }, []);

  // Student Requests
  const updateRequestStatus = useCallback((requestId, newStatus, reviewerName = 'Prof. Sonal Kadam') => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const badgeClass =
            newStatus === 'Approved'
              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
              : newStatus === 'Rejected'
              ? 'bg-rose-100 text-rose-800 border-rose-200'
              : newStatus === 'Forwarded'
              ? 'bg-blue-100 text-blue-800 border-blue-200'
              : 'bg-amber-100 text-amber-800 border-amber-200';

          return {
            ...req,
            status: newStatus,
            statusBadge: badgeClass,
            reviewedBy: reviewerName,
            reviewedAt: 'Just now',
          };
        }
        return req;
      })
    );

    setActivities((prev) => [
      {
        id: Date.now(),
        action: 'Request Reviewed',
        text: `Request ${requestId} status updated to ${newStatus}`,
        target: 'Student Requests',
        time: 'Just now',
        user: reviewerName,
        dept: 'Academic',
      },
      ...prev,
    ]);
  }, []);

  // Placement Drives & Companies
  const addPlacementDrive = useCallback((driveData) => {
    const newDrive = {
      id: Date.now(),
      company: driveData.company,
      role: driveData.role,
      departments: Array.isArray(driveData.departments) ? driveData.departments : ['Computer', 'IT', 'ENTC'],
      cgpaCutoff: Number(driveData.cgpaCutoff || driveData.minCgpa || 7.0),
      package: driveData.package || '6.5 LPA',
      date: driveData.date || 'Upcoming',
      deadline: driveData.deadline || 'Upcoming',
      time: driveData.time || '09:00 AM - 05:00 PM',
      status: driveData.status || 'Upcoming',
      location: driveData.location || 'College Campus',
      jobType: driveData.jobType || 'Full Time',
      rounds: driveData.rounds || ['Technical Test', 'Interview'],
      applicantsCount: 0,
    };
    setPlacementDrives((prev) => [newDrive, ...prev]);
    return newDrive;
  }, []);

  const addCompany = useCallback((companyData) => {
    const newComp = {
      id: Date.now(),
      name: companyData.name,
      industry: companyData.industry || 'Information Technology',
      location: companyData.location || 'Pune',
      tier: companyData.tier || 'Partner',
      packageRange: companyData.packageRange || '4.5 - 7.5 LPA',
      activeDrives: 0,
      totalHired: 0,
      contactPerson: companyData.contactPerson || 'HR Manager',
      contactEmail: companyData.contactEmail || 'contact@company.com',
      rating: 4.5,
      status: 'Active',
    };
    setCompanies((prev) => [newComp, ...prev]);
    return newComp;
  }, []);

  // Submit Placement Application
  const submitPlacementApplication = useCallback((driveId, studentData) => {
    const drive = placementDrives.find((d) => d.id === driveId || d.company === driveId);
    const existing = placementApplications.find(
      (a) => (a.driveId === driveId || a.company === drive?.company) && a.studentPrn === studentData.prn
    );

    if (existing) {
      return { success: false, message: 'Already applied for this drive' };
    }

    const newApp = {
      id: Date.now(),
      studentId: studentData.id || 1,
      studentPrn: studentData.prn || '22CE001',
      studentName: studentData.name || 'Krushna Funde',
      department: studentData.department || 'Computer',
      class: studentData.class || 'TE',
      driveId: drive?.id || driveId,
      company: drive?.company || 'Company Drive',
      role: drive?.role || 'Software Engineer',
      date: 'Just now',
      status: 'Application Under Review',
      cgpa: studentData.cgpa || '8.85',
      package: drive?.package || '7.5 LPA',
    };

    setPlacementApplications((prev) => [newApp, ...prev]);

    // Update applicants count on drive
    if (drive) {
      setPlacementDrives((prev) =>
        prev.map((d) => (d.id === drive.id ? { ...d, applicantsCount: (d.applicantsCount || 0) + 1 } : d))
      );
    }

    return { success: true, application: newApp };
  }, [placementDrives, placementApplications]);

  // Exam Result Management
  const publishExamResult = useCallback((examId) => {
    setExamResults((prev) =>
      prev.map((r) =>
        r.id === examId || r.examName === examId
          ? { ...r, status: 'Published', publishedDate: 'Today', verifiedBy: 'Mr. Suresh Patil' }
          : r
      )
    );
  }, []);

  // Mark Attendance
  const markAttendanceRecord = useCallback((classId, attendanceData) => {
    // updates student present/absent statuses
    setActivities((prev) => [
      {
        id: Date.now(),
        action: 'Attendance Updated',
        text: `Attendance recorded for ${classId}`,
        target: classId,
        time: 'Just now',
        user: 'Class Teacher',
        dept: 'Academic',
      },
      ...prev,
    ]);
  }, []);

  // Reset to Clean Demo State
  const resetToDemoData = useCallback(() => {
    setDepartments(INITIAL_DEPARTMENTS);
    setClasses(INITIAL_CLASSES);
    setFaculty(INITIAL_FACULTY);
    setSubjects(INITIAL_SUBJECTS);
    setStudents(INITIAL_STUDENTS);
    setExams(INITIAL_EXAMS);
    setExamResults(INITIAL_EXAM_RESULTS);
    setCompanies(INITIAL_COMPANIES);
    setPlacementDrives(INITIAL_PLACEMENT_DRIVES);
    setPlacementApplications(INITIAL_PLACEMENT_APPLICATIONS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setRequests(INITIAL_STUDENT_REQUESTS);
    setActivities(INITIAL_ACTIVITIES);
    localStorage.clear();
  }, []);

  return (
    <CentralDataContext.Provider
      value={{
        // Data Entities
        departments,
        classes,
        faculty,
        subjects,
        students,
        exams,
        examResults,
        companies,
        placementDrives,
        placementApplications,
        announcements,
        requests,
        activities,

        // Mutation Handlers
        addStudent,
        updateStudent,
        deleteStudent,
        createClass,
        addSubject,
        addAnnouncement,
        deleteAnnouncement,
        togglePinAnnouncement,
        updateRequestStatus,
        addPlacementDrive,
        addCompany,
        submitPlacementApplication,
        publishExamResult,
        markAttendanceRecord,
        resetToDemoData,
      }}
    >
      {children}
    </CentralDataContext.Provider>
  );
}

export function useCentralData() {
  const context = useContext(CentralDataContext);
  if (!context) {
    throw new Error('useCentralData must be used within a CentralDataProvider');
  }
  return context;
}
