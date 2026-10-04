import React, { useState, useMemo } from 'react';
import { useExamAdmin } from '../../../context/ExamAdminContext';
import { useToast } from '../../../context/ToastContext';
import { ExamAdminHeader } from '../components/ExamAdminHeader';
import { Modal } from '../../../components/Modal';
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  FileCheck2
} from 'lucide-react';

export function ExamManagementModule({ onNavigateTab }) {
  const { exams, createExam, updateExam, deleteExam } = useExamAdmin();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('All Exams'); // 'All Exams', 'Ongoing', 'Upcoming', 'Completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [deletingExam, setDeletingExam] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    class: 'SE',
    semester: 'II',
    type: 'End Semester',
    academicYear: '2024-2025',
    scheme: 'SPPU 2019 Course Pattern',
    status: 'Upcoming',
  });

  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.type || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchTab =
        activeTab === 'All Exams' ||
        (activeTab === 'Upcoming' && (e.status === 'Upcoming' || e.status === 'Scheduled')) ||
        (activeTab === 'Ongoing' && e.status === 'Ongoing') ||
        (activeTab === 'Completed' && (e.status === 'Completed' || e.status === 'Published'));
      return matchSearch && matchTab;
    });
  }, [exams, searchQuery, activeTab]);

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage) || 1;
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      class: 'SE',
      semester: 'II',
      type: 'End Semester',
      academicYear: '2024-2025',
      scheme: 'SPPU 2019 Course Pattern',
      status: 'Upcoming',
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Please provide an examination title.');
      return;
    }
    createExam(formData);
    setShowCreateModal(false);
  };

  const handleOpenEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name,
      class: exam.class,
      semester: exam.semester,
      type: exam.type || 'End Semester',
      academicYear: exam.academicYear || '2024-2025',
      scheme: exam.scheme || 'SPPU 2019 Course Pattern',
      status: exam.status,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Please provide an examination title.');
      return;
    }
    updateExam(editingExam.id, formData);
    setEditingExam(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingExam) {
      deleteExam(deletingExam.id);
      setDeletingExam(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      case 'Scheduled':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'Draft':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'Ongoing':
        return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'Completed':
        return 'bg-purple-50 text-purple-600 border border-purple-200';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. Header */}
      <ExamAdminHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search examinations, schemes, classes..."
        onNavigateTab={onNavigateTab}
      />

      {/* 2. Main Page Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
        {/* Title & Top Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Exam Management</h1>
            <p className="text-xs text-slate-500">Create, manage and configure examinations</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create Examination
          </button>
        </div>

        {/* Tabs & Search Bar matching Reference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl w-fit">
            {['All Exams', 'Ongoing', 'Upcoming', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
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

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exam..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
        </div>

        {/* Exam Table */}
        <div className="overflow-x-auto border border-slate-200/90 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Exam Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedExams.length > 0 ? (
                paginatedExams.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{item.class}</td>
                    <td className="py-3 px-4 text-slate-600">{item.semester}</td>
                    <td className="py-3 px-4 font-medium text-slate-600">{item.type}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(item.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Examination"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingExam(item)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Examination"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No examinations found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-slate-500">
          <span>
            Showing {filteredExams.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredExams.length)} of {filteredExams.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#6B46FE] text-white'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL: CREATE EXAM ================= */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Examination Session"
          subtitle="Define session pattern, semester, and course scheme"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Examination Title *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. End Semester Theory Examination 2025"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Class *</label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="SE">SE (Second Year)</option>
                  <option value="TE">TE (Third Year)</option>
                  <option value="BE">BE (Final Year)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Semester *</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="II">Semester II</option>
                  <option value="I">Semester I</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Examination Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="End Semester">End Semester</option>
                  <option value="In-Semester / Unit Test">In-Semester / Unit Test</option>
                  <option value="Practical & Viva">Practical &amp; Viva</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Curricular Scheme</label>
              <input
                type="text"
                value={formData.scheme}
                onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Create Examination
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: EDIT EXAM ================= */}
      {editingExam && (
        <Modal
          isOpen={!!editingExam}
          onClose={() => setEditingExam(null)}
          title="Edit Examination Configuration"
          subtitle={`Modifying ${editingExam.name}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Examination Title *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Class *</label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="SE">SE (Second Year)</option>
                  <option value="TE">TE (Third Year)</option>
                  <option value="BE">BE (Final Year)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Type</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Curricular Scheme</label>
                <input
                  type="text"
                  value={formData.scheme}
                  onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingExam(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deletingExam && (
        <Modal
          isOpen={!!deletingExam}
          onClose={() => setDeletingExam(null)}
          title="Delete Examination Confirmation"
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Are you sure you want to delete this examination?</p>
                <p className="text-rose-700 text-[11px] mt-0.5">
                  "{deletingExam.name}" ({deletingExam.class}) will be removed from the system.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingExam(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
