import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Archive,
  Pin,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Send,
  Trash2
} from 'lucide-react';

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Semester End Examination Schedule Released',
    description: 'The finalized timetable for Odd Semester 2026 examinations has been published. Hall tickets will be available for download 5 days prior to subject commencement.',
    category: 'Examination',
    audience: 'All Students',
    publishedBy: 'Dr. S. Kulkarni (Super Admin)',
    publishDate: '2026-10-12',
    expiryDate: '2026-11-30',
    status: 'published',
    isPinned: true,
    viewsCount: 3420,
  },
  {
    id: 2,
    title: 'Campus Recruitment Drive - Tata Consultancy Services (TCS)',
    description: 'Registration for TCS Digital & Ninja roles is now open for BE 2027 batch. Students meeting the eligibility criteria (CGPA >= 7.5) must register before Oct 25.',
    category: 'Placement',
    audience: 'BE Final Year Students',
    publishedBy: 'Placement Officer',
    publishDate: '2026-10-10',
    expiryDate: '2026-10-25',
    status: 'published',
    isPinned: true,
    viewsCount: 1250,
  },
  {
    id: 3,
    title: 'Revised Academic Calendar for AY 2026-27 Approved',
    description: 'The Academic Council has approved the modified mid-term review and technical symposium schedules. Please check the updated institutional calendar.',
    category: 'Academic',
    audience: 'All Faculty & Students',
    publishedBy: 'Dr. S. Kulkarni (Super Admin)',
    publishDate: '2026-10-08',
    expiryDate: '2027-06-30',
    status: 'published',
    isPinned: false,
    viewsCount: 2890,
  },
  {
    id: 4,
    title: 'Continuous Internal Assessment (CIA) Marks Submission Window',
    description: 'All subject teachers and class in-charges must complete the online entry of CIA Unit Test 1 marks by Oct 20.',
    category: 'Academic',
    audience: 'Faculty Only',
    publishedBy: 'Academic Dean',
    publishDate: '2026-10-05',
    expiryDate: '2026-10-20',
    status: 'published',
    isPinned: false,
    viewsCount: 184,
  },
  {
    id: 5,
    title: 'National Innovation Hackathon 2026 - Call for Projects',
    description: 'Inter-departmental student teams are invited to submit innovative prototypes for the annual hackathon. Cash prizes and incubation grants available.',
    category: 'General',
    audience: 'All Students',
    publishedBy: 'R&D Cell',
    publishDate: '2026-10-01',
    expiryDate: '2026-11-15',
    status: 'draft',
    isPinned: false,
    viewsCount: 0,
  },
];

export function AnnouncementsModule() {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic',
    audience: 'All Students',
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    isPinned: false,
    status: 'published',
  });

  const { success, error } = useToast();

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.publishedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || a.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter.toLowerCase();
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      error('Announcement Title and Content are required.');
      return;
    }

    const newAnn = {
      id: Date.now(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      audience: formData.audience,
      publishedBy: 'Dr. S. Kulkarni (Super Admin)',
      publishDate: formData.publishDate,
      expiryDate: formData.expiryDate || '2026-12-31',
      status: formData.status,
      isPinned: formData.isPinned,
      viewsCount: 0,
    };

    setAnnouncements([newAnn, ...announcements]);
    setShowCreateModal(false);
    setFormData({
      title: '',
      description: '',
      category: 'Academic',
      audience: 'All Students',
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      isPinned: false,
      status: 'published',
    });
    success(`Announcement "${newAnn.title}" ${newAnn.status === 'published' ? 'broadcasted' : 'saved as draft'}.`);
  };

  const handleUpdateAnnouncement = (e) => {
    e.preventDefault();
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === selectedAnnouncement.id ? { ...a, ...formData } : a))
    );
    setShowEditModal(false);
    success(`Announcement "${formData.title}" updated.`);
  };

  const togglePin = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPinned: !a.isPinned } : a))
    );
    success('Pin status toggled.');
  };

  const archiveAnnouncement = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: a.status === 'archived' ? 'published' : 'archived' } : a))
    );
    success('Announcement archive state updated.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Megaphone className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Institutional Announcements</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Broadcast official administrative notices, academic memos, and targeted departmental circulars.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                category: 'Academic',
                audience: 'All Students',
                publishDate: new Date().toISOString().split('T')[0],
                expiryDate: '',
                isPinned: false,
                status: 'published',
              });
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
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
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto text-xs font-medium text-slate-600">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Examination">Examination</option>
            <option value="Placement">Placement</option>
            <option value="General">General</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Drafts</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Announcements Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Target Audience</th>
                <th className="py-3.5 px-4">Published By</th>
                <th className="py-3.5 px-4">Publish Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredAnnouncements.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-sm">
                    <div className="flex items-center gap-2">
                      {item.isPinned && (
                        <span className="p-1 bg-amber-100 text-amber-700 rounded-md shrink-0" title="Pinned Announcement">
                          <Pin className="w-3 h-3 fill-current" />
                        </span>
                      )}
                      <p className="truncate">{item.title}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{item.audience}</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.publishedBy}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{item.publishDate}</td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={item.status}>{item.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedAnnouncement(item)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Content"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => togglePin(item.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          item.isPinned ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                        }`}
                        title={item.isPinned ? 'Unpin' : 'Pin to Top'}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAnnouncement(item);
                          setFormData({
                            title: item.title,
                            description: item.description,
                            category: item.category,
                            audience: item.audience,
                            publishDate: item.publishDate,
                            expiryDate: item.expiryDate,
                            isPinned: item.isPinned,
                            status: item.status,
                          });
                          setShowEditModal(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Announcement"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => archiveAnnouncement(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title={item.status === 'archived' ? 'Restore' : 'Archive'}
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Broadcast New Announcement"
        subtitle="Compose and publish official notice across portals."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateAnnouncement} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Headline / Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Schedule for University Practical Exams 2026"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="Academic">Academic</option>
                <option value="Examination">Examination</option>
                <option value="Placement">Placement</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Audience</label>
              <select
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="All Students">All Students</option>
                <option value="All Faculty & Students">All Faculty & Students</option>
                <option value="Faculty Only">Faculty Only</option>
                <option value="BE Final Year Students">BE Final Year Students</option>
                <option value="Computer Engineering Department">Computer Engineering Department</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Notice Content / Description *</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed explanation, instructions, and deadlines..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Publish Date</label>
              <input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              Pin to Top of Dashboard
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={() => setFormData({ ...formData, status: 'published' })}
                className="text-indigo-600"
              />
              Publish Immediately
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={() => setFormData({ ...formData, status: 'draft' })}
                className="text-indigo-600"
              />
              Save as Draft
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
            >
              Broadcast Notice
            </button>
          </div>
        </form>
      </Modal>

      {/* VIEW MODAL */}
      {selectedAnnouncement && !showEditModal && (
        <Modal
          isOpen={Boolean(selectedAnnouncement)}
          onClose={() => setSelectedAnnouncement(null)}
          title={selectedAnnouncement.title}
          subtitle={`Category: ${selectedAnnouncement.category} • Target: ${selectedAnnouncement.audience}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <p className="text-slate-800 leading-relaxed font-medium text-sm">{selectedAnnouncement.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Published By</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedAnnouncement.publishedBy}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">Effective Duration</span>
                <p className="font-mono text-slate-900 mt-0.5">{selectedAnnouncement.publishDate} to {selectedAnnouncement.expiryDate}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
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
