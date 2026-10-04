import React, { useState, useMemo } from 'react';
import { useExamAdmin } from '../../../context/ExamAdminContext';
import { useToast } from '../../../context/ToastContext';
import { ExamAdminHeader } from '../components/ExamAdminHeader';
import { Modal } from '../../../components/Modal';
import {
  Users,
  Search,
  Eye,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

export function StudentExamRecordsModule({ onNavigateTab }) {
  const { students, updateStudentMarks } = useExamAdmin();
  const { success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('SE');
  const [selectedSemester, setSelectedSemester] = useState('Semester II');
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [viewingStudent, setViewingStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ internal: 18, endSem: 68 });

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.prn.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = selectedClass === 'All Classes' || s.class === selectedClass;
      return matchSearch && matchClass;
    });
  }, [students, searchQuery, selectedClass]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setEditForm({
      internal: student.internal,
      endSem: student.endSem,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const internal = Number(editForm.internal);
    const endSem = Number(editForm.endSem);

    if (internal < 0 || internal > 30) {
      error('Internal marks must be between 0 and 30.');
      return;
    }
    if (endSem < 0 || endSem > 70) {
      error('End Semester marks must be between 0 and 70.');
      return;
    }

    updateStudentMarks(editingStudent.prn, { internal, endSem });
    setEditingStudent(null);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. Header */}
      <ExamAdminHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search students by PRN or Name..."
        onNavigateTab={onNavigateTab}
      />

      {/* 2. Main Page Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Student Examination Records</h1>
            <p className="text-xs text-slate-500">View and manage student examination records</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-bold">
              {filteredStudents.length} Students Listed
            </span>
          </div>
        </div>

        {/* Filters Bar matching Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="SE">SE (Second Year)</option>
              <option value="TE">TE (Third Year)</option>
              <option value="BE">BE (Final Year)</option>
              <option value="All Classes">All Classes</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="Semester II">Semester II</option>
              <option value="Semester I">Semester I</option>
              <option value="All Semesters">All Semesters</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="Data Structures">Data Structures</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="Database Management">Database Management</option>
              <option value="Web Technology">Web Technology</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Search Student</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search student..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>
          </div>
        </div>

        {/* Student Records Table */}
        <div className="overflow-x-auto border border-slate-200/90 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">PRN</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-center">Internal (30)</th>
                <th className="py-3 px-4 text-center">End Sem (70)</th>
                <th className="py-3 px-4 text-center">Total (100)</th>
                <th className="py-3 px-4 text-center">Result</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((st) => (
                  <tr key={st.prn} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{st.prn}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{st.name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{st.class} {st.division ? `(${st.division})` : ''}</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-800">{st.internal}</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-800">{st.endSem}</td>
                    <td className="py-3 px-4 text-center font-black text-slate-900">{st.total}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          st.result === 'Pass'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {st.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewingStudent(st)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="View Student Transcript"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(st)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Marks"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No student examination records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-slate-500">
          <span>
            Showing {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#6B46FE] text-white'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL: VIEW STUDENT DETAILS ================= */}
      {viewingStudent && (
        <Modal
          isOpen={!!viewingStudent}
          onClose={() => setViewingStudent(null)}
          title="Student Examination Record"
          subtitle={`PRN: ${viewingStudent.prn}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            {/* Header info */}
            <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{viewingStudent.name}</h4>
                <p className="text-slate-500 text-[11px]">{viewingStudent.className || `${viewingStudent.class} ${viewingStudent.division}`} • Seat No: {viewingStudent.seatNo}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-black ${viewingStudent.result === 'Pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {viewingStudent.result}
              </span>
            </div>

            {/* Marks Breakdown Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Subject / Evaluation Component</th>
                    <th className="py-2 px-3 text-center">Max</th>
                    <th className="py-2 px-3 text-center">Scored</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2 px-3 font-semibold">{selectedSubject} (Internal)</td>
                    <td className="py-2 px-3 text-center text-slate-400">30</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-900">{viewingStudent.internal}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold">{selectedSubject} (End Sem Theory)</td>
                    <td className="py-2 px-3 text-center text-slate-400">70</td>
                    <td className="py-2 px-3 text-center font-bold text-slate-900">{viewingStudent.endSem}</td>
                  </tr>
                  <tr className="bg-slate-50/80 font-bold">
                    <td className="py-2 px-3 text-slate-900">Aggregate Total</td>
                    <td className="py-2 px-3 text-center text-slate-500">100</td>
                    <td className="py-2 px-3 text-center text-indigo-600 font-black text-sm">{viewingStudent.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-slate-600">
              <span className="font-semibold">Hall Ticket Status:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${viewingStudent.hallTicketStatus === 'Generated' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {viewingStudent.hallTicketStatus}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: EDIT MARKS ================= */}
      {editingStudent && (
        <Modal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          title="Update Examination Marks"
          subtitle={`Candidate: ${editingStudent.name} (${editingStudent.prn})`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1">
              <span className="font-bold block">Subject: {selectedSubject}</span>
              <p className="text-[11px] text-blue-700">
                Enter revised internal continuous assessment and end-semester theory marks. Total and passing threshold (≥ 40) will update automatically.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Internal Marks (Max 30) *</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={editForm.internal}
                  onChange={(e) => setEditForm({ ...editForm, internal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-center"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">End Sem Marks (Max 70) *</label>
                <input
                  type="number"
                  min="0"
                  max="70"
                  value={editForm.endSem}
                  onChange={(e) => setEditForm({ ...editForm, endSem: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-center"
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-700">Calculated Total:</span>
              <span className="text-base font-black text-indigo-600">
                {Number(editForm.internal || 0) + Number(editForm.endSem || 0)} / 100
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save Marks
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
