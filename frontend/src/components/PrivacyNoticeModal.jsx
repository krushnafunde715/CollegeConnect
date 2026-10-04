import React from 'react';
import { Modal } from './Modal';
import { Shield, CheckCircle, Clock, Lock, FileText } from 'lucide-react';

export function PrivacyNoticeModal({ isOpen, onClose }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="DPDP Student Personal Data Processing Notice"
      subtitle="Digital Personal Data Protection (DPDP) Principles & Transparency Overview"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 text-sm text-slate-600">
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 flex items-start gap-3 text-indigo-950">
          <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-indigo-900">Privacy-by-Design Architecture</h4>
            <p className="text-xs text-indigo-800/90 mt-1 leading-relaxed">
              CollegeConnect implements strict department isolation, purpose-limited data sharing, Argon2id encryption, and individual student ownership controls in alignment with DPDP principles.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            1. Purposes for Data Processing
          </h4>
          <p className="text-xs leading-relaxed">
            Your personal data (full name, institutional email, class enrollment, attendance, academic marks, and examination evaluations) is processed strictly for:
          </p>
          <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-700">
            <li>Academic curriculum instruction, attendance verification, and internal grading.</li>
            <li>Examination administration, hall ticket issuance, and university result transcripts.</li>
            <li>Campus recruitment and placement eligibility matching (with optional student consent).</li>
            <li>Statutory compliance, educational audits, and secure alumni records.</li>
          </ul>

          <h4 className="font-bold text-slate-900 flex items-center gap-2 pt-2">
            <Lock className="w-4 h-4 text-slate-600" />
            2. Purpose Limitation & Data Isolation
          </h4>
          <p className="text-xs leading-relaxed">
            Department Administrators are strictly isolated to their own academic division (e.g., Computer Engineering admins cannot view or alter IT student records). Faculty and Class Teachers only access enrolled rosters and cannot view unassigned classes or unmasked private home records. Placement recruiters receive purpose-limited summaries only.
          </p>

          <h4 className="font-bold text-slate-900 flex items-center gap-2 pt-2">
            <Clock className="w-4 h-4 text-slate-600" />
            3. Data Retention Period
          </h4>
          <p className="text-xs leading-relaxed">
            Personal data is retained during the active duration of institutional enrollment plus 5 years for statutory university transcripts and degree verification compliance, after which non-academic data is securely purged.
          </p>

          <h4 className="font-bold text-slate-900 flex items-center gap-2 pt-2">
            <CheckCircle className="w-4 h-4 text-slate-600" />
            4. Your Rights Under Privacy Principles
          </h4>
          <p className="text-xs leading-relaxed">
            You retain the right to access your stored records, request data correction for inaccurate entries through the Privacy Center, withdraw optional placement consents, and lodge inquiries directly with the Institutional Data Protection Officer.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </Modal>
  );
}
