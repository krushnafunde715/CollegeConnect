import React, { useState, useMemo } from 'react';
import { useExamAdmin } from '../../../context/ExamAdminContext';
import { useToast } from '../../../context/ToastContext';
import { ExamAdminHeader } from '../components/ExamAdminHeader';
import { Modal } from '../../../components/Modal';
import {
  Award,
  Search,
  Eye,
  Send,
  RotateCcw,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export function ResultsManagementModule({ onNavigateTab }) {
  const { results, publishResult, unpublishResult, students } = useExamAdmin();
  const { success, info } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedSemester, setSelectedSemester] = useState('Semester II');
  const [selectedExamType, setSelectedExamType] = useState('End Semester');

  // Modals
  const [viewingGazette, setViewingGazette] = useState(null);
  const [publishingExam, setPublishingExam] = useState(null);

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const matchSearch =
        r.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.class.toLowerCase().includes(searchQuery.toLowerCase());
      const matchClass = selectedClass === 'All Classes' || r.class === selectedClass;
      return matchSearch && matchClass;
    });
  }, [results, searchQuery, selectedClass]);

  const handleConfirmPublish = () => {
    if (publishingExam) {
      publishResult(publishingExam.id);
      setPublishingExam(null);
    }
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. Header */}
      <ExamAdminHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search examination results..."
        onNavigateTab={onNavigateTab}
      />

      {/* 2. Main Page Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
        {/* Title and Top Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Results Management</h1>
            <p className="text-xs text-slate-500">Process and publish examination results</p>
          </div>
          <button
            onClick={() => {
              const draft = results.find((r) => r.status === 'Draft');
              if (draft) {
                setPublishingExam(draft);
              } else {
                info('All current examination results are already published.');
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Send className="w-4 h-4" />
            Publish Results
          </button>
        </div>

        {/* Filters Bar matching Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="All Classes">All Classes</option>
              <option value="SE">SE (Second Year)</option>
              <option value="TE">TE (Third Year)</option>
              <option value="BE">BE (Final Year)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="Semester II">Semester II</option>
              <option value="Semester I">Semester I</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Exam Type</label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="End Semester">End Semester</option>
              <option value="In-Semester">In-Semester</option>
            </select>
          </div>
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto border border-slate-200/90 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Exam Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4 text-center">Appeared</th>
                <th className="py-3 px-4 text-center">Passed</th>
                <th className="py-3 px-4 text-center">Pass %</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{r.examName}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{r.class}</td>
                  <td className="py-3 px-4 text-slate-600">{r.semester}</td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-800">{r.appeared}</td>
                  <td className="py-3 px-4 text-center font-semibold text-emerald-700">{r.passed}</td>
                  <td className="py-3 px-4 text-center font-black text-slate-900">{r.passPct}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setViewingGazette(r)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="View Gazette & Transcript"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {r.status === 'Draft' ? (
                        <button
                          onClick={() => setPublishingExam(r)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Publish Result"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => unpublishResult(r.id)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                          title="Revert to Draft"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: GAZETTE PREVIEW ================= */}
      {viewingGazette && (
        <Modal
          isOpen={!!viewingGazette}
          onClose={() => setViewingGazette(null)}
          title="Official Examination Gazette"
          subtitle={`${viewingGazette.examName} (${viewingGazette.class} Sem ${viewingGazette.semester})`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-slate-500 font-bold block">Status: {viewingGazette.status}</span>
                <span className="text-[11px] text-slate-600">
                  {viewingGazette.publishedDate ? `Published on ${viewingGazette.publishedDate} by ${viewingGazette.verifiedBy}` : 'Draft - Unofficial Preview'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900 block">{viewingGazette.passPct}</span>
                  <span className="text-[10px] text-slate-400">Pass Percentage</span>
                </div>
              </div>
            </div>

            {/* Candidate Sample Gazette Listing */}
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="py-2 px-3">PRN</th>
                    <th className="py-2 px-3">Candidate Name</th>
                    <th className="py-2 px-3 text-center">Marks</th>
                    <th className="py-2 px-3 text-center">Grade</th>
                    <th className="py-2 px-3 text-center">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter((s) => s.class === viewingGazette.class)
                    .slice(0, 9)
                    .map((st) => (
                      <tr key={st.prn}>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">{st.prn}</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">{st.name}</td>
                        <td className="py-2 px-3 text-center font-bold text-slate-900">{st.total} / 100</td>
                        <td className="py-2 px-3 text-center font-bold text-indigo-600">
                          {st.total >= 85 ? 'O' : st.total >= 75 ? 'A+' : st.total >= 60 ? 'A' : 'B+'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            {st.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-mono">
                SHA-256 Gazette Seal: e7f2...8b9c
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewingGazette(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
                {viewingGazette.status === 'Draft' && (
                  <button
                    onClick={() => {
                      publishResult(viewingGazette.id);
                      setViewingGazette(null);
                    }}
                    className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Publish Official Gazette
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ================= MODAL: CONFIRM PUBLISH ================= */}
      {publishingExam && (
        <Modal
          isOpen={!!publishingExam}
          onClose={() => setPublishingExam(null)}
          title="Publish Examination Gazette"
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Confirm Result Gazette Publication</p>
                <p className="text-purple-700 text-[11px] mt-0.5">
                  Publishing will make the official marks and SGPA transcripts visible on the student portal for "{publishingExam.examName}".
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPublishingExam(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Confirm &amp; Publish
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
