import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  BookOpen,
  Shield,
  Clock,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock
} from 'lucide-react';

const INITIAL_STUDENTS = [
  {
    id: 1,
    fullName: 'Aarav Rajesh Sharma',
    prn: 'PRN20240101',
    rollNo: 'COMP-A-01',
    email: 'aarav.sharma@collegeconnect.edu',
    phone: '+91 98765 43210',
    dob: '2005-04-12',
    department: 'Computer Engineering',
    deptCode: 'COMP',
    currentClass: 'SE A',
    academicYear: '2026-27',
    semester: 'Semester III',
    status: 'active',
    admissionYear: 2024,
    bloodGroup: 'B+',
    address: 'Flat 402, Green Meadows, Wakad, Pune, MH - 411057',
    cgpa: '9.14',
    attendance: '92.5%',
    privacyStatus: {
      consentGiven: true,
      consentDate: '2024-08-01',
      accessRequestsCount: 0,
      activeCorrectionRequests: 0,
      dataMasked: true,
    },
    history: [
      { action: 'Enrolled in AY 2026-27 SE A', by: 'Academic Admin', date: '2026-07-15' },
      { action: 'Semester II Results Published (SGPA 9.20)', by: 'Exam Admin', date: '2026-06-10' },
      { action: 'Initial DPDP Consent Acknowledged', by: 'Student', date: '2024-08-01' },
    ]
  },
  {
    id: 2,
    fullName: 'Ananya Sunil Deshpande',
    prn: 'PRN20240102',
    rollNo: 'COMP-A-02',
    email: 'ananya.deshpande@collegeconnect.edu',
    phone: '+91 98220 11223',
    dob: '2005-08-22',
    department: 'Computer Engineering',
    deptCode: 'COMP',
    currentClass: 'SE A',
    academicYear: '2026-27',
    semester: 'Semester III',
    status: 'active',
    admissionYear: 2024,
    bloodGroup: 'O+',
    address: 'B-12, Sagar Society, Kothrud, Pune, MH - 411038',
    cgpa: '9.42',
    attendance: '95.0%',
    privacyStatus: {
      consentGiven: true,
      consentDate: '2024-08-01',
      accessRequestsCount: 1,
      activeCorrectionRequests: 0,
      dataMasked: true,
    },
    history: [
      { action: 'Enrolled in AY 2026-27 SE A', by: 'Academic Admin', date: '2026-07-15' },
      { action: 'Data Access Request generated', by: 'Student', date: '2026-04-12' },
    ]
  },
  {
    id: 3,
    fullName: 'Rohan Vikram Patil',
    prn: 'PRN20230205',
    rollNo: 'IT-B-14',
    email: 'rohan.patil@collegeconnect.edu',
    phone: '+91 97654 33211',
    dob: '2004-11-05',
    department: 'Information Technology',
    deptCode: 'IT',
    currentClass: 'TE B',
    academicYear: '2026-27',
    semester: 'Semester V',
    status: 'active',
    admissionYear: 2023,
    bloodGroup: 'A+',
    address: 'Sector 21, Nigdi Pradhikaran, Pune, MH - 411044',
    cgpa: '8.86',
    attendance: '88.4%',
    privacyStatus: {
      consentGiven: true,
      consentDate: '2023-08-10',
      accessRequestsCount: 0,
      activeCorrectionRequests: 1,
      dataMasked: true,
    },
    history: [
      { action: 'Enrolled in AY 2026-27 TE B', by: 'Academic Admin', date: '2026-07-15' },
      { action: 'Requested Correction for Contact Mobile', by: 'Student', date: '2026-09-20' },
    ]
  },
  {
    id: 4,
    fullName: 'Pooja Manoj Kadam',
    prn: 'PRN20220310',
    rollNo: 'ENTC-A-28',
    email: 'pooja.kadam@collegeconnect.edu',
    phone: '+91 94230 45678',
    dob: '2003-02-18',
    department: 'Electronics & Telecommunication',
    deptCode: 'ENTC',
    currentClass: 'BE A',
    academicYear: '2026-27',
    semester: 'Semester VII',
    status: 'active',
    admissionYear: 2022,
    bloodGroup: 'AB+',
    address: 'Plot 78, Shivaji Nagar, Pune, MH - 411005',
    cgpa: '9.08',
    attendance: '91.2%',
    privacyStatus: {
      consentGiven: true,
      consentDate: '2022-08-15',
      accessRequestsCount: 0,
      activeCorrectionRequests: 0,
      dataMasked: true,
    },
    history: [
      { action: 'Enrolled in AY 2026-27 BE A', by: 'Academic Admin', date: '2026-07-15' },
      { action: 'Shortlisted for TCS Digital Placement', by: 'Placement Admin', date: '2026-10-10' },
    ]
  },
  {
    id: 5,
    fullName: 'Siddharth Nitin Shinde',
    prn: 'PRN20220412',
    rollNo: 'MECH-A-42',
    email: 'siddharth.shinde@collegeconnect.edu',
    phone: '+91 98901 23456',
    dob: '2003-07-30',
    department: 'Mechanical Engineering',
    deptCode: 'MECH',
    currentClass: 'BE A',
    academicYear: '2026-27',
    semester: 'Semester VII',
    status: 'active',
    admissionYear: 2022,
    bloodGroup: 'B+',
    address: 'Row House 4, Clover Park, Viman Nagar, Pune, MH - 411014',
    cgpa: '8.45',
    attendance: '86.0%',
    privacyStatus: {
      consentGiven: true,
      consentDate: '2022-08-15',
      accessRequestsCount: 0,
      activeCorrectionRequests: 0,
      dataMasked: true,
    },
    history: [
      { action: 'Enrolled in AY 2026-27 BE A', by: 'Academic Admin', date: '2026-07-15' },
    ]
  },
  {
    id: 6,
    fullName: 'Neha Sanjay Joshi',
    prn: 'PRN20240508',
    rollNo: 'CIVIL-A-09',
    email: 'neha.joshi@collegeconnect.edu',
    phone: '+91 97300 88990',
    dob: '2005-09-14',
    department: 'Civil Engineering',
    deptCode: 'CIVIL',
    currentClass: 'SE A',
    academicYear: '2026-27',
    semester: 'Semester III',
    status: 'active',
    admissionYear: 2024,
    bloodGroup: 'O-',
    address: 'Near Balgandharva, JM Road, Pune, MH - 411004',
    cgpa: '8.70',
    attendance: '93.8%',
    privacyStatus: {
      consentGiven: true,
      consentDate: '2024-08-01',
      accessRequestsCount: 0,
      activeCorrectionRequests: 0,
      dataMasked: true,
    },
    history: [
      { action: 'Enrolled in AY 2026-27 SE A', by: 'Academic Admin', date: '2026-07-15' },
    ]
  },
];

