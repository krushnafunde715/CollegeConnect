import React, { useState } from 'react';
import compEngCampusPhoto from '../../../assets/comp_eng_campus.png';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import { useCompEngData } from '../../../context/CompEngDataContext';
import {
  Award,
  Calendar,
  FileText,
  Search,
  Plus,
  Edit2,
  Eye,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  TrendingUp,
  FileCheck2,
  Check
} from 'lucide-react';

export function CompEngExams({
  departmentName = 'Computer Engineering',
}) {
  const { success } = useToast();
  const {
    students,
    classes,
    subjects,
    examSchedules,
    createExamSchedule,
    updateStudentMarks,
  } = useCompEngData();

  const [activeTab, setActiveTab] = useState('marks'); // 'marks', 'schedule', 'results'
  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || 'SE A');
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || 'Data Structures & Algorithms');
  const [selectedExamType, setSelectedExamType] = useState('Unit Test 2');
  const [selectedYear, setSelectedYear] = useState('2024 - 2025');

  // Modals
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [editingStudentMarks, setEditingStudentMarks] = useState(null);
  const [viewingPaper, setViewingPaper] = useState(null);

  const [newSchedule, setNewSchedule] = useState({
    code: 'CC205',
    subject: 'Software Engineering',
    exam: 'Unit Test 2',
    date: '24 Oct 2024',
    time: '10:00 AM - 11:30 AM',
    class: 'SE A & B',
    hall: 'Hall 301',
  });

  // Derive student marks list for selected class directly from centralized students
  const classStudents = students.filter(
    (s) => (s.current_class_name || `${s.class_name} ${s.division}`) === selectedClass
  );

  const handleSaveEditedMarks = (e) => {
    e.preventDefault();
    updateStudentMarks(
      editingStudentMarks.prn || editingStudentMarks.college_id,
      selectedSubject,
      selectedExamType,
      editingStudentMarks.marks
    );
    setEditingStudentMarks(null);
  };

  const handleCreateScheduleSubmit = (e) => {
    e.preventDefault();
    createExamSchedule(newSchedule);
    setShowAddExamModal(false);
  };

  const submittedCount = classStudents.filter((m) => (m.exam_status || 'Submitted') === 'Submitted').length;
  const pendingCount = classStudents.length - submittedCount;
  const submittedPct = classStudents.length > 0 ? Math.round((submittedCount / classStudents.length) * 100) : 100;

  // Pass rate and average score calculated live
  const avgScore = classStudents.length > 0
    ? (classStudents.reduce((acc, s) => acc + (s.ut2_score || s.internal_marks || 25), 0) / classStudents.length).toFixed(1)
    : '0.0';
  const passedStudents = classStudents.filter((s) => (s.ut2_score || s.internal_marks || 25) >= 12).length;
  const passRate = classStudents.length > 0 ? Math.round((passedStudents / classStudents.length) * 100) : 100;

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
              <span>Dashboard</span> &gt; <span className="text-purple-600">Exams &amp; Internal Marks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Exams &amp; Continuous Assessment
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Manage Unit Tests, In-Sem exams, termwork submissions and SPPU internal marks moderation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddExamModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Schedule Exam
            </button>
          </div>
        </div>
      </div>

      {/* ================= 4 EXAM METRIC CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Class Exam Roster</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">{classStudents.length} Students</span>
            <span className="text-[10px] text-purple-600 font-semibold">{selectedClass} Cohort</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Marks Submitted</span>
            <span className="text-xl font-black text-emerald-700 mt-0.5 block">{submittedCount} / {classStudents.length}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">{submittedPct}% Completed</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Class Avg Marks</span>
            <span className="text-xl font-black text-blue-700 mt-0.5 block">{avgScore} / 30</span>
            <span className="text-[10px] text-blue-600 font-semibold">Passing Threshold: 12</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Pass Rate</span>
            <span className="text-xl font-black text-emerald-700 mt-0.5 block">{passRate}%</span>
            <span className="text-[10px] text-emerald-600 font-semibold">{passedStudents} Cleared</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ================= TABS & MAIN CONTENT ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-8 text-xs font-bold">
          {[
            { id: 'marks', label: 'Internal Marks Entry' },
            { id: 'schedule', label: 'Exam Timetable & Schedule' },
            { id: 'results', label: 'Performance Analytics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#7C3AED] text-[#7C3AED]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: INTERNAL MARKS ENTRY */}
        {activeTab === 'marks' && (
          <div className="p-5 space-y-4 text-xs">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  {classes.map((c) => (
                    <option key={c.id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 max-w-[220px] truncate"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id || sub.code} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedExamType}
                  onChange={(e) => setSelectedExamType(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                >
                  <option value="Unit Test 1">Unit Test 1 (30 Marks)</option>
                  <option value="Unit Test 2">Unit Test 2 (30 Marks)</option>
                  <option value="In-Sem Exam">In-Sem Exam (30 Marks)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setViewingPaper({
                      subject: selectedSubject,
                      exam: selectedExamType,
                      maxMarks: 30,
                      duration: '60 Mins',
                    })
                  }
                  className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl border border-purple-200 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Rubrics
                </button>
              </div>
            </div>

            {/* Marks Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-3 w-10">Roll</th>
                    <th className="px-3 py-3">PRN</th>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-3 py-3 text-center">Score (Max 30)</th>
                    <th className="px-3 py-3 text-center">Percentage</th>
                    <th className="px-3 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        No students enrolled in {selectedClass}.
                      </td>
                    </tr>
                  ) : (
                    classStudents.map((s) => {
                      const score = s.ut2_score || s.internal_marks || 25;
                      const pct = Math.round((score / 30) * 100);
                      const isPending = (s.exam_status || 'Submitted') === 'Pending';

                      return (
                        <tr key={s.id || s.prn} className="hover:bg-slate-50/70">
                          <td className="px-3 py-3 font-semibold text-slate-900">{s.roll}</td>
                          <td className="px-3 py-3 font-mono font-bold text-slate-700">{s.prn || s.college_id}</td>
                          <td className="px-4 py-3 font-bold text-slate-900">{s.name || s.full_name}</td>
                          <td className="px-3 py-3 text-center font-bold text-slate-900 text-sm">
                            {score} / 30
                          </td>
                          <td className="px-3 py-3 text-center font-bold text-purple-700">
                            {pct}%
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isPending
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {isPending ? 'Pending' : 'Submitted'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() =>
                                setEditingStudentMarks({
                                  prn: s.prn || s.college_id,
                                  name: s.name || s.full_name,
                                  marks: score,
                                })
                              }
                              className="px-2.5 py-1 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700 rounded-lg font-bold text-[11px] cursor-pointer"
                            >
                              Edit Marks
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: EXAM SCHEDULE */}
        {activeTab === 'schedule' && (
          <div className="p-5 space-y-4 text-xs">
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-3">Code</th>
                    <th className="px-4 py-3">Course / Subject</th>
                    <th className="px-3 py-3">Exam Type</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Time Slot</th>
                    <th className="px-3 py-3">Target Divisions</th>
                    <th className="px-3 py-3">Examination Hall</th>
                    <th className="px-3 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {examSchedules.map((ex, idx) => (
                    <tr key={ex.id || idx} className="hover:bg-slate-50/70">
                      <td className="px-3 py-3 font-mono font-bold text-slate-800">{ex.code}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{ex.subject}</td>
                      <td className="px-3 py-3 font-semibold text-purple-700">{ex.exam}</td>
                      <td className="px-3 py-3 font-medium text-slate-700">{ex.date}</td>
                      <td className="px-3 py-3 font-mono text-slate-500 text-[11px]">{ex.time}</td>
                      <td className="px-3 py-3 font-semibold text-slate-800">{ex.class}</td>
                      <td className="px-3 py-3 font-medium text-slate-600">{ex.hall}</td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ex.status === 'Scheduled'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ex.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PERFORMANCE ANALYTICS */}
        {activeTab === 'results' && (
          <div className="p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base">Department Examination Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-1">
                <span className="text-slate-500 font-semibold block">Total Tested Cohort</span>
                <span className="text-2xl font-black text-purple-900 block">{students.length} Students</span>
                <p className="text-slate-600 text-[11px]">All SE, TE, and BE divisions enrolled in semester exams.</p>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-1">
                <span className="text-slate-500 font-semibold block">Overall Department Clearance</span>
                <span className="text-2xl font-black text-emerald-800 block">96.2%</span>
                <p className="text-slate-600 text-[11px]">Met the SPPU university internal exam criteria.</p>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-1">
                <span className="text-slate-500 font-semibold block">Distinction &gt; 80%</span>
                <span className="text-2xl font-black text-blue-800 block">
                  {students.filter((s) => parseFloat(s.cgpa || 8.5) >= 8.5).length} Students
                </span>
                <p className="text-slate-600 text-[11px]">Top tier academic merit qualifiers.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: EDIT STUDENT MARKS ================= */}
      {editingStudentMarks && (
        <Modal
          isOpen={true}
          onClose={() => setEditingStudentMarks(null)}
          title={`Edit Marks — ${editingStudentMarks.name}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveEditedMarks} className="space-y-4 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Course &amp; Assessment</span>
              <strong className="text-slate-900 text-sm">{selectedSubject} &bull; {selectedExamType}</strong>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Marks Obtained (Out of 30) *</label>
              <input
                type="number"
                min="0"
                max="30"
                value={editingStudentMarks.marks}
                onChange={(e) => setEditingStudentMarks({ ...editingStudentMarks, marks: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-sm"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingStudentMarks(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save &amp; Moderate Marks
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: SCHEDULE EXAM ================= */}
      <Modal
        isOpen={showAddExamModal}
        onClose={() => setShowAddExamModal(false)}
        title="Schedule Continuous Assessment Examination"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateScheduleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Subject *</label>
              <select
                value={newSchedule.subject}
                onChange={(e) => setNewSchedule({ ...newSchedule, subject: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                required
              >
                {subjects.map((s) => (
                  <option key={s.id || s.code} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Exam Type *</label>
              <select
                value={newSchedule.exam}
                onChange={(e) => setNewSchedule({ ...newSchedule, exam: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                required
              >
                <option value="Unit Test 1">Unit Test 1</option>
                <option value="Unit Test 2">Unit Test 2</option>
                <option value="In-Sem Assessment">In-Sem Assessment</option>
                <option value="Lab Practical Exam">Lab Practical Exam</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Date *</label>
              <input
                type="date"
                onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Time Slot *</label>
              <input
                type="text"
                value={newSchedule.time}
                onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                placeholder="10:00 AM - 11:30 AM"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Target Divisions</label>
              <input
                type="text"
                value={newSchedule.class}
                onChange={(e) => setNewSchedule({ ...newSchedule, class: e.target.value })}
                placeholder="e.g. SE A & B"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Examination Hall</label>
              <input
                type="text"
                value={newSchedule.hall}
                onChange={(e) => setNewSchedule({ ...newSchedule, hall: e.target.value })}
                placeholder="Hall 301/302"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddExamModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Publish Exam Schedule
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: VIEW PAPER RUBRIC ================= */}
      {viewingPaper && (
        <Modal
          isOpen={true}
          onClose={() => setViewingPaper(null)}
          title={`Assessment Rubrics — ${viewingPaper.subject}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
              <span className="font-bold text-purple-900 block">{viewingPaper.exam} Blueprint</span>
              <p className="text-slate-600">Max Marks: {viewingPaper.maxMarks} &bull; Duration: {viewingPaper.duration}</p>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span>Unit 1: Fundamentals &amp; Core Analysis</span>
                <strong className="text-slate-900">10 Marks</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span>Unit 2: System Architecture &amp; Logic</span>
                <strong className="text-slate-900">10 Marks</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span>Unit 3: Applied Problem Solving</span>
                <strong className="text-slate-900">10 Marks</strong>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingPaper(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
