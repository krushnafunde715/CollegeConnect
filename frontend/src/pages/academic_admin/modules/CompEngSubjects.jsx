import React, { useState } from 'react';
import compEngCampusPhoto from '../../../assets/comp_eng_campus.png';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import { useCompEngData } from '../../../context/CompEngDataContext';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Layers,
  GraduationCap,
  Users,
  Award,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

export function CompEngSubjects({
  departmentName = 'Computer Engineering',
}) {
  const { success } = useToast();
  const {
    subjects,
    faculty,
    addSubject,
    updateSubject,
    deleteSubject,
  } = useCompEngData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('2024 - 2025');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deletingSubject, setDeletingSubject] = useState(null);

  const [newSub, setNewSub] = useState({
    code: 'CC211',
    name: '',
    semester: 'Semester 7 (BE)',
    sem: 'VII',
    type: 'Theory',
    credits: 4,
    faculty: faculty[0]?.full_name || 'Dr. Anita Joshi',
  });

  const handleReset = () => {
    setSearchQuery('');
    setSelectedSemester('ALL');
    setSelectedType('ALL');
  };

  const filtered = subjects.filter((s) => {
    const q = searchQuery.toLowerCase();
    const nameMatch =
      (s.name || '').toLowerCase().includes(q) ||
      (s.code || '').toLowerCase().includes(q) ||
      (s.faculty || '').toLowerCase().includes(q);
    const semMatch =
      selectedSemester === 'ALL' ||
      s.sem === selectedSemester ||
      s.semester?.includes(selectedSemester);
    const typeMatch = selectedType === 'ALL' || s.type === selectedType;
    return nameMatch && semMatch && typeMatch;
  });

  const theoryCount = subjects.filter((s) => s.type === 'Theory').length;
  const practicalCount = subjects.filter((s) => s.type === 'Practical').length;

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    addSubject(newSub);
    setShowAddModal(false);
    setNewSub({
      code: `CC21${subjects.length + 1}`,
      name: '',
      semester: 'Semester 7 (BE)',
      sem: 'VII',
      type: 'Theory',
      credits: 4,
      faculty: faculty[0]?.full_name || 'Dr. Anita Joshi',
    });
  };

  const handleSaveEditSubject = (e) => {
    e.preventDefault();
    updateSubject(editingSubject.id, editingSubject);
    setEditingSubject(null);
  };

  const handleConfirmDeleteSubject = () => {
    if (!deletingSubject) return;
    deleteSubject(deletingSubject.id);
    setDeletingSubject(null);
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* ================= BREADCRUMB & HEADER BANNER ================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#F0F3FF] via-[#EAEFFF] to-[#E2E8F8] border border-indigo-100/80 p-6 sm:p-7 shadow-xs">
        <div
          className="absolute inset-y-0 right-0 w-3/5 bg-cover bg-no-repeat pointer-events-none opacity-90"
          style={{
            backgroundImage: `url(${compEngCampusPhoto})`,
            backgroundPosition: 'center 45%',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,1) 70%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 25%, rgba(0,0,0,1) 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold text-slate-500 mb-1">
              <span>Dashboard</span> &gt; <span className="text-purple-600">Subjects</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Curriculum &amp; Subjects
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Manage department courses, theory/practical credits, and faculty allocations.
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-500 block mb-1">Academic Year</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs"
            >
              <option value="2024 - 2025">2024 - 2025</option>
              <option value="2025 - 2026">2025 - 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= 4 STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Subjects</span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">{subjects.length}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Theory Subjects</span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">{theoryCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Practical Labs</span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">{practicalCount}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">Faculty Allocated</span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">{faculty.length}</h3>
          </div>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subject by name or code..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-purple-600/20"
            />
          </div>

          <div>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            >
              <option value="ALL">All Semesters</option>
              <option value="III">Semester III</option>
              <option value="IV">Semester IV</option>
              <option value="V">Semester V</option>
              <option value="VI">Semester VI</option>
              <option value="VII">Semester VII</option>
              <option value="VIII">Semester VIII</option>
            </select>
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            >
              <option value="ALL">All Types</option>
              <option value="Theory">Theory</option>
              <option value="Practical">Practical</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Subject
            </button>
          </div>
        </div>
      </div>

      {/* ================= SUBJECTS TABLE ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Subject Name</th>
                <th className="px-3 py-3">Semester</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3 text-center">Credits</th>
                <th className="px-4 py-3">Assigned Faculty</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No subjects match criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id || s.code} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{s.code}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{s.name}</td>
                    <td className="px-3 py-3 font-semibold text-purple-700">{s.sem || s.semester || 'III'}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          s.type === 'Theory'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {s.type}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-slate-800">{s.credits}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{s.faculty}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedSubject(s)}
                          className="p-1 text-slate-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingSubject({ ...s })}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer"
                          title="Edit Subject"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingSubject(s)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="Delete Subject"
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

      {/* ================= MODAL: ADD SUBJECT ================= */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Catalog New Subject (Computer Engineering)"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Subject Code *</label>
              <input
                type="text"
                value={newSub.code}
                onChange={(e) => setNewSub({ ...newSub, code: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Semester *</label>
              <select
                value={newSub.sem}
                onChange={(e) => setNewSub({ ...newSub, sem: e.target.value, semester: `Semester ${e.target.value}` })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                required
              >
                <option value="III">Semester III</option>
                <option value="IV">Semester IV</option>
                <option value="V">Semester V</option>
                <option value="VI">Semester VI</option>
                <option value="VII">Semester VII</option>
                <option value="VIII">Semester VIII</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Subject Title *</label>
            <input
              type="text"
              value={newSub.name}
              onChange={(e) => setNewSub({ ...newSub, name: e.target.value })}
              placeholder="e.g. Distributed Operating Systems"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Subject Type</label>
              <select
                value={newSub.type}
                onChange={(e) => setNewSub({ ...newSub, type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              >
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Academic Credits</label>
              <input
                type="number"
                min="1"
                max="6"
                value={newSub.credits}
                onChange={(e) => setNewSub({ ...newSub, credits: parseInt(e.target.value) || 4 })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Assigned Faculty Mentor</label>
            <select
              value={newSub.faculty}
              onChange={(e) => setNewSub({ ...newSub, faculty: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
            >
              {faculty.map((f) => (
                <option key={f.id || f.user_id} value={f.full_name}>
                  {f.full_name} ({f.designation})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Catalog Subject
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: VIEW SUBJECT ================= */}
      {selectedSubject && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSubject(null)}
          title={`Subject Details — ${selectedSubject.code}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
              <span className="font-mono text-purple-700 font-bold">{selectedSubject.code}</span>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{selectedSubject.name}</h4>
              <p className="text-slate-600 text-[11px] mt-1">Semester {selectedSubject.sem} &bull; {selectedSubject.credits} Credits</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold">Faculty Mentor:</span>
              <p className="font-bold text-slate-900">{selectedSubject.faculty}</p>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSubject(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: EDIT SUBJECT ================= */}
      {editingSubject && (
        <Modal
          isOpen={true}
          onClose={() => setEditingSubject(null)}
          title={`Edit Subject — ${editingSubject.code}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveEditSubject} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Subject Title</label>
              <input
                type="text"
                value={editingSubject.name}
                onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Type</label>
                <select
                  value={editingSubject.type}
                  onChange={(e) => setEditingSubject({ ...editingSubject, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Theory">Theory</option>
                  <option value="Practical">Practical</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Credits</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={editingSubject.credits}
                  onChange={(e) => setEditingSubject({ ...editingSubject, credits: parseInt(e.target.value) || 4 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Assigned Faculty</label>
              <select
                value={editingSubject.faculty}
                onChange={(e) => setEditingSubject({ ...editingSubject, faculty: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
              >
                {faculty.map((f) => (
                  <option key={f.id || f.user_id} value={f.full_name}>
                    {f.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingSubject(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Save Subject
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ================= MODAL: DELETE SUBJECT ================= */}
      {deletingSubject && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingSubject(null)}
          title="Confirm Subject Deletion"
          maxWidth="max-w-sm"
        >
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Are you sure you want to remove <strong className="text-slate-900">{deletingSubject.code} — {deletingSubject.name}</strong> from the catalog?
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeletingSubject(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteSubject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
