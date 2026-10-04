import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useCompEngData } from '../../../context/CompEngDataContext';
import { Search, Bell, ChevronDown, Building2, LogOut, CheckCircle2, BookOpen, Users } from 'lucide-react';
import { HamburgerButton } from '../../../components/HamburgerButton';

export function AcademicAdminHeader({
  searchQuery = '',
  setSearchQuery = () => {},
  placeholder = 'Search students, classes, subjects, faculty...',
  onNavigateTab,
}) {
  const { user, logout, departmentName } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notifications = [
    { id: 1, title: 'Attendance Alert', desc: 'Students with attendance < 75% identified in SE A.', time: '10m ago', unread: true },
    { id: 2, title: 'Marks Moderation', desc: 'Unit Test 2 internal assessment marks verified.', time: '1h ago', unread: true },
    { id: 3, title: 'DPDP Privacy Log', desc: 'Quarterly student data privacy access review verified.', time: '4h ago', unread: false },
    { id: 4, title: 'Circular Published', desc: 'Mini-project guidelines broadcast to SE & TE cohorts.', time: '1d ago', unread: false },
  ];

  const displayName = user?.full_name || 'Prof. Kirti Borhade';
  const displayRole = `${departmentName || 'Computer Engineering'} Admin`;
  const initials = displayName
    .split(' ')
    .filter((n) => !n.startsWith('Prof.'))
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'KB';

  const handleNavigate = (tab) => {
    setShowProfileMenu(false);
    setShowNotifications(false);
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  return (
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
            placeholder={placeholder}
            className="w-full pl-9 pr-3 sm:pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all truncate"
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
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Department Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">Department Alerts</span>
                <button
                  onClick={() => setUnreadCount(0)}
                  className="text-[11px] text-indigo-600 hover:underline font-semibold cursor-pointer"
                >
                  Mark all read
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer"
                    onClick={() => setShowNotifications(false)}
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

        {/* Profile Card */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200 cursor-pointer text-left group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs ring-2 ring-purple-100 shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block min-w-0">
              <span className="text-xs font-bold text-slate-900 block leading-tight truncate">
                {displayName}
              </span>
              <span className="text-[10.5px] text-slate-500 block leading-tight font-medium truncate">
                {displayRole}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{displayName}</p>
                <p className="text-[11px] text-slate-500">Department Admin</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                  {departmentName || 'Computer Engineering'}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={() => handleNavigate('students')}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-indigo-600" />
                  Students Directory
                </button>
                <button
                  onClick={() => handleNavigate('classes')}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Class Records
                </button>
                <button
                  onClick={() => handleNavigate('subjects')}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Curriculum & Subjects
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={logout}
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
  );
}
