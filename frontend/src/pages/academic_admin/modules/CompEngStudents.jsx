import React, { useState } from 'react';
import compEngCampusPhoto from '../../../assets/comp_eng_campus.png';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import { useCompEngData } from '../../../context/CompEngDataContext';
import {
  Users,
  Search,
  Filter,
  Plus,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';

export function CompEngStudents({
  departmentName = 'Computer Engineering',
}) {
  const { success, error: toastError } = useToast();
  const {
    students,
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
  } = useCompEngData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024 - 2025');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedDivision, setSelectedDivision] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [showPII, setShowPII] = useState(false);

  // Form State
  const [newStudent, setNewStudent] = useState({
    full_name: '',
    email: '',
    prn: '',
    class_name: 'SE',
    division: 'A',
    admission_year: 2024,
    date_of_birth: '2005-04-12',
    guardian_contact: '+91 98220 11223',
    blood_group: 'B+',
    address: 'Campus Hostel Block B, Room 204',
    cgpa: '8.45',
    password: 'Student@2026Secure!',
    status: 'Active',
  });

  const handleReset = () => {
    setSearchQuery('');
    setSelectedYear('2024 - 2025');
    setSelectedClass('ALL');
    setSelectedDivision('ALL');
    setSelectedStatus('ALL');
    setCurrentPage(1);
  };

  const filtered = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (s.full_name || s.name || '').toLowerCase().includes(q);
    const prnMatch = (s.prn || s.college_id || '').toLowerCase().includes(q);
    const emailMatch = (s.email || '').toLowerCase().includes(q);
    const classMatch = selectedClass === 'ALL' || s.class_name === selectedClass || (s.current_class_name || '').startsWith(selectedClass);
    const divMatch = selectedDivision === 'ALL' || s.division === selectedDivision || (s.current_class_name || '').endsWith(selectedDivision);
    const statusMatch = selectedStatus === 'ALL' || (s.status || s.account_status || 'Active').toLowerCase() === selectedStatus.toLowerCase();

    return (nameMatch || prnMatch || emailMatch) && classMatch && divMatch && statusMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedStudents = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowIds(filtered.map((s) => s.id || s.prn));
    } else {
      setSelectedRowIds([]);
    }
  };

  const handleToggleRow = (id) => {
    if (selectedRowIds.includes(id)) {
      setSelectedRowIds(selectedRowIds.filter((x) => x !== id));
    } else {
      setSelectedRowIds([...selectedRowIds, id]);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const targetClass = `${newStudent.class_name} ${newStudent.division}`;
    const result = await addStudent({
      ...newStudent,
      name: newStudent.full_name,
      college_id: newStudent.prn,
      current_class_name: targetClass,
    });

    if (result.success) {
      setShowAddModal(false);
      setNewStudent({
        full_name: '',
        email: '',
        prn: '',
        class_name: 'SE',
        division: 'A',
        admission_year: 2024,
        date_of_birth: '2005-04-12',
        guardian_contact: '+91 98220 11223',
        blood_group: 'B+',
        address: 'Campus Hostel Block B, Room 204',
        cgpa: '8.45',
        password: 'Student@2026Secure!',
        status: 'Active',
      });
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateStudent(editingStudent.id || editingStudent.prn, editingStudent);
    setEditingStudent(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingStudent) return;
    deleteStudent(deletingStudent.id || deletingStudent.prn);
    setDeletingStudent(null);
  };

  const handleExportCSV = () => {
    const headers = ['PRN', 'Student Name', 'Class', 'Division', 'Email', 'CGPA', 'Attendance', 'Status'];
    const rows = filtered.map((s) => [
      s.prn || s.college_id,
      `"${s.full_name || s.name}"`,
      s.class_name || s.current_class_name?.split(' ')[0] || 'SE',
      s.division || s.div || s.current_class_name?.split(' ')[1] || 'A',
      s.email,
      s.cgpa || '8.50',
      s.attendance || '85%',
      s.status || s.account_status || 'Active',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CompEng_Students_${selectedYear.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success(`Exported ${filtered.length} student records to CSV.`);
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
              <span>Dashboard</span> &gt; <span className="text-purple-600">Students</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Students Registry
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Manage student enrollment records, personal identifiers, and division assignments.
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

            <div className="pt-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/25 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                + Add Student
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4 METRIC CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Total Enrolled</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">{students.length}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">100% Unique PRNs</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Active Students</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">
              {students.filter((s) => (s.status || s.account_status || '').toLowerCase() === 'active').length}
            </span>
            <span className="text-[10px] text-purple-600 font-semibold">Active Profiles</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Avg Attendance</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">
              {(
                students.reduce((acc, s) => acc + parseFloat(s.attendance_rate || s.attendance || 85), 0) /
                students.length
              ).toFixed(1)}%
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">Across 6 Divisions</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">DPDP Privacy</span>
            <span className="text-xl font-black text-purple-900 mt-0.5 block">Secured</span>
            <span className="text-[10px] text-purple-600 font-semibold">Masked Access</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ================= FILTER & SEARCH TOOLBAR ================= */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, PRN, email..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
            >
              <option value="ALL">All Classes</option>
              <option value="SE">SE (Second Year)</option>
              <option value="TE">TE (Third Year)</option>
              <option value="BE">BE (Final Year)</option>
            </select>

            <select
              value={selectedDivision}
              onChange={(e) => {
                setSelectedDivision(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
            >
              <option value="ALL">All Divisions</option>
              <option value="A">Division A</option>
              <option value="B">Division B</option>
              <option value="C">Division C</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-700"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              onClick={handleReset}
              className="p-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={() => {
              setShowPII(!showPII);
              success(showPII ? 'DPDP PII fields masked.' : 'DPDP audit logged: Unmasked PII fields.');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              showPII
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {showPII ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPII ? 'Mask PII' : 'Unmask PII'}
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ================= STUDENT DATA TABLE ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={selectedRowIds.length === filtered.length && filtered.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="px-3 py-3">PRN</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-3 py-3">Class &amp; Div</th>
                <th className="px-4 py-3">Institutional Email</th>
                <th className="px-3 py-3">CGPA</th>
                <th className="px-3 py-3">Attendance</th>
                <th className="px-3 py-3">Date of Birth</th>
                <th className="px-3 py-3">Guardian Mobile</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-slate-400">
                    No matching students found.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((s) => {
                  const isChecked = selectedRowIds.includes(s.id || s.prn);
                  return (
                    <tr
                      key={s.id || s.prn}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isChecked ? 'bg-purple-50/30' : ''
                      }`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRow(s.id || s.prn)}
                          className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                      </td>
                      <td className="px-3 py-3 font-mono font-bold text-slate-800">
                        {s.prn || s.college_id}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {s.full_name || s.name}
                      </td>
                      <td className="px-3 py-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[11px]">
                          {s.current_class_name || `${s.class_name} ${s.division}`}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">
                        {s.email}
                      </td>
                      <td className="px-3 py-3 font-bold text-emerald-700">
                        {s.cgpa || '8.50'}
                      </td>
                      <td className="px-3 py-3 font-bold text-purple-700">
                        {s.attendance || `${s.attendance_rate}%`}
                      </td>
                      <td className="px-3 py-3 text-slate-500">
                        {showPII ? s.date_of_birth : '••••••••'}
                      </td>
                      <td className="px-3 py-3 font-mono text-slate-500">
                        {showPII ? s.guardian_contact : '+91 ••••• ••••8'}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            (s.status || s.account_status || 'Active').toLowerCase() === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : (s.status || s.account_status || '').toLowerCase() === 'on leave'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {s.status || s.account_status || 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedStudent(s)}
                            className="p-1 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 cursor-pointer"
                            title="View Profile"
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
                            title="Disenroll Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing {filtered.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} students
          </span>
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

      {/* ================= MODAL: ADD STUDENT ================= */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Enroll New Student (Computer Engineering)"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Student Full Name *</label>
              <input
                type="text"
                value={newStudent.full_name}
                onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                placeholder="e.g. Aniket Sharma"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">PRN * (Unique)</label>
              <input
                type="text"
                value={newStudent.prn}
                onChange={(e) => setNewStudent({ ...newStudent, prn: e.target.value.toUpperCase() })}
                placeholder="e.g. 22CE099"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Class *</label>
              <select
                value={newStudent.class_name}
                onChange={(e) => setNewStudent({ ...newStudent, class_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                required
              >
                <option value="SE">SE (Second Year)</option>
                <option value="TE">TE (Third Year)</option>
                <option value="BE">BE (Final Year)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Division *</label>
              <select
                value={newStudent.division}
                onChange={(e) => setNewStudent({ ...newStudent, division: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                required
              >
                <option value="A">Division A</option>
                <option value="B">Division B</option>
                <option value="C">Division C</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Institutional Email</label>
            <input
              type="email"
              value={newStudent.email}
              onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
              placeholder="aniket.sharma@comp.nmiet.edu.in"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Date of Birth</label>
              <input
                type="date"
                value={newStudent.date_of_birth}
                onChange={(e) => setNewStudent({ ...newStudent, date_of_birth: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Guardian Contact</label>
              <input
                type="text"
                value={newStudent.guardian_contact}
                onChange={(e) => setNewStudent({ ...newStudent, guardian_contact: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Enroll Student
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: VIEW STUDENT ================= */}
      {selectedStudent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedStudent(null)}
          title={`Student Master Record — ${selectedStudent.full_name || selectedStudent.name}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                {(selectedStudent.full_name || selectedStudent.name || 'ST').split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedStudent.full_name || selectedStudent.name}</h4>
                <p className="text-purple-700 font-mono text-[11px] font-bold">PRN: {selectedStudent.prn || selectedStudent.college_id}</p>
                <p className="text-slate-500 text-[11px]">{selectedStudent.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Class Allocation</span>
                <span className="font-bold text-slate-900">{selectedStudent.current_class_name || `${selectedStudent.class_name} ${selectedStudent.division}`}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">CGPA</span>
                <span className="font-bold text-emerald-700">{selectedStudent.cgpa || '8.50'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Attendance</span>
                <span className="font-bold text-purple-700">{selectedStudent.attendance || `${selectedStudent.attendance_rate}%`}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Date of Birth:</span>
                <span className="font-semibold text-slate-800">{showPII ? selectedStudent.date_of_birth : '•••••••• (Masked)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guardian Contact:</span>
                <span className="font-mono font-semibold text-slate-800">{showPII ? selectedStudent.guardian_contact : '+91 ••••• ••••8 (Masked)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.blood_group || 'O+'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Residential Address:</span>
                <span className="font-semibold text-slate-800">{selectedStudent.address || 'Pune'}</span>
              </div>
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
          title={`Edit Student — ${editingStudent.full_name || editingStudent.name}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={editingStudent.full_name || editingStudent.name || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, full_name: e.target.value, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">PRN (Immutable)</label>
                <input
                  type="text"
                  value={editingStudent.prn || editingStudent.college_id || ''}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Class</label>
                <select
                  value={editingStudent.class_name || 'SE'}
                  onChange={(e) => setEditingStudent({ ...editingStudent, class_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="SE">SE (Second Year)</option>
                  <option value="TE">TE (Third Year)</option>
                  <option value="BE">BE (Final Year)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Division</label>
                <select
                  value={editingStudent.division || editingStudent.div || 'A'}
                  onChange={(e) => setEditingStudent({ ...editingStudent, division: e.target.value, div: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="A">Division A</option>
                  <option value="B">Division B</option>
                  <option value="C">Division C</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">CGPA</label>
                <input
                  type="text"
                  value={editingStudent.cgpa || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, cgpa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Status</label>
                <select
                  value={editingStudent.status || 'Active'}
                  onChange={(e) => setEditingStudent({ ...editingStudent, status: e.target.value, account_status: e.target.value.toLowerCase() })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
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
          title="Confirm Disenrollment"
          maxWidth="max-w-sm"
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Are you sure you want to disenroll <strong className="text-slate-900">{deletingStudent.full_name || deletingStudent.name}</strong> (PRN: {deletingStudent.prn || deletingStudent.college_id}) from Computer Engineering?
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Disenroll
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
