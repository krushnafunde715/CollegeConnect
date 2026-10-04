import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Users,
  UserCheck,
  BookOpen,
  Archive,
  CheckCircle2,
  Building2,
  Calendar,
  GraduationCap
} from 'lucide-react';

const INITIAL_CLASSES = [
  {
    id: 1,
    name: 'SE A',
    fullName: 'Computer Engineering - SE A',
    department: 'Computer Engineering',
    deptCode: 'COMP',
    academicYear: '2026-27',
    semester: 'Semester III',
    classTeacher: 'Prof. Anjali Deshpande',
    classTeacherEmail: 'a.deshpande@collegeconnect.edu',
    studentCount: 68,
    capacity: 70,
    status: 'active',
    roomNo: 'Lab Complex 301',
    subjectsCount: 5,
    roster: [
      { prn: 'PRN20240101', name: 'Aarav Rajesh Sharma', roll: 'COMP-A-01', attendance: '92.5%' },
      { prn: 'PRN20240102', name: 'Ananya Sunil Deshpande', roll: 'COMP-A-02', attendance: '95.0%' },
      { prn: 'PRN20240103', name: 'Kabir Ajay Mehta', roll: 'COMP-A-03', attendance: '89.0%' },
      { prn: 'PRN20240104', name: 'Tanvi Sanjay Rao', roll: 'COMP-A-04', attendance: '94.2%' },
    ],
    subjects: [
      { code: 'CS301', name: 'Data Structures & Algorithms', faculty: 'Dr. A. R. Sharma', credits: 4 },
      { code: 'CS302', name: 'Database Management Systems', faculty: 'Prof. S. N. Joshi', credits: 4 },
      { code: 'CS303', name: 'Discrete Mathematics', faculty: 'Prof. Anjali Deshpande', credits: 3 },
      { code: 'CS304', name: 'Computer Networks', faculty: 'Dr. S. K. Narang', credits: 3 },
    ],
  },
  {
    id: 2,
    name: 'SE B',
    fullName: 'Computer Engineering - SE B',
    department: 'Computer Engineering',
    deptCode: 'COMP',
    academicYear: '2026-27',
    semester: 'Semester III',
    classTeacher: 'Prof. S. N. Joshi',
    classTeacherEmail: 's.joshi@collegeconnect.edu',
    studentCount: 66,
    capacity: 70,
    status: 'active',
    roomNo: 'Lab Complex 302',
    subjectsCount: 5,
    roster: [
      { prn: 'PRN20240150', name: 'Gaurav Prasad Kulkarni', roll: 'COMP-B-01', attendance: '91.0%' },
      { prn: 'PRN20240151', name: 'Isha Deepak Shinde', roll: 'COMP-B-02', attendance: '96.5%' },
    ],
    subjects: [
      { code: 'CS301', name: 'Data Structures & Algorithms', faculty: 'Dr. A. R. Sharma', credits: 4 },
      { code: 'CS302', name: 'Database Management Systems', faculty: 'Prof. S. N. Joshi', credits: 4 },
    ],
  },
  {
    id: 3,
    name: 'TE A',
    fullName: 'Computer Engineering - TE A',
    department: 'Computer Engineering',
    deptCode: 'COMP',
    academicYear: '2026-27',
    semester: 'Semester V',
    classTeacher: 'Dr. S. K. Narang',
    classTeacherEmail: 's.narang@collegeconnect.edu',
    studentCount: 65,
    capacity: 70,
    status: 'active',
    roomNo: 'Room 405',
    subjectsCount: 6,
    roster: [],
    subjects: [],
  },
  {
    id: 4,
    name: 'TE B',
    fullName: 'Information Technology - TE B',
    department: 'Information Technology',
    deptCode: 'IT',
    academicYear: '2026-27',
    semester: 'Semester V',
    classTeacher: 'Prof. P. K. Deshmukh',
    classTeacherEmail: 'p.deshmukh@collegeconnect.edu',
    studentCount: 64,
    capacity: 70,
    status: 'active',
    roomNo: 'IT Block 204',
    subjectsCount: 5,
    roster: [
      { prn: 'PRN20230205', name: 'Rohan Vikram Patil', roll: 'IT-B-14', attendance: '88.4%' },
    ],
    subjects: [],
  },
  {
    id: 5,
    name: 'BE A',
    fullName: 'Electronics & Telecommunication - BE A',
    department: 'Electronics & Telecommunication',
    deptCode: 'ENTC',
    academicYear: '2026-27',
    semester: 'Semester VII',
    classTeacher: 'Prof. R. M. Shinde',
    classTeacherEmail: 'r.shinde@collegeconnect.edu',
    studentCount: 62,
    capacity: 70,
    status: 'active',
    roomNo: 'VLSI Wing 102',
    subjectsCount: 5,
    roster: [
      { prn: 'PRN20220310', name: 'Pooja Manoj Kadam', roll: 'ENTC-A-28', attendance: '91.2%' },
    ],
    subjects: [],
  },
  {
    id: 6,
    name: 'BE A',
    fullName: 'Mechanical Engineering - BE A',
    department: 'Mechanical Engineering',
    deptCode: 'MECH',
    academicYear: '2026-27',
    semester: 'Semester VII',
    classTeacher: 'Prof. H. T. Gaikwad',
    classTeacherEmail: 'h.gaikwad@collegeconnect.edu',
    studentCount: 60,
    capacity: 70,
    status: 'active',
    roomNo: 'Workshop Block 10',
    subjectsCount: 5,
    roster: [
      { prn: 'PRN20220412', name: 'Siddharth Nitin Shinde', roll: 'MECH-A-42', attendance: '86.0%' },
    ],
    subjects: [],
  },
];

