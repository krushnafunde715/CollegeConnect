import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CentralDataProvider } from './context/CentralDataContext';
import { NavProvider } from './context/NavContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ErrorBoundary } from './components/ErrorBoundary';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from './pages/auth/VerifyEmailPage';
import { InitSetupPage } from './pages/auth/InitSetupPage';

// Portal Components
import { SuperAdminPortal } from './pages/superadmin/SuperAdminPortal';
import { AcademicAdminPortal } from './pages/academic_admin/AcademicAdminPortal';
import { TeacherPortal } from './pages/teacher/TeacherPortal';
import { ExamAdminPortal } from './pages/exam_admin/ExamAdminPortal';
import { PlacementAdminPortal } from './pages/placement_admin/PlacementAdminPortal';
import { StudentPortal } from './pages/student/StudentPortal';

// Icons
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  Settings,
  ShieldCheck,
  BookOpen,
  UserCheck,
  FileCheck2,
  BarChart3,
  CalendarCheck,
  Award,
  Ticket,
  FileText,
  Briefcase,
  User,
  Shield,
  HelpCircle,
  Megaphone,
  Clock,
  Layers,
  Bell
} from 'lucide-react';

function MainApp() {
  const { user, role, isLoading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login', 'forgot-password', 'reset-password', 'verify-email', 'init-setup'
  const [resetTokenData, setResetTokenData] = useState({ token: '', email: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check URL query parameters for direct verification links (e.g. /verify-email?token=... or /reset-password?token=...)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');

    if (window.location.pathname === '/verify-email' || (token && !email)) {
      setAuthView('verify-email');
      if (token) setResetTokenData({ token, email: '' });
    } else if (window.location.pathname === '/reset-password' || (token && email)) {
      setAuthView('reset-password');
      if (token) setResetTokenData({ token, email: email || '' });
    }
  }, []);

  // Reset activeTab to dashboard when user role changes
  useEffect(() => {
    setActiveTab('dashboard');
  }, [role]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide text-indigo-200">
          Loading CollegeConnect Platform...
        </p>
      </div>
    );
  }

  // If unauthenticated, show public auth pages (Shared Login, Forgot Password, Reset Password, Verify Email, Init Setup)
  if (!user) {
    if (authView === 'forgot-password') {
      return <ForgotPasswordPage onNavigate={(view) => setAuthView(view)} />;
    }
    if (authView === 'reset-password') {
      return (
        <ResetPasswordPage
          onNavigate={(view) => setAuthView(view)}
          initialToken={resetTokenData.token}
          initialEmail={resetTokenData.email}
        />
      );
    }
    if (authView === 'verify-email') {
      return (
        <VerifyEmailPage
          onNavigate={(view) => setAuthView(view)}
          initialToken={resetTokenData.token}
        />
      );
    }
    if (authView === 'init-setup') {
      return <InitSetupPage onNavigate={(view) => setAuthView(view)} />;
    }
    return (
      <LoginPage
        onNavigate={(view) => setAuthView(view)}
        onDemoSelect={() => {}}
      />
    );
  }

  // Role Navigation Schemas matching specifications precisely
  const getNavItems = () => {
    switch (role) {
      case 'super_admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'departments', label: 'Departments', icon: Building2 },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'classes', label: 'Classes', icon: Layers },
          { id: 'faculty', label: 'Faculty Management', icon: UserCheck },
          { id: 'academics', label: 'Academic Management', icon: BookOpen },
          { id: 'examination', label: 'Examination', icon: FileText },
          { id: 'placement', label: 'Placement', icon: Briefcase },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          { id: 'user_management', label: 'User Management', icon: Users },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ];
      case 'academic_admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'classes', label: 'Class Records', icon: Layers, hasSubmenu: true },
          { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
          { id: 'subjects', label: 'Subjects', icon: BookOpen },
          { id: 'exams', label: 'Exams & Internal Marks', icon: Award },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
        ];
      case 'teacher':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'students', label: 'My Students', icon: Users },
          { id: 'academic_records', label: 'Academic Records', icon: BookOpen },
          { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
          { id: 'requests', label: 'Student Requests', icon: FileCheck2, badge: 3 },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
        ];
      case 'exam_admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'schedules', label: 'Exam Schedule', icon: Calendar },
          { id: 'exam_management', label: 'Exam Management', icon: Layers },
          { id: 'student_records', label: 'Student Examination Records', icon: Users },
          { id: 'internal_marks', label: 'Internal Marks', icon: FileCheck2 },
          { id: 'results', label: 'Results Management', icon: Award },
          { id: 'hall_tickets', label: 'Hall Tickets', icon: Ticket },
          { id: 'reports', label: 'Examination Reports', icon: BarChart3 },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
        ];
      case 'placement_admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'students', label: 'Students', icon: Users },
          { id: 'drives', label: 'Placement Drives', icon: Briefcase },
          { id: 'companies', label: 'Companies', icon: Building2 },
          { id: 'applications', label: 'Applications', icon: FileText },
          { id: 'announcements', label: 'Announcements', icon: Megaphone },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
        ];
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'academics', label: 'Academic Records', icon: BookOpen },
          { id: 'examination', label: 'Examination', icon: Ticket },
          { id: 'placement', label: 'Placement', icon: Briefcase },
          { id: 'privacy', label: 'Privacy Center', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
          { id: 'help_support', label: 'Help & Support', icon: HelpCircle },
        ];
      default:
        return [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }];
    }
  };

  const getBottomNavItems = () => {
    if (role === 'student') return [];
    return [
      { id: 'access_history', label: 'Access History', icon: Clock },
      { id: 'help_support', label: 'Help & Support', icon: HelpCircle },
    ];
  };

  const navItems = getNavItems();
  const bottomNavItems = getBottomNavItems();

  const renderPortal = () => {
    switch (role) {
      case 'super_admin':
        return <SuperAdminPortal activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'academic_admin':
        return <AcademicAdminPortal activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'teacher':
        return <TeacherPortal activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'exam_admin':
        return <ExamAdminPortal activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'placement_admin':
        return <PlacementAdminPortal activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'student':
        return <StudentPortal activeTab={activeTab} setActiveTab={setActiveTab} />;
      default:
        return (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
            <h3 className="font-bold text-slate-900">Unrecognized Role Authority</h3>
            <p className="text-xs text-slate-500 mt-1">Please contact your administrator.</p>
          </div>
        );
    }
  };

  return (
    <NavProvider activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="min-h-screen bg-[#F4F7FC] flex flex-col font-sans max-w-full overflow-x-hidden">
        <div className="flex flex-1 max-w-full">
          <Sidebar
            navItems={navItems}
            bottomNavItems={bottomNavItems}
            activeTab={activeTab}
            onSelectTab={(tabId) => setActiveTab(tabId)}
          />

          {/* Main Content Area */}
          <main className="flex-1 lg:pl-64 overflow-x-hidden p-3 sm:p-4 lg:p-6 w-full max-w-full min-w-0">
            <div className="w-full max-w-full">
              <ErrorBoundary onReset={() => setActiveTab('dashboard')}>
                {renderPortal()}
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </NavProvider>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <CentralDataProvider>
        <AuthProvider>
          <MainApp />
        </AuthProvider>
      </CentralDataProvider>
    </ToastProvider>
  );
}
