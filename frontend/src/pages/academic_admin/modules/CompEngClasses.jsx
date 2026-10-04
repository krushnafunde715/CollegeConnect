import React, { useState } from 'react';
import compEngCampusPhoto from '../../../assets/comp_eng_campus.png';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import { useCompEngData } from '../../../context/CompEngDataContext';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  Users,
  UserCheck,
  BookOpen,
  Calendar,
  Building,
  CheckCircle2,
  Phone,
  Mail,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

export function CompEngClasses({
  departmentName = 'Computer Engineering',
}) {
  const { success, error: toastError } = useToast();
  const {
    students,
    classes,
    faculty,
    getClassStudentCount,
    createClass,
    addStudent,
    updateStudent,
    deleteStudent,
    updateClassTeacher,
  } = useCompEngData();

  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || 'SE A');
  const [activeSubTab, setActiveSubTab] = useState('students'); // 'students', 'info', 'divisions', 'teacher'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024 - 2025');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [showChangeTeacherModal, setShowChangeTeacherModal] = useState(false);

  // New Class Form State
  const [newClassForm, setNewClassForm] = useState({
    academic_year: '2024 - 2025',
    year_level: 'SE',
    division: 'C',
    name: 'SE C',
    teacher: 'Dr. K. Verma',
    capacity: 70,
    status: 'Active',
    room: '305',
  });

  // New Student for current class
  const [newRosterStudent, setNewRosterStudent] = useState({
    name: '',
    prn: '',
    roll: '',
    email: '',
    status: 'Active',
    cgpa: '8.50',
    guardian_contact: '+91 98220 00000',
    blood_group: 'O+',
  });

  const currentClassObj = classes.find((c) => c.name === selectedClass) || classes[0] || {
    name: selectedClass,
    capacity: 70,
    room: '301',
    teacher: 'Unassigned',
    teacherEmail: 'admin@college.edu',
    teacherPhone: '+91 98220 00000',
    rep: 'Unassigned',
  };

  const [selectedNewTeacher, setSelectedNewTeacher] = useState(currentClassObj.teacher || faculty[0]?.full_name || 'Dr. K. Verma');

  // Derive Roster for Selected Class directly from Centralized Unique Students
  const classRoster = students.filter(
    (s) => (s.current_class_name || `${s.class_name} ${s.division}`) === selectedClass
  );

  const filteredRoster = classRoster.filter(
    (s) =>
      (s.name || s.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.prn || s.college_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredRoster.length / pageSize));
  const paginatedRoster = filteredRoster.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handlers
  const handleYearLevelOrDivChange = (field, val) => {
    const updated = { ...newClassForm, [field]: val };
    if (field === 'year_level' || field === 'division') {
      const y = field === 'year_level' ? val : newClassForm.year_level;
      const d = field === 'division' ? val : newClassForm.division;
      updated.name = `${y} ${d}`;
    }
    setNewClassForm(updated);
  };

  const handleCreateClassSubmit = async (e) => {
    e.preventDefault();
    const result = await createClass(newClassForm);
    if (result.success) {
      setShowCreateClassModal(false);
      setSelectedClass(result.newClass.name);
      setNewClassForm({
        academic_year: '2024 - 2025',
        year_level: 'SE',
        division: 'C',
        name: 'SE C',
        teacher: faculty[0]?.full_name || 'Dr. K. Verma',
        capacity: 70,
        status: 'Active',
        room: '305',
      });
    }
  };

  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    const [y, d] = selectedClass.split(' ');
    const result = await addStudent({
      ...newRosterStudent,
      full_name: newRosterStudent.name,
      class_name: y,
      division: d,
      current_class_name: selectedClass,
    });
    if (result.success) {
      setShowAddStudentModal(false);
      setNewRosterStudent({
        name: '',
        prn: '',
        roll: '',
        email: '',
        status: 'Active',
        cgpa: '8.50',
        guardian_contact: '+91 98220 00000',
        blood_group: 'O+',
      });
    }
  };

  const handleSaveEditStudent = (e) => {
    e.preventDefault();
    updateStudent(editingStudent.id || editingStudent.prn, editingStudent);
    setEditingStudent(null);
  };

  const handleConfirmDeleteStudent = () => {
    if (!deletingStudent) return;
    deleteStudent(deletingStudent.id || deletingStudent.prn);
    setDeletingStudent(null);
  };

  const handleChangeTeacherSubmit = (e) => {
    e.preventDefault();
    updateClassTeacher(selectedClass, selectedNewTeacher);
    setShowChangeTeacherModal(false);
  };

  const handleExportCSV = () => {
    const headers = ['#', 'Roll No', 'PRN', 'Student Name', 'Division', 'Email', 'CGPA', 'Attendance', 'Status'];
    const rows = filteredRoster.map((s, idx) => [
      idx + 1,
      s.roll,
      s.prn || s.college_id,
      `"${s.name || s.full_name}"`,
      s.division || s.div || selectedClass.split(' ')[1],
      s.email,
      s.cgpa || '8.50',
      s.attendance || '85%',
      s.status || 'Active',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedClass.replace(/\s+/g, '_')}_Student_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success(`Exported ${selectedClass} roster (${filteredRoster.length} students) to CSV.`);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* ================= BREADCRUMB & HEADER BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#F0F3FF] via-[#EAEFFF] to-[#E2E8F8] border border-indigo-100/80 p-6 sm:p-7 shadow-xs">
        <div
          className="absolute inset-y-0 right-0 w-3/5 bg-cover bg-no-repeat pointer-events-none opacity-90"
          style={{
            backgroundImage: `url(${compEngCampusPhoto})`,
            backgroundPosition: 'center 45%',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,1) 70%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,1) 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-slate-500 mb-1">
              <span>Dashboard</span> &gt; <span className="text-purple-600">Class Records</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Class Records
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Manage class divisions, student lists and assign class teachers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Academic Year</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs"
              >
                <option value="2024 - 2025">2024 - 2025</option>
                <option value="2025 - 2026">2025 - 2026</option>
              </select>
            </div>

            {/* + CREATE NEW CLASS PROMINENT BUTTON */}
            <div className="pt-4">
              <button
                onClick={() => setShowCreateClassModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/25 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                + Create New Class
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DYNAMIC DIVISION SELECTOR TILES ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {classes.map((cls) => {
          const isSelected = selectedClass === cls.name;
          const count = getClassStudentCount(cls.name);
          return (
            <button
              key={cls.id || cls.name}
              onClick={() => {
                setSelectedClass(cls.name);
                setCurrentPage(1);
              }}
              className={`p-4 rounded-2xl text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-600/30'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-2xs'
              }`}
            >
              <span className="block text-sm font-extrabold">{cls.name}</span>
              <span className={`block text-xs mt-1 ${isSelected ? 'text-purple-200 font-medium' : 'text-slate-500'}`}>
                {count} Students
              </span>
              <span className={`block text-[10px] mt-2 font-medium ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                Room {cls.room || cls.room_no || '301'}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================= CLASS DETAILS CONTAINER ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Sub-Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-8 text-xs font-bold">
          {[
            { id: 'students', label: 'Student List' },
            { id: 'info', label: 'Class Information' },
            { id: 'divisions', label: 'Division Management' },
            { id: 'teacher', label: 'Class Teacher' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`py-4 border-b-2 transition-colors cursor-pointer ${
                activeSubTab === tab.id
                  ? 'border-[#7C3AED] text-[#7C3AED]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SUB-TAB 1: STUDENT LIST */}
        {activeSubTab === 'students' && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={`Search students in ${selectedClass}...`}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export
                </button>
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="flex items-center gap-1 px-3.5 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Student to {selectedClass}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-3 w-10">#</th>
                    <th className="px-3 py-3">Roll No.</th>
                    <th className="px-3 py-3">PRN</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-3 py-3">Division</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRoster.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-400">
                        No students enrolled in {selectedClass} yet. Click "Add Student to {selectedClass}" to enroll.
                      </td>
                    </tr>
                  ) : (
                    paginatedRoster.map((s, idx) => (
                      <tr key={s.id || s.prn} className="hover:bg-slate-50/70">
                        <td className="px-3 py-3 font-semibold text-slate-400">{(currentPage - 1) * pageSize + idx + 1}</td>
                        <td className="px-3 py-3 font-semibold text-slate-900">{s.roll || idx + 1}</td>
                        <td className="px-3 py-3 font-mono font-bold text-slate-700">{s.prn || s.college_id}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{s.name || s.full_name}</td>
                        <td className="px-3 py-3 font-semibold text-slate-700">{s.division || s.div || selectedClass.split(' ')[1]}</td>
                        <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">{s.email}</td>
                        <td className="px-3 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              s.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-700'
                                : s.status === 'On Leave'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {s.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedStudent(s)}
                              className="p-1 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 cursor-pointer"
                              title="View Student"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingStudent({ ...s })}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer"
                              title="Edit Student"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingStudent(s)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                              title="Remove from Class"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>Showing {paginatedRoster.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredRoster.length)} of {filteredRoster.length} students</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 rounded-lg hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-semibold cursor-pointer"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-6 h-6 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      currentPage === p
                        ? 'bg-[#6B46FE] text-white'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 rounded-lg hover:bg-slate-100 disabled:opacity-40 text-slate-700 font-semibold cursor-pointer"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: CLASS INFORMATION */}
        {activeSubTab === 'info' && (
          <div className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">{selectedClass} Division Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p><span className="text-slate-500 font-semibold">Allocated Classroom:</span> <strong className="text-slate-900">Room {currentClassObj.room || currentClassObj.room_no || '301'}</strong></p>
                <p><span className="text-slate-500 font-semibold">Student Capacity:</span> <strong className="text-slate-900">{currentClassObj.capacity || 70} Seats ({getClassStudentCount(selectedClass)} Enrolled)</strong></p>
                <p><span className="text-slate-500 font-semibold">Class Representative:</span> <strong className="text-purple-700">{currentClassObj.rep || 'Aditya Kulkarni'}</strong></p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <p><span className="text-slate-500 font-semibold">Laboratory Allocation:</span> <strong className="text-slate-900">Computer Lab 3 &amp; Lab 4</strong></p>
                <p><span className="text-slate-500 font-semibold">Academic Year:</span> <strong className="text-slate-900">{currentClassObj.academic_year || selectedYear}</strong></p>
                <p><span className="text-slate-500 font-semibold">Semester:</span> <strong className="text-slate-900">Academic Term 2024–25</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 3: DIVISION MANAGEMENT */}
        {activeSubTab === 'divisions' && (
          <div className="p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Division &amp; Practical Batch Allocation</h3>
            <p className="text-slate-500">Manage batch configurations for laboratory sessions (Batches A1, A2, A3).</p>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-1">
                <span className="font-bold text-purple-900 block">Batch {selectedClass.split(' ')[1] || 'A'}1</span>
                <p className="text-slate-600">Roll No 1 to 3 (3 Students)</p>
                <span className="text-[10px] text-purple-700 font-semibold">Lab 3 (Mon / Wed)</span>
              </div>
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-1">
                <span className="font-bold text-purple-900 block">Batch {selectedClass.split(' ')[1] || 'A'}2</span>
                <p className="text-slate-600">Roll No 4 to 6 (3 Students)</p>
                <span className="text-[10px] text-purple-700 font-semibold">Lab 3 (Tue / Thu)</span>
              </div>
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-1">
                <span className="font-bold text-purple-900 block">Batch {selectedClass.split(' ')[1] || 'A'}3</span>
                <p className="text-slate-600">Roll No 7 to {classRoster.length} ({Math.max(0, classRoster.length - 6)} Students)</p>
                <span className="text-[10px] text-purple-700 font-semibold">Lab 4 (Wed / Fri)</span>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 4: CLASS TEACHER */}
        {activeSubTab === 'teacher' && (
          <div className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Appointed Class Teacher for {selectedClass}</h3>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#6B46FE] text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                  {(currentClassObj.teacher || 'TK').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{currentClassObj.teacher || 'Unassigned'}</h4>
                  <p className="text-xs text-purple-700 font-semibold">Official Class Teacher &bull; {departmentName}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>{currentClassObj.teacherEmail || 'faculty@college.edu'}</span>
                    <span>&bull;</span>
                    <span>{currentClassObj.teacherPhone || '+91 98220 00000'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedNewTeacher(currentClassObj.teacher || faculty[0]?.full_name || 'Dr. K. Verma');
                  setShowChangeTeacherModal(true);
                }}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl cursor-pointer shadow-2xs"
              >
                Change Teacher
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: CREATE NEW CLASS ================= */}
      <Modal
        isOpen={showCreateClassModal}
        onClose={() => setShowCreateClassModal(false)}
        title="Create New Class / Division"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateClassSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Academic Year *</label>
              <select
                value={newClassForm.academic_year}
                onChange={(e) => setNewClassForm({ ...newClassForm, academic_year: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                required
              >
                <option value="2024 - 2025">2024 - 2025</option>
                <option value="2025 - 2026">2025 - 2026</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Year of Study *</label>
              <select
                value={newClassForm.year_level}
                onChange={(e) => handleYearLevelOrDivChange('year_level', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                required
              >
                <option value="SE">SE (Second Year)</option>
                <option value="TE">TE (Third Year)</option>
                <option value="BE">BE (Final Year)</option>
                <option value="FE">FE (First Year)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Division *</label>
              <select
                value={newClassForm.division}
                onChange={(e) => handleYearLevelOrDivChange('division', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                required
              >
                <option value="A">Division A</option>
                <option value="B">Division B</option>
                <option value="C">Division C</option>
                <option value="D">Division D</option>
                <option value="E">Division E</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Class Name</label>
              <input
                type="text"
                value={newClassForm.name}
                onChange={(e) => setNewClassForm({ ...newClassForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Class Teacher (Optional)</label>
              <select
                value={newClassForm.teacher}
                onChange={(e) => setNewClassForm({ ...newClassForm, teacher: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="Unassigned">Unassigned</option>
                {faculty.map((f) => (
                  <option key={f.id || f.user_id} value={f.full_name}>
                    {f.full_name} ({f.designation})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Max Capacity</label>
              <input
                type="number"
                min="10"
                max="120"
                value={newClassForm.capacity}
                onChange={(e) => setNewClassForm({ ...newClassForm, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Classroom / Lab No.</label>
              <input
                type="text"
                value={newClassForm.room}
                onChange={(e) => setNewClassForm({ ...newClassForm, room: e.target.value })}
                placeholder="e.g. Room 305"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Status</label>
              <select
                value={newClassForm.status}
                onChange={(e) => setNewClassForm({ ...newClassForm, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="Active">Active</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-[11px] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-purple-700 mt-0.5" />
            <div>
              <strong>Note:</strong> Newly created classes start with 0 enrolled students. Existing students from other classes are never automatically copied or duplicated.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateClassModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Create Class
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: ADD STUDENT TO CURRENT CLASS ================= */}
      <Modal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        title={`Add Student to ${selectedClass}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddStudentSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Student Full Name *</label>
            <input
              type="text"
              value={newRosterStudent.name}
              onChange={(e) => setNewRosterStudent({ ...newRosterStudent, name: e.target.value })}
              placeholder="e.g. Aniket R. Kulkarni"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">PRN * (Unique)</label>
              <input
                type="text"
                value={newRosterStudent.prn}
                onChange={(e) => setNewRosterStudent({ ...newRosterStudent, prn: e.target.value.toUpperCase() })}
                placeholder="e.g. 22CE059"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Roll No.</label>
              <input
                type="text"
                value={newRosterStudent.roll}
                onChange={(e) => setNewRosterStudent({ ...newRosterStudent, roll: e.target.value })}
                placeholder={`${classRoster.length + 1}`}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 font-bold mb-1">Institutional Email</label>
            <input
              type="email"
              value={newRosterStudent.email}
              onChange={(e) => setNewRosterStudent({ ...newRosterStudent, email: e.target.value })}
              placeholder="student@comp.nmiet.edu.in"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddStudentModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Enroll into {selectedClass}
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: VIEW STUDENT ================= */}
      {selectedStudent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudent(null)}
          title={`Student Profile — ${selectedStudent.name || selectedStudent.full_name}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                {(selectedStudent.name || selectedStudent.full_name || 'ST').split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedStudent.name || selectedStudent.full_name}</h4>
                <p className="text-purple-700 font-mono text-[11px] font-bold">PRN: {selectedStudent.prn || selectedStudent.college_id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Class &amp; Division</span>
                <span className="font-bold text-slate-900">{selectedClass}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Roll Number</span>
                <span className="font-bold text-slate-900">{selectedStudent.roll}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">CGPA</span>
                <span className="font-bold text-emerald-700">{selectedStudent.cgpa || '8.50'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Attendance Rate</span>
                <span className="font-bold text-purple-700">{selectedStudent.attendance || '85%'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 block text-[11px]">Institutional Email</span>
              <span className="font-mono text-slate-800 font-medium">{selectedStudent.email}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: EDIT STUDENT ================= */}
      {editingStudent && (
        <Modal
          isOpen={true}
          onClose={() => setEditingStudent(null)}
          title={`Edit Student — ${editingStudent.name || editingStudent.full_name}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveEditStudent} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Student Full Name</label>
              <input
                type="text"
                value={editingStudent.name || editingStudent.full_name || ''}
                onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value, full_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">PRN</label>
                <input
                  type="text"
                  value={editingStudent.prn || editingStudent.college_id || ''}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Roll Number</label>
                <input
                  type="text"
                  value={editingStudent.roll || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, roll: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Status</label>
              <select
                value={editingStudent.status || 'Active'}
                onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deletingStudent && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingStudent(null)}
          title="Confirm Student Disenrollment"
          maxWidth="max-w-sm"
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Are you sure you want to remove <strong className="text-slate-900">{deletingStudent.name || deletingStudent.full_name}</strong> (PRN: {deletingStudent.prn || deletingStudent.college_id}) from <strong>{selectedClass}</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteStudent}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: CHANGE CLASS TEACHER ================= */}
      <Modal
        isOpen={showChangeTeacherModal}
        onClose={() => setShowChangeTeacherModal(false)}
        title={`Assign Class Teacher for ${selectedClass}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleChangeTeacherSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Select Department Faculty *</label>
            <select
              value={selectedNewTeacher}
              onChange={(e) => setSelectedNewTeacher(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
            >
              {faculty.map((f) => (
                <option key={f.id || f.user_id} value={f.full_name}>
                  {f.full_name} — {f.designation}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowChangeTeacherModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Assign Teacher
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
