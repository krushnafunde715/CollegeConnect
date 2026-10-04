import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { api } from '../api/client';
import { Mail, RefreshCw, ExternalLink, Key, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function DevMailboxModal({ isOpen, onClose, onNavigateVerify }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToast();

  const fetchOutbox = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/auth/dev/outbox');
      setMessages(res.data || []);
    } catch (err) {
      // Ignored if in prod or dev outbox disabled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOutbox();
    }
  }, [isOpen]);

  const handleVerifyDirectly = async (token) => {
    try {
      const res = await api.post('/auth/verify-email', { token });
      success(res.message || 'Email verified successfully!');
      fetchOutbox();
    } catch (err) {
      error(err.message || 'Verification failed');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Development Mailbox (Local Simulation)"
      subtitle="Captured emails and activation tokens generated without internet SMTP"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Real SMTP delivery is optional in local development. All dispatched verification and password reset emails are safely captured here.
            </span>
          </div>
          <button
            onClick={fetchOutbox}
            disabled={isLoading}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-amber-900 hover:bg-amber-100 font-medium transition-colors shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Mail className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-medium text-sm text-slate-600">No captured emails in outbox yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Add a student, provision an admin, or request a password reset to see captured messages here.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {messages.map((msg) => {
              const meta = msg.metadata || {};
              const isVerification = meta.type === 'email_verification';
              const isReset = meta.type === 'password_reset';

              return (
                <div
                  key={msg.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-indigo-950 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                          {isVerification ? 'Verification Link' : isReset ? 'Password Reset' : 'System Email'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{msg.subject}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        <span className="font-medium text-slate-500">Recipient:</span>{' '}
                        <span className="font-mono text-indigo-600">{msg.to}</span>
                      </p>
                    </div>

                    {meta.raw_token && (
                      <div className="flex flex-col gap-1.5 shrink-0 items-end">
                        {isVerification && (
                          <button
                            onClick={() => handleVerifyDirectly(meta.raw_token)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            1-Click Verify
                          </button>
                        )}
                        {isReset && onNavigateVerify && (
                          <button
                            onClick={() => {
                              onNavigateVerify(meta.raw_token, msg.to);
                              onClose();
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                          >
                            <Key className="w-3.5 h-3.5" />
                            Open Reset Page
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {meta.raw_token && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="text-slate-500 truncate max-w-md font-mono bg-slate-50 px-2 py-1 rounded">
                        Token: {meta.raw_token}
                      </div>
                      <span className="text-emerald-700 font-medium text-xs">Single-Use Hash Stored</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Close Mailbox
          </button>
        </div>
      </div>
    </Modal>
  );
}
