import React, { useState } from 'react';
import compEngCampusPhoto from '../../../assets/comp_eng_campus.png';
import { WelcomeBanner } from '../../../components/WelcomeBanner';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { useStudent } from '../../../context/StudentContext';
import {
  Search,
  Bell,
  ChevronDown,
  GraduationCap,
  Calendar,
  Briefcase,
  FileText,
  Megaphone,
  Clock,
  HelpCircle,
  Mail,
  Shield,
  User,
  LogOut,
  Sparkles,
  ArrowRight,
  Activity,
  X,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { HamburgerButton } from '../../../components/HamburgerButton';

export function StudentDashboard({ onNavigateTab }) {
  const { user, logout } = useAuth();
  const { success, info } = useToast();
  const {
    studentProfile,
    overview,
    announcements,
    requests,
    activities,
    notifications,
  } = useStudent();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const displayName = studentProfile?.name || user?.full_name || 'Krushna Funde';
  const displayProgram = studentProfile?.program || 'BE Computer Engineering';
  const displayPrn = studentProfile?.prn || user?.college_id || 'CE2022001';
  const initials = displayName ? displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'KF';

  // Interactive Modals
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setShowSupportModal(false);
    success('Support request submitted to College Student Helpdesk (Ticket #STU-8829).');
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
              placeholder="Search for information..."
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
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Notifications</span>
                  <button
                    onClick={() => {
                      setUnreadCount(0);
                      success('All notifications marked as read.');
                    }}
                    className="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer space-y-1"
                      onClick={() => {
                        info(`Notification: ${item.title}`);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{item.title}</span>
                        <span className="text-[10px] text-slate-400">{item.time || item.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Student Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 ring-2 ring-blue-100">
                {initials}
              </div>
              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-extrabold text-slate-900 block leading-tight">
                    {displayName}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 block leading-tight">
                  {displayProgram}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{displayName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">PRN: {displayPrn}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                    Student ({displayProgram})
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleNavigate('profile');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleNavigate('academics');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    Academic Records
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleNavigate('privacy');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Privacy Center
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleNavigate('help_support');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    Help & Support
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (logout) logout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
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
        userName={displayName}
        roleTitle={displayProgram}
        description="Stay updated, keep learning, and make the most of your academic and placement opportunities."
        quote={
          <>
            Learn Today <br /> Build Tomorrow
          </>
        }
        badgeText="Student Portal"
      />

      {/* ================= 3. QUICK OVERVIEW (4 CARDS) ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-extrabold text-slate-900">Quick Overview</h2>
          </div>
          <button
            onClick={() => handleNavigate('academics')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Attendance */}
          <div
            onClick={() => handleNavigate('academics')}
            className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Attendance</span>
                <span className="text-[11px] font-semibold text-slate-500 block">(Current Semester)</span>
              </div>
            </div>

            {/* Attendance Donut / Pill */}
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 bg-white flex items-center justify-center font-black text-xs text-slate-900 shadow-xs">
              {overview.attendance.value}
            </div>
          </div>

          {/* Card 2: Upcoming Exams */}
          <div
            onClick={() => handleNavigate('examination')}
            className="bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white text-purple-600 flex items-center justify-center shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Upcoming Exams</span>
                <span className="text-2xl font-black text-slate-900 leading-none my-0.5 block">{overview.upcomingExams.count}</span>
                <span className="text-[11px] font-semibold text-slate-500 block">Next 30 Days</span>
              </div>
            </div>
          </div>

          {/* Card 3: Placement Applications */}
          <div
            onClick={() => handleNavigate('placement')}
            className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Placement Applications</span>
                <span className="text-2xl font-black text-slate-900 leading-none my-0.5 block">{overview.placementApplications.count}</span>
                <span className="text-[11px] font-semibold text-slate-500 block">Applied</span>
              </div>
            </div>
          </div>

          {/* Card 4: Pending Requests */}
          <div
            onClick={() => handleNavigate('privacy')}
            className="bg-[#FFFBEB] border border-[#FEF3C7] rounded-2xl p-4 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white text-amber-600 flex items-center justify-center shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Pending Requests</span>
                <span className="text-2xl font-black text-slate-900 leading-none my-0.5 block">{overview.pendingRequests.count}</span>
                <span className="text-[11px] font-semibold text-slate-500 block">In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. MIDDLE ROW: ANNOUNCEMENTS & MY REQUESTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Announcements */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                <Megaphone className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Announcements</h3>
            </div>
            <button
              onClick={() => setShowAllAnnouncements(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {announcements.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedAnnouncement(item)}
                className="p-3 rounded-xl hover:bg-slate-50/80 transition-colors flex items-start gap-3 cursor-pointer border border-transparent hover:border-slate-100"
              >
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${item.dotColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10.5px] font-semibold text-slate-400 shrink-0">{item.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug mt-0.5 truncate">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: My Requests */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">My Requests</h3>
                {requests && requests.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">
                    {requests.length}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowAllRequests(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {requests && requests.length > 0 ? (
              requests.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedRequest(item)}
                  className="p-3 rounded-xl bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3 cursor-pointer border border-slate-100 hover:border-blue-200 hover:shadow-2xs group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        item.status?.toLowerCase() === 'approved'
                          ? 'bg-emerald-500'
                          : item.status?.toLowerCase() === 'completed'
                          ? 'bg-teal-500'
                          : item.status?.toLowerCase() === 'under review'
                          ? 'bg-amber-500'
                          : item.status?.toLowerCase() === 'rejected'
                          ? 'bg-rose-500'
                          : item.status?.toLowerCase() === 'forwarded'
                          ? 'bg-blue-500'
                          : 'bg-orange-500'
                      }`}
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 shrink-0">
                          {item.id}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {item.title || item.type}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug line-clamp-2">
                        {item.description || item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1.5 flex flex-col items-end">
                    <span className="text-[10.5px] font-semibold text-slate-400 block">{item.date}</span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.status?.toLowerCase() === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.status?.toLowerCase() === 'completed'
                          ? 'bg-teal-50 text-teal-700 border-teal-200'
                          : item.status?.toLowerCase() === 'under review'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : item.status?.toLowerCase() === 'rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : item.status?.toLowerCase() === 'forwarded'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-7 px-4 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">You haven't submitted any requests yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Your submitted academic or administrative requests will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= 5. BOTTOM ROW: RECENT ACTIVITY & NEED HELP ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Recent Activity (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
            </div>
            <button
              onClick={() => setShowAllActivities(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {activities.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 border border-transparent hover:border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}>
                    {item.iconType === 'briefcase' ? (
                      <Briefcase className="w-4 h-4" />
                    ) : item.iconType === 'calendar' ? (
                      <Calendar className="w-4 h-4" />
                    ) : item.iconType === 'file' ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-900">{item.title}</span>
                </div>

                <span className="text-[11px] font-semibold text-slate-400 shrink-0 font-mono">
                  {item.datetime}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Need Help? Card (1 Col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span>Need Help?</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              If you have any questions or issues, contact the support team. We are here to help you.
            </p>
          </div>

          <button
            onClick={() => setShowSupportModal(true)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Support</span>
          </button>
        </div>
      </div>

      {/* ================= 6. MODALS ================= */}

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${selectedAnnouncement.categoryBadge || 'bg-blue-100 text-blue-800 border-blue-200'}`}>
                  {selectedAnnouncement.category}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1.5">{selectedAnnouncement.title}</h3>
                <p className="text-xs text-slate-400 font-medium">Published: {selectedAnnouncement.date}</p>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed p-4 bg-slate-50 rounded-2xl border border-slate-100">
              {selectedAnnouncement.desc}
            </p>

            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">
                    {selectedRequest.id}
                  </span>
                  {selectedRequest.type && selectedRequest.type !== selectedRequest.title && (
                    <span className="text-[10px] font-semibold text-slate-500">
                      {selectedRequest.type}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-slate-900">{selectedRequest.title || selectedRequest.type}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Submitted: {selectedRequest.date}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-2 px-3 bg-slate-50/70 rounded-xl border border-slate-100">
                <span className="text-slate-500 font-medium">Current Status:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold border ${
                    selectedRequest.status?.toLowerCase() === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : selectedRequest.status?.toLowerCase() === 'completed'
                      ? 'bg-teal-50 text-teal-700 border-teal-200'
                      : selectedRequest.status?.toLowerCase() === 'under review'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : selectedRequest.status?.toLowerCase() === 'rejected'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : selectedRequest.status?.toLowerCase() === 'forwarded'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                  }`}
                >
                  {selectedRequest.status}
                </span>
              </div>

              {selectedRequest.assignedTo && (
                <div className="flex justify-between items-center px-3 py-2 bg-slate-50/70 rounded-xl border border-slate-100">
                  <span className="text-slate-500 font-medium">Assigned Reviewer:</span>
                  <span className="font-bold text-slate-800">{selectedRequest.assignedTo}</span>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Request Summary</span>
                <p className="text-slate-800 font-medium leading-relaxed">{selectedRequest.description || selectedRequest.desc}</p>
              </div>

              {selectedRequest.details && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold block uppercase text-[10px]">Processing Notes & Details</span>
                  <p className="text-slate-700 leading-relaxed">{selectedRequest.details}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedRequest(null)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* View All Modal */}
      {(showAllAnnouncements || showAllRequests || showAllActivities) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {showAllAnnouncements ? 'All Announcements' : showAllRequests ? 'My Requests History' : 'Recent Activities'}
              </h3>
              <button
                onClick={() => {
                  setShowAllAnnouncements(false);
                  setShowAllRequests(false);
                  setShowAllActivities(false);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {showAllAnnouncements &&
                announcements.map((a) => (
                  <div key={a.id} className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900">{a.title}</span>
                      <span className="text-[10px] text-slate-400">{a.date}</span>
                    </div>
                    <p className="text-xs text-slate-600">{a.desc}</p>
                  </div>
                ))}

              {showAllRequests && (
                requests && requests.length > 0 ? (
                  requests.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setShowAllRequests(false);
                        setSelectedRequest(r);
                      }}
                      className="p-3.5 bg-slate-50/70 hover:bg-slate-100 rounded-xl flex items-start justify-between gap-3 cursor-pointer border border-slate-100 hover:border-blue-200 transition-colors group"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div
                          className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                            r.status?.toLowerCase() === 'approved'
                              ? 'bg-emerald-500'
                              : r.status?.toLowerCase() === 'completed'
                              ? 'bg-teal-500'
                              : r.status?.toLowerCase() === 'under review'
                              ? 'bg-amber-500'
                              : r.status?.toLowerCase() === 'rejected'
                              ? 'bg-rose-500'
                              : r.status?.toLowerCase() === 'forwarded'
                              ? 'bg-blue-500'
                              : 'bg-orange-500'
                          }`}
                        />
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded border border-blue-200/80">
                              {r.id}
                            </span>
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {r.title || r.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-snug">{r.description || r.desc}</p>
                          {r.assignedTo && (
                            <p className="text-[10.5px] text-slate-400 font-medium">Reviewer: {r.assignedTo}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0 space-y-1.5 flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 font-semibold">{r.date}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            r.status?.toLowerCase() === 'approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : r.status?.toLowerCase() === 'completed'
                              ? 'bg-teal-50 text-teal-700 border-teal-200'
                              : r.status?.toLowerCase() === 'under review'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : r.status?.toLowerCase() === 'rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : r.status?.toLowerCase() === 'forwarded'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">You haven't submitted any requests yet.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Your submitted academic or administrative requests will appear here.</p>
                  </div>
                )
              )}

              {showAllActivities &&
                activities.map((act) => (
                  <div key={act.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">{act.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{act.datetime}</span>
                  </div>
                ))}
            </div>

            <button
              onClick={() => {
                setShowAllAnnouncements(false);
                setShowAllRequests(false);
                setShowAllActivities(false);
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Contact Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Student Support Desk</h3>
                  <p className="text-xs text-slate-500">Krushna Funde (BE Computer Engineering)</p>
                </div>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSupportSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={supportForm.subject}
                  onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                  placeholder="e.g. Query regarding Exam Hall Ticket..."
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
                  value={supportForm.message}
                  onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                  placeholder="Describe your issue or request in detail..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
