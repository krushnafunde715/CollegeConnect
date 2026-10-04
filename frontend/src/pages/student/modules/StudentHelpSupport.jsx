import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Mail,
  Phone,
  Shield,
  Send,
  CheckCircle2,
  BookOpen,
  Calendar,
  Briefcase,
  AlertCircle,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { StudentHeader } from '../components/StudentHeader';

export function StudentHelpSupport({ onNavigateTab }) {
  const { success } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [submittedTickets, setSubmittedTickets] = useState([
    { id: 'TKT-882901', subject: 'Query regarding Hall Ticket Room Allocation', category: 'Examination', status: 'In Review', date: 'Aug 24, 2024' }
  ]);
  const [ticketData, setTicketData] = useState({
    category: 'academic',
    subject: '',
    message: '',
  });

  const faqs = [
    {
      category: 'Profile & DPDP',
      question: 'How do I update my registered mobile number or address?',
      answer:
        'Under DPDP Section 12 (Right to Correction), navigate to the "Privacy Center" or "My Profile" tab and click "Edit Request". Your Class Teacher (Prof. Amit Sharma) and Department Admin will review and verify the request before updating records.',
    },
    {
      category: 'Academics',
      question: 'What is the minimum attendance requirement for semester eligibility?',
      answer:
        'A minimum of 75% attendance is required across all theory and practical courses to be eligible to appear for the End Semester Examinations as per university guidelines.',
    },
    {
      category: 'Examination',
      question: 'How do I download my official Digital Hall Ticket / Admit Card?',
      answer:
        'Go to the "Examination" tab and switch to "Hall Ticket". Once approved by the Examination Admin, you can view and download your cryptographically signed admit card.',
    },
    {
      category: 'Placement',
      question: 'Can I withdraw my application from a campus recruitment drive?',
      answer:
        'Applications can be modified or withdrawn up until the stated registration deadline. Once the drive shortlist is published by the Placement Department Admin, applications are locked.',
    },
    {
      category: 'DPDP Privacy',
      question: 'How is my personal and academic data protected on CollegeConnect?',
      answer:
        'CollegeConnect strictly follows Digital Personal Data Protection (DPDP) principles with role-based access control, cryptographic verification for official documents, purpose-limited data sharing, and full audit trails visible in your Privacy Center.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    const newId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newEntry = {
      id: newId,
      subject: ticketData.subject,
      category: ticketData.category,
      status: 'Submitted',
      date: 'Just now'
    };
    setSubmittedTickets([newEntry, ...submittedTickets]);
    success(`Support Ticket ${newId} created successfully. Our team will respond shortly.`);
    setTicketData({
      category: 'academic',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. TOP NAVBAR */}
      <StudentHeader onNavigateTab={onNavigateTab} />

      {/* 2. MODULE HEADER BANNER */}
      <div className="bg-white rounded-2xl px-5 py-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">Help & Support</h1>
            <p className="text-xs text-slate-500 font-medium">
              Find answers to frequently asked questions or submit an inquiry
            </p>
          </div>
        </div>
      </div>

      {/* 3. QUICK CONTACT DESKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Academic & Faculty Desk</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Prof. Sonal Kadam (Class Teacher - TE Comp A)
          </p>
          <div className="pt-1 text-[11px] text-blue-600 font-semibold flex items-center gap-1 font-mono">
            <Mail className="w-3 h-3" /> sonal.kadam@comp.nmiet.edu.in
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Placement Cell Desk</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Prof. Satyajit Sirsat (Placement Department Admin)
          </p>
          <div className="pt-1 text-[11px] text-purple-600 font-semibold flex items-center gap-1 font-mono">
            <Mail className="w-3 h-3" /> satyajit.sirsat@placement.nmiet.edu.in
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900">Privacy & DPO Inquiries</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Institutional Data Protection Officer (DPDP)
          </p>
          <div className="pt-1 text-[11px] text-emerald-600 font-semibold flex items-center gap-1 font-mono">
            <Mail className="w-3 h-3" /> dpo@college.edu
          </div>
        </div>
      </div>

      {/* 4. MAIN FAQ & TICKET SUBMISSION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* FAQ Accordion (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h3>
                <p className="text-xs text-slate-400">Quick answers on common student queries</p>
              </div>

              <div className="relative min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-blue-600/20 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 bg-slate-50/60 hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                          {faq.category}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{faq.question}</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 py-3 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Support Ticket Submission Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Submit a Help Ticket</h3>
              <p className="text-xs text-slate-400">Direct inquiry to department helpdesk administrators</p>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Department / Topic
                </label>
                <select
                  value={ticketData.category}
                  onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                >
                  <option value="Academic">Academic & Attendance</option>
                  <option value="Examination">Examination & Results</option>
                  <option value="Placement">Campus Placement & Drives</option>
                  <option value="Privacy">DPDP Privacy & Data Rights</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="Summary of issue..."
                  value={ticketData.subject}
                  onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Message Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue in detail..."
                  value={ticketData.message}
                  onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Support Ticket</span>
              </button>
            </form>

            {/* Submitted Ticket Status */}
            {submittedTickets.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Your Recent Tickets</span>
                {submittedTickets.map((t) => (
                  <div key={t.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-blue-600 text-[10px]">{t.id}</span>
                      <p className="font-bold text-slate-800 truncate max-w-[180px]">{t.subject}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
