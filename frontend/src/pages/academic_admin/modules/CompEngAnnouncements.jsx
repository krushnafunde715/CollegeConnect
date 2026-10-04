import React, { useState } from 'react';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Pin,
  Trash2,
  Eye,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  FileText
} from 'lucide-react';

export function CompEngAnnouncements({
  announcements = [],
  onAddAnnouncement,
  onDeleteAnnouncement,
  onTogglePin,
  departmentName = 'Computer Engineering',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingNotice, setViewingNotice] = useState(null);

  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'Academic',
    target_audience: 'All Students & Faculty',
    content: '',
    status: 'Published',
    priority: 'normal',
    is_pinned: false,
  });

  const categories = [
    { id: 'ALL', label: 'All Announcements', count: announcements.length },
    { id: 'Academic', label: 'Academic', count: announcements.filter(a => a.category === 'Academic' || a.category === 'Academic & Syllabus').length },
    { id: 'Examinations', label: 'Examinations', count: announcements.filter(a => a.category === 'Examinations' || a.category === 'Examination' || a.category === 'Lab & Practical').length },
    { id: 'Placements', label: 'Placements', count: announcements.filter(a => a.category === 'Placements' || a.category === 'Seminars & Projects').length },
    { id: 'General', label: 'General', count: announcements.filter(a => a.category === 'General' || !['Academic', 'Academic & Syllabus', 'Examinations', 'Examination', 'Lab & Practical', 'Placements', 'Seminars & Projects'].includes(a.category)).length },
  ];

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.content && a.content.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedCategory === 'ALL') return matchesSearch;
    if (selectedCategory === 'Academic') return matchesSearch && (a.category === 'Academic' || a.category === 'Academic & Syllabus');
    if (selectedCategory === 'Examinations') return matchesSearch && (a.category === 'Examinations' || a.category === 'Examination' || a.category === 'Lab & Practical');
    if (selectedCategory === 'Placements') return matchesSearch && (a.category === 'Placements' || a.category === 'Seminars & Projects');
    if (selectedCategory === 'General') return matchesSearch && (a.category === 'General' || !['Academic', 'Academic & Syllabus', 'Examinations', 'Examination', 'Lab & Practical', 'Placements', 'Seminars & Projects'].includes(a.category));
    return matchesSearch;
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (onAddAnnouncement) {
      onAddAnnouncement({
        ...newNotice,
        id: Date.now(),
        date: 'Today',
      });
    }
    setShowAddModal(false);
    setNewNotice({
      title: '',
      category: 'Academic',
      target_audience: 'All Students & Faculty',
      content: '',
      status: 'Published',
      priority: 'normal',
      is_pinned: false,
    });
  };

  const getCategoryBadgeVariant = (cat) => {
    if (cat === 'Academic' || cat === 'Academic & Syllabus') return 'indigo';
    if (cat === 'Examinations' || cat === 'Examination' || cat === 'Lab & Practical') return 'amber';
    if (cat === 'Placements' || cat === 'Seminars & Projects') return 'emerald';
    return 'slate';
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Computer Engineering Notices & Broadcasts
              </h2>
              <span className="px-2 py-0.5 text-xs font-extrabold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                {announcements.length} Notices
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Official circulars, exam notices, lab schedules, and placement announcements for {departmentName}.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
        </div>

        {/* Category Filter Pills (Screen 7 Reference) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#635BFF] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input Bar */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notices by title, keywords, or circular contents..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

      {/* Announcements Table & Cards (Screen 7 Data Table View) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Target Audience</th>
                <th className="py-3 px-4">Published Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAnnouncements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No announcements found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredAnnouncements.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      item.is_pinned ? 'bg-indigo-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2.5 max-w-md">
                        {item.is_pinned && (
                          <span className="p-1 bg-indigo-100 text-indigo-700 rounded-md shrink-0 mt-0.5" title="Pinned Announcement">
                            <Pin className="w-3 h-3 fill-indigo-700" />
                          </span>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={getCategoryBadgeVariant(item.category)} size="sm">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.target_audience || 'All Students & Faculty'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.date || 'Today'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.status || 'Published'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingNotice(item)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="View Notice Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onTogglePin && onTogglePin(item.id)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            item.is_pinned
                              ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50 border-slate-200'
                          }`}
                          title={item.is_pinned ? 'Unpin Notice' : 'Pin to Top'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteAnnouncement && onDeleteAnnouncement(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal: View Notice Details */}
      {viewingNotice && (
        <Modal
          isOpen={!!viewingNotice}
          onClose={() => setViewingNotice(null)}
          title={viewingNotice.title}
          subtitle={`Published on ${viewingNotice.date || 'Today'} • Audience: ${viewingNotice.target_audience || 'All'}`}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={getCategoryBadgeVariant(viewingNotice.category)} size="sm">
                {viewingNotice.category}
              </Badge>
              {viewingNotice.is_pinned && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                  <Pin className="w-3 h-3 fill-indigo-700" /> Pinned
                </span>
              )}
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {viewingNotice.content}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingNotice(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Create Announcement */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Publish Computer Engineering Circular"
        subtitle="Broadcast notices to department students, cohorts, or teaching faculty"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notice Headline / Title
            </label>
            <input
              type="text"
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              placeholder="e.g. SE/TE Computer Engineering Mini-Project Submission Window"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={newNotice.category}
                onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600"
              >
                <option value="Academic">Academic</option>
                <option value="Examinations">Examinations</option>
                <option value="Placements">Placements</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Audience
              </label>
              <select
                value={newNotice.target_audience}
                onChange={(e) => setNewNotice({ ...newNotice, target_audience: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600"
              >
                <option value="All Students & Faculty">All Students & Faculty</option>
                <option value="All Comp Eng Students">All Comp Eng Students</option>
                <option value="SE Cohort (Div A & B)">SE Cohort (Div A & B)</option>
                <option value="TE Cohort (Div A & B)">TE Cohort (Div A & B)</option>
                <option value="BE Cohort (Div A & B)">BE Cohort (Div A & B)</option>
                <option value="Department Faculty Only">Department Faculty Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Notice Content
            </label>
            <textarea
              rows={4}
              value={newNotice.content}
              onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
              placeholder="Enter the official circular message, guidelines, deadlines, or room details..."
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="pinNotice"
              checked={newNotice.is_pinned}
              onChange={(e) => setNewNotice({ ...newNotice, is_pinned: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="pinNotice" className="text-xs font-medium text-slate-700 cursor-pointer">
              Pin this notice to top of student portal noticeboards
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Publish Circular
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
