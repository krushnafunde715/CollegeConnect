import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  FileText,
  Calendar,
  Ticket,
  Award,
  FileCheck2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Send,
  AlertTriangle,
  Lock,
  Download
} from 'lucide-react';

const INITIAL_SCHEDULES = [
  { id: 1, name: 'End-Sem Theory Exam - Nov 2026', semester: 'Semester III', department: 'Computer Engineering', class: 'SE A & B', subject: 'Data Structures & Algorithms', date: '2026-11-16', time: '10:00 AM - 01:00 PM', status: 'published' },
  { id: 2, name: 'End-Sem Theory Exam - Nov 2026', semester: 'Semester III', department: 'Computer Engineering', class: 'SE A & B', subject: 'Database Management Systems', date: '2026-11-18', time: '10:00 AM - 01:00 PM', status: 'published' },
  { id: 3, name: 'End-Sem Theory Exam - Nov 2026', semester: 'Semester V', department: 'Information Technology', class: 'TE A & B', subject: 'Information & Cyber Security', date: '2026-11-20', time: '02:00 PM - 05:00 PM', status: 'draft' },
  { id: 4, name: 'End-Sem Theory Exam - Nov 2026', semester: 'Semester VII', department: 'Electronics & Telecommunication', class: 'BE A', subject: 'VLSI Design', date: '2026-11-22', time: '10:00 AM - 01:00 PM', status: 'draft' },
];

const INITIAL_REGISTRATIONS = [
  { id: 1, student: 'Aarav Rajesh Sharma', prn: 'PRN20240101', class: 'SE A', dept: 'Computer Engineering', eligibility: 'Eligible (92.5% Attendance)', regStatus: 'Approved', feeStatus: 'Paid' },
  { id: 2, student: 'Ananya Sunil Deshpande', prn: 'PRN20240102', class: 'SE A', dept: 'Computer Engineering', eligibility: 'Eligible (95.0% Attendance)', regStatus: 'Approved', feeStatus: 'Paid' },
  { id: 3, student: 'Rohan Vikram Patil', prn: 'PRN20230205', class: 'TE B', dept: 'Information Technology', eligibility: 'Eligible (88.4% Attendance)', regStatus: 'Approved', feeStatus: 'Paid' },
  { id: 4, student: 'Pooja Manoj Kadam', prn: 'PRN20220310', class: 'BE A', dept: 'Electronics & Telecommunication', eligibility: 'Eligible (91.2% Attendance)', regStatus: 'Approved', feeStatus: 'Paid' },
];

const INITIAL_RESULTS = [
  { id: 1, student: 'Aarav Rajesh Sharma', prn: 'PRN20240101', subject: 'Data Structures & Algorithms', internalMarks: '28/30', externalMarks: '62/70', total: '90/100', grade: 'O (Outstanding)', resultStatus: 'Passed', publishStatus: 'Published' },
  { id: 2, student: 'Ananya Sunil Deshpande', prn: 'PRN20240102', subject: 'Data Structures & Algorithms', internalMarks: '29/30', externalMarks: '65/70', total: '94/100', grade: 'O (Outstanding)', resultStatus: 'Passed', publishStatus: 'Published' },
  { id: 3, student: 'Rohan Vikram Patil', prn: 'PRN20230205', subject: 'Information & Cyber Security', internalMarks: '25/30', externalMarks: '58/70', total: '83/100', grade: 'A+ (Excellent)', resultStatus: 'Passed', publishStatus: 'Published' },
];

const INITIAL_HALL_TICKETS = [
  { id: 1, student: 'Aarav Rajesh Sharma', prn: 'PRN20240101', exam: 'End-Sem Nov 2026', center: 'Main Building Block 301', status: 'Generated', issuedOn: '2026-10-12' },
  { id: 2, student: 'Ananya Sunil Deshpande', prn: 'PRN20240102', exam: 'End-Sem Nov 2026', center: 'Main Building Block 301', status: 'Generated', issuedOn: '2026-10-12' },
  { id: 3, student: 'Rohan Vikram Patil', prn: 'PRN20230205', exam: 'End-Sem Nov 2026', center: 'IT Wing Block 204', status: 'Generated', issuedOn: '2026-10-12' },
];

const INITIAL_CORRECTIONS = [
  {
    id: 1,
    student: 'Rohan Vikram Patil',
    prn: 'PRN20230205',
    subject: 'Computer Networks (CS304)',
    type: 'External Marks Recounting',
    previousValue: '54 / 70',
    updatedValue: '59 / 70',
    reason: 'Re-evaluation confirmed totaling discrepancy in question 4(b).',
    submittedAt: '2026-10-05 11:30 AM',
    reviewer: 'Exam Admin & Dr. S. Kulkarni',
    reviewedAt: '2026-10-08 04:15 PM',
    status: 'approved',
  },
  {
    id: 2,
    student: 'Siddharth Nitin Shinde',
    prn: 'PRN20220412',
    subject: 'Finite Element Analysis (ME701)',
    type: 'Internal Marks Re-entry',
    previousValue: '21 / 30',
    updatedValue: '26 / 30',
    reason: 'Lab journal submission marks inadvertently omitted during initial batch upload.',
    submittedAt: '2026-10-09 02:00 PM',
    reviewer: 'Under Review by Exam Cell',
    reviewedAt: '--',
    status: 'pending',
  },
];

