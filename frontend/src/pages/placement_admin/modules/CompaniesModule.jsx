import React, { useState, useMemo } from 'react';
import { usePlacementAdmin } from '../../../context/PlacementAdminContext';
import { PlacementAdminHeader } from '../components/PlacementAdminHeader';
import {
  Building2,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Mail,
  Phone,
  Briefcase,
  Users,
  Award,
  Download,
  Eye,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export function CompaniesModule({ onNavigateTab }) {
  const { companies, addCompany, updateCompany, deleteCompany } = usePlacementAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    industry: 'IT & Software',
    contactPerson: '',
    email: '',
    phone: '',
    website: 'https://',
    status: 'Active Partner',
    drivesCount: 1,
    totalHires: 0,
    mouSigned: true,
  });

  const filteredCompanies = useMemo(() => {
    return (companies || []).filter((c) => {
      const matchSearch =
        searchQuery === '' ||
        (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.contactPerson && c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry;
      const matchStatus = selectedStatus === 'All' || c.status === selectedStatus;

      return matchSearch && matchIndustry && matchStatus;
    });
  }, [companies, searchQuery, selectedIndustry, selectedStatus]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      industry: 'IT & Software',
      contactPerson: '',
      email: '',
      phone: '',
      website: 'https://',
      status: 'Active Partner',
      drivesCount: 1,
      totalHires: 0,
      mouSigned: true,
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (comp) => {
    setIsEditing(true);
    setSelectedCompany(comp);
    setFormData({
      name: comp.name || '',
      industry: comp.industry || 'IT & Software',
      contactPerson: comp.contactPerson || '',
      email: comp.email || '',
      phone: comp.phone || '',
      website: comp.website || 'https://',
      status: comp.status || 'Active Partner',
      drivesCount: comp.drivesCount || 1,
      totalHires: comp.totalHires || 0,
      mouSigned: comp.mouSigned !== false,
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing && selectedCompany) {
      updateCompany(selectedCompany.id, formData);
    } else {
      addCompany(formData);
    }
    setShowAddModal(false);
    setSelectedCompany(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from corporate directory?`)) {
      deleteCompany(id);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Company Name', 'Industry', 'Contact HR', 'Email', 'Phone', 'Status', 'Drives', 'Total Hires'];
    const rows = filteredCompanies.map((c) => [
      `"${c.name}"`,
      `"${c.industry}"`,
      `"${c.contactPerson}"`,
      c.email,
      c.phone,
      c.status,
      c.drivesCount || 0,
      c.totalHires || 0,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `collegeconnect_corporate_partners_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active Partner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'MoU Signed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Past Partner':
        return 'bg-slate-50 text-slate-700 border-slate-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <PlacementAdminHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search corporate partners by name, HR contact, or email..."
        onNavigateTab={onNavigateTab}
      />

      {/* Page Title Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Corporate Network
            </span>
            <span className="text-xs text-slate-500 font-medium">Industry MoUs &amp; Recruiters</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Corporate Partners Directory</h1>
          <p className="text-xs text-slate-500">
            Maintain institutional MoUs, HR relationships, recruitment drive history, and campus hiring agreements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Directory
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Corporate Partner
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Companies</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{companies.length} Organizations</h3>
            <span className="text-[10.5px] text-emerald-600 font-bold mt-0.5 inline-block">Tier-1 &amp; Tier-2 Partners</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">MoU Signed Partners</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">38 MoUs</h3>
            <span className="text-[10.5px] text-purple-600 font-bold mt-0.5 inline-block">Active Institutional Ties</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Drives Conducted</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">18 Drives</h3>
            <span className="text-[10.5px] text-blue-600 font-bold mt-0.5 inline-block">Ongoing recruitment</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Highest CTC Offered</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">45.0 LPA</h3>
            <span className="text-[10.5px] text-emerald-600 font-bold mt-0.5 inline-block">Adobe India / Microsoft</span>
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

            {/* Industry Filter */}
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            >
              <option value="All">All Industry Domains</option>
              <option value="IT & Software">IT &amp; Software</option>
              <option value="Core Engineering">Core Engineering</option>
              <option value="Analytics & AI">Analytics &amp; AI</option>
              <option value="Fintech & Banking">Fintech &amp; Banking</option>
              <option value="Automotive">Automotive</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            >
              <option value="All">All Partnership Statuses</option>
              <option value="Active Partner">Active Partner</option>
              <option value="MoU Signed">MoU Signed</option>
              <option value="Past Partner">Past Partner</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{filteredCompanies.length}</span> companies
          </div>
        </div>
      </div>

      {/* Main Companies Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Company Name</th>
                <th className="py-3.5 px-4">Domain / Sector</th>
                <th className="py-3.5 px-4">HR Contact Person</th>
                <th className="py-3.5 px-4">Status &amp; MoU</th>
                <th className="py-3.5 px-4">Drives Hosted</th>
                <th className="py-3.5 px-4">Offers Rolled</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No recruiting companies found.
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-xs shrink-0 border border-purple-100">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{c.name}</p>
                          <a
                            href={c.website || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-purple-600 hover:text-purple-800 flex items-center gap-1 mt-0.5"
                          >
                            <span>Corporate Portal</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{c.industry}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-slate-800">{c.contactPerson}</p>
                        <p className="text-[11px] text-slate-500">{c.email}</p>
                        <p className="text-[10px] text-slate-400">{c.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{c.drivesCount || 1} Drive(s)</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-600">{c.totalHires || 0} Hires</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedCompany(c);
                            setShowDetailsModal(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                          title="Edit Partner"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete"
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

      {/* MODAL 1: Details & MoU Details Modal */}
      {showDetailsModal && selectedCompany && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center">
                  {selectedCompany.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedCompany.name}</h3>
                  <p className="text-xs text-purple-700 font-semibold">{selectedCompany.industry}</p>
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
                <span className="text-slate-400 block text-[10px] uppercase font-bold">HR Lead</span>
                <span className="font-bold text-slate-800">{selectedCompany.contactPerson}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Partnership Status</span>
                <span className="font-bold text-purple-700">{selectedCompany.status}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Official Email</span>
                <span className="font-semibold text-slate-800 truncate block">{selectedCompany.email}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Number</span>
                <span className="font-semibold text-slate-800">{selectedCompany.phone}</span>
              </div>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-purple-900">Institutional Memorandum of Understanding (MoU)</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Valid through academic year 2026-2027. Covers annual on-campus pool placements, faculty enablement, and internship fast-tracks.
              </p>
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

      {/* MODAL 2: Create / Edit Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Corporate Partner' : 'Add Corporate Partner'}
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
                <label className="block text-slate-700 font-bold mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cisco Systems India"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Industry Domain *</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  >
                    <option value="IT & Software">IT &amp; Software</option>
                    <option value="Core Engineering">Core Engineering</option>
                    <option value="Analytics & AI">Analytics &amp; AI</option>
                    <option value="Fintech & Banking">Fintech &amp; Banking</option>
                    <option value="Automotive">Automotive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Partnership Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  >
                    <option value="Active Partner">Active Partner</option>
                    <option value="MoU Signed">MoU Signed</option>
                    <option value="Past Partner">Past Partner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">HR Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ms. Priya Sharma (University Relations)"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">HR Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. campus.recruitment@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">HR Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98220 99887"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
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
                  {isEditing ? 'Save Changes' : 'Add Corporate Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
