import React, { useState } from 'react';
import { useStudent } from '../../../context/StudentContext';
import { useToast } from '../../../context/ToastContext';
import { StudentHeader } from '../components/StudentHeader';
import {
  Shield,
  FileText,
  ToggleLeft,
  ToggleRight,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle2,
  X,
  Send,
  Lock,
  ChevronRight,
  Info,
  HelpCircle
} from 'lucide-react';

export function StudentPrivacyCenter({ onNavigateTab }) {
  const { studentProfile, consents, toggleConsent, addRequest } = useStudent();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rights' | 'consent' | 'access_history'
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showErasureModal, setShowErasureModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showRightsModal, setShowRightsModal] = useState(null);

  const [erasureForm, setErasureForm] = useState({ category: 'Placement Resume Drafts', reason: '' });

  const handleErasureSubmit = (e) => {
    e.preventDefault();
    addRequest({
      title: `Data Erasure Request: ${erasureForm.category}`,
      desc: erasureForm.reason,
      details: `Request to purge ${erasureForm.category} under DPDP Section 12.3.`,
      category: 'Privacy',
    });
    setShowErasureModal(false);
    setErasureForm({ category: 'Placement Resume Drafts', reason: '' });
  };

  const auditLogs = [
    { id: 1, accessor: 'Prof. Sonal Kadam (Class Teacher)', role: 'Faculty', purpose: 'Internal Assessment Evaluation', timestamp: 'Today, 10:30 AM', scope: 'Academic Records, Attendance' },
    { id: 2, accessor: 'Prof. Satyajit Sirsat (Placement Admin)', role: 'TPO', purpose: 'TCS Placement Eligibility Screening', timestamp: 'Yesterday, 04:15 PM', scope: 'CGPA, PRN, Resume' },
    { id: 3, accessor: 'Prof. Akash Mhetre (Exam Admin)', role: 'Exam Cell', purpose: 'Digital Hall Ticket Generation', timestamp: 'Aug 24, 2024', scope: 'Enrollment ID, Course Codes' },
    { id: 4, accessor: 'System Automation', role: 'System', purpose: 'Periodic DPDP Access Audit Check', timestamp: 'Aug 20, 2024', scope: 'Consent Tokens' },
  ];

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. TOP NAVBAR */}
      <StudentHeader onNavigateTab={onNavigateTab} />

      {/* 2. MODULE HEADER BANNER */}
      <div className="bg-white rounded-2xl px-5 py-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">Privacy Center</h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage your data rights, consent and privacy requests
            </p>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION TABS & CONTENT */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="flex border-b border-slate-100 px-4 pt-2 gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'rights', label: 'Data Rights' },
            { id: 'consent', label: 'Consent Management' },
            { id: 'access_history', label: 'Access History' },
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

        {/* Tab 1: Overview matching reference */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            {/* "Your Data, Your Rights" Hero Card */}
            <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <h3 className="text-base font-extrabold text-slate-900">Your Data, Your Rights</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You have control over your personal information. Learn how your data is used and exercise your rights under the Digital Personal Data Protection (DPDP) Act, 2023.
                </p>
                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer inline-block"
                >
                  Learn More
                </button>
              </div>

              <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 self-start md:self-auto">
                <Shield className="w-8 h-8" />
              </div>
            </div>

            {/* Quick Actions (4 Cards) matching reference */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* View Privacy Notice */}
                <div
                  onClick={() => setShowNoticeModal(true)}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-2xs transition-all cursor-pointer flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">View Privacy Notice</h4>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Understand how your data is used.
                    </p>
                  </div>
                </div>

                {/* Manage Consent */}
                <div
                  onClick={() => setActiveTab('consent')}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-2xs transition-all cursor-pointer flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <ToggleRight className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Manage Consent</h4>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Give or withdraw your consent.
                    </p>
                  </div>
                </div>

                {/* Request Data Correction */}
                <div
                  onClick={() => {
                    addRequest({
                      title: 'Data Correction Inquiry',
                      desc: 'Student requested personal data review',
                      category: 'Privacy',
                    });
                    success('Correction request submitted to DPO.');
                  }}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-2xs transition-all cursor-pointer flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                    <Edit className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Request Data Correction</h4>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Request to correct your personal information.
                    </p>
                  </div>
                </div>

                {/* Request Data Erasure */}
                <div
                  onClick={() => setShowErasureModal(true)}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-2xs transition-all cursor-pointer flex items-start gap-3.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Request Data Erasure</h4>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      Request deletion of your data (as per policy).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* "Your Rights" Row matching reference */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Your Rights</h3>

              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowRightsModal('access')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Access</span>
                  </button>

                  <button
                    onClick={() => setShowRightsModal('correction')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-purple-600" />
                    <span>Correction</span>
                  </button>

                  <button
                    onClick={() => setShowRightsModal('erasure')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>Erasure</span>
                  </button>

                  <button
                    onClick={() => setShowRightsModal('grievance')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Grievance</span>
                  </button>
                </div>

                <button
                  onClick={() => setActiveTab('rights')}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Data Rights */}
        {activeTab === 'rights' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">DPDP Statutory Rights Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 font-bold">
                  <Eye className="w-4 h-4" />
                  <h4>Right to Access (Section 11)</h4>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Students have the right to obtain a summary of personal data being processed and the identities of all data fiduciaries who accessed it.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center gap-2 text-purple-700 font-bold">
                  <Edit className="w-4 h-4" />
                  <h4>Right to Correction (Section 12)</h4>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Students can request correction, completion, and updating of inaccurate or misleading personal and academic records.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold">
                  <Trash2 className="w-4 h-4" />
                  <h4>Right to Erasure (Section 12.3)</h4>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Request erasure of non-mandatory personal data (such as optional placement resumes) when no longer required for legal purposes.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <h4>Right to Grievance Redressal (Section 13)</h4>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Direct communication channels with the institutional Data Protection Officer (DPO) for resolution of any privacy concerns.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Consent Management */}
        {activeTab === 'consent' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Manage Your Purpose-Specific Consents</h3>
            <p className="text-xs text-slate-500">
              Toggle optional data processing consents. Mandatory academic processing is preserved for institutional records.
            </p>

            <div className="space-y-3 pt-2">
              {(consents || []).map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">{c.title}</h4>
                    <p className="text-xs text-slate-500">{c.purpose}</p>
                  </div>

                  <button
                    onClick={() => toggleConsent(c.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto ${
                      c.granted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {c.granted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Consent Granted</span>
                      </>
                    ) : (
                      <span>Consent Withdrawn</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Access History */}
        {activeTab === 'access_history' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">DPDP Data Access & Processing Audit Log</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Accessor / Entity</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Purpose of Access</th>
                    <th className="px-4 py-3">Data Scope</th>
                    <th className="px-4 py-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3.5 font-bold text-slate-900">{log.accessor}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md font-semibold text-[10px]">
                          {log.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">{log.purpose}</td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500">{log.scope}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-slate-400">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Privacy Notice */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Institutional Privacy Notice</h3>
                  <p className="text-[11px] text-slate-400">Digital Personal Data Protection Act (DPDP) 2023</p>
                </div>
              </div>
              <button
                onClick={() => setShowNoticeModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              <p>
                CollegeConnect processes student personal data solely for educational management, academic evaluation, attendance tracking, and campus recruitment facilitation in strict accordance with statutory DPDP principles.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Lawful Basis of Processing</span>
                <p className="text-[11px] text-slate-500">
                  Curriculum and examination records are processed under lawful academic duty. Placement and extracurricular sharing require explicit student consent.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Data Protection Officer (DPO) Contact</span>
                <p className="text-[11px] text-slate-500 font-mono">dpo@college.edu • Office of Institutional Compliance</p>
              </div>
            </div>

            <button
              onClick={() => setShowNoticeModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Data Erasure Request */}
      {showErasureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Request Data Erasure</h3>
                  <p className="text-[11px] text-slate-400">Right to Erasure under Section 12.3 DPDP</p>
                </div>
              </div>
              <button
                onClick={() => setShowErasureModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleErasureSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Data Category to Erase
                </label>
                <select
                  value={erasureForm.category}
                  onChange={(e) => setErasureForm({ ...erasureForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="Placement Resume Drafts">Placement Resume Drafts & Profiles</option>
                  <option value="Optional Event Registrations">Optional Workshop & Event Registrations</option>
                  <option value="Non-Mandatory Emergency Contacts">Secondary Emergency Contact Details</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Reason for Erasure Request
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify your justification for erasure..."
                  value={erasureForm.reason}
                  onChange={(e) => setErasureForm({ ...erasureForm, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowErasureModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Submit Erasure Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
