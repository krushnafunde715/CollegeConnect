import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/Badge';
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  Building2,
  Users,
  Layers,
  Award,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

const REPORT_CATEGORIES = [
  { id: 'students', label: 'Student Distribution', icon: Users },
  { id: 'classes', label: 'Class Enrollment', icon: Layers },
  { id: 'faculty', label: 'Faculty Distribution', icon: Award },
  { id: 'academic', label: 'Academic Performance', icon: TrendingUp },
  { id: 'examination', label: 'Examination Participation', icon: BarChart3 },
  { id: 'placement', label: 'Placement Overview', icon: Briefcase },
];

const STUDENT_DIST_DATA = [
  { department: 'Computer Engineering', code: 'COMP', total: 940, male: 540, female: 400, percentage: '24.5%' },
  { department: 'Information Technology', code: 'IT', total: 780, male: 420, female: 360, percentage: '20.3%' },
  { department: 'Electronics & Telecomm', code: 'ENTC', total: 710, male: 400, female: 310, percentage: '18.5%' },
  { department: 'Mechanical Engineering', code: 'MECH', total: 680, male: 590, female: 90, percentage: '17.7%' },
  { department: 'Civil Engineering', code: 'CIVIL', total: 520, male: 390, female: 130, percentage: '13.5%' },
  { department: 'First Year Applied Sciences', code: 'FE', total: 212, male: 130, female: 82, percentage: '5.5%' },
];

const PLACEMENT_DIST_DATA = [
  { department: 'Computer Engineering', eligible: 230, placed: 218, rate: '94.8%', avgCtc: '8.2 LPA' },
  { department: 'Information Technology', eligible: 190, placed: 176, rate: '92.6%', avgCtc: '7.8 LPA' },
  { department: 'Electronics & Telecomm', eligible: 175, placed: 148, rate: '84.5%', avgCtc: '6.4 LPA' },
  { department: 'Mechanical Engineering', eligible: 160, placed: 118, rate: '73.7%', avgCtc: '5.8 LPA' },
  { department: 'Civil Engineering', eligible: 110, placed: 68, rate: '61.8%', avgCtc: '5.2 LPA' },
];

