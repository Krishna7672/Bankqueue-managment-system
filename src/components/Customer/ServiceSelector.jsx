import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Info,
  ShieldCheck,
  HeartHandshake,
  RotateCcw,
  Tag,
  Ticket
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import { ServiceIcon } from '../ServiceIcon';
import { SbiLogo } from '../SbiLogo';

export const ServiceSelector = ({ onSelectService, onGoToSupport, userToken, onViewToken }) => {
  const { services, tokens, counters } = useQueue();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Cash & Remittance',
    'Deposits & Accounts',
    'Digital & Cards',
    'Loans & Advances',
    'Pension & Priority',
    'Customer Support'
  ];

  // Count services in category
  const getCategoryCount = (cat) => {
    if (cat === 'All') return services.filter(s => s.active).length;
    return services.filter(s => s.active && s.category === cat).length;
  };

  // Filter services
  const filteredServices = services.filter(service => {
    if (!service.active) return false;
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Helper to count waiting tokens for a service
  const getQueueCountForService = (serviceId) => {
    return tokens.filter(t => t.serviceId === serviceId && t.status === 'waiting').length;
  };

  return (
    <div id="service-selector-section" className="space-y-6">
      {/* Active Token Notice Pill (if user has an active token in progress) */}
      {userToken && (
        <div className="bg-gradient-to-r from-[#E6F8FE] via-sky-50 to-indigo-50/60 border border-[#00B5EF]/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#292075] text-[#00B5EF] flex items-center justify-center shrink-0 shadow-xs">
              <Ticket className="w-5 h-5 text-[#00B5EF]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-[#1A1450]">Your Current Active Token:</span>
                <span className="font-mono text-xs font-black px-2 py-0.5 rounded-md bg-[#292075] text-white">
                  {userToken.tokenNumber}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                  userToken.status === 'serving' ? 'bg-emerald-100 text-emerald-800 animate-pulse' :
                  userToken.status === 'completed' ? 'bg-slate-200 text-slate-800' :
                  'bg-blue-100 text-[#0083ca]'
                }`}>
                  {userToken.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                Counter {userToken.counterNumber} • {userToken.serviceName} (~{userToken.estimatedMinutes}m wait)
              </p>
            </div>
          </div>
          <button
            onClick={onViewToken}
            className="px-3.5 py-1.5 bg-[#292075] hover:bg-[#1A1450] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 self-end sm:self-auto active:scale-95"
          >
            <span>View Token Pass</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Banner / Step 1 Header with SBI Royal Blue */}
      <div className="bg-gradient-to-r from-[#292075] via-[#1B1464] to-[#140F3E] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-[#00B5EF]/30">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-[#00B5EF]/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#00B5EF]/20 text-[#00B5EF] text-xs font-bold px-3 py-1 rounded-full border border-[#00B5EF]/40 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SBI Grahak Mitra • Step 1: Select Banking Service</span>
          </div>
          <div className="text-xs text-[#00B5EF] font-bold tracking-wider mb-1">
            भारतीय स्टेट बैंक • ई-टोकन सेवा
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Get Your SBI Queue e-Token (ई-टोकन प्राप्त करें)
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Select the branch service you require today. The system will assign you to the appropriate counter and officer with real-time queue position tracking.
          </p>

          {/* Quick Notice for Senior Citizens / Disability */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-[#00B5EF]" />
              <span>Priority Assisted Counters for Senior Citizens (Varishta) & Divyangjan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero credentials required (No PIN / OTP asked)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Support Callout Banner (CMS Grievance Portal) */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-amber-950">
                Facing Failed UPI, ATM Debit, or YONO / INB Access Lock?
              </h4>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 border border-amber-300">
                Priority CMS
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-0.5">
              Our dedicated CMS Grievance Redressal Desk at Counter 06 provides instant escalation for transaction reversals and disputed debits.
            </p>
          </div>
        </div>
        <button
          onClick={onGoToSupport}
          className="whitespace-nowrap px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-end sm:self-center"
        >
          <span>Open CMS Grievance Desk</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Pills with Item Count Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none w-full max-w-full">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = getCategoryCount(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-[#292075] text-white shadow-xs ring-1 ring-[#00B5EF]/40'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-[#292075]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-[#00B5EF] text-[#1A1450]' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-auto md:min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SBI service (e.g. Cash, KYC, YONO)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B5EF]/30 focus:border-[#00B5EF] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-0.5"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Services Grid with Interactive Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => {
          const queueCount = getQueueCountForService(service.id);

          return (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className="bg-white border border-slate-200 hover:border-[#00B5EF] rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative hover:-translate-y-1 active:scale-[0.99]"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#E6F8FE] text-[#0083ca] border border-[#00B5EF]/30 flex items-center justify-center group-hover:bg-[#292075] group-hover:text-[#00B5EF] transition-colors shadow-xs">
                    <ServiceIcon name={service.icon} className="w-5 h-5" />
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      Prefix: {service.prefix}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#292075] border border-blue-100">
                      ~{service.avgMinutes}m
                    </span>
                  </div>
                </div>

                {/* Service Details */}
                <h3 className="text-base font-bold text-[#1A1450] group-hover:text-[#292075] transition-colors mb-1">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                  {service.description}
                </p>
              </div>

              {/* Bottom Meta & Interactive Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-800">{queueCount}</span>
                  <span className="text-slate-400">waiting</span>
                </div>

                {/* Enhanced CTA Button Pill */}
                <span className="px-3 py-1.5 bg-[#E6F8FE] group-hover:bg-[#292075] text-[#0083ca] group-hover:text-white rounded-xl font-bold transition-all inline-flex items-center gap-1 shadow-2xs group-hover:shadow-xs">
                  <span>Get e-Token</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <p className="text-slate-500 text-sm font-medium">No SBI services match your search keyword "{searchQuery}".</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#292075] rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Search & Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;
