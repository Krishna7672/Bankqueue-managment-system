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
  Check,
  RotateCw,
  CreditCard,
  Wifi,
  Radio
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardRotate, setCardRotate] = useState({ x: 0, y: 0 });

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

  // Handle Download Token Text Slip
  const handleDownload = () => {
    const slipText = `
=============================================
         भारतीय स्टेट बैंक / STATE BANK OF INDIA
         GRAHAK MITRA DEBIT e-TOKEN / पर्ची
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

  // Interactive 3D Card Parallax on Desktop
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setCardRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setCardRotate({ x: 0, y: 0 });
  };

  const formattedDate = new Date(token.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = new Date(token.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const formattedMonthYear = new Date(token.createdAt).toLocaleDateString('en-IN', {
    month: '2-digit',
    year: '2-digit'
  });

  const tokenDigits = token.tokenNumber.replace(/\D/g, '').padStart(3, '0');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Top Header & Interactive Card Controller */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#292075] to-[#00B5EF] text-white flex items-center justify-center shrink-0 shadow-md">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#1A1450]">
                SBI e-Token Debit Card Pass
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Active Pass
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive smart queue debit card. Flip or hover to view details.
            </p>
          </div>
        </div>

        {/* Card Controls: Flip & Copy */}
        <div className="flex items-center gap-2 self-end sm:self-auto no-print">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#1A1450] text-xs font-bold transition-all border border-slate-200 active:scale-95 shadow-2xs"
            title="Click to flip between front and back of the debit card"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#0083ca] transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
            <span>{isFlipped ? 'View Front (सामने)' : 'Flip Card ↺ (पलटें)'}</span>
          </button>

          <button
            onClick={handleCopyToken}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all border border-slate-200 active:scale-95 shadow-2xs font-mono"
            title="Copy token number"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : token.tokenNumber}</span>
          </button>
        </div>
      </div>

      {/* 3D PERSPECTIVE WRAPPER FOR DEBIT CARD */}
      <div 
        id="printable-token"
        className="perspective-1000 w-full max-w-lg mx-auto py-2"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className={`relative w-full aspect-[1.586/1] min-h-[295px] sm:min-h-[325px] transition-transform duration-700 transform-style-3d cursor-pointer select-none rounded-[28px] shadow-2xl shadow-[#1A1450]/30 hover:shadow-[#00B5EF]/20`}
          style={{
            transform: isFlipped 
              ? 'rotateY(180deg)' 
              : `rotateX(${cardRotate.x}deg) rotateY(${cardRotate.y}deg)`
          }}
          onClick={() => setIsFlipped(!isFlipped)}
          title="Click card anywhere to flip"
        >

          {/* ========================================================
              FRONT SIDE: OFFICIAL STATE BANK OF INDIA DEBIT CARD
             ======================================================== */}
          <div className="absolute inset-0 w-full h-full rounded-[28px] p-6 sm:p-7 bg-gradient-to-br from-[#100936] via-[#1F155E] to-[#0A4E8C] text-white overflow-hidden border border-white/25 backface-hidden flex flex-col justify-between">
            
            {/* Subtle Metallic Radial Glow & Guilloche Patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#00B5EF]/30 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:18px_18px] pointer-events-none" />
            
            {/* Animated Light Shimmer Reflection */}
            <div className="absolute inset-0 -translate-x-full animate-card-shimmer bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

            {/* Front Card Header */}
            <div className="relative z-10 flex items-start justify-between">
              {/* SBI Bank Emblem & Bilingual Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 p-1.5 shadow-md flex items-center justify-center backdrop-blur-xs ring-2 ring-white/30 shrink-0">
                  <SbiLogo className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-[11px] font-bold text-[#00B5EF] tracking-wider leading-none">
                    भारतीय स्टेट बैंक
                  </div>
                  <h2 className="text-xs sm:text-sm font-black tracking-wider text-white mt-0.5 leading-tight">
                    STATE BANK OF INDIA
                  </h2>
                </div>
              </div>

              {/* Contactless Wave + Badge */}
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-white/80 rotate-90" />
                <span className="text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[#00B5EF] border border-[#00B5EF]/40 tracking-wider">
                  e-Token Pass
                </span>
              </div>
            </div>

            {/* Middle Section: Golden EMV Chip & Service Pill */}
            <div className="relative z-10 flex items-center justify-between my-auto pt-2">
              <div className="flex items-center gap-3">
                {/* Authentic Metallic Gold EMV Chip */}
                <div className="w-12 h-9 sm:w-14 sm:h-10 rounded-lg bg-gradient-to-tr from-amber-300 via-amber-100 to-amber-500 border border-amber-200 shadow-md p-1 flex flex-col justify-between relative overflow-hidden shrink-0">
                  <div className="w-full h-full border border-amber-700/40 rounded-sm relative flex items-center justify-center">
                    <div className="w-full h-[1px] bg-amber-800/40 absolute" />
                    <div className="h-full w-[1px] bg-amber-800/40 absolute" />
                    <div className="w-4 h-4 rounded-full border border-amber-800/40 bg-amber-200/60" />
                  </div>
                </div>

                {/* Priority Status Pill */}
                <div className="flex flex-col gap-1">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full w-fit flex items-center gap-1.5 ${
                    token.category === 'Senior Citizen' 
                      ? 'bg-amber-400/25 text-amber-300 border border-amber-400/40' 
                      : token.category === 'Person with Disability'
                        ? 'bg-purple-400/25 text-purple-300 border border-purple-400/40'
                        : 'bg-white/15 text-sky-200 border border-white/20'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    {token.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-300/90 truncate max-w-[160px] sm:max-w-[200px]">
                    {token.serviceName}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                  token.status === 'serving' ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse' :
                  token.status === 'completed' ? 'bg-slate-700 text-slate-300 border-slate-600' :
                  token.status === 'cancelled' ? 'bg-rose-900/60 text-rose-300 border-rose-700' :
                  'bg-sky-500/20 text-[#00B5EF] border-[#00B5EF]/40'
                }`}>
                  {token.status}
                </span>
              </div>
            </div>

            {/* EMBOSSED TOKEN CARD NUMBER */}
            <div className="relative z-10 my-1">
              <span className="text-[8px] uppercase tracking-widest text-slate-300/70 font-mono block mb-0.5">
                QUEUE TOKEN NUMBER • कतार टोकन संख्या
              </span>
              <div className="flex items-center gap-3 sm:gap-4 font-mono font-black text-3xl sm:text-4xl tracking-[0.2em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] embossed-card-text">
                <span className="text-white drop-shadow-md">{token.tokenNumber}</span>
                <span className="text-white/30 text-xl font-normal select-none">••••</span>
                <span className="text-white/40 text-sm font-semibold select-none">QMS</span>
              </div>
            </div>

            {/* Front Card Footer: Customer Name, Desk & RuPay Logo */}
            <div className="relative z-10 flex items-end justify-between pt-1">
              {/* Customer Name and Desk Assignment */}
              <div className="space-y-0.5 min-w-0 pr-2">
                <span className="text-[8px] uppercase tracking-wider text-slate-300/80 font-mono block">
                  CARDHOLDER / ग्राहक
                </span>
                <div className="text-xs sm:text-sm font-black font-mono tracking-wider text-white uppercase truncate drop-shadow-sm">
                  {token.customerName}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-[#00B5EF] truncate">
                  Counter {assignedCounter ? assignedCounter.number : token.counterNumber} • {assignedOfficer ? assignedOfficer.name : token.officerName}
                </div>
              </div>

              {/* Expiry Date, Hologram & RuPay Global Branding */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <span className="text-[7px] uppercase tracking-widest text-slate-300/70 font-mono block">VALID THRU</span>
                  <span className="text-[10px] font-mono font-bold text-white tracking-wider">{formattedMonthYear}</span>
                </div>

                {/* Iridescent Hologram Sticker */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-pink-500 via-amber-300 to-sky-400 opacity-90 border border-white/50 shadow-inner flex items-center justify-center text-[7px] font-black text-slate-900 tracking-tighter">
                  SBI
                </div>

                {/* RuPay Global Card Emblem */}
                <div className="text-right">
                  <div className="text-[13px] sm:text-[15px] font-black tracking-tighter italic text-white flex items-center leading-none">
                    <span className="text-[#F8A51D]">Ru</span><span>Pay</span>
                  </div>
                  <div className="text-[7px] uppercase font-bold text-sky-200 tracking-widest leading-none mt-0.5">
                    GLOBAL
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              BACK SIDE: REVERSE VIEW WITH MAGNETIC STRIP & VERIFICATION
             ======================================================== */}
          <div className="absolute inset-0 w-full h-full rounded-[28px] bg-gradient-to-br from-[#0c0827] via-[#160f44] to-[#1a1450] text-white overflow-hidden border border-white/20 rotate-y-180 backface-hidden flex flex-col justify-between py-5">
            
            {/* Magnetic Stripe Bar */}
            <div className="w-full h-11 sm:h-12 bg-slate-950 border-y border-slate-800 shadow-inner relative flex items-center px-6">
              <span className="text-[8px] font-mono text-slate-600 tracking-widest uppercase">
                STATE BANK OF INDIA • ELECTRONIC SECURE QUEUE STRIPE
              </span>
            </div>

            {/* Signature & CVV Panel */}
            <div className="px-6 space-y-3">
              <div className="flex items-center gap-3">
                {/* White Signature Strip */}
                <div className="flex-1 bg-slate-100 text-slate-900 px-3 py-1.5 rounded-sm flex items-center justify-between font-mono text-xs italic border border-slate-300">
                  <span className="font-bold truncate">{token.customerName}</span>
                  <span className="text-[10px] font-normal not-italic text-slate-500 font-mono">AUTHORIZED TOKEN</span>
                </div>

                {/* CVV Box matching token number digits */}
                <div className="bg-white text-slate-900 font-mono font-black text-xs px-2.5 py-1.5 rounded-sm border border-slate-300 tracking-widest">
                  {tokenDigits}
                </div>
              </div>

              {/* Barcode & Security Micro-copy */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3 text-[10px] text-slate-300">
                <div className="space-y-0.5">
                  <div className="font-bold text-[#00B5EF]">Security & Verification Notice</div>
                  <p className="text-[9px] text-slate-400 leading-tight">
                    Present this card upon counter announcement. SBI never asks for your ATM PIN or Net Banking Password.
                  </p>
                  <div className="text-[9px] font-mono text-slate-300 pt-1">
                    Customer Care: <strong>1800 1234 / 1800 2100</strong>
                  </div>
                </div>

                {/* QR Code Graphic */}
                <div className="w-12 h-12 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center text-slate-900 shadow-sm">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
              </div>
            </div>

            {/* Reverse Card Footer */}
            <div className="px-6 flex items-center justify-between text-[9px] text-slate-400 font-mono">
              <span>ISSUED: {formattedDate} • {formattedTime}</span>
              <span className="text-[#00B5EF] font-bold">CLICK CARD TO FLIP FRONT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Queue Metrics Cards */}
      <div className="grid grid-cols-3 gap-3 text-center no-print">
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            आगे ग्राहक / Ahead
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#1A1450] font-mono mt-0.5 block">
            {token.customersAhead}
          </span>
          <span className="text-[10px] text-slate-500">waiting in queue</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            अनुमानित समय / Est. Wait
          </span>
          <span className="text-xl sm:text-2xl font-black text-[#1A1450] font-mono mt-0.5 block">
            ~{token.estimatedMinutes}m
          </span>
          <span className="text-[10px] text-slate-500">minutes approximate</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            आवाज / Voice
          </span>
          <button
            onClick={handlePlayVoice}
            disabled={isSpeaking}
            className="mt-1 px-2.5 py-1 rounded-xl bg-[#E6F8FE] hover:bg-sky-100 text-[#0083ca] border border-[#00B5EF]/30 text-xs font-bold inline-flex items-center gap-1.5 transition-all active:scale-95 mx-auto"
            title="Hear loud speaker announcement chime"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-[#00B5EF]' : ''}`} />
            <span>{isSpeaking ? 'Playing...' : 'Test Chime'}</span>
          </button>
          <span className="text-[9px] text-slate-400 block mt-1">Loudspeaker</span>
        </div>
      </div>

      {/* Customer Information & Advisory Bar */}
      <div className="text-xs text-slate-600 bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs no-print">
        <span>Customer: <strong className="text-slate-800">{token.customerName}</strong></span>
        <span>Mobile: <strong className="text-slate-800 font-mono">+91 XXXXXX{token.mobile.slice(-4)}</strong></span>
        {token.accountNumber && (
          <span>Account: <strong className="text-slate-800 font-mono">XXXX{token.accountNumber.slice(-4)}</strong></span>
        )}
        <span>Language: <strong className="text-slate-800">{token.language}</strong></span>
      </div>

      {/* Enhanced Action Buttons Grid */}
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
          <span className="text-xs font-bold text-slate-900">Print Debit Pass</span>
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
            className="flex items-center justify-between p-3.5 rounded-2xl border border-emerald-200 hover:border-emerald-400 bg-slate-50 hover:bg-white text-left transition-all group shadow-2xs hover:shadow-xs active:scale-98"
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