export function ReportsAnalyticsModule() {
  const [selectedCategory, setSelectedCategory] = useState('students');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const { success } = useToast();

  const exportCSV = () => {
    let headers = [];
    let rows = [];

    if (selectedCategory === 'students') {
      headers = ['Department', 'Code', 'Total Students', 'Male', 'Female', 'Share %'];
      rows = STUDENT_DIST_DATA.map((d) => [d.department, d.code, d.total, d.male, d.female, d.percentage]);
    } else if (selectedCategory === 'placement') {
      headers = ['Department', 'Eligible Candidates', 'Placed Students', 'Placement Rate', 'Average Package'];
      rows = PLACEMENT_DIST_DATA.map((d) => [d.department, d.eligible, d.placed, d.rate, d.avgCtc]);
    } else {
      headers = ['Metric', 'Category', 'Academic Year', 'Value'];
      rows = [
        ['Total Institutional Enrollment', selectedCategory, academicYear, '3,842'],
        ['Total Departments', selectedCategory, academicYear, '6'],
        ['Faculty Count', selectedCategory, academicYear, '124'],
      ];
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CollegeConnect_Report_${selectedCategory}_${academicYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success(`Exported ${selectedCategory.toUpperCase()} Report to CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Institutional Reports & Analytics</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Data insights, demographic distributions, academic performance trends, and auditable CSV data exports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
          {REPORT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Academic Year:</span>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none"
              >
                <option value="2026-27">AY 2026-27</option>
                <option value="2025-26">AY 2025-26</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Department:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none"
              >
                <option value="ALL">All Departments</option>
                <option value="COMP">Computer Engineering</option>
                <option value="IT">Information Technology</option>
                <option value="ENTC">E&TC</option>
                <option value="MECH">Mechanical</option>
              </select>
            </div>
          </div>

          <span className="text-[11px] text-slate-400">Showing verified institutional records</span>
        </div>
      </div>

      {/* Visual Analytics Chart & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Chart View (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Departmental Distribution Comparative</h3>
              <p className="text-[11px] text-slate-500">Student count and enrollment capacity utilization</p>
            </div>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="pt-2">
            <svg viewBox="0 0 500 200" className="w-full h-44 overflow-visible">
              {/* Horizontal Grid lines */}
              <line x1="40" y1="20" x2="490" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="490" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="100" x2="490" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="140" x2="490" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="170" x2="490" y2="170" stroke="#cbd5e1" strokeWidth="1" />

              {/* Y-axis Labels */}
              <text x="32" y="24" fontSize="9" fill="#94a3b8" textAnchor="end">1000</text>
              <text x="32" y="64" fontSize="9" fill="#94a3b8" textAnchor="end">750</text>
              <text x="32" y="104" fontSize="9" fill="#94a3b8" textAnchor="end">500</text>
              <text x="32" y="144" fontSize="9" fill="#94a3b8" textAnchor="end">250</text>
              <text x="32" y="174" fontSize="9" fill="#94a3b8" textAnchor="end">0</text>

              {/* Bars */}
              {[
                { label: 'COMP', val: 940, color: '#7C3AED', x: 65 },
                { label: 'IT', val: 780, color: '#3B82F6', x: 145 },
                { label: 'ENTC', val: 710, color: '#10B981', x: 225 },
                { label: 'MECH', val: 680, color: '#F59E0B', x: 305 },
                { label: 'CIVIL', val: 520, color: '#EC4899', x: 385 },
                { label: 'FE', val: 212, color: '#6366F1', x: 450 },
              ].map((bar, i) => {
                const height = (bar.val / 1000) * 150;
                const y = 170 - height;
                return (
                  <g key={i} className="transition-all hover:opacity-80">
                    <rect
                      x={bar.x - 16}
                      y={y}
                      width="32"
                      height={height}
                      rx="6"
                      fill={bar.color}
                    />
                    <text
                      x={bar.x}
                      y={y - 5}
                      fontSize="9"
                      fontWeight="bold"
                      fill="#1e293b"
                      textAnchor="middle"
                    >
                      {bar.val}
                    </text>
                    <text
                      x={bar.x}
                      y="185"
                      fontSize="9"
                      fontWeight="bold"
                      fill="#64748b"
                      textAnchor="middle"
                    >
                      {bar.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Donut Distribution (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Enrollment Share Distribution</h3>
            <p className="text-[11px] text-slate-500">Proportional breakdown by branch</p>
          </div>

          <div className="flex items-center justify-center py-2">
            <svg viewBox="0 0 160 160" className="w-36 h-36">
              <circle cx="80" cy="80" r="54" fill="none" stroke="#F1F5F9" strokeWidth="20" />
              {/* COMP 24.5% */}
              <circle cx="80" cy="80" r="54" fill="none" stroke="#7C3AED" strokeWidth="20" strokeDasharray="83 339" strokeDashoffset="0" />
              {/* IT 20.3% */}
              <circle cx="80" cy="80" r="54" fill="none" stroke="#3B82F6" strokeWidth="20" strokeDasharray="69 339" strokeDashoffset="-83" />
              {/* ENTC 18.5% */}
              <circle cx="80" cy="80" r="54" fill="none" stroke="#10B981" strokeWidth="20" strokeDasharray="63 339" strokeDashoffset="-152" />
              {/* MECH 17.7% */}
              <circle cx="80" cy="80" r="54" fill="none" stroke="#F59E0B" strokeWidth="20" strokeDasharray="60 339" strokeDashoffset="-215" />
              {/* CIVIL 13.5% */}
              <circle cx="80" cy="80" r="54" fill="none" stroke="#EC4899" strokeWidth="20" strokeDasharray="46 339" strokeDashoffset="-275" />
              {/* Center count */}
              <text x="80" y="76" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">3,842</text>
              <text x="80" y="92" textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">STUDENTS</text>
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" /><span className="font-semibold text-slate-700">COMP (24.5%)</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /><span className="font-semibold text-slate-700">IT (20.3%)</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /><span className="font-semibold text-slate-700">ENTC (18.5%)</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /><span className="font-semibold text-slate-700">MECH (17.7%)</span></div>
          </div>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            {selectedCategory === 'placement' ? 'Placement Department Metrics by Department' : 'Institutional Student Breakdown'}
          </h3>
          <span className="text-slate-400 font-mono text-xs">AY {academicYear}</span>
        </div>

        <div className="overflow-x-auto">
          {selectedCategory === 'placement' ? (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4 text-center">Eligible Students</th>
                  <th className="py-3.5 px-4 text-center">Placed Count</th>
                  <th className="py-3.5 px-4 text-center">Placement %</th>
                  <th className="py-3.5 px-4 text-center">Average Package</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {PLACEMENT_DIST_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.department}</td>
                    <td className="py-3.5 px-4 text-center">{row.eligible}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-700">{row.placed}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-indigo-700">{row.rate}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">{row.avgCtc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4 text-center">Total Students</th>
                  <th className="py-3.5 px-4 text-center">Male</th>
                  <th className="py-3.5 px-4 text-center">Female</th>
                  <th className="py-3.5 px-4 text-center">Institutional Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {STUDENT_DIST_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.department}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{row.code}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{row.total}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{row.male}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{row.female}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-indigo-700">{row.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
