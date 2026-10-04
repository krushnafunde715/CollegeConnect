import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  Clock,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  Calendar,
  Lock,
  Download,
  AlertCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';

const INITIAL_AUDIT_LOGS = [
  {
    id: 1,
    timestamp: '2026-10-14 11:20:15 AM',
    user: 'Kartik Bhegade',
    role: 'super_admin',
    roleDisplay: 'Super Admin',
    action: 'CREATE_DEPARTMENT',
    module: 'Departments',
    recordId: 'DEPT-COMP-01',
    ipAddress: '192.168.1.10',
    outcome: 'success',
    details: { name: 'Computer Engineering', code: 'COMP', head: 'Prof. Kirti Borhade' }
  },
  {
    id: 2,
    timestamp: '2026-10-14 10:45:00 AM',
    user: 'Prof. Kirti Borhade',
    role: 'academic_admin',
    roleDisplay: 'Academic Admin',
    action: 'ASSIGN_CLASS_TEACHER',
    module: 'Classes',
    recordId: 'CLASS-COMP-TEA',
    ipAddress: '192.168.1.24',
    outcome: 'success',
    details: { class: 'TE Comp A', teacher: 'Prof. Sonal Kadam' }
  },
  {
    id: 3,
    timestamp: '2026-10-14 09:30:22 AM',
    user: 'Prof. Akash Mhetre',
    role: 'exam_admin',
    roleDisplay: 'Exam Admin',
    action: 'PUBLISH_TIMETABLE',
    module: 'Examination',
    recordId: 'EXAM-NOV-2026',
    ipAddress: '192.168.2.15',
    outcome: 'success',
    details: { session: 'Odd Semester 2026', subjectCount: 46 }
  },
  {
    id: 4,
    timestamp: '2026-10-13 04:15:40 PM',
    user: 'Prof. Satyajit Sirsat',
    role: 'placement_admin',
    roleDisplay: 'Placement Admin',
    action: 'CREATE_PLACEMENT_DRIVE',
    module: 'Placement',
    recordId: 'DRIVE-TCS-2026',
    ipAddress: '192.168.3.12',
    outcome: 'success',
    details: { company: 'TCS', role: 'Digital SDE', package: '7.5 LPA' }
  },
  {
    id: 5,
    timestamp: '2026-10-13 02:00:10 PM',
    user: 'Krushna Funde',
    role: 'student',
    roleDisplay: 'Student',
    action: 'ACKNOWLEDGE_CONSENT',
    module: 'Privacy Center',
    recordId: '2024COMP0101',
    ipAddress: '10.0.4.55',
    outcome: 'success',
    details: { noticeVersion: 'v2026.2', purpose: 'Educational Evaluation' }
  },
  {
    id: 6,
    timestamp: '2026-10-12 11:10:05 AM',
    user: 'Unknown Actor (IP 192.168.9.99)',
    role: 'unauthenticated',
    roleDisplay: 'Public IP',
    action: 'FAILED_LOGIN_ATTEMPT',
    module: 'Authentication',
    recordId: 'USR-UNKNOWN',
    ipAddress: '192.168.9.99',
    outcome: 'denied',
    details: { reason: 'Invalid Argon2id credentials', attemptCount: 1 }
  },
];

export function AccessHistoryModule() {
  const [logs, setLogs] = useState(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);

  const { success } = useToast();

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recordId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = moduleFilter === 'ALL' || log.module === moduleFilter;
    const matchesOutcome = outcomeFilter === 'ALL' || log.outcome === outcomeFilter.toLowerCase();
    return matchesSearch && matchesModule && matchesOutcome;
  });

  const exportAuditLog = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Module', 'Record ID', 'IP Address', 'Outcome'];
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      l.user,
      l.roleDisplay,
      l.action,
      l.module,
      l.recordId,
      l.ipAddress,
      l.outcome,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CollegeConnect_AuditTrail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('Immutable audit trail log exported to CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Access History & Security Audit Logs</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Immutable, append-only chronological log of all administrative operations, authentication events, and data modifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportAuditLog}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Audit Log
          </button>
        </div>
      </div>

      {/* Immutable Notice */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-start gap-3 text-xs shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-white">Immutable Append-Only Audit Guarantee</p>
          <p className="text-slate-300 leading-relaxed">
            Audit logs are write-only. No modification, erasure, or deletion is permitted under CollegeConnect security governance. Passwords and sensitive personal tokens are never written to log stores.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by user, action, or record ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto text-xs font-medium text-slate-600">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none"
          >
            <option value="ALL">All Modules</option>
            <option value="Departments">Departments</option>
            <option value="Classes">Classes</option>
            <option value="Examination">Examination</option>
            <option value="Placement">Placement</option>
            <option value="Privacy Center">Privacy Center</option>
            <option value="Authentication">Authentication</option>
          </select>

          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none"
          >
            <option value="ALL">All Outcomes</option>
            <option value="SUCCESS">Success</option>
            <option value="DENIED">Denied / Failed</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Actor User</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Module</th>
                <th className="py-3.5 px-4">Record Identifier</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4 text-center">Outcome</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">{log.timestamp}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{log.user}</p>
                    <span className="text-[10px] text-slate-400">{log.roleDisplay}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 font-mono font-bold text-[10px] rounded border border-slate-200 text-slate-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{log.module}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{log.recordId}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">{log.ipAddress}</td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={log.outcome}>{log.outcome}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Inspect Event Payload"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT LOG MODAL */}
      {selectedLog && (
        <Modal
          isOpen={Boolean(selectedLog)}
          onClose={() => setSelectedLog(null)}
          title={`Audit Event: ${selectedLog.action}`}
          subtitle={`Logged at ${selectedLog.timestamp} • Actor: ${selectedLog.user}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Module Scope</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedLog.module}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Target Record ID</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">{selectedLog.recordId}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Client IP Address</span>
                <p className="font-mono text-slate-900 mt-0.5">{selectedLog.ipAddress}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Security Outcome</span>
                <div className="mt-0.5">
                  <Badge variant={selectedLog.outcome}>{selectedLog.outcome}</Badge>
                </div>
              </div>
            </div>

            <div>
              <span className="text-slate-700 font-bold block mb-1">Event Payload (JSON)</span>
              <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
