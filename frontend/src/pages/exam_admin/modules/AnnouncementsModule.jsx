import React, { useState, useMemo } from 'react';
import { useExamAdmin } from '../../../context/ExamAdminContext';
import { useToast } from '../../../context/ToastContext';
import { ExamAdminHeader } from '../components/ExamAdminHeader';
import { Modal } from '../../../components/Modal';
import {
  Megaphone,
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  Ticket,
  Award,
  Clock,
  FileText,
  AlertCircle,
  Eye,
  Send,
  Users
} from 'lucide-react';

export function AnnouncementsModule({ onNavigateTab }) {
  const { announcements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useExamAdmin();
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Published', 'Drafts'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [deletingAnn, setDeletingAnn] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    category: 'Guidelines',
    target: 'All Students',
    status: 'Published',
  });

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTab =
        activeTab === 'All' ||
        (activeTab === 'Published' && a.status === 'Published') ||
        (activeTab === 'Drafts' && a.status === 'Draft');
      return matchSearch && matchTab;
    });
  }, [announcements, searchQuery, activeTab]);

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      desc: '',
      category: 'Guidelines',
      target: 'All Students',
      status: 'Published',
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      error('Please provide an announcement title.');
      return;
    }
    createAnnouncement(formData);
    setShowCreateModal(false);
  };

  const handleOpenEdit = (ann) => {
    setEditingAnn(ann);
    setFormData({
      title: ann.title,
      desc: ann.desc,
      category: ann.category || 'Guidelines',
      target: ann.target || 'All Students',
      status: ann.status,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      error('Please provide an announcement title.');
      return;
    }
    updateAnnouncement(editingAnn.id, formData);
    setEditingAnn(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingAnn) {
      deleteAnnouncement(deletingAnn.id);
      setDeletingAnn(null);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Hall Tickets':
        return { icon: Ticket, bg: 'bg-blue-50 text-blue-600' };
      case 'Results':
        return { icon: Award, bg: 'bg-emerald-50 text-emerald-600' };
      case 'Faculty Notice':
        return { icon: Clock, bg: 'bg-amber-50 text-amber-600' };
      default:
        return { icon: Megaphone, bg: 'bg-rose-50 text-rose-600' };
    }
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. Header */}
      <ExamAdminHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search examination circulars & notices..."
        onNavigateTab={onNavigateTab}
      />

      {/* 2. Main Page Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
        {/* Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Announcements</h1>
            <p className="text-xs text-slate-500">Create and manage examination announcements</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
        </div>

        {/* Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl w-fit">
            {['All', 'Published', 'Drafts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>
        </div>

        {/* Announcements List Cards */}
        <div className="space-y-3 pt-2">
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((ann) => {
              const { icon: Icon, bg } = getCategoryIcon(ann.category);
              return (
                <div
                  key={ann.id}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">{ann.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            ann.status === 'Published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {ann.status}
                        </span>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-[10px] font-semibold">
                          Target: {ann.target}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{ann.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-xs text-slate-400 font-medium">{ann.date}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(ann)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Announcement"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingAnn(ann)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No circulars or announcements found.
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL: CREATE ANNOUNCEMENT ================= */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Examination Announcement"
          subtitle="Broadcast guidelines, schedules, or marks notices"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Schedule for In-Semester Assessments"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Detailed Description *</label>
              <textarea
                rows={3}
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                placeholder="Write full instructions, deadlines, or circular details..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Guidelines">Guidelines</option>
                  <option value="Hall Tickets">Hall Tickets</option>
                  <option value="Results">Results</option>
                  <option value="Faculty Notice">Faculty Notice</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Audience</label>
                <select
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="All Students">All Students</option>
                  <option value="SE Candidates">SE Candidates</option>
                  <option value="TE Candidates">TE Candidates</option>
                  <option value="BE Candidates">BE Candidates</option>
                  <option value="Department Faculty">Department Faculty</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Publish Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="Published">Publish Immediately</option>
                <option value="Draft">Save as Draft</option>
              </select>
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
                Post Announcement
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: EDIT ANNOUNCEMENT ================= */}
      {editingAnn && (
        <Modal
          isOpen={!!editingAnn}
          onClose={() => setEditingAnn(null)}
          title="Edit Announcement"
          subtitle={`Editing #${editingAnn.id}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Detailed Description *</label>
              <textarea
                rows={3}
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Guidelines">Guidelines</option>
                  <option value="Hall Tickets">Hall Tickets</option>
                  <option value="Results">Results</option>
                  <option value="Faculty Notice">Faculty Notice</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingAnn(null)}
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
      {deletingAnn && (
        <Modal
          isOpen={!!deletingAnn}
          onClose={() => setDeletingAnn(null)}
          title="Delete Announcement Confirmation"
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-700">
              Are you sure you want to remove the announcement <strong className="text-slate-900">"{deletingAnn.title}"</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingAnn(null)}
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
