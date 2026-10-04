import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { ExamAdminHeader } from '../components/ExamAdminHeader';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Send,
  BookOpen,
  MessageSquare,
  FileQuestion,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export function HelpSupportModule({ onNavigateTab }) {
  const { success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('FAQs'); // 'FAQs', 'User Guide', 'Contact Support'
  const [openFaq, setOpenFaq] = useState(0);

  // Ticket Form
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Marks Correction',
    message: '',
  });

  const faqs = [
    {
      q: 'How to create a new examination?',
      a: 'Navigate to Exam Management, click "+ Create Examination", fill in the examination title, target semester, curricular scheme pattern (e.g. SPPU 2019 Course Pattern), and click "Create Examination". You can subsequently configure specific session timetable slots in the Exam Schedule module.',
    },
    {
      q: 'How to enter internal marks?',
      a: 'Go to Internal Marks from the sidebar. Select your target class (SE, TE, or BE), subject (e.g. Data Structures), and test type. Enter continuous assessment marks directly in the editable fields (validated up to 20 or 25 marks), and click the "Save Marks" button at the top right to commit the marksheet.',
    },
    {
      q: 'How to publish results?',
      a: 'Open the Results Management module. Locate the completed examination record marked as "Draft" and click the "Publish Results" button or the send icon in the table. Review the provisional marksheet gazette in the modal preview, then click "Confirm & Publish" to push GPA transcripts to the student portal.',
    },
    {
      q: 'How to generate hall tickets?',
      a: 'Open Hall Tickets from the sidebar. Choose the target cohort and exam, then click "Generate Hall Tickets". The system will batch-generate verifiable hall tickets with QR admission seals, student photos, and scheduled session timetables. You can preview and print individual tickets using the preview action.',
    },
    {
      q: 'How to view examination reports?',
      a: 'Open the Examination Reports module. Switch between tabs for Result Analysis, Class-wise Performance, Subject Analysis, and Pass Percentage. Use the filters to choose your semester and click "Generate Report" or "Export PDF" for NAAC/NBA accreditation summaries.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      error('Please complete all required ticket fields.');
      return;
    }
    success('Support request ticket submitted to Controller of Examinations IT cell.');
    setTicketForm({ subject: '', category: 'Marks Correction', message: '' });
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. Header */}
      <ExamAdminHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search examination help topics..."
        onNavigateTab={onNavigateTab}
      />

      {/* 2. Main Page Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Help &amp; Support</h1>
            <p className="text-xs text-slate-500">Get assistance for examination-related queries and SOPs</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            Central Examination Helpdesk
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl w-fit">
          {['FAQs', 'User Guide', 'Contact Support'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#6B46FE] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB 1: FAQS */}
        {activeTab === 'FAQs' && (
          <div className="space-y-3 pt-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs (e.g. create exam, publish results, hall tickets)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
            </div>

            <div className="space-y-2 pt-2">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-all bg-slate-50/50"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-4 py-3 text-left font-bold text-xs text-slate-900 flex items-center justify-between gap-3 hover:bg-slate-100/60 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <FileQuestion className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>{faq.q}</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/70 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: USER GUIDE */}
        {activeTab === 'User Guide' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Scheduling &amp; Timetables</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Configure exam session slots, assign hall venues, and avoid timetable conflicts for concurrent batches.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Internal Marks &amp; Moderation</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Validate and moderate continuous internal assessment marks submitted by class faculty before locking marksheets.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-xs">Gazette &amp; Publication</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Review provisional grade transcripts, verify SHA-256 seals, and publish official semester results.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT SUPPORT */}
        {activeTab === 'Contact Support' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Submit an Examination Support Request</h3>
              <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subject / Issue Title *</label>
                  <input
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    placeholder="e.g. Discrepancy in TE Operating Systems internal marks lock"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Marks Correction">Marks Correction / Re-evaluation</option>
                    <option value="Timetable Conflict">Timetable / Seating Conflict</option>
                    <option value="Hall Ticket Issue">Hall Ticket Generation Error</option>
                    <option value="Technical Support">Technical Portal Bug</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Message Details *</label>
                  <textarea
                    rows={4}
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                    placeholder="Describe the issue with candidate PRN, class, or examination details..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Support Ticket
                </button>
              </form>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Direct Support Channels</h3>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span>exam.support@nmiet.edu.in</span>
                </div>
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Phone className="w-4 h-4 text-indigo-600" />
                  <span>+91 2114 282000 (Ext: 204)</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  Examination Cell Coordinator Office: Main Academic Building, 2nd Floor, Room 208.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