export function ExaminationModule() {
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule', 'registrations', 'results', 'tickets', 'corrections'
  
  // Data lists
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);
  const [registrations, setRegistrations] = useState(INITIAL_REGISTRATIONS);
  const [results, setResults] = useState(INITIAL_RESULTS);
  const [hallTickets, setHallTickets] = useState(INITIAL_HALL_TICKETS);
  const [corrections, setCorrections] = useState(INITIAL_CORRECTIONS);

  // Modals
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [selectedCorrection, setSelectedCorrection] = useState(null);

  // Forms
  const [newExamForm, setNewExamForm] = useState({
    name: '',
    semester: 'Semester III',
    department: 'Computer Engineering',
    class: 'SE A',
    subject: '',
    date: '',
    time: '10:00 AM - 01:00 PM',
  });

  const { success, error } = useToast();

  const handleCreateExam = (e) => {
    e.preventDefault();
    if (!newExamForm.name.trim() || !newExamForm.subject.trim() || !newExamForm.date) {
      error('Exam Name, Subject, and Date are required.');
      return;
    }
    const newSchedule = {
      id: Date.now(),
      ...newExamForm,
      status: 'draft',
    };
    setSchedules([...schedules, newSchedule]);
    setShowAddExamModal(false);
    setNewExamForm({
      name: '',
      semester: 'Semester III',
      department: 'Computer Engineering',
      class: 'SE A',
      subject: '',
      date: '',
      time: '10:00 AM - 01:00 PM',
    });
    success(`Examination schedule for "${newSchedule.subject}" created as draft.`);
  };

  const publishSchedule = (id) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'published' } : s))
    );
    success('Exam schedule published for student & faculty portals.');
  };

  const approveCorrection = (corrId) => {
    setCorrections((prev) =>
      prev.map((c) =>
        c.id === corrId
          ? {
              ...c,
              status: 'approved',
              reviewer: 'Dr. S. Kulkarni (Super Admin)',
              reviewedAt: new Date().toLocaleString(),
            }
          : c
      )
    );
    setSelectedCorrection(null);
    success('Result correction approved and auditable grade change committed.');
  };

  const rejectCorrection = (corrId) => {
    setCorrections((prev) =>
      prev.map((c) =>
        c.id === corrId
          ? {
              ...c,
              status: 'rejected',
              reviewer: 'Dr. S. Kulkarni (Super Admin)',
              reviewedAt: new Date().toLocaleString(),
            }
          : c
      )
    );
    setSelectedCorrection(null);
    success('Result correction request rejected.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Examination Department Governance</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage institutional exam timetables, candidate registrations, grade publishing, and formal result correction workflows.
          </p>
        </div>

        {activeTab === 'schedule' && (
          <button
            onClick={() => setShowAddExamModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Examination
          </button>
        )}
      </div>

      {/* Internal Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-1.5 flex gap-1.5 overflow-x-auto text-xs font-bold">
        {[
          { id: 'schedule', label: `Exam Schedules (${schedules.length})`, icon: Calendar },
          { id: 'registrations', label: 'Candidate Registrations', icon: Ticket },
          { id: 'results', label: 'Published Results', icon: Award },
          { id: 'tickets', label: 'Hall Tickets', icon: FileText },
          { id: 'corrections', label: `Result Correction Requests (${corrections.filter(c => c.status === 'pending').length})`, icon: FileCheck2 },
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
      {/* TAB 1: EXAM SCHEDULES                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Examination</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Department & Class</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {schedules.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-950">{item.subject}</td>
                    <td className="py-3.5 px-4">{item.department} ({item.class})</td>
                    <td className="py-3.5 px-4">
                      <p className="font-mono">{item.date}</p>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={item.status}>{item.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {item.status === 'draft' ? (
                        <button
                          onClick={() => publishSchedule(item.id)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold rounded-lg transition-colors text-[11px]"
                        >
                          Publish Timetable
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Published
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CANDIDATE REGISTRATIONS                                            */}
      {/* ========================================================================= */}
      {activeTab === 'registrations' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Candidate Student</th>
                  <th className="py-3.5 px-4">PRN</th>
                  <th className="py-3.5 px-4">Department & Class</th>
                  <th className="py-3.5 px-4">Attendance Eligibility</th>
                  <th className="py-3.5 px-4 text-center">Exam Fee</th>
                  <th className="py-3.5 px-4 text-center">Registration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{reg.student}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{reg.prn}</td>
                    <td className="py-3.5 px-4">{reg.dept} ({reg.class})</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-semibold">{reg.eligibility}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                        {reg.feeStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="active">{reg.regStatus}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PUBLISHED RESULTS                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">PRN</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4 text-center">Internal / External</th>
                  <th className="py-3.5 px-4 text-center">Total Marks</th>
                  <th className="py-3.5 px-4 text-center">Grade</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {results.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{res.student}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{res.prn}</td>
                    <td className="py-3.5 px-4">{res.subject}</td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {res.internalMarks} + {res.externalMarks}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900 font-mono">
                      {res.total}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-indigo-700">{res.grade}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="active">{res.resultStatus}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: HALL TICKETS                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'tickets' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">PRN</th>
                  <th className="py-3.5 px-4">Examination</th>
                  <th className="py-3.5 px-4">Assigned Exam Center</th>
                  <th className="py-3.5 px-4">Issued On</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {hallTickets.map((ht) => (
                  <tr key={ht.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{ht.student}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{ht.prn}</td>
                    <td className="py-3.5 px-4">{ht.exam}</td>
                    <td className="py-3.5 px-4 text-slate-700">{ht.center}</td>
                    <td className="py-3.5 px-4 font-mono">{ht.issuedOn}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="active">{ht.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: RESULT CORRECTION REQUESTS WORKFLOW (DPDP AUDIT SAFE)               */}
      {/* ========================================================================= */}
      {activeTab === 'corrections' && (
        <div className="space-y-4">
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Strict Audit Requirement for Result Changes</p>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                Silent modification of published examination results is prohibited. All mark updates must go through formal review recording the reviewer, rationale, timestamp, and immutable before/after values.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">Student & PRN</th>
                    <th className="py-3.5 px-4">Subject & Type</th>
                    <th className="py-3.5 px-4">Previous Value</th>
                    <th className="py-3.5 px-4">Updated Value</th>
                    <th className="py-3.5 px-4">Submitted Time</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {corrections.map((corr) => (
                    <tr key={corr.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{corr.student}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{corr.prn}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{corr.subject}</p>
                        <span className="text-[10px] text-slate-400">{corr.type}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-700 bg-rose-50/50 px-2 rounded">
                        {corr.previousValue}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 bg-emerald-50/50 px-2 rounded">
                        {corr.updatedValue}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{corr.submittedAt}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant={corr.status}>{corr.status}</Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedCorrection(corr)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-bold rounded-lg transition-colors text-[11px]"
                        >
                          View Review
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
      {/* CREATE EXAM MODAL                                                         */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showAddExamModal}
        onClose={() => setShowAddExamModal(false)}
        title="Schedule New Examination"
        subtitle="Create a new exam slot in the institutional calendar."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateExam} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Exam Session Name *</label>
            <input
              type="text"
              required
              value={newExamForm.name}
              onChange={(e) => setNewExamForm({ ...newExamForm, name: e.target.value })}
              placeholder="e.g. End-Sem Theory Exam - Nov 2026"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Department</label>
              <select
                value={newExamForm.department}
                onChange={(e) => setNewExamForm({ ...newExamForm, department: e.target.value })}
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
                value={newExamForm.semester}
                onChange={(e) => setNewExamForm({ ...newExamForm, semester: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="Semester III">Semester III</option>
                <option value="Semester V">Semester V</option>
                <option value="Semester VII">Semester VII</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Subject Name *</label>
            <input
              type="text"
              required
              value={newExamForm.subject}
              onChange={(e) => setNewExamForm({ ...newExamForm, subject: e.target.value })}
              placeholder="e.g. Data Structures & Algorithms"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Date *</label>
              <input
                type="date"
                required
                value={newExamForm.date}
                onChange={(e) => setNewExamForm({ ...newExamForm, date: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Time Slot</label>
              <input
                type="text"
                value={newExamForm.time}
                onChange={(e) => setNewExamForm({ ...newExamForm, time: e.target.value })}
                placeholder="10:00 AM - 01:00 PM"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddExamModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* REVIEW CORRECTION REQUEST MODAL                                           */}
      {/* ========================================================================= */}
      {selectedCorrection && (
        <Modal
          isOpen={Boolean(selectedCorrection)}
          onClose={() => setSelectedCorrection(null)}
          title="Review Result Correction Request"
          subtitle={`Student: ${selectedCorrection.student} (${selectedCorrection.prn})`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-3.5 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Subject</span>
                <p className="font-bold text-slate-900">{selectedCorrection.subject}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-600">Previous Marks</span>
                  <p className="font-bold font-mono text-rose-700">{selectedCorrection.previousValue}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-600">Proposed Updated Marks</span>
                  <p className="font-bold font-mono text-emerald-700">{selectedCorrection.updatedValue}</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400">Review Rationale & Justification</span>
              <p className="text-slate-800 font-medium mt-1 leading-relaxed">{selectedCorrection.reason}</p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
              <span>Submitted: {selectedCorrection.submittedAt}</span>
              <Badge variant={selectedCorrection.status}>{selectedCorrection.status}</Badge>
            </div>

            {selectedCorrection.status === 'pending' && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => rejectCorrection(selectedCorrection.id)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs transition-colors"
                >
                  Reject Request
                </button>
                <button
                  type="button"
                  onClick={() => approveCorrection(selectedCorrection.id)}
                  className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
                >
                  Approve & Commit Grade Change
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
