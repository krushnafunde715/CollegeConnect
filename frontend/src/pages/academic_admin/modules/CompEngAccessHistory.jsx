import React, { useState } from 'react';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  Clock,
  Search,
  Filter,
  Download,
  Shield,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Lock,
  UserCheck
} from 'lucide-react';

export function CompEngAccessHistory({
  activities = [],
  departmentName = 'Computer Engineering',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = activities.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.user || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      selectedSeverity === 'ALL' ||
      (log.severity || 'info').toLowerCase() === selectedSeverity.toLowerCase();

    return matchesSearch && matchesSeverity;
  });

  const handleExportLogs = () => {
    const headers = ['Timestamp', 'Action', 'Target Resource', 'Details', 'Actor', 'Severity', 'IP Address'];
    const rows = activities.map((a) => [
      a.time,
      `"${a.action}"`,
      `"${a.resource || 'Department'}"`,
      `"${a.details}"`,
      `"${a.user || 'comp.admin@college.edu'}"`,
      a.severity || 'info',
      a.ip || '192.168.1.45',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CompEng_AuditLogs_AY2025_26.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Computer Engineering Access & Mutation Logs
              </h2>
              <span className="px-2 py-0.5 text-xs font-extrabold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                DPDP Scoped Audit Trail
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Append-only audit log tracking administrative changes, student enrollments, and rectification reviews in {departmentName}.
            </p>
          </div>

          <button
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            Export Audit Trail (CSV)
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by action, detail, or user..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <option value="ALL">All Severity Levels</option>
              <option value="info">Info / Normal Operations</option>
              <option value="warning">Warning / Data Updates</option>
              <option value="security">Security & Role Approvals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Action</th>
                <th className="px-4 py-3.5">Target Resource</th>
                <th className="px-4 py-3.5">Details</th>
                <th className="px-4 py-3.5">Actor</th>
                <th className="px-4 py-3.5">Severity</th>
                <th className="px-4 py-3.5 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No log events match your filter query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.time}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 font-mono text-indigo-600">
                      {log.resource || 'Department'}
                    </td>
                    <td className="px-4 py-3 text-slate-700 max-w-sm">
                      {log.details}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">
                      {log.user || 'comp.admin@college.edu'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          log.severity === 'security'
                            ? 'bg-purple-100 text-purple-700'
                            : log.severity === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {log.severity || 'info'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Inspect JSON Payload"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Event Payload Inspector */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title="Audit Log Event Inspector"
          subtitle={`Event Action: ${selectedLog.action} &bull; Timestamp: ${selectedLog.time}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto">
              <pre>
                {JSON.stringify(
                  {
                    event_id: `LOG-COMP-${Math.floor(Math.random() * 90000 + 10000)}`,
                    timestamp: selectedLog.time,
                    department: departmentName,
                    department_code: 'COMP',
                    action: selectedLog.action,
                    actor_email: selectedLog.user || 'comp.admin@college.edu',
                    actor_role: 'academic_admin',
                    target_resource: selectedLog.resource || 'Academic Entity',
                    details: selectedLog.details,
                    severity: selectedLog.severity || 'info',
                    client_ip: selectedLog.ip || '192.168.1.45',
                    dpdp_legal_basis: 'Contractual Academic Management & Purpose Limitation',
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
