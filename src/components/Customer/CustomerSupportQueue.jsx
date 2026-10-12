import React, { useState } from 'react';
import { 
  LifeBuoy, 
  AlertCircle, 
  ArrowLeft, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { SUPPORT_ISSUES } from '../../data/initialData';
import { useQueue } from '../../context/QueueContext';
import { CustomerDetailsForm } from './CustomerDetailsForm';
import { ServiceIcon } from '../ServiceIcon';

export const CustomerSupportQueue = ({ onBack, onTokenGenerated }) => {
  const [selectedIssue, setSelectedIssue] = useState(null);

  if (selectedIssue) {
    // Adapt issue into service structure for the form
    const adaptedService = {
      id: selectedIssue.id,
      name: selectedIssue.title,
      prefix: selectedIssue.prefix || 'Q',
      category: 'Customer Support',
      avgMinutes: selectedIssue.avgMinutes || 12,
      description: selectedIssue.description,
      icon: 'LifeBuoy'
    };

    return (
      <CustomerDetailsForm
        selectedService={adaptedService}
        onBack={() => setSelectedIssue(null)}
        onTokenGenerated={onTokenGenerated}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-navy-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Banking Services</span>
        </button>

        <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>Priority Redressal Desk</span>
        </span>
      </div>

      {/* Hero Banner with SBI Deep Blue */}
      <div className="bg-gradient-to-r from-[#292075] via-[#1B1464] to-[#140F3E] text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-[#00B5EF]/30">
        <div className="max-w-2xl relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-[#00B5EF]/20 text-[#00B5EF] border border-[#00B5EF]/40 px-2.5 py-1 rounded-full mb-3 inline-block">
            SBI CMS • Customer Grievance & Technical Redressal
          </span>
          <div className="text-xs text-[#00B5EF] font-bold tracking-wider mb-1">
            भारतीय स्टेट बैंक • त्वरित शिकायत निवारण
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            What Banking Grievance Can We Resolve? (आपकी समस्या)
          </h1>
          <p className="text-slate-200 text-sm leading-relaxed">
            Support tokens are routed directly to Counter 06 (Branch Grahak Mitra & CMS Grievance Lead) with priority escalation for failed digital payments, ATM cash debits, and card protection.
          </p>
        </div>
      </div>

      {/* Support Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUPPORT_ISSUES.map((issue) => {
          return (
            <div
              key={issue.id}
              onClick={() => setSelectedIssue(issue)}
              className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <LifeBuoy className="w-5 h-5" />
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    issue.urgency === 'High' 
                      ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {issue.urgency} Urgency
                  </span>
                </div>

                <h3 className="text-base font-bold text-navy-950 group-hover:text-amber-700 transition-colors mb-1">
                  {issue.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {issue.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Avg Resolution ~{issue.avgMinutes}m</span>
                </span>

                <span className="text-amber-700 font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                  Resolve Issue <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerSupportQueue;
