import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  Briefcase,
  Building2,
  Users,
  Award,
  BarChart3,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Download,
  Mail,
  Phone,
  FileText
} from 'lucide-react';

const INITIAL_COMPANIES = [
  { id: 1, name: 'Tata Consultancy Services (TCS)', industry: 'Information Technology & Consulting', contactPerson: 'Mr. Arvind Saxena', email: 'campus.tcs@tcs.com', phone: '+91 22 6778 9000', tier: 'Tier 1', status: 'active', activeDrives: 2, totalHires: 148 },
  { id: 2, name: 'Infosys Limited', industry: 'IT Services & Business Consulting', contactPerson: 'Ms. Priya Menon', email: 'placements@infosys.com', phone: '+91 80 2852 0261', tier: 'Tier 1', status: 'active', activeDrives: 1, totalHires: 112 },
  { id: 3, name: 'Cognizant Technology Solutions', industry: 'Digital & Software Systems', contactPerson: 'Mr. Rajesh Nambiar', email: 'university.india@cognizant.com', phone: '+91 44 4209 6000', tier: 'Tier 2', status: 'active', activeDrives: 1, totalHires: 86 },
  { id: 4, name: 'L&T Technology Services', industry: 'Core Engineering & R&D', contactPerson: 'Mr. Amitav Ghosh', email: 'hr.campus@ltts.com', phone: '+91 22 6705 2874', tier: 'Tier 2', status: 'active', activeDrives: 1, totalHires: 42 },
  { id: 5, name: 'Persistent Systems', industry: 'Software Product Engineering', contactPerson: 'Ms. Sunita Patil', email: 'talent.pool@persistent.com', phone: '+91 20 6703 0000', tier: 'Tier 1', status: 'active', activeDrives: 1, totalHires: 38 },
];

const INITIAL_DRIVES = [
  { id: 1, company: 'Tata Consultancy Services (TCS)', role: 'Digital Software Engineer', ctc: '7.5 LPA', eligibility: 'CGPA >= 7.5, No Active Backlogs', deadline: '2026-10-25', driveDate: '2026-11-05', eligibleCount: 312, applicantsCount: 198, status: 'open' },
  { id: 2, company: 'Infosys Limited', role: 'Specialist Programmer (SP)', ctc: '9.5 LPA', eligibility: 'CGPA >= 8.0, Coding Assessment Cleared', deadline: '2026-11-01', driveDate: '2026-11-12', eligibleCount: 220, applicantsCount: 145, status: 'open' },
  { id: 3, company: 'L&T Technology Services', role: 'Graduate Engineer Trainee', ctc: '6.0 LPA', eligibility: 'Mechanical / Civil, CGPA >= 7.0', deadline: '2026-11-10', driveDate: '2026-11-20', eligibleCount: 140, applicantsCount: 88, status: 'upcoming' },
];

const INITIAL_APPLICATIONS = [
  { id: 1, student: 'Pooja Manoj Kadam', prn: 'PRN20220310', dept: 'Electronics & Telecommunication', company: 'TCS', drive: 'Digital Software Engineer', appliedDate: '2026-10-12', status: 'Interview Scheduled', score: '88/100' },
  { id: 2, student: 'Siddharth Nitin Shinde', prn: 'PRN20220412', dept: 'Mechanical Engineering', company: 'L&T Technology Services', drive: 'Graduate Engineer Trainee', appliedDate: '2026-10-14', status: 'Shortlisted', score: '82/100' },
  { id: 3, student: 'Karan Ramesh Verma', prn: 'PRN20220145', dept: 'Computer Engineering', company: 'Infosys Limited', drive: 'Specialist Programmer (SP)', appliedDate: '2026-10-11', status: 'Technical Round', score: '94/100' },
];

const INITIAL_OFFERS = [
  { id: 1, student: 'Pooja Manoj Kadam', prn: 'PRN20220310', dept: 'Electronics & Telecommunication', company: 'TCS', package: '7.50 LPA', offerDate: '2026-10-14', status: 'Accepted' },
  { id: 2, student: 'Vikram Aditya Roy', prn: 'PRN20220112', dept: 'Computer Engineering', company: 'Persistent Systems', package: '8.40 LPA', offerDate: '2026-10-08', status: 'Accepted' },
  { id: 3, student: 'Meera Kishor Sen', prn: 'PRN20220204', dept: 'Information Technology', company: 'Cognizant', package: '6.50 LPA', offerDate: '2026-10-02', status: 'Pending Acceptance' },
];