export function StudentsModule() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected student for Profile modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profileTab, setProfileTab] = useState('personal'); // 'personal', 'academic', 'privacy', 'history'

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    prn: '',
    email: '',
    phone: '',
    dob: '2005-01-01',
    department: 'Computer Engineering',
    academicYear: '2026-27',
    currentClass: 'SE A',
    status: 'active',
    address: '',
    bloodGroup: 'B+',
  });

  const { success, error } = useToast();

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.prn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
    const matchesClass = classFilter === 'ALL' || s.currentClass === classFilter;
    const matchesYear = yearFilter === 'ALL' || s.academicYear === yearFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter.toLowerCase();
    return matchesSearch && matchesDept && matchesClass && matchesYear && matchesStatus;
  });

  const handleCreateStudent = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.prn.trim() || !formData.email.trim()) {
      error('Full Name, PRN, and Institutional Email are required.');
      return;
    }

    if (students.some((s) => s.prn.toUpperCase() === formData.prn.trim().toUpperCase())) {
      error(`Student with PRN "${formData.prn.toUpperCase()}" already exists.`);
      return;
    }

    const deptCodeMap = {
      'Computer Engineering': 'COMP',
      'Information Technology': 'IT',
      'Electronics & Telecommunication': 'ENTC',
      'Mechanical Engineering': 'MECH',
      'Civil Engineering': 'CIVIL',
    };

    const newStudent = {
      id: Date.now(),
      fullName: formData.fullName.trim(),
      prn: formData.prn.trim().toUpperCase(),
      rollNo: `${deptCodeMap[formData.department] || 'GEN'}-${formData.currentClass.split(' ')[1] || 'A'}-99`,
      email: formData.email.trim(),
      phone: formData.phone || '+91 90000 00000',
      dob: formData.dob,
      department: formData.department,
      deptCode: deptCodeMap[formData.department] || 'GEN',
      currentClass: formData.currentClass,
      academicYear: formData.academicYear,
      semester: 'Semester III',
      status: formData.status,
      admissionYear: 2024,
      bloodGroup: formData.bloodGroup,
      address: formData.address || 'Campus Student Housing',
      cgpa: '0.00',
      attendance: '100%',
      privacyStatus: {
        consentGiven: true,
        consentDate: new Date().toISOString().split('T')[0],
        accessRequestsCount: 0,
        activeCorrectionRequests: 0,
        dataMasked: true,
      },
      history: [
        { action: 'Student profile registered in directory', by: 'Super Admin', date: new Date().toISOString().split('T')[0] },
      ]
    };

    setStudents([newStudent, ...students]);
    setShowAddModal(false);
    setFormData({
      fullName: '',
      prn: '',
      email: '',
      phone: '',
      dob: '2005-01-01',
      department: 'Computer Engineering',
      academicYear: '2026-27',
      currentClass: 'SE A',
      status: 'active',
      address: '',
      bloodGroup: 'B+',
    });
    success(`Student "${newStudent.fullName}" created successfully.`);
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      error('Student full name is required.');
      return;
    }

    setStudents((prev) =>
      prev.map((s) => (s.id === selectedStudent.id ? { ...s, ...formData } : s))
    );
    setShowEditModal(false);
    success(`Student profile updated for ${formData.fullName}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Directory</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Institutional directory of enrolled students with privacy-controlled profile governance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setFormData({
                fullName: '',
                prn: '',
                email: '',
                phone: '',
                dob: '2005-01-01',
                department: 'Computer Engineering',
                academicYear: '2026-27',
                currentClass: 'SE A',
                status: 'active',
                address: '',
                bloodGroup: 'B+',
              });
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* Search & Multi-Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, PRN, email, or roll no..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto text-xs font-medium text-slate-600">
            {/* Dept Filter */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Computer Engineering">Computer Engg</option>
              <option value="Information Technology">Information Tech</option>
              <option value="Electronics & Telecommunication">E&TC Engg</option>
              <option value="Mechanical Engineering">Mechanical Engg</option>
              <option value="Civil Engineering">Civil Engg</option>
            </select>

            {/* Class Filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-none"
            >
              <option value="ALL">All Classes</option>
              <option value="SE A">SE A</option>
              <option value="SE B">SE B</option>
              <option value="TE A">TE A</option>
              <option value="TE B">TE B</option>
              <option value="BE A">BE A</option>
              <option value="BE B">BE B</option>
            </select>

            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-none"
            >
              <option value="ALL">All Years</option>
              <option value="2026-27">AY 2026-27</option>
              <option value="2025-26">AY 2025-26</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DISABLED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">PRN / ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Academic Year</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No students match your active filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {student.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{student.fullName}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {student.prn}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      <span>{student.department}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{student.currentClass}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{student.academicYear}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={student.status}>{student.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setProfileTab('personal');
                          }}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setFormData({
                              fullName: student.fullName,
                              prn: student.prn,
                              email: student.email,
                              phone: student.phone,
                              dob: student.dob,
                              department: student.department,
                              academicYear: student.academicYear,
                              currentClass: student.currentClass,
                              status: student.status,
                              address: student.address,
                              bloodGroup: student.bloodGroup,
                            });
                            setShowEditModal(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Authorized Info"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. STUDENT PROFILE MODAL (4 TABS)                                         */}
      {/* ========================================================================= */}
      {selectedStudent && !showEditModal && (
        <Modal
          isOpen={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          title={selectedStudent.fullName}
          subtitle={`PRN: ${selectedStudent.prn} • ${selectedStudent.department}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto pb-px text-xs font-semibold">
              {[
                { id: 'personal', label: 'Personal Information' },
                { id: 'academic', label: 'Academic Records' },
                { id: 'privacy', label: 'Privacy Center (DPDP)' },
                { id: 'history', label: 'Activity History' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setProfileTab(tab.id)}
                  className={`px-3.5 py-2.5 border-b-2 font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    profileTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Personal Information */}
            {profileTab === 'personal' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1 font-mono truncate">{selectedStudent.email}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Contact Phone
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1 font-mono">{selectedStudent.phone}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Date of Birth
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{selectedStudent.dob}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Blood Group</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{selectedStudent.bloodGroup}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Admission Cohort</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">AY {selectedStudent.admissionYear}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Account Status</span>
                    <div className="mt-1">
                      <Badge variant={selectedStudent.status}>{selectedStudent.status}</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Residential / Communication Address</span>
                    <p className="text-slate-800 font-medium mt-0.5">{selectedStudent.address}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Academic Records */}
            {profileTab === 'academic' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                    <span className="text-purple-600 text-[10px] font-bold uppercase">Cumulative CGPA</span>
                    <p className="text-lg font-bold text-purple-950 mt-0.5">{selectedStudent.cgpa}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-emerald-600 text-[10px] font-bold uppercase">Attendance</span>
                    <p className="text-lg font-bold text-emerald-950 mt-0.5">{selectedStudent.attendance}</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="text-blue-600 text-[10px] font-bold uppercase">Current Class</span>
                    <p className="text-lg font-bold text-blue-950 mt-0.5">{selectedStudent.currentClass}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-500 text-[10px] font-bold uppercase">Roll Number</span>
                    <p className="text-lg font-bold text-slate-800 mt-0.5 font-mono">{selectedStudent.rollNo}</p>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                  <span className="font-bold text-slate-800 block">Semester Enrollment History</span>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="font-semibold text-slate-800">Semester III (AY 2026-27)</span>
                      <span className="text-emerald-600 font-bold">Currently In Progress</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="font-semibold text-slate-800">Semester II (AY 2025-26)</span>
                      <span className="text-slate-600 font-mono font-semibold">SGPA: 9.20 • Cleared</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <span className="font-semibold text-slate-800">Semester I (AY 2025-26)</span>
                      <span className="text-slate-600 font-mono font-semibold">SGPA: 9.08 • Cleared</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Privacy Center */}
            {profileTab === 'privacy' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-indigo-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                    <Shield className="w-4 h-4 text-indigo-600" />
                    DPDP Student Data Governance & Purpose Limitation
                  </div>
                  <p className="text-[11px] text-indigo-800 leading-relaxed">
                    Student data is processed strictly for educational evaluation, examination administration, and campus placements per explicit informed consent.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Consent Status</span>
                    <div className="mt-1 flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Active (Granted on {selectedStudent.privacyStatus.consentDate})
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Data Correction Requests</span>
                    <p className="text-xs font-bold text-slate-800 mt-1">
                      {selectedStudent.privacyStatus.activeCorrectionRequests} Pending Requests
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Activity History */}
            {profileTab === 'history' && (
              <div className="space-y-2 text-xs">
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden">
                  {selectedStudent.history.map((h, idx) => (
                    <div key={idx} className="p-3 flex items-start justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{h.action}</p>
                        <p className="text-[10px] text-slate-400">Actor: {h.by}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{h.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 2. ADD STUDENT MODAL                                                      */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Student"
        subtitle="Onboard a new student record into the institutional directory."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Legal Name *</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Tanmay Kiran Shinde"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">PRN / Student ID *</label>
              <input
                type="text"
                required
                value={formData.prn}
                onChange={(e) => setFormData({ ...formData, prn: e.target.value })}
                placeholder="PRN20240999"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium font-mono uppercase text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Institutional Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tanmay.shinde@collegeconnect.edu"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98000 11122"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Class Cohort</label>
              <select
                value={formData.currentClass}
                onChange={(e) => setFormData({ ...formData, currentClass: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="SE A">SE A</option>
                <option value="SE B">SE B</option>
                <option value="TE A">TE A</option>
                <option value="TE B">TE B</option>
                <option value="BE A">BE A</option>
                <option value="BE B">BE B</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
            >
              Register Student
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 3. EDIT STUDENT MODAL                                                     */}
      {/* ========================================================================= */}
      {selectedStudent && showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Edit Student: ${selectedStudent.prn}`}
          subtitle="Update authorized student attributes."
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleUpdateStudent} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Suspended / Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Communication Address</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
              >
                Update Profile
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
