import React from 'react';
import { Menu } from 'lucide-react';
import { useNav } from '../context/NavContext';

export function HamburgerButton({ className = '' }) {
  const { toggleSidebar } = useNav();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className={`lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${className}`}
      aria-label="Toggle navigation drawer"
      title="Open Menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
