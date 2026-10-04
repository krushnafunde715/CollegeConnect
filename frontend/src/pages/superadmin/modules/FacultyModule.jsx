import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Power,
  Users,
  Building2,
  BookOpen,
  Mail,
  Phone,
  Calendar,
  Layers,
  Award,
  ShieldAlert
} from 'lucide-react';

const INITIAL_FACULTY = [
  {
    id: 1,
    name: 'Dr. A. R. Sharma',
    empId: 'FAC-COMP-001',
    email: 'a.sharma@collegeconnect.edu',
    phone: '+91 98230 45678',
    department: 'Computer Engineering',
    deptCode: 'COMP',
    designation: 'HOD & Professor',
    qualification: 'Ph.D. in Computer Science (IIT Bombay)',
    experience: '18 Years',
    assignedClasses: ['SE A', 'BE A'],
    subjects: ['Data Structures & Algorithms', 'Distributed Systems'],
    status: 'active',
    joiningDate: '2012-06-15',
    accountActivity: [
      { event: 'Logged into Academic Portal', date: 'Oct 14, 2026 09:15 AM' },
      { event: 'Submitted Internal Assessment Plan', date: 'Oct 05, 2026 03:20 PM' },
    ],
  },
  {
    id: 2,
    name: 'Prof. S. N. Joshi',
    empId: 'FAC-COMP-002',
    email: 's.joshi@collegeconnect.edu',
    phone: '+91 94220 12345',
    department: 'Computer Engineering',
    deptCode: 'COMP',
    designation: 'Associate Professor & Dept Admin',
    qualification: 'M.Tech in Software Systems',
    experience: '12 Years',
    assignedClasses: ['SE B'],
    subjects: ['Database Management Systems', 'Cloud Computing'],
    status: 'active',
    joiningDate: '2016-07-01',
    accountActivity: [
      { event: 'Assigned Department Administrator', date: 'Oct 01, 2026 10:15 AM' },
    ],
  },
  {
    id: 3,
    name: 'Prof. Anjali Deshpande',
    empId: 'FAC-COMP-003',
    email: 'a.deshpande@collegeconnect.edu',
    phone: '+91 97654 88776',
    department: 'Computer Engineering',
    deptCode: 'COMP',
    designation: 'Assistant Professor & Class Teacher',
    qualification: 'M.E. in Computer Engineering',
    experience: '7 Years',
    assignedClasses: ['SE A'],
    subjects: ['Discrete Mathematics', 'Object Oriented Programming'],
    status: 'active',
    joiningDate: '2019-01-10',
    accountActivity: [
      { event: 'Marked Daily Class Attendance', date: 'Oct 14, 2026 11:30 AM' },
    ],
  },
  {
    id: 4,
    name: 'Dr. M. V. Kulkarni',
    empId: 'FAC-IT-001',
    email: 'm.kulkarni@collegeconnect.edu',
    phone: '+91 98811 22334',
    department: 'Information Technology',
    deptCode: 'IT',
    designation: 'HOD & Professor',
    qualification: 'Ph.D. in Information Security',
    experience: '16 Years',
    assignedClasses: ['TE A'],
    subjects: ['Information & Cyber Security', 'Cryptography'],
    status: 'active',
    joiningDate: '2014-08-20',
    accountActivity: [
      { event: 'Approved Syllabus Revision', date: 'Sep 25, 2026 04:00 PM' },
    ],
  },
  {
    id: 5,
    name: 'Prof. R. M. Shinde',
    empId: 'FAC-ENTC-002',
    email: 'r.shinde@collegeconnect.edu',
    phone: '+91 99223 34455',
    department: 'Electronics & Telecommunication',
    deptCode: 'ENTC',
    designation: 'Associate Professor',
    qualification: 'M.Tech in VLSI Systems',
    experience: '11 Years',
    assignedClasses: ['BE A'],
    subjects: ['VLSI Design', 'Digital Signal Processing'],
    status: 'active',
    joiningDate: '2017-06-12',
    accountActivity: [
      { event: 'Conducted Practical Examination', date: 'Oct 02, 2026 02:00 PM' },
    ],
  },
  {
    id: 6,
    name: 'Prof. H. T. Gaikwad',
    empId: 'FAC-MECH-001',
    email: 'h.gaikwad@collegeconnect.edu',
    phone: '+91 98900 66778',
    department: 'Mechanical Engineering',
    deptCode: 'MECH',
    designation: 'Assistant Professor',
    qualification: 'M.Tech in CAD/CAM Robotics',
    experience: '8 Years',
    assignedClasses: ['BE A'],
    subjects: ['Robotics & Automation', 'Finite Element Analysis'],
    status: 'active',
    joiningDate: '2018-09-01',
    accountActivity: [
      { event: 'Workshop Lab Safety Review', date: 'Sep 28, 2026 10:00 AM' },
    ],
  },
];

