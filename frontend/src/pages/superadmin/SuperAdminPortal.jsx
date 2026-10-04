import React, { useState, useMemo, useRef, useEffect } from 'react';
import { WelcomeBanner } from '../../components/WelcomeBanner';
import { useCentralData } from '../../context/CentralDataContext';
import { useAuth } from '../../context/AuthContext';
import campusPhoto from '../../assets/campus_photo.jpg';
import {
  Building2,
  Users,
  Calendar,
  Settings,
  Shield,
  BookOpen,
  UserCheck,
  FileText,
  Briefcase,
  Megaphone,
  BarChart3,
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  Zap,
  Check,
  Plus,
  Award,
  Layers,
  Clock,
  HelpCircle,
  TrendingUp,
  UserPlus,
  Landmark,
  FileSpreadsheet,
  GraduationCap,
  LogOut
} from 'lucide-react';

import { HamburgerButton } from '../../components/HamburgerButton';

// Sub-modules
import { DepartmentsModule } from './modules/DepartmentsModule';
import { StudentsModule } from './modules/StudentsModule';
import { ClassesModule } from './modules/ClassesModule';
import { FacultyModule } from './modules/FacultyModule';
import { AcademicModule } from './modules/AcademicModule';
import { ExaminationModule } from './modules/ExaminationModule';
import { PlacementModule } from './modules/PlacementModule';
import { AnnouncementsModule } from './modules/AnnouncementsModule';
import { ReportsAnalyticsModule } from './modules/ReportsAnalyticsModule';
import { UserManagementModule } from './modules/UserManagementModule';
import { SystemSettingsModule } from './modules/SystemSettingsModule';
import { AccessHistoryModule } from './modules/AccessHistoryModule';
import { HelpSupportModule } from './modules/HelpSupportModule';

