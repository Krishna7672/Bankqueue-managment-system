import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  PauseCircle, 
  Edit3, 
  Plus, 
  ShieldCheck, 
  Layers, 
  User, 
  Save, 
  RotateCcw
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import { ServiceIcon } from '../ServiceIcon';

export const CounterOfficerManagement = () => {
  const { counters, officers, services, updateCounter, logActivity } = useQueue();
  const [editingCounter, setEditingCounter] = useState(null);

  // Modal form state
  const [modalForm, setModalForm] = useState({
    name: '',
    type: '',
    officerId: '',
    status: 'open',
    assignedServices: []
  });

  const handleOpenEdit = (counter) => {
    setEditingCounter(counter);
    setModalForm({
      name: counter.name,
      type: counter.type,
      officerId: counter.officerId,
      status: counter.status,
      assignedServices: [...counter.assignedServices]
    });
  };

  const toggleServiceAssignment = (serviceId) => {
    setModalForm(prev => {
      const exists = prev.assignedServices.includes(serviceId);
      return {
        ...prev,
        assignedServices: exists
          ? prev.assignedServices.filter(id => id !== serviceId)
          : [...prev.assignedServices, serviceId]
      };
    });
  };

  const handleSaveCounter = () => {
    if (!editingCounter) return;

    updateCounter(editingCounter.id, {
      name: modalForm.name,
      type: modalForm.type,
      officerId: modalForm.officerId,
      status: modalForm.status,
      assignedServices: modalForm.assignedServices
    });

    setEditingCounter(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-navy-950">Counter & Officer Management</h2>
          <p className="text-xs text-slate-500">
            Configure counter service routing, assign bank officers, and control availability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            {counters.length} Active Bank Counters
          </span>
        </div>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {counters.map((counter) => {
          const officer = officers.find(o => o.id === counter.officerId);
          const supportedServicesList = services.filter(s => counter.assignedServices.includes(s.id));

          return (
            <div
              key={counter.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Counter Header & Status Pill */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-navy-900 text-sky-400 font-mono font-bold flex items-center justify-center text-sm shadow-xs">
                      {counter.number}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-navy-950">{counter.name}</h3>
                      <p className="text-[11px] text-slate-500">{counter.type}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    counter.status === 'open' ? 'bg-emerald-100 text-emerald-800' :
                    counter.status === 'busy' ? 'bg-amber-100 text-amber-800' :
                    counter.status === 'paused' ? 'bg-purple-100 text-purple-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {counter.status}
                  </span>
                </div>

                {/* Assigned Officer Card */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-3 mb-3">
                  <img
                    src={officer?.avatar}
                    alt={officer?.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Officer</span>
                    <strong className="text-xs text-navy-950">{officer?.name || 'Unassigned'}</strong>
                    <p className="text-[10px] text-slate-500 font-mono">ID: {officer?.id || 'N/A'} • {officer?.role}</p>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs mb-3">
                  <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100">
                    <span className="text-[10px] text-slate-500 block">Current Token</span>
                    <strong className="text-navy-950 font-mono text-sm">
                      {counter.currentToken || 'None'}
                    </strong>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100">
                    <span className="text-[10px] text-slate-500 block">Served Today</span>
                    <strong className="text-navy-950 font-mono text-sm">
                      {counter.totalServed}
                    </strong>
                  </div>
                </div>

                {/* Assigned Services Pills */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Assigned Services ({supportedServicesList.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {supportedServicesList.map(s => (
                      <span
                        key={s.id}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {s.name}
                      </span>
                    ))}
                    {supportedServicesList.length === 0 && (
                      <span className="text-[11px] text-slate-400 italic">All bank services allowed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(counter)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Configuration</span>
                </button>

                <button
                  onClick={() => {
                    const newStatus = counter.status === 'closed' ? 'open' : 'closed';
                    updateCounter(counter.id, { status: newStatus });
                  }}
                  className={`text-xs font-semibold ${
                    counter.status === 'closed' ? 'text-emerald-600 hover:underline' : 'text-rose-600 hover:underline'
                  }`}
                >
                  {counter.status === 'closed' ? 'Re-open Counter' : 'Close Counter'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* OFFICER ROSTER TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-navy-950 mb-1">Bank Officer Directory & Work Roster</h3>
        <p className="text-xs text-slate-500 mb-4">Staff details, current workstation, and today's throughput</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <th className="pb-2.5">Officer</th>
                <th className="pb-2.5">Officer ID</th>
                <th className="pb-2.5">Designation</th>
                <th className="pb-2.5">Current Counter</th>
                <th className="pb-2.5">Customers Served</th>
                <th className="pb-2.5">Avg Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {officers.map(officer => {
                const assignedCounter = counters.find(c => c.officerId === officer.id);
                return (
                  <tr key={officer.id} className="hover:bg-slate-50">
                    <td className="py-3 flex items-center gap-3">
                      <img
                        src={officer.avatar}
                        alt={officer.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                      <span className="font-bold text-navy-950">{officer.name}</span>
                    </td>
                    <td className="py-3 font-mono text-slate-600">{officer.id}</td>
                    <td className="py-3 text-slate-600">{officer.role}</td>
                    <td className="py-3">
                      {assignedCounter ? (
                        <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          Counter {assignedCounter.number} ({assignedCounter.name})
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Floating Staff</span>
                      )}
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-800">{officer.servedToday}</td>
                    <td className="py-3 font-mono text-slate-600">{officer.avgServiceTime} mins</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT COUNTER MODAL */}
      {editingCounter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">
                Configure Counter {editingCounter.number}
              </h3>
              <button
                onClick={() => setEditingCounter(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Counter Name</label>
                <input
                  type="text"
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Counter Category / Type</label>
                <input
                  type="text"
                  value={modalForm.type}
                  onChange={(e) => setModalForm({ ...modalForm, type: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Officer</label>
                <select
                  value={modalForm.officerId}
                  onChange={(e) => setModalForm({ ...modalForm, officerId: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  {officers.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Counter Status</label>
                <select
                  value={modalForm.status}
                  onChange={(e) => setModalForm({ ...modalForm, status: e.target.value })}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <option value="open">Open (Ready for customer)</option>
                  <option value="busy">Busy (Currently serving)</option>
                  <option value="paused">Paused / Break</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Assigned Banking Services (Toggle to allow/disallow)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {services.map(s => {
                    const isAssigned = modalForm.assignedServices.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleServiceAssignment(s.id)}
                        className={`p-2 rounded-lg text-xs cursor-pointer border flex items-center justify-between ${
                          isAssigned
                            ? 'bg-blue-600 text-white border-blue-700 font-semibold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate pr-1">{s.name}</span>
                        {isAssigned && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setEditingCounter(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCounter}
                className="px-4 py-2 text-xs font-bold bg-navy-900 text-white rounded-lg hover:bg-navy-800 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounterOfficerManagement;
