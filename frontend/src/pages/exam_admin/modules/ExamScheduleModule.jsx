import React, { useState, useMemo } from 'react';
import { useExamAdmin } from '../../../context/ExamAdminContext';
import { useToast } from '../../../context/ToastContext';
import { ExamAdminHeader } from '../components/ExamAdminHeader';
import { Modal } from '../../../components/Modal';
import {
  Calendar,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export function ExamScheduleModule({ onNavigateTab }) {
  const { schedules, createSchedule, updateSchedule, deleteSchedule } = useExamAdmin();
  const { success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [academicYear, setAcademicYear] = useState('2024 - 2025');
  const [semester, setSemester] = useState('Semester II');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [viewingSchedule, setViewingSchedule] = useState(null);
  const [deletingSchedule, setDeletingSchedule] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    class: 'SE',
    semester: 'II',
    date: '2025-04-15',
    time: '09:00 AM',
    duration: '3 hrs',
    venue: 'Hall A-101',
    status: 'Scheduled',
  });

  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.date.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = selectedClass === 'All Classes' || s.class === selectedClass;
      const matchSem = semester === 'All Semesters' || (semester === 'Semester II' && s.semester === 'II') || (semester === 'Semester I' && s.semester === 'I');
      return matchSearch && matchClass && matchSem;
    });
  }, [schedules, searchQuery, selectedClass, semester]);

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage) || 1;
  const paginatedSchedules = filteredSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      class: 'SE',
      semester: 'II',
      date: '2025-04-15',
      time: '09:00 AM',
      duration: '3 hrs',
      venue: 'Hall A-101',
      status: 'Scheduled',
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Please provide an examination name.');
      return;
    }
    const ok = createSchedule(formData);
    if (ok) {
      setShowCreateModal(false);
    }
  };

  const handleOpenEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      name: schedule.name,
      class: schedule.class,
      semester: schedule.semester,
      date: schedule.date,
      time: schedule.time,
      duration: schedule.duration,
      venue: schedule.venue || 'Hall A-101',
      status: schedule.status,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Please provide an examination name.');
      return;
    }
    updateSchedule(editingSchedule.id, formData);
    setEditingSchedule(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingSchedule) {
      deleteSchedule(deletingSchedule.id);
      setDeletingSchedule(null);
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
        placeholder="Search exam schedules, subjects, venues..."
        onNavigateTab={onNavigateTab}
      />

      {/* 2. Main Page Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
        {/* Title and Top Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Exam Schedule</h1>
            <p className="text-xs text-slate-500">View and manage the semester examination schedule</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Create Schedule
          </button>
        </div>

        {/* Filters Bar matching Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Academic Year</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="2024 - 2025">2024 - 2025</option>
              <option value="2025 - 2026">2025 - 2026</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Semester</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="Semester II">Semester II</option>
              <option value="Semester I">Semester I</option>
              <option value="All Semesters">All Semesters</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="All Classes">All Classes</option>
              <option value="SE">SE (Second Year)</option>
              <option value="TE">TE (Third Year)</option>
              <option value="BE">BE (Final Year)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Search Table</label>
            <div className="relative">
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
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto border border-slate-200/90 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Exam Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedSchedules.length > 0 ? (
                paginatedSchedules.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">{item.date}</td>
                    <td className="py-3 px-4 text-slate-600">{item.time}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{item.class}</td>
                    <td className="py-3 px-4 text-slate-600">{item.semester}</td>
                    <td className="py-3 px-4 text-slate-600">{item.duration}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(item.status)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewingSchedule(item)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Schedule"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingSchedule(item)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Schedule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No examination schedules found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-slate-500">
          <span>
            Showing {filteredSchedules.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredSchedules.length)} of {filteredSchedules.length} entries
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

      {/* ================= MODAL: CREATE SCHEDULE ================= */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Examination Schedule"
          subtitle="Configure session timetable and hall venue"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Examination / Subject Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Distributed Systems"
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
                <label className="block text-slate-700 font-bold mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Start Time *</label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="09:00 AM">09:00 AM (Morning Slot)</option>
                  <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
                  <option value="10:00 AM">10:00 AM (Practical Slot)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g. 3 hrs"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Venue / Examination Hall</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Hall A-101"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
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
                Create Schedule
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: EDIT SCHEDULE ================= */}
      {editingSchedule && (
        <Modal
          isOpen={!!editingSchedule}
          onClose={() => setEditingSchedule(null)}
          title="Edit Examination Schedule"
          subtitle={`Modifying ${editingSchedule.name}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Examination / Subject Name *</label>
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
                  <option value="Scheduled">Scheduled</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Time</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingSchedule(null)}
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

      {/* ================= MODAL: VIEW DETAILS ================= */}
      {viewingSchedule && (
        <Modal
          isOpen={!!viewingSchedule}
          onClose={() => setViewingSchedule(null)}
          title="Examination Schedule Overview"
          subtitle={viewingSchedule.name}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Class &amp; Semester:</span>
                <span className="font-bold text-slate-900">{viewingSchedule.class} • Semester {viewingSchedule.semester}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Scheduled Date:</span>
                <span className="font-semibold text-slate-900">{viewingSchedule.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Time Slot:</span>
                <span className="font-semibold text-slate-900">{viewingSchedule.time} ({viewingSchedule.duration})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Venue / Hall:</span>
                <span className="font-semibold text-slate-900">{viewingSchedule.venue || 'Hall A-101'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(viewingSchedule.status)}`}>
                  {viewingSchedule.status}
                </span>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingSchedule(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deletingSchedule && (
        <Modal
          isOpen={!!deletingSchedule}
          onClose={() => setDeletingSchedule(null)}
          title="Delete Schedule Confirmation"
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Are you sure you want to delete this schedule?</p>
                <p className="text-rose-700 text-[11px] mt-0.5">
                  "{deletingSchedule.name}" scheduled for {deletingSchedule.class} on {deletingSchedule.date} will be removed.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingSchedule(null)}
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
