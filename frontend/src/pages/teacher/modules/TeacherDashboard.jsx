import React, { useState } from 'react';
import compEngCampusPhoto from '../../../assets/comp_eng_campus.png';
import { WelcomeBanner } from '../../../components/WelcomeBanner';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useTeacher } from '../../../context/TeacherContext';
import {
  Search,
  Bell,
  ChevronDown,
  GraduationCap,
  Users,
  Calendar,
  User,
  CheckCircle2,
  BarChart3,
  FileText,
  Megaphone,
  ArrowRight,
  Clock,
  Mail,
  HelpCircle,
  Shield,
  LogOut,
  Sparkles,
  CalendarDays,
  Activity,
  X,
  Send,
  Eye,
  Check,
} from 'lucide-react';

import { HamburgerButton } from '../../../components/HamburgerButton';

export function TeacherDashboard({ onNavigateTab }) {
  const { user, logout } = useAuth();
  const { success, info } = useToast();
  const {
    teacherProfile,
    students,
    subjects,
    requests,
    announcements,
    events,
    activities,
    attendanceStats,
    updateRequestStatus,
  } = useTeacher();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  // Interactive Modals
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const notifications = [
    { id: 1, title: 'Attendance Submitted', desc: 'Attendance for 03 Oct (55 Present, 3 Absent) recorded.', time: '10:15 AM', unread: true },
    { id: 2, title: 'New Student Request', desc: 'Siddhant More (22CE045) submitted a Profile Update Request.', time: '1h ago', unread: true },
    { id: 3, title: 'Internal Test 2 Schedule', desc: 'Department examination schedule published.', time: '2h ago', unread: true },
    { id: 4, title: 'HOD Academic Circular', desc: 'Mid-term continuous internal assessment review on Friday.', time: '1d ago', unread: false },
  ];

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setShowSupportModal(false);
    success('Support ticket submitted to Academic Department IT Desk.');
    setSupportForm({ subject: '', message: '' });
  };

  const handleNavigate = (tab) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    } else {
      info(`Navigating to ${tab}...`);
    }
  };

  return (
    <div className="space-y-4 font-sans text-slate-800 max-w-full">
      {/* ================= 1. TOP NAVBAR ================= */}
      <div className="bg-white rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2.5 sm:gap-4 max-w-full">
        {/* Left: Hamburger & Search Bar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-md">
          <HamburgerButton />
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students, requests, announcements..."
              className="w-full pl-9 pr-3 sm:pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all truncate"
            />
          </div>
        </div>

        {/* Right Nav: Notifications & Profile Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 relative">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Class Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">Class Alerts &amp; Updates</span>
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {notifications.map((n, idx) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        idx < unreadCount ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-100'
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
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden ring-2 ring-blue-500/20 shadow-xs group-hover:ring-blue-600/40 transition-all">
                <span className="text-white font-bold text-xs">SK</span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">Prof. Sonal Kadam</p>
                <p className="text-[10.5px] text-slate-500 font-medium">Class Teacher (TE Computer)</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-3 space-y-2 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Prof. Sonal Kadam</p>
                  <p className="text-[11px] text-slate-500">sonal.kadam@comp.nmiet.edu.in</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-md">
                    TE Computer — Div A
                  </span>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleNavigate('help_support');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-blue-600" />
                    DPDP Teacher Scopes
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
        greeting="Welcome to"
        userName={teacherProfile?.name || 'Prof. Sonal Kadam'}
        roleTitle="TE Computer Engineering – Division A"
        description="Manage your class, stay connected with students and keep track of academic activities."
        quote={
          <>
            Guide Today <br /> Grow Together
          </>
        }
        badgeText="Class Teacher Portal"
      />

      {/* ================= 3. ASSIGNED CLASS SUMMARY CARD ================= */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-2xs shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Class</span>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">TE Computer Engineering – Division A</h2>
            <span className="text-[11px] text-slate-500 font-medium">Academic Year 2026 – 27</span>
          </div>
        </div>

        {/* 3 Metric Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Total Students */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-50/80 rounded-xl border border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block leading-none">Total Students</span>
              <span className="text-xs font-bold text-slate-900 leading-none">{teacherProfile.classStrength}</span>
            </div>
          </div>

          {/* Semester */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-50/80 rounded-xl border border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block leading-none">Semester</span>
              <span className="text-xs font-bold text-slate-900 leading-none">{teacherProfile.semester}</span>
            </div>
          </div>

          {/* Class Strength */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-50/80 rounded-xl border border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block leading-none">Class Strength</span>
              <span className="text-xs font-bold text-slate-900 leading-none">{teacherProfile.activeCount} Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. MAIN 2-COLUMN GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ========== LEFT COLUMN (8 cols) ========== */}
        <div className="lg:col-span-8 space-y-4">
          {/* Quick Overview Section */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Quick Overview</h3>
              </div>
              <button
                onClick={() => handleNavigate('academic_records')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4 KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Total Students (Blue) */}
              <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Total Students</span>
                  <h4 className="text-lg font-black text-slate-900 leading-tight">{teacherProfile.classStrength}</h4>
                  <span className="text-[10.5px] text-slate-500 font-medium block">{attendanceStats.present} Present Today</span>
                </div>
              </div>

              {/* Attendance (Green) */}
              <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Attendance</span>
                  <h4 className="text-lg font-black text-slate-900 leading-tight">{attendanceStats.percentage}%</h4>
                  <span className="text-[10.5px] text-slate-500 font-medium block">Class Average</span>
                </div>
              </div>

              {/* Subjects (Purple) */}
              <div className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Subjects</span>
                  <h4 className="text-lg font-black text-slate-900 leading-tight">{subjects.length}</h4>
                  <span className="text-[10.5px] text-slate-500 font-medium block">This Semester</span>
                </div>
              </div>

              {/* Pending Requests (Orange) */}
              <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Pending Requests</span>
                  <h4 className="text-lg font-black text-slate-900 leading-tight">
                    {requests.filter((r) => r.status === 'Pending' || r.status === 'Under Review').length}
                  </h4>
                  <span className="text-[10.5px] text-amber-700 font-semibold block">Need Your Review</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Row Sub-Grid (Announcements & Student Requests) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Announcements Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-orange-500" />
                  <h3 className="text-sm font-bold text-slate-900">Announcements</h3>
                </div>
                <button
                  onClick={() => handleNavigate('announcements')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Announcements List */}
              <div className="divide-y divide-slate-100">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    onClick={() => setSelectedAnnouncement(ann)}
                    className="py-2.5 flex items-start justify-between gap-2 hover:bg-slate-50/60 rounded-xl px-1.5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${ann.dotColor || 'bg-blue-500'} mt-1.5 shrink-0`} />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {ann.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{ann.desc}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">{ann.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Student Requests Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Student Requests</h3>
                </div>
                <button
                  onClick={() => handleNavigate('requests')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Requests List */}
              <div className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="py-2.5 flex items-start justify-between gap-2 hover:bg-slate-50/60 rounded-xl px-1.5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${req.dotColor || 'bg-purple-500'} mt-1.5 shrink-0`} />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                          {req.type}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {req.studentName} ({req.prn})
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          req.status === 'Under Review'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : req.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : req.status === 'Forwarded'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {req.status}
                      </span>
                      <span className="block text-[9.5px] text-slate-400 mt-0.5">{req.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Class Performance Summary (Internal) Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Class Performance Summary (Internal)</h3>
              </div>
              <button
                onClick={() => handleNavigate('academic_records')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                View Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Performance Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10.5px]">
                  <tr>
                    <th className="py-2.5 px-3">Subject Code</th>
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3 text-center">Credits</th>
                    <th className="py-2.5 px-3 text-center">Class Average (Internal)</th>
                    <th className="py-2.5 px-3 text-center">No. of Students</th>
                    <th className="py-2.5 px-3">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((sub) => (
                    <tr key={sub.code} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">{sub.code}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{sub.name}</td>
                      <td className="py-2.5 px-3 text-center text-slate-600 font-medium">{sub.credits}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">{sub.average}</td>
                      <td className="py-2.5 px-3 text-center text-slate-600 font-medium">{sub.students}</td>
                      <td className="py-2.5 px-3 w-36">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${sub.barColor || 'bg-emerald-500'}`}
                            style={{ width: `${sub.performancePct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ========== RIGHT COLUMN (4 cols) ========== */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Today's Attendance */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Today's Attendance</h3>
              </div>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                {attendanceStats.date}
              </span>
            </div>

            {/* Circular Donut & Headline */}
            <div className="flex items-center justify-between gap-4 pt-1">
              {/* Donut SVG */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F1F5F9" strokeWidth="12" />
                  {/* Present 95% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#10B981"
                    strokeWidth="12"
                    strokeDasharray="226.98 238.76"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                  />
                  {/* Absent 5% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#F43F5E"
                    strokeWidth="12"
                    strokeDasharray="11.78 238.76"
                    strokeDashoffset="-226.98"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base font-black text-slate-900">95%</span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900 leading-tight">55 / 58</h4>
                <p className="text-xs font-semibold text-slate-500">Present Today</p>
                <button
                  onClick={() => handleNavigate('attendance')}
                  className="mt-2 text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  Mark Attendance <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Attendance Breakdown List */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 font-medium">Present</span>
                </div>
                <span className="font-bold text-slate-900">{attendanceStats.present}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-slate-600 font-medium">Absent</span>
                </div>
                <span className="font-bold text-slate-900">{attendanceStats.absent}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 font-medium">On Leave</span>
                </div>
                <span className="font-bold text-slate-900">{attendanceStats.onLeave}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span className="text-slate-600 font-medium">Late</span>
                </div>
                <span className="font-bold text-slate-900">{attendanceStats.late}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Upcoming Events */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Upcoming Events</h3>
              </div>
              <button
                onClick={() => handleNavigate('announcements')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Event Items */}
            <div className="space-y-2.5">
              {events.map((ev) => (
                <div key={ev.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-slate-500 uppercase leading-none">{ev.month}</span>
                    <span className="text-sm font-black text-slate-900 leading-none mt-0.5">{ev.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate leading-tight">{ev.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{ev.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Recent Activity */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
              </div>
              <button
                onClick={() => handleNavigate('access_history')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Activities List */}
            <div className="space-y-2.5">
              {activities.map((act) => (
                <div key={act.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${act.dotColor || 'bg-blue-500'} shrink-0`} />
                    <span className="text-slate-700 font-medium leading-tight">{act.text}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Need Help? Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                ?
              </div>
              <h3 className="text-sm font-bold text-slate-900">Need Help?</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              If you have any issues or need assistance, contact the support team.
            </p>
            <button
              onClick={() => setShowSupportModal(true)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Mail className="w-4 h-4" /> Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL: Contact Support ================= */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Class Teacher Support Desk</h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Discrepancy in TE Div A student marks roster"
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the issue or assistance needed from Academic Office..."
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: Student Request Details ================= */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedRequest.type}</h3>
                <p className="text-xs text-slate-500 font-mono">ID: REQ-{selectedRequest.id} • {selectedRequest.date}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Applicant Student</span>
                <span className="font-bold text-slate-800">{selectedRequest.studentName} ({selectedRequest.prn})</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Workflow Status</span>
                <span className="font-bold text-blue-700">{selectedRequest.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  updateRequestStatus(selectedRequest.id, 'Approved');
                  setSelectedRequest(null);
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Approve Request
              </button>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: Announcement Details ================= */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">{selectedAnnouncement.title}</h3>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-600 block">Class Notice Content</span>
              <p className="text-slate-700 leading-relaxed">{selectedAnnouncement.desc}</p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Date: {selectedAnnouncement.date}</span>
              <button
                type="button"
                onClick={() => setSelectedAnnouncement(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
