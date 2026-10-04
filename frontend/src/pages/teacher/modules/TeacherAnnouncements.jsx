import React, { useState } from 'react';
import { useTeacher } from '../../../context/TeacherContext';
import { useToast } from '../../../context/ToastContext';
import {
  Megaphone,
  Plus,
  Search,
  MoreVertical,
  Calendar,
  Users,
  Eye,
  Trash2,
  Edit2,
  X,
  Check,
  Send,
  Sparkles
} from 'lucide-react';

export function TeacherAnnouncements() {
  const { announcements, addAnnouncement, deleteAnnouncement } = useTeacher();
  const { success, info } = useToast();

  const [categoryTab, setCategoryTab] = useState('All'); // 'All' | 'Academic' | 'Examination' | 'Events' | 'General'
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // New Announcement Form state
  const [form, setForm] = useState({
    title: '',
    category: 'Academic',
    audience: 'Class (All)',
    desc: '',
  });

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesCategory = categoryTab === 'All' || a.category === categoryTab;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.desc) return;
    addAnnouncement(form);
    setShowCreateModal(false);
    setForm({
      title: '',
      category: 'Academic',
      audience: 'Class (All)',
      desc: '',
    });
  };

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Module Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Announcements</h1>
            <p className="text-xs text-slate-500 font-medium">
              Share important updates with your class.
            </p>
          </div>
        </div>

        {/* Action Button & Search */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Announcement</span>
          </button>
        </div>
      </div>

      {/* 2. Category Tabs matching reference */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="flex border-b border-slate-100 px-4 pt-2 gap-2 overflow-x-auto">
          {['All', 'Academic', 'Examination', 'Events', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryTab(cat)}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                categoryTab === cat
                  ? 'border-blue-600 text-blue-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. Announcements List */}
        <div className="p-4 space-y-3">
          {filteredAnnouncements.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-200 hover:shadow-2xs transition-all flex items-start gap-3.5 relative"
            >
              <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${item.dotColor || 'bg-blue-500'}`} />

              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3
                    onClick={() => setSelectedAnnouncement(item)}
                    className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-400">{item.date}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.categoryPill}`}>
                      {item.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {item.audience || 'Class (All)'}
                    </span>

                    {/* Options Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === item.id && (
                        <div className="absolute right-0 top-7 w-32 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-20">
                          <button
                            onClick={() => {
                              setSelectedAnnouncement(item);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            View
                          </button>
                          <button
                            onClick={() => {
                              deleteAnnouncement(item.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{item.desc}</p>
              </div>
            </div>
          ))}

          {filteredAnnouncements.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No announcements found under "{categoryTab}".
            </div>
          )}
        </div>
      </div>

      {/* New Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Create Class Announcement</h3>
                  <p className="text-xs text-slate-500">Publish update to TE Computer — Div A students</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Internal Test 2 Timetable Released"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white cursor-pointer"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Examination">Examination</option>
                    <option value="Events">Events</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Target Audience
                  </label>
                  <select
                    value={form.audience}
                    onChange={(e) => setForm({ ...form, audience: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white cursor-pointer"
                  >
                    <option value="Class (All)">Class (All)</option>
                    <option value="Div A Only">Div A Only</option>
                    <option value="Batch 1">Batch 1 (Roll 01–20)</option>
                    <option value="Batch 2">Batch 2 (Roll 21–40)</option>
                    <option value="Batch 3">Batch 3 (Roll 41–58)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Announcement Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="Provide complete details, instructions, syllabus links or deadlines..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Announcement Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${selectedAnnouncement.categoryPill}`}>
                  {selectedAnnouncement.category}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">{selectedAnnouncement.title}</h3>
                <p className="text-xs text-slate-400 font-medium">Published: {selectedAnnouncement.date}</p>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed p-3 bg-slate-50 rounded-xl">
              {selectedAnnouncement.desc}
            </p>

            <div className="flex justify-between items-center text-xs text-slate-500">
              <span>Audience: <strong>{selectedAnnouncement.audience || 'Class (All)'}</strong></span>
              <span className="text-emerald-600 font-bold">Status: Live</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
