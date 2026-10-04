import React, { useState } from 'react';
import { useTeacher } from '../../../context/TeacherContext';
import { useToast } from '../../../context/ToastContext';
import {
  Clock,
  Search,
  Filter,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Download,
  Calendar,
  Lock,
  UserCheck
} from 'lucide-react';

export function TeacherAccessHistory() {
  const { accessHistory } = useTeacher();
  const { success } = useToast();

  const [dateRangeFilter, setDateRangeFilter] = useState('Last 30 Days');
  const [actionFilter, setActionFilter] = useState('All');
  const [studentFilter, setStudentFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter logs
  const filteredLogs = accessHistory.filter((log) => {
    const matchesAction = actionFilter === 'All' || log.action.toLowerCase().includes(actionFilter.toLowerCase());
    const matchesStudent = studentFilter === 'All' || log.student === studentFilter;
    return matchesAction && matchesStudent;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const handleExportLogs = () => {
    const headers = ['Date & Time', 'Action', 'Student', 'Data Accessed', 'Purpose'];
    const rows = filteredLogs.map((l) => [
      `"${l.datetime}"`,
      `"${l.action}"`,
      `"${l.student}"`,
      `"${l.dataAccessed}"`,
      `"${l.purpose}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DPDP_Teacher_Access_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Audit logs downloaded successfully.');
  };

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Module Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Access History</h1>
            <p className="text-xs text-slate-500 font-medium">
              View record of your date access and actions.
            </p>
          </div>
        </div>

        {/* Filter Controls matching reference */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Date Range</span>
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          {/* Action Type Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Action Type</span>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Viewed Record">Viewed Record</option>
              <option value="Viewed Attendance">Viewed Attendance</option>
              <option value="Viewed Profile">Viewed Profile</option>
              <option value="Exported Data">Exported Data</option>
              <option value="Viewed Request">Viewed Request</option>
            </select>
          </div>

          {/* Student Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Student</span>
            <select
              value={studentFilter}
              onChange={(e) => {
                setStudentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Riya Deshmukh">Riya Deshmukh</option>
              <option value="Om Jagtap">Om Jagtap</option>
              <option value="Siddhant More">Siddhant More</option>
              <option value="Neha Patil">Neha Patil</option>
              <option value="Tanvi Shinde">Tanvi Shinde</option>
              <option value="Class (All)">Class (All)</option>
            </select>
          </div>

          <button
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {/* 2. DPDP Audit Banner */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-900">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <span className="font-semibold">
            Immutable DPDP Audit Trail • Logged under Section 8 of Digital Personal Data Protection Act.
          </span>
        </div>
        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider hidden sm:inline-block">
          Class Faculty Authority
        </span>
      </div>

      {/* 3. Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Date & Time</th>
                <th className="px-4 py-3.5">Action</th>
                <th className="px-4 py-3.5">Student</th>
                <th className="px-4 py-3.5">Data Accessed</th>
                <th className="px-4 py-3.5">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">{log.datetime}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800">{log.student}</td>
                  <td className="px-4 py-3.5 text-slate-600 font-medium">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {log.dataAccessed}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{log.purpose}</td>
                </tr>
              ))}
              {paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-400">
                    No access log entries found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <span className="text-xs font-medium text-slate-500">
            Showing {filteredLogs.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} records
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
    </div>
  );
}
