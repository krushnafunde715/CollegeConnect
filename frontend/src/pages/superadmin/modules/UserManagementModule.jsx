import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  KeyRound,
  Power,
  ShieldCheck,
  Building2,
  UserCheck,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const INITIAL_USERS = [
  { id: 1, name: 'Kartik Bhegade', userId: 'USR-SA-001', email: 'kartik.bhegade@collegeconnect.edu', role: 'super_admin', roleDisplay: 'Super College Admin', department: 'Institutional Governance', status: 'active', lastLogin: 'Today, 10:45 AM' },
  { id: 2, name: 'Prof. Kirti Borhade', userId: 'USR-AA-002', email: 'kirti.borhade@comp.nmiet.edu.in', role: 'academic_admin', roleDisplay: 'Academic Dept Admin', department: 'Computer Engineering', status: 'active', lastLogin: 'Today, 09:15 AM' },
  { id: 3, name: 'Prof. M. V. Kulkarni', userId: 'USR-AA-003', email: 'admin.it@collegeconnect.edu', role: 'academic_admin', roleDisplay: 'Academic Dept Admin', department: 'Information Technology', status: 'active', lastLogin: 'Yesterday, 04:30 PM' },
  { id: 4, name: 'Prof. Akash Mhetre', userId: 'USR-EA-004', email: 'akash.mhetre@exam.nmiet.edu.in', role: 'exam_admin', roleDisplay: 'Exam Dept Admin', department: 'Examination Department', status: 'active', lastLogin: 'Today, 11:20 AM' },
  { id: 5, name: 'Prof. Satyajit Sirsat', userId: 'USR-PA-005', email: 'satyajit.sirsat@placement.nmiet.edu.in', role: 'placement_admin', roleDisplay: 'Placement Dept Admin', department: 'Placement Cell', status: 'active', lastLogin: 'Oct 12, 02:00 PM' },
  { id: 6, name: 'Prof. Sonal Kadam', userId: 'USR-CT-006', email: 'sonal.kadam@comp.nmiet.edu.in', role: 'teacher', roleDisplay: 'Class Teacher', department: 'Computer Engineering', status: 'active', lastLogin: 'Today, 08:50 AM' },
  { id: 7, name: 'Krushna Funde', userId: 'USR-ST-007', email: 'krushna.funde@comp.nmiet.edu.in', role: 'student', roleDisplay: 'Student', department: 'Computer Engineering', status: 'active', lastLogin: 'Oct 14, 01:10 PM' },
  { id: 8, name: 'Ananya Sunil Deshpande', userId: 'USR-ST-008', email: 'ananya.deshpande@collegeconnect.edu', role: 'student', roleDisplay: 'Student', department: 'Computer Engineering', status: 'active', lastLogin: 'Oct 14, 12:40 PM' },
];

