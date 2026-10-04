import React, { useState, useMemo } from 'react';
import { useExamAdmin } from '../../../context/ExamAdminContext';
import { useToast } from '../../../context/ToastContext';
import { ExamAdminHeader } from '../components/ExamAdminHeader';
import { Modal } from '../../../components/Modal';
import {
  Ticket,
  Search,
  Eye,
  RotateCcw,
  Printer,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Download,
  Building,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export function HallTicketsModule({ onNavigateTab }) {
  const { students, generateHallTicketsForClass, regenerateSingleHallTicket, schedules } = useExamAdmin();
  const { success, info } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('SE');
  const [selectedExam, setSelectedExam] = useState('Data Structures');
  const [selectedSemester, setSelectedSemester] = useState('Semester II');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [viewingTicket, setViewingTicket] = useState(null);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchClass = selectedClass === 'All Classes' || s.class === selectedClass;
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.prn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchSearch;
    });
  }, [students, selectedClass, searchQuery]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBatchGenerate = () => {
    generateHallTicketsForClass(selectedClass);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. Header */}
      <ExamAdminHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search candidates by PRN or Name..."
        onNavigateTab={onNavigateTab}
      />

      {/* 2. Main Page Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
        {/* Title and Top Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Hall Tickets</h1>
            <p className="text-xs text-slate-500">Generate and manage hall tickets for examinations</p>
          </div>
          <button
            onClick={handleBatchGenerate}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Ticket className="w-4 h-4" />
            Generate Hall Tickets
          </button>
        </div>

        {/* Filters Bar matching Reference */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="SE">SE (Second Year)</option>
              <option value="TE">TE (Third Year)</option>
              <option value="BE">BE (Final Year)</option>
              <option value="All Classes">All Classes</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Exam</label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="Data Structures">Data Structures</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="Database Management">Database Management</option>
              <option value="All Exams">All Scheduled Exams</option>
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
        </div>

        {/* Hall Tickets Table */}
        <div className="overflow-x-auto border border-slate-200/90 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">PRN</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.map((st) => (
                <tr key={st.prn} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{st.prn}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{st.name}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{st.class} {st.division ? `(${st.division})` : ''}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        st.hallTicketStatus === 'Generated'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {st.hallTicketStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setViewingTicket(st)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Preview Hall Ticket"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => regenerateSingleHallTicket(st.prn)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Regenerate Ticket"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs text-slate-500">
          <span>
            Showing {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#6B46FE] text-white'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL: PRINTABLE HALL TICKET PREVIEW ================= */}
      {viewingTicket && (
        <Modal
          isOpen={!!viewingTicket}
          onClose={() => setViewingTicket(null)}
          title="Examination Hall Ticket"
          subtitle={`Candidate: ${viewingTicket.name}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs font-sans text-slate-800 print:text-black">
            {/* Institution Letterhead */}
            <div className="border-b-2 border-slate-800 pb-3 flex items-start justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                  Nutan Maharashtra Institute of Engineering &amp; Technology
                </h3>
                <p className="text-[11px] text-slate-600">
                  Affiliated to Savitribai Phule Pune University (SPPU) • NAAC Accredited
                </p>
                <p className="text-xs font-bold text-indigo-700 mt-1 uppercase">
                  End Semester Examination Hall Admission Ticket • AY 2024–2025
                </p>
              </div>
              <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center text-center p-1 shrink-0">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
            </div>

            {/* Candidate Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">PRN Number</span>
                <strong className="text-xs font-mono text-slate-900">{viewingTicket.prn}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Candidate Name</span>
                <strong className="text-xs text-slate-900 truncate block">{viewingTicket.name}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Class &amp; Div</span>
                <strong className="text-xs text-slate-900">{viewingTicket.class} - {viewingTicket.division || 'A'}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Seat Number</span>
                <strong className="text-xs font-mono text-indigo-700">{viewingTicket.seatNo}</strong>
              </div>
            </div>

            {/* Exam Timetable Schedule Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-[10px] font-bold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Subject / Paper</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Time Slot</th>
                    <th className="py-2 px-3">Venue</th>
                    <th className="py-2 px-3 text-center">Invigilator Sign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {schedules
                    .filter((s) => s.class === viewingTicket.class)
                    .map((sc) => (
                      <tr key={sc.id}>
                        <td className="py-2 px-3 font-bold text-slate-900">{sc.name}</td>
                        <td className="py-2 px-3 font-medium">{sc.date}</td>
                        <td className="py-2 px-3">{sc.time}</td>
                        <td className="py-2 px-3">{sc.venue || 'Hall A-101'}</td>
                        <td className="py-2 px-3 text-center text-slate-300 font-mono text-[10px]">________________</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Exam Day Instructions */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1 text-amber-950">
              <span className="font-bold text-[11px] block">Mandatory Instructions for Candidates:</span>
              <ul className="list-disc pl-4 text-[10.5px] space-y-0.5 text-amber-900">
                <li>Candidates must carry this signed Hall Ticket and valid College ID Card to every exam session.</li>
                <li>Report to the assigned examination hall 20 minutes prior to the commencement of the exam.</li>
                <li>Mobile phones, smart watches, and unauthorized electronic devices are strictly prohibited.</li>
              </ul>
            </div>

            {/* Footer Signatures */}
            <div className="flex items-end justify-between pt-4 border-t border-slate-200">
              <div className="text-center">
                <span className="block font-mono text-xs text-slate-400">________________________</span>
                <span className="text-[10px] font-semibold text-slate-500 mt-1 block">Candidate's Signature</span>
              </div>
              <div className="text-center">
                <span className="block font-bold text-xs text-indigo-900">Prof. Akash Mhetre</span>
                <span className="text-[10px] font-bold text-slate-600 block">Controller of Examinations</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 print:hidden">
              <button
                type="button"
                onClick={() => setViewingTicket(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Hall Ticket
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
