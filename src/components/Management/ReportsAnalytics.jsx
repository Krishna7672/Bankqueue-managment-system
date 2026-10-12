import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';

export const ReportsAnalytics = () => {
  const { tokens } = useQueue();
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = tokens.filter(t => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesSearch = t.tokenNumber.toLowerCase().includes(search.toLowerCase()) ||
                          t.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          t.serviceName.toLowerCase().includes(search.toLowerCase()) ||
                          t.mobile.includes(search);
    return matchesStatus && matchesSearch;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tokens, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `apex_bank_tokens_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-navy-950">Queue History & Audit Reports</h2>
          <p className="text-xs text-slate-500">
            Comprehensive audit record of all tokens, waiting durations, and counter routing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Audit</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'waiting', 'serving', 'completed', 'skipped', 'noshow', 'cancelled'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                filterStatus === st 
                  ? 'bg-navy-900 text-white shadow-xs' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search token, name, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Report Records Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Counter & Officer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(tok => {
                const createdTime = new Date(tok.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const calledTime = tok.calledAt ? new Date(tok.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
                const completedTime = tok.completedAt ? new Date(tok.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

                return (
                  <tr key={tok.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-sm text-navy-950 block">
                        {tok.tokenNumber}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        tok.category === 'Senior Citizen' ? 'bg-emerald-100 text-emerald-800' :
                        tok.category === 'Person with Disability' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {tok.category}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <strong className="text-slate-900 block">{tok.customerName}</strong>
                      <span className="text-[11px] font-mono text-slate-500">
                        +91 {tok.mobile.slice(0, 2)}***{tok.mobile.slice(-4)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-medium block">{tok.serviceName}</span>
                      {tok.notes && (
                        <span className="text-[10px] text-slate-400 line-clamp-1 italic">
                          "{tok.notes}"
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">
                        Counter {tok.counterNumber}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {tok.officerName}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        tok.status === 'serving' ? 'bg-emerald-100 text-emerald-800 animate-pulse' :
                        tok.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        tok.status === 'waiting' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {tok.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      <div>Issued: {createdTime}</div>
                      {calledTime && <div>Called: {calledTime}</div>}
                      {completedTime && <div className="text-emerald-700 font-semibold">Done: {completedTime}</div>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-slate-400 text-xs">
              No matching token records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
