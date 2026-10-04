import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  BookOpen,
  Calendar,
  Layers,
  CalendarCheck,
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Archive,
  Edit2,
  Clock,
  FileCheck2,
  ShieldCheck,
  Check,
  UserCheck
} from 'lucide-react';

const INITIAL_ACADEMIC_YEARS = [
  { id: 1, name: '2026 - 27', startDate: '2026-07-01', endDate: '2027-06-30', isCurrent: true, status: 'active', enrolledCount: 3842 },
  { id: 2, name: '2025 - 26', startDate: '2025-07-01', endDate: '2026-06-30', isCurrent: false, status: 'archived', enrolledCount: 3720 },
  { id: 3, name: '2024 - 25', startDate: '2024-07-01', endDate: '2025-06-30', isCurrent: false, status: 'archived', enrolledCount: 3610 },
];

const INITIAL_SUBJECTS = [
  { id: 1, name: 'Data Structures & Algorithms', code: 'CS301', department: 'Computer Engineering', semester: 'Semester III', faculty: 'Dr. A. R. Sharma', credits: 4, type: 'Theory + Lab' },
  { id: 2, name: 'Database Management Systems', code: 'CS302', department: 'Computer Engineering', semester: 'Semester III', faculty: 'Prof. S. N. Joshi', credits: 4, type: 'Theory + Lab' },
  { id: 3, name: 'Discrete Mathematics', code: 'CS303', department: 'Computer Engineering', semester: 'Semester III', faculty: 'Prof. Anjali Deshpande', credits: 3, type: 'Theory' },
  { id: 4, name: 'Computer Networks', code: 'CS304', department: 'Computer Engineering', semester: 'Semester III', faculty: 'Dr. S. K. Narang', credits: 3, type: 'Theory' },
  { id: 5, name: 'Information & Cyber Security', code: 'IT501', department: 'Information Technology', semester: 'Semester V', faculty: 'Dr. M. V. Kulkarni', credits: 4, type: 'Theory + Lab' },
  { id: 6, name: 'VLSI Design', code: 'ET701', department: 'Electronics & Telecommunication', semester: 'Semester VII', faculty: 'Prof. R. M. Shinde', credits: 4, type: 'Theory + Lab' },
  { id: 7, name: 'Robotics & Automation', code: 'ME701', department: 'Mechanical Engineering', semester: 'Semester VII', faculty: 'Prof. H. T. Gaikwad', credits: 4, type: 'Theory + Lab' },
];

const INITIAL_ATTENDANCE_LOGS = [
  { id: 1, department: 'Computer Engineering', class: 'SE A', subject: 'Data Structures & Algorithms', faculty: 'Dr. A. R. Sharma', date: '2026-10-14', present: 63, total: 68, percentage: '92.6%' },
  { id: 2, department: 'Computer Engineering', class: 'SE B', subject: 'Database Management Systems', faculty: 'Prof. S. N. Joshi', date: '2026-10-14', present: 62, total: 66, percentage: '93.9%' },
  { id: 3, department: 'Information Technology', class: 'TE B', subject: 'Information & Cyber Security', faculty: 'Dr. M. V. Kulkarni', date: '2026-10-14', present: 58, total: 64, percentage: '90.6%' },
  { id: 4, department: 'Electronics & Telecommunication', class: 'BE A', subject: 'VLSI Design', faculty: 'Prof. R. M. Shinde', date: '2026-10-13', present: 57, total: 62, percentage: '91.9%' },
];

const INITIAL_ACADEMIC_RECORDS = [
  { id: 1, studentName: 'Aarav Rajesh Sharma', prn: 'PRN20240101', subject: 'Data Structures & Algorithms', semester: 'Semester III', academicYear: '2026-27', credits: 4, status: 'Enrolled', grade: '--' },
  { id: 2, studentName: 'Ananya Sunil Deshpande', prn: 'PRN20240102', subject: 'Database Management Systems', semester: 'Semester III', academicYear: '2026-27', credits: 4, status: 'Enrolled', grade: '--' },
  { id: 3, studentName: 'Rohan Vikram Patil', prn: 'PRN20230205', subject: 'Information & Cyber Security', semester: 'Semester V', academicYear: '2026-27', credits: 4, status: 'Enrolled', grade: '--' },
  { id: 4, studentName: 'Pooja Manoj Kadam', prn: 'PRN20220310', subject: 'VLSI Design', semester: 'Semester VII', academicYear: '2026-27', credits: 4, status: 'Enrolled', grade: '--' },
  { id: 5, studentName: 'Siddharth Nitin Shinde', prn: 'PRN20220412', subject: 'Robotics & Automation', semester: 'Semester VII', academicYear: '2026-27', credits: 4, status: 'Enrolled', grade: '--' },
];

