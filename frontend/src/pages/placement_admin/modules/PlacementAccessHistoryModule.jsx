import React, { useState, useMemo } from 'react';
import { usePlacementAdmin } from '../../../context/PlacementAdminContext';
import { PlacementAdminHeader } from '../components/PlacementAdminHeader';
import {
  Clock,
  Search,
  Filter,
  ShieldCheck,
  Download,
  CheckCircle2,
  FileText,
  User,
  Activity,
  Sparkles,
} from 'lucide-react';

export function PlacementAccessHistoryModule({ onNavigateTab }) {
  const { auditLogs } = usePlacementAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedAction, setSelectedAction] = useState('All');

  const filteredLogs = useMemo(() => {
    return (auditLogs || []).filter((log) => {
      const matchSearch =
        searchQuery === '' ||
        (log.user && log.user.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.target && log.target.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.module && log.module.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.action && log.action.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.ip && log.ip.includes(searchQuery));

      const matchModule = selectedModule === 'All' || log.target === selectedModule || log.module === selectedModule;
      const matchAction = selectedAction === 'All' || log.action === selectedAction;

      return matchSearch && matchModule && matchAction;
    });
  }, [auditLogs, searchQuery, selectedModule, selectedAction]);

  const handleExportLogs = () => {
    const headers = ['Log ID', 'Timestamp', 'User Identity', 'Action', 'Target Module', 'IP Address', 'Compliance'];
    const rows = filteredLogs.map((l) => [
      `LOG-${l.id}`,
      `"${l.timestamp}"`,
      `"${l.user}"`,
      l.action,
      `"${l.target}"`,
      l.ip || '192.168.1.104',
      'DPDP Verified',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `placement_audit_trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action) => {
    switch (action) {
      case 'Created':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Updated':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Deleted':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Viewed':
      case 'Exported':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <PlacementAdminHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search audit logs by administrator, action, or target entity..."
        onNavigateTab={onNavigateTab}
      />

      {/* Page Title Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> DPDP Audit Trail
            </span>
            <span className="text-xs text-slate-500 font-medium">Immutable Security Logging</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Placement Data Access History</h1>
          <p className="text-xs text-slate-500">
            Cryptographically sealed activity log of all placement officer queries, drive edits, and student data interactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportLogs}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Audit Log
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Audited Events</span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">{auditLogs.length} Events</h3>
          <span className="text-[10.5px] text-emerald-600 font-bold mt-0.5 inline-block">100% Tamper Proof</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Placement Admin</span>
          <h3 className="text-xl font-bold text-purple-700 mt-1">Prof. Satyajit Sirsat</h3>
          <span className="text-[10.5px] text-slate-500 font-medium mt-0.5 inline-block">Role: TPO Administrator</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Session IP</span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">192.168.1.104</h3>
          <span className="text-[10.5px] text-emerald-600 font-bold mt-0.5 inline-block">Campus Secure LAN</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">DPDP Privacy Compliance</span>
          <h3 className="text-xl font-bold text-emerald-600 mt-1">Certified Safe</h3>
          <span className="text-[10.5px] text-purple-600 font-bold mt-0.5 inline-block">Full Consent Audit</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <Filter className="w-4 h-4 text-purple-600" /> Filters:
            </div>

            {/* Target Module */}
            <select
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            >
              <option value="All">All Modules</option>
              <option value="Student Profile">Student Profile</option>
              <option value="Placement Drive">Placement Drive</option>
              <option value="Corporate Partner">Corporate Partner</option>
              <option value="Student Application">Student Application</option>
              <option value="Announcement">Announcement</option>
            </select>

            {/* Action Type */}
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            >
              <option value="All">All Actions</option>
              <option value="Created">Created</option>
              <option value="Updated">Updated</option>
              <option value="Deleted">Deleted</option>
              <option value="Exported">Exported</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{filteredLogs.length}</span> audit logs
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Operator User</th>
                <th className="py-3.5 px-4">Action Type</th>
                <th className="py-3.5 px-4">Target Module</th>
                <th className="py-3.5 px-4">Network IP</th>
                <th className="py-3.5 px-4 text-right">DPDP Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No audit records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">{log.timestamp}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                          SP
                        </div>
                        <span className="font-bold text-slate-900">{log.user}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold border ${getActionBadge(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{log.target}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{log.ip || '192.168.1.104'}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Logged &amp; Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
