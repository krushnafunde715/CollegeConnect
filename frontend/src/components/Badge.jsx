import React from 'react';

export function Badge({ children, variant = 'default', size = 'md' }) {
  const variantStyles = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20',
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20',
    pending: 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20',
    pending_verification: 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20',
    in_review: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500/20',
    open: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20',
    suspended: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/20',
    disabled: 'bg-slate-100 text-slate-700 border-slate-200 ring-1 ring-slate-500/20',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/20',
    super_admin: 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/20',
    academic_admin: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500/20',
    exam_admin: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20',
    placement_admin: 'bg-cyan-50 text-cyan-700 border-cyan-200 ring-1 ring-cyan-500/20',
    teacher: 'bg-teal-50 text-teal-700 border-teal-200 ring-1 ring-teal-500/20',
    student: 'bg-slate-100 text-slate-800 border-slate-200 ring-1 ring-slate-400/20',
    default: 'bg-slate-100 text-slate-700 border-slate-200 ring-1 ring-slate-400/20',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-semibold',
    lg: 'text-sm px-3 py-1.5 rounded-full font-semibold',
  };

  const style = variantStyles[variant.toLowerCase()] || variantStyles.default;
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  return (
    <span className={`inline-flex items-center gap-1.5 border capitalize ${style} ${sizeClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {children}
    </span>
  );
}
