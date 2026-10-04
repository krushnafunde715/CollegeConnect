import React, { useState } from 'react';
import { PlacementAdminHeader } from '../components/PlacementAdminHeader';
import {
  HelpCircle,
  BookOpen,
  Shield,
  Send,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export function PlacementHelpSupportModule({ onNavigateTab }) {
  const { success } = useToast();
  const [activeTab, setActiveTab] = useState('faqs');
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Ticket Form
  const [ticketData, setTicketData] = useState({
    subject: '',
    category: 'Placement Drive Scheduling',
    priority: 'Normal',
    message: '',
  });

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    success('Support ticket submitted successfully. Reference ID #TNP-9042');
    setTicketData({
      subject: '',
      category: 'Placement Drive Scheduling',
      priority: 'Normal',
      message: '',
    });
  };

  const faqs = [
    {
      q: 'How to initiate and broadcast a new On-Campus Placement Drive?',
      a: 'Navigate to "Placement Drives", click "+ Create Placement Drive", specify eligibility criteria (CGPA cutoff, allowed branches), set online test and interview dates, then click Save. The system will automatically notify eligible students.',
    },
    {
      q: 'How does DPDP consent enforcement protect candidate resumes?',
      a: 'Under the Digital Personal Data Protection (DPDP) Act, candidate contact info and resumes are securely encrypted. Only verified corporate recruiters with signed MoUs can access candidate resumes after student explicit consent.',
    },
    {
      q: 'How are multi-offer policies managed in CollegeConnect?',
      a: 'Once a candidate accepts an offer in the "Super Dream" or "Dream" category, their profile automatically switches to "Placed" to allow unplaced peers priority access to standard drives according to institutional placement policy.',
    },
    {
      q: 'How do I generate official NIRF / NAAC annual placement gazettes?',
      a: 'Open the "Reports" module, select the target academic year, and click "Download NIRF Report". The resulting document includes cryptographically verified placement metrics and company offer logs.',
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <PlacementAdminHeader
        placeholder="Search placement SOPs, DPDP guidelines, or help topics..."
        onNavigateTab={onNavigateTab}
      />

      {/* Page Title Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" /> Support &amp; Knowledge Base
            </span>
            <span className="text-xs text-slate-500 font-medium">Placement Officer Desk</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Help, SOPs &amp; Technical Support</h1>
          <p className="text-xs text-slate-500">
            Official guidelines for placement coordinators, DPDP privacy protocols, recruitment rules, and helpdesk.
          </p>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'faqs', label: 'Frequently Asked Questions', icon: HelpCircle },
          { id: 'dpdp', label: 'DPDP Privacy Architecture', icon: Shield },
          { id: 'ticket', label: 'Contact IT Support Desk', icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Placement Coordination Knowledge Base</h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                      className="w-full p-4 text-left flex items-center justify-between bg-slate-50/60 hover:bg-slate-100/60 cursor-pointer"
                    >
                      <span className="font-bold text-xs text-slate-900">{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-purple-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DPDP Privacy Architecture */}
      {activeTab === 'dpdp' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Digital Personal Data Protection (DPDP) Standard</h3>
              <p className="text-slate-500">Placement Office Compliance Guidelines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2">
              <h4 className="font-bold text-purple-900 text-xs">1. Purpose Limitation &amp; Student Consent</h4>
              <p className="text-slate-600 leading-relaxed">
                Student academic and contact details collected by the Training &amp; Placement Office are strictly restricted
                to recruitment and career enablement. Data is never shared with third-party advertising or non-recruitment entities.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
              <h4 className="font-bold text-emerald-900 text-xs">2. Role-Based Access Controls (RBAC)</h4>
              <p className="text-slate-600 leading-relaxed">
                Recruiter HR personnel only receive access to candidate resumes if the candidate explicitly registers for the
                associated company drive. Access is auto-revoked after drive conclusion.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Contact Support */}
      {activeTab === 'ticket' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs max-w-2xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Submit IT &amp; Placement Portal Support Ticket</h3>
            <p className="text-xs text-slate-500">Our administrative technical team responds within 2 business hours.</p>
          </div>

          <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Issue Subject *</label>
              <input
                type="text"
                required
                placeholder="e.g. Drive registration link issue for BE IT batch"
                value={ticketData.subject}
                onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category *</label>
                <select
                  value={ticketData.category}
                  onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                >
                  <option value="Placement Drive Scheduling">Placement Drive Scheduling</option>
                  <option value="Resume Download / Storage">Resume Download / Storage</option>
                  <option value="Student Profile Discrepancy">Student Profile Discrepancy</option>
                  <option value="Portal Access Permission">Portal Access Permission</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Priority</label>
                <select
                  value={ticketData.priority}
                  onChange={(e) => setTicketData({ ...ticketData, priority: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent (Drive Ongoing)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Description *</label>
              <textarea
                required
                rows={4}
                placeholder="Provide detailed description of the query or technical issue..."
                value={ticketData.message}
                onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" /> Submit Support Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
