import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNav } from '../context/NavContext';
import { Modal } from './Modal';
import { Badge } from './Badge';
import { X, ShieldAlert, CheckCircle2, LogOut, AlertTriangle, Building } from 'lucide-react';

export function Sidebar({ navItems = [], bottomNavItems = [], activeTab, onSelectTab, isOpen, onClose }) {
  const { user, role, departmentName, logout } = useAuth();
  const nav = useNav();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const effectiveIsOpen = isOpen !== undefined ? isOpen : nav.isSidebarOpen;
  const effectiveClose = onClose || nav.closeSidebar;
  const effectiveActiveTab = activeTab !== undefined ? activeTab : nav.activeTab;
  const effectiveSelectTab = onSelectTab || nav.setActiveTab;

  const roleTitles = {
    super_admin: 'Super College Admin',
    academic_admin: 'Academic Dept Admin',
    exam_admin: 'Examination Administrator',
    placement_admin: 'Placement Dept Admin',
    teacher: 'Class Teacher / Faculty',
    student: 'Student Portal',
  };

  const currentRoleTitle = roleTitles[role] || 'Institutional User';

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    if (effectiveClose) effectiveClose();
    if (logout) logout();
  };

  return (
    <>
      {/* Mobile / Tablet Backdrop */}
      {effectiveIsOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={effectiveClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-64 bg-[#0F172A] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          effectiveIsOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
        aria-label="Sidebar Navigation"
      >
        {/* Top Logo & Portal Branding Header */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 ring-1 ring-white/20 shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                  <path d="M22 10v6" />
                  <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-extrabold text-white tracking-tight leading-tight">CollegeConnect</h1>
                <p className="text-[11px] font-semibold text-slate-300 tracking-wide">
                  {role === 'academic_admin' ? 'Academic Portal' : role === 'super_admin' ? 'Super Admin Portal' : role === 'exam_admin' ? 'Examination Portal' : role === 'placement_admin' ? 'Placement Portal' : role === 'teacher' ? 'Class Teacher Portal' : currentRoleTitle}
                </p>
              </div>
            </div>
            <button
              onClick={effectiveClose}
              className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label="Close Navigation Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Department Badges */}
          {role === 'academic_admin' && (
            <div className="mt-2.5">
              <span className="inline-block px-3 py-1 bg-[#6B46FE] text-white text-[11px] font-bold rounded-full shadow-xs">
                Computer Engineering
              </span>
            </div>
          )}
          {role === 'exam_admin' && (
            <div className="mt-2.5">
              <span className="inline-block px-3 py-1 bg-[#6B46FE] text-white text-[11px] font-bold rounded-full shadow-xs">
                Examination Department
              </span>
            </div>
          )}
          {role === 'teacher' && (
            <div className="mt-2.5">
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold rounded-full shadow-xs">
                TE Computer — Div A
              </span>
            </div>
          )}
        </div>

        {/* Primary Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = effectiveActiveTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  effectiveSelectTab(item.id);
                  if (effectiveClose) effectiveClose();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#635BFF] to-[#7B61FF] text-white shadow-md shadow-indigo-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 font-medium'
                }`}
              >
                {Icon && typeof Icon === 'function' ? (
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                ) : null}
                <span className="flex-1 truncate">{item.label}</span>
                {item.hasSubmenu && (
                  <span className="text-slate-500 text-xs">&gt;</span>
                )}
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section: Department Info Card & Support */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/20">
          {role === 'academic_admin' && (
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-300">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 7v14M21 7v14M6 3h12a2 2 0 0 1 2 2v2H4V5a2 2 0 0 1 2-2zM9 10h2M13 10h2M9 14h2M13 14h2M9 18h2M13 18h2"/></svg>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">My Department</span>
                  <span className="text-xs font-bold text-white block">Computer Engineering</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight pt-1">
                You can only access data of this department.
              </p>
            </div>
          )}

          {role === 'exam_admin' && (
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-300 shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Examination Department</span>
                  <span className="text-[10.5px] text-slate-400 block font-medium">Examination Administrator</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium pt-0.5">
                AY 2024 - 2025
              </p>
            </div>
          )}

          {role === 'placement_admin' && (
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-600/30 flex items-center justify-center text-purple-300 shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Placement Department</span>
                  <span className="text-[10.5px] text-slate-400 block font-medium">Placement Department Admin</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium pt-0.5">
                AY 2024 - 2025
              </p>
            </div>
          )}

          {role === 'teacher' && (
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-300 shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">TE Computer Engg</span>
                  <span className="text-[10.5px] text-slate-400 block font-medium">Division A • Sem V</span>
                </div>
              </div>
              <p className="text-[10px] text-blue-400/90 font-semibold pt-0.5">
                Prof. Sonal Kadam (Class Teacher)
              </p>
            </div>
          )}

          {role === 'student' && (
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-300 shrink-0 font-bold text-xs">
                  {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'KF'}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block truncate">{user?.full_name || 'Krushna Funde'}</span>
                  <span className="text-[10.5px] text-slate-400 block font-medium">BE Computer Engg</span>
                </div>
              </div>
              <p className="text-[10px] text-blue-400 font-medium pt-0.5">
                PRN: {user?.college_id || '21CE042'} • AY 2026-27
              </p>
            </div>
          )}

          {bottomNavItems.length > 0 &&
            bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = effectiveActiveTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    effectiveSelectTab(item.id);
                    if (effectiveClose) effectiveClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  {Icon && typeof Icon === 'function' ? (
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  ) : null}
                  <span className="flex-1 truncate">{item.label}</span>
                </button>
              );
            })}

          {/* Subtle Divider before Logout */}
          <div className="border-t border-slate-800/80 my-1 pt-1">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 active:bg-rose-500/20 group cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0 text-rose-400/80 group-hover:text-rose-400 transition-colors" />
              <span className="flex-1 truncate">Logout</span>
            </button>
          </div>
        </div>

        {/* DPDP Compliance Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="truncate">Strict DPDP Scopes & Auditing Enforced</span>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <Modal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          title="Confirm Sign Out"
          subtitle="Are you sure you want to end your current active session?"
        >
          <div className="space-y-4 py-1">
            <div className="flex items-start gap-3 p-3.5 bg-rose-50/80 border border-rose-100 rounded-xl text-rose-900">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-rose-950">You will be logged out of CollegeConnect.</p>
                <p className="text-rose-700 leading-relaxed">
                  Your active authentication session and security tokens will be terminated. Any unsaved edits will be discarded.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Yes, Sign Out
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
