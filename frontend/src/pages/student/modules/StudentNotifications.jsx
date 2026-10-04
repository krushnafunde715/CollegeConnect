import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Search,
  Filter,
  Calendar,
  Briefcase,
  BookOpen,
  Shield,
  FileText,
  Clock,
  Sparkles,
  Inbox,
  X
} from 'lucide-react';
import { useStudent } from '../../../context/StudentContext';
import { StudentHeader } from '../components/StudentHeader';

export function StudentNotifications({ onNavigateTab }) {
  const {
    notifications,
    unreadCount,
    markAllNotificationsAsRead,
    toggleNotificationRead,
  } = useStudent();

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'Announcements', label: 'Announcements' },
    { id: 'Academic', label: 'Academic' },
    { id: 'Examination', label: 'Examination' },
    { id: 'Placement', label: 'Placement' },
    { id: 'System', label: 'System' },
  ];

  const filteredNotifications = (notifications || []).filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="space-y-4 font-sans text-slate-800">
      {/* 1. TOP NAVBAR */}
      <StudentHeader onNavigateTab={onNavigateTab} />

      {/* 2. MODULE HEADER BANNER */}
      <div className="bg-white rounded-2xl px-5 py-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">Notifications</h1>
            <p className="text-xs text-slate-500 font-medium">
              Stay updated with important announcements and activities
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* 3. NOTIFICATION LIST CARD & CATEGORY TABS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Category Tabs Header matching reference */}
        <div className="flex border-b border-slate-100 px-4 pt-2 gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'border-blue-600 text-blue-600 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List of Notification Items matching reference */}
        <div className="p-4 divide-y divide-slate-100">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No notifications in this category.
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedNotification(item);
                  if (item.unread) toggleNotificationRead(item.id);
                }}
                className={`py-3.5 px-3 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all hover:bg-slate-50/80 ${
                  item.unread ? 'bg-blue-50/20' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.dotColor || 'bg-blue-500'}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                      {item.isNew && (
                        <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-sm uppercase tracking-wider">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{item.desc}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-slate-400 font-mono">{item.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  {selectedNotification.category}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-1.5">{selectedNotification.title}</h3>
                <p className="text-xs text-slate-400 font-medium">Published: {selectedNotification.date}</p>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed p-4 bg-slate-50 rounded-2xl border border-slate-100">
              {selectedNotification.desc}
            </p>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setSelectedNotification(null)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
