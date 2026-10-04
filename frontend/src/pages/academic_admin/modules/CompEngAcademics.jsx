import React, { useState } from 'react';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  BookOpen,
  CalendarCheck,
  FileCheck2,
  Calendar,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
  TrendingUp,
  Award
} from 'lucide-react';

export function CompEngAcademics({
  subjects = [],
  corrections = [],
  classes = [],
  onAddSubject,
  onReviewCorrection,
  departmentName = 'Computer Engineering',
  initialSubTab = 'curriculum',
}) {
  const [subTab, setSubTab] = useState(initialSubTab); // 'curriculum', 'attendance', 'corrections', 'calendar'

  React.useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const [searchSubject, setSearchSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [showSubjectModal, setShowSubjectModal] = useState(false);

  // Review justification modal
  const [reviewingReq, setReviewingReq] = useState(null);
  const [reviewDecision, setReviewDecision] = useState('approved');
  const [reviewNotes, setReviewNotes] = useState('');

  const [newSubject, setNewSubject] = useState({
    code: 'CS305',
    name: 'Distributed Systems & Cloud',
    semester: 'Semester 6 (TE)',
    credits: 4,
    theory_hours: 3,
    lab_hours: 2,
    faculty_incharge: 'Dr. K. Verma',
  });

  const handleCreateSubject = (e) => {
    e.preventDefault();
    onAddSubject(newSubject);
    setShowSubjectModal(false);
    setNewSubject({
      code: '',
      name: '',
      semester: 'Semester 4 (SE)',
      credits: 4,
      theory_hours: 3,
      lab_hours: 2,
      faculty_incharge: '',
    });
  };

  const handleConfirmReview = (e) => {
    e.preventDefault();
    onReviewCorrection(reviewingReq.id, reviewDecision, reviewNotes);
    setReviewingReq(null);
    setReviewNotes('');
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchSubject.toLowerCase()) ||
      s.code.toLowerCase().includes(searchSubject.toLowerCase()) ||
      (s.faculty_incharge || '').toLowerCase().includes(searchSubject.toLowerCase());

    const matchesSem =
      selectedSemester === 'ALL' || (s.semester || '').includes(selectedSemester);

    return matchesSearch && matchesSem;
  });

  const pendingCount = corrections.filter((c) => c.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header & Internal Nav */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Computer Engineering Academic Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Curriculum catalog, attendance monitoring, DPDP student rectification workflows, and academic schedule.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {subTab === 'curriculum' && (
              <button
                onClick={() => setShowSubjectModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Course / Subject
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setSubTab('curriculum')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'curriculum'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Course Catalog ({subjects.length})</span>
          </button>

          <button
            onClick={() => setSubTab('attendance')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'attendance'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Attendance Monitoring</span>
          </button>

          <button
            onClick={() => setSubTab('corrections')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'corrections'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>DPDP Rectifications</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-black">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setSubTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'calendar'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Academic Milestones</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Curriculum & Subjects */}
      {subTab === 'curriculum' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchSubject}
                onChange={(e) => setSearchSubject(e.target.value)}
                placeholder="Search subject by code, name, or incharge..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full sm:w-60 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="ALL">All Semesters (Sem 3 to Sem 8)</option>
              <option value="Semester 3">Semester 3 (SE)</option>
              <option value="Semester 4">Semester 4 (SE)</option>
              <option value="Semester 5">Semester 5 (TE)</option>
              <option value="Semester 6">Semester 6 (TE)</option>
              <option value="Semester 7">Semester 7 (BE)</option>
              <option value="Semester 8">Semester 8 (BE)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map((sub, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-shadow space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded border border-indigo-100">
                      {sub.code}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-2">{sub.name}</h3>
                  </div>
                  <Badge variant="indigo" size="sm">
                    {sub.credits} Credits
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 font-medium">{sub.semester}</p>

                <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between border border-slate-100">
                  <span>Theory: <strong>{sub.theory_hours} hrs</strong></span>
                  <span>&bull;</span>
                  <span>Lab: <strong>{sub.lab_hours} hrs</strong></span>
                  <span>&bull;</span>
                  <span>Total: <strong>{sub.theory_hours + sub.lab_hours} hrs/wk</strong></span>
                </div>

                <div className="text-xs text-slate-600 pt-1 flex items-center justify-between">
                  <span className="text-slate-400">Course In-Charge:</span>
                  <strong className="text-slate-800">{sub.faculty_incharge}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Attendance Monitoring */}
      {subTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Department Attendance Aggregation</h3>
            <p className="text-xs text-slate-500">
              Live attendance records across all Computer Engineering divisions. Threshold alert set at 75%.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div key={cls.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{cls.name}</span>
                  <span className="text-xs font-bold text-emerald-600">{cls.attendance_rate || '88.4'}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${cls.attendance_rate || '88.4'}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Total Students: {cls.student_count || 68}</span>
                  <span>Defaulters (&lt;75%): <strong className="text-rose-600">3</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: DPDP Rectification Requests */}
      {subTab === 'corrections' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">DPDP Student Rectification Workflow</h3>
              <p className="text-xs text-slate-500">
                Exercise of the Right to Rectification under India's DPDP Act 2026 for Computer Engineering students.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200/60 font-semibold">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Direct Database Synchronizer Active</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Target Field</th>
                  <th className="px-4 py-3">Current Value</th>
                  <th className="px-4 py-3">Requested Correction</th>
                  <th className="px-4 py-3">Justification</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {corrections.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{req.student_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{req.college_id}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">{req.field_name}</td>
                    <td className="px-4 py-3 text-slate-500 line-through">{req.current_value || '—'}</td>
                    <td className="px-4 py-3 font-bold text-indigo-600">{req.requested_value}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs">{req.justification}</td>
                    <td className="px-4 py-3">
                      <Badge variant={req.status} size="sm">
                        {req.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setReviewingReq(req);
                              setReviewDecision('approved');
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setReviewingReq(req);
                              setReviewDecision('rejected');
                            }}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Academic Milestones */}
      {subTab === 'calendar' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Academic Term Milestones — AY 2025–26</h3>
            <p className="text-xs text-slate-500">Key deadlines and operational phases for Computer Engineering.</p>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs">Term Commencement & Orientation</span>
                <p className="text-[11px] text-slate-500">Classes commence for SE, TE, and BE divisions.</p>
              </div>
              <span className="text-xs font-bold text-indigo-700 font-mono">Jan 06, 2026 &bull; Completed</span>
            </div>
            <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs">Mid-Semester In-Sem Examination</span>
                <p className="text-[11px] text-slate-500">Evaluations for Unit 1, 2, and 3 across all courses.</p>
              </div>
              <span className="text-xs font-bold text-purple-700 font-mono">Feb 23 - Feb 28, 2026 &bull; Completed</span>
            </div>
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs">Laboratory Termwork Submission & Mock Viva</span>
                <p className="text-[11px] text-slate-500">Final verification of laboratory journals and assignments.</p>
              </div>
              <span className="text-xs font-bold text-amber-700 font-mono">Apr 10 - Apr 18, 2026 &bull; Upcoming</span>
            </div>
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-xs">End-Semester University Examinations</span>
                <p className="text-[11px] text-slate-500">Final theoretical and practical examination window.</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 font-mono">May 02 - May 24, 2026 &bull; Scheduled</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Subject */}
      <Modal
        isOpen={showSubjectModal}
        onClose={() => setShowSubjectModal(false)}
        title="Add Computer Engineering Course"
        subtitle="Catalog a new syllabus subject for the department"
      >
        <form onSubmit={handleCreateSubject} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={newSubject.code}
                onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                placeholder="e.g. CS304"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Credits
              </label>
              <input
                type="number"
                value={newSubject.credits}
                onChange={(e) => setNewSubject({ ...newSubject, credits: parseInt(e.target.value) || 3 })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Course Name
            </label>
            <input
              type="text"
              value={newSubject.name}
              onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
              placeholder="e.g. Artificial Intelligence & Deep Learning"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Semester
              </label>
              <select
                value={newSubject.semester}
                onChange={(e) => setNewSubject({ ...newSubject, semester: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="Semester 3 (SE)">Semester 3 (SE)</option>
                <option value="Semester 4 (SE)">Semester 4 (SE)</option>
                <option value="Semester 5 (TE)">Semester 5 (TE)</option>
                <option value="Semester 6 (TE)">Semester 6 (TE)</option>
                <option value="Semester 7 (BE)">Semester 7 (BE)</option>
                <option value="Semester 8 (BE)">Semester 8 (BE)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Course In-Charge Faculty
              </label>
              <input
                type="text"
                value={newSubject.faculty_incharge}
                onChange={(e) => setNewSubject({ ...newSubject, faculty_incharge: e.target.value })}
                placeholder="Dr. K. Verma"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowSubjectModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl"
            >
              Save Course
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Review Correction Request */}
      {reviewingReq && (
        <Modal
          isOpen={!!reviewingReq}
          onClose={() => setReviewingReq(null)}
          title={`Review Rectification — ${reviewDecision === 'approved' ? 'Approval' : 'Rejection'}`}
          subtitle={`Student: ${reviewingReq.student_name} (${reviewingReq.college_id})`}
        >
          <form onSubmit={handleConfirmReview} className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p><strong>Field:</strong> <span className="font-mono text-indigo-600">{reviewingReq.field_name}</span></p>
              <p><strong>Proposed Value:</strong> <span className="font-bold text-slate-900">{reviewingReq.requested_value}</span></p>
              <p><strong>Student Justification:</strong> "{reviewingReq.justification}"</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Admin Review Justification Notes
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="e.g. Verified against original academic admission register and UIDAI documentation."
                rows={3}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewingReq(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-2xs ${
                  reviewDecision === 'approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {reviewDecision === 'approved' ? 'Approval & Sync' : 'Rejection'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
