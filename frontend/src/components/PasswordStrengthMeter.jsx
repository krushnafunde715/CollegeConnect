import React from 'react';
import { Check, X } from 'lucide-react';

export function PasswordStrengthMeter({ password = '' }) {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { label: 'One number (0-9)', met: /[0-9]/.test(password) },
    { label: 'One special symbol (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const metCount = requirements.filter((r) => r.met).length;
  const strengthColor =
    metCount <= 2 ? 'bg-rose-500' : metCount <= 4 ? 'bg-amber-500' : 'bg-emerald-500';
  const strengthLabel = metCount <= 2 ? 'Weak' : metCount <= 4 ? 'Moderate' : 'Strong & Compliant';

  return (
    <div className="mt-3 space-y-2 text-xs">
      <div className="flex items-center justify-between text-slate-600 font-medium">
        <span>Password Security:</span>
        <span className={metCount === 5 ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>
          {strengthLabel}
        </span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex gap-1">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`h-full flex-1 rounded-full transition-all duration-300 ${
              step <= metCount ? strengthColor : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-slate-500">
        {requirements.map((req, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            {req.met ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            )}
            <span className={req.met ? 'text-slate-700' : 'text-slate-400'}>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
