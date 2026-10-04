import React, { useState, useMemo } from 'react';
import { usePlacementAdmin } from '../../../context/PlacementAdminContext';
import { PlacementAdminHeader } from '../components/PlacementAdminHeader';
import {
  Megaphone,
  Search,
  Filter,
  Plus,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  X,
  Send,
  AlertTriangle,
  FileText,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export function PlacementAnnouncementsModule({ onNavigateTab }) {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = usePlacementAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAnn, setSelectedAnn] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    title: '',
    category: 'Placement Drive Alert',
    target: 'BE Final Year (All Branches)',
    priority: 'High',
    status: 'Published',
    content: '',
  });

  const filteredAnnouncements = useMemo(() => {
    return (announcements || []).filter((ann) => {
      const matchSearch =
        searchQuery === '' ||
        (ann.title && ann.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ann.content && ann.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ann.target && ann.target.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchTab =
        activeTab === 'All' ||
        (activeTab === 'Urgent' ? ann.priority === 'High' : ann.status === activeTab);

      return matchSearch && matchTab;
    });
  }, [announcements, searchQuery, activeTab]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      title: '',
      category: 'Placement Drive Alert',
      target: 'BE Final Year (All Branches)',
      priority: 'High',
      status: 'Published',
      content: '',
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (ann) => {
    setIsEditing(true);
    setSelectedAnn(ann);
    setFormData({
      title: ann.title || '',
      category: ann.category || 'Placement Drive Alert',
      target: ann.target || 'BE Final Year (All Branches)',
      priority: ann.priority || 'Normal',
      status: ann.status || 'Published',
      content: ann.content || '',
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing && selectedAnn) {
      updateAnnouncement(selectedAnn.id, formData);
    } else {
      addAnnouncement(formData);
    }
    setShowAddModal(false);
    setSelectedAnn(null);
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete announcement "${title}"?`)) {
      deleteAnnouncement(id);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <PlacementAdminHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search placement announcements, drive circulars..."
        onNavigateTab={onNavigateTab}
      />

      {/* Page Title Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5" /> Broadcast Center
            </span>
            <span className="text-xs text-slate-500 font-medium">Student Notifications</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Placement Announcements &amp; Circulars</h1>
          <p className="text-xs text-slate-500">
            Publish recruitment drive alerts, pre-placement talk notices, aptitude guidelines, and shortlist updates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" /> Broadcast Announcement
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {['All', 'Published', 'Draft', 'Urgent'].map((tab) => {
          const count =
            tab === 'All'
              ? announcements.length
              : tab === 'Urgent'
              ? announcements.filter((a) => a.priority === 'High').length
              : announcements.filter((a) => a.status === tab).length;

          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <span>{tab === 'All' ? 'All Broadcasts' : tab}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  isActive ? 'bg-purple-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    ann.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-purple-50 text-purple-600'
                  }`}
                >
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{ann.title}</h3>
                    {ann.priority === 'High' && (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Urgent
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-[10.5px] font-semibold">
                      {ann.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {ann.date || 'Today'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Target: <b className="text-slate-700">{ann.target}</b>
                    </span>
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                    ann.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {ann.status}
                </span>
                <button
                  onClick={() => {
                    setSelectedAnn(ann);
                    setShowDetailsModal(true);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  title="View Full Notice"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(ann)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                  title="Edit Notice"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(ann.id, ann.title)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pl-13">
              {ann.content ||
                'All eligible registered students are requested to be present on time in formal attire with 2 physical copies of their verified resumes and college ID cards.'}
            </p>
          </div>
        ))}
      </div>

      {/* MODAL 1: View Full Announcement */}
      {showDetailsModal && selectedAnn && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">{selectedAnn.title}</h3>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Cohort</span>
                <span className="font-bold text-slate-800">{selectedAnn.target}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                <span className="font-bold text-purple-700">{selectedAnn.category}</span>
              </div>
            </div>

            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 text-xs text-slate-700 space-y-2">
              <h4 className="font-bold text-slate-900 uppercase text-[10.5px] tracking-wider">Official Circular Text</h4>
              <p className="leading-relaxed whitespace-pre-line">
                {selectedAnn.content ||
                  'Please adhere strictly to company guidelines during the aptitude test and technical interview process. Mobile phones are prohibited inside the examination center.'}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Published by: <b>Prof. Satyajit Sirsat (TPO Office)</b></span>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create / Edit Announcement */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Placement Announcement' : 'Broadcast New Announcement'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCS Digital On-Campus Drive Instructions"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  >
                    <option value="Placement Drive Alert">Placement Drive Alert</option>
                    <option value="Shortlist Circular">Shortlist Circular</option>
                    <option value="Pre-Placement Talk">Pre-Placement Talk</option>
                    <option value="Interview Schedule">Interview Schedule</option>
                    <option value="Policy Notice">Policy Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High / Urgent Notice</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Cohort *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BE & TE (Computer, IT)"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Publish Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  >
                    <option value="Published">Published immediately</option>
                    <option value="Draft">Save as Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notification Body Content *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide comprehensive instructions, venue timings, document checklist, and dress code requirements..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {isEditing ? 'Save Notice' : 'Broadcast Circular'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