export function FacultyModule() {
  const [facultyList, setFacultyList] = useState(INITIAL_FACULTY);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [designationFilter, setDesignationFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & selected state
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [profileTab, setProfileTab] = useState('personal'); // 'personal', 'department', 'teaching', 'classes', 'activity'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Forms
  const [formData, setFormData] = useState({
    name: '',
    empId: '',
    email: '',
    phone: '',
    department: 'Computer Engineering',
    designation: 'Assistant Professor',
    qualification: '',
    experience: '5 Years',
    status: 'active',
  });

  const { success, error } = useToast();

  const filteredFaculty = facultyList.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || f.department === deptFilter;
    const matchesDesig = designationFilter === 'ALL' || f.designation.includes(designationFilter);
    const matchesStatus = statusFilter === 'ALL' || f.status === statusFilter.toLowerCase();
    return matchesSearch && matchesDept && matchesDesig && matchesStatus;
  });

  const handleCreateFaculty = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.empId.trim() || !formData.email.trim()) {
      error('Faculty Name, Employee ID, and Institutional Email are required.');
      return;
    }

    if (facultyList.some((f) => f.empId.toUpperCase() === formData.empId.trim().toUpperCase())) {
      error(`Faculty member with Employee ID "${formData.empId.toUpperCase()}" already exists.`);
      return;
    }

    const deptCodeMap = {
      'Computer Engineering': 'COMP',
      'Information Technology': 'IT',
      'Electronics & Telecommunication': 'ENTC',
      'Mechanical Engineering': 'MECH',
      'Civil Engineering': 'CIVIL',
    };

    const newFaculty = {
      id: Date.now(),
      name: formData.name.trim(),
      empId: formData.empId.trim().toUpperCase(),
      email: formData.email.trim(),
      phone: formData.phone || '+91 90000 00000',
      department: formData.department,
      deptCode: deptCodeMap[formData.department] || 'GEN',
      designation: formData.designation,
      qualification: formData.qualification || 'M.Tech in Engineering',
      experience: formData.experience || '3 Years',
      assignedClasses: [],
      subjects: [],
      status: formData.status,
      joiningDate: new Date().toISOString().split('T')[0],
      accountActivity: [
        { event: 'Faculty account created in CollegeConnect directory', date: new Date().toISOString().split('T')[0] },
      ],
    };

    setFacultyList([newFaculty, ...facultyList]);
    setShowAddModal(false);
    setFormData({
      name: '',
      empId: '',
      email: '',
      phone: '',
      department: 'Computer Engineering',
      designation: 'Assistant Professor',
      qualification: '',
      experience: '5 Years',
      status: 'active',
    });
    success(`Faculty member "${newFaculty.name}" onboarded successfully.`);
  };

  const handleUpdateFaculty = (e) => {
    e.preventDefault();
    setFacultyList((prev) =>
      prev.map((f) => (f.id === selectedFaculty.id ? { ...f, ...formData } : f))
    );
    setShowEditModal(false);
    success(`Faculty profile updated for ${formData.name}.`);
  };

  const toggleStatus = (fac) => {
    const nextStatus = fac.status === 'active' ? 'disabled' : 'active';
    setFacultyList((prev) =>
      prev.map((f) => (f.id === fac.id ? { ...f, status: nextStatus } : f))
    );
    success(`Faculty "${fac.name}" is now ${nextStatus}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Faculty Directory & Assignments</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Institutional directory of professors, lecturers, and academic teaching appointments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setFormData({
                name: '',
                empId: '',
                email: '',
                phone: '',
                department: 'Computer Engineering',
                designation: 'Assistant Professor',
                qualification: '',
                experience: '5 Years',
                status: 'active',
              });
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Faculty
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
            placeholder="Search faculty name, ID, or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto text-xs font-medium text-slate-600">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Telecommunication">E&TC</option>
            <option value="Mechanical Engineering">Mechanical</option>
          </select>

          <select
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none"
          >
            <option value="ALL">All Designations</option>
            <option value="HOD">HODs</option>
            <option value="Professor">Professors</option>
            <option value="Associate Professor">Associate Professors</option>
            <option value="Assistant Professor">Assistant Professors</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Faculty Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Faculty Member</th>
                <th className="py-3.5 px-4">Employee ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Designation</th>
                <th className="py-3.5 px-4">Assigned Classes</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredFaculty.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <UserCheck className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No faculty records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredFaculty.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {fac.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{fac.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{fac.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {fac.empId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{fac.department}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{fac.designation}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {fac.assignedClasses.length === 0 ? (
                          <span className="text-slate-400 text-[11px]">None assigned</span>
                        ) : (
                          fac.assignedClasses.map((cls, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                              {cls}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={fac.status}>{fac.status}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedFaculty(fac);
                            setProfileTab('personal');
                          }}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFaculty(fac);
                            setFormData({
                              name: fac.name,
                              empId: fac.empId,
                              email: fac.email,
                              phone: fac.phone,
                              department: fac.department,
                              designation: fac.designation,
                              qualification: fac.qualification,
                              experience: fac.experience,
                              status: fac.status,
                            });
                            setShowEditModal(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit Faculty"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleStatus(fac)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            fac.status === 'active'
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={fac.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
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
      {/* 1. FACULTY PROFILE MODAL (5 TABS)                                         */}
      {/* ========================================================================= */}
      {selectedFaculty && !showEditModal && (
        <Modal
          isOpen={Boolean(selectedFaculty)}
          onClose={() => setSelectedFaculty(null)}
          title={selectedFaculty.name}
          subtitle={`Employee ID: ${selectedFaculty.empId} • ${selectedFaculty.designation}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 overflow-x-auto pb-px text-xs font-semibold">
              {[
                { id: 'personal', label: 'Personal Information' },
                { id: 'department', label: 'Department & Role' },
                { id: 'teaching', label: 'Teaching Assignments' },
                { id: 'classes', label: 'Assigned Classes' },
                { id: 'activity', label: 'Account Activity' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setProfileTab(tab.id)}
                  className={`px-3.5 py-2.5 border-b-2 font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    profileTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Personal Information */}
            {profileTab === 'personal' && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1 font-mono">{selectedFaculty.email}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Contact Phone
                    </span>
                    <p className="text-xs font-bold text-slate-900 mt-1 font-mono">{selectedFaculty.phone}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Qualification</span>
                    <p className="text-xs font-bold text-slate-900 mt-1 truncate">{selectedFaculty.qualification}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Teaching Experience</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{selectedFaculty.experience}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Joining Date</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{selectedFaculty.joiningDate}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">Account Status</span>
                    <div className="mt-1">
                      <Badge variant={selectedFaculty.status}>{selectedFaculty.status}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Department */}
            {profileTab === 'department' && (
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Primary Department Assignment</span>
                  <p className="text-sm font-bold text-slate-900">{selectedFaculty.department}</p>
                  <p className="text-slate-500 mt-1 text-[11px]">
                    Designation: <strong>{selectedFaculty.designation}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Teaching */}
            {profileTab === 'teaching' && (
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">Subjects Taught in Current Semester:</span>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {selectedFaculty.subjects.map((sub, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <p className="font-bold text-slate-900">{sub}</p>
                      <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                        4 Hours / Week
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Classes */}
            {profileTab === 'classes' && (
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">Assigned Academic Classes:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedFaculty.assignedClasses.map((cls, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
                      <span className="font-bold text-slate-900">{cls}</span>
                      <Badge variant="active">Active Assignment</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Activity */}
            {profileTab === 'activity' && (
              <div className="space-y-2 text-xs">
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden">
                  {selectedFaculty.accountActivity.map((act, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <p className="font-bold text-slate-800">{act.event}</p>
                      <span className="text-slate-400 font-mono text-[10px]">{act.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedFaculty(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 2. ADD FACULTY MODAL                                                      */}
      {/* ========================================================================= */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Faculty Member"
        subtitle="Register a new academic staff account."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateFaculty} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Legal Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Prof. Rajesh V. Patil"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Employee ID *</label>
              <input
                type="text"
                required
                value={formData.empId}
                onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                placeholder="FAC-COMP-009"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium font-mono uppercase text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Designation</label>
              <select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="HOD & Professor">HOD & Professor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Institutional Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="r.patil@collegeconnect.edu"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98000 22334"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Telecommunication">E&TC</option>
                <option value="Mechanical Engineering">Mechanical</option>
                <option value="Civil Engineering">Civil</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Qualification</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="M.Tech (Computer Science)"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
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
              Save Faculty
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 3. EDIT FACULTY MODAL                                                     */}
      {/* ========================================================================= */}
      {selectedFaculty && showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Edit Faculty: ${selectedFaculty.name}`}
          subtitle="Modify faculty attributes and status."
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleUpdateFaculty} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Legal Name *</label>
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
                <label className="font-bold text-slate-700 block mb-1">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
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
                  <option value="disabled">Disabled / On Leave</option>
                </select>
              </div>
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
                Update Faculty
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
