import React, { useState, useEffect, useMemo } from 'react';
import { useExamAdmin } from '../../../context/ExamAdminContext';
import { useToast } from '../../../context/ToastContext';
import { ExamAdminHeader } from '../components/ExamAdminHeader';
import {
  FileCheck2,
  Save,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Award
} from 'lucide-react';

export function InternalMarksModule({ onNavigateTab }) {
  const { students, batchSaveInternalMarks } = useExamAdmin();
  const { success, error, info } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('SE');
  const [selectedSubject, setSelectedSubject] = useState('Data Structures');
  const [selectedTest, setSelectedTest] = useState('Test 1 (20 Marks)');

  // Local editable marks state map { [prn]: marks }
  const [marksMap, setMarksMap] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Initialize or reset marks when class/subject changes
  useEffect(() => {
    const initialMap = {};
    students.forEach((st) => {
      initialMap[st.prn] = st.internal || 18;
    });
    setMarksMap(initialMap);
    setIsDirty(false);
  }, [students, selectedClass, selectedSubject, selectedTest]);

  const classStudents = useMemo(() => {
    return students.filter((s) => {
      const matchClass = selectedClass === 'All Classes' || s.class === selectedClass;
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.prn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchSearch;
    });
  }, [students, selectedClass, searchQuery]);

  const handleMarkChange = (prn, value) => {
    const valNum = Number(value);
    if (value !== '' && (valNum < 0 || valNum > 20)) {
      error('Marks must be between 0 and 20 for this test.');
      return;
    }
    setMarksMap((prev) => ({ ...prev, [prn]: value }));
    setIsDirty(true);
  };

  const handleSaveAll = () => {
    const marksList = classStudents.map((st) => ({
      prn: st.prn,
      marks: marksMap[st.prn] !== undefined ? marksMap[st.prn] : st.internal,
    }));
    batchSaveInternalMarks(marksList, selectedSubject, selectedTest);
    setIsDirty(false);
  };

  // Metrics
  const validMarks = classStudents
    .map((st) => Number(marksMap[st.prn] || st.internal))
    .filter((m) => !isNaN(m));
  const classAvg = validMarks.length > 0 ? (validMarks.reduce((a, b) => a + b, 0) / validMarks.length).toFixed(1) : '0';
  const highestMark = validMarks.length > 0 ? Math.max(...validMarks) : 0;

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. Header */}
      <ExamAdminHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search students in internal marksheet..."
        onNavigateTab={onNavigateTab}
      />

      {/* 2. Main Page Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-2xs">
        {/* Title and Top Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Internal Marks</h1>
            <p className="text-xs text-slate-500">Enter and manage internal assessment marks</p>
          </div>
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#6B46FE] hover:bg-[#5B36EE] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
          >
            <Save className="w-4 h-4" />
            Save Marks
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
              <option value="SE">SE (Second Year)</option>
              <option value="TE">TE (Third Year)</option>
              <option value="BE">BE (Final Year)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="Data Structures">Data Structures</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="Database Management">Database Management</option>
              <option value="Web Technology">Web Technology</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select Test</label>
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            >
              <option value="Test 1 (20 Marks)">Test 1 (20 Marks)</option>
              <option value="Test 2 (20 Marks)">Test 2 (20 Marks)</option>
              <option value="Continuous Assessment (25 Marks)">Continuous Assessment (25 Marks)</option>
            </select>
          </div>
        </div>

        {/* Quick summary mini-pills */}
        <div className="flex items-center gap-3 py-1">
          <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-900 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            Class Average: {classAvg} / 20
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            Highest Score: {highestMark} / 20
          </div>
          {isDirty && (
            <span className="text-[11px] font-bold text-amber-600 animate-pulse ml-auto">
              ● Unsaved changes present. Click 'Save Marks' to commit.
            </span>
          )}
        </div>

        {/* Marks Table */}
        <div className="overflow-x-auto border border-slate-200/90 rounded-xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">PRN</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-center">Marks (20)</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((st) => {
                const currentVal = marksMap[st.prn] !== undefined ? marksMap[st.prn] : st.internal;
                return (
                  <tr key={st.prn} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{st.prn}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{st.name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{st.class}</td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={currentVal}
                        onChange={(e) => handleMarkChange(st.prn, e.target.value)}
                        className="w-16 px-2 py-1 text-center font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/30 focus:border-indigo-600"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Submitted
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
