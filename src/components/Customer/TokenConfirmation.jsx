import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  Tv, 
  XCircle, 
  MessageSquare, 
  Phone, 
  Share2, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  QrCode,
  ArrowRight,
  Volume2,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import { soundService } from '../../services/soundAndSpeech';
import { SbiLogo } from '../SbiLogo';

export const TokenConfirmation = ({ 
  token, 
  onViewLiveQueue, 
  onNewToken, 
  onOpenSMSModal, 
  onOpenWhatsappModal 
}) => {
  const { cancelToken, counters, officers } = useQueue();
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!token) {
    return (
      <div className="max-w-md mx-auto text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-lg font-black text-[#1A1450]">No Active e-Token Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Please select an SBI banking service to generate your branch queue ticket.
        </p>
        <button
          onClick={onNewToken}
          className="px-6 py-3 rounded-xl bg-[#292075] text-white text-xs font-bold hover:bg-[#1A1450] transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-2 mx-auto"
        >
          <Sparkles className="w-4 h-4 text-[#00B5EF]" />
          <span>Select Banking Service</span>
        </button>
      </div>
    );
  }

  // Lookup current assigned counter & officer dynamically
  const assignedCounter = counters.find(c => c.id === token.counterId || c.number === token.counterNumber);
  const assignedOfficer = officers.find(o => o.id === (assignedCounter?.officerId || token.officerId));

  // Copy token number to clipboard
  const handleCopyToken = () => {
    navigator.clipboard.writeText(token.tokenNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Test Speech for this specific token
  const handlePlayVoice = () => {
    setIsSpeaking(true);
    soundService.announceToken(
      token.tokenNumber, 
      assignedCounter ? assignedCounter.number : token.counterNumber,
      assignedOfficer ? assignedOfficer.name : token.officerName
    );
    setTimeout(() => setIsSpeaking(false), 3000);
  };

  // Handle Print Token
  const handlePrint = () => {
    window.print();
  };

  // Handle Download Token
  const handleDownload = () => {
    const slipText = `
=============================================
         भारतीय स्टेट बैंक / STATE BANK OF INDIA
        SBI Main Branch, Connaught Place (00402)
         GRAHAK MITRA e-TOKEN / पर्ची
=============================================
TOKEN NO / टोकन:   ${token.tokenNumber}
STATUS / स्थिति:      ${token.status.toUpperCase()}
DATE & TIME:         ${new Date(token.createdAt).toLocaleString('en-IN')}

CUSTOMER NAME:       ${token.customerName}
CATEGORY:            ${token.category}
SERVICE / सेवा:       ${token.serviceName}
COUNTER / काउंटर:     Counter ${assignedCounter ? assignedCounter.number : token.counterNumber}
OFFICER / अधिकारी:    ${assignedOfficer ? assignedOfficer.name : token.officerName}

CUSTOMERS AHEAD:     ${token.customersAhead}
ESTIMATED WAIT:      ~${token.estimatedMinutes} Minutes
=============================================
* Counter & officer may be reassigned dynamically.
* सुरक्षा चेतावनी: बैंक कभी भी आपका OTP या PIN नहीं मांगता।
* Helpline: 1800 1234 / 1800 2100 (Toll Free)
=============================================
`;

    const blob = new Blob([slipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SBI_Token_${token.tokenNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCancel = () => {
    if (window.confirm(`Are you sure you want to cancel SBI token ${token.tokenNumber}? This will release your position in the queue.`)) {
      cancelToken(token.id);
    }
  };

  const formattedDate = new Date(token.createdAt).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = new Date(token.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Success Banner Notice with Clear Visual Status */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-emerald-950">
                e-Token Successfully Issued (टोकन जारी किया गया)
              </h4>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Confirmed
              </span>
            </div>
            <p className="text-xs text-emerald-800 mt-0.5">
              Your token is registered in the SBI Grahak Mitra Queue System. Please be seated in the branch lobby.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyToken}
          className="text-xs font-mono font-bold text-emerald-900 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0 hover:bg-emerald-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          title="Click to copy token number"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? 'Copied' : token.tokenNumber}</span>
        </button>
      </div>

      {/* Official SBI Digital Token Pass (Printable Area) */}
      <div 
        id="printable-token"
        className="bg-white border-2 border-slate-300 rounded-3xl overflow-hidden shadow-lg relative"
      >
        {/* Ticket Header with SBI Deep Navy */}
        <div className="bg-[#292075] text-white px-6 py-5 flex items-center justify-between border-b-2 border-[#00B5EF]">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full shadow-xs">
              <SbiLogo className="w-9 h-9" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#00B5EF] tracking-wider">
                भारतीय स्टेट बैंक
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                STATE BANK OF INDIA
              </h2>
              <p className="text-[10px] text-slate-300">
                SBI Branch #00402 (Connaught Place) • Grahak Mitra Token Pass
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-white/10 text-[#00B5EF] border border-[#00B5EF]/30">
              {token.category}
            </span>
            <p className="text-[11px] text-slate-300 mt-1 font-mono">{formattedDate}</p>
          </div>
        </div>

        {/* Big Token Number Display */}
        <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-[#E6F8FE]/40 to-white border-b border-dashed border-slate-300 relative">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
            आपका टोकन नंबर • YOUR QUEUE TOKEN NUMBER
          </span>
          <div className="my-2">
            <h1 className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-[#1A1450]">
              {token.tokenNumber}
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 mt-1 flex-wrap justify-center">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E6F8FE] text-[#0083ca] border border-[#00B5EF]/30">
              {token.serviceName}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              token.status === 'serving' ? 'bg-emerald-600 text-white animate-pulse' :
              token.status === 'completed' ? 'bg-slate-200 text-slate-800' :
              token.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
              'bg-amber-100 text-amber-900 border border-amber-300'
            }`}>
              Status: {token.status}
            </span>

            {/* Listen Audio Voice Button right on Token Slip */}
            <button
              onClick={handlePlayVoice}
              disabled={isSpeaking}
              className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-[#292075] border border-slate-200 transition-colors inline-flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="Test loud speaker announcement for this token"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-[#00B5EF] animate-ping' : 'text-[#292075]'}`} />
              <span>{isSpeaking ? 'Announcing...' : 'Audio Chime'}</span>
            </button>
          </div>
        </div>

        {/* Counter and Officer Details Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Assigned Counter Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#292075] text-[#00B5EF] flex items-center justify-center font-bold text-lg font-mono shrink-0 shadow-xs">
                {assignedCounter ? assignedCounter.number : token.counterNumber}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  काउंटर / Assigned Counter
                </span>
                <h4 className="text-sm font-bold text-[#1A1450]">
                  {assignedCounter ? assignedCounter.name : `Counter ${token.counterNumber}`}
                </h4>
                <p className="text-xs text-slate-500">{assignedCounter?.type || 'Dedicated Service Desk'}</p>
              </div>
            </div>

            {/* Assigned Officer Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3">
              {assignedOfficer?.avatar ? (
                <img
                  src={assignedOfficer.avatar}
                  alt={assignedOfficer.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <UserCheck className="w-6 h-6" />
                </div>
              )}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  बैंक अधिकारी / Serving Officer
                </span>
                <h4 className="text-sm font-bold text-[#1A1450]">
                  {assignedOfficer ? assignedOfficer.name : token.officerName}
                </h4>
                <p className="text-xs text-slate-500">{assignedOfficer?.role || 'SBI Bank Officer'}</p>
              </div>
            </div>
          </div>

          {/* Queue Position and Wait Estimate Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#E6F8FE]/60 border border-[#00B5EF]/30 rounded-xl p-3">
              <span className="text-[10px] font-bold text-[#0083ca] uppercase tracking-wider block">
                आगे ग्राहक / Ahead
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#1A1450] font-mono mt-0.5 block">
                {token.customersAhead}
              </span>
              <span className="text-[10px] text-slate-500">waiting in queue</span>
            </div>

            <div className="bg-[#E6F8FE]/60 border border-[#00B5EF]/30 rounded-xl p-3">
              <span className="text-[10px] font-bold text-[#0083ca] uppercase tracking-wider block">
                अनुमानित समय / Est. Wait
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#1A1450] font-mono mt-0.5 block">
                ~{token.estimatedMinutes}m
              </span>
              <span className="text-[10px] text-slate-500">minutes approximate</span>
            </div>

            <div className="bg-[#E6F8FE]/60 border border-[#00B5EF]/30 rounded-xl p-3">
              <span className="text-[10px] font-bold text-[#0083ca] uppercase tracking-wider block">
                समय / Issued At
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#1A1450] font-mono mt-2 block">
                {formattedTime}
              </span>
              <span className="text-[10px] text-slate-500">Live Registration</span>
            </div>
          </div>

          {/* Customer Metadata Bar */}
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <span>Customer: <strong className="text-slate-800">{token.customerName}</strong></span>
            <span>Mobile: <strong className="text-slate-800 font-mono">+91 XXXXXX{token.mobile.slice(-4)}</strong></span>
            {token.accountNumber && (
              <span>Account: <strong className="text-slate-800 font-mono">XXXX{token.accountNumber.slice(-4)}</strong></span>
            )}
            <span>Language: <strong className="text-slate-800">{token.language}</strong></span>
          </div>

          {/* Official SBI Security Notice Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>सुरक्षा चेतावनी (Security Advisory):</strong> State Bank of India will NEVER ask for your PIN, Net Banking Password, OTP, or CVV. Never share confidential details with anyone.
            </p>
          </div>
        </div>

        {/* Ticket Footer Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>SBI-QMS-GRAHAK-MITRA</span>
          <span>TOLL FREE: 1800 1234 / 1800 2100</span>
        </div>
      </div>

      {/* Enhanced Action Buttons Grid with Detailed Micro-Copy and Tooltips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 no-print">
        
        {/* 1. Print Token Button */}
        <button
          onClick={handlePrint}
          className="group flex flex-col items-center justify-center p-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all active:scale-95 text-center focus-visible:ring-2 focus-visible:ring-[#00B5EF]"
          title="Print official thermal token slip for physical branch use"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#292075] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Printer className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900">Print e-Token</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Physical Slip / प्रिंट</span>
        </button>

        {/* 2. Download Slip Button */}
        <button
          onClick={handleDownload}
          className="group flex flex-col items-center justify-center p-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all active:scale-95 text-center focus-visible:ring-2 focus-visible:ring-[#00B5EF]"
          title="Save timestamped digital text receipt to your device"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#292075] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Download className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900">Download Slip</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Save Text / डाउनलोड</span>
        </button>

        {/* 3. Live Display Button */}
        <button
          onClick={onViewLiveQueue}
          className="group flex flex-col items-center justify-center p-3.5 bg-[#292075] hover:bg-[#1A1450] text-white rounded-2xl border border-[#00B5EF]/40 shadow-xs hover:shadow-md transition-all active:scale-95 text-center focus-visible:ring-2 focus-visible:ring-[#00B5EF]"
          title="Jump to the Lobby Live TV Screen to watch queue movement"
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 text-[#00B5EF] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Tv className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">Live Display</span>
          <span className="text-[10px] text-sky-200 mt-0.5">Track on TV / कतार</span>
        </button>

        {/* 4. Cancel Token Button */}
        <button
          onClick={handleCancel}
          disabled={token.status === 'cancelled' || token.status === 'completed'}
          className="group flex flex-col items-center justify-center p-3.5 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-2xl border border-rose-200 shadow-xs hover:shadow-md transition-all active:scale-95 text-center disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-rose-400"
          title="Cancel your turn and release counter allocation"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <XCircle className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">Cancel Token</span>
          <span className="text-[10px] text-rose-500 mt-0.5">Release Spot / रद्द</span>
        </button>
      </div>

      {/* Simulated Customer Notification Previews */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3 no-print">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-[#292075] uppercase tracking-wider flex items-center gap-1.5">
              <span>SBI SMS & WhatsApp Notifications Simulation</span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            </h4>
            <p className="text-xs text-slate-500">Preview simulated customer queue notifications as delivered to your mobile phone</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E6F8FE] text-[#0083ca] border border-[#00B5EF]/30">
            Interactive Test
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onOpenSMSModal}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-[#00B5EF] bg-slate-50 hover:bg-white text-left transition-all group shadow-2xs hover:shadow-xs active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#292075] flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Preview SBI SMS Alert</span>
                <span className="text-[11px] text-slate-500">Sender: SBIBNK (SBI INB) • +91 {token.mobile}</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#00B5EF] transition-colors" />
          </button>

          <button
            onClick={onOpenWhatsappModal}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-white text-left transition-all group shadow-2xs hover:shadow-xs active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Preview WhatsApp Alert</span>
                <span className="text-[11px] text-slate-500">Official verified green tick channel</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* New Token Link with Clear CTA */}
      <div className="text-center pt-2 no-print">
        <button
          onClick={onNewToken}
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1A1450] text-xs font-bold transition-all inline-flex items-center gap-2 border border-slate-200 active:scale-95 shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-[#0083ca]" />
          <span>Need service for another person? Generate Another e-Token</span>
        </button>
      </div>
    </div>
  );
};

export default TokenConfirmation;
