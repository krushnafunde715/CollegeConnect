import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  UserPlus,
  Power,
  CheckCircle2,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  ShieldCheck,
  ArrowUpRight,
  Info,
  Clock
} from 'lucide-react';

const INITIAL_DEPARTMENTS = [
  {
    id: 1,
    name: 'Computer Engineering',
    code: 'COMP',
    type: 'Academic',
    head: 'Dr. A. R. Sharma',
    admin: 'Prof. S. N. Joshi',
    adminEmail: 'admin.comp@collegeconnect.edu',
    studentsCount: 940,
    facultyCount: 32,
    classesCount: 8,
    status: 'active',
    description: 'Undergraduate and postgraduate programs in computer science, software engineering, AI, and systems architecture.',
    establishedYear: 2004,
    intake: 180,
  },
  {
    id: 2,
    name: 'Information Technology',
    code: 'IT',
    type: 'Academic',
    head: 'Dr. M. V. Kulkarni',
    admin: 'Prof. P. K. Deshmukh',
    adminEmail: 'admin.it@collegeconnect.edu',
    studentsCount: 780,
    facultyCount: 26,
    classesCount: 6,
    status: 'active',
    description: 'Focus on enterprise computing, information security, data science, and cloud computing paradigms.',
    establishedYear: 2008,
    intake: 120,
  },
  {
    id: 3,
    name: 'Electronics & Telecommunication',
    code: 'ENTC',
    type: 'Academic',
    head: 'Dr. K. S. Patil',
    admin: 'Prof. R. M. Shinde',
    adminEmail: 'admin.entc@collegeconnect.edu',
    studentsCount: 710,
    facultyCount: 24,
    classesCount: 6,
    status: 'active',
    description: 'VLSI design, embedded systems, wireless communications, IoT, and signal processing research.',
    establishedYear: 2006,
    intake: 120,
  },
  {
    id: 4,
    name: 'Mechanical Engineering',
    code: 'MECH',
    type: 'Academic',
    head: 'Dr. V. B. More',
    admin: 'Prof. H. T. Gaikwad',
    adminEmail: 'admin.mech@collegeconnect.edu',
    studentsCount: 680,
    facultyCount: 22,
    classesCount: 6,
    status: 'active',
    description: 'Thermal systems, robotics, CAD/CAM automation, manufacturing, and structural design engineering.',
    establishedYear: 2005,
    intake: 120,
  },
  {
    id: 5,
    name: 'Civil Engineering',
    code: 'CIVIL',
    type: 'Academic',
    head: 'Dr. S. P. Bhosale',
    admin: 'Prof. N. D. Pawar',
    adminEmail: 'admin.civil@collegeconnect.edu',
    studentsCount: 520,
    facultyCount: 18,
    classesCount: 4,
    status: 'active',
    description: 'Structural engineering, environmental sustainability, geotech, and smart urban infrastructure planning.',
    establishedYear: 2010,
    intake: 60,
  },
  {
    id: 6,
    name: 'First Year Engineering (Applied Sciences)',
    code: 'FE_AS',
    type: 'Academic',
    head: 'Dr. R. C. Mehta',
    admin: 'Prof. T. G. Kadam',
    adminEmail: 'admin.fe@collegeconnect.edu',
    studentsCount: 212,
    facultyCount: 14,
    classesCount: 6,
    status: 'active',
    description: 'Foundational mathematics, applied physics, engineering chemistry, basic mechanics, and professional communication.',
    establishedYear: 2004,
    intake: 600,
  },
];