export function PlacementModule() {
  const [activeTab, setActiveTab] = useState('companies'); // 'companies', 'drives', 'applications', 'offers', 'reports'
  
  // Data lists
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [drives, setDrives] = useState(INITIAL_DRIVES);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [offers, setOffers] = useState(INITIAL_OFFERS);

  // Modals
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showAddDriveModal, setShowAddDriveModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Forms
  const [companyForm, setCompanyForm] = useState({
    name: '',
    industry: '',
    contactPerson: '',
    email: '',
    phone: '',
    tier: 'Tier 1',
  });

  const [driveForm, setDriveForm] = useState({
    company: 'Tata Consultancy Services (TCS)',
    role: '',
    ctc: '',
    eligibility: '',
    deadline: '',
    driveDate: '',
  });

  const { success, error } = useToast();

  const handleCreateCompany = (e) => {
    e.preventDefault();
    if (!companyForm.name.trim() || !companyForm.contactPerson.trim() || !companyForm.email.trim()) {
      error('Company Name, Contact Person, and Email are required.');
      return;
    }
    const newComp = {
      id: Date.now(),
      ...companyForm,
      status: 'active',
      activeDrives: 0,
      totalHires: 0,
    };
    setCompanies([newComp, ...companies]);
    setShowAddCompanyModal(false);
    setCompanyForm({ name: '', industry: '', contactPerson: '', email: '', phone: '', tier: 'Tier 1' });
    success(`Recruiter "${newComp.name}" onboarded into placement directory.`);
  };

  const handleCreateDrive = (e) => {
    e.preventDefault();
    if (!driveForm.role.trim() || !driveForm.ctc.trim() || !driveForm.driveDate) {
      error('Role, CTC, and Drive Date are required.');
      return;
    }
    const newDr = {
      id: Date.now(),
      ...driveForm,
      eligibleCount: 250,
      applicantsCount: 0,
      status: 'open',
    };
    setDrives([newDr, ...drives]);
    setShowAddDriveModal(false);
    setDriveForm({ company: 'Tata Consultancy Services (TCS)', role: '', ctc: '', eligibility: '', deadline: '', driveDate: '' });
    success(`Placement drive for "${newDr.company}" scheduled.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Placement Cell & Corporate Relations</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Institutional campus recruitment, company partnerships, eligibility verification, and privacy-protected offer registry.
          </p>
        </div>

        {activeTab === 'companies' && (
          <button
            onClick={() => setShowAddCompanyModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Company
          </button>
        )}
        {activeTab === 'drives' && (
          <button
            onClick={() => setShowAddDriveModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Drive
          </button>
        )}
      </div>

      {/* DPDP Purpose Limitation Tag */}
      <div className="bg-cyan-50/70 border border-cyan-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-cyan-950">
        <ShieldCheck className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-cyan-900">DPDP Placement Purpose Limitation</p>
          <p className="text-cyan-800 leading-relaxed">
            Student contact numbers and detailed academic resumes are shared with corporate recruiters strictly on a need-to-know basis following student opt-in consent for specific recruitment drives.
          </p>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-1.5 flex gap-1.5 overflow-x-auto text-xs font-bold">
        {[
          { id: 'companies', label: `Partner Companies (${companies.length})`, icon: Building2 },
          { id: 'drives', label: `Placement Drives (${drives.length})`, icon: Briefcase },
          { id: 'applications', label: 'Candidate Applications', icon: FileText },
          { id: 'offers', label: `Offer Registry (${offers.length})`, icon: Award },
          { id: 'reports', label: 'Placement Statistics', icon: BarChart3 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
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
      {/* TAB 1: COMPANIES                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'companies' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Company Name</th>
                  <th className="py-3.5 px-4">Industry Domain</th>
                  <th className="py-3.5 px-4">Recruitment SPOC</th>
                  <th className="py-3.5 px-4 text-center">Active Drives</th>
                  <th className="py-3.5 px-4 text-center">Total Hires</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {companies.map((comp) => (
                  <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xs">
                          {comp.name[0]}
                        </div>
                        <div>
                          <p>{comp.name}</p>
                          <span className="text-[10px] text-slate-400 font-normal">{comp.tier} Partner</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{comp.industry}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{comp.contactPerson}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{comp.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{comp.activeDrives}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-indigo-700">{comp.totalHires}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={comp.status}>{comp.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCompany(comp)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PLACEMENT DRIVES                                                   */}
      {/* ========================================================================= */}
      {activeTab === 'drives' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Company & Job Role</th>
                  <th className="py-3.5 px-4">Package (CTC)</th>
                  <th className="py-3.5 px-4">Eligibility Criteria</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4">Drive Date</th>
                  <th className="py-3.5 px-4 text-center">Applicants</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {drives.map((dr) => (
                  <tr key={dr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{dr.company}</p>
                      <span className="text-[11px] text-indigo-600 font-medium">{dr.role}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700 font-mono text-sm">{dr.ctc}</td>
                    <td className="py-3.5 px-4 text-slate-600">{dr.eligibility}</td>
                    <td className="py-3.5 px-4 font-mono text-rose-600">{dr.deadline}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{dr.driveDate}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                      {dr.applicantsCount} / {dr.eligibleCount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={dr.status}>{dr.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: APPLICATIONS                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">PRN</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Recruiter & Drive</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4 text-center">Score</th>
                  <th className="py-3.5 px-4 text-center">Application Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{app.student}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{app.prn}</td>
                    <td className="py-3.5 px-4 text-slate-600">{app.dept}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{app.company}</p>
                      <span className="text-[10px] text-slate-400">{app.drive}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{app.appliedDate}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-700">{app.score}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="active">{app.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: OFFERS                                                             */}
      {/* ========================================================================= */}
      {activeTab === 'offers' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Placed Student</th>
                  <th className="py-3.5 px-4">PRN</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Compensation (CTC)</th>
                  <th className="py-3.5 px-4">Offer Date</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {offers.map((off) => (
                  <tr key={off.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{off.student}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{off.prn}</td>
                    <td className="py-3.5 px-4">{off.dept}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{off.company}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{off.package}</td>
                    <td className="py-3.5 px-4 font-mono">{off.offerDate}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant="active">{off.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: REPORTS & PLACEMENT STATISTICS                                     */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Total Offers Released</span>
              <p className="text-2xl font-black text-indigo-950 mt-1">426</p>
              <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">+18% YoY Growth</span>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Highest CTC Package</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">24.0 LPA</p>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Amazon AWS</span>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Average CTC Package</span>
              <p className="text-2xl font-black text-slate-900 mt-1">6.85 LPA</p>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Institutional Median</span>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Placement Rate</span>
              <p className="text-2xl font-black text-purple-700 mt-1">84.2%</p>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">Of Eligible Cohort</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD COMPANY MODAL                                                         */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showAddCompanyModal}
        onClose={() => setShowAddCompanyModal(false)}
        title="Add Recruiter Company"
        subtitle="Register a new corporate recruiting partner."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateCompany} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={companyForm.name}
              onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
              placeholder="e.g. Cisco Systems"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Industry Domain</label>
              <input
                type="text"
                value={companyForm.industry}
                onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                placeholder="e.g. Networking & Cloud"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Recruiter Tier</label>
              <select
                value={companyForm.tier}
                onChange={(e) => setCompanyForm({ ...companyForm, tier: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="Tier 1">Tier 1 Partner</option>
                <option value="Tier 2">Tier 2 Partner</option>
                <option value="Dream Company">Dream Company</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Person *</label>
              <input
                type="text"
                required
                value={companyForm.contactPerson}
                onChange={(e) => setCompanyForm({ ...companyForm, contactPerson: e.target.value })}
                placeholder="e.g. Ms. Radhika Sen"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Official Email *</label>
              <input
                type="email"
                required
                value={companyForm.email}
                onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                placeholder="campus@cisco.com"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddCompanyModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
            >
              Save Company
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* ADD DRIVE MODAL                                                           */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showAddDriveModal}
        onClose={() => setShowAddDriveModal(false)}
        title="Schedule Placement Drive"
        subtitle="Broadcast a new recruitment drive with purpose-limited applicant screening."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateDrive} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Hiring Company *</label>
            <select
              value={driveForm.company}
              onChange={(e) => setDriveForm({ ...driveForm, company: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Job Role / Title *</label>
              <input
                type="text"
                required
                value={driveForm.role}
                onChange={(e) => setDriveForm({ ...driveForm, role: e.target.value })}
                placeholder="Software Development Engineer"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Compensation (CTC) *</label>
              <input
                type="text"
                required
                value={driveForm.ctc}
                onChange={(e) => setDriveForm({ ...driveForm, ctc: e.target.value })}
                placeholder="8.5 LPA"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Eligibility Criteria</label>
            <input
              type="text"
              value={driveForm.eligibility}
              onChange={(e) => setDriveForm({ ...driveForm, eligibility: e.target.value })}
              placeholder="CGPA >= 7.0, All Departments"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Application Deadline</label>
              <input
                type="date"
                value={driveForm.deadline}
                onChange={(e) => setDriveForm({ ...driveForm, deadline: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Drive Date *</label>
              <input
                type="date"
                required
                value={driveForm.driveDate}
                onChange={(e) => setDriveForm({ ...driveForm, driveDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddDriveModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
            >
              Publish Drive
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW COMPANY MODAL */}
      {selectedCompany && (
        <Modal
          isOpen={Boolean(selectedCompany)}
          onClose={() => setSelectedCompany(null)}
          title={selectedCompany.name}
          subtitle={`${selectedCompany.tier} Recruiting Partner`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Contact Person</span>
                <p className="font-bold text-slate-900">{selectedCompany.contactPerson}</p>
                <p className="text-slate-500 font-mono text-[11px]">{selectedCompany.email}</p>
              </div>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Total Placed</span>
                  <p className="font-bold text-base text-indigo-950">{selectedCompany.totalHires} Students</p>
                </div>
                <Badge variant={selectedCompany.status}>{selectedCompany.status}</Badge>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
