import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import campusPhoto from '../../assets/campus_photo.jpg';
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
  Briefcase,
  UserCheck,
  FileText,
  Settings,
  User,
  Check
} from 'lucide-react';

export function LoginPage({ onNavigate }) {
  const { login, systemStatus } = useAuth();
  const [email, setEmail] = useState('alice.sharma@college.edu');
  const [password, setPassword] = useState('Student@2026!');
  const [selectedRoleKey, setSelectedRoleKey] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const demoAccounts = [
    {
      key: 'student',
      role: 'Student',
      email: 'alice.sharma@college.edu',
      pass: 'Student@2026!',
      icon: User,
      normalStyle: 'bg-blue-50/50 border-blue-100/90 text-blue-950 hover:bg-blue-50/90 hover:border-blue-300 hover:shadow-xs hover:-translate-y-0.5',
      activeStyle: 'bg-blue-50 border-2 border-blue-600 ring-4 ring-blue-500/15 shadow-md text-blue-950 font-bold',
      iconBox: 'bg-blue-100/90 text-blue-600 group-hover:bg-blue-200/90',
      activeIconBox: 'bg-blue-600 text-white shadow-xs',
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      key: 'teacher',
      role: 'Class Teacher',
      email: 'teacher.hayes@college.edu',
      pass: 'Teacher@2026!',
      icon: UserCheck,
      normalStyle: 'bg-emerald-50/50 border-emerald-100/90 text-emerald-950 hover:bg-emerald-50/90 hover:border-emerald-300 hover:shadow-xs hover:-translate-y-0.5',
      activeStyle: 'bg-emerald-50 border-2 border-emerald-600 ring-4 ring-emerald-500/15 shadow-md text-emerald-950 font-bold',
      iconBox: 'bg-emerald-100/90 text-emerald-600 group-hover:bg-emerald-200/90',
      activeIconBox: 'bg-emerald-600 text-white shadow-xs',
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      key: 'academic_admin',
      role: 'Academic Admin',
      email: 'comp.admin@college.edu',
      pass: 'Admin@COMP2026!',
      icon: GraduationCap,
      normalStyle: 'bg-rose-50/50 border-rose-100/90 text-rose-950 hover:bg-rose-50/90 hover:border-rose-300 hover:shadow-xs hover:-translate-y-0.5',
      activeStyle: 'bg-rose-50 border-2 border-rose-600 ring-4 ring-rose-500/15 shadow-md text-rose-950 font-bold',
      iconBox: 'bg-rose-100/90 text-rose-600 group-hover:bg-rose-200/90',
      activeIconBox: 'bg-rose-600 text-white shadow-xs',
      badgeColor: 'bg-rose-600 text-white',
    },
    {
      key: 'exam_admin',
      role: 'Exam Admin',
      email: 'exam.admin@college.edu',
      pass: 'Admin@EXAM2026!',
      icon: FileText,
      normalStyle: 'bg-amber-50/50 border-amber-100/90 text-amber-950 hover:bg-amber-50/90 hover:border-amber-300 hover:shadow-xs hover:-translate-y-0.5',
      activeStyle: 'bg-amber-50 border-2 border-amber-600 ring-4 ring-amber-500/15 shadow-md text-amber-950 font-bold',
      iconBox: 'bg-amber-100/90 text-amber-600 group-hover:bg-amber-200/90',
      activeIconBox: 'bg-amber-600 text-white shadow-xs',
      badgeColor: 'bg-amber-600 text-white',
    },
    {
      key: 'placement_admin',
      role: 'Placement Admin',
      email: 'placement.admin@college.edu',
      pass: 'Admin@TPO2026!',
      icon: Briefcase,
      normalStyle: 'bg-purple-50/50 border-purple-100/90 text-purple-950 hover:bg-purple-50/90 hover:border-purple-300 hover:shadow-xs hover:-translate-y-0.5',
      activeStyle: 'bg-purple-50 border-2 border-purple-600 ring-4 ring-purple-500/15 shadow-md text-purple-950 font-bold',
      iconBox: 'bg-purple-100/90 text-purple-600 group-hover:bg-purple-200/90',
      activeIconBox: 'bg-purple-600 text-white shadow-xs',
      badgeColor: 'bg-purple-600 text-white',
    },
    {
      key: 'super_admin',
      role: 'Super Admin',
      email: 'superadmin@college.edu',
      pass: 'SuperAdmin@2026!',
      icon: Settings,
      normalStyle: 'bg-slate-50/70 border-slate-200 text-slate-900 hover:bg-slate-100/90 hover:border-slate-300 hover:shadow-xs hover:-translate-y-0.5',
      activeStyle: 'bg-slate-100 border-2 border-slate-800 ring-4 ring-slate-500/15 shadow-md text-slate-900 font-bold',
      iconBox: 'bg-slate-200/90 text-slate-700 group-hover:bg-slate-300/90',
      activeIconBox: 'bg-slate-800 text-white shadow-xs',
      badgeColor: 'bg-slate-800 text-white',
    },
  ];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSelectRole = (acc) => {
    setSelectedRoleKey(acc.key);
    setEmail(acc.email);
    setPassword(acc.pass);
    setErrorMsg('');
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    if (errorMsg) setErrorMsg('');
    const matched = demoAccounts.find((acc) => acc.email.toLowerCase() === val.trim().toLowerCase());
    if (matched) {
      setSelectedRoleKey(matched.key);
    }
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password;

    if (!cleanEmail) {
      setErrorMsg('Please enter your institutional email address.');
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid institutional email address (e.g. name@college.edu).');
      return;
    }

    if (!cleanPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    const result = await login(cleanEmail, cleanPassword);
    setIsLoading(false);

    if (!result.success) {
      if (result.code === 'PENDING_VERIFICATION') {
        setErrorMsg('Your account is pending institutional verification. Please verify your email before logging in.');
      } else if (result.code === 'ACCOUNT_DISABLED') {
        setErrorMsg('Your institutional account is deactivated. Please contact your Super Administrator.');
      } else {
        setErrorMsg(result.message || 'Invalid institutional email or password. Please verify your credentials.');
      }
    }
  };

  return (
    <div 
      className="min-h-screen w-full relative flex items-center justify-center p-3 sm:p-6 lg:p-0 font-sans bg-cover bg-no-repeat overflow-x-hidden"
      style={{
        backgroundImage: `url(${campusPhoto})`,
        backgroundPosition: 'center bottom',
      }}
    >
      {/* Main Responsive Grid Container */}
      <div className="w-full max-w-[1380px] mx-auto min-h-screen flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-10 xl:gap-14 relative z-10 px-4 sm:px-6 lg:px-8 py-6 lg:py-0">
        
        {/* ================= LEFT SIDE: LOGIN CARD (Proportionate ~30% Desktop Width) ================= */}
        <div className="w-full max-w-[390px] sm:max-w-[420px] lg:w-[390px] xl:w-[415px] shrink-0 flex justify-center lg:justify-start order-2 lg:order-1">
          <div className="bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 lg:p-7 shadow-2xl border border-slate-100/90 w-full transition-all">
            
            {/* Login Card Header */}
            <div className="mb-4">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 leading-tight">Welcome to</h2>
              <div className="flex items-baseline mt-0.5">
                <span className="text-2xl sm:text-[28px] font-black text-slate-900 tracking-tight">College</span>
                <span className="text-2xl sm:text-[28px] font-black text-indigo-600 tracking-tight">Connect</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                Sign in to access your portal
              </p>
            </div>

            {/* Quick Role Selector 3x2 Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-4">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                const isSelected = selectedRoleKey === acc.key;

                return (
                  <button
                    key={acc.key}
                    type="button"
                    onClick={() => handleSelectRole(acc)}
                    className={`relative flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-xl border text-center transition-all duration-200 ease-out cursor-pointer min-h-[74px] sm:min-h-[80px] group ${
                      isSelected
                        ? acc.activeStyle
                        : acc.normalStyle
                    }`}
                  >
                    {/* Active Selection Checkmark Indicator */}
                    {isSelected && (
                      <span className={`absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-2xs ${acc.badgeColor} animate-in fade-in zoom-in-75 duration-150`}>
                        <Check className="w-2 h-2 stroke-[3]" />
                      </span>
                    )}

                    {/* Centered Icon Container */}
                    <div
                      className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg flex items-center justify-center mb-1 transition-all duration-200 ${
                        isSelected ? acc.activeIconBox : acc.iconBox
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    {/* Role Label */}
                    <span className="text-[10.5px] sm:text-[11px] font-semibold leading-tight tracking-tight">
                      {acc.role}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-3.5 p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800 text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMsg}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="Email ID"
                  required
                  className="block w-full pl-9 pr-3.5 py-2.5 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition-all font-medium shadow-2xs"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Password"
                  required
                  className="block w-full pl-9 pr-9 py-2.5 sm:py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600 transition-all font-mono shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                  />
                  <span className="text-xs text-slate-700 font-semibold">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Sign In Button */}
              <div className="pt-1.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:from-indigo-800 active:to-blue-800 shadow-md shadow-indigo-600/25 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="inline-block animate-pulse">Authenticating...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>

        {/* ================= RIGHT SIDE: CAMPUS CONTENT ================= */}
        <div className="flex-1 max-w-lg lg:max-w-xl flex flex-col justify-between space-y-6 lg:space-y-0 lg:min-h-screen lg:py-[30px] order-1 lg:order-2 lg:pl-4">
          
          {/* Top Block: Brand & Headline (Positioned in upper sky area) */}
          <div className="space-y-4 lg:space-y-5 pt-2 sm:pt-4 lg:pt-0">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1E2548] flex items-center justify-center text-white shadow-md shadow-slate-900/10 border border-white/60">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-baseline">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#1E2548] tracking-tight">College</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 tracking-tight">Connect</span>
                </div>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-600 tracking-wide">
                  Integrated College Management Portal
                </p>
              </div>
            </div>

            {/* Slogan Headline & Description */}
            <div className="space-y-2.5 max-w-lg">
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-black leading-[1.14] tracking-tight">
                <span className="text-[#1E2548] block">One Campus.</span>
                <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                  Many Opportunities.
                </span>
              </h1>
              <p className="text-xs sm:text-sm lg:text-[15px] text-slate-700 font-medium leading-relaxed">
                Connecting Students, Faculty and Departments for a Smarter, Brighter Tomorrow.
              </p>
            </div>
          </div>

          {/* Inspirational Quote Card (Positioned exactly 30px from bottom) */}
          <div className="bg-white/85 rounded-2xl p-4 sm:p-4.5 border border-slate-200/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-lg self-start w-full">
            <div className="border-l-4 border-indigo-600 pl-3.5">
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                “A well-connected campus builds not just careers, but better futures.”
              </p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="text-indigo-600 font-bold text-xs tracking-widest">— •••</div>
              <div className="text-xs font-bold text-[#1E2548] mt-0.5">CollegeConnect</div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">Your Campus. Our Support.</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
