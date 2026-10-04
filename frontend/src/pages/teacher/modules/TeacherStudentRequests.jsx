import React, { useState } from 'react';
import { useTeacher } from '../../../context/TeacherContext';
import { useToast } from '../../../context/ToastContext';
import {
  FileCheck2,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  AlertTriangle,
  X,
  Check,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export function TeacherStudentRequests() {
  const { requests, updateRequestStatus } = useTeacher();
  const { success, info } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusTab, setStatusTab] = useState('All'); // 'All' | 'Under Review' | 'Approved' | 'Forwarded' | 'Rejected'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewerRemarks, setReviewerRemarks] = useState('');

  // Count requests by status
  const counts = {
    all: requests.length,
    underReview: requests.filter((r) => r.status === 'Under Review').length,
    approved: requests.filter((r) => r.status === 'Approved').length,
    forwarded: requests.filter((r) => r.status === 'Forwarded').length,
    rejected: requests.filter((r) => r.status === 'Rejected').length,
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.prn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'All' || r.type === typeFilter;
    const matchesStatus = statusTab === 'All' || r.status === statusTab;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const handleAction = (status) => {
    if (!selectedRequest) return;
    updateRequestStatus(selectedRequest.id, status, reviewerRemarks);
    setSelectedRequest(null);
    setReviewerRemarks('');
  };

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Module Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Student Requests</h1>
            <p className="text-xs text-slate-500 font-medium">
              Review and respond to student requests.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, request type..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          {/* Request Type Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Request Type</span>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Profile Update">Profile Update</option>
              <option value="Attendance Correction">Attendance Correction</option>
              <option value="Academic Record Clarification">Academic Record Clarification</option>
              <option value="Subject Enrollment">Subject Enrollment</option>
              <option value="Medical Leave">Medical Leave</option>
            </select>
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Status</span>
            <select
              value={statusTab}
              onChange={(e) => {
                setStatusTab(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Forwarded">Forwarded</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Filter Status Tabs matching reference */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="flex border-b border-slate-100 px-3 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => {
              setStatusTab('All');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              statusTab === 'All'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold">({counts.all})</span>
          </button>

          <button
            onClick={() => {
              setStatusTab('Under Review');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              statusTab === 'Under Review'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Under Review <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700 font-bold">({counts.underReview})</span>
          </button>

          <button
            onClick={() => {
              setStatusTab('Approved');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              statusTab === 'Approved'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Approved <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold">({counts.approved})</span>
          </button>

          <button
            onClick={() => {
              setStatusTab('Forwarded');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              statusTab === 'Forwarded'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Forwarded <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">({counts.forwarded})</span>
          </button>

          <button
            onClick={() => {
              setStatusTab('Rejected');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              statusTab === 'Rejected'
                ? 'border-blue-600 text-blue-600 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Rejected <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-700 font-bold">({counts.rejected})</span>
          </button>
        </div>

        {/* 3. Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Request ID</th>
                <th className="px-4 py-3.5">Student Name</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Description</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paginatedRequests.map((r) => (
                <tr key={r.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3.5 font-bold font-mono text-blue-700">{r.id}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{r.studentName}</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-700">{r.type}</td>
                  <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">{r.description}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${r.statusBadge}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 font-medium text-[11px]">{r.date}</td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedRequest(r)}
                      className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedRequests.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-400">
                    No student requests found under selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <span className="text-xs font-medium text-slate-500">
            Showing {filteredRequests.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + itemsPerPage, filteredRequests.length)} of {filteredRequests.length} requests
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

      {/* Review Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider font-mono">
                  {selectedRequest.id}
                </span>
                <h3 className="text-base font-extrabold text-slate-900">{selectedRequest.type}</h3>
                <p className="text-xs text-slate-500">
                  Student: <strong>{selectedRequest.studentName}</strong> ({selectedRequest.prn})
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Request Summary</span>
                <p className="text-slate-800 font-medium">{selectedRequest.description}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-bold block uppercase text-[10px]">Supporting Details & Justification</span>
                <p className="text-slate-700 leading-relaxed">{selectedRequest.details || 'No additional attachment.'}</p>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Submission Date:</span>
                <span className="font-semibold text-slate-800">{selectedRequest.date}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 font-medium">Current Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${selectedRequest.statusBadge}`}>
                  {selectedRequest.status}
                </span>
              </div>

              {/* Remarks Textarea */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Class Teacher Review Remarks
                </label>
                <textarea
                  rows={2}
                  value={reviewerRemarks}
                  onChange={(e) => setReviewerRemarks(e.target.value)}
                  placeholder="Enter notes or justification for action..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleAction('Approved')}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction('Forwarded')}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Forward to HOD
              </button>
              <button
                onClick={() => handleAction('Rejected')}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Reject
              </button>
              <button
                onClick={() => handleAction('Under Review')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Hold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
