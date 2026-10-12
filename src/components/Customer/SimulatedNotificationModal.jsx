import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Share2, 
  Check, 
  CheckCheck, 
  Building2, 
  Phone, 
  ShieldCheck,
  Send,
  Sparkles
} from 'lucide-react';

export const SimulatedNotificationModal = ({ isOpen, onClose, type = 'sms', token }) => {
  const [activeTab, setActiveTab] = useState(type);

  if (!isOpen || !token) return null;

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200">
        
        {/* Header Bar */}
        <div className="bg-navy-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Simulation</span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs font-semibold text-white">Live Customer Alert</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (SMS vs WhatsApp) */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('sms')}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'sms'
                ? 'bg-white text-navy-950 shadow-xs'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>SMS View</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'whatsapp'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp View</span>
          </button>
        </div>

        {/* Simulated Phone Screen Content */}
        <div className="p-5 bg-slate-50 min-h-[360px] flex flex-col justify-between">
          {activeTab === 'sms' ? (
            /* SMS Mockup */
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#E6F8FE] text-[#292075] mx-auto flex items-center justify-center font-bold text-sm border border-[#00B5EF]/40 shadow-xs">
                  SBI
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-1">SBIBNK (SBI INB)</h4>
                <p className="text-[10px] text-slate-500 font-mono">Official Bank SMS • Today {currentTime}</p>
              </div>

              {/* SMS Bubble */}
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-xs text-xs text-slate-800 space-y-2 leading-relaxed">
                <p>
                  <strong>Dear Customer {token.customerName},</strong>
                </p>
                <p>
                  Your SBI Grahak Mitra e-Token <strong className="text-[#292075] font-mono text-sm">[{token.tokenNumber}]</strong> for <em>{token.serviceName}</em> has been registered at Branch #00402.
                </p>
                <div className="bg-[#E6F8FE] border border-[#00B5EF]/40 rounded-lg p-2.5 text-[11px] text-[#1A1450] space-y-1 font-mono">
                  <div>Counter / काउंटर: <strong>Counter {token.counterNumber}</strong></div>
                  <div>Officer / अधिकारी: <strong>{token.officerName}</strong></div>
                  <div>Status / स्थिति: <strong>{token.status.toUpperCase()}</strong></div>
                  <div>Est. Wait / अनुमानित समय: <strong>~{token.estimatedMinutes} Mins</strong></div>
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  Please proceed to the counter when called. SBI NEVER asks for OTP, PIN or CVV. - State Bank of India
                </p>
              </div>
            </div>
          ) : (
            /* WhatsApp Mockup */
            <div className="space-y-3">
              {/* WhatsApp Sender Bar */}
              <div className="bg-emerald-700 text-white p-3 rounded-xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white text-[#292075] flex items-center justify-center font-bold text-xs shadow-xs">
                    SBI
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="text-xs font-bold">State Bank of India</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300 text-emerald-800" />
                    </div>
                    <span className="text-[10px] text-emerald-200">Official SBI Banking Channel</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Message Bubble */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-800 space-y-2 shadow-xs">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-1.5 text-[11px]">
                  <span className="font-bold text-emerald-950">SBI GRAHAK MITRA e-TOKEN</span>
                  <span className="text-[10px] text-slate-500 font-mono">{currentTime}</span>
                </div>

                <p>Namaste <strong>{token.customerName}</strong>,</p>
                <p>
                  You are in queue for <strong>{token.serviceName}</strong> at SBI Main Branch, Connaught Place (00402).
                </p>
                <div className="bg-white rounded-lg p-2.5 border border-emerald-200 text-[11px] space-y-1">
                  <div>🎫 Token: <span className="font-bold font-mono text-emerald-900 text-sm">{token.tokenNumber}</span></div>
                  <div>🏛 Counter: <span className="font-bold">Counter {token.counterNumber}</span></div>
                  <div>👤 Officer: <span className="font-bold">{token.officerName}</span></div>
                  <div>⏳ Customers Ahead: <span className="font-bold">{token.customersAhead}</span></div>
                </div>
                <p className="text-[10px] text-slate-500">
                  🔔 We will notify you again as your turn approaches. Stay safe!
                </p>
                <div className="flex justify-end text-[10px] text-emerald-700 font-mono items-center gap-1 pt-1">
                  <span>{currentTime}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Close Button */}
          <div className="pt-3 border-t border-slate-200 text-center">
            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatedNotificationModal;
