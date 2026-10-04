import React, { useState, useMemo } from 'react';
import { usePlacementAdmin } from '../../../context/PlacementAdminContext';
import { PlacementAdminHeader } from '../components/PlacementAdminHeader';
import { normalizeToArray, safeArrayIncludes } from '../../../utils/normalizeData';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  X,
  Sparkles,
  MapPin,
  FileCheck,
} from 'lucide-react';

export function PlacementDrivesModule({ onNavigateTab }) {
  const { drives, addDrive, updateDrive, deleteDrive } = usePlacementAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    package: '',
    date: '',
    deadline: '',
    status: 'Upcoming',
    location: 'Campus Auditorium & Online Test Lab',
    cgpaCutoff: '7.0',
    departments: ['Computer', 'IT', 'ENTC'],
    registered: 0,
    shortlisted: 0,
    selected: 0,
  });

  const filteredDrives = useMemo(() => {
    return (drives || []).filter((d) => {
      const matchesSearch =
        searchQuery === '' ||
        (d.company && d.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.role && d.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.location && d.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTab = activeTab === 'All' || d.status === activeTab;
      const matchesDept =
        selectedDept === 'All' ||
        safeArrayIncludes(d.departments, selectedDept);

      return matchesSearch && matchesTab && matchesDept;
    });
  }, [drives, searchQuery, activeTab, selectedDept]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      company: '',
      role: '',
      package: '',
      date: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'Upcoming',
      location: 'Main Auditorium / Online Portal',
      cgpaCutoff: '7.0',
      departments: ['Computer', 'IT', 'ENTC'],
      registered: 0,
      shortlisted: 0,
      selected: 0,
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (drive) => {
    setIsEditing(true);
    setSelectedDrive(drive);
    setFormData({
      company: drive.company || '',
      role: drive.role || '',
      package: drive.package || '',
      date: drive.date || '',
      deadline: drive.deadline || '',
      status: drive.status || 'Upcoming',
      location: drive.location || 'Campus Auditorium',
      cgpaCutoff: drive.cgpaCutoff || '7.0',
      departments: normalizeToArray(drive.departments, ['Computer', 'IT']),
      registered: drive.registered || 0,
      shortlisted: drive.shortlisted || 0,
      selected: drive.selected || 0,
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      departments: normalizeToArray(formData.departments, ['Computer', 'IT']),
    };
    if (isEditing && selectedDrive) {
      updateDrive(selectedDrive.id, submissionData);
    } else {
      addDrive(submissionData);
    }
    setShowAddModal(false);
    setSelectedDrive(null);
  };

  const handleDelete = (id, comp) => {
    if (window.confirm(`Are you sure you want to remove the placement drive for ${comp}?`)) {
      deleteDrive(id);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse';
      case 'Upcoming':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
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
        placeholder="Search placement drives by company, designation, or venue..."
        onNavigateTab={onNavigateTab}
      />

      {/* Page Title Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> Campus Recruitment Drives
            </span>
            <span className="text-xs text-slate-500 font-medium">Academic Year 2025 – 2026</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Placement Drives Management</h1>
          <p className="text-xs text-slate-500">
            Schedule on-campus and virtual recruitment drives, manage eligibility cutoffs, and monitor stage selections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" /> Create Placement Drive
          </button>
        </div>
      </div>

      {/* Navigation Tabs & Status Counts */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          {['All', 'Upcoming', 'Ongoing', 'Completed'].map((tab) => {
            const count =
              tab === 'All' ? drives.length : drives.filter((d) => d.status === tab).length;
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
                <span>{tab === 'All' ? 'All Drives' : tab}</span>
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

        {/* Department Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Branch:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
          >
            <option value="All">All Branches</option>
            <option value="Computer">Computer</option>
            <option value="IT">IT</option>
            <option value="ENTC">ENTC</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
          </select>
        </div>
      </div>

      {/* Drives Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDrives.map((drive) => (
          <div
            key={drive.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
          >
            {/* Drive Header */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center text-sm border border-purple-100">
                    {drive.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{drive.company}</h3>
                    <p className="text-xs text-purple-700 font-semibold">{drive.role}</p>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                    drive.status
                  )}`}
                >
                  {drive.status}
                </span>
              </div>

              {/* CTC & CGPA Badges */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Package (CTC)</span>
                  <span className="font-bold text-emerald-600 text-xs">{drive.package}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Cutoff Criteria</span>
                  <span className="font-bold text-slate-800 text-xs">CGPA &gt;= {drive.cgpaCutoff || '7.0'}</span>
                </div>
              </div>

              {/* Eligible Branches */}
              <div className="mt-3">
                <span className="text-[10.5px] text-slate-400 font-bold block mb-1">Eligible Branches</span>
                <div className="flex flex-wrap gap-1">
                  {normalizeToArray(drive.departments, ['Computer', 'IT']).map((d, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[10.5px] font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Date & Location */}
              <div className="mt-3 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Drive Date: <b className="text-slate-700">{drive.date}</b></span>
                </div>
                {drive.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{drive.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Progress Metrics & Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-3 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Registered</span>
                  <span className="font-bold text-slate-800">{drive.registered || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Shortlisted</span>
                  <span className="font-bold text-blue-600">{drive.shortlisted || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Selected</span>
                  <span className="font-bold text-emerald-600">{drive.selected || 0}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => {
                    setSelectedDrive(drive);
                    setShowDetailsModal(true);
                  }}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> View Rounds
                </button>
                <button
                  onClick={() => handleOpenEdit(drive)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                  title="Edit Drive"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(drive.id, drive.company)}
                  className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Drive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: Drive Details & Rounds */}
      {showDetailsModal && selectedDrive && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                  {selectedDrive.company.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedDrive.company}</h3>
                  <p className="text-xs text-purple-700 font-semibold">{selectedDrive.role}</p>
                </div>
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
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Package Offer</span>
                <span className="font-bold text-emerald-600 text-sm">{selectedDrive.package}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Minimum CGPA</span>
                <span className="font-bold text-slate-800 text-sm">{selectedDrive.cgpaCutoff || '7.0'} / 10</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Recruitment Pipeline Stages</h4>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl border border-purple-100 bg-purple-50/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span className="font-bold text-slate-800">Online Aptitude &amp; Coding Assessment</span>
                  </div>
                  <span className="text-[10.5px] font-bold text-purple-700">Completed (48 Attended)</span>
                </div>

                <div className="p-2.5 rounded-xl border border-blue-100 bg-blue-50/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span className="font-bold text-slate-800">Technical Interview Round 1 &amp; 2</span>
                  </div>
                  <span className="text-[10.5px] font-bold text-blue-700">In Progress ({selectedDrive.shortlisted || 12} Shortlisted)</span>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-400 text-white font-bold flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span className="font-bold text-slate-800">HR / Final Leadership Discussion</span>
                  </div>
                  <span className="text-[10.5px] text-slate-500 font-medium">Scheduled for Tomorrow</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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

      {/* MODAL 2: Create / Edit Placement Drive Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Placement Drive' : 'Create New Placement Drive'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google / Microsoft / TCS"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Development Engineer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Compensation (CTC) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10.5 LPA"
                    value={formData.package}
                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Minimum CGPA Cutoff</label>
                  <input
                    type="text"
                    placeholder="e.g. 7.5"
                    value={formData.cgpaCutoff}
                    onChange={(e) => setFormData({ ...formData, cgpaCutoff: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Drive Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20 font-medium"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Venue / Platform</label>
                <input
                  type="text"
                  placeholder="e.g. NMIET Seminar Hall &amp; Microsoft Teams"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                  {isEditing ? 'Save Changes' : 'Create Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
