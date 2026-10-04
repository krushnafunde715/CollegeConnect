import React, { useState } from 'react';
import { useExamAdmin } from '../../../context/ExamAdminContext';
import { useToast } from '../../../context/ToastContext';
import { ExamAdminHeader } from '../components/ExamAdminHeader';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  CheckCircle2,
  TrendingUp,
  Award,
  Users,
  Layers,
  Sparkles
} from 'lucide-react';

export function ExamReportsModule({ onNavigateTab }) {
  const { results, students } = useExamAdmin();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState('Pass Percentage'); // 'Result Analysis', 'Class-wise Performance', 'Subject Analysis', 'Pass Percentage'
  const [semester, setSemester] = useState('Semester II');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');

  // Chart data matching reference
  const classPassData = [
    { cls: 'SE A', rate: 89, color: '#8B5CF6' },
    { cls: 'SE B', rate: 94, color: '#3B82F6' },
    { cls: 'TE A', rate: 87, color: '#10B981' },
    { cls: 'TE B', rate: 91, color: '#F59E0B' },
    { cls: 'BE A', rate: 93, color: '#F97316' },
    { cls: 'BE B', rate: 88, color: '#A78BFA' },
  ];

  const handleGenerateReport = () => {
    success(`Analytical report generated for ${selectedClass} • ${semester}.`);
  };

  const handleExportPDF = () => {
    success('Exported report summary as PDF (DPDP Compliant).');
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. Header */}
      <ExamAdminHeader
        placeholder="Search examination reports & metrics..."
        onNavigateTab={onNavigateTab}
      />

      {/* 2. Main Page Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
        {/* Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Examination Reports</h1>
            <p className="text-xs text-slate-500">Generate analytical reports for examinations</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export PDF
            </button>
            <button
              onClick={handleGenerateReport}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>

        {/* Tabs matching Reference */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl w-fit flex-wrap">
          {['Result Analysis', 'Class-wise Performance', 'Subject Analysis', 'Pass Percentage'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#6B46FE] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="Semester II">Semester II</option>
              <option value="Semester I">Semester I</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="All Classes">All Classes</option>
              <option value="SE">SE (Second Year)</option>
              <option value="TE">TE (Third Year)</option>
              <option value="BE">BE (Final Year)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="All Subjects">All Subjects</option>
              <option value="Data Structures">Data Structures</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="Database Management">Database Management</option>
            </select>
          </div>
        </div>

        {/* ================= BAR CHART: CLASS-WISE PASS PERCENTAGE ================= */}
        <div className="p-5 bg-slate-50/60 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Class-wise Pass Percentage</h3>
              <p className="text-[11px] text-slate-500">End semester passing distribution across all 6 divisions</p>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Avg. Passing Rate: 90.3%
            </span>
          </div>

          {/* Bar Chart Graphics */}
          <div className="pt-4">
            <div className="flex items-end justify-between h-52 gap-3 sm:gap-6 px-4 border-b border-slate-200">
              {classPassData.map((bar) => (
                <div key={bar.cls} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-xs font-black text-slate-800 group-hover:scale-110 transition-transform">
                    {bar.rate}%
                  </span>
                  <div
                    className="w-full max-w-[56px] rounded-t-xl transition-all duration-500 shadow-xs group-hover:opacity-90"
                    style={{
                      height: `${bar.rate}%`,
                      backgroundColor: bar.color,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* X Axis Labels */}
            <div className="flex items-center justify-between gap-3 sm:gap-6 px-4 pt-2.5 text-xs font-bold text-slate-600 text-center">
              {classPassData.map((bar) => (
                <div key={bar.cls} className="flex-1">
                  <span>{bar.cls}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Summary Metric Sub-boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-4 bg-purple-50/60 border border-purple-100 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Total Candidates</span>
              <span className="text-xl font-black text-slate-900">54</span>
              <span className="text-[10.5px] text-purple-700 font-bold block mt-0.5">Across 6 Divisions</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Overall Passed</span>
              <span className="text-xl font-black text-slate-900">49</span>
              <span className="text-[10.5px] text-emerald-700 font-bold block mt-0.5">90.7% Success</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Distinction Rate</span>
              <span className="text-xl font-black text-slate-900">28%</span>
              <span className="text-[10.5px] text-blue-700 font-bold block mt-0.5">15 Candidates (&gt;75%)</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 block">Average SGPA</span>
              <span className="text-xl font-black text-slate-900">8.34</span>
              <span className="text-[10.5px] text-amber-700 font-bold block mt-0.5">Top: 9.82 SGPA</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
