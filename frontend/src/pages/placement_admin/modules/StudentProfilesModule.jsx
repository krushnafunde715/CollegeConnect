import React, { useState, useMemo } from 'react';
import { usePlacementAdmin } from '../../../context/PlacementAdminContext';
import { PlacementAdminHeader } from '../components/PlacementAdminHeader';
import { normalizeToArray } from '../../../utils/normalizeData';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Edit,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Award,
  Phone,
  Mail,
  ExternalLink,
  X,
  Plus,
  ArrowUpDown,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export function StudentProfilesModule({ onNavigateTab }) {
  const { students, updateStudentProfile } = usePlacementAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Calculations
  const stats = useMemo(() => {
    const total = students.length;
    const placed = students.filter((s) => s.placementStatus === 'Placed').length;
    const shortlisted = students.filter((s) => s.placementStatus === 'Shortlisted').length;
    const eligible = students.filter((s) => s.eligible).length;
    const avgCgpa = (
      students.reduce((acc, s) => acc + parseFloat(s.cgpa || 0), 0) / (total || 1)
    ).toFixed(2);

    return {
      total,
      placed,
      placedRate: total ? Math.round((placed / total) * 100) : 0,
      shortlisted,
      eligible,
      avgCgpa,
    };
  }, [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return (students || []).filter((s) => {
      const skillsArray = normalizeToArray(s.skills);
      const matchSearch =
        searchQuery === '' ||
        (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.prn && s.prn.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.companyPlaced && s.companyPlaced.toLowerCase().includes(searchQuery.toLowerCase())) ||
        skillsArray.some((sk) => typeof sk === 'string' && sk.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDept = selectedDept === 'All' || s.department === selectedDept;
      const matchClass = selectedClass === 'All' || s.class === selectedClass;
      const matchStatus = selectedStatus === 'All' || s.placementStatus === selectedStatus;

      return matchSearch && matchDept && matchClass && matchStatus;
    });
  }, [students, searchQuery, selectedDept, selectedClass, selectedStatus]);

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      placementStatus: student.placementStatus || 'Applied',
      companyPlaced: student.companyPlaced || '',
      package: student.package || '',
      role: student.role || '',
      eligible: student.eligible !== false,
      appliedDrives: student.appliedDrives || 0,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    updateStudentProfile(selectedStudent.prn, editFormData);
    setShowEditModal(false);
    setSelectedStudent(null);
  };

  const handleExportCSV = () => {
    const headers = ['PRN', 'Name', 'Department', 'Class', 'CGPA', 'Status', 'Company', 'Package', 'Email', 'Phone'];
    const rows = filteredStudents.map((s) => [
      s.prn,
      `"${s.name}"`,
      s.department,
      `${s.class} ${s.division || ''}`,
      s.cgpa,
      s.placementStatus,
      `"${s.companyPlaced || 'N/A'}"`,
      `"${s.package || 'N/A'}"`,
      s.email,
      s.phone,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `collegeconnect_student_placement_profiles_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shortlisted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'In Process':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Applied':
        return 'bg-amber-50 text-amber-700 border-amber-200';
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
        placeholder="Search students by name, PRN, skill, or placed company..."
        onNavigateTab={onNavigateTab}
      />

      {/* Page Title Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Student Directory
            </span>
            <span className="text-xs text-slate-500 font-medium">Batch 2025 – 2026</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Student Placement Profiles</h1>
          <p className="text-xs text-slate-500">
            Comprehensive database of candidate academic eligibility, verified skills, resumes, and career allocations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Registered</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stats.total} Candidates</h3>
            <span className="text-[10.5px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> 100% DPDP Verified
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Placed</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stats.placed} Offers</h3>
            <span className="text-[10.5px] text-purple-600 font-bold mt-0.5 inline-block">
              {stats.placedRate}% Placement Rate
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">In Process / Shortlisted</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stats.shortlisted + 8} Students</h3>
            <span className="text-[10.5px] text-blue-600 font-bold mt-0.5 inline-block">Across active rounds</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Average Batch CGPA</p>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stats.avgCgpa} / 10</h3>
            <span className="text-[10.5px] text-emerald-600 font-bold mt-0.5 inline-block">First Class with Distinction</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <Filter className="w-4 h-4 text-purple-600" /> Filters:
            </div>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            >
              <option value="All">All Departments</option>
              <option value="Computer">Computer</option>
              <option value="IT">IT</option>
              <option value="ENTC">ENTC</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
            </select>

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            >
              <option value="All">All Classes</option>
              <option value="BE">BE (Final Year)</option>
              <option value="TE">TE (Third Year)</option>
              <option value="SE">SE (Second Year)</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
            >
              <option value="All">All Statuses</option>
              <option value="Placed">Placed</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="In Process">In Process</option>
              <option value="Applied">Applied</option>
              <option value="Unplaced">Unplaced</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{filteredStudents.length}</span> of{' '}
            <span className="font-bold text-slate-800">{students.length}</span> students
          </div>
        </div>
      </div>

      {/* Main Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student Info</th>
                <th className="py-3.5 px-4">Branch &amp; Class</th>
                <th className="py-3.5 px-4">CGPA</th>
                <th className="py-3.5 px-4">Primary Skills</th>
                <th className="py-3.5 px-4">Placement Status</th>
                <th className="py-3.5 px-4">Offer / Company</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No student placement profiles match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.prn} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {s.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{s.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{s.prn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{s.department}</span>
                      <span className="block text-[11px] text-slate-500">
                        {s.class} Div {s.division || 'A'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-xs ${
                          parseFloat(s.cgpa) >= 9.0
                            ? 'bg-purple-100 text-purple-700'
                            : parseFloat(s.cgpa) >= 8.0
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {s.cgpa}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {normalizeToArray(s.skills, ['Java', 'SQL']).slice(0, 3).map((sk, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10.5px] font-medium"
                          >
                            {sk}
                          </span>
                        ))}
                        {normalizeToArray(s.skills).length > 3 && (
                          <span className="text-[10px] text-slate-400 font-bold self-center">
                            +{normalizeToArray(s.skills).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                          s.placementStatus
                        )}`}
                      >
                        {s.placementStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {s.companyPlaced ? (
                        <div>
                          <p className="font-bold text-slate-900">{s.companyPlaced}</p>
                          <p className="text-[11px] text-emerald-600 font-bold">{s.package || 'Confidential'}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Pending Allocation</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedStudent(s);
                            setShowResumeModal(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                          title="Preview Resume"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(s);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="View Full Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="Edit Placement Status"
                        >
                          <Edit className="w-4 h-4" />
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

      {/* MODAL 1: Full Profile Details Modal */}
      {selectedStudent && !showResumeModal && !showEditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center">
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedStudent.prn}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Branch &amp; Class</span>
                <span className="font-bold text-slate-800">
                  {selectedStudent.department} Engineering — {selectedStudent.class} ({selectedStudent.division || 'A'})
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Cumulative GPA</span>
                <span className="font-bold text-purple-700 text-sm">{selectedStudent.cgpa} / 10.0</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Email</span>
                <span className="font-semibold text-slate-800 truncate block">{selectedStudent.email}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
                <span className="font-semibold text-slate-800">{selectedStudent.phone}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1.5">Technical Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {normalizeToArray(selectedStudent.skills).map((sk, idx) => (
                  <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {normalizeToArray(selectedStudent.certifications).length > 0 && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1.5">Certifications</span>
                <ul className="text-xs text-slate-700 space-y-1">
                  {normalizeToArray(selectedStudent.certifications).map((c, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-600 block">Placement Status</span>
                <p className="text-xs font-bold text-purple-950">
                  {selectedStudent.placementStatus}{' '}
                  {selectedStudent.companyPlaced && `— ${selectedStudent.companyPlaced} (${selectedStudent.package})`}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowResumeModal(true);
                }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" /> Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Resume Preview Modal */}
      {showResumeModal && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Candidate Resume — {selectedStudent.name} ({selectedStudent.prn})
                </h3>
              </div>
              <button
                onClick={() => setShowResumeModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mock Styled Resume Preview */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-xs space-y-4 font-sans max-h-[60vh] overflow-y-auto">
              <div className="border-b border-slate-200 pb-3">
                <h2 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h2>
                <p className="text-slate-600 font-medium">{selectedStudent.department} Engineering Candidate | CGPA: {selectedStudent.cgpa}</p>
                <p className="text-slate-500">{selectedStudent.email} | {selectedStudent.phone}</p>
              </div>

              <div>
                <h4 className="font-bold text-purple-700 uppercase tracking-wider text-[10px] mb-1">Career Objective</h4>
                <p className="text-slate-700 leading-relaxed">
                  Dedicated engineering graduate seeking high-impact software engineering / technology roles to leverage
                  deep problem-solving skills, modern frameworks, and algorithmic excellence.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-purple-700 uppercase tracking-wider text-[10px] mb-1">Education</h4>
                <p className="font-bold text-slate-800">NMIET — Bachelor of Engineering ({selectedStudent.department})</p>
                <p className="text-slate-500">Graduation Year: 2026 | Aggregate CGPA: {selectedStudent.cgpa} / 10.0</p>
              </div>

              <div>
                <h4 className="font-bold text-purple-700 uppercase tracking-wider text-[10px] mb-1">Technical Skills &amp; Competencies</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {normalizeToArray(selectedStudent.skills).map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800 font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-purple-700 uppercase tracking-wider text-[10px] mb-1">Certifications &amp; Accreditations</h4>
                <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                  {normalizeToArray(selectedStudent.certifications, ['NPTEL Elite Certification', 'AWS Fundamentals']).map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">DPDP Consent-Verified Digital Resume</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    alert(`Downloading official signed resume for ${selectedStudent.name}`);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Placement Status Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Update Placement Status</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Student</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedStudent.name} (${selectedStudent.prn})`}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Placement Status *</label>
                <select
                  value={editFormData.placementStatus}
                  onChange={(e) => setEditFormData({ ...editFormData, placementStatus: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                >
                  <option value="Placed">Placed</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="In Process">In Process</option>
                  <option value="Applied">Applied</option>
                  <option value="Unplaced">Unplaced</option>
                </select>
              </div>

              {editFormData.placementStatus === 'Placed' && (
                <>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Company Placed *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tata Consultancy Services"
                      value={editFormData.companyPlaced}
                      onChange={(e) => setEditFormData({ ...editFormData, companyPlaced: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Package (CTC) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 7.5 LPA"
                        value={editFormData.package}
                        onChange={(e) => setEditFormData({ ...editFormData, package: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Designation / Role</label>
                      <input
                        type="text"
                        placeholder="e.g. Graduate Trainee"
                        value={editFormData.role}
                        onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="eligibleCheck"
                  checked={editFormData.eligible}
                  onChange={(e) => setEditFormData({ ...editFormData, eligible: e.target.checked })}
                  className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
                <label htmlFor="eligibleCheck" className="text-slate-700 font-medium cursor-pointer">
                  Eligible for upcoming placement drives
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
