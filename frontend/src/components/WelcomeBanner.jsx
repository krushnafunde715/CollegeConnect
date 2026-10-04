import React from 'react';
import compEngCampusPhoto from '../assets/comp_eng_campus.png';

/**
 * Standardized Welcome Banner across all CollegeConnect portals.
 * Master design reference: Placement Department Dashboard Welcome Banner.
 *
 * @param {string} userName - Full name to display (e.g. "Prof. Satyajit Sirsat", "Krushna Funde")
 * @param {string} roleTitle - Role or Department title (e.g. "Placement Department", "BE Computer Engineering")
 * @param {string} description - Role-specific summary/description text
 * @param {string|React.ReactNode} quote - Quote text to display in the floating quote card
 * @param {string} [gradientClass] - Optional custom background gradient class
 * @param {string} [accentColorClass] - Optional quote underline accent color (default: 'bg-[#6B46FE]')
 */
export function WelcomeBanner({
  userName,
  roleTitle,
  description,
  quote,
  gradientClass = 'bg-gradient-to-r from-[#F5F3FF] via-[#EDE9FE] to-[#DBEAFE] border border-purple-100/90',
  accentColorClass = 'bg-[#6B46FE]',
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl ${gradientClass} p-6 sm:p-7 shadow-xs font-sans`}>
      {/* Campus Image on Right */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 bg-cover bg-no-repeat pointer-events-none opacity-85"
        style={{
          backgroundImage: `url(${compEngCampusPhoto})`,
          backgroundPosition: 'center 40%',
          maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,1) 60%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 15%, rgba(0,0,0,1) 60%)',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl space-y-1.5">
          <span className="text-xs font-semibold text-slate-600 block">
            Welcome back,
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-2">
            {userName}! 👋
          </h1>
          {roleTitle && (
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              {roleTitle}
            </h2>
          )}
          {description && (
            <p className="text-xs text-slate-600 max-w-md leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Floating Quote Card */}
        {quote && (
          <div className="hidden lg:block self-center pr-4">
            <div className="bg-white/95 backdrop-blur-xs px-5 py-3.5 rounded-2xl shadow-md border border-purple-100 max-w-xs text-center space-y-1">
              <span className="text-xs font-black text-slate-800 block">
                {typeof quote === 'string' ? `“ ${quote} ”` : quote}
              </span>
              <div className={`w-10 h-0.5 ${accentColorClass} mx-auto rounded-full mt-1`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WelcomeBanner;