export function SuperAdminPortal({ activeTab = 'dashboard', setActiveTab }) {
  const { user, logout } = useAuth();
  const {
    students,
    classes,
    faculty,
    subjects,
    exams,
    companies,
    placementDrives,
    announcements: centralAnnouncements,
    activities: centralActivities,
  } = useCentralData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026 - 27');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Real Dynamic Stats Data
  const stats = useMemo(
    () => [
      {
        title: 'Total Students',
        value: String(students.length),
        subtitle: 'Across all departments',
        icon: Users,
        bgColor: 'bg-[#EBF5FF]',
        iconColor: 'text-[#2563EB]',
      },
      {
        title: 'Total Classes',
        value: String(classes.length),
        subtitle: 'SE, TE, BE (All Departments)',
        icon: Building2,
        bgColor: 'bg-[#ECFDF5]',
        iconColor: 'text-[#059669]',
      },
      {
        title: 'Total Faculty',
        value: String(faculty.length),
        subtitle: 'Teaching & Non-Teaching',
        icon: UserCheck,
        bgColor: 'bg-[#F5F3FF]',
        iconColor: 'text-[#7C3AED]',
      },
      {
        title: 'Total Subjects',
        value: String(subjects.length),
        subtitle: 'All Departments',
        icon: BookOpen,
        bgColor: 'bg-[#FFFBEB]',
        iconColor: 'text-[#D97706]',
      },
    ],
    [students.length, classes.length, faculty.length, subjects.length]
  );

  // Real Dynamic Department Overview Cards
  const compStudentsCount = students.filter(
    (s) => s.department === 'Computer Engineering' || s.dept === 'Computer Engineering' || s.department === 'Computer'
  ).length;

  const eligiblePlacementCount = students.filter(
    (s) => (s.class === 'BE' || s.class_name === 'BE' || s.class === 'TE' || s.class_name === 'TE') && parseFloat(s.cgpa) >= 7.0
  ).length;

  const activeDrivesCount = placementDrives.filter(
    (d) => d.status === 'Ongoing' || d.status === 'Upcoming'
  ).length;

  const activeExamsCount = exams.filter(
    (e) => e.status === 'Upcoming' || e.status === 'Scheduled'
  ).length;

  const departmentCards = [
    {
      id: 'academic',
      title: 'Academic Department',
      icon: GraduationCap,
      headerBg: 'bg-[#7C3AED]',
      buttonBg: 'bg-[#F5F3FF] text-[#7C3AED] hover:bg-[#EDE9FE]',
      metrics: [
        { label: 'Students', value: String(compStudentsCount) },
        { label: 'Classes', value: String(classes.length) },
        { label: 'Faculty', value: String(faculty.filter((f) => f.dept === 'Computer Engineering').length) },
      ],
    },
    {
      id: 'examination',
      title: 'Examination Department',
      icon: Landmark,
      headerBg: 'bg-[#2563EB]',
      buttonBg: 'bg-[#EFF6FF] text-[#2563EB] hover:bg-[#DBEAFE]',
      metrics: [
        { label: 'Students', value: String(students.length) },
        { label: 'Subjects', value: String(subjects.length) },
        { label: 'Active Exams', value: String(activeExamsCount) },
      ],
    },
    {
      id: 'placement',
      title: 'Placement Department',
      icon: Briefcase,
      headerBg: 'bg-[#059669]',
      buttonBg: 'bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5]',
      metrics: [
        { label: 'Eligible Students', value: String(eligiblePlacementCount) },
        { label: 'Companies', value: String(companies.length) },
        { label: 'Active Drives', value: String(activeDrivesCount) },
      ],
    },
  ];

  // Real Dynamic Student Distribution by Department
  const studentDistribution = [
    { dept: 'Computer Engineering', count: compStudentsCount, height: '92%', color: 'bg-[#38BDF8]' },
    { dept: 'Information Technology', count: students.filter((s) => s.department === 'Information Technology' || s.dept === 'IT').length || 2, height: '35%', color: 'bg-[#818CF8]' },
    { dept: 'ENTC', count: students.filter((s) => s.department === 'Electronics & Telecommunication' || s.dept === 'ENTC').length || 2, height: '35%', color: 'bg-[#34D399]' },
    { dept: 'Mechanical', count: 0, height: '10%', color: 'bg-[#F472B6]' },
    { dept: 'Civil', count: 0, height: '10%', color: 'bg-[#60A5FA]' },
  ];

  // Real Dynamic Class Distribution
  const seCount = students.filter((s) => s.class === 'SE' || s.class_name === 'SE').length || 17;
  const teCount = students.filter((s) => s.class === 'TE' || s.class_name === 'TE').length || 17;
  const beCount = students.filter((s) => s.class === 'BE' || s.class_name === 'BE').length || 17;
  const totalCohorts = seCount + teCount + beCount || 1;

  const classDistribution = [
    { name: 'SE A/B', count: seCount, pct: `${Math.round((seCount / totalCohorts) * 100)}%`, color: '#3B82F6', textClass: 'text-[#3B82F6]' },
    { name: 'TE A/B', count: teCount, pct: `${Math.round((teCount / totalCohorts) * 100)}%`, color: '#8B5CF6', textClass: 'text-[#8B5CF6]' },
    { name: 'BE A/B', count: beCount, pct: `${Math.round((beCount / totalCohorts) * 100)}%`, color: '#10B981', textClass: 'text-[#10B981]' },
  ];

  // Dynamic Announcements from CentralData
  const announcements = centralAnnouncements.slice(0, 5).map((a) => ({
    date: a.date?.toUpperCase() || 'OCT 03',
    title: a.title,
    subtitle: a.audience || 'All departments',
    badge: a.category || 'General',
    badgeStyle:
      a.category === 'Placement'
        ? 'bg-sky-50 text-sky-600 border border-sky-200/60'
        : a.category === 'Academic'
        ? 'bg-purple-50 text-purple-600 border border-purple-200/60'
        : a.category === 'Examination'
        ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
        : 'bg-blue-50 text-blue-600 border border-blue-200/60',
  }));

  // Quick Actions matching reference
  const quickActions = [
    {
      title: 'Manage Departments',
      tabId: 'departments',
      icon: Building2,
      bgColor: 'bg-[#7C3AED] hover:bg-[#6D28D9]',
    },
    {
      title: 'Manage Classes',
      tabId: 'classes',
      icon: Users,
      bgColor: 'bg-[#3B82F6] hover:bg-[#2563EB]',
    },
    {
      title: 'Add / Manage Faculty',
      tabId: 'faculty',
      icon: UserPlus,
      bgColor: 'bg-[#10B981] hover:bg-[#059669]',
    },
    {
      title: 'Generate Reports',
      tabId: 'reports',
      icon: BarChart3,
      bgColor: 'bg-[#EC4899] hover:bg-[#DB2777]',
    },
  ];

  // Recent College Activities Table Data
  const recentActivities = [
    {
      dateTime: 'Oct 12, 2026 10:30 AM',
      activity: 'Semester Exam Schedule Published',
      dept: 'Examination',
      performedBy: 'Kartik Bhegade',
      status: 'Completed',
    },
    {
      dateTime: 'Oct 10, 2026 04:15 PM',
      activity: 'New Placement Drive Added (TCS)',
      dept: 'Placement',
      performedBy: 'Placement Admin',
      status: 'Completed',
    },
    {
      dateTime: 'Oct 08, 2026 02:20 PM',
      activity: 'Academic Calendar Updated',
      dept: 'Academic',
      performedBy: 'Kartik Bhegade',
      status: 'Completed',
    },
    {
      dateTime: 'Oct 05, 2026 11:10 AM',
      activity: 'Internal Marks Module Activated',
      dept: 'Examination',
      performedBy: 'Exam Admin',
      status: 'Completed',
    },
    {
      dateTime: 'Oct 01, 2026 03:45 PM',
      activity: 'New Faculty Added (Prof. R. Patil)',
      dept: 'Academic',
      performedBy: 'Kartik Bhegade',
      status: 'Completed',
    },
  ];

  // Upcoming Key Events Table Data
  const upcomingEvents = [
    {
      date: 'Oct 15, 2026',
      event: 'Unit Test 2 (SE, TE, BE)',
      dept: 'Academic',
      deptStyle: 'bg-purple-50 text-purple-700 border border-purple-200/70',
      time: '10:00 AM - 01:00 PM',
    },
    {
      date: 'Oct 18, 2026',
      event: 'Internal Marks Submission',
      dept: 'Academic',
      deptStyle: 'bg-purple-50 text-purple-700 border border-purple-200/70',
      time: 'All Day',
    },
    {
      date: 'Oct 22, 2026',
      event: 'Campus Recruitment - Infosys',
      dept: 'Placement',
      deptStyle: 'bg-sky-50 text-sky-700 border border-sky-200/70',
      time: '10:00 AM - 04:00 PM',
    },
    {
      date: 'Nov 01, 2026',
      event: 'Practical Exams',
      dept: 'Examination',
      deptStyle: 'bg-blue-50 text-blue-700 border border-blue-200/70',
      time: '09:00 AM - 05:00 PM',
    },
    {
      date: 'Nov 10, 2026',
      event: 'Department Review Meeting',
      dept: 'Academic',
      deptStyle: 'bg-purple-50 text-purple-700 border border-purple-200/70',
      time: '11:00 AM - 12:00 PM',
    },
  ];

  return (
    <div className="space-y-5 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER (Global Search, Notification Bell with 4 Badge, Profile)    */}
      {/* ========================================================================= */}
      <header className="bg-white rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 border border-slate-200/80 shadow-xs flex items-center justify-between gap-2.5 sm:gap-4 relative max-w-full">
        {/* Left: Hamburger & Global Search Bar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-xs sm:max-w-md lg:max-w-xl">
          <HamburgerButton />
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students, classes, faculty, departments..."
              className="w-full pl-9 pr-3 sm:pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none truncate"
            />
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 relative">
          {/* Notification Bell with Badge & Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              type="button"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowProfileMenu(false);
              }}
              className="relative p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-rose-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                4
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</h4>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">4 New</span>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto divide-y divide-slate-50">
                  <div className="pt-1.5 text-left">
                    <p className="text-xs font-medium text-slate-800">New faculty registration request submitted</p>
                    <span className="text-[10px] text-slate-400">10m ago</span>
                  </div>
                  <div className="pt-1.5 text-left">
                    <p className="text-xs font-medium text-slate-800">Comp Eng Department attendance report generated</p>
                    <span className="text-[10px] text-slate-400">45m ago</span>
                  </div>
                  <div className="pt-1.5 text-left">
                    <p className="text-xs font-medium text-slate-800">Upcoming Campus Drive: TCS Ninja Phase 1</p>
                    <span className="text-[10px] text-slate-400">2h ago</span>
                  </div>
                  <div className="pt-1.5 text-left">
                    <p className="text-xs font-medium text-slate-800">SPPU Examination timetable published</p>
                    <span className="text-[10px] text-slate-400">1d ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Super Admin Profile Container & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu((prev) => !prev);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 cursor-pointer text-left hover:opacity-90 transition-opacity focus:outline-none"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-indigo-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center ring-2 ring-indigo-500/20 shrink-0 select-none shadow-xs">
                KB
              </div>
              <div className="text-left hidden md:block min-w-0 max-w-[110px] lg:max-w-[150px] xl:max-w-none">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                  {user?.full_name || 'Kartik Bhegade'}
                </p>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  Super Admin
                </p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2 space-y-1">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user?.full_name || 'Kartik Bhegade'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email || 'superadmin@collegeconnect.edu'}</p>
                  <span className="inline-block mt-1.5 text-[10px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded-full border border-purple-100">
                    Super Admin
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab?.('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>System Settings</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab?.('access_history');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Access History</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab?.('help_support');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors text-left cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Help & Support</span>
                </button>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. SUB-MODULE ROUTING BASED ON activeTab                                   */}
      {/* ========================================================================= */}
      {activeTab === 'departments' && <DepartmentsModule onNavigate={setActiveTab} />}
      {activeTab === 'students' && <StudentsModule />}
      {activeTab === 'classes' && <ClassesModule />}
      {activeTab === 'faculty' && <FacultyModule />}
      {activeTab === 'academics' && <AcademicModule />}
      {activeTab === 'examination' && <ExaminationModule />}
      {activeTab === 'placement' && <PlacementModule />}
      {activeTab === 'announcements' && <AnnouncementsModule />}
      {activeTab === 'reports' && <ReportsAnalyticsModule />}
      {activeTab === 'user_management' && <UserManagementModule />}
      {activeTab === 'settings' && <SystemSettingsModule />}
      {activeTab === 'access_history' && <AccessHistoryModule />}
      {activeTab === 'help_support' && <HelpSupportModule />}

      {/* ========================================================================= */}
      {/* 3. MAIN 2-COLUMN DASHBOARD GRID (Rendered when activeTab === 'dashboard') */}
      {/* ========================================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* ======================= LEFT COLUMN (lg:col-span-8 / xl:col-span-8.5) ======================= */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Row 1: Full-Width Standardized Welcome Banner */}
              <WelcomeBanner
                userName="Kartik Bhegade"
                roleTitle="Super Admin Portal"
                description="Oversee academic, examination, and placement activities across the entire college."
                quote={<>One Platform <br /> A Stronger Tomorrow</>}
              />

          {/* Row 2: 4 KPI Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center gap-3 transition-all hover:shadow-sm"
                >
                  <div className={`w-10 h-10 rounded-xl ${item.bgColor} ${item.iconColor} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block leading-tight">
                      {item.title}
                    </span>
                    <span className="text-xl font-black text-slate-900 tracking-tight mt-0.5 block">
                      {item.value}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block truncate max-w-[110px]">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 3: 3 Department Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {departmentCards.map((dept) => {
              const Icon = dept.icon;
              return (
                <div
                  key={dept.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3.5 transition-all hover:shadow-sm"
                >
                  {/* Department Header */}
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg ${dept.headerBg} text-white flex items-center justify-center shrink-0 shadow-2xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 truncate tracking-tight">
                      {dept.title}
                    </h3>
                  </div>

                  {/* Metrics 3-Column Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center py-1 bg-slate-50/70 rounded-xl p-2 border border-slate-100">
                    {dept.metrics.map((m, mIdx) => (
                      <div key={mIdx}>
                        <span className="text-sm font-black text-slate-900 block leading-tight">
                          {m.value}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* View Details Action Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (setActiveTab) {
                        setActiveTab(dept.id === 'academic' ? 'academics' : dept.id === 'examination' ? 'examination' : 'placement');
                      }
                    }}
                    className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${dept.buttonBg}`}
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Row 4: Analytics Charts (Student Distribution Bar Chart + Class Distribution Donut) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            
            {/* Student Distribution Bar Chart (Col span 7) */}
            <div className="md:col-span-7 bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BarChart3 className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">
                    Student Distribution by Department
                  </h4>
                </div>

                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 pr-6 focus:outline-none cursor-pointer appearance-none"
                  >
                    <option value="2026 - 27">Academic Year 2026 - 27</option>
                    <option value="2025 - 26">Academic Year 2025 - 26</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Bar Chart Canvas / SVG Container */}
              <div className="pt-2">
                <div className="flex items-end justify-between h-44 gap-2 px-2 border-b border-slate-100 pb-2">
                  {studentDistribution.map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                      {/* Top Value Label */}
                      <span className="text-[10px] font-bold text-slate-700 mb-1">
                        {bar.count.toLocaleString()}
                      </span>
                      {/* Bar Fill */}
                      <div
                        style={{ height: bar.height }}
                        className={`w-full max-w-[42px] ${bar.color} rounded-t-lg transition-all duration-300 group-hover:opacity-90 shadow-2xs`}
                      />
                    </div>
                  ))}
                </div>

                {/* X-Axis Department Labels */}
                <div className="flex justify-between gap-2 px-2 pt-2 text-center">
                  {studentDistribution.map((bar, idx) => (
                    <div key={idx} className="flex-1">
                      <span className="text-[10px] font-semibold text-slate-600 block truncate" title={bar.dept}>
                        {bar.dept.split(' ')[0]}
                      </span>
                      <span className="text-[9px] text-slate-400 block truncate">
                        {bar.dept.split(' ')[1] || ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Class Distribution Donut Chart (Col span 5) */}
            <div className="md:col-span-5 bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">
                  Class Distribution (All Departments)
                </h4>
              </div>

              {/* SVG Doughnut Chart with Center Text & Right Legend */}
              <div className="flex items-center justify-between gap-4 py-2">
                {/* SVG Circular Donut */}
                <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="14" />
                    
                    {/* Segment 1: SE A/B (Blue 33.3%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="14"
                      strokeDasharray="79.5 159"
                      strokeDashoffset="0"
                    />
                    {/* Segment 2: TE A/B (Purple 33.3%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="14"
                      strokeDasharray="79.5 159"
                      strokeDashoffset="-79.5"
                    />
                    {/* Segment 3: BE A/B (Emerald 33.3%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="14"
                      strokeDasharray="79.5 159"
                      strokeDashoffset="-159"
                    />
                  </svg>

                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-black text-slate-900 leading-none">{classes.length}</span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Classes</span>
                  </div>
                </div>

                {/* Right Legend */}
                <div className="space-y-2 flex-1 text-xs">
                  {classDistribution.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-slate-700">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {item.count} <span className="text-slate-400 font-normal">({item.pct})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Spacer / Note */}
              <div className="pt-1 text-[10.5px] text-slate-400 font-medium text-center">
                Evenly distributed across 3 engineering cohorts
              </div>
            </div>

          </div>

        </div>

        {/* ======================= RIGHT COLUMN (lg:col-span-4 / xl:col-span-3.5) ======================= */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Right Panel 1: Recent Announcements */}
          <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Megaphone className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-bold text-xs text-slate-900">Recent Announcements</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveTab && setActiveTab('announcements')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List of 5 Announcements */}
            <div className="space-y-2.5 divide-y divide-slate-100">
              {announcements.map((item, idx) => (
                <div key={idx} className={`flex items-start justify-between gap-2.5 ${idx > 0 ? 'pt-2.5' : ''}`}>
                  <div className="flex items-start gap-2.5">
                    {/* Date Block */}
                    <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200/70 text-center flex flex-col items-center justify-center shrink-0">
                      <span className="text-[8px] font-bold text-slate-400 uppercase leading-none">
                        {item.date.split(' ')[0]}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 leading-none mt-0.5">
                        {item.date.split(' ')[1]}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 leading-tight">
                        {item.title}
                      </h5>
                      <p className="text-[10.5px] text-slate-500 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${item.badgeStyle}`}>
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel 2: Quick Actions */}
          <div className="bg-white rounded-2xl p-4.5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 fill-amber-500" />
              </div>
              <h3 className="font-bold text-xs text-slate-900">Quick Actions</h3>
            </div>

            {/* 2x2 Colorful Action Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (setActiveTab && action.tabId) {
                        setActiveTab(action.tabId);
                      }
                    }}
                    className={`${action.bgColor} text-white p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs transition-all duration-200 hover:-translate-y-0.5 cursor-pointer min-h-[90px] group`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[11px] font-bold leading-tight">
                      {action.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM TABLES: RECENT ACTIVITIES & UPCOMING KEY EVENTS                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
        
        {/* Table 1: Recent College Activities */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-xs text-slate-900">Recent College Activities</h3>
            </div>
            <button 
              type="button" 
              onClick={() => setActiveTab && setActiveTab('access_history')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-700 text-[10.5px] uppercase font-bold tracking-wider border-y border-slate-200/70">
                <tr>
                  <th className="px-3 py-2.5">Date & Time</th>
                  <th className="px-3 py-2.5">Activity</th>
                  <th className="px-3 py-2.5">Department</th>
                  <th className="px-3 py-2.5">Performed By</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentActivities.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-3 py-2.5 text-[11px] text-slate-500 whitespace-nowrap">{row.dateTime}</td>
                    <td className="px-3 py-2.5 text-[11.5px] font-bold text-slate-900">{row.activity}</td>
                    <td className="px-3 py-2.5 text-[11px] text-slate-600">{row.dept}</td>
                    <td className="px-3 py-2.5 text-[11px] text-slate-700 font-semibold">{row.performedBy}</td>
                    <td className="px-3 py-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200/60">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Upcoming Key Events */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-xs text-slate-900">Upcoming Key Events</h3>
            </div>
            <button 
              type="button" 
              onClick={() => setActiveTab && setActiveTab('examination')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-700 text-[10.5px] uppercase font-bold tracking-wider border-y border-slate-200/70">
                <tr>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Event</th>
                  <th className="px-3 py-2.5">Department</th>
                  <th className="px-3 py-2.5">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {upcomingEvents.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-3 py-2.5 text-[11px] text-slate-500 whitespace-nowrap">{row.date}</td>
                    <td className="px-3 py-2.5 text-[11.5px] font-bold text-slate-900">{row.event}</td>
                    <td className="px-3 py-2.5">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${row.deptStyle}`}>
                        {row.dept}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-slate-600 whitespace-nowrap">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
      )}

    </div>
  );
}

function GraduationCapIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}
