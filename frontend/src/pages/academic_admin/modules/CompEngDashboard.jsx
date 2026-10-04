import React, { useState } from 'react';
import compEngCampusPhoto from '../../../assets/comp_eng_campus.png';
import { WelcomeBanner } from '../../../components/WelcomeBanner';
import { useAuth } from '../../../context/AuthContext';
import { useCompEngData } from '../../../context/CompEngDataContext';
import {
  Users,
  Building2,
  BookOpen,
  UserCheck,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Search,
  Bell,
  ChevronDown,
  Layers,
  Zap,
  CalendarCheck,
  Megaphone,
  BarChart3,
  Award,
  Plus,
  LogOut,
  Shield,
  Check
} from 'lucide-react';

import { HamburgerButton } from '../../../components/HamburgerButton';

export function CompEngDashboard({
  departmentName = 'Computer Engineering',
  onNavigateTab,
  onOpenAddStudent,
  onOpenCreateClass,
  onOpenAssignTeacher,
  onOpenAddAnnouncement,
}) {
  const { user, logout } = useAuth();
  const {
    students,
    classes,
    faculty,
    subjects,
    getClassStudentCount,
  } = useCompEngData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || 'SE A');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Attendance Alert', desc: 'Students with attendance < 75% identified in SE A.', time: '10m ago', unread: true },
    { id: 2, title: 'Marks Moderation', desc: 'Unit Test 2 internal assessment marks verified.', time: '1h ago', unread: true },
    { id: 3, title: 'DPDP Privacy Log', desc: 'Quarterly student data privacy access review verified.', time: '4h ago', unread: false },
    { id: 4, title: 'Circular Published', desc: 'Mini-project guidelines broadcast to SE & TE cohorts.', time: '1d ago', unread: false },
  ]);

  // Derive class info dynamically from the centralized unique students
  const classStudents = students.filter(
    (s) => (s.current_class_name || `${s.class_name} ${s.division}`) === selectedClass
  );
  const totalInClass = classStudents.length;
  const regularCount = classStudents.filter((s) => (s.status || s.account_status || '').toLowerCase() === 'active').length;
  const onLeaveCount = classStudents.filter((s) => (s.status || s.account_status || '').toLowerCase() === 'on leave').length;
  const inactiveCount = classStudents.filter((s) => (s.status || s.account_status || '').toLowerCase() === 'inactive').length;

  const currentClassInfo = {
    total: totalInClass,
    regular: regularCount,
    detained: onLeaveCount,
    backlog: inactiveCount,
    discontinued: 0,
    regPct: totalInClass > 0 ? Math.round((regularCount / totalInClass) * 100) : 0,
    detPct: totalInClass > 0 ? Math.round((onLeaveCount / totalInClass) * 100) : 0,
    backPct: totalInClass > 0 ? Math.round((inactiveCount / totalInClass) * 100) : 0,
    discPct: 0,
  };

  // Class wise summary calculated strictly from centralized student roster
  const summaryData = classes.map((c) => {
    const stds = students.filter((s) => (s.current_class_name || `${s.class_name} ${s.division}`) === c.name);
    const reg = stds.filter((s) => (s.status || s.account_status || '').toLowerCase() === 'active').length;
    const leave = stds.filter((s) => (s.status || s.account_status || '').toLowerCase() === 'on leave').length;
    const inact = stds.filter((s) => (s.status || s.account_status || '').toLowerCase() === 'inactive').length;
    return {
      cls: c.name,
      total: stds.length,
      regular: reg,
      detained: leave,
      backlog: inact,
      disc: 0,
    };
  });

  // Attention students list referencing real unique students
  const attentionStudents = students
    .filter((s) => parseFloat(s.attendance_rate || s.attendance || 85) < 75 || s.status === 'On Leave' || s.status === 'Inactive')
    .slice(0, 5)
    .map((s) => ({
      roll: s.prn || s.college_id,
      name: s.name || s.full_name,
      issue: parseFloat(s.attendance_rate || s.attendance || 85) < 75 ? `Low Attendance (${s.attendance || `${s.attendance_rate}%`})` : `Status: ${s.status}`,
      status: s.status === 'On Leave' ? 'On Leave' : 'Action Required',
      statusColor: s.status === 'On Leave' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700',
    }));

  // Subject Performance data for selected class
  const subjectPerformance = [
    { subject: 'Data Structures & Algorithms', avg: 78, pass: '92%', color: 'bg-[#3B82F6]' },
    { subject: 'Operating Systems', avg: 72, pass: '88%', color: 'bg-[#06B6D4]' },
    { subject: 'Computer Networks', avg: 68, pass: '85%', color: 'bg-[#10B981]' },
    { subject: 'Database Management Systems', avg: 75, pass: '90%', color: 'bg-[#F97316]' },
    { subject: 'Software Engineering', avg: 70, pass: '87%', color: 'bg-[#EC4899]' },
  ];

  // Upcoming events
  const upcomingEvents = [
    { month: 'OCT', day: '12', title: 'Unit Test 2 (DSA)', time: '10:00 AM - 01:00 PM', badge: selectedClass },
    { month: 'OCT', day: '18', title: 'Internal Marks Submission', location: 'Faculty Portal', badge: selectedClass },
    { month: 'OCT', day: '25', title: 'Class Attendance Review Meeting', location: 'Computer Engineering Dept.', badge: selectedClass },
    { month: 'NOV', day: '05', title: 'Practical Batch Allocation', location: 'Lab No. 3', badge: selectedClass },
    { month: 'NOV', day: '10', title: 'Assignment Submission Deadline', location: 'Data Structures & Algorithms', badge: selectedClass },
  ];

  return (
    <div className="space-y-4 font-sans text-slate-800 max-w-full">
      {/* ================= TOP NAVIGATION BAR ================= */}
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
              placeholder="Search students, classes, subjects..."
              className="w-full pl-9 pr-3 sm:pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all truncate"
            />
          </div>
        </div>

        {/* Right Nav Profile & Notifications */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 relative">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.filter((n) => n.unread).length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                  {notifications.filter((n) => n.unread).length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900">Department Alerts</span>
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
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden ring-2 ring-indigo-500/20 shadow-xs group-hover:ring-indigo-600/40 transition-all">
                <span className="text-white font-bold text-xs">KB</span>
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">Prof. Kirti Borhade</p>
                <p className="text-[10.5px] text-slate-500 font-medium">Academic Dept Admin</p>
                <p className="text-[10px] text-slate-400 font-medium">Computer Engineering</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-3 space-y-2">
                <div className="p-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Prof. Kirti Borhade</p>
                  <p className="text-[11px] text-slate-500">kirti.borhade@comp.nmiet.edu.in</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-md">
                    Academic Admin &bull; Comp Eng
                  </span>
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigateTab('help_support');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-600" />
                    DPDP Privacy Center
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
        userName="Prof. Kirti Borhade"
        roleTitle="Computer Engineering Department"
        description="Monitoring student attendance, continuous internal evaluation, and academic division allocations."
        quote={
          <>
            Knowledge Today <br /> Leadership Tomorrow
          </>
        }
        badgeText="Department Portal"
      />

      {/* ================= 4 PRIMARY METRIC CARDS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          onClick={() => onNavigateTab('students')}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Students</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 mt-2 block">{students.length}</span>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>100% Unique Allocations</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('classes')}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Divisions</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 mt-2 block">{classes.length}</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-1">
            <span>SE, TE &amp; BE Divisions</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('faculty')}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Department Faculty</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 mt-2 block">{faculty.length}</span>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
            <Check className="w-3 h-3" />
            <span>All Mentors Assigned</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('subjects')}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Catalog Courses</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 mt-2 block">{subjects.length}</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-1">
            <span>SPPU 2019 Course Scheme</span>
          </div>
        </div>
      </div>

      {/* ================= DYNAMIC CLASS SELECTOR TILES ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {classes.map((cls) => {
          const isSelected = selectedClass === cls.name;
          const count = getClassStudentCount(cls.name);
          return (
            <button
              key={cls.id || cls.name}
              onClick={() => setSelectedClass(cls.name)}
              className={`p-4 rounded-2xl text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-600/30'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-2xs'
              }`}
            >
              <span className="block text-sm font-extrabold">{cls.name}</span>
              <span className={`block text-xs mt-1 ${isSelected ? 'text-purple-200 font-medium' : 'text-slate-500'}`}>
                {count} Students
              </span>
              <span className={`block text-[10px] mt-2 font-medium ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                Room {cls.room || cls.room_no || '301'}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================= MIDDLE SECTION: CLASS STATS & SUBJECT PERFORMANCE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Class Overview Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{selectedClass} Division Overview</h3>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
              {currentClassInfo.total} Total
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Regular Students</span>
                <span className="font-bold text-slate-900">{currentClassInfo.regular} ({currentClassInfo.regPct}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${currentClassInfo.regPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>On Leave</span>
                <span className="font-bold text-slate-900">{currentClassInfo.detained} ({currentClassInfo.detPct}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${currentClassInfo.detPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Inactive</span>
                <span className="font-bold text-slate-900">{currentClassInfo.backlog} ({currentClassInfo.backPct}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: `${currentClassInfo.backPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Subject Performance for selected class */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{selectedClass} Course Passing Rates</h3>
            <span className="text-xs text-slate-500 font-medium">Unit Test 2 Evaluation</span>
          </div>

          <div className="space-y-3">
            {subjectPerformance.map((sp) => (
              <div key={sp.subject} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span className="truncate pr-2">{sp.subject}</span>
                  <span className="font-bold text-slate-900 shrink-0">{sp.avg}% Avg &bull; {sp.pass} Pass</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${sp.color} rounded-full`} style={{ width: `${sp.avg}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SUMMARY TABLE & ATTENTION LIST ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Class-wise summary table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Department Class Distribution</h3>
            <button
              onClick={() => onNavigateTab('classes')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
            >
              View Class Records &gt;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10.5px] border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Class</th>
                  <th className="px-3 py-2.5">Total</th>
                  <th className="px-3 py-2.5">Regular</th>
                  <th className="px-3 py-2.5">On Leave</th>
                  <th className="px-3 py-2.5">Inactive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summaryData.map((row) => (
                  <tr key={row.cls} className="hover:bg-slate-50/60">
                    <td className="px-3 py-2.5 font-bold text-slate-900">{row.cls}</td>
                    <td className="px-3 py-2.5 font-bold text-purple-700">{row.total}</td>
                    <td className="px-3 py-2.5 font-semibold text-emerald-700">{row.regular}</td>
                    <td className="px-3 py-2.5 font-semibold text-amber-700">{row.detained}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-500">{row.backlog}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attention Students List */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Attention Required</h3>
            <button
              onClick={() => onNavigateTab('students')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
            >
              All &gt;
            </button>
          </div>

          <div className="space-y-2.5">
            {attentionStudents.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No immediate attention items.</p>
            ) : (
              attentionStudents.map((att) => (
                <div key={att.roll} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{att.name}</span>
                    <span className="text-[11px] text-slate-500">{att.issue}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${att.statusColor}`}>
                    {att.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
