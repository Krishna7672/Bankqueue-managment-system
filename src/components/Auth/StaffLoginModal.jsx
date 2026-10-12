import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  UserCheck, 
  ShieldCheck, 
  AlertCircle, 
  KeyRound, 
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import { SbiLogo } from '../SbiLogo';

export const StaffLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const { officers } = useQueue();
  const [activeRole, setActiveRole] = useState('officer'); // 'officer' or 'admin'
  const [selectedOfficerId, setSelectedOfficerId] = useState(officers[2]?.id || 'SBI-74103'); // Mr. Rahul Patil
  const [pin, setPin] = useState('1234');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (activeRole === 'officer') {
      if (!pin) {
        setError('Please enter 4-digit employee PIN');
        return;
      }
      const officer = officers.find(o => o.id === selectedOfficerId);
      onSuccess({
        role: 'staff',
        officer: officer || officers[0]
      });
      onClose();
    } else {
      if (adminPassword !== 'admin123') {
        setError('Invalid Branch Manager password. Use default: admin123');
        return;
      }
      onSuccess({
        role: 'admin',
        officer: null
      });
      onClose();
    }
  };

  const handleQuickDemoLogin = (role, offId = null) => {
    if (role === 'staff') {
      const off = officers.find(o => o.id === (offId || 'SBI-74103'));
      onSuccess({ role: 'staff', officer: off || officers[0] });
    } else {
      onSuccess({ role: 'admin', officer: null });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#140F3E]/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-[#292075] text-white px-6 py-5 flex items-center justify-between border-b-2 border-[#00B5EF]">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-full shadow-xs">
              <SbiLogo className="w-8 h-8" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#00B5EF] tracking-wider uppercase">
                SBI Official Access Portal
              </div>
              <h3 className="text-base font-black tracking-tight leading-tight">
                Staff & Admin Login (कर्मचारी प्रवेश)
              </h3>
              <p className="text-[10px] text-slate-300">
                Restricted to authorized State Bank of India branch personnel
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveRole('officer'); setError(''); }}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeRole === 'officer'
                ? 'bg-white text-[#292075] shadow-xs'
                : 'text-slate-600 hover:text-[#292075]'
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#00B5EF]" />
            <span>Counter Officer (SWO)</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveRole('admin'); setError(''); }}
            className={`py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
              activeRole === 'admin'
                ? 'bg-white text-[#292075] shadow-xs'
                : 'text-slate-600 hover:text-[#292075]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#00B5EF]" />
            <span>Branch Manager (Admin)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeRole === 'officer' ? (
            /* Officer Login Fields */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Select Officer Profile / Employee ID
                </label>
                <select
                  value={selectedOfficerId}
                  onChange={(e) => setSelectedOfficerId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B5EF]/30"
                >
                  {officers.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.id}) — {o.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Employee 4-Digit Security PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN (default: 1234)"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B5EF]/30"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Default demo PIN: <strong>1234</strong></span>
              </div>
            </div>
          ) : (
            /* Admin Login Fields */
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Branch Administrator ID
                </label>
                <input
                  type="text"
                  readOnly
                  value="branch.manager.00402@sbi.co.in"
                  className="w-full text-xs p-2.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Admin password (default: admin123)"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B5EF]/30"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Default demo password: <strong>admin123</strong></span>
              </div>
            </div>
          )}

          {/* Quick Demo 1-Click Access Buttons */}
          <div className="p-3 bg-[#E6F8FE]/60 border border-[#00B5EF]/30 rounded-xl text-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#0083ca] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick 1-Click Demo Sign-in:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('staff', 'SBI-74103')}
                className="py-1.5 px-2 bg-white text-[#292075] hover:bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-bold shadow-2xs"
              >
                Sign in as Officer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-1.5 px-2 bg-[#292075] text-white hover:bg-[#1A1450] rounded-lg text-[11px] font-bold shadow-2xs"
              >
                Sign in as Admin
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#292075] hover:bg-[#1A1450] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Authenticate & Enter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffLoginModal;