export function ClassesModule() {
  const [classesList, setClassesList] = useState(INITIAL_CLASSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');

  // Modals & details
  const [selectedClass, setSelectedClass] = useState(null);
  const [detailTab, setDetailTab] = useState('overview'); // 'overview', 'roster', 'teacher', 'subjects', 'history'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignTeacherModal, setShowAssignTeacherModal] = useState(false);

  // Forms
  const [formData, setFormData] = useState({
    name: '',
    department: 'Computer Engineering',
    academicYear: '2026-27',
    semester: 'Semester III',
    classTeacher: '',
    capacity: 70,
    roomNo: 'Room 301',
  });

  const [teacherData, setTeacherData] = useState({
    name: '',
    email: '',
  });

  const { success, error } = useToast();

  const filteredClasses = classesList.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.classTeacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || c.department === deptFilter;
    const matchesYear = yearFilter === 'ALL' || c.academicYear === yearFilter;
    return matchesSearch && matchesDept && matchesYear;
  });

  const handleCreateClass = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.classTeacher.trim()) {
      error('Class Name and Class Teacher are required.');
      return;
    }

    const deptCodeMap = {
      'Computer Engineering': 'COMP',
      'Information Technology': 'IT',
      'Electronics & Telecommunication': 'ENTC',
      'Mechanical Engineering': 'MECH',
      'Civil Engineering': 'CIVIL',
    };

    const newClass = {
      id: Date.now(),
      name: formData.name.trim(),
      fullName: `${formData.department} - ${formData.name.trim()}`,
      department: formData.department,
      deptCode: deptCodeMap[formData.department] || 'GEN',
      academicYear: formData.academicYear,
      semester: formData.semester,
      classTeacher: formData.classTeacher.trim(),
      classTeacherEmail: `teacher.${formData.name.toLowerCase().replace(' ', '')}@collegeconnect.edu`,
      studentCount: 0,
      capacity: Number(formData.capacity) || 70,
      status: 'active',
      roomNo: formData.roomNo || 'Room 101',
      subjectsCount: 0,
      roster: [],
      subjects: [],
    };

    setClassesList([newClass, ...classesList]);
    setShowCreateModal(false);
    setFormData({
      name: '',
      department: 'Computer Engineering',
      academicYear: '2026-27',
      semester: 'Semester III',
      classTeacher: '',
      capacity: 70,
      roomNo: 'Room 301',
    });
    success(`Class "${newClass.fullName}" created successfully.`);
  };

  const handleUpdateClass = (e) => {
    e.preventDefault();
    setClassesList((prev) =>
      prev.map((c) => (c.id === selectedClass.id ? { ...c, ...formData } : c))
    );
    setShowEditModal(false);
    success(`Class "${selectedClass.name}" updated successfully.`);
  };

  const handleAssignTeacher = (e) => {
    e.preventDefault();
    if (!teacherData.name.trim()) {
      error('Teacher name is required.');
      return;
    }

    setClassesList((prev) =>
      prev.map((c) =>
        c.id === selectedClass.id
          ? {
              ...c,
              classTeacher: teacherData.name.trim(),
              classTeacherEmail: teacherData.email.trim() || `${teacherData.name.toLowerCase().replace(/\s+/g, '.')}@collegeconnect.edu`,
            }
          : c
      )
    );
    setShowAssignTeacherModal(false);
    success(`Class Teacher assigned to ${selectedClass.name}.`);
  };

  const archiveClass = (cls) => {
    const nextStatus = cls.status === 'archived' ? 'active' : 'archived';
    setClassesList((prev) =>
      prev.map((c) => (c.id === cls.id ? { ...c, status: nextStatus } : c))
    );
    success(`Class "${cls.name}" is now ${nextStatus}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Classes & Cohorts</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage academic classes, division rosters, and class teacher assignments grouped by department.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setFormData({
                name: '',
                department: 'Computer Engineering',
                academicYear: '2026-27',
                semester: 'Semester III',
                classTeacher: '',
                capacity: 70,
                roomNo: 'Room 301',
              });
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Class
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search class, department, teacher..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Telecommunication">E&TC</option>
            <option value="Mechanical Engineering">Mechanical</option>
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 outline-none"
          >
            <option value="ALL">All Academic Years</option>
            <option value="2026-27">AY 2026-27</option>
            <option value="2025-26">AY 2025-26</option>
          </select>
        </div>
      </div>

      {/* Main Classes Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Class</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Academic Year</th>
                <th className="py-3.5 px-4">Class Teacher</th>
                <th className="py-3.5 px-4 text-center">Roster / Cap</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Layers className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No classes match your query.
                  </td>
                </tr>
              ) : (
                filteredClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {cls.name}
                        </div>
                        <div>
                          <p>{cls.name} ({cls.semester})</p>
                          <span className="text-[10px] text-slate-400 font-normal">{cls.roomNo}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{cls.department}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{cls.academicYear}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{cls.classTeacher}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{cls.classTeacherEmail}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                      {cls.studentCount} / {cls.capacity}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={cls.status}>{cls.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedClass(cls);
                            setDetailTab('overview');
                          }}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Class Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedClass(cls);
                            setFormData({
                              name: cls.name,
                              department: cls.department,
                              academicYear: cls.academicYear,
                              semester: cls.semester,
                              classTeacher: cls.classTeacher,
                              capacity: cls.capacity,
                              roomNo: cls.roomNo,
                            });
                            setShowEditModal(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Class"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedClass(cls);
                            setTeacherData({
                              name: cls.classTeacher,
                              email: cls.classTeacherEmail,
                            });
                            setShowAssignTeacherModal(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Assign Class Teacher"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => archiveClass(cls)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title={cls.status === 'archived' ? 'Restore Class' : 'Archive Class'}
                        >
                          <Archive className="w-4 h-4" />
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
      {/* 1. CLASS DETAILS MODAL (5 TABS)                                           */}
      {/* ========================================================================= */}
      {selectedClass && !showEditModal && !showAssignTeacherModal && (
        <Modal
          isOpen={Boolean(selectedClass)}
          onClose={() => setSelectedClass(null)}
          title={selectedClass.fullName}
          subtitle={`Academic Year: ${selectedClass.academicYear} • Room: ${selectedClass.roomNo}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto pb-px text-xs font-semibold">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'roster', label: `Student Roster (${selectedClass.studentCount})` },
                { id: 'teacher', label: 'Assigned Teacher' },
                { id: 'subjects', label: `Subjects (${selectedClass.subjects.length || 4})` },
                { id: 'history', label: 'Activity History' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={`px-3.5 py-2.5 border-b-2 font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    detailTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {detailTab === 'overview' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Enrolled Students</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{selectedClass.studentCount}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Total Capacity</span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">{selectedClass.capacity} Seats</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Semester</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{selectedClass.semester}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] font-bold uppercase">Status</span>
                    <div className="mt-1">
                      <Badge variant={selectedClass.status}>{selectedClass.status}</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800">Class In-charge Information</span>
                  <p className="text-slate-600">
                    {selectedClass.classTeacher} is the primary appointed class teacher overseeing daily attendance, mentor-mentee meetings, and student academic progress.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Roster */}
            {detailTab === 'roster' && (
              <div className="space-y-2 text-xs">
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {selectedClass.roster.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">
                      Roster records populated via student enrollment module.
                    </div>
                  ) : (
                    selectedClass.roster.map((st, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{st.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{st.prn} • Roll: {st.roll}</span>
                        </div>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          {st.attendance} Attendance
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Teacher */}
            {detailTab === 'teacher' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 uppercase">Appointed Class Teacher</span>
                    <p className="text-base font-bold text-teal-950 mt-0.5">{selectedClass.classTeacher}</p>
                    <p className="text-teal-800 font-mono text-[11px]">{selectedClass.classTeacherEmail}</p>
                  </div>
                  <Badge variant="teacher">Class Teacher</Badge>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  The class teacher is granted permissions to mark batch attendance, record class notices, and enter internal continuous assessment marks.
                </p>
              </div>
            )}

            {/* Tab 4: Subjects */}
            {detailTab === 'subjects' && (
              <div className="space-y-2 text-xs">
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {selectedClass.subjects.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">
                      Standard department semester syllabus mapped to this division.
                    </div>
                  ) : (
                    selectedClass.subjects.map((sub, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">{sub.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{sub.code} • Faculty: {sub.faculty}</span>
                        </div>
                        <span className="text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {sub.credits} Credits
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 5: History */}
            {detailTab === 'history' && (
              <div className="space-y-2 text-xs">
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden">
                  <div className="p-3 flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-800">Class Created for AY 2026-27</p>
                      <p className="text-[10px] text-slate-400">By Super Admin Dr. S. Kulkarni</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Jul 15, 2026</span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedClass(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 2. CREATE CLASS MODAL                                                     */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Academic Class"
        subtitle="Configure a new division or cohort under an academic department."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateClass} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Class Name / Division *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. SE C or BE B"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
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
                <option value="Electronics & Telecommunication">E&TC</option>
                <option value="Mechanical Engineering">Mechanical</option>
                <option value="Civil Engineering">Civil</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="Semester I">Semester I</option>
                <option value="Semester II">Semester II</option>
                <option value="Semester III">Semester III</option>
                <option value="Semester IV">Semester IV</option>
                <option value="Semester V">Semester V</option>
                <option value="Semester VI">Semester VI</option>
                <option value="Semester VII">Semester VII</option>
                <option value="Semester VIII">Semester VIII</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Class Teacher *</label>
              <input
                type="text"
                required
                value={formData.classTeacher}
                onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
                placeholder="Prof. R. M. Shinde"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Intake Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="70"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
            >
              Save Class
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 3. ASSIGN TEACHER MODAL                                                   */}
      {/* ========================================================================= */}
      {selectedClass && showAssignTeacherModal && (
        <Modal
          isOpen={showAssignTeacherModal}
          onClose={() => setShowAssignTeacherModal(false)}
          title="Assign Class Teacher"
          subtitle={`Set designated class teacher for ${selectedClass.fullName}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAssignTeacher} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Faculty Full Name *</label>
              <input
                type="text"
                required
                value={teacherData.name}
                onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                placeholder="e.g. Prof. Anjali Deshpande"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Institutional Email</label>
              <input
                type="email"
                value={teacherData.email}
                onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                placeholder="a.deshpande@collegeconnect.edu"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAssignTeacherModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
              >
                Confirm Appointment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
