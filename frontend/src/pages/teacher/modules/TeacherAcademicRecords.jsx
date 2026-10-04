import React, { useState } from 'react';
import { useTeacher } from '../../../context/TeacherContext';
import { useToast } from '../../../context/ToastContext';
import {
  BookOpen,
  Award,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  FileText,
  UserCheck,
  Percent,
  Download,
  Filter,
  Eye,
  X
} from 'lucide-react';

export function TeacherAcademicRecords() {
  const { students, subjects } = useTeacher();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState('internal_marks'); // 'internal_marks' | 'subject_analysis' | 'performance_summary'
  const [semesterFilter, setSemesterFilter] = useState('V (Current)');
  const [subjectFilter, setSubjectFilter] = useState('All Subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [selectedStudentMarks, setSelectedStudentMarks] = useState(null);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery) ||
      s.prn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const getPerformanceBadge = (grade) => {
    switch (grade) {
      case 'Excellent':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Good':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Average':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Needs Support':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleExportMarksCSV = () => {
    const headers = ['Roll No', 'Student Name', 'AI', 'ML', 'WT', 'CC', 'Elective-I', 'Avg %', 'Performance'];
    const rows = filteredStudents.map((s) => [
      s.rollNo,
      `"${s.name}"`,
      s.marks.ai,
      s.marks.ml,
      s.marks.wt,
      s.marks.cc,
      s.marks.elective1,
      `${s.marks.avg}%`,
      s.marks.grade,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TE_Comp_Div_A_Marks_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Academic marks report downloaded.');
  };

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Module Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academic Records</h1>
            <p className="text-xs text-slate-500 font-medium">
              View students' academic performance for permitted data.
            </p>
          </div>
        </div>

        {/* Header Selectors & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Semester Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Semester</span>
            <select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="V (Current)">V (Current)</option>
              <option value="IV">IV</option>
              <option value="III">III</option>
            </select>
          </div>

          {/* Subject Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Subject</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All Subjects">All Subjects</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Web Technology">Web Technology</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Elective - I">Elective - I</option>
            </select>
          </div>

          <button
            onClick={handleExportMarksCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Marks</span>
          </button>
        </div>
      </div>

      {/* 2. 4 Stat Metric Cards matching reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">78%</span>
            <span className="text-xs font-semibold text-slate-500">Class Average</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">38 <span className="text-xs font-bold text-emerald-600 font-sans">(66%)</span></span>
            <span className="text-xs font-semibold text-slate-500">Students Above</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">6 <span className="text-xs font-bold text-rose-600 font-sans">(10%)</span></span>
            <span className="text-xs font-semibold text-slate-500">Students Below</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block">96%</span>
            <span className="text-xs font-semibold text-slate-500">Highest Score</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs matching reference */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-2">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('internal_marks')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'internal_marks'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Internal Marks
          </button>
          <button
            onClick={() => setActiveTab('subject_analysis')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'subject_analysis'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Subject-wise Analysis
          </button>
          <button
            onClick={() => setActiveTab('performance_summary')}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'performance_summary'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Performance Summary
          </button>
        </div>

        {/* Tab 1: Internal Marks Table */}
        {activeTab === 'internal_marks' && (
          <div className="p-3 space-y-4">
            {/* Search Filter */}
            <div className="flex justify-between items-center">
              <div className="relative w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search student by name or roll..."
                  className="w-full pl-9 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Showing continuous internal evaluation (Max: 100)
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50/80 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Roll No</th>
                    <th className="px-4 py-3.5">Student Name</th>
                    <th className="px-4 py-3.5 text-center">AI</th>
                    <th className="px-4 py-3.5 text-center">ML</th>
                    <th className="px-4 py-3.5 text-center">WT</th>
                    <th className="px-4 py-3.5 text-center">CC</th>
                    <th className="px-4 py-3.5 text-center">Elective-I</th>
                    <th className="px-4 py-3.5 text-center">Avg %</th>
                    <th className="px-4 py-3.5 text-right">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedStudents.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => setSelectedStudentMarks(s)}
                      className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3.5 font-bold text-slate-800 font-mono">{s.rollNo}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">{s.name}</td>
                      <td className="px-4 py-3.5 text-center font-semibold text-slate-700">{s.marks.ai}</td>
                      <td className="px-4 py-3.5 text-center font-semibold text-slate-700">{s.marks.ml}</td>
                      <td className="px-4 py-3.5 text-center font-semibold text-slate-700">{s.marks.wt}</td>
                      <td className="px-4 py-3.5 text-center font-semibold text-slate-700">{s.marks.cc}</td>
                      <td className="px-4 py-3.5 text-center font-semibold text-slate-700">{s.marks.elective1}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-blue-700">{s.marks.avg}%</td>
                      <td className="px-4 py-3.5 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPerformanceBadge(
                            s.marks.grade
                          )}`}
                        >
                          {s.marks.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {paginatedStudents.length === 0 && (
                    <tr>
                      <td colSpan="9" className="px-4 py-8 text-center text-slate-400">
                        No student marks found matching search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer matching reference */}
            <div className="px-2 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-medium text-slate-500">
                Showing {filteredStudents.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Subject-wise Analysis */}
        {activeTab === 'subject_analysis' && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((sub) => (
                <div key={sub.code} className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{sub.code}</span>
                      <h3 className="text-sm font-bold text-slate-900">{sub.name}</h3>
                      <p className="text-[11px] text-slate-400 font-medium">Faculty: {sub.faculty}</p>
                    </div>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-md border border-purple-200">
                      {sub.credits} Credits
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Average</span>
                      <span className="text-sm font-extrabold text-blue-600">{sub.average}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Highest</span>
                      <span className="text-sm font-extrabold text-emerald-600">{sub.highest}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Lowest</span>
                      <span className="text-sm font-extrabold text-rose-600">{sub.lowest}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500 font-medium">Pass Rate</span>
                      <span className="font-bold text-emerald-600">{sub.passRate}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className={`h-full ${sub.barColor} rounded-full`} style={{ width: `${sub.performancePct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Performance Summary */}
        {activeTab === 'performance_summary' && (
          <div className="p-4 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Top Performers (&gt;85%)</span>
                <span className="text-3xl font-black text-emerald-700 block">18 Students</span>
                <p className="text-xs text-emerald-900/80 leading-relaxed">
                  Demonstrating exemplary academic consistency across all core subjects and labs.
                </p>
              </div>

              <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">Good Standing (70–84%)</span>
                <span className="text-3xl font-black text-blue-700 block">34 Students</span>
                <p className="text-xs text-blue-900/80 leading-relaxed">
                  Consistently meeting department benchmarks with high laboratory engagement.
                </p>
              </div>

              <div className="p-4 bg-rose-50/60 border border-rose-100 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">Targeted Mentorship (&lt;70%)</span>
                <span className="text-3xl font-black text-rose-700 block">6 Students</span>
                <p className="text-xs text-rose-900/80 leading-relaxed">
                  Scheduled for faculty counseling and remedial tutorial sessions.
                </p>
              </div>
            </div>

            {/* At-Risk Students List */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-slate-900">Students Requiring Academic Attention</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-3 py-2">Roll</th>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Weak Subject Area</th>
                      <th className="px-3 py-2">Current Avg</th>
                      <th className="px-3 py-2 text-right">Action Plan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students
                      .filter((s) => s.marks.avg < 70)
                      .map((s) => (
                        <tr key={s.id}>
                          <td className="px-3 py-2 font-bold font-mono">{s.rollNo}</td>
                          <td className="px-3 py-2 font-bold text-slate-900">{s.name}</td>
                          <td className="px-3 py-2 text-rose-600 font-semibold">Artificial Intelligence & Cloud</td>
                          <td className="px-3 py-2 font-bold text-rose-700">{s.marks.avg}%</td>
                          <td className="px-3 py-2 text-right">
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-md text-[10px]">
                              Tutorial Group B
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
      </div>

      {/* Student Marks Detail Modal */}
      {selectedStudentMarks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{selectedStudentMarks.name}</h3>
                <p className="text-xs text-blue-600 font-mono font-semibold">
                  Roll: {selectedStudentMarks.rollNo} • PRN: {selectedStudentMarks.prn}
                </p>
              </div>
              <button
                onClick={() => setSelectedStudentMarks(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Artificial Intelligence</span>
                <span className="font-bold text-slate-900">{selectedStudentMarks.marks.ai} / 100</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Machine Learning</span>
                <span className="font-bold text-slate-900">{selectedStudentMarks.marks.ml} / 100</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Web Technology</span>
                <span className="font-bold text-slate-900">{selectedStudentMarks.marks.wt} / 100</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Cloud Computing</span>
                <span className="font-bold text-slate-900">{selectedStudentMarks.marks.cc} / 100</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Elective - I</span>
                <span className="font-bold text-slate-900">{selectedStudentMarks.marks.elective1} / 100</span>
              </div>
              <div className="flex justify-between py-2 bg-blue-50/60 px-3 rounded-xl">
                <span className="font-bold text-blue-900">Overall Average Score</span>
                <span className="font-black text-blue-700 text-sm">{selectedStudentMarks.marks.avg}%</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedStudentMarks(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
