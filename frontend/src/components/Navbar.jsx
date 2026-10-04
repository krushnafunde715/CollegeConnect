import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Badge } from './Badge';
import { PrivacyNoticeModal } from './PrivacyNoticeModal';
import { DevMailboxModal } from './DevMailboxModal';
import {
  GraduationCap,
  LogOut,
  ShieldCheck,
  Mail,
  User as UserIcon,
  Building,
  Menu
} from 'lucide-react';

export function Navbar({ onToggleSidebar, onNavigateReset }) {
  const { user, role, departmentName, logout, systemStatus } = useAuth();
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDevMailbox, setShowDevMailbox] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between px-4 lg:px-8 h-16">
          {/* Left: Brand & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 ring-1 ring-white/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 tracking-tight text-base">CollegeConnect</span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    DPDP 2026
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden md:block">
                  {systemStatus?.institution_name || 'Institute of Technology'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Actions, Badges & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Dev Mailbox Simulator Trigger */}
            <button
              onClick={() => setShowDevMailbox(true)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold transition-colors shadow-2xs"
              title="View captured verification links & tokens in local development"
            >
              <Mail className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Dev Outbox</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </button>

            {/* Privacy Transparency Trigger */}
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-semibold transition-colors shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Privacy Notice</span>
            </button>

            {/* Department Scoped Indicator */}
            {departmentName && (
              <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-800">{departmentName}</span>
              </div>
            )}

            {/* User Profile Card */}
            {user && (
              <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{user.full_name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{user.email}</p>
                </div>

                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-indigo-500/20">
                  {user.full_name?.charAt(0) || 'U'}
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Sign out of your account"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Privacy Notice Modal */}
      <PrivacyNoticeModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      {/* Dev Mailbox Modal */}
      <DevMailboxModal
        isOpen={showDevMailbox}
        onClose={() => setShowDevMailbox(false)}
        onNavigateVerify={onNavigateReset}
      />
    </>
  );
}
