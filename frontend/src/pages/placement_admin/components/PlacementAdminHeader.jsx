import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { usePlacementAdmin } from '../../../context/PlacementAdminContext';
import { Search, Bell, ChevronDown, Shield, LogOut, Briefcase } from 'lucide-react';

import { HamburgerButton } from '../../../components/HamburgerButton';

export function PlacementAdminHeader({
  searchQuery = '',
  setSearchQuery = () => {},
  placeholder = 'Search students, drives, companies, jobs...',
  onNavigateTab,
}) {
  const { user, logout } = useAuth();
  const { announcements } = usePlacementAdmin();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const notifications = [
    { id: 1, title: 'TCS Digital Drive Scheduled', desc: 'Online coding round scheduled for BE & TE students on 15 Oct.', time: '15m ago', unread: true },
    { id: 2, title: 'Infosys Shortlist Published', desc: '24 students shortlisted for Technical Interview Round 2.', time: '1h ago', unread: true },
    { id: 3, title: 'Persistent Systems Drive Active', desc: 'Eligibility check completed for 54 student profiles.', time: '3h ago', unread: true },
    { id: 4, title: 'Wipro Elite Phase 1 Concluded', desc: '12 offers rolled out with an average of 6.5 LPA.', time: '1d ago', unread: false },
    { id: 5, title: 'LTI Mindtree Campus Visit', desc: 'Pre-placement talk at College Auditorium scheduled.', time: '2d ago', unread: false },
  ];

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
            className="w-full pl-9 pr-3 sm:pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all truncate"
          />
        </div>
      </div>

      {/* Right Nav: Notification Bell & Profile Dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 relative">
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
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Drawer */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900">Placement Alerts &amp; Updates</span>
                <button
                  onClick={() => setUnreadCount(0)}
                  className="text-[10px] text-purple-600 hover:text-purple-800 font-bold cursor-pointer"
                >
                  Mark all read
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {notifications.map((n, idx) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      idx < unreadCount ? 'bg-purple-50/50 border-purple-100' : 'bg-slate-50 border-slate-100'
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
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  DPDP Placement Data Privacy
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
  );
}
