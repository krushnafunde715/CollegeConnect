import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import {
  HelpCircle,
  Search,
  BookOpen,
  FileCheck2,
  CalendarCheck,
  Megaphone,
  Shield,
  UserCheck,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  Mail,
  Send,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export function TeacherHelpSupport() {
  const { success, info } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState(1);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'Attendance Support',
    priority: 'Normal',
    message: '',
  });

  const quickTopics = [
    {
      id: 'attendance',
      title: 'Using Attendance',
      desc: 'Learn how to mark and manage class attendance',
      icon: CalendarCheck,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      details: 'Class Teachers can mark daily attendance for their assigned class and permitted subjects. Mark Present, Absent, Late, or On Leave, and save to calculate aggregate percentages automatically.',
    },
    {
      id: 'requests',
      title: 'Managing Requests',
      desc: 'How to review and respond to student requests',
      icon: FileCheck2,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      details: 'Review profile updates, medical leave, and attendance dispute requests from your students. You can Approve, Forward to HOD/Exam Dept, Reject, or put them Under Review with remarks.',
    },
    {
      id: 'academics',
      title: 'Academic Records',
      desc: 'Understanding permitted academic data',
      icon: BookOpen,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      details: 'Access internal marks, semester assessments, and performance summaries strictly for your assigned division. Analyze subject-wise passing trends and identify students requiring remedial assistance.',
    },
    {
      id: 'announcements',
      title: 'Announcements',
      desc: 'How to create and manage announcements',
      icon: Megaphone,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      details: 'Broadcast official academic notices, exam circulars, and event schedules to your class. Select targeted batches or whole divisions with full audit tracking.',
    },
    {
      id: 'privacy',
      title: 'Privacy & Data Access',
      desc: 'Know what data you can access & DPDP',
      icon: Shield,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      details: 'Under DPDP Principles, student personal data (such as emergency contacts and health records) is masked. All read and write operations are permanently logged to the Access History audit trail.',
    },
    {
      id: 'account',
      title: 'Account & Login',
      desc: 'Login issues and account settings',
      icon: UserCheck,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      details: 'Manage institutional credentials, two-factor authentication, and password reset requests. Contact the College Super Admin for role scope adjustments.',
    },
  ];

  const faqs = [
    {
      id: 1,
      q: 'What information can I access as a Class Teacher?',
      a: 'As a Class Teacher, you are authorized to access the student directory, attendance register, internal marks, and student requests strictly for your assigned class (TE Computer Engineering – Division A). Department-wide administrative data is restricted.',
    },
    {
      id: 2,
      q: 'How to mark attendance and correct historical records?',
      a: 'Navigate to the Attendance tab, select the date and subject, and use the toggle buttons to record status. For past date corrections, submit an authorized correction or process a student-initiated attendance waiver request.',
    },
    {
      id: 3,
      q: 'How to respond to student requests?',
      a: 'Go to the Student Requests tab, click "View" on any pending request, review the submitted justification, add your review notes, and click "Approve", "Forward to HOD", or "Reject".',
    },
    {
      id: 4,
      q: 'How to handle academic record discrepancies?',
      a: 'If a student reports an internal test mark addition error, verify the physical marksheet and update the continuous evaluation score in the Academic Records interface.',
    },
    {
      id: 5,
      q: 'What are the DPDP guidelines for student privacy?',
      a: 'The system enforces Section 8 of the DPDP Act 2023. Student phone numbers are masked, purpose limitation is enforced for data access, and all queries generate immutable audit log entries.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setShowContactModal(false);
    success('Support ticket submitted to Academic Department IT Desk. Ticket ID: #TCH-2026-9481');
    setContactForm({ subject: '', category: 'Attendance Support', priority: 'Normal', message: '' });
  };

  const handleDownloadUserGuide = () => {
    const textContent = `COLLEGECONNECT - CLASS TEACHER USER GUIDE (AY 2026-27)\n` +
      `Role: Class Teacher (Prof. Sonal Kadam)\n` +
      `Assigned Class: TE Computer Engineering - Division A\n\n` +
      `1. Attendance: Mark daily subject registers and monitor 75% threshold.\n` +
      `2. Academic Records: Record internal continuous evaluation and review performance.\n` +
      `3. Student Requests: Process student profile updates and attendance waivers.\n` +
      `4. DPDP Compliance: Strictly respect data minimization and purpose limitation.`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CollegeConnect_Class_Teacher_Guide.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    success('User guide downloaded.');
  };

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Module Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Help & Support</h1>
            <p className="text-xs text-slate-500 font-medium">
              Get assistance and find answers to common questions.
            </p>
          </div>
        </div>

        {/* Global Help Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help articles, guides, or keywords..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20"
          />
        </div>
      </div>

      {/* 2. Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols): Quick Topics & FAQ */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick Help Topics */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3.5">
            <h2 className="text-sm font-bold text-slate-900">Quick Help Topics</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-3.5 rounded-2xl border transition-all hover:shadow-2xs cursor-pointer flex items-start gap-3 bg-white hover:border-blue-300`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${topic.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{topic.title}</h3>
                      <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{topic.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h2>

            <div className="space-y-2">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-slate-200/80 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 bg-white hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 py-3 bg-slate-50/60 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Contact Support & User Guide matching reference */}
        <div className="space-y-5">
          {/* Still Need Help Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Still Need Help?</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              If you have any issues or need further assistance, connect with our IT support desk.
            </p>
            <button
              onClick={() => setShowContactModal(true)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </button>
          </div>

          {/* Download User Guide Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Download User Guide</h3>
                <p className="text-[11px] text-slate-400 font-medium">PDF Guide for Class Teachers</p>
              </div>
            </div>

            <button
              onClick={handleDownloadUserGuide}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Guide</span>
            </button>
          </div>

          {/* Quick FAQ List Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">FAQ</h3>
            <div className="space-y-2 text-xs text-slate-600">
              {faqs.slice(0, 3).map((f) => (
                <div
                  key={f.id}
                  onClick={() => setOpenFaqId(f.id)}
                  className="p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-2"
                >
                  <span className="text-blue-600 font-bold">•</span>
                  <span className="hover:text-blue-600">{f.q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${selectedTopic.color}`}>
                  <selectedTopic.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{selectedTopic.title}</h3>
                  <p className="text-xs text-slate-500">Class Teacher Guide</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTopic(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed p-4 bg-slate-50 rounded-2xl border border-slate-100">
              {selectedTopic.details}
            </p>

            <button
              onClick={() => setSelectedTopic(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Contact Support Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Contact IT Support Desk</h3>
                  <p className="text-xs text-slate-500">Academic & Faculty Assistance</p>
                </div>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="Brief summary of your query or issue..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white cursor-pointer"
                  >
                    <option value="Attendance Support">Attendance Support</option>
                    <option value="Academic Records">Academic Records</option>
                    <option value="Student Requests">Student Requests</option>
                    <option value="Account & Login">Account & Login</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={contactForm.priority}
                    onChange={(e) => setContactForm({ ...contactForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white cursor-pointer"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Message Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Provide detailed description of the error or assistance needed..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
