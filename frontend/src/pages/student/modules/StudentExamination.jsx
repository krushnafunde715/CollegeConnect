import React, { useState } from 'react';
import { useStudent } from '../../../context/StudentContext';
import { useToast } from '../../../context/ToastContext';
import { StudentHeader } from '../components/StudentHeader';
import {
  Ticket,
  Award,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
  Download,
  Plus,
  Send,
  X,
  Lock,
  QrCode,
  ShieldCheck,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export function StudentExamination({ onNavigateTab }) {
  const { studentProfile, examResults, examTimetable, requests, addRequest } = useStudent();
  const { success } = useToast();

  const [activeTab, setActiveTab] = useState('results'); // 'results' | 'timetable' | 'hall_ticket' | 'corrections'
  const [selectedSemester, setSelectedSemester] = useState('Semester V');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [correctionForm, setCorrectionForm] = useState({
    subject: 'Database Management System (410231)',
    type: 'Marks Addition Error',
    reason: '',
  });

  const handleCorrectionSubmit = (e) => {
    e.preventDefault();
    addRequest({
      title: `Exam Record Correction: ${correctionForm.subject}`,
      desc: `${correctionForm.type} - ${correctionForm.reason}`,
      details: correctionForm.reason,
      category: 'Examination',
    });
    setShowCorrectionModal(false);
    setCorrectionForm({
      subject: 'Database Management System (410231)',
      type: 'Marks Addition Error',
      reason: '',
    });
  };

  const handleDownloadHallTicket = () => {
    const textContent = `COLLEGECONNECT DIGITAL EXAMINATION HALL TICKET\n` +
      `======================================================\n` +
      `Candidate Name: ${studentProfile?.fullName || 'Krushna Ashok Funde'}\n` +
      `PRN: ${studentProfile?.prn || 'CE2022001'} | Seat No: BE2026-COMP-042\n` +
      `Center: NMIET Campus Exam Center - Block A\n` +
      `Examination: End Semester Theory Examination 2026\n\n` +
      `TIMETABLE:\n` +
      (examTimetable || []).map((t) => `${t.date} (${t.time}) - [${t.code}] ${t.name} - ${t.hall}`).join('\n') +
      `\n\nCryptographic Verification Hash: 9f82c4...e18a (Validated by Exam Cell)`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hall_Ticket_${studentProfile?.prn || 'CE2022001'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    success('Digital Hall Ticket downloaded.');
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. TOP NAVBAR */}
      <StudentHeader onNavigateTab={onNavigateTab} />

      {/* 2. MODULE HEADER BANNER */}
      <div className="bg-white rounded-2xl px-5 py-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">Examination</h1>
            <p className="text-xs text-slate-500 font-medium">
              View your exam records and raise correction requests
            </p>
          </div>
        </div>

        {/* Semester Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-slate-400">Semester</span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="Semester V">Semester V</option>
            <option value="Semester IV">Semester IV</option>
            <option value="Semester III">Semester III</option>
          </select>
        </div>
      </div>

      {/* 3. NAVIGATION TABS & CONTENT */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="flex border-b border-slate-100 px-4 pt-2 gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'results', label: 'Exam Results' },
            { id: 'timetable', label: 'Timetable' },
            { id: 'hall_ticket', label: 'Hall Ticket' },
            { id: 'corrections', label: 'Correction Requests' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Exam Results */}
        {activeTab === 'results' && (
          <div className="p-6 space-y-6">
            {/* 3 Metric Cards matching reference */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">SGPA</span>
                  <span className="text-2xl font-black text-blue-600 block mt-0.5">8.45</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Result Status</span>
                  <span className="text-xl font-black text-emerald-600 block mt-0.5">Declared</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Backlogs</span>
                  <span className="text-2xl font-black text-rose-600 block mt-0.5">0</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Subject-wise Results Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Subject-wise Results</h3>

              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50/80 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5">Subject Code</th>
                      <th className="px-4 py-3.5">Subject Name</th>
                      <th className="px-4 py-3.5 text-center">Credits</th>
                      <th className="px-4 py-3.5 text-center">Grade</th>
                      <th className="px-4 py-3.5 text-right">Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {(examResults || []).map((sub) => (
                      <tr key={sub.code} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3.5 font-mono font-bold text-slate-700">{sub.code}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">{sub.name}</td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-700">{sub.credits}</td>
                        <td className="px-4 py-3.5 text-center font-bold text-emerald-600 font-mono">{sub.grade}</td>
                        <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">{sub.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Need to correct something? Banner Card */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Need to correct something?</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    If you find any error in your exam records, you can raise a correction request.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCorrectionModal(true)}
                className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto whitespace-nowrap"
              >
                Raise Correction Request
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Timetable */}
        {activeTab === 'timetable' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Upcoming End Semester Examination Timetable</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Subject Code</th>
                    <th className="px-4 py-3">Subject Name</th>
                    <th className="px-4 py-3 text-right">Venue / Hall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {(examTimetable || []).map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{t.date}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{t.time}</td>
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">{t.code}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{t.name}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-md text-[11px] border border-blue-100">
                          {t.hall}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Hall Ticket */}
        {activeTab === 'hall_ticket' && (
          <div className="p-6 space-y-6 max-w-2xl mx-auto">
            <div className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-3xl p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                <Ticket className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Digital Examination Admit Card (Hall Ticket)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  End Semester Examination • Verified & Authenticated by Examination Cell
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Student:</span>
                  <span className="font-bold text-slate-900">{studentProfile?.fullName || 'Krushna Ashok Funde'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PRN / Seat No:</span>
                  <span className="font-mono font-bold text-blue-600">{studentProfile?.prn || 'CE2022001'} / BE2026-COMP-042</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Exam Center:</span>
                  <span className="font-bold text-slate-800">NMIET Campus Exam Center - Block A</span>
                </div>
              </div>

              <button
                onClick={handleDownloadHallTicket}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Hall Ticket (PDF)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Correction Requests */}
        {activeTab === 'corrections' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Your Exam Correction Requests</h3>
              <button
                onClick={() => setShowCorrectionModal(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Request</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(requests || [])
                .filter((r) => r.category === 'Examination' || r.title.toLowerCase().includes('exam'))
                .map((req) => (
                  <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600">{req.id}</span>
                      <h4 className="text-xs font-bold text-slate-900">{req.title}</h4>
                      <p className="text-[11px] text-slate-500">{req.desc}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${req.statusBadge}`}>
                      {req.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Raise Correction Request */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Raise Exam Correction Request</h3>
                  <p className="text-[11px] text-slate-400">Direct inquiry to Examination Department</p>
                </div>
              </div>
              <button
                onClick={() => setShowCorrectionModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCorrectionSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Subject Course
                </label>
                <select
                  value={correctionForm.subject}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="Database Management System (410231)">Database Management System (410231)</option>
                  <option value="Operating System (410232)">Operating System (410232)</option>
                  <option value="Computer Networks (410233)">Computer Networks (410233)</option>
                  <option value="Software Engineering (410234)">Software Engineering (410234)</option>
                  <option value="Professional Elective - I (410235)">Professional Elective - I (410235)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Correction Category
                </label>
                <select
                  value={correctionForm.type}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="Marks Addition Error">Marks Addition / Totaling Discrepancy</option>
                  <option value="Subject Name Mismatch">Subject Name / Code Mismatch</option>
                  <option value="Internal Marks Discrepancy">Internal Assessment Score Verification</option>
                  <option value="Attendance Discrepancy">Attendance Credit Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Discrepancy Details
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the discrepancy clearly..."
                  value={correctionForm.reason}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Exam Cell</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
