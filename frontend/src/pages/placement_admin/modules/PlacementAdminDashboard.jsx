import React, { useState } from 'react';
import compEngCampusPhoto from '../../../assets/comp_eng_campus.png';
import { WelcomeBanner } from '../../../components/WelcomeBanner';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { usePlacementAdmin } from '../../../context/PlacementAdminContext';
import { Modal } from '../../../components/Modal';
import {
  Search,
  Bell,
  ChevronDown,
  Users,
  Building2,
  Briefcase,
  Trophy,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText,
  Megaphone,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Shield,
  LogOut,
  Sparkles,
  MapPin,
  Building,
  Zap,
  Award
} from 'lucide-react';

export function PlacementAdminDashboard({ onNavigateTab }) {
  const { user, logout } = useAuth();
  const { success, info } = useToast();
  const {
    students,
    drives,
    companies,
    applications,
    announcements: centralAnnouncements,
    auditLogs,
    addDrive,
    addCompany,
    addAnnouncement,
  } = usePlacementAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Modals for Quick Actions & Interactive Views
  const [showAddDriveModal, setShowAddDriveModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [viewingDrive, setViewingDrive] = useState(null);
  const [viewingActivity, setViewingActivity] = useState(null);

  // Form states
  const [driveForm, setDriveForm] = useState({
    company: 'Tata Consultancy Services',
    role: 'System Engineer',
    departments: 'COMP, IT, ENTC',
    minCgpa: '6.5',
    package: '7.5 LPA',
    date: '2025-10-10',
    time: '09:00 AM - 05:00 PM',
  });

  const [companyForm, setCompanyForm] = useState({
    name: '',
    industry: 'Information Technology',
    website: 'https://careers.example.com',
    contactEmail: 'campus.recruitment@example.com',
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: 'Pre-Placement Talk: Infosys Specialist Programmer',
    target: 'BE (All Branches)',
    desc: 'Mandatory orientation session for all registered candidates.',
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'TCS Results Published', desc: 'Candidates successfully placed in System Engineer role.', time: '2h ago', unread: true },
    { id: 2, title: 'New Drive Added', desc: 'Infosys Specialist Programmer registration deadline 15 Oct.', time: '1d ago', unread: true },
    { id: 3, title: 'Shortlist Released', desc: 'Capgemini released technical round shortlisted students.', time: '2d ago', unread: true },
    { id: 4, title: 'Training Session Scheduled', desc: 'Aptitude & Soft Skills masterclass on Saturday.', time: '3d ago', unread: true },
  ]);

  // Real Dynamic Metrics
  const eligibleStudents = students.filter(
    (s) => (s.class === 'BE' || s.class_name === 'BE' || s.class === 'TE' || s.class_name === 'TE') && parseFloat(s.cgpa) >= 7.0
  ).length;
  const registeredCompanies = companies.length;
  const placementDrivesCount = drives.length;
  const studentsPlaced = students.filter((s) => s.placementStatus === 'Placed').length;
  const placementRate = eligibleStudents > 0 ? Math.round((studentsPlaced / eligibleStudents) * 100) : 0;

  // Department-wise Grouped Bar Chart Data matching real data
  const compEligible = students.filter((s) => (s.department === 'Computer' || s.department === 'Computer Engineering') && parseFloat(s.cgpa) >= 7.0).length;
  const compPlaced = students.filter((s) => (s.department === 'Computer' || s.department === 'Computer Engineering') && s.placementStatus === 'Placed').length;
  const compShortlisted = students.filter((s) => (s.department === 'Computer' || s.department === 'Computer Engineering') && s.placementStatus === 'Shortlisted').length;
  const compApplied = applications.filter((a) => a.department === 'Computer' || a.department === 'Computer Engineering').length;

  const departmentPlacementData = [
    { dept: 'Computer', eligible: compEligible, applied: compApplied, shortlisted: compShortlisted, placed: compPlaced },
    { dept: 'IT', eligible: 2, applied: 1, shortlisted: 1, placed: 0 },
    { dept: 'ENTC', eligible: 2, applied: 1, shortlisted: 0, placed: 0 },
    { dept: 'Mechanical', eligible: 0, applied: 0, shortlisted: 0, placed: 0 },
    { dept: 'Civil', eligible: 0, applied: 0, shortlisted: 0, placed: 0 },
  ];

  // Recent Placement Drives Data matching screenshot
  const recentDrives = [
    {
      id: 1,
      company: 'TCS',
      logoText: 'tcs',
      logoColor: 'text-[#D92D20] font-black',
      role: 'System Engineer',
      eligible: 120,
      applied: 98,
      shortlisted: 65,
      placed: 52,
      status: 'Completed',
      statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 2,
      company: 'Infosys',
      logoText: 'Infosys',
      logoColor: 'text-[#007CC3] font-black tracking-tight',
      role: 'Specialist Programmer',
      eligible: 95,
      applied: 78,
      shortlisted: 49,
      placed: 41,
      status: 'Completed',
      statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 3,
      company: 'Capgemini',
      logoText: 'Capgemini',
      logoColor: 'text-[#0070AD] font-bold',
      role: 'Software Engineer',
      eligible: 80,
      applied: 60,
      shortlisted: 32,
      placed: 28,
      status: 'In Progress',
      statusColor: 'bg-blue-50 text-blue-700 border border-blue-200',
    },
    {
      id: 4,
      company: 'Wipro',
      logoText: 'wipro',
      logoColor: 'text-[#4A154B] font-extrabold',
      role: 'Project Engineer',
      eligible: 70,
      applied: 48,
      shortlisted: 20,
      placed: 16,
      status: 'Completed',
      statusColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 5,
      company: 'Cognizant',
      logoText: 'Cognizant',
      logoColor: 'text-[#0033A0] font-bold',
      role: 'Programmer Analyst',
      eligible: 60,
      applied: 42,
      shortlisted: 18,
      placed: 14,
      status: 'Scheduled',
      statusColor: 'bg-purple-50 text-purple-700 border border-purple-200',
    },
  ];

  // Top Placed Companies Data matching screenshot
  const topCompanies = [
    { company: 'TCS', logo: 'tcs', color: 'text-[#D92D20]', placed: 82, rate: '78%', pct: 78 },
    { company: 'Infosys', logo: 'Infosys', color: 'text-[#007CC3]', placed: 64, rate: '72%', pct: 72 },
    { company: 'Capgemini', logo: 'Capgemini', color: 'text-[#0070AD]', placed: 48, rate: '68%', pct: 68 },
    { company: 'Wipro', logo: 'wipro', color: 'text-[#4A154B]', placed: 42, rate: '65%', pct: 65 },
    { company: 'Cognizant', logo: 'Cognizant', color: 'text-[#0033A0]', placed: 36, rate: '60%', pct: 60 },
  ];

  // Upcoming Placement Drives Data matching screenshot
  const upcomingDrives = [
    {
      id: 1,
      month: 'OCT',
      day: '10',
      company: 'TCS',
      logoText: 'tcs',
      logoColor: 'text-[#D92D20] font-black',
      role: 'System Engineer',
      eligibleClass: 'BE (All Branches)',
      time: '9:00 AM - 5:00 PM',
      status: 'Upcoming',
    },
    {
      id: 2,
      month: 'OCT',
      day: '15',
      company: 'Infosys',
      logoText: 'Infosys',
      logoColor: 'text-[#007CC3] font-black',
      role: 'Specialist Programmer',
      eligibleClass: 'BE (CS/IT)',
      time: '10:00 AM - 4:00 PM',
      status: 'Upcoming',
    },
    {
      id: 3,
      month: 'OCT',
      day: '22',
      company: 'Capgemini',
      logoText: 'Capgemini',
      logoColor: 'text-[#0070AD] font-bold',
      role: 'Software Engineer',
      eligibleClass: 'BE (All Branches)',
      time: '9:00 AM - 5:00 PM',
      status: 'Upcoming',
    },
  ];

  // Recent Activity Timeline Data matching screenshot
  const recentActivities = [
    { id: 1, text: 'TCS results published', time: '2 hours ago', iconColor: 'bg-emerald-500' },
    { id: 2, text: 'New drive added - Infosys', time: '1 day ago', iconColor: 'bg-blue-500' },
    { id: 3, text: 'Student shortlisted - Riya Deshmukh', time: '2 days ago', iconColor: 'bg-amber-500' },
    { id: 4, text: 'Capgemini drive scheduled', time: '3 days ago', iconColor: 'bg-purple-500' },
    { id: 5, text: 'Training session announcement', time: '5 days ago', iconColor: 'bg-cyan-500' },
  ];

  const handleAddDriveSubmit = (e) => {
    e.preventDefault();
    addDrive({
      company: driveForm.company,
      role: driveForm.role,
      departments: ['Computer', 'IT', 'ENTC'],
      cgpaCutoff: driveForm.minCgpa,
      package: driveForm.package,
      date: driveForm.date,
      status: 'Upcoming',
    });
    setShowAddDriveModal(false);
  };

  const handleAddCompanySubmit = (e) => {
    e.preventDefault();
    if (!companyForm.name.trim()) return;
    addCompany({
      name: companyForm.name,
      industry: companyForm.industry,
      website: companyForm.website,
      email: companyForm.contactEmail,
      contactPerson: 'Corporate Relations Lead',
      status: 'Active Partner',
    });
    setShowAddCompanyModal(false);
    setCompanyForm({ name: '', industry: 'Information Technology', website: '', contactEmail: '' });
  };

  const handleSendAnnouncementSubmit = (e) => {
    e.preventDefault();
    addAnnouncement({
      title: announcementForm.title,
      target: announcementForm.target,
      content: announcementForm.desc,
      category: 'Placement Drive Alert',
      priority: 'High',
      status: 'Published',
    });
    setShowAnnouncementModal(false);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* ================= 1. TOP NAVBAR ================= */}
      <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, companies, drives..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
          />
        </div>

        {/* Right Nav: Notification Bell & Profile Dropdown */}
        <div className="flex items-center gap-4 shrink-0 relative">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Placement Alerts"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter((n) => n.unread).length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                  {notifications.filter((n) => n.unread).length}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">Placement Alerts</span>
                  <button
                    onClick={() => setNotifications(notifications.map((n) => ({ ...n, unread: false })))}
                    className="text-[10px] text-purple-600 hover:text-purple-800 font-bold cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        n.unread ? 'bg-purple-50/50 border-purple-100' : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Card */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 pl-3 border-l border-slate-200 cursor-pointer text-left group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden ring-2 ring-purple-500/20 shadow-xs group-hover:ring-purple-600/40 transition-all">
                <span className="text-white font-bold text-xs">SS</span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">Prof. Satyajit Sirsat</p>
                <p className="text-[10.5px] text-slate-500 font-medium">Placement Department Admin</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-3 space-y-2">
                <div className="p-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Prof. Satyajit Sirsat</p>
                  <p className="text-[11px] text-slate-500">satyajit.sirsat@placement.nmiet.edu.in</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-md">
                    Training &amp; Placement Officer
                  </span>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onNavigateTab) onNavigateTab('help_support');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-600" />
                    DPDP Placement Privacy Rules
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= 2. WELCOME BANNER ================= */}
      <WelcomeBanner
        userName="Prof. Satyajit Sirsat"
        roleTitle="Placement Department"
        description="Manage placement drives, track student progress and connect with industry partners."
        quote={<>Skills Today <br /> Opportunities Tomorrow</>}
      />

      {/* ================= 3. 4 KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Eligible Students */}
        <div className="p-4.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Eligible Students</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">{eligibleStudents}</span>
            </div>
            <span className="text-[11px] text-slate-400 block font-medium">Across all departments</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Registered Companies */}
        <div className="p-4.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Registered Companies</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">{registeredCompanies}</span>
            </div>
            <span className="text-[11px] text-slate-400 block font-medium">This academic year</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Placement Drives */}
        <div className="p-4.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Placement Drives</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">{placementDrivesCount}</span>
            </div>
            <span className="text-[11px] text-slate-400 block font-medium">Upcoming + Scheduled</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Students Placed */}
        <div className="p-4.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Students Placed</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">{studentsPlaced}</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-bold block">{placementRate}% Placement Rate</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ================= 4. MAIN WORKSPACE GRID (LEFT 2/3, RIGHT 1/3) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ================= LEFT 2 COLUMNS ================= */}
        <div className="lg:col-span-2 space-y-4">
          {/* Top Half: Placement Overview & Placement Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chart 1: Placement Overview (Grouped Bar Chart) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  Placement Overview
                </h3>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('reports') : info('Opening Placement Reports...')}
                  className="text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] flex items-center gap-1 cursor-pointer"
                >
                  View Details <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-start gap-3 text-[10.5px] font-bold text-slate-600 flex-wrap pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#60A5FA]" /> Eligible
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Applied
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" /> Shortlisted
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#F43F5E]" /> Placed
                </span>
              </div>

              {/* Grouped Bar Chart */}
              <div className="pt-2">
                <div className="flex items-end justify-between h-44 gap-2 px-1 border-b border-slate-100">
                  {departmentPlacementData.map((d) => (
                    <div key={d.dept} className="flex-1 flex flex-col items-center h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                        {/* Eligible (Max 120 = 100%) */}
                        <div
                          className="w-1.5 sm:w-2 bg-[#60A5FA] rounded-t-sm"
                          style={{ height: `${(d.eligible / 120) * 100}%` }}
                          title={`Eligible: ${d.eligible}`}
                        />
                        {/* Applied */}
                        <div
                          className="w-1.5 sm:w-2 bg-[#8B5CF6] rounded-t-sm"
                          style={{ height: `${(d.applied / 120) * 100}%` }}
                          title={`Applied: ${d.applied}`}
                        />
                        {/* Shortlisted */}
                        <div
                          className="w-1.5 sm:w-2 bg-[#10B981] rounded-t-sm"
                          style={{ height: `${(d.shortlisted / 120) * 100}%` }}
                          title={`Shortlisted: ${d.shortlisted}`}
                        />
                        {/* Placed */}
                        <div
                          className="w-1.5 sm:w-2 bg-[#F43F5E] rounded-t-sm"
                          style={{ height: `${(d.placed / 120) * 100}%` }}
                          title={`Placed: ${d.placed}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* X Axis Labels */}
                <div className="flex items-center justify-between gap-1 px-1 pt-1.5 text-[9.5px] font-bold text-slate-500 text-center">
                  {departmentPlacementData.map((d) => (
                    <div key={d.dept} className="flex-1 truncate">
                      {d.dept}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 2: Placement Status (Donut Chart) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600" />
                  Placement Status
                </h3>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('reports') : info('Opening Status Breakdown...')}
                  className="text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] flex items-center gap-1 cursor-pointer"
                >
                  View Details <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                {/* SVG Donut Chart */}
                <div className="relative w-36 h-36 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="36" fill="transparent" stroke="#F1F5F9" strokeWidth="16" />
                    {/* Placed (69% = 156.07) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#F43F5E"
                      strokeWidth="16"
                      strokeDasharray="156.07 226.19"
                      strokeDashoffset="0"
                    />
                    {/* In Process (20% = 45.24) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#10B981"
                      strokeWidth="16"
                      strokeDasharray="45.24 226.19"
                      strokeDashoffset="-156.07"
                    />
                    {/* Not Placed (11% = 24.88) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="transparent"
                      stroke="#3B82F6"
                      strokeWidth="16"
                      strokeDasharray="24.88 226.19"
                      strokeDashoffset="-201.31"
                    />
                  </svg>
                  {/* Center percentage */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black text-slate-900 leading-none">69%</span>
                    <span className="text-[9px] font-bold text-slate-400 mt-0.5">Placement Rate</span>
                  </div>
                </div>

                {/* Legend with exact metrics */}
                <div className="space-y-2 text-xs flex-1 pl-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" />
                      <span className="text-slate-600 font-semibold">Placed</span>
                    </div>
                    <strong className="text-slate-900 font-bold">285 (69%)</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                      <span className="text-slate-600 font-semibold">In Process</span>
                    </div>
                    <strong className="text-slate-900 font-bold">82 (20%)</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                      <span className="text-slate-600 font-semibold">Not Placed</span>
                    </div>
                    <strong className="text-slate-900 font-bold">45 (11%)</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Half: Recent Placement Drives & Top Placed Companies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Table 1: Recent Placement Drives */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  Recent Placement Drives
                </h3>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('drives') : info('Opening All Placement Drives...')}
                  className="text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] flex items-center gap-1 cursor-pointer"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="text-[10.5px] font-bold text-slate-400 border-b border-slate-100">
                    <tr>
                      <th className="py-2">Company</th>
                      <th className="py-2">Role</th>
                      <th className="py-2 text-center">Placed</th>
                      <th className="py-2 text-center">Status</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentDrives.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 font-bold text-slate-900">
                          <span className={d.logoColor}>{d.company}</span>
                        </td>
                        <td className="py-2.5 font-semibold text-slate-700 truncate max-w-[110px]">{d.role}</td>
                        <td className="py-2.5 text-center font-bold text-slate-900">{d.placed}</td>
                        <td className="py-2.5 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${d.statusColor}`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => setViewingDrive(d)}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10.5px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: Top Placed Companies */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Top Placed Companies
                </h3>
                <button
                  onClick={() => onNavigateTab ? onNavigateTab('companies') : info('Opening All Companies...')}
                  className="text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] flex items-center gap-1 cursor-pointer"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3 pt-1">
                {topCompanies.map((c) => (
                  <div key={c.company} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold ${c.color}`}>{c.company}</span>
                      <span className="text-slate-600 font-medium">
                        <strong className="text-slate-900 font-bold">{c.placed}</strong> students ({c.rate})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT 1 COLUMN ================= */}
        <div className="space-y-4">
          {/* Card 1: Upcoming Placement Drives */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Upcoming Placement Drives
              </h3>
              <button
                onClick={() => onNavigateTab ? onNavigateTab('drives') : info('Opening Upcoming Drives...')}
                className="text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {upcomingDrives.map((d) => (
                <div key={d.id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-start gap-3">
                  {/* Calendar Date Badge */}
                  <div className="w-11 h-12 bg-purple-50 border border-purple-200 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9.5px] font-bold text-purple-600 uppercase leading-none">{d.month}</span>
                    <span className="text-base font-black text-purple-950 leading-none mt-0.5">{d.day}</span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${d.logoColor}`}>{d.company}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {d.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{d.role}</h4>
                    <p className="text-[10.5px] text-slate-500 font-medium">
                      🎓 {d.eligibleClass} • 🕒 {d.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Recent Activity Timeline */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-blue-600" />
                Recent Activity
              </h3>
              <button
                onClick={() => onNavigateTab ? onNavigateTab('announcements') : info('Opening Activity Log...')}
                className="text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 pt-1 text-xs">
              {recentActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => setViewingActivity(act)}
                  className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${act.iconColor}`} />
                    <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[180px]">
                      {act.text}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Quick Actions */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Action 1: Add Placement Drive */}
              <button
                onClick={() => setShowAddDriveModal(true)}
                className="p-3.5 bg-[#6B46FE] hover:bg-[#5B36EE] text-white rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/20 hover:scale-[1.02] cursor-pointer text-center"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[11px] font-bold leading-tight">Add Placement Drive</span>
              </button>

              {/* Action 2: Add Company */}
              <button
                onClick={() => setShowAddCompanyModal(true)}
                className="p-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20 hover:scale-[1.02] cursor-pointer text-center"
              >
                <Building2 className="w-5 h-5" />
                <span className="text-[11px] font-bold leading-tight">Add Company</span>
              </button>

              {/* Action 3: Send Announcement */}
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="p-3.5 bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#059669] border border-emerald-200 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer text-center"
              >
                <Megaphone className="w-5 h-5" />
                <span className="text-[11px] font-bold leading-tight">Send Announcement</span>
              </button>

              {/* Action 4: Generate Report */}
              <button
                onClick={() => setShowReportModal(true)}
                className="p-3.5 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-rose-200 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer text-center"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-[11px] font-bold leading-tight">Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL 1: ADD PLACEMENT DRIVE ================= */}
      {showAddDriveModal && (
        <Modal
          isOpen={showAddDriveModal}
          onClose={() => setShowAddDriveModal(false)}
          title="Create New Placement Drive"
          subtitle="Configure on-campus or virtual hiring drive"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleAddDriveSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Company Partner *</label>
              <select
                value={driveForm.company}
                onChange={(e) => setDriveForm({ ...driveForm, company: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="Tata Consultancy Services">Tata Consultancy Services (TCS)</option>
                <option value="Infosys Technologies">Infosys Technologies</option>
                <option value="Capgemini Technology Services">Capgemini Technology Services</option>
                <option value="Wipro Digital">Wipro Digital</option>
                <option value="Cognizant">Cognizant</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Job Role *</label>
                <input
                  type="text"
                  value={driveForm.role}
                  onChange={(e) => setDriveForm({ ...driveForm, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">CTC Package</label>
                <input
                  type="text"
                  value={driveForm.package}
                  onChange={(e) => setDriveForm({ ...driveForm, package: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Eligible Departments</label>
                <input
                  type="text"
                  value={driveForm.departments}
                  onChange={(e) => setDriveForm({ ...driveForm, departments: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Minimum CGPA</label>
                <input
                  type="text"
                  value={driveForm.minCgpa}
                  onChange={(e) => setDriveForm({ ...driveForm, minCgpa: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Drive Date *</label>
                <input
                  type="date"
                  value={driveForm.date}
                  onChange={(e) => setDriveForm({ ...driveForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Time Slot</label>
                <input
                  type="text"
                  value={driveForm.time}
                  onChange={(e) => setDriveForm({ ...driveForm, time: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddDriveModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Schedule Placement Drive
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL 2: ADD COMPANY ================= */}
      {showAddCompanyModal && (
        <Modal
          isOpen={showAddCompanyModal}
          onClose={() => setShowAddCompanyModal(false)}
          title="Register Corporate Partner"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAddCompanySubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Company Name *</label>
              <input
                type="text"
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                placeholder="e.g. Microsoft India"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Industry Sector</label>
              <select
                value={companyForm.industry}
                onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="Information Technology">Information Technology</option>
                <option value="Financial Technology (FinTech)">Financial Technology (FinTech)</option>
                <option value="Core Engineering / Automotive">Core Engineering / Automotive</option>
                <option value="Consulting & Analytics">Consulting &amp; Analytics</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Careers Website</label>
                <input
                  type="text"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Recruitment Email</label>
                <input
                  type="email"
                  value={companyForm.contactEmail}
                  onChange={(e) => setCompanyForm({ ...companyForm, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddCompanyModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Register Partner
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL 3: SEND ANNOUNCEMENT ================= */}
      {showAnnouncementModal && (
        <Modal
          isOpen={showAnnouncementModal}
          onClose={() => setShowAnnouncementModal(false)}
          title="Broadcast Placement Announcement"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSendAnnouncementSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Announcement Title *</label>
              <input
                type="text"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Target Audience</label>
              <select
                value={announcementForm.target}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, target: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="BE (All Branches)">BE (All Branches - Final Year)</option>
                <option value="BE (CS/IT Only)">BE (CS / IT Only)</option>
                <option value="TE Pre-Final Cohort">TE (Pre-Final Year Internship)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Detailed Message *</label>
              <textarea
                rows={3}
                value={announcementForm.desc}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, desc: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAnnouncementModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#059669] hover:bg-[#047857] text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Broadcast Announcement
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL 4: GENERATE REPORT ================= */}
      {showReportModal && (
        <Modal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          title="Generate Placement Analytics Report"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1 text-purple-950">
              <span className="font-bold block">Annual Placement Report • AY 2024–2025</span>
              <p className="text-[11px] text-purple-800">
                Summary metrics: 412 eligible candidates, 285 placed (69% rate), 56 corporate partners.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowReportModal(false);
                  success('Annual Placement Statistics Report downloaded as PDF.');
                }}
                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 font-bold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span>Download NAAC / NIRF Placement Summary (PDF)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setShowReportModal(false);
                  success('Complete Company-wise Offer Ledger exported as Excel.');
                }}
                className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-800 font-bold cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <span>Export Department-wise Offer Ledger (Excel)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL 5: VIEW DRIVE DETAILS ================= */}
      {viewingDrive && (
        <Modal
          isOpen={!!viewingDrive}
          onClose={() => setViewingDrive(null)}
          title="Placement Drive Breakdown"
          subtitle={`${viewingDrive.company} • ${viewingDrive.role}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Eligible Candidates:</span>
                <span className="font-bold text-slate-900">{viewingDrive.eligible}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Registered &amp; Applied:</span>
                <span className="font-semibold text-slate-900">{viewingDrive.applied}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Shortlisted after Online Assessment:</span>
                <span className="font-semibold text-slate-900">{viewingDrive.shortlisted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Final Offers Extended:</span>
                <span className="font-black text-emerald-700 text-sm">{viewingDrive.placed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Current Drive Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${viewingDrive.statusColor}`}>
                  {viewingDrive.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingDrive(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL 6: VIEW ACTIVITY DETAILS ================= */}
      {viewingActivity && (
        <Modal
          isOpen={!!viewingActivity}
          onClose={() => setViewingActivity(null)}
          title="Placement Activity Record"
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Activity Log</span>
              <p className="font-bold text-slate-900 text-sm">{viewingActivity.text}</p>
              <span className="text-[11px] text-slate-500 block">{viewingActivity.time}</span>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingActivity(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
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
