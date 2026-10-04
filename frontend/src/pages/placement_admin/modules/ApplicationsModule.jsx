import React, { useState, useMemo } from 'react';
import { usePlacementAdmin } from '../../../context/PlacementAdminContext';
import { PlacementAdminHeader } from '../components/PlacementAdminHeader';
import {
  FileText,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Briefcase,
  Users,
  Eye,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export function ApplicationsModule({ onNavigateTab }) {
  const { applications, drives, updateApplicationStatus, deleteApplication } = usePlacementAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrive, setSelectedDrive] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [selectedApp, setSelectedApp] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('Shortlisted');

  const filteredApplications = useMemo(() => {
    return (applications || []).filter((app) => {
      const matchSearch =
        searchQuery === '' ||
        (app.studentName && app.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.prn && app.prn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.company && app.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (app.role && app.role.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDrive = selectedDrive === 'All' || app.company === selectedDrive;
      const matchStatus = selectedStatus === 'All' || app.status === selectedStatus;

      return matchSearch && matchDrive && matchStatus;
    });
  }, [applications, searchQuery, selectedDrive, selectedStatus]);

  const handleOpenStatus = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status || 'Shortlisted');
    setShowStatusModal(true);
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    updateApplicationStatus(selectedApp.id, newStatus);
    setShowStatusModal(false);
    setSelectedApp(null);
  };

  const handleDelete = (id, studentName, company) => {
    if (window.confirm(`Are you sure you want to remove the application of ${studentName} for ${company}?`)) {
      deleteApplication(id);
    }
  };

  const handleExportCSV = () => {
    const headers = ['App ID', 'Student PRN', 'Student Name', 'Department', 'Company', 'Role', 'Status', 'Date Applied'];
    const rows = filteredApplications.map((a) => [
      `APP-${a.id}`,
      a.prn,
      `"${a.studentName}"`,
      a.department || 'Computer',
      `"${a.company}"`,
      `"${a.role || 'Software Engineer'}"`,
      a.status,
      a.dateApplied || '01 Oct 2026',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `collegeconnect_student_applications_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shortlisted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Under Review':
      case 'Applied':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
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
        placeholder="Search applications by student name, PRN, or recruiting company..."
        onNavigateTab={onNavigateTab}
      />

      {/* Page Title Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Candidate Tracker
            </span>
            <span className="text-xs text-slate-500 font-medium">Drive Submissions</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Student Job Applications</h1>
          <p className="text-xs text-slate-500">
            Real-time tracking of candidate drive submissions, screening rounds, interview shortlists, and final job offerings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Applications
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Applications</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{applications.length} Submissions</h3>
            <span className="text-[10.5px] text-purple-600 font-bold mt-0.5 inline-block">Across active drives</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Shortlisted for Rounds</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              {applications.filter((a) => a.status === 'Shortlisted').length} Candidates
            </h3>
            <span className="text-[10.5px] text-blue-600 font-bold mt-0.5 inline-block">Technical interview stage</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Final Offers Accepted</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">
              {applications.filter((a) => a.status === 'Selected').length} Selected
            </h3>
            <span className="text-[10.5px] text-emerald-600 font-bold mt-0.5 inline-block">Offer letters issued</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Application Success Rate</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">68.4%</h3>
            <span className="text-[10.5px] text-emerald-600 font-bold mt-0.5 inline-block">Above state benchmark</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <Filter className="w-4 h-4 text-purple-600" /> Filters:
            </div>

            {/* Drive Filter */}
            <select
              value={selectedDrive}
              onChange={(e) => setSelectedDrive(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            >
              <option value="All">All Companies &amp; Drives</option>
              {Array.from(new Set(applications.map((a) => a.company))).map((comp, idx) => (
                <option key={idx} value={comp}>
                  {comp}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            >
              <option value="All">All Application Statuses</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Selected">Selected</option>
              <option value="Applied">Applied / Under Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{filteredApplications.length}</span> applications
          </div>
        </div>
      </div>

      {/* Main Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Applicant Student</th>
                <th className="py-3.5 px-4">Recruiting Drive</th>
                <th className="py-3.5 px-4">Designation / Role</th>
                <th className="py-3.5 px-4">Submission Date</th>
                <th className="py-3.5 px-4">Pipeline Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No student applications match the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {a.studentName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{a.studentName}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {a.prn} • {a.department || 'Computer'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-[10px] border border-purple-100">
                          {a.company.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900">{a.company}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-700">{a.role || 'Software Engineer'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-500 font-mono text-[11px]">{a.dateApplied || '02 Oct 2026'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                          a.status
                        )}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenStatus(a)}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" /> Update Status
                        </button>
                        <button
                          onClick={() => handleDelete(a.id, a.studentName, a.company)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Remove Application"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Update Application Status Modal */}
      {showStatusModal && selectedApp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Update Candidacy Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="text-slate-900 font-bold">{selectedApp.studentName} ({selectedApp.prn})</p>
                <p className="text-slate-500">{selectedApp.company} — {selectedApp.role || 'Software Engineer'}</p>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">New Pipeline Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                >
                  <option value="Applied">Applied / Under Review</option>
                  <option value="Shortlisted">Shortlisted for Technical Round</option>
                  <option value="Selected">Selected / Offer Rolled Out</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
