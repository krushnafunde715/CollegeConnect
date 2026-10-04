import React, { useState } from 'react';
import { useTeacher } from '../../../context/TeacherContext';
import { useToast } from '../../../context/ToastContext';
import {
  CalendarCheck,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Save,
  Users,
  AlertCircle,
  BarChart3,
  Check,
  X,
  Download,
  Filter
} from 'lucide-react';

export function TeacherAttendance() {
  const { students, subjects, attendanceStats, updateStudentAttendance } = useTeacher();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState('student_wise'); // 'student_wise' | 'date_wise' | 'subject_wise'
  const [monthFilter, setMonthFilter] = useState('October 2026');
  const [subjectFilter, setSubjectFilter] = useState('Machine Learning');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Mark Attendance Modal state
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markingDate, setMarkingDate] = useState(new Date().toISOString().split('T')[0]);
  const [markingSubject, setMarkingSubject] = useState('Machine Learning');
  const [attendanceMap, setAttendanceMap] = useState(() => {
    const map = {};
    students.forEach((s) => {
      map[s.id] = s.todayStatus || 'Present';
    });
    return map;
  });

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery) ||
      s.prn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      s.attendanceStats.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const handleToggleStatus = (id, status) => {
    setAttendanceMap((prev) => ({ ...prev, [id]: status }));
  };

  const handleMarkAllPresent = () => {
    const map = {};
    students.forEach((s) => {
      map[s.id] = 'Present';
    });
    setAttendanceMap(map);
    info('All students marked Present.');
  };

  const handleSaveAttendance = () => {
    updateStudentAttendance(markingDate, attendanceMap);
    setShowMarkModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Excellent':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Good':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Needs Attention':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Module Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Attendance</h1>
            <p className="text-xs text-slate-500 font-medium">
              View and manage class attendance records.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Month</span>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="October 2026">October 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="August 2026">August 2026</option>
            </select>
          </div>

          {/* Subject Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Subject</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Machine Learning">Machine Learning</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Web Technology">Web Technology</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Elective - I">Elective - I</option>
            </select>
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Good">Good</option>
              <option value="Excellent">Excellent</option>
              <option value="Needs Attention">Needs Attention</option>
            </select>
          </div>

          {/* Mark Attendance Blue Button */}
          <button
            onClick={() => setShowMarkModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Mark Attendance</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Stat Metric Cards matching reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">{attendanceStats.percentage}%</span>
            <span className="text-xs font-semibold text-slate-500">Overall Attendance</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">{attendanceStats.present}</span>
            <span className="text-xs font-semibold text-slate-500">Present Today</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">{attendanceStats.absent}</span>
            <span className="text-xs font-semibold text-slate-500">Absent</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">{attendanceStats.onLeave}</span>
            <span className="text-xs font-semibold text-slate-500">On Leave</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock3 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs matching reference */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-2">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('student_wise')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'student_wise'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Student-wise
          </button>
          <button
            onClick={() => setActiveTab('date_wise')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'date_wise'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Date-wise
          </button>
          <button
            onClick={() => setActiveTab('subject_wise')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'subject_wise'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Subject-wise
          </button>
        </div>

        {/* Tab 1: Student-wise Table */}
        {activeTab === 'student_wise' && (
          <div className="p-3 space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by student name or roll..."
                  className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Mandatory benchmark: 75% attendance
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Roll No</th>
                    <th className="px-4 py-3.5">Student Name</th>
                    <th className="px-4 py-3.5 text-center">Present</th>
                    <th className="px-4 py-3.5 text-center">Absent</th>
                    <th className="px-4 py-3.5 text-center">On Leave</th>
                    <th className="px-4 py-3.5 text-center">Attendance %</th>
                    <th className="px-4 py-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-800 font-mono">{s.rollNo}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">{s.name}</td>
                      <td className="px-4 py-3.5 text-center font-semibold text-emerald-700">{s.attendanceStats.present}</td>
                      <td className="px-4 py-3.5 text-center font-semibold text-rose-700">{s.attendanceStats.absent}</td>
                      <td className="px-4 py-3.5 text-center font-semibold text-purple-700">{s.attendanceStats.onLeave}</td>
                      <td className="px-4 py-3.5 text-center font-extrabold text-blue-700">{s.attendanceStats.percentage}</td>
                      <td className="px-4 py-3.5 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                            s.attendanceStats.status
                          )}`}
                        >
                          {s.attendanceStats.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-2 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-medium text-slate-500">
                Showing {filteredStudents.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Date-wise Register */}
        {activeTab === 'date_wise' && (
          <div className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={markingDate}
                  onChange={(e) => setMarkingDate(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                />
                <span className="text-xs font-semibold text-slate-600">Subject: Machine Learning (CS502)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllPresent}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => updateStudentAttendance(markingDate, attendanceMap)}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Register
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {students.slice(0, 15).map((s) => {
                const st = attendanceMap[s.id] || 'Present';
                return (
                  <div key={s.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{s.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">Roll: {s.rollNo}</span>
                    </div>
                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                      <button
                        onClick={() => handleToggleStatus(s.id, 'Present')}
                        className={`px-2 py-0.5 text-[11px] font-bold rounded-md cursor-pointer ${
                          st === 'Present' ? 'bg-emerald-600 text-white' : 'text-slate-500'
                        }`}
                      >
                        P
                      </button>
                      <button
                        onClick={() => handleToggleStatus(s.id, 'Absent')}
                        className={`px-2 py-0.5 text-[11px] font-bold rounded-md cursor-pointer ${
                          st === 'Absent' ? 'bg-rose-600 text-white' : 'text-slate-500'
                        }`}
                      >
                        A
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Subject-wise Comparison */}
        {activeTab === 'subject_wise' && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((sub) => (
                <div key={sub.code} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{sub.code}</span>
                      <h4 className="text-sm font-bold text-slate-900">{sub.name}</h4>
                    </div>
                    <span className="text-lg font-black text-emerald-600">
                      {sub.code === '410241' ? '95%' : sub.code === '410242' ? '94%' : sub.code === '410243' ? '96%' : '92%'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Average Attendance</span>
                      <span className="font-semibold text-slate-800">55/58 Students</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium">Faculty: {sub.faculty}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mark Attendance Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Mark Attendance Register</h3>
                  <p className="text-xs text-slate-500">TE Computer Engineering — Division A</p>
                </div>
              </div>
              <button
                onClick={() => setShowMarkModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Date</label>
                <input
                  type="date"
                  value={markingDate}
                  onChange={(e) => setMarkingDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Subject</label>
                <select
                  value={markingSubject}
                  onChange={(e) => setMarkingSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white cursor-pointer"
                >
                  <option value="Machine Learning">Machine Learning (CS502)</option>
                  <option value="Artificial Intelligence">Artificial Intelligence (CS501)</option>
                  <option value="Web Technology">Web Technology (CS503)</option>
                  <option value="Cloud Computing">Cloud Computing (CS504)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center shrink-0 pt-2">
              <span className="text-xs font-bold text-slate-700">Student Roll Call (58 Total)</span>
              <button
                onClick={handleMarkAllPresent}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                Mark All Present
              </button>
            </div>

            {/* Scrollable Students List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {students.map((s) => {
                const st = attendanceMap[s.id] || 'Present';
                return (
                  <div key={s.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-mono font-bold text-xs flex items-center justify-center text-slate-700">
                        {s.rollNo}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{s.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{s.prn}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(s.id, 'Present')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          st === 'Present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(s.id, 'Absent')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          st === 'Absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(s.id, 'On Leave')}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          st === 'On Leave'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
              <button
                onClick={() => setShowMarkModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAttendance}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Attendance</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
