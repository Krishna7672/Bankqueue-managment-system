import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3, 
  Layers, 
  UserCheck, 
  Settings, 
  Filter, 
  Download, 
  RotateCcw,
  ShieldCheck,
  Building2,
  Calendar,
  Volume2
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';

export const AdminDashboard = ({ onNavigateSubTab }) => {
  const { 
    tokens, 
    counters, 
    officers, 
    services, 
    settings, 
    setSettings, 
    resetToDemoData 
  } = useQueue();

  const [dateFilter, setDateFilter] = useState('Today');

  // Compute live KPIs
  const totalTokens = tokens.length;
  const waitingTokens = tokens.filter(t => t.status === 'waiting');
  const servingTokens = tokens.filter(t => t.status === 'serving');
  const completedTokens = tokens.filter(t => t.status === 'completed');
  const skippedOrCancelled = tokens.filter(t => t.status === 'skipped' || t.status === 'cancelled' || t.status === 'noshow');

  // Average wait time calculation
  const avgWaitMins = waitingTokens.length > 0 
    ? Math.round(waitingTokens.reduce((acc, t) => acc + (t.estimatedMinutes || 8), 0) / waitingTokens.length)
    : 8;

  // Average service time
  const avgServiceMins = 11.2;

  // Workload by Service Category
  const categoryWorkload = {};
  tokens.forEach(t => {
    const s = services.find(serv => serv.id === t.serviceId);
    const cat = s ? s.category : 'General';
    categoryWorkload[cat] = (categoryWorkload[cat] || 0) + 1;
  });

  // Hourly traffic distribution mock for today (9am to 4pm)
  const hourlyTraffic = [
    { hour: '09:00', count: 18 },
    { hour: '10:00', count: 32 },
    { hour: '11:00', count: 48 },
    { hour: '12:00', count: 42 },
    { hour: '13:00', count: 25 },
    { hour: '14:00', count: 36 },
    { hour: '15:00', count: 30 },
    { hour: '16:00', count: 14 }
  ];

  const maxTraffic = Math.max(...hourlyTraffic.map(h => h.count));

  // Export CSV Report of tokens
  const handleExportCSV = () => {
    let csv = 'Token,Customer,Mobile,Service,Category,Counter,Officer,Status,CreatedAt\n';
    tokens.forEach(t => {
      csv += `"${t.tokenNumber}","${t.customerName}","${t.mobile}","${t.serviceName}","${t.category}","Counter ${t.counterNumber}","${t.officerName}","${t.status}","${t.createdAt}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SBI_Queue_Report_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Filter Row */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#1A1450]">
            SBI Operations & Queue Intelligence (प्रबंधन पोर्टल)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time branch throughput, counter allocation, and audit monitoring
          </p>
        </div>

        {/* Date Filter & Export Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
            {['Today', 'Yesterday', 'Past 7 Days'].map(filter => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  dateFilter === filter 
                    ? 'bg-white text-[#1A1450] font-bold shadow-2xs' 
                    : 'text-slate-600 hover:text-[#1A1450]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#292075] hover:bg-[#1A1450] text-white rounded-xl text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95"
            title="Download full token records as CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-[#00B5EF]" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS CARDS (Section 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Tokens */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Total Generated</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-navy-950">{totalTokens}</span>
            <span className="text-[10px] text-emerald-600 font-bold">+12% vs avg</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Tokens today</span>
        </div>

        {/* Currently Waiting */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-amber-600 block tracking-wider">Currently Waiting</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-amber-600">{waitingTokens.length}</span>
            <span className="text-[10px] text-slate-400 font-medium">in queue</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Pending turns</span>
        </div>

        {/* Being Served */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-emerald-600 block tracking-wider">Being Served</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-emerald-600">{servingTokens.length}</span>
            <span className="text-[10px] text-emerald-700 font-bold">at counters</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active service</span>
        </div>

        {/* Completed Services */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-blue-600 block tracking-wider">Completed</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-blue-600">{completedTokens.length}</span>
            <span className="text-[10px] text-slate-400 font-medium">processed</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Resolved tickets</span>
        </div>

        {/* Skipped / Cancelled */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-rose-500 block tracking-wider">Skipped / No-Show</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-rose-500">{skippedOrCancelled.length}</span>
            <span className="text-[10px] text-slate-400 font-medium">unattended</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Dropped turns</span>
        </div>

        {/* Average Wait Time */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Avg Waiting Time</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black font-mono text-navy-950">{avgWaitMins}</span>
            <span className="text-xs text-slate-500 font-medium">mins</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Target &lt; 15 mins</span>
        </div>
      </div>

      {/* CHARTS ROW: Hourly Traffic & Service Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly Peak Volume Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-navy-950">Hourly Customer Inflow Traffic</h3>
              <p className="text-xs text-slate-500">Distribution of customer visits throughout banking hours</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Peak: 11:00 AM
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-48 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-200">
            {hourlyTraffic.map((item) => {
              const heightPercent = Math.round((item.count / maxTraffic) * 100);
              const isPeak = item.count === maxTraffic;
              return (
                <div key={item.hour} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-lg transition-all ${
                      isPeak 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-slate-200 hover:bg-blue-300'
                    }`}
                  />
                  <span className="text-[10px] font-mono text-slate-500">{item.hour}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-3 text-xs text-slate-500">
            <span>Branch Operating Hours: 09:00 AM - 04:30 PM</span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-blue-600"></span> Peak Traffic
              <span className="w-2.5 h-2.5 rounded bg-slate-200 ml-2"></span> Normal Load
            </span>
          </div>
        </div>

        {/* Workload by Service Category */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-navy-950 mb-1">Queue by Category</h3>
            <p className="text-xs text-slate-500 mb-4">Volume breakdown by banking domain</p>

            <div className="space-y-3">
              {Object.entries(categoryWorkload).map(([cat, count]) => {
                const percent = Math.round((count / totalTokens) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{cat}</span>
                      <span className="font-mono text-slate-500">{count} ({percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${percent}%` }}
                        className="h-full bg-blue-600 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Updated in real-time as tokens are generated.
          </div>
        </div>
      </div>

      {/* COUNTER & OFFICER WORKLOAD SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Counter Workload */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-navy-950">Counter Status & Workload</h3>
              <p className="text-xs text-slate-500">Current availability & total customers served</p>
            </div>
            <button
              onClick={() => onNavigateSubTab('counters')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Manage Counters →
            </button>
          </div>

          <div className="space-y-2.5">
            {counters.map(c => {
              const off = officers.find(o => o.id === c.officerId);
              return (
                <div key={c.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-navy-900 text-sky-400 font-mono font-bold flex items-center justify-center">
                      {c.number}
                    </span>
                    <div>
                      <strong className="text-slate-800">{c.name}</strong> • <span className="text-slate-500">{off?.name}</span>
                      <div className="text-[11px] text-slate-400">{c.type}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900">{c.totalServed} Served</span>
                    <span className={`block text-[10px] font-bold uppercase ${
                      c.status === 'open' ? 'text-emerald-600' :
                      c.status === 'busy' ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Officer Performance Leaderboard */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-navy-950">Officer Performance Statistics</h3>
              <p className="text-xs text-slate-500">Daily throughput and handling efficiency</p>
            </div>
            <button
              onClick={() => onNavigateSubTab('counters')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View Roster →
            </button>
          </div>

          <div className="space-y-3">
            {officers.map(off => {
              return (
                <div key={off.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={off.avatar}
                      alt={off.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <strong className="text-slate-800">{off.name}</strong>
                      <div className="text-[11px] text-slate-500">{off.role}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-navy-950 block">{off.servedToday} customers</span>
                    <span className="text-[11px] text-slate-500 font-mono">Avg: ~{off.avgServiceTime}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* QUEUE POLICY & PRIORITY CONFIGURATION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-navy-950 mb-1">Queue Rules & Assistive Policies</h3>
        <p className="text-xs text-slate-500 mb-4">Configurable priority rules for senior citizens and assistive customers</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Elderly Priority Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-navy-950">Senior Citizen Priority</span>
                <input
                  type="checkbox"
                  checked={settings.priorityElderly}
                  onChange={(e) => setSettings({ ...settings, priorityElderly: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Prioritizes senior citizens (60+) to the top of compatible counter queues.
              </p>
            </div>
            <span className={`text-[10px] font-bold mt-2 ${settings.priorityElderly ? 'text-emerald-600' : 'text-slate-400'}`}>
              {settings.priorityElderly ? 'Rule Active' : 'Standard FIFO'}
            </span>
          </div>

          {/* PwD Priority Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-navy-950">Disability (PwD) Priority</span>
                <input
                  type="checkbox"
                  checked={settings.priorityPwD}
                  onChange={(e) => setSettings({ ...settings, priorityPwD: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Assigns highest tier queue weighting and accessible counters.
              </p>
            </div>
            <span className={`text-[10px] font-bold mt-2 ${settings.priorityPwD ? 'text-emerald-600' : 'text-slate-400'}`}>
              {settings.priorityPwD ? 'Rule Active' : 'Standard FIFO'}
            </span>
          </div>

          {/* Audio Chimes Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-navy-950">Loudspeaker Chimes</span>
                <input
                  type="checkbox"
                  checked={settings.soundChimes}
                  onChange={(e) => setSettings({ ...settings, soundChimes: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Melodic dual-tone chime when token is called or recalled.
              </p>
            </div>
            <span className={`text-[10px] font-bold mt-2 ${settings.soundChimes ? 'text-emerald-600' : 'text-slate-400'}`}>
              {settings.soundChimes ? 'Chime Enabled' : 'Muted'}
            </span>
          </div>

          {/* Voice Announcements Toggle */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-navy-950">Voice Announcement</span>
                <input
                  type="checkbox"
                  checked={settings.audioAnnouncements}
                  onChange={(e) => setSettings({ ...settings, audioAnnouncements: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Synthesized voice reading token, counter and officer over speakers.
              </p>
            </div>
            <span className={`text-[10px] font-bold mt-2 ${settings.audioAnnouncements ? 'text-emerald-600' : 'text-slate-400'}`}>
              {settings.audioAnnouncements ? 'Voice Active' : 'Voice Off'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
