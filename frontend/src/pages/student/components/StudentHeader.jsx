import React, { useState } from 'react';
import { Search, Bell, ChevronDown, User, GraduationCap, Shield, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useStudent } from '../../../context/StudentContext';
import { useToast } from '../../../context/ToastContext';

import { HamburgerButton } from '../../../components/HamburgerButton';

export function StudentHeader({ onNavigateTab }) {
  const { user, logout } = useAuth();
  const { studentProfile, notifications, unreadCount, markAllNotificationsAsRead } = useStudent();
  const { info } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const displayName = studentProfile?.name || user?.full_name || 'Krushna Funde';
  const displayProgram = studentProfile?.program || 'BE Computer Engineering';
  const displayPrn = studentProfile?.prn || user?.college_id || 'CE2022001';
  const initials = displayName ? displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'KF';

  const handleNavigate = (tab) => {
    setShowProfileMenu(false);
    setShowNotifications(false);
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  return (
    <div className="bg-white rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2.5 sm:gap-4 font-sans max-w-full">
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
                    markAllNotificationsAsRead();
                  }}
                  className="text-[11px] text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {(notifications || []).map((item) => (
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
              <div className="p-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => handleNavigate('notifications')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View All Notifications
                </button>
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
                  onClick={() => handleNavigate('profile')}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  My Profile
                </button>
                <button
                  onClick={() => handleNavigate('academics')}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  Academic Records
                </button>
                <button
                  onClick={() => handleNavigate('privacy')}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Privacy Center
                </button>
                <button
                  onClick={() => handleNavigate('help_support')}
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
  );
}