export function DepartmentsModule({ onNavigate }) {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  
  // Selected department for details modal
  const [selectedDept, setSelectedDept] = useState(null);
  const [detailTab, setDetailTab] = useState('overview'); // 'overview', 'classes', 'faculty', 'students', 'admin', 'history'

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'Academic',
    head: '',
    description: '',
    status: 'active',
    intake: 120,
  });

  const [assignData, setAssignData] = useState({
    adminName: '',
    adminEmail: '',
  });

  const { success, error } = useToast();

  // Filter logic
  const filteredDepts = departments.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.head.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.admin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'ALL' || d.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateDepartment = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim() || !formData.head.trim()) {
      error('Please complete all required fields (Name, Code, Department Head).');
      return;
    }

    if (departments.some((d) => d.code.toUpperCase() === formData.code.toUpperCase())) {
      error(`Department code "${formData.code.toUpperCase()}" already exists.`);
      return;
    }

    const newDept = {
      id: Date.now(),
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      type: formData.type,
      head: formData.head.trim(),
      admin: 'Unassigned',
      adminEmail: `admin.${formData.code.toLowerCase()}@collegeconnect.edu`,
      studentsCount: 0,
      facultyCount: 0,
      classesCount: 0,
      status: formData.status,
      description: formData.description || 'Department configured in CollegeConnect institutional directory.',
      establishedYear: new Date().getFullYear(),
      intake: Number(formData.intake) || 60,
    };

    setDepartments([newDept, ...departments]);
    setShowAddModal(false);
    setFormData({ name: '', code: '', type: 'Academic', head: '', description: '', status: 'active', intake: 120 });
    success(`Department "${newDept.name}" created successfully.`);
  };

  const handleUpdateDepartment = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.head.trim()) {
      error('Department name and head are required.');
      return;
    }

    setDepartments((prev) =>
      prev.map((d) => (d.id === selectedDept.id ? { ...d, ...formData } : d))
    );
    setShowEditModal(false);
    success(`Department "${formData.name}" updated successfully.`);
  };

  const handleAssignAdmin = (e) => {
    e.preventDefault();
    if (!assignData.adminName.trim() || !assignData.adminEmail.trim()) {
      error('Admin name and official institutional email are required.');
      return;
    }

    setDepartments((prev) =>
      prev.map((d) =>
        d.id === selectedDept.id
          ? { ...d, admin: assignData.adminName.trim(), adminEmail: assignData.adminEmail.trim() }
          : d
      )
    );
    setShowAssignModal(false);
    success(`Department Admin assigned to ${selectedDept.name}.`);
  };

  const toggleStatus = (dept) => {
    const nextStatus = dept.status === 'active' ? 'disabled' : 'active';
    setDepartments((prev) =>
      prev.map((d) => (d.id === dept.id ? { ...d, status: nextStatus } : d))
    );
    success(`Department "${dept.name}" is now ${nextStatus}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Departments</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage institutional departments, academic structures, and department administrator access boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setFormData({ name: '', code: '', type: 'Academic', head: '', description: '', status: 'active', intake: 120 });
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Department
          </button>
        </div>
      </div>

      {/* DPDP Access Boundary Notice */}
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-indigo-950">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-indigo-900">DPDP Department Isolation Principle</p>
          <p className="text-indigo-800 leading-relaxed">
            Department admins are strictly restricted to their designated department's records. Super Admin configures departments and assigns administrative authorities without direct exposure to sensitive student personal and health data.
          </p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, code, head, or admin..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="DISABLED">Inactive / Disabled</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Types</option>
              <option value="Academic">Academic</option>
              <option value="Administrative">Administrative</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Department Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Department Head</th>
                <th className="py-3.5 px-4">Department Admin</th>
                <th className="py-3.5 px-4 text-center">Students</th>
                <th className="py-3.5 px-4 text-center">Faculty</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredDepts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Building2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No departments match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredDepts.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {dept.code.slice(0, 2)}
                        </div>
                        <div>
                          <p>{dept.name}</p>
                          <span className="text-[10px] text-slate-400 font-normal">{dept.type} • Est. {dept.establishedYear}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-bold border border-slate-200">
                        {dept.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{dept.head}</td>
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-slate-800">{dept.admin}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">{dept.adminEmail}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{dept.studentsCount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">{dept.facultyCount}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={dept.status}>{dept.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedDept(dept);
                            setDetailTab('overview');
                          }}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDept(dept);
                            setFormData({
                              name: dept.name,
                              code: dept.code,
                              type: dept.type,
                              head: dept.head,
                              description: dept.description,
                              status: dept.status,
                              intake: dept.intake,
                            });
                            setShowEditModal(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Department"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDept(dept);
                            setAssignData({
                              adminName: dept.admin === 'Unassigned' ? '' : dept.admin,
                              adminEmail: dept.adminEmail || '',
                            });
                            setShowAssignModal(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Assign Department Admin"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(dept)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            dept.status === 'active'
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={dept.status === 'active' ? 'Deactivate Department' : 'Activate Department'}
                        >
                          <Power className="w-4 h-4" />
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

      {/* ========================================================================= */}
      {/* 1. VIEW DEPARTMENT DETAILS MODAL (6 TABS)                                 */}
      {/* ========================================================================= */}
      {selectedDept && !showEditModal && !showAssignModal && (
        <Modal
          isOpen={Boolean(selectedDept)}
          onClose={() => setSelectedDept(null)}
          title={selectedDept.name}
          subtitle={`Department Code: ${selectedDept.code} • Established ${selectedDept.establishedYear}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto pb-px text-xs font-semibold">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'classes', label: `Classes (${selectedDept.classesCount})` },
                { id: 'faculty', label: `Faculty (${selectedDept.facultyCount})` },
                { id: 'students', label: `Students (${selectedDept.studentsCount})` },
                { id: 'admin', label: 'Department Admin' },
                { id: 'history', label: 'Activity History' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={`px-3.5 py-2.5 border-b-2 font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    detailTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Overview */}
            {detailTab === 'overview' && (
              <div className="space-y-4 text-xs">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">About Department</span>
                  <p className="text-slate-700 mt-1 leading-relaxed font-medium">{selectedDept.description}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Annual Intake</span>
                    <p className="text-base font-bold text-slate-900 mt-0.5">{selectedDept.intake} Seats</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Department Head</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">{selectedDept.head}</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Total Classes</span>
                    <p className="text-base font-bold text-slate-900 mt-0.5">{selectedDept.classesCount}</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Status</span>
                    <div className="mt-1">
                      <Badge variant={selectedDept.status}>{selectedDept.status}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Classes */}
            {detailTab === 'classes' && (
              <div className="space-y-2 text-xs">
                <p className="text-slate-500 font-medium">Configured Class Cohorts for AY 2026-27:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {['SE A', 'SE B', 'TE A', 'TE B', 'BE A', 'BE B'].map((cls, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{selectedDept.code} - {cls}</p>
                        <span className="text-[10px] text-slate-500">68 Students Enrolled</span>
                      </div>
                      <Badge variant="active">Active</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Faculty */}
            {detailTab === 'faculty' && (
              <div className="space-y-2 text-xs">
                <p className="text-slate-500 font-medium">Department Faculty Members ({selectedDept.facultyCount} Registered):</p>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {[
                    { name: selectedDept.head, role: 'Head of Department & Professor', exp: '18 Years Exp' },
                    { name: selectedDept.admin, role: 'Associate Professor & Admin', exp: '12 Years Exp' },
                    { name: 'Dr. S. K. Narang', role: 'Professor', exp: '15 Years Exp' },
                    { name: 'Prof. Anjali Deshpande', role: 'Assistant Professor', exp: '7 Years Exp' },
                  ].map((fac, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{fac.name}</p>
                        <p className="text-[11px] text-slate-500">{fac.role}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">{fac.exp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Students */}
            {detailTab === 'students' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-indigo-900 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase font-bold text-indigo-600">Total Enrolled Students</span>
                    <p className="text-xl font-bold text-indigo-950 mt-0.5">{selectedDept.studentsCount.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedDept(null);
                      if (onNavigate) onNavigate('students');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                  >
                    Open Student Directory
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] font-bold">SE Cohort</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">310</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] font-bold">TE Cohort</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">315</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] font-bold">BE Cohort</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">315</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Department Admin */}
            {detailTab === 'admin' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-900">{selectedDept.admin}</p>
                      <p className="text-slate-500 font-mono text-[11px]">{selectedDept.adminEmail}</p>
                    </div>
                    <Badge variant="academic_admin">Academic Dept Admin</Badge>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed pt-2 border-t border-slate-100">
                    Authorized to manage course curriculum, class assignments, faculty teaching rosters, and internal marks for <strong>{selectedDept.name}</strong>.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 6: History */}
            {detailTab === 'history' && (
              <div className="space-y-2 text-xs">
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden">
                  {[
                    { action: 'Department Admin assigned: ' + selectedDept.admin, by: 'Dr. S. Kulkarni', time: 'Oct 01, 2026 10:15 AM' },
                    { action: 'Academic Year 2026-27 cohort rollover', by: 'System Automation', time: 'Sep 15, 2026 00:00 AM' },
                    { action: 'Syllabus revised for Semester V subjects', by: selectedDept.admin, time: 'Aug 20, 2026 03:40 PM' },
                  ].map((h, idx) => (
                    <div key={idx} className="p-3 flex items-start justify-between">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800">{h.action}</p>
                        <p className="text-[10px] text-slate-400">Initiated by {h.by}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedDept(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 2. ADD DEPARTMENT MODAL                                                   */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Department"
        subtitle="Configure a new institutional academic or administrative unit."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateDepartment} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Department Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Artificial Intelligence & Data Science"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Department Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. AIDS"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium font-mono uppercase text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Department Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="Academic">Academic</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Department Head *</label>
              <input
                type="text"
                required
                value={formData.head}
                onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                placeholder="e.g. Dr. P. B. Mane"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Annual Intake Capacity</label>
              <input
                type="number"
                value={formData.intake}
                onChange={(e) => setFormData({ ...formData, intake: e.target.value })}
                placeholder="120"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Description / Specialization</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of department scope and curriculum focus..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
            >
              Save Department
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 3. EDIT DEPARTMENT MODAL                                                  */}
      {/* ========================================================================= */}
      {selectedDept && showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Edit Department: ${selectedDept.code}`}
          subtitle="Modify department details and parameters."
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleUpdateDepartment} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Department Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Department Head *</label>
                <input
                  type="text"
                  required
                  value={formData.head}
                  onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Inactive / Disabled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
              >
                Update Department
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 4. ASSIGN DEPARTMENT ADMIN MODAL                                          */}
      {/* ========================================================================= */}
      {selectedDept && showAssignModal && (
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title="Assign Department Administrator"
          subtitle={`Assign an authorized administrator for ${selectedDept.name}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAssignAdmin} className="space-y-3.5 text-xs">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-950 space-y-1">
              <p className="font-bold">Role: Academic Department Admin</p>
              <p className="text-[11px] text-purple-800">
                Grants scoped access to classes, syllabus, faculty assignments, and internal grades solely for this department.
              </p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Administrator Full Name *</label>
              <input
                type="text"
                required
                value={assignData.adminName}
                onChange={(e) => setAssignData({ ...assignData, adminName: e.target.value })}
                placeholder="e.g. Prof. S. N. Joshi"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Institutional Email *</label>
              <input
                type="email"
                required
                value={assignData.adminEmail}
                onChange={(e) => setAssignData({ ...assignData, adminEmail: e.target.value })}
                placeholder="admin.comp@collegeconnect.edu"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl font-semibold text-xs shadow-xs transition-colors"
              >
                Confirm Assignment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