export function AcademicModule() {
  const [activeTab, setActiveTab] = useState('years'); // 'years', 'subjects', 'attendance', 'records'
  
  // Data states
  const [years, setYears] = useState(INITIAL_ACADEMIC_YEARS);
  const [subjects, setSubjects] = useState(INITIAL_SUBJECTS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE_LOGS);
  const [records, setRecords] = useState(INITIAL_ACADEMIC_RECORDS);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Modals
  const [showAddYearModal, setShowAddYearModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showEditSubjectModal, setShowEditSubjectModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Forms
  const [newYearForm, setNewYearForm] = useState({ name: '', startDate: '', endDate: '' });
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    department: 'Computer Engineering',
    semester: 'Semester III',
    faculty: '',
    credits: 4,
    type: 'Theory + Lab',
  });

  const { success, error } = useToast();

  const handleCreateYear = (e) => {
    e.preventDefault();
    if (!newYearForm.name.trim() || !newYearForm.startDate || !newYearForm.endDate) {
      error('Year name, start date, and end date are required.');
      return;
    }
    const newYr = {
      id: Date.now(),
      name: newYearForm.name.trim(),
      startDate: newYearForm.startDate,
      endDate: newYearForm.endDate,
      isCurrent: false,
      status: 'active',
      enrolledCount: 0,
    };
    setYears([...years, newYr]);
    setShowAddYearModal(false);
    setNewYearForm({ name: '', startDate: '', endDate: '' });
    success(`Academic Year "${newYr.name}" added successfully.`);
  };

  const setActiveYear = (yearId) => {
    setYears((prev) =>
      prev.map((y) => ({
        ...y,
        isCurrent: y.id === yearId,
      }))
    );
    success('Active Academic Year updated institutional-wide.');
  };

  const handleCreateSubject = (e) => {
    e.preventDefault();
    if (!subjectForm.name.trim() || !subjectForm.code.trim()) {
      error('Subject name and code are required.');
      return;
    }
    const newSub = {
      id: Date.now(),
      name: subjectForm.name.trim(),
      code: subjectForm.code.trim().toUpperCase(),
      department: subjectForm.department,
      semester: subjectForm.semester,
      faculty: subjectForm.faculty || 'Unassigned',
      credits: Number(subjectForm.credits) || 3,
      type: subjectForm.type,
    };
    setSubjects([...subjects, newSub]);
    setShowAddSubjectModal(false);
    setSubjectForm({
      name: '',
      code: '',
      department: 'Computer Engineering',
      semester: 'Semester III',
      faculty: '',
      credits: 4,
      type: 'Theory + Lab',
    });
    success(`Subject "${newSub.name}" added.`);
  };

  const handleUpdateSubject = (e) => {
    e.preventDefault();
    setSubjects((prev) =>
      prev.map((s) => (s.id === selectedSubject.id ? { ...s, ...subjectForm } : s))
    );
    setShowEditSubjectModal(false);
    success(`Subject "${subjectForm.name}" updated.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academic Management</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage academic calendar years, course subjects, class attendance summaries, and student academic records.
          </p>
        </div>

        {/* Action button based on active tab */}
        {activeTab === 'years' && (
          <button
            onClick={() => setShowAddYearModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Academic Year
          </button>
        )}
        {activeTab === 'subjects' && (
          <button
            onClick={() => {
              setSubjectForm({
                name: '',
                code: '',
                department: 'Computer Engineering',
                semester: 'Semester III',
                faculty: '',
                credits: 4,
                type: 'Theory + Lab',
              });
              setShowAddSubjectModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </button>
        )}
      </div>

      {/* Internal Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-1.5 flex gap-1.5 overflow-x-auto text-xs font-bold">
        {[
          { id: 'years', label: 'Academic Years', icon: Calendar },
          { id: 'subjects', label: `Subjects (${subjects.length})`, icon: BookOpen },
          { id: 'attendance', label: 'Attendance Summaries', icon: CalendarCheck },
          { id: 'records', label: 'Academic Records', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACADEMIC YEARS                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'years' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {years.map((yr) => (
            <div
              key={yr.id}
              className={`p-5 rounded-2xl border bg-white shadow-xs transition-all relative ${
                yr.isCurrent ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200/80'
              }`}
            >
              {yr.isCurrent && (
                <span className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Active Academic Year
                </span>
              )}

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">AY {yr.name}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">{yr.startDate} to {yr.endDate}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Enrolled Students:</span>
                  <span className="font-bold text-slate-900">{yr.enrolledCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Status:</span>
                  <Badge variant={yr.isCurrent ? 'active' : 'disabled'}>{yr.isCurrent ? 'Active' : 'Archived'}</Badge>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {!yr.isCurrent ? (
                  <button
                    onClick={() => setActiveYear(yr.id)}
                    className="w-full py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Set as Active Year
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mx-auto py-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Institution Default
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SUBJECTS                                                           */}
      {/* ========================================================================= */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by subject name, code, or faculty..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none"
            >
              <option value="ALL">All Departments</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Telecommunication">E&TC</option>
              <option value="Mechanical Engineering">Mechanical</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Code</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Semester</th>
                    <th className="py-3.5 px-4">Assigned Faculty</th>
                    <th className="py-3.5 px-4 text-center">Credits</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {subjects
                    .filter((s) => {
                      const matchesSearch =
                        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.faculty.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
                      return matchesSearch && matchesDept;
                    })
                    .map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <p>{sub.name}</p>
                          <span className="text-[10px] text-slate-400 font-normal">{sub.type}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700 bg-slate-50 px-2 rounded">
                          {sub.code}
                        </td>
                        <td className="py-3.5 px-4">{sub.department}</td>
                        <td className="py-3.5 px-4 font-medium">{sub.semester}</td>
                        <td className="py-3.5 px-4 font-semibold text-indigo-700">{sub.faculty}</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-900">{sub.credits}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedSubject(sub);
                              setSubjectForm({
                                name: sub.name,
                                code: sub.code,
                                department: sub.department,
                                semester: sub.semester,
                                faculty: sub.faculty,
                                credits: sub.credits,
                                type: sub.type,
                              });
                              setShowEditSubjectModal(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ATTENDANCE SUMMARIES                                               */}
      {/* ========================================================================= */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Daily Class Attendance Logs</h3>
                <p className="text-[11px] text-slate-500">Live attendance sessions marked by class teachers & subject faculty.</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Department & Class</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Faculty In-charge</th>
                    <th className="py-3.5 px-4 text-center">Present / Total</th>
                    <th className="py-3.5 px-4 text-center">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {attendance.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-600">{log.date}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {log.department} ({log.class})
                      </td>
                      <td className="py-3.5 px-4">{log.subject}</td>
                      <td className="py-3.5 px-4 text-slate-700">{log.faculty}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                        {log.present} / {log.total}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                          {log.percentage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ACADEMIC RECORDS                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Auditable Student Course Enrollments</h3>
              <p className="text-[11px] text-slate-500">Every semester course enrollment is tracked for audit and grade certification.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">PRN</th>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4">Semester & AY</th>
                    <th className="py-3.5 px-4 text-center">Credits</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{rec.studentName}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{rec.prn}</td>
                      <td className="py-3.5 px-4">{rec.subject}</td>
                      <td className="py-3.5 px-4">{rec.semester} ({rec.academicYear})</td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900">{rec.credits}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="active">{rec.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CREATE ACADEMIC YEAR MODAL                                                */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showAddYearModal}
        onClose={() => setShowAddYearModal(false)}
        title="Create Academic Year"
        subtitle="Define a new institutional academic calendar cycle."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateYear} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Academic Year Label *</label>
            <input
              type="text"
              required
              value={newYearForm.name}
              onChange={(e) => setNewYearForm({ ...newYearForm, name: e.target.value })}
              placeholder="e.g. 2027 - 28"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={newYearForm.startDate}
                onChange={(e) => setNewYearForm({ ...newYearForm, startDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">End Date *</label>
              <input
                type="date"
                required
                value={newYearForm.endDate}
                onChange={(e) => setNewYearForm({ ...newYearForm, endDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddYearModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
            >
              Save Academic Year
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD SUBJECT MODAL                                                         */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showAddSubjectModal}
        onClose={() => setShowAddSubjectModal(false)}
        title="Add Curriculum Subject"
        subtitle="Register a new academic course subject into syllabus directory."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateSubject} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Subject Name *</label>
            <input
              type="text"
              required
              value={subjectForm.name}
              onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
              placeholder="e.g. Operating Systems"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Subject Code *</label>
              <input
                type="text"
                required
                value={subjectForm.code}
                onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                placeholder="CS401"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium font-mono uppercase text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Credits</label>
              <input
                type="number"
                value={subjectForm.credits}
                onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })}
                placeholder="4"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Department</label>
              <select
                value={subjectForm.department}
                onChange={(e) => setSubjectForm({ ...subjectForm, department: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Telecommunication">E&TC</option>
                <option value="Mechanical Engineering">Mechanical</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Semester</label>
              <select
                value={subjectForm.semester}
                onChange={(e) => setSubjectForm({ ...subjectForm, semester: e.target.value })}
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

          <div>
            <label className="font-bold text-slate-700 block mb-1">Assigned Faculty</label>
            <input
              type="text"
              value={subjectForm.faculty}
              onChange={(e) => setSubjectForm({ ...subjectForm, faculty: e.target.value })}
              placeholder="e.g. Dr. S. K. Narang"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddSubjectModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
            >
              Save Subject
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
