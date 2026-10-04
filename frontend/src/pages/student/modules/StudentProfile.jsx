import React, { useState } from 'react';
import { useStudent } from '../../../context/StudentContext';
import { useToast } from '../../../context/ToastContext';
import { StudentHeader } from '../components/StudentHeader';
import {
  User,
  Edit,
  Download,
  Clock,
  Shield,
  CheckCircle2,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Building,
  GraduationCap,
  FileText,
  X,
  Send,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export function StudentProfile({ onNavigateTab }) {
  const { studentProfile, addRequest } = useStudent();
  const { success, info } = useToast();

  const [activeSubTab, setActiveSubTab] = useState('academic'); // 'academic' | 'contact' | 'emergency' | 'other'
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [correctionForm, setCorrectionForm] = useState({
    field: 'Phone Number',
    currentValue: studentProfile?.phone || '+91 98765 43210',
    newValue: '',
    reason: '',
  });

  const handleCorrectionSubmit = (e) => {
    e.preventDefault();
    addRequest({
      title: `Profile Correction: ${correctionForm.field}`,
      desc: `Update ${correctionForm.field} to ${correctionForm.newValue}`,
      details: correctionForm.reason,
      category: 'Profile',
    });
    setShowCorrectionModal(false);
    setCorrectionForm({
      field: 'Phone Number',
      currentValue: studentProfile?.phone || '+91 98765 43210',
      newValue: '',
      reason: '',
    });
  };

  const handleDownloadProfilePDF = () => {
    const textContent = `COLLEGECONNECT - OFFICIAL STUDENT PROFILE\n` +
      `======================================================\n` +
      `Student Name      : ${studentProfile?.fullName || 'Krushna Ashok Funde'}\n` +
      `Student ID / PRN  : ${studentProfile?.prn || 'CE2022001'}\n` +
      `Department        : ${studentProfile?.department || 'Computer Engineering'}\n` +
      `Program           : ${studentProfile?.program || 'BE Computer Engineering'}\n` +
      `Roll No / Div     : ${studentProfile?.rollNo || '22CE045'} (Div ${studentProfile?.division || 'A'})\n` +
      `Current Year      : ${studentProfile?.currentYear || 'Final Year (BE)'}\n` +
      `Batch             : ${studentProfile?.batch || '2022 - 2026'}\n` +
      `CGPA              : ${studentProfile?.cgpa || '8.45'}\n` +
      `Email             : ${studentProfile?.email || 'krushna.funde@college.edu'}\n` +
      `Phone             : ${studentProfile?.phone || '+91 98765 43210'}\n` +
      `Address           : ${studentProfile?.address || 'Talegaon, Pune, Maharashtra'}\n` +
      `Blood Group       : ${studentProfile?.bloodGroup || 'B+'}\n` +
      `Emergency Contact : ${studentProfile?.emergencyContact?.name || 'Ashok Funde'} (${studentProfile?.emergencyContact?.phone || '+91 98221 99881'})\n` +
      `======================================================\n` +
      `Verified under Digital Personal Data Protection (DPDP) Standards.`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Student_Profile_${studentProfile?.prn || 'CE2022001'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    success('Student Profile downloaded.');
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. TOP NAVBAR */}
      <StudentHeader onNavigateTab={onNavigateTab} />

      {/* 2. MODULE HEADER BANNER */}
      <div className="bg-white rounded-2xl px-5 py-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">My Profile</h1>
            <p className="text-xs text-slate-500 font-medium">
              View and manage your personal and academic details.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCorrectionModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit Request</span>
        </button>
      </div>

      {/* 3. MAIN PROFILE & PERSONAL INFO CARD */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Avatar & Summary */}
          <div className="lg:col-span-4 flex flex-col items-center text-center p-4 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/20 ring-4 ring-white">
                {studentProfile?.name ? studentProfile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'KF'}
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-slate-900">{studentProfile?.name || 'Krushna Funde'}</h2>
              <p className="text-xs font-mono font-bold text-blue-600">{studentProfile?.prn || 'CE2022001'}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{studentProfile?.program || 'BE Computer Engineering'}</p>
            </div>

            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full border border-emerald-200">
              Active Student
            </span>
          </div>

          {/* Right Column: Personal Information Table */}
          <div className="lg:col-span-8 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-400">Full Name</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5">{studentProfile?.fullName || 'Krushna Ashok Funde'}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-400">Student ID</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5">{studentProfile?.prn || 'CE2022001'}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-400">Department</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5">{studentProfile?.department || 'Computer Engineering'}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-400">Email</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5 font-mono">{studentProfile?.email || 'krushna.funde@college.edu'}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-400">Phone</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5">{studentProfile?.phone || '+91 98765 43210'}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-400">Date of Birth</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5">{studentProfile?.dob || '15 May 2004'}</span>
              </div>

              <div className="flex flex-col sm:col-span-2">
                <span className="text-[11px] font-semibold text-slate-400">Address</span>
                <span className="font-bold text-slate-800 text-xs mt-0.5">{studentProfile?.address || 'Talegaon, Pune, Maharashtra'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TABS & PROFILE DETAILS CARD */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Sub-Tabs Header */}
        <div className="flex border-b border-slate-100 px-4 pt-2 gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'academic', label: 'Academic Details' },
            { id: 'contact', label: 'Contact Details' },
            { id: 'emergency', label: 'Emergency Contact' },
            { id: 'other', label: 'Other Information' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Academic Details */}
        {activeSubTab === 'academic' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Academic Fields */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-semibold">Current Year :</span>
                  <span className="font-bold text-slate-800">{studentProfile?.currentYear || 'Final Year (BE)'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-semibold">Admission Year :</span>
                  <span className="font-bold text-slate-800">{studentProfile?.admissionYear || '2022'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-semibold">Roll Number :</span>
                  <span className="font-bold text-slate-800 font-mono">{studentProfile?.rollNo || '22CE045'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-semibold">Class :</span>
                  <span className="font-bold text-slate-800">{studentProfile?.class || 'BE Computer Engineering'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-semibold">Division :</span>
                  <span className="font-bold text-slate-800">{studentProfile?.division || 'A'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-400 font-semibold">Batch :</span>
                  <span className="font-bold text-slate-800">{studentProfile?.batch || '2022 - 2026'}</span>
                </div>
              </div>

              {/* Right Column: Profile Actions */}
              <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-slate-900 pb-1 border-b border-slate-200/80">
                  Profile Actions
                </h4>

                <div className="space-y-2.5">
                  <button
                    onClick={() => setShowCorrectionModal(true)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200/90 transition-all text-left text-xs font-semibold text-slate-800 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Edit className="w-3.5 h-3.5" />
                      </div>
                      <span>Request Correction</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </button>

                  <button
                    onClick={handleDownloadProfilePDF}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200/90 transition-all text-left text-xs font-semibold text-slate-800 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Download className="w-3.5 h-3.5" />
                      </div>
                      <span>Download Profile (PDF)</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('privacy');
                      else setShowHistoryModal(true);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200/90 transition-all text-left text-xs font-semibold text-slate-800 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span>View Access History</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('privacy');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200/90 transition-all text-left text-xs font-semibold text-slate-800 group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <span>Manage Consent</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Contact Details */}
        {activeSubTab === 'contact' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold block">Primary Registered Mobile</span>
                <p className="font-bold text-slate-900 text-sm">{studentProfile?.phone || '+91 98765 43210'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold block">Institutional Email</span>
                <p className="font-bold text-slate-900 text-sm font-mono">{studentProfile?.email || 'krushna.funde@college.edu'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 sm:col-span-2">
                <span className="text-slate-400 font-semibold block">Residential Address</span>
                <p className="font-bold text-slate-900 text-sm">{studentProfile?.address || 'Talegaon, Pune, Maharashtra 410506'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Emergency Contact */}
        {activeSubTab === 'emergency' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold block">Guardian / Contact Person</span>
                <p className="font-bold text-slate-900 text-sm">{studentProfile?.emergencyContact?.name || 'Ashok Funde'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold block">Relationship</span>
                <p className="font-bold text-slate-900 text-sm">{studentProfile?.emergencyContact?.relation || 'Father'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold block">Emergency Phone Number</span>
                <p className="font-bold text-slate-900 text-sm font-mono">{studentProfile?.emergencyContact?.phone || '+91 98221 99881'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold block">Emergency Address</span>
                <p className="font-bold text-slate-900 text-sm">{studentProfile?.emergencyContact?.address || 'Talegaon Dabhade, Pune 410506'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Other Information */}
        {activeSubTab === 'other' && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold block">Blood Group</span>
                <p className="font-bold text-slate-900 text-sm">{studentProfile?.bloodGroup || 'B+'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold block">Admission Category</span>
                <p className="font-bold text-slate-900 text-sm">{studentProfile?.admissionCategory || 'Open / CAP Merit'}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold block">Nationality / State</span>
                <p className="font-bold text-slate-900 text-sm">Indian / Maharashtra</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-slate-400 font-semibold block">Current Academic Standing</span>
                <p className="font-bold text-emerald-600 text-sm">Regular (No Active Backlogs)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Request Correction */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Request Profile Correction</h3>
                  <p className="text-[11px] text-slate-400">Exercise Right to Rectification under DPDP</p>
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
                  Field to Correct
                </label>
                <select
                  value={correctionForm.field}
                  onChange={(e) => {
                    const f = e.target.value;
                    let cur = studentProfile?.phone || '';
                    if (f === 'Address') cur = studentProfile?.address || '';
                    if (f === 'Emergency Contact') cur = studentProfile?.emergencyContact?.phone || '';
                    if (f === 'Blood Group') cur = studentProfile?.bloodGroup || '';
                    setCorrectionForm({ ...correctionForm, field: f, currentValue: cur });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="Phone Number">Primary Phone Number</option>
                  <option value="Address">Residential Address</option>
                  <option value="Emergency Contact">Emergency Contact Number</option>
                  <option value="Blood Group">Blood Group</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Current Value
                </label>
                <input
                  type="text"
                  disabled
                  value={correctionForm.currentValue}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Requested New Value
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter accurate new value..."
                  value={correctionForm.newValue}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, newValue: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Reason / Justification
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why this change is required..."
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
                  <span>Submit Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
