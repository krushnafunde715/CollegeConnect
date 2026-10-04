import React, { useState, useMemo } from 'react';
import { usePlacementAdmin } from '../../../context/PlacementAdminContext';
import { PlacementAdminHeader } from '../components/PlacementAdminHeader';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  Award,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Building2,
  Users,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export function PlacementReportsModule({ onNavigateTab }) {
  const { students, drives, companies } = usePlacementAdmin();

  const [activeReportTab, setActiveReportTab] = useState('summary');
  const [selectedYear, setSelectedYear] = useState('2025-2026');

  // Department analytics calculations
  const deptData = useMemo(() => {
    const departments = ['Computer', 'IT', 'ENTC', 'Mechanical', 'Civil', 'Electrical'];

    return departments.map((dept) => {
      const deptStudents = students.filter((s) => s.department === dept);
      const total = deptStudents.length || 9;
      const placed = deptStudents.filter((s) => s.placementStatus === 'Placed').length;
      const placedRate = Math.round((placed / (total || 1)) * 100);

      // CTC simulation for department
      let avgCtc = '6.8 LPA';
      let highestCtc = '14.5 LPA';
      if (dept === 'Computer') {
        avgCtc = '8.4 LPA';
        highestCtc = '24.0 LPA';
      } else if (dept === 'IT') {
        avgCtc = '7.9 LPA';
        highestCtc = '18.0 LPA';
      } else if (dept === 'ENTC') {
        avgCtc = '6.5 LPA';
        highestCtc = '12.0 LPA';
      } else if (dept === 'Mechanical') {
        avgCtc = '5.8 LPA';
        highestCtc = '10.5 LPA';
      }

      return {
        department: dept,
        totalEligible: total,
        placedOffers: placed,
        placementRate: placedRate,
        avgCtc,
        highestCtc,
      };
    });
  }, [students]);

  const handleExportReport = (format) => {
    alert(`Generating official NIRF / NAAC compliant Placement Report (${format.toUpperCase()}) for Academic Year ${selectedYear}...`);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <PlacementAdminHeader
        placeholder="Search placement reports, NIRF metrics, and branch statistics..."
        onNavigateTab={onNavigateTab}
      />

      {/* Page Title Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" /> Institutional Analytics
            </span>
            <span className="text-xs text-slate-500 font-medium">NIRF &amp; NAAC Metric Compliant</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Placement Reports &amp; Statistical Analytics</h1>
          <p className="text-xs text-slate-500">
            Generate audited placement outcomes, salary quartile distributions, and department-wise recruitment metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="2025-2026">AY 2025 – 2026 (Current)</option>
            <option value="2024-2025">AY 2024 – 2025</option>
            <option value="2023-2024">AY 2023 – 2024</option>
          </select>
          <button
            onClick={() => handleExportReport('pdf')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" /> Download NIRF Report
          </button>
        </div>
      </div>

      {/* Report Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'summary', label: 'Overall Summary' },
          { id: 'departments', label: 'Department-wise Performance' },
          { id: 'salary', label: 'CTC & Compensation Quartiles' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeReportTab === tab.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* KPI Overview Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Placement Rate</span>
          <h3 className="text-2xl font-black text-slate-900 mt-1">78.5%</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +6.2% vs Previous Year
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Average CTC (Batch)</span>
          <h3 className="text-2xl font-black text-purple-700 mt-1">7.4 LPA</h3>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Median CTC: 6.5 LPA</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Highest Package</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">24.0 LPA</h3>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Offered by Adobe India</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Companies Visited</span>
          <h3 className="text-2xl font-black text-blue-600 mt-1">56 Partners</h3>
          <p className="text-[11px] text-slate-500 font-medium mt-1">38 Tier-1 Organizations</p>
        </div>
      </div>

      {/* Department-wise Bar Chart & Metrics Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Branch-wise Placement Performance (AY 2025-26)</h3>
            <p className="text-xs text-slate-500">Comparative breakdown of eligible candidates versus offers secured.</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-purple-700">
              <span className="w-3 h-3 rounded-sm bg-purple-600 inline-block" /> Placement %
            </span>
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" /> Academic Clearance %
            </span>
          </div>
        </div>

        {/* Custom Visual Bar Chart */}
        <div className="space-y-4 pt-2">
          {deptData.map((d) => (
            <div key={d.department} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{d.department} Engineering</span>
                <div className="flex items-center gap-3">
                  <span className="text-purple-700 font-bold">{d.placementRate}% Placed</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600 font-medium">Avg: {d.avgCtc}</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(d.placementRate, 15)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Department Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200/90 bg-slate-50/50 flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Audited Branch-Wise Placement Gazette
          </h4>
          <span className="text-xs text-slate-500 font-medium">Updated 04 Oct 2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Department / Discipline</th>
                <th className="py-3 px-4">Eligible Students</th>
                <th className="py-3 px-4">Offers Secured</th>
                <th className="py-3 px-4">Placement Rate</th>
                <th className="py-3 px-4">Average CTC</th>
                <th className="py-3 px-4">Highest CTC</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deptData.map((row) => (
                <tr key={row.department} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.department} Engineering</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{row.totalEligible} Students</td>
                  <td className="py-3 px-4 font-bold text-purple-700">{row.placedOffers} Placed</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md font-bold text-xs">
                      {row.placementRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800">{row.avgCtc}</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">{row.highestCtc}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Audited
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
