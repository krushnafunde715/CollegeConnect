import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/Badge';
import {
  Settings,
  Building2,
  BookOpen,
  Shield,
  Lock,
  Save,
  CheckCircle2,
  FileCheck2,
  Clock,
  ShieldCheck,
  KeyRound,
  Server,
  AlertTriangle
} from 'lucide-react';

export function SystemSettingsModule() {
  const [activeSection, setActiveSection] = useState('profile'); // 'profile', 'academic', 'security', 'privacy'
  const { success } = useToast();

  // Profile Form
  const [profile, setProfile] = useState({
    collegeName: 'CollegeConnect Institute of Technology',
    collegeCode: 'CCIT-PUNE-01',
    university: 'Savitribai Phule Pune University (SPPU)',
    aicteCode: '1-3329091811',
    address: 'Survey No. 34, Sector 2, Knowledge Park, Hinjawadi Phase 1, Pune, MH - 411057',
    contactEmail: 'contact@collegeconnect.edu',
    phone: '+91 20 6688 1200',
    website: 'https://collegeconnect.edu',
  });

  // Academic Config
  const [academicConfig, setAcademicConfig] = useState({
    currentYear: '2026-27',
    semesterSystem: 'Bi-Annual (Odd/Even Semesters)',
    minAttendancePercent: 75,
    internalWeightage: 30,
    externalWeightage: 70,
    passingThresholdPercent: 40,
    creditSystem: 'Choice Based Credit System (CBCS)',
  });

  // Security Policy
  const [securityPolicy, setSecurityPolicy] = useState({
    passwordHasher: 'Argon2id (Memory: 65536 KB, Iterations: 3)',
    minPasswordLength: 10,
    requireSpecialChar: true,
    requireNumber: true,
    sessionTimeoutMinutes: 60,
    mfaEnforcedForAdmins: true,
    maxFailedAttempts: 5,
    lockoutDurationMinutes: 15,
  });

  // Privacy & Governance
  const [privacyGovernance, setPrivacyGovernance] = useState({
    dpoName: 'Dr. S. Kulkarni',
    dpoEmail: 'dpo@collegeconnect.edu',
    dpoContact: '+91 20 6688 1201',
    privacyNoticeVersion: 'v2026.2 (Updated Aug 2026)',
    dataRetentionYears: 7,
    consentRenewalPeriodMonths: 12,
    auditTrailImmutable: true,
    purposeLimitationEnforced: true,
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    success('Institution profile parameters updated.');
  };

  const handleSaveAcademic = (e) => {
    e.preventDefault();
    success('Academic configuration committed institutional-wide.');
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    success('Security policies and Argon2id session parameters saved.');
  };

  const handleSavePrivacy = (e) => {
    e.preventDefault();
    success('DPDP 2026 governance configuration and retention schedules updated.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Settings className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">System Configuration & Parameters</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Institutional attributes, academic frameworks, cryptographic security settings, and DPDP governance rules.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-1.5 flex gap-1.5 overflow-x-auto text-xs font-bold">
        {[
          { id: 'profile', label: 'Institution Profile', icon: Building2 },
          { id: 'academic', label: 'Academic Configuration', icon: BookOpen },
          { id: 'security', label: 'Security & Cryptography', icon: Lock },
          { id: 'privacy', label: 'Privacy & Data Governance (DPDP)', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === tab.id
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
      {/* SECTION 1: INSTITUTION PROFILE                                            */}
      {/* ========================================================================= */}
      {activeSection === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Institutional Identity & Contacts</h3>
            <p className="text-[11px] text-slate-500">Official college credentials displayed across student receipts, grade cards, and notices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">College Name *</label>
              <input
                type="text"
                value={profile.collegeName}
                onChange={(e) => setProfile({ ...profile, collegeName: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Institutional Code *</label>
              <input
                type="text"
                value={profile.collegeCode}
                onChange={(e) => setProfile({ ...profile, collegeCode: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Affiliated University</label>
              <input
                type="text"
                value={profile.university}
                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">AICTE Approval Code</label>
              <input
                type="text"
                value={profile.aicteCode}
                onChange={(e) => setProfile({ ...profile, aicteCode: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Campus Physical Address</label>
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Email</label>
              <input
                type="email"
                value={profile.contactEmail}
                onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Helpline Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Website</label>
              <input
                type="text"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: ACADEMIC CONFIGURATION                                         */}
      {/* ========================================================================= */}
      {activeSection === 'academic' && (
        <form onSubmit={handleSaveAcademic} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Academic Structure & Grading Thresholds</h3>
            <p className="text-[11px] text-slate-500">Evaluation weights and mandatory attendance rules enforced by exam engine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Active Academic Year</label>
              <input
                type="text"
                value={academicConfig.currentYear}
                onChange={(e) => setAcademicConfig({ ...academicConfig, currentYear: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Semester Structure</label>
              <input
                type="text"
                value={academicConfig.semesterSystem}
                onChange={(e) => setAcademicConfig({ ...academicConfig, semesterSystem: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Minimum Attendance % Required</label>
              <input
                type="number"
                value={academicConfig.minAttendancePercent}
                onChange={(e) => setAcademicConfig({ ...academicConfig, minAttendancePercent: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Under 75% marks hall ticket as conditionally blocked</span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Internal Exam Weight %</label>
              <input
                type="number"
                value={academicConfig.internalWeightage}
                onChange={(e) => setAcademicConfig({ ...academicConfig, internalWeightage: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">External Exam Weight %</label>
              <input
                type="number"
                value={academicConfig.externalWeightage}
                onChange={(e) => setAcademicConfig({ ...academicConfig, externalWeightage: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Academic Configuration
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: SECURITY & CRYPTOGRAPHY                                        */}
      {/* ========================================================================= */}
      {activeSection === 'security' && (
        <form onSubmit={handleSaveSecurity} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Authentication Security & Session Governance</h3>
            <p className="text-[11px] text-slate-500">Argon2id cryptographic parameters and session timeout thresholds.</p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-indigo-600" /> Password Hashing Algorithm
            </span>
            <p className="text-slate-600 font-mono text-[11px]">{securityPolicy.passwordHasher}</p>
            <p className="text-[10px] text-slate-400">OWASP recommended memory-hard hashing resistant to GPU brute force.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">JWT Session Access Token Lifetime (Minutes)</label>
              <input
                type="number"
                value={securityPolicy.sessionTimeoutMinutes}
                onChange={(e) => setSecurityPolicy({ ...securityPolicy, sessionTimeoutMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Max Failed Login Attempts Before Lockout</label>
              <input
                type="number"
                value={securityPolicy.maxFailedAttempts}
                onChange={(e) => setSecurityPolicy({ ...securityPolicy, maxFailedAttempts: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={securityPolicy.mfaEnforcedForAdmins}
                onChange={(e) => setSecurityPolicy({ ...securityPolicy, mfaEnforcedForAdmins: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              Enforce Multi-Factor Authentication (MFA) for Administrative Roles
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Commit Security Policies
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: PRIVACY & DATA GOVERNANCE (DPDP)                               */}
      {/* ========================================================================= */}
      {activeSection === 'privacy' && (
        <form onSubmit={handleSavePrivacy} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">DPDP 2026 Institutional Compliance Governance</h3>
            <p className="text-[11px] text-slate-500">Data Protection Officer contact parameters and purpose-limitation schedules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Designated Data Protection Officer (DPO)</label>
              <input
                type="text"
                value={privacyGovernance.dpoName}
                onChange={(e) => setPrivacyGovernance({ ...privacyGovernance, dpoName: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">DPO Grievance Email</label>
              <input
                type="email"
                value={privacyGovernance.dpoEmail}
                onChange={(e) => setPrivacyGovernance({ ...privacyGovernance, dpoEmail: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Current Privacy Notice Version</label>
              <input
                type="text"
                value={privacyGovernance.privacyNoticeVersion}
                onChange={(e) => setPrivacyGovernance({ ...privacyGovernance, privacyNoticeVersion: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Academic Data Retention Period (Years)</label>
              <input
                type="number"
                value={privacyGovernance.dataRetentionYears}
                onChange={(e) => setPrivacyGovernance({ ...privacyGovernance, dataRetentionYears: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Statutory retention period for graduate degree verification</span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Consent Renewal Interval (Months)</label>
              <input
                type="number"
                value={privacyGovernance.consentRenewalPeriodMonths}
                onChange={(e) => setPrivacyGovernance({ ...privacyGovernance, consentRenewalPeriodMonths: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
              />
            </div>
          </div>

          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1">
            <span className="font-bold text-indigo-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Immutable Append-Only Audit Logging
            </span>
            <p className="text-[11px] text-indigo-800">
              Audit trails are cryptographically locked and append-only. No administrative actor or system script may delete or truncate audit records.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Governance Configuration
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
