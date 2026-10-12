import React, { useState } from 'react';
import { 
  BarChart3, 
  Building2, 
  Layers, 
  FileSpreadsheet, 
  ShieldCheck, 
  Lock,
  LogOut
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { CounterOfficerManagement } from '../Management/CounterOfficerManagement';
import { ServiceConfig } from '../Management/ServiceConfig';
import { ReportsAnalytics } from '../Management/ReportsAnalytics';

export const AdminPortal = () => {
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const subTabs = [
    { id: 'overview', label: 'Operations Overview', icon: BarChart3 },
    { id: 'counters', label: 'Counters & Officers', icon: Building2 },
    { id: 'services', label: 'Service Configuration', icon: Layers },
    { id: 'reports', label: 'Audit & Reports', icon: FileSpreadsheet },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Admin Sub-Navigation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xs flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5">
          {subTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center gap-2 pr-2 text-xs font-medium text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Role: System Administrator</span>
        </div>
      </div>

      {/* Dynamic Content */}
      {activeSubTab === 'overview' && (
        <AdminDashboard onNavigateSubTab={(tab) => setActiveSubTab(tab)} />
      )}
      {activeSubTab === 'counters' && <CounterOfficerManagement />}
      {activeSubTab === 'services' && <ServiceConfig />}
      {activeSubTab === 'reports' && <ReportsAnalytics />}
    </div>
  );
};

export default AdminPortal;
