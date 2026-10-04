import React, { useState } from 'react';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  BookOpen,
  Mail,
  GraduationCap,
  Shield,
  Layers,
  Award,
  Edit2,
  CheckCircle2
} from 'lucide-react';

export function CompEngFaculty({
  faculty = [],
  classes = [],
  onAddFaculty,
  onAssignTeacher,
  departmentName = 'Computer Engineering',
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedFacultyMember, setSelectedFacultyMember] = useState(null);

  // Form states
  const [newFaculty, setNewFaculty] = useState({
    full_name: '',
    email: '',
    designation: 'Assistant Professor',
    specialization: 'Distributed Systems & Cloud',
    password: 'Teacher@2026Secure!',
  });

  const [assignment, setAssignment] = useState({
    user_id: faculty[0]?.user_id || '',
    class_id: classes[0]?.id || '',
    subject_name: 'Data Structures & Algorithms',
    is_class_teacher: false,
  });

  const filteredFaculty = faculty.filter((f) => {
    const matchesSearch =
      (f.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.specialization || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDesignation =
      selectedDesignation === 'ALL' ||
      (f.designation || '').toLowerCase() === selectedDesignation.toLowerCase();

    return matchesSearch && matchesDesignation;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAddFaculty(newFaculty);
    setShowAddModal(false);
    setNewFaculty({
      full_name: '',
      email: '',
      designation: 'Assistant Professor',
      specialization: 'Distributed Systems & Cloud',
      password: 'Teacher@2026Secure!',
    });
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    onAssignTeacher(assignment);
    setShowAssignModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Computer Engineering Faculty & Subject In-Charges
              </h2>
              <span className="px-2 py-0.5 text-xs font-extrabold bg-teal-50 text-teal-700 rounded-md border border-teal-100">
                {filteredFaculty.length} Faculty
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Faculty assignments, appointed Class Teachers, and subject course responsibilities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Faculty
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Assign Class / Subject
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty by name, email, or domain..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-600/30"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedDesignation}
              onChange={(e) => setSelectedDesignation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-600/30"
            >
              <option value="ALL">All Academic Designations</option>
              <option value="Professor">Professors</option>
              <option value="Associate Professor">Associate Professors</option>
              <option value="Assistant Professor">Assistant Professors</option>
              <option value="Lab Assistant">Lab Assistants</option>
            </select>
          </div>
        </div>
      </div>

      {/* Faculty Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFaculty.map((fac) => (
          <div
            key={fac.user_id || fac.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 to-slate-800 text-white font-bold flex items-center justify-center text-sm shadow-xs ring-1 ring-white/20">
                    {fac.full_name?.split(' ').map((n) => n[0]).slice(0, 2).join('') || 'FC'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{fac.full_name}</h3>
                    <p className="text-[11px] text-indigo-600 font-semibold">{fac.designation || 'Assistant Professor'}</p>
                  </div>
                </div>

                <Badge variant={fac.account_status || 'active'} size="sm">
                  {fac.account_status || 'Active'}
                </Badge>
              </div>

              {/* Specialization & Contact */}
              <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                <p className="flex items-center gap-1.5 text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono truncate">{fac.email}</span>
                </p>
                <p className="text-[11px] text-slate-600">
                  <strong className="text-slate-700">Domain:</strong> {fac.specialization || 'Algorithms & Systems'}
                </p>
              </div>

              {/* Assigned Subjects & Classes */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <span>Assigned Classes</span>
                  <span className="text-indigo-600">{fac.assignments?.length || 0} active</span>
                </div>

                {fac.assignments && fac.assignments.length > 0 ? (
                  <div className="space-y-1.5">
                    {fac.assignments.map((a, i) => (
                      <div
                        key={i}
                        className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{a.class_name}</span>
                          <span className="text-slate-400 mx-1">&bull;</span>
                          <span className="text-slate-600">{a.subject_name}</span>
                        </div>
                        {a.is_class_teacher && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                            Class Teacher
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-2 rounded-xl text-center">
                    No classes assigned this term.
                  </p>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-medium">
                Workload: <strong className="text-slate-700">{fac.teaching_hours || 16} hrs/week</strong>
              </span>
              <button
                onClick={() => {
                  setAssignment({
                    ...assignment,
                    user_id: fac.user_id,
                  });
                  setShowAssignModal(true);
                }}
                className="text-indigo-600 hover:text-indigo-800 font-bold text-xs"
              >
                + Assign Subject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Faculty */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Provision Computer Engineering Faculty"
        subtitle="Registers teaching faculty account and sends credentials verification email"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Faculty Full Name
            </label>
            <input
              type="text"
              value={newFaculty.full_name}
              onChange={(e) => {
                const name = e.target.value;
                const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '.');
                setNewFaculty({
                  ...newFaculty,
                  full_name: name,
                  email: slug ? `${slug}@college.edu` : '',
                });
              }}
              placeholder="Dr. K. Verma"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                value={newFaculty.email}
                onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                placeholder="k.verma@college.edu"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Designation
              </label>
              <select
                value={newFaculty.designation}
                onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600"
              >
                <option value="Professor">Professor & HOD</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lab Assistant">Technical Lab Assistant</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Primary Research / Course Specialization
            </label>
            <input
              type="text"
              value={newFaculty.specialization}
              onChange={(e) => setNewFaculty({ ...newFaculty, specialization: e.target.value })}
              placeholder="e.g. Distributed Computing, Machine Learning, Operating Systems"
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Temporary Initial Password
            </label>
            <input
              type="password"
              value={newFaculty.password}
              onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs"
            >
              Provision Faculty
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Assign Class Teacher & Subject */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Class Teacher & Subject Faculty"
        subtitle="Establish academic instructional authority for Computer Engineering divisions"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Faculty Member
            </label>
            <select
              value={assignment.user_id}
              onChange={(e) => setAssignment({ ...assignment, user_id: e.target.value })}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">Choose Faculty...</option>
              {faculty.map((f) => (
                <option key={f.user_id || f.id} value={f.user_id || f.id}>
                  {f.full_name} ({f.designation || 'Faculty'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Division
              </label>
              <select
                value={assignment.class_id}
                onChange={(e) => setAssignment({ ...assignment, class_id: e.target.value })}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Div {c.division})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subject Name
              </label>
              <input
                type="text"
                value={assignment.subject_name}
                onChange={(e) => setAssignment({ ...assignment, subject_name: e.target.value })}
                placeholder="e.g. Operating Systems"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={assignment.is_class_teacher}
                onChange={(e) => setAssignment({ ...assignment, is_class_teacher: e.target.checked })}
                className="w-4 h-4 text-teal-600 rounded"
              />
              <div>
                <span className="text-xs font-bold text-teal-900 block">
                  Designate as Official Class Teacher
                </span>
                <span className="text-[11px] text-teal-700 block">
                  Grants attendance management and marks submission authority for this division.
                </span>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAssignModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
