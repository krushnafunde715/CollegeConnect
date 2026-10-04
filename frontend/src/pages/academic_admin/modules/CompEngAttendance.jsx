import React, { useState } from 'react';
import compEngCampusPhoto from '../../../assets/comp_eng_campus.png';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import { useToast } from '../../../context/ToastContext';
import { useCompEngData } from '../../../context/CompEngDataContext';
import {
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  AlertTriangle,
  FileSpreadsheet,
  Settings,
  Plus,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export function CompEngAttendance({
  departmentName = 'Computer Engineering',
}) {
  const { success, info } = useToast();
  const {
    students,
    classes,
    subjects,
    recordAttendanceSession,
  } = useCompEngData();

  const [selectedClass, setSelectedClass] = useState(classes[0]?.name || 'SE A');
  const [selectedSubject, setSelectedSubject] = useState('Data Structures & Algorithms');
  const [selectedMonth, setSelectedMonth] = useState('October 2024');
  const [selectedYear, setSelectedYear] = useState('2024 - 2025');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showTakeAttendanceModal, setShowTakeAttendanceModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  // Session mark state in modal
  const [sessionMarks, setSessionMarks] = useState({});

  // Settings state
  const [minThreshold, setMinThreshold] = useState(75);
  const [alertGuardians, setAlertGuardians] = useState(true);

  // Derive students for selected class directly from centralized store
  const classStudents = students.filter(
    (s) => (s.current_class_name || `${s.class_name} ${s.division}`) === selectedClass
  );

  const filteredStudents = classStudents.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      (s.name || s.full_name || '').toLowerCase().includes(q) ||
      (s.prn || s.college_id || '').toLowerCase().includes(q)
    );
  });

  const totalStudentsInClass = classStudents.length;
  const totalSessions = 24;
  const avgPresent = totalStudentsInClass > 0
    ? Math.round(classStudents.reduce((acc, s) => acc + (s.present || 20), 0) / totalStudentsInClass)
    : 0;
  const avgAbsent = totalStudentsInClass > 0 ? Math.max(0, totalSessions - avgPresent) : 0;
  const presentPct = totalSessions > 0 ? Math.round((avgPresent / totalSessions) * 100) : 0;

  const handleOpenTakeAttendance = () => {
    const initialMarks = {};
    classStudents.forEach((s) => {
      initialMarks[s.id || s.prn] = 'P';
    });
    setSessionMarks(initialMarks);
    setShowTakeAttendanceModal(true);
  };

  const handleSubmitAttendanceSession = (e) => {
    e.preventDefault();
    recordAttendanceSession(selectedClass, selectedSubject, attendanceDate, sessionMarks);
    setShowTakeAttendanceModal(false);
    success(`Attendance for ${attendanceDate} recorded for ${selectedClass}.`);
  };

  const handleSendDefaulterAlerts = () => {
    const defaulters = classStudents.filter(
      (s) => parseFloat(s.attendance_rate || s.attendance || 85) < minThreshold
    );
    if (defaulters.length === 0) {
      info(`All students in ${selectedClass} meet the minimum ${minThreshold}% threshold.`);
    } else {
      success(`Triggered guardian notifications for ${defaulters.length} attendance defaulter(s) in ${selectedClass}.`);
    }
  };

  const handleExportAttendance = () => {
    const headers = ['Roll No', 'PRN', 'Student Name', 'Present (24)', 'Absent', 'Attendance %', 'Status'];
    const rows = filteredStudents.map((s) => {
      const rate = parseFloat(s.attendance_rate || s.attendance || 85);
      return [
        s.roll,
        s.prn || s.college_id,
        `"${s.name || s.full_name}"`,
        s.present || 20,
        s.absent || 4,
        `${rate}%`,
        rate >= 90 ? 'Excellent' : rate >= 75 ? 'Good' : rate >= 65 ? 'Average' : 'Low',
      ];
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedClass.replace(/\s+/g, '_')}_Attendance_${selectedMonth.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success(`Exported ${selectedClass} attendance register to CSV.`);
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
              <span>Dashboard</span> &gt; <span className="text-purple-600">Attendance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Attendance Records
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Track daily classroom sessions, calculate monthly percentages, and trigger low attendance alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
            <button
              onClick={handleOpenTakeAttendance}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Take Attendance
            </button>
          </div>
        </div>
      </div>

      {/* ================= 4 ATTENDANCE SUMMARY STATS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">{selectedClass} Class Size</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">{totalStudentsInClass}</span>
            <span className="text-[10px] text-purple-600 font-semibold">Enrolled Students</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Avg Present</span>
            <span className="text-xl font-black text-emerald-700 mt-0.5 block">{avgPresent} / {totalSessions}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">{presentPct}% Present Rate</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Avg Absent</span>
            <span className="text-xl font-black text-rose-700 mt-0.5 block">{avgAbsent}</span>
            <span className="text-[10px] text-rose-600 font-semibold">Sessions per student</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Threshold Status</span>
            <span className="text-xl font-black text-slate-900 mt-0.5 block">&gt; {minThreshold}%</span>
            <span className="text-[10px] text-slate-500 font-semibold">SPPU Compliance</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ================= FILTER TOOLBAR ================= */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student in class..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
            >
              {classes.map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 max-w-[220px] truncate"
            >
              {subjects.map((sub) => (
                <option key={sub.id || sub.code} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
            >
              <option value="October 2024">October 2024</option>
              <option value="November 2024">November 2024</option>
              <option value="December 2024">December 2024</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={handleSendDefaulterAlerts}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Alert Defaulters (&lt;{minThreshold}%)
          </button>
          <button
            onClick={handleExportAttendance}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Register
          </button>
        </div>
      </div>

      {/* ================= ATTENDANCE ROSTER TABLE ================= */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-3 py-3 w-10">#</th>
                <th className="px-3 py-3">Roll No.</th>
                <th className="px-3 py-3">PRN</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-3 py-3 text-center">Present Sessions</th>
                <th className="px-3 py-3 text-center">Absent Sessions</th>
                <th className="px-4 py-3 text-center">Attendance %</th>
                <th className="px-3 py-3 text-center">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400">
                    No students found for {selectedClass}.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => {
                  const rate = parseFloat(s.attendance_rate || s.attendance || 85);
                  const isExcellent = rate >= 90;
                  const isGood = rate >= 75 && rate < 90;
                  const isAverage = rate >= 65 && rate < 75;
                  const isLow = rate < 65;

                  return (
                    <tr key={s.id || s.prn} className="hover:bg-slate-50/70">
                      <td className="px-3 py-3 font-semibold text-slate-400">{idx + 1}</td>
                      <td className="px-3 py-3 font-semibold text-slate-900">{s.roll || idx + 1}</td>
                      <td className="px-3 py-3 font-mono font-bold text-slate-700">{s.prn || s.college_id}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">{s.name || s.full_name}</td>
                      <td className="px-3 py-3 text-center font-bold text-emerald-700">{s.present || 20}</td>
                      <td className="px-3 py-3 text-center font-bold text-rose-700">{s.absent || 4}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                rate >= 75 ? 'bg-emerald-500' : rate >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${Math.min(100, rate)}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-900">{rate}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isExcellent
                              ? 'bg-emerald-100 text-emerald-700'
                              : isGood
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isAverage
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {isExcellent ? 'Excellent' : isGood ? 'Good' : isAverage ? 'Average' : 'Low (<75%)'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: TAKE ATTENDANCE ================= */}
      <Modal
        isOpen={showTakeAttendanceModal}
        onClose={() => setShowTakeAttendanceModal(false)}
        title={`Take Attendance — ${selectedClass} (${selectedSubject})`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitAttendanceSession} className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[11px]">Class &amp; Subject</span>
              <strong className="text-slate-900 text-sm">{selectedClass} &bull; {selectedSubject}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Session Date</span>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                required
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
            {classStudents.map((s) => {
              const sid = s.id || s.prn;
              const isPresent = sessionMarks[sid] === 'P';
              return (
                <div key={sid} className="p-3 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                      {s.roll}
                    </span>
                    <div>
                      <h5 className="font-bold text-slate-900">{s.name || s.full_name}</h5>
                      <span className="font-mono text-slate-400 text-[10px]">{s.prn || s.college_id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSessionMarks({ ...sessionMarks, [sid]: 'P' })}
                      className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                        isPresent
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => setSessionMarks({ ...sessionMarks, [sid]: 'A' })}
                      className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                        !isPresent
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowTakeAttendanceModal(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Submit Session Record
            </button>
          </div>
        </form>
      </Modal>

      {/* ================= MODAL: SETTINGS ================= */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Attendance Policy & Notification Thresholds"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Minimum Attendance Threshold (%)</label>
            <input
              type="number"
              min="50"
              max="95"
              value={minThreshold}
              onChange={(e) => setMinThreshold(parseInt(e.target.value) || 75)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Standard SPPU university mandate is 75%.</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Automatic Guardian Alerts</span>
              <span className="text-slate-500 text-[11px]">Notify parents when attendance drops below threshold</span>
            </div>
            <input
              type="checkbox"
              checked={alertGuardians}
              onChange={(e) => setAlertGuardians(e.target.checked)}
              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setShowSettingsModal(false);
                success('Attendance threshold configuration saved.');
              }}
              className="px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
