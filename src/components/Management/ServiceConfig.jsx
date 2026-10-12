import React, { useState } from 'react';
import { 
  Layers, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Save, 
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import { ServiceIcon } from '../ServiceIcon';

export const ServiceConfig = () => {
  const { services, updateService } = useQueue();
  const [editingService, setEditingService] = useState(null);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    name: '',
    prefix: '',
    category: '',
    avgMinutes: 5,
    description: '',
    active: true
  });

  const handleEdit = (service) => {
    setEditingService(service);
    setForm({
      name: service.name,
      prefix: service.prefix,
      category: service.category,
      avgMinutes: service.avgMinutes,
      description: service.description,
      active: service.active
    });
  };

  const handleSave = () => {
    if (!editingService) return;
    updateService(editingService.id, {
      name: form.name,
      prefix: form.prefix.toUpperCase(),
      category: form.category,
      avgMinutes: Number(form.avgMinutes),
      description: form.description,
      active: form.active
    });
    setEditingService(null);
  };

  const filtered = services.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-navy-950">Banking Services & Queue Configuration</h2>
          <p className="text-xs text-slate-500">
            Define token prefixes, estimated handling durations, and queue categories
          </p>
        </div>

        <div className="relative min-w-[220px]">
          <input
            type="text"
            placeholder="Search service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-3 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Prefix</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Avg Wait Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(service => (
                <tr key={service.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <ServiceIcon name={service.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <strong className="text-navy-950 block">{service.name}</strong>
                        <span className="text-[11px] text-slate-400 line-clamp-1">{service.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {service.prefix}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{service.category}</td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    ~{service.avgMinutes} mins
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      service.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {service.active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleEdit(service)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-xs transition-colors inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-navy-950">
                Edit Service: {editingService.name}
              </h3>
              <button 
                onClick={() => setEditingService(null)} 
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Token Prefix Letter</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={form.prefix}
                    onChange={(e) => setForm({ ...form, prefix: e.target.value })}
                    className="w-full text-xs p-2 font-mono uppercase bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Avg Service Time (mins)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={form.avgMinutes}
                    onChange={(e) => setForm({ ...form, avgMinutes: e.target.value })}
                    className="w-full text-xs p-2 font-mono bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="svc-active"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="svc-active" className="text-xs font-bold text-slate-700">
                  Service Active (Available on Kiosk)
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setEditingService(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-xs font-bold bg-navy-900 text-white rounded-lg hover:bg-navy-800 flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceConfig;
