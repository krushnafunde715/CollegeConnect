import React, { useState } from 'react';
import compEngCampusPhoto from '../../../assets/comp_eng_campus.png';
import { WelcomeBanner } from '../../../components/WelcomeBanner';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useExamAdmin } from '../../../context/ExamAdminContext';
import { Modal } from '../../../components/Modal';
import {
  Search,
  Bell,
  ChevronDown,
  Users,
  Calendar,
  FileCheck2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  CalendarCheck,
  FileText,
  Award,
  Megaphone,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Ticket,
  Shield,
  LogOut,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';

export function ExamAdminDashboard({
  onNavigateTab,
}) {
  const { user, logout } = useAuth();
  const { success, info } = useToast();
  const { students, exams, results, schedules } = useExamAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('This Semester');

  // Modals for Quick Actions
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showInternalMarksModal, setShowInternalMarksModal] = useState(false);
  const [showPublishResultModal, setShowPublishResultModal] = useState(false);
  const [viewingActivity, setViewingActivity] = useState(null);

  // Forms
  const [examForm, setExamForm] = useState({
    name: 'End Semester University Examination 2025',
    semester: 'Semester 4 & 6',
    department: 'Computer Engineering',
    start_date: '2025-04-15',
    scheme: 'SPPU 2019 Course Pattern',
  });

  const [internalMarksForm, setInternalMarksForm] = useState({
    subject: 'Operating Systems',
    class: 'TE A',
    evaluated: '68',
    pending: '2',
  });

  const [resultForm, setResultForm] = useState({
    exam: 'End Semester Examination - Winter 2024',
    department: 'Computer Engineering',
    semester: 'Semester 3 & 5',
    status: 'Published',
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Hall Tickets Generated', desc: 'Hall tickets for SE and TE batches ready for download.', time: '10m ago', unread: true },
    { id: 2, title: 'Marks Submission Due', desc: 'Internal continuous assessment marks lock on 15 Apr.', time: '1h ago', unread: true },
    { id: 3, title: 'SPPU Circular Received', desc: 'Revised timetable for Final Year BE Computer Engineering.', time: '3h ago', unread: true },
    { id: 4, title: 'Moderation Completed', desc: 'Data Structures evaluation moderated by Senior Faculty.', time: '1d ago', unread: false },
    { id: 5, title: 'Result Gazette Uploaded', desc: 'Semester 3 gazette cryptographically signed.', time: '2d ago', unread: false },
  ]);

  // Upcoming Examination Schedule Data matching screenshot
  const upcomingSchedules = [
    { id: 1, date: '15 Apr 2025', name: 'Data Structures', class: 'SE', status: 'Upcoming', statusColor: 'bg-blue-50 text-blue-600 border border-blue-200' },
    { id: 2, date: '18 Apr 2025', name: 'Operating Systems', class: 'TE', status: 'Upcoming', statusColor: 'bg-blue-50 text-blue-600 border border-blue-200' },
    { id: 3, date: '22 Apr 2025', name: 'Computer Networks', class: 'BE', status: 'Upcoming', statusColor: 'bg-blue-50 text-blue-600 border border-blue-200' },
    { id: 4, date: '25 Apr 2025', name: 'Database Management', class: 'SE', status: 'Scheduled', statusColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
    { id: 5, date: '28 Apr 2025', name: 'Web Technology', class: 'TE', status: 'Scheduled', statusColor: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
  ];

  // Class-wise Examination Participation Data matching screenshot
  const participationData = [
    { cls: 'SE A (9)', rate: 89, color: '#8B5CF6' },
    { cls: 'SE B (8)', rate: 94, color: '#3B82F6' },
    { cls: 'TE A (9)', rate: 87, color: '#10B981' },
    { cls: 'TE B (8)', rate: 91, color: '#F59E0B' },
    { cls: 'BE A (9)', rate: 93, color: '#F97316' },
    { cls: 'BE B (8)', rate: 88, color: '#A78BFA' },
  ];

  // Result Distribution Data matching screenshot
  const resultDistribution = [
    { label: 'Distinction (≥ 75%)', pct: '28%', color: '#3B82F6' },
    { label: 'First Class (60 - 74%)', pct: '42%', color: '#10B981' },
    { label: 'Second Class (45 - 59%)', pct: '22%', color: '#F97316' },
    { label: 'Pass Class (35 - 44%)', pct: '6%', color: '#06B6D4' },
    { label: 'Fail (< 35%)', pct: '2%', color: '#EF4444' },
  ];

  // Recent Activities matching screenshot
  const recentActivities = [
    { id: 1, icon: Calendar, iconBg: 'bg-blue-50 text-blue-600', text: 'Exam schedule for Data Structures published', time: '2 hours ago' },
    { id: 2, icon: FileText, iconBg: 'bg-teal-50 text-teal-600', text: 'Internal marks updated for Operating Systems', time: '5 hours ago' },
    { id: 3, icon: Ticket, iconBg: 'bg-purple-50 text-purple-600', text: 'Hall tickets generated for SE students', time: '1 day ago' },
    { id: 4, icon: Award, iconBg: 'bg-amber-50 text-amber-600', text: 'Results published for Previous Semester', time: '2 days ago' },
    { id: 5, icon: AlertCircle, iconBg: 'bg-rose-50 text-rose-600', text: 'New examination created: Computer Networks', time: '3 days ago' },
  ];

  // Announcements matching screenshot
  const announcements = [
    {
      id: 1,
      title: 'Semester End Examination Guidelines',
      desc: 'Important instructions for all students appearing for end semester examinations.',
      date: '12 Apr 2025',
      icon: Megaphone,
      iconBg: 'bg-rose-50 text-rose-600',
    },
    {
      id: 2,
      title: 'Hall Ticket Release',
      desc: 'Hall tickets for SE and TE students are now available for download.',
      date: '10 Apr 2025',
      icon: FileText,
      iconBg: 'bg-blue-50 text-blue-600',
    },
  ];

  const handleCreateExamSubmit = (e) => {
    e.preventDefault();
    setShowCreateExamModal(false);
    success(`Examination "${examForm.name}" created successfully.`);
  };

  const handlePublishResultsSubmit = (e) => {
    e.preventDefault();
    setShowPublishResultModal(false);
    success(`Official results gazette published for ${resultForm.exam}.`);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* ================= TOP NAVBAR ================= */}
      <div className="bg-white rounded-2xl px-5 py-3 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, exams, hall tickets..."
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
              title="Examination Alerts"
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
                  <span className="text-xs font-bold text-slate-900">Examination Alerts</span>
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
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden ring-2 ring-indigo-500/20 shadow-xs group-hover:ring-indigo-600/40 transition-all">
                <span className="text-white font-bold text-xs">AM</span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">Prof. Akash Mhetre</p>
                <p className="text-[10.5px] text-slate-500 font-medium">Examination Administrator</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-3 space-y-2">
                <div className="p-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Prof. Akash Mhetre</p>
                  <p className="text-[11px] text-slate-500">akash.mhetre@exam.nmiet.edu.in</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-md">
                    Controller of Examinations
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
                    DPDP Exam Privacy Rules
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

      {/* ================= WELCOME HERO BANNER ================= */}
      <WelcomeBanner
        greeting="Welcome to"
        userName="Prof. Akash Mhetre"
        roleTitle="Examination Department"
        description="Manage examinations, evaluation processes and academic records with efficiency and accuracy."
        quote={
          <>
            Integrity Today <br /> Excellence Tomorrow
          </>
        }
        badgeText="Examination Portal"
      />

      {/* ================= 4 KPI METRIC CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Total Registered Students */}
        <div className="p-4.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Total Registered Students</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">{students.length}</span>
              <span className="inline-flex items-center text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                100% Enrolled
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block font-medium">Across all programs</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Upcoming Examinations */}
        <div className="p-4.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Upcoming Examinations</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">{exams.filter((e) => e.status === 'Upcoming' || e.status === 'Scheduled').length}</span>
              <span className="inline-flex items-center text-[10.5px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                Active
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block font-medium">Next exam in 7 days</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Results Published */}
        <div className="p-4.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Results Published</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">{results.filter((r) => r.status === 'Published').length}</span>
              <span className="inline-flex items-center text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Verified
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block font-medium">For current semester</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Pending Internal Marks */}
        <div className="p-4.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 block">Pending Internal Marks</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">{students.filter((s) => !s.internal_marks || s.internal_marks < 10).length}</span>
              <span className="inline-flex items-center text-[10.5px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                Audit Required
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block font-medium">Require evaluation</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ================= MIDDLE ROW (3 COLUMNS) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Upcoming Examination Schedule */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Upcoming Examination Schedule</h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab('schedules')}
              className="text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="text-[11px] font-bold text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="py-2">Date</th>
                  <th className="py-2">Exam Name</th>
                  <th className="py-2">Class</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingSchedules.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 font-medium text-slate-700">{item.date}</td>
                    <td className="py-2.5 font-bold text-slate-900">{item.name}</td>
                    <td className="py-2.5 font-semibold text-slate-600">{item.class}</td>
                    <td className="py-2.5 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${item.statusColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 2: Examination Status Overview (Donut Chart) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Examination Status Overview</h3>

          <div className="flex items-center justify-between pt-2">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F1F5F9" strokeWidth="14" />
                {/* Scheduled (50% = 119.38) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="14"
                  strokeDasharray="119.38 238.76"
                  strokeDashoffset="0"
                />
                {/* Completed (25% = 59.69) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#8B5CF6"
                  strokeWidth="14"
                  strokeDasharray="59.69 238.76"
                  strokeDashoffset="-119.38"
                />
                {/* Ongoing (17% = 40.58) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#F97316"
                  strokeWidth="14"
                  strokeDasharray="40.58 238.76"
                  strokeDashoffset="-179.07"
                />
                {/* Results Published (8% = 19.1) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#06B6D4"
                  strokeWidth="14"
                  strokeDasharray="19.1 238.76"
                  strokeDashoffset="-219.65"
                />
              </svg>
              {/* Donut Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-900 leading-none">12</span>
                <span className="text-[9.5px] font-semibold text-slate-400 mt-0.5">Total Exams</span>
              </div>
            </div>

            {/* Legend with Counts */}
            <div className="space-y-2 text-xs flex-1 pl-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                  <span className="text-slate-600 font-medium">Scheduled</span>
                </div>
                <strong className="text-slate-900 font-bold">6</strong>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
                  <span className="text-slate-600 font-medium">Ongoing</span>
                </div>
                <strong className="text-slate-900 font-bold">2</strong>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span className="text-slate-600 font-medium">Completed</span>
                </div>
                <strong className="text-slate-900 font-bold">3</strong>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]" />
                  <span className="text-slate-600 font-medium">Results Published</span>
                </div>
                <strong className="text-slate-900 font-bold">3</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Class-wise Examination Participation */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Class-wise Examination Participation</h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab('student_records')}
              className="text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] cursor-pointer"
            >
              View Details
            </button>
          </div>

          {/* Bar Chart */}
          <div className="pt-2">
            <div className="flex items-end justify-between h-40 gap-2 px-2 border-b border-slate-100">
              {participationData.map((bar) => (
                <div key={bar.cls} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[10px] font-bold text-slate-700">{bar.rate}%</span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-300"
                    style={{
                      height: `${bar.rate}%`,
                      backgroundColor: bar.color,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* X Axis Labels */}
            <div className="flex items-center justify-between gap-2 px-2 pt-2 text-[10px] font-semibold text-slate-500 text-center">
              {participationData.map((bar) => (
                <div key={bar.cls} className="flex-1 leading-tight">
                  <span>{bar.cls.split(' ')[0]} {bar.cls.split(' ')[1]}</span>
                  <span className="block text-[9px] text-slate-400">{bar.cls.split(' ')[2]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= LOWER ROW (3 COLUMNS) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1: Result Distribution */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Result Distribution</h3>

          <div className="flex items-center justify-between pt-1">
            {/* Pie / Donut representation */}
            <div className="relative w-32 h-32 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="32" fill="transparent" stroke="#F1F5F9" strokeWidth="24" />
                {/* First Class 42% */}
                <circle
                  cx="50"
                  cy="50"
                  r="32"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="24"
                  strokeDasharray="84.4 201.06"
                  strokeDashoffset="0"
                />
                {/* Distinction 28% */}
                <circle
                  cx="50"
                  cy="50"
                  r="32"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="24"
                  strokeDasharray="56.3 201.06"
                  strokeDashoffset="-84.4"
                />
                {/* Second Class 22% */}
                <circle
                  cx="50"
                  cy="50"
                  r="32"
                  fill="transparent"
                  stroke="#F97316"
                  strokeWidth="24"
                  strokeDasharray="44.2 201.06"
                  strokeDashoffset="-140.7"
                />
                {/* Pass Class 6% */}
                <circle
                  cx="50"
                  cy="50"
                  r="32"
                  fill="transparent"
                  stroke="#06B6D4"
                  strokeWidth="24"
                  strokeDasharray="12.06 201.06"
                  strokeDashoffset="-184.9"
                />
                {/* Fail 2% */}
                <circle
                  cx="50"
                  cy="50"
                  r="32"
                  fill="transparent"
                  stroke="#EF4444"
                  strokeWidth="24"
                  strokeDasharray="4.02 201.06"
                  strokeDashoffset="-196.96"
                />
              </svg>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs flex-1 pl-3">
              {resultDistribution.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 font-medium truncate max-w-[130px]">{item.label}</span>
                  </div>
                  <strong className="text-slate-900 font-bold ml-1">{item.pct}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Examination Analytics */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Examination Analytics</h3>
            <select
              value={analyticsTimeframe}
              onChange={(e) => setAnalyticsTimeframe(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg"
            >
              <option value="This Semester">This Semester</option>
              <option value="Previous Semester">Previous Semester</option>
              <option value="Annual 2024-25">Annual 2024-25</option>
            </select>
          </div>

          {/* 4 Metric Sub-boxes (2x2 grid) */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-black text-slate-900 block">92%</span>
                <span className="text-[10px] text-slate-500 font-medium leading-tight block">Overall Pass Percentage</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-black text-slate-900 block">54</span>
                <span className="text-[10px] text-slate-500 font-medium leading-tight block">Students Appeared</span>
              </div>
            </div>

            <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-black text-slate-900 block">6</span>
                <span className="text-[10px] text-slate-500 font-medium leading-tight block">Subjects Conducted</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-black text-slate-900 block">14</span>
                <span className="text-[10px] text-slate-500 font-medium leading-tight block">Pending Evaluations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Recent Examination Activities */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Examination Activities</h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab('access_history')}
              className="text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-2 pt-1">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  onClick={() => setViewingActivity(act)}
                  className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg ${act.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[190px]">
                      {act.text}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-1">
                    {act.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ROW (2 COLUMNS: QUICK ACTIONS & ANNOUNCEMENTS) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1 (2-spans): Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {/* Action 1: Create Examination */}
            <button
              onClick={() => setShowCreateExamModal(true)}
              className="p-4 bg-[#6B46FE] hover:bg-[#5B36EE] text-white rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-md shadow-purple-600/20 hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs font-bold text-center">Create Examination</span>
            </button>

            {/* Action 2: Manage Exam Schedule */}
            <button
              onClick={() => onNavigateTab ? onNavigateTab('schedules') : setShowScheduleModal(true)}
              className="p-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 hover:scale-[1.02] cursor-pointer"
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs font-bold text-center">Manage Exam Schedule</span>
            </button>

            {/* Action 3: Enter Internal Marks */}
            <button
              onClick={() => onNavigateTab ? onNavigateTab('internal_marks') : setShowInternalMarksModal(true)}
              className="p-4 bg-[#059669] hover:bg-[#047857] text-white rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 hover:scale-[1.02] cursor-pointer"
            >
              <FileText className="w-6 h-6" />
              <span className="text-xs font-bold text-center">Enter Internal Marks</span>
            </button>

            {/* Action 4: Publish Results */}
            <button
              onClick={() => setShowPublishResultModal(true)}
              className="p-4 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-2xl flex flex-col items-center justify-center gap-2 transition-all shadow-md shadow-orange-600/20 hover:scale-[1.02] cursor-pointer"
            >
              <BarChart3 className="w-6 h-6" />
              <span className="text-xs font-bold text-center">Publish Results</span>
            </button>
          </div>
        </div>

        {/* Column 2: Important Announcements */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Important Announcements</h3>
            <button
              onClick={() => onNavigateTab && onNavigateTab('announcements')}
              className="text-xs font-bold text-[#6366F1] hover:text-[#4F46E5] cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5 pt-1">
            {announcements.map((ann) => {
              const Icon = ann.icon;
              return (
                <div key={ann.id} className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl ${ann.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{ann.title}</h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{ann.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {ann.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MODAL: CREATE EXAMINATION ================= */}
      <Modal
        isOpen={showCreateExamModal}
        onClose={() => setShowCreateExamModal(false)}
        title="Create New Examination Session"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateExamSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Examination Title *</label>
            <input
              type="text"
              value={examForm.name}
              onChange={(e) => setExamForm({ ...examForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Target Semester *</label>
              <select
                value={examForm.semester}
                onChange={(e) => setExamForm({ ...examForm, semester: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="Semester 3 & 4 (SE)">Semester 3 &amp; 4 (SE)</option>
                <option value="Semester 5 & 6 (TE)">Semester 5 &amp; 6 (TE)</option>
                <option value="Semester 7 & 8 (BE)">Semester 7 &amp; 8 (BE)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Department</label>
              <input
                type="text"
                value={examForm.department}
                disabled
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-100 font-bold text-slate-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Commencement Date *</label>
              <input
                type="date"
                value={examForm.start_date}
                onChange={(e) => setExamForm({ ...examForm, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Examination Scheme</label>
              <input
                type="text"
                value={examForm.scheme}
                onChange={(e) => setExamForm({ ...examForm, scheme: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateExamModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Create Examination
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: PUBLISH RESULTS ================= */}
      <Modal
        isOpen={showPublishResultModal}
        onClose={() => setShowPublishResultModal(false)}
        title="Publish Official Semester Results"
        maxWidth="max-w-md"
      >
        <form onSubmit={handlePublishResultsSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1 text-purple-950">
            <span className="font-bold block">Cryptographic Result Gazette</span>
            <p className="text-[11px] text-purple-800">
              Publishing will update student GPA transcripts and generate SHA-256 verification seals for all 54 registered candidates.
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Examination Title</label>
            <input
              type="text"
              value={resultForm.exam}
              onChange={(e) => setResultForm({ ...resultForm, exam: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Target Semester &amp; Cohort</label>
            <select
              value={resultForm.semester}
              onChange={(e) => setResultForm({ ...resultForm, semester: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
            >
              <option value="Semester 3 & 4 (SE)">SE Cohort (Div A &amp; B)</option>
              <option value="Semester 5 & 6 (TE)">TE Cohort (Div A &amp; B)</option>
              <option value="Semester 7 & 8 (BE)">BE Cohort (Div A &amp; B)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowPublishResultModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Publish Gazette
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: VIEW RECENT ACTIVITY ================= */}
      {viewingActivity && (
        <Modal
          isOpen={true}
          onClose={() => setViewingActivity(null)}
          title="Examination Activity Record"
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Log Details</span>
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
