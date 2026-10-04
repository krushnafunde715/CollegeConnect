import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import {
  HelpCircle,
  BookOpen,
  Send,
  MessageSquare,
  Shield,
  ChevronDown,
  ChevronUp,
  UserCheck,
  FileCheck2,
  PhoneCall,
  Mail,
  CheckCircle2,
  Search,
  FileText,
  LifeBuoy,
  Layers,
  GraduationCap
} from 'lucide-react';

export function CompEngHelpSupport({
  departmentName = 'Computer Engineering',
}) {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState('faqs'); // 'faqs', 'guide', 'contact'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(0);

  const [ticket, setTicket] = useState({
    category: 'Student Data Correction',
    priority: 'medium',
    subject: '',
    description: '',
  });

  const faqs = [
    {
      q: 'How do I designate an official Class Teacher for a division?',
      a: 'Navigate to the Faculty tab, click "Assign Class / Subject", select the faculty member (e.g., Dr. K. Verma), select the target division (e.g. SE A), specify their primary subject, and tick "Designate as Official Class Teacher". This unlocks attendance taking and internal marks editing privileges for that teacher.',
      category: 'Faculty & Classes',
    },
    {
      q: 'What are my DPDP Act 2026 obligations regarding Student PII?',
      a: 'Under DPDP Act 2026 principles, student Date of Birth, Home Addresses, and Guardian Emergency Contacts are classified as protected personal data. They are masked by default on student tables and should only be unmasked when strictly required for official administrative or emergency reasons.',
      category: 'DPDP Privacy',
    },
    {
      q: 'How do DPDP Student Rectification requests work?',
      a: 'When a student submits a profile correction request (such as a name spelling fix or blood group update), it appears in the Academic Management -> DPDP Rectifications module. Approving the request updates the database and creates an immutable audit trail entry.',
      category: 'DPDP Privacy',
    },
    {
      q: 'Can Computer Engineering Department Admins access other departments?',
      a: 'No. Strict departmental scoping is enforced by role-based authorization in CollegeConnect. You can only view, manage, and provision students, faculty, and classes belonging to the Computer Engineering department.',
      category: 'Access Control',
    },
    {
      q: 'How are attendance percentages calculated across divisions?',
      a: 'Attendance is calculated as (Attended Sessions / Total Conducted Sessions) * 100 per student. Students falling below 75% are automatically flagged as Defaulters / Critical on both Department Admin and Class Teacher dashboards.',
      category: 'Attendance & Marks',
    },
    {
      q: 'How do I export class-wise student reports in CSV or PDF formats?',
      a: 'Go to the Reports & Analytics tab, select the required Report Type (Student, Attendance, Performance, or Faculty), choose the Academic Year and Division filter, and click "Export CSV" or "Export PDF".',
      category: 'Reports & Data',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    success('Support ticket submitted successfully to the IT & College Admin Desk.');
    setTicket({
      category: 'Student Data Correction',
      priority: 'medium',
      subject: '',
      description: '',
    });
  };

  const userGuides = [
    {
      title: 'Managing Computer Engineering Students',
      desc: 'Step-by-step guide to enrolling new students, searching by PRN, updating cohort status, and managing DPDP consent.',
      steps: [
        'Open the Students tab from the left sidebar.',
        'Click "+ Add Student" to register a single student or use the CSV bulk upload feature.',
        'Assign the student to their designated division (e.g. SE A, SE B, TE A).',
        'Verify that the student account is marked Active and enrolled in the current academic year.',
      ],
    },
    {
      title: 'Division & Class Teacher Assignment',
      desc: 'Allocating faculty members as class teachers and assigning subject curriculums.',
      steps: [
        'Navigate to the Class Records tab to view all 6 Computer Engineering divisions.',
        'Click on any division tile (e.g. SE A) to inspect enrolled students and assigned teachers.',
        'Under Division Management, assign or replace the designated Class Teacher.',
        'Changes take effect immediately across faculty and student portals.',
      ],
    },
    {
      title: 'Internal Marks & Examination Audit',
      desc: 'Recording Unit Test scores, verifying internal assessments, and publishing results.',
      steps: [
        'Navigate to the Exams & Internal Marks module.',
        'Select the target Subject (e.g. CC201 Data Structures) and Exam Type (Unit Test 1 / Unit Test 2).',
        'Review scores entered by faculty or click "Edit Marks" to update scores directly.',
        'Once complete, click "Publish to Students" to make internal scores visible on student dashboards.',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Help & Department Admin Support
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Operating guides, DPDP compliance guidelines, and direct IT support desk for {departmentName}.
            </p>
          </div>
        </div>

        {/* Sub-Tabs (Screen 9 Reference) */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-[#635BFF] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-[#635BFF] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>User Operating Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-[#635BFF] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Contact IT Support</span>
          </button>
        </div>

        {/* Search Input */}
        {activeTab === 'faqs' && (
          <div className="relative pt-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help questions by topic or keyword (e.g., DPDP, attendance, class teacher)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        )}
      </div>

      {/* Tab 1: FAQs Accordion (Screen 9 Reference) */}
      {activeTab === 'faqs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                No matching FAQ topics found.
              </div>
            ) : (
              filteredFaqs.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full p-4 text-left bg-white hover:bg-slate-50 flex items-center justify-between gap-3 text-xs font-bold text-slate-800 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      <span>{item.q}</span>
                    </div>
                    {expandedFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-4 pb-4 pt-1 bg-slate-50/60 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                      <p>{item.a}</p>
                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Category: <strong className="text-slate-600">{item.category}</strong></span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified Official Guide
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Quick Help Contacts Box */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Department IT Desk
              </h3>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>helpdesk.comp@college.edu</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Ext: +91 (020) 2432-8812</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>DPDP DPO: privacy@college.edu</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs space-y-1 text-indigo-950">
              <div className="font-bold flex items-center gap-1.5 text-indigo-900">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>DPDP Act 2026 Ready</span>
              </div>
              <p className="text-[11px] text-indigo-800/80 leading-relaxed">
                All administrative modifications and data exports are cryptographically logged with user identity and timestamp.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User Operating Guide */}
      {activeTab === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userGuides.map((guide, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{guide.title}</h3>
                <p className="text-xs text-slate-500">{guide.desc}</p>
                <div className="space-y-2 pt-2">
                  {guide.steps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Contact IT Support Ticket Form */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs max-w-2xl">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Submit an IT or Administrative Ticket</h3>
          <p className="text-xs text-slate-500 mb-4">
            Directly notify the Super Admin or Central IT Infrastructure team for issues requiring elevated permissions.
          </p>

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Issue Category
                </label>
                <select
                  value={ticket.category}
                  onChange={(e) => setTicket({ ...ticket, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Student Data Correction">Student Data Correction</option>
                  <option value="Faculty Assignment Issue">Faculty Assignment Issue</option>
                  <option value="DPDP Privacy Request">DPDP Privacy Request</option>
                  <option value="System Bug / UI Glitch">System Bug / UI Glitch</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Priority
                </label>
                <select
                  value={ticket.priority}
                  onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="low">Low (General Inquiry)</option>
                  <option value="medium">Medium (Standard Request)</option>
                  <option value="high">High (Urgent Attention)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subject
              </label>
              <input
                type="text"
                value={ticket.subject}
                onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                placeholder="e.g. Need division capacity increment for SE A"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description & Details
              </label>
              <textarea
                rows={4}
                value={ticket.description}
                onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                placeholder="Provide details about the issue, student PRN, or error encountered..."
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
