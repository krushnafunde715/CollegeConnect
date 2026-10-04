import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import {
  HelpCircle,
  BookOpen,
  Send,
  MessageSquare,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  FileText,
  LifeBuoy,
  CheckCircle2
} from 'lucide-react';

const FAQS = [
  {
    q: 'How does CollegeConnect enforce DPDP 2026 data isolation?',
    a: 'CollegeConnect uses cryptographic Argon2id password hashing, purpose-limited data views, and strict role scoping. Department Admins only see their department records; Class Teachers only access assigned class rosters; and sensitive contact or health information is never displayed in public directories.'
  },
  {
    q: 'Can Super Admin modify published examination marks?',
    a: 'No silent modifications are permitted. All result corrections must be formally submitted through the Result Correction Requests workflow in the Examination module, recording the reason, previous score, updated score, and reviewer audit timestamp.'
  },
  {
    q: 'How do students grant or revoke placement consent?',
    a: 'Students manage their data sharing preferences in the Student Privacy Center. When applying for specific recruitment drives, students provide purpose-limited consent allowing only shortlisted recruiters to view verified resumes.'
  },
  {
    q: 'What should I do if a faculty member is locked out of their account?',
    a: 'Super Admin or Department Admin can trigger a secure password reset link from the User Management module or unlock the account after verifying identity.'
  },
];

export function HelpSupportModule() {
  const [openFaq, setOpenFaq] = useState(0);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'System Configuration',
    priority: 'Normal',
    description: '',
  });
  const [submittedTickets, setSubmittedTickets] = useState([]);
  const { success, error } = useToast();

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.description.trim()) {
      error('Subject and Description are required to file a ticket.');
      return;
    }

    const newTicket = {
      id: `TCK-${Date.now().toString().slice(-4)}`,
      ...ticketForm,
      submittedAt: 'Just now',
      status: 'Open',
    };

    setSubmittedTickets([newTicket, ...submittedTickets]);
    setTicketForm({ subject: '', category: 'System Configuration', priority: 'Normal', description: '' });
    success(`Support Ticket #${newTicket.id} submitted to CollegeConnect IT Helpdesk.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Help, Documentation & Administrative Support</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            System operation manuals, security guidelines, institutional FAQs, and dedicated IT helpdesk dispatch.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: FAQs and Documentation (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" /> Frequently Asked Questions
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="py-3">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-slate-800 hover:text-indigo-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <p className="mt-2 text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick System Guides */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" /> Super Admin Standard Operating Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                <span className="font-bold text-slate-900">Academic Year Rollover</span>
                <p className="text-slate-500 text-[11px]">Instructions for cohort progression and archiving old semesters.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                <span className="font-bold text-slate-900">Role Privilege Assignment</span>
                <p className="text-slate-500 text-[11px]">Best practices for assigning Department and Exam Administrators.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Submit Ticket & IT Contact (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Submit Ticket Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" /> Report an Issue / Submit Ticket
            </h3>
            <form onSubmit={handleTicketSubmit} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="Brief summary of request..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
                  >
                    <option value="System Configuration">System Config</option>
                    <option value="Access & Permissions">Access & Permissions</option>
                    <option value="Data Correction">Data Correction</option>
                    <option value="Bug Report">Bug Report</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Describe the issue or required assistance..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Support Request
              </button>
            </form>

            {/* Submitted tickets list */}
            {submittedTickets.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-700 text-[11px] block">Recent Tickets Submitted:</span>
                {submittedTickets.map((t) => (
                  <div key={t.id} className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-[11px]">
                    <div>
                      <p className="font-bold text-emerald-950">{t.id}: {t.subject}</p>
                      <span className="text-emerald-700">{t.category} • {t.submittedAt}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white rounded font-bold text-[10px]">{t.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* IT Helpdesk Contact Card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xs space-y-3 text-xs">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-indigo-400" /> CollegeConnect IT Helpdesk
            </h3>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>support@collegeconnect.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>+91 20 6688 1299 (Ext: 104)</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>IT Infrastructure Cell, 2nd Floor, Administrative Wing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