export function UserManagementModule() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Forms
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    email: '',
    role: 'academic_admin',
    department: 'Computer Engineering',
    status: 'active',
  });

  const { success, error } = useToast();

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  const roleDisplayMap = {
    super_admin: 'Super College Admin',
    academic_admin: 'Academic Dept Admin',
    exam_admin: 'Exam Dept Admin',
    placement_admin: 'Placement Dept Admin',
    teacher: 'Class Teacher',
    student: 'Student',
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.userId.trim() || !formData.email.trim()) {
      error('Name, User ID, and Institutional Email are required.');
      return;
    }

    if (users.some((u) => u.userId.toUpperCase() === formData.userId.trim().toUpperCase())) {
      error(`User with ID "${formData.userId.toUpperCase()}" already exists.`);
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.name.trim(),
      userId: formData.userId.trim().toUpperCase(),
      email: formData.email.trim(),
      role: formData.role,
      roleDisplay: roleDisplayMap[formData.role] || 'User',
      department: formData.department,
      status: formData.status,
      lastLogin: 'Never',
    };

    setUsers([newUser, ...users]);
    setShowCreateModal(false);
    setFormData({
      name: '',
      userId: '',
      email: '',
      role: 'academic_admin',
      department: 'Computer Engineering',
      status: 'active',
    });
    success(`User "${newUser.name}" created with role "${newUser.roleDisplay}".`);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              name: formData.name,
              email: formData.email,
              role: formData.role,
              roleDisplay: roleDisplayMap[formData.role] || u.roleDisplay,
              department: formData.department,
              status: formData.status,
            }
          : u
      )
    );
    setShowEditModal(false);
    success(`User profile updated for ${formData.name}.`);
  };

  const toggleStatus = (user) => {
    const nextStatus = user.status === 'active' ? 'disabled' : 'active';
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
    );
    success(`User "${user.name}" is now ${nextStatus}.`);
  };

  const handlePasswordReset = (user) => {
    success(`Secure password reset link generated and dispatched to ${user.email}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">User Accounts & Access Control</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage institutional user credentials, assign role authorities, and govern DPDP principle access boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setFormData({
                name: '',
                userId: '',
                email: '',
                role: 'academic_admin',
                department: 'Computer Engineering',
                status: 'active',
              });
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create User
          </button>
        </div>
      </div>

      {/* DPDP Role Authority Matrix Guidance */}
      <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-purple-950">
        <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-purple-900">DPDP Scoped Role Governance</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-purple-800 pt-1">
            <div><strong>• Academic Admin:</strong> Own department only</div>
            <div><strong>• Class Teacher:</strong> Assigned classes & roster</div>
            <div><strong>• Exam Admin:</strong> Schedules, Hall tickets, Results</div>
            <div><strong>• Placement Admin:</strong> Purpose-limited company drives</div>
            <div><strong>• Student:</strong> Own personal records & consent</div>
            <div><strong>• Super Admin:</strong> System & department config</div>
          </div>
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
            placeholder="Search by name, ID, or email..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto text-xs font-medium text-slate-600">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="academic_admin">Academic Dept Admin</option>
            <option value="exam_admin">Exam Dept Admin</option>
            <option value="placement_admin">Placement Dept Admin</option>
            <option value="teacher">Class Teacher</option>
            <option value="student">Student</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Inactive / Suspended</option>
          </select>
        </div>
      </div>

      {/* Main Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 font-semibold text-slate-600 text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">User ID</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Department / Scope</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {user.userId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={user.role}>{user.roleDisplay}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{user.department}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{user.lastLogin}</td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={user.status}>{user.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handlePasswordReset(user)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Dispatch Password Reset"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setFormData({
                            name: user.name,
                            userId: user.userId,
                            email: user.email,
                            role: user.role,
                            department: user.department,
                            status: user.status,
                          });
                          setShowEditModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(user)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          user.status === 'active'
                            ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                            : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Institutional User"
        subtitle="Provision user credentials and assign role boundaries."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
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
              <label className="font-bold text-slate-700 block mb-1">User Identifier *</label>
              <input
                type="text"
                required
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                placeholder="USR-AA-010"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium font-mono uppercase text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Role Authority *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option value="academic_admin">Academic Department Admin</option>
                <option value="exam_admin">Examination Department Admin</option>
                <option value="placement_admin">Placement Department Admin</option>
                <option value="teacher">Class Teacher</option>
                <option value="student">Student</option>
                <option value="super_admin">Super College Admin</option>
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
              <label className="font-bold text-slate-700 block mb-1">Department Scope</label>
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
                <option value="Examination Department">Examination Cell</option>
                <option value="Placement Cell">Placement Cell</option>
                <option value="Institutional Governance">Institutional Governance</option>
              </select>
            </div>
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
              Save User Account
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT USER MODAL */}
      {selectedUser && showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Edit User: ${selectedUser.name}`}
          subtitle="Modify role assignment and credentials status."
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleUpdateUser} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
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
                <label className="font-bold text-slate-700 block mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                >
                  <option value="academic_admin">Academic Department Admin</option>
                  <option value="exam_admin">Examination Department Admin</option>
                  <option value="placement_admin">Placement Department Admin</option>
                  <option value="teacher">Class Teacher</option>
                  <option value="student">Student</option>
                  <option value="super_admin">Super College Admin</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled / Suspended</option>
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
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
