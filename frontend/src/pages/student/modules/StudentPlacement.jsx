import React, { useState } from 'react';
import { useStudent } from '../../../context/StudentContext';
import { useToast } from '../../../context/ToastContext';
import { StudentHeader } from '../components/StudentHeader';
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  FileText,
  ExternalLink,
  Award,
  Sparkles,
  Lock
} from 'lucide-react';

export function StudentPlacement({ onNavigateTab }) {
  const { opportunities, applyForPlacement } = useStudent();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState('opportunities'); // 'opportunities' | 'my_applications' | 'resources'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOpportunities = (opportunities || []).filter(
    (o) =>
      o.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.branches.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myApplications = (opportunities || []).filter((o) => o.applied);

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. TOP NAVBAR */}
      <StudentHeader onNavigateTab={onNavigateTab} />

      {/* 2. MODULE HEADER BANNER */}
      <div className="bg-white rounded-2xl px-5 py-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">Placement</h1>
            <p className="text-xs text-slate-500 font-medium">
              Explore opportunities, manage your profile and track applications
            </p>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION TABS & CONTENT */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="flex border-b border-slate-100 px-4 pt-2 gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'opportunities', label: 'Opportunities' },
            { id: 'my_applications', label: `My Applications (${myApplications.length})` },
            { id: 'resources', label: 'Placement Resources' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Opportunities List matching reference */}
        {activeTab === 'opportunities' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Latest Opportunities</h3>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {filteredOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Company Logo Badge */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center font-black text-xs text-blue-800 shrink-0 shadow-2xs">
                      {opp.company === 'TCS' ? (
                        <span className="font-extrabold text-blue-700">TCS</span>
                      ) : opp.company === 'Infosys' ? (
                        <span className="font-extrabold text-sky-700">Infosys</span>
                      ) : opp.company === 'Persistent Systems' ? (
                        <span className="font-extrabold text-orange-600">Persistent</span>
                      ) : (
                        opp.company.charAt(0)
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900">{opp.company}</h4>
                      </div>
                      <p className="text-xs font-bold text-slate-700">{opp.role}</p>
                      <p className="text-xs text-slate-500 font-medium">Eligible Branches: {opp.branches}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          {opp.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {opp.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          Apply by {opp.deadline}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {opp.applied ? (
                      <span className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => applyForPlacement(opp.id)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: My Applications */}
        {activeTab === 'my_applications' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Your Active Campus Placement Applications</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Job Role</th>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {myApplications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                        No applications submitted yet. Browse opportunities to apply.
                      </td>
                    </tr>
                  ) : (
                    myApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3.5 font-bold text-slate-900">{app.company}</td>
                        <td className="px-4 py-3.5 font-semibold text-slate-700">{app.role}</td>
                        <td className="px-4 py-3.5 font-mono font-bold text-emerald-600">{app.package}</td>
                        <td className="px-4 py-3.5 text-slate-500">{app.location}</td>
                        <td className="px-4 py-3.5 text-right">
                          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full font-bold text-[10px]">
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Placement Resources */}
        {activeTab === 'resources' && (
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Interview Preparation Kits & Study Material</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">TCS NQT Comprehensive Guide</h4>
                <p className="text-[11px] text-slate-500">Aptitude, reasoning, and coding questions kit.</p>
                <button
                  onClick={() => success('Downloading TCS NQT Guide...')}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 pt-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Infosys Technical Round Handbook</h4>
                <p className="text-[11px] text-slate-500">Data structures, DBMS, OOP, and Java concepts.</p>
                <button
                  onClick={() => success('Downloading Infosys Handbook...')}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 pt-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Standard Resume Template (ATS Friendly)</h4>
                <p className="text-[11px] text-slate-500">CollegeConnect verified placement CV format.</p>
                <button
                  onClick={() => success('Downloading Resume Template...')}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 pt-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download DOCX
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
