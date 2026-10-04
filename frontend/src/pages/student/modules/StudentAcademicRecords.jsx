import React, { useState } from 'react';
import { useStudent } from '../../../context/StudentContext';
import { StudentHeader } from '../components/StudentHeader';
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Award,
  ChevronDown,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  Percent,
  AlertCircle
} from 'lucide-react';

export function StudentAcademicRecords({ onNavigateTab }) {
  const { studentProfile, subjects } = useStudent();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'subjects_marks' | 'attendance' | 'history'
  const [selectedSemester, setSelectedSemester] = useState('Semester VII (Current)');

  // Data mapped per selected semester
  const semesterDataMap = {
    'Semester VII (Current)': {
      cgpa: '8.45',
      attendance: '78%',
      credits: '145 / 160',
      subjects: subjects || [],
    },
    'Semester VI': {
      cgpa: '8.50',
      attendance: '84%',
      credits: '124 / 160',
      subjects: [
        { code: '310251', name: 'Data Science & Big Data', credits: 4, attendance: '88%', internal: 27, external: 61, total: 88, grade: 'A+' },
        { code: '310252', name: 'Web Technology', credits: 4, attendance: '82%', internal: 26, external: 59, total: 85, grade: 'A+' },
        { code: '310253', name: 'Artificial Intelligence', credits: 3, attendance: '85%', internal: 25, external: 58, total: 83, grade: 'A' },
        { code: '310254', name: 'Information Security', credits: 3, attendance: '80%', internal: 24, external: 55, total: 79, grade: 'A' },
      ],
    },
    'Semester V': {
      cgpa: '8.45',
      attendance: '80%',
      credits: '102 / 160',
      subjects: [
        { code: '410231', name: 'Database Management System', credits: 4, attendance: '82%', internal: 25, external: 53, total: 78, grade: 'A' },
        { code: '410232', name: 'Operating System', credits: 4, attendance: '79%', internal: 26, external: 56, total: 82, grade: 'A' },
        { code: '410233', name: 'Computer Networks', credits: 4, attendance: '76%', internal: 24, external: 52, total: 76, grade: 'B+' },
        { code: '410234', name: 'Software Engineering', credits: 3, attendance: '85%', internal: 27, external: 54, total: 81, grade: 'A' },
      ],
    },
    'Semester IV': {
      cgpa: '8.92',
      attendance: '86%',
      credits: '80 / 160',
      subjects: [
        { code: '210251', name: 'Engineering Mathematics III', credits: 4, attendance: '88%', internal: 28, external: 64, total: 92, grade: 'O' },
        { code: '210252', name: 'Data Structures & Algorithms', credits: 4, attendance: '90%', internal: 29, external: 65, total: 94, grade: 'O' },
        { code: '210253', name: 'Software Engineering', credits: 3, attendance: '84%', internal: 25, external: 58, total: 83, grade: 'A' },
      ],
    },
  };

  const currentData = semesterDataMap[selectedSemester] || semesterDataMap['Semester VII (Current)'];

  const semHistory = [
    { sem: 'Semester I', sgpa: '8.70', credits: '20/20', status: 'Passed (First Class with Distinction)' },
    { sem: 'Semester II', sgpa: '8.65', credits: '20/20', status: 'Passed (First Class with Distinction)' },
    { sem: 'Semester III', sgpa: '8.80', credits: '22/22', status: 'Passed (First Class with Distinction)' },
    { sem: 'Semester IV', sgpa: '8.92', credits: '22/22', status: 'Passed (First Class with Distinction)' },
    { sem: 'Semester V', sgpa: '8.45', credits: '22/22', status: 'Passed (First Class with Distinction)' },
    { sem: 'Semester VI', sgpa: '8.50', credits: '22/22', status: 'Passed (First Class with Distinction)' },
  ];

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. TOP NAVBAR */}
      <StudentHeader onNavigateTab={onNavigateTab} />

      {/* 2. MODULE HEADER BANNER */}
      <div className="bg-white rounded-2xl px-5 py-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">Academic Records</h1>
            <p className="text-xs text-slate-500 font-medium">
              View your academic performance, subjects and attendance
            </p>
          </div>
        </div>

        {/* Semester Selector matching reference */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-slate-400">Semester</span>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="Semester VII (Current)">Semester VII (Current)</option>
            <option value="Semester VI">Semester VI</option>
            <option value="Semester V">Semester V</option>
            <option value="Semester IV">Semester IV</option>
          </select>
        </div>
      </div>

      {/* 3. NAVIGATION TABS & CONTENT */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="flex border-b border-slate-100 px-4 pt-2 gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'subjects_marks', label: 'Subjects & Marks' },
            { id: 'attendance', label: 'Attendance' },
            { id: 'history', label: 'Academic History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview matching reference */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">CGPA (Till Sem V)</span>
                  <span className="text-2xl font-black text-blue-600 block mt-0.5">{currentData.cgpa}</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Current Semester Attendance</span>
                  <span className="text-2xl font-black text-purple-600 block mt-0.5">{currentData.attendance}</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">Total Credits Completed</span>
                  <span className="text-2xl font-black text-emerald-600 block mt-0.5">{currentData.credits}</span>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Subjects Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Subjects ({selectedSemester})</h3>

              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50/80 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5">Subject Code</th>
                      <th className="px-4 py-3.5">Subject Name</th>
                      <th className="px-4 py-3.5 text-center">Credits</th>
                      <th className="px-4 py-3.5 text-right">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {(currentData.subjects || []).map((sub) => (
                      <tr key={sub.code} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3.5 font-mono font-bold text-blue-700">{sub.code}</td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">{sub.name}</td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-700">{sub.credits}</td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {sub.attendance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Subjects & Marks */}
        {activeTab === 'subjects_marks' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Subject-wise Evaluation & Scores ({selectedSemester})</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Subject Code</th>
                    <th className="px-4 py-3">Subject Name</th>
                    <th className="px-4 py-3 text-center">Internal (30)</th>
                    <th className="px-4 py-3 text-center">External (70)</th>
                    <th className="px-4 py-3 text-center">Total (100)</th>
                    <th className="px-4 py-3 text-center">Grade</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {(currentData.subjects || []).map((sub) => (
                    <tr key={sub.code} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">{sub.code}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{sub.name}</td>
                      <td className="px-4 py-3 text-center font-mono font-semibold">{sub.internal || 26}</td>
                      <td className="px-4 py-3 text-center font-mono font-semibold">{sub.external || 60}</td>
                      <td className="px-4 py-3 text-center font-mono font-bold text-slate-900">{sub.total || 86}</td>
                      <td className="px-4 py-3 text-center font-bold text-blue-600">{sub.grade || 'A+'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px] border border-emerald-200">
                          Passed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Attendance */}
        {activeTab === 'attendance' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Subject-wise Attendance Detailed Records ({selectedSemester})</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Subject Name</th>
                    <th className="px-4 py-3 text-center">Conducted</th>
                    <th className="px-4 py-3 text-center">Attended</th>
                    <th className="px-4 py-3 text-center">Percentage</th>
                    <th className="px-4 py-3 text-right">Exam Eligibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {(currentData.subjects || []).map((sub) => (
                    <tr key={sub.code} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-slate-900">{sub.name} ({sub.code})</td>
                      <td className="px-4 py-3 text-center font-mono">48</td>
                      <td className="px-4 py-3 text-center font-mono font-semibold">39</td>
                      <td className="px-4 py-3 text-center font-bold text-emerald-600">{sub.attendance}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px] border border-emerald-200">
                          Eligible (&gt; 75%)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Academic History */}
        {activeTab === 'history' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Historical Semester Performance Matrix</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Semester</th>
                    <th className="px-4 py-3 text-center">SGPA</th>
                    <th className="px-4 py-3 text-center">Credits Earned</th>
                    <th className="px-4 py-3 text-right">Result Standing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {semHistory.map((h) => (
                    <tr key={h.sem} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-slate-900">{h.sem}</td>
                      <td className="px-4 py-3 text-center font-bold text-blue-600">{h.sgpa}</td>
                      <td className="px-4 py-3 text-center font-mono font-semibold">{h.credits}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px] border border-emerald-200">
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
