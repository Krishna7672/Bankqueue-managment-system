import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  PhoneCall, 
  RotateCw, 
  CheckCircle, 
  SkipForward, 
  ArrowRightLeft, 
  UserX, 
  Pause, 
  Play, 
  Clock, 
  User, 
  Phone, 
  CreditCard, 
  FileText, 
  AlertCircle, 
  History, 
  Send, 
  Sparkles,
  ChevronDown,
  Volume2,
  HelpCircle,
  PlayCircle
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';

export const StaffDashboard = () => {
  const { 
    counters, 
    officers, 
    tokens, 
    services, 
    activityLogs,
    callNextToken, 
    recallToken, 
    markServing, 
    completeService, 
    skipToken, 
    markNoShow, 
    transferToken,
    toggleCounterStatus,
    activeStaffCounterId,
    setActiveStaffCounterId
  } = useQueue();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completionNotes, setCompletionNotes] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [targetTransferCounter, setTargetTransferCounter] = useState('');
  const [targetTransferService, setTargetTransferService] = useState('');

  // Selected counter & officer
  const currentCounter = counters.find(c => c.id === activeStaffCounterId) || counters[0];
  const currentOfficer = officers.find(o => o.id === currentCounter.officerId) || officers[0];

  // Currently serving token at this counter
  const currentlyServingToken = tokens.find(
    t => (t.counterId === currentCounter.id || t.counterNumber === currentCounter.number) && t.status === 'serving'
  );

  // Eligible waiting tokens for this counter
  const waitingQueue = tokens.filter(
    t => t.status === 'waiting' && 
    (currentCounter.assignedServices.includes(t.serviceId) || currentCounter.assignedServices.length === 0)
  );

  // Timer for current serving token
  useEffect(() => {
    let timer = null;
    if (currentlyServingToken) {
      if (currentlyServingToken.calledAt) {
        const calledTime = new Date(currentlyServingToken.calledAt).getTime();
        const diff = Math.max(0, Math.floor((Date.now() - calledTime) / 1000));
        setElapsedSeconds(diff);
      } else {
        setElapsedSeconds(0);
      }

      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentlyServingToken]);

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCallNext = () => {
    const next = callNextToken(currentCounter.id);
    if (!next) {
      alert('No waiting customers eligible for this counter right now.');
    }
  };

  const handleComplete = () => {
    if (!currentlyServingToken) return;
    completeService(currentlyServingToken.id, completionNotes);
    setCompletionNotes('');
  };

  const handleExecuteTransfer = () => {
    if (!currentlyServingToken || !targetTransferCounter) return;
    transferToken(
      currentlyServingToken.id, 
      targetTransferCounter, 
      targetTransferService || currentlyServingToken.serviceId
    );
    setShowTransferModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Officer & Counter Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Officer Profile & Counter Switcher */}
        <div className="flex items-center gap-4">
          <img
            src={currentOfficer.avatar}
            alt={currentOfficer.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">SBI Counter Workstation</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                currentCounter.status === 'open' ? 'bg-emerald-100 text-emerald-800' :
                currentCounter.status === 'busy' ? 'bg-amber-100 text-amber-800' :
                'bg-slate-200 text-slate-700'
              }`}>
                {currentCounter.status}
              </span>
            </div>
            
            <h2 className="text-lg font-black text-[#1A1450] flex items-center gap-2">
              <span>{currentOfficer.name}</span>
              <span className="text-xs text-slate-500 font-mono">({currentOfficer.id})</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Assigned: <strong className="text-[#292075]">{currentCounter.name}</strong> • {currentOfficer.role}
            </p>
          </div>
        </div>

        {/* Counter Switcher & Availability Toggles */}
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Switch Workstation Desk
            </label>
            <select
              value={activeStaffCounterId}
              onChange={(e) => setActiveStaffCounterId(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00B5EF]/30"
            >
              {counters.map(c => {
                const off = officers.find(o => o.id === c.officerId);
                return (
                  <option key={c.id} value={c.id}>
                    Counter {c.number} - {off?.name || 'Unassigned'} ({c.type})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={() => toggleCounterStatus(currentCounter.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all shadow-2xs active:scale-95 ${
                currentCounter.status === 'paused'
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
              title="Pause counter for lunch or tea break"
            >
              {currentCounter.status === 'paused' ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{currentCounter.status === 'paused' ? 'Resume Desk (पुनः चालू)' : 'Pause Desk (विराम)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Active Serving Panel & Waiting Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Currently Serving Customer & Action Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Customer Card */}
          <div className={`rounded-3xl border-2 p-6 transition-all ${
            currentlyServingToken
              ? 'bg-white border-[#00B5EF] shadow-md ring-2 ring-[#00B5EF]/20'
              : 'bg-white border-dashed border-slate-300 shadow-xs'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${currentlyServingToken ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                <h3 className="text-sm font-bold text-[#1A1450] uppercase tracking-wider">
                  {currentlyServingToken ? 'Currently Serving Customer (सेवारत ग्राहक)' : 'Counter Ready — Idle (काउंटर उपलब्ध)'}
                </h3>
              </div>

              {currentlyServingToken && (
                <div className="flex items-center gap-2 font-mono text-xs bg-[#E6F8FE] text-[#1A1450] px-3.5 py-1.5 rounded-full border border-[#00B5EF]/30">
                  <Clock className="w-3.5 h-3.5 text-[#0083ca] animate-spin" />
                  <span>Duration: <strong>{formatTimer(elapsedSeconds)}</strong></span>
                </div>
              )}
            </div>

            {currentlyServingToken ? (
              <div className="space-y-5">
                {/* Token and Customer Headline */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Serving Token</span>
                    <h2 className="text-3xl font-black font-mono text-[#1A1450]">{currentlyServingToken.tokenNumber}</h2>
                    <span className="text-xs font-semibold text-[#0083ca] bg-[#E6F8FE] px-2 py-0.5 rounded">
                      {currentlyServingToken.serviceName}
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Customer</span>
                    <h4 className="text-base font-bold text-[#1A1450]">{currentlyServingToken.customerName}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                      currentlyServingToken.category === 'Person with Disability' ? 'bg-purple-100 text-purple-800' :
                      currentlyServingToken.category === 'Senior Citizen' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {currentlyServingToken.category}
                    </span>
                  </div>
                </div>

                {/* Customer Details Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact</span>
                    <span className="font-mono font-semibold text-slate-800">
                      +91 {currentlyServingToken.mobile.slice(0, 2)}***{currentlyServingToken.mobile.slice(-4)}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Account</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {currentlyServingToken.accountNumber ? `AC-XXXX${currentlyServingToken.accountNumber.slice(-4)}` : 'None Provided'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Language</span>
                    <span className="font-semibold text-slate-800">{currentlyServingToken.language}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Wait Time</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {Math.max(1, Math.floor((new Date() - new Date(currentlyServingToken.createdAt)) / 60000))} mins
                    </span>
                  </div>
                </div>

                {/* Customer Request Notes if any */}
                {currentlyServingToken.notes && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <span className="font-bold block mb-0.5">Customer Remark:</span>
                    <p>{currentlyServingToken.notes}</p>
                  </div>
                )}

                {/* Completion Notes Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Officer Resolution / Audit Remarks (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cash Rs 50,000 deposited, receipt issued"
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B5EF]/30 focus:bg-white"
                  />
                </div>

                {/* ENHANCED ACTION CONTROLS with Subtext and Tooltips */}
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  
                  {/* Recall Token */}
                  <button
                    onClick={() => recallToken(currentlyServingToken.id)}
                    className="flex flex-col items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 active:scale-95 text-[#292075] rounded-xl border border-blue-200 transition-all text-center shadow-2xs"
                    title="Repeat chime and voice announcement over lobby speakers"
                  >
                    <div className="flex items-center gap-1 font-bold text-xs">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Recall Token</span>
                    </div>
                    <span className="text-[10px] text-blue-700 mt-0.5">पुनः पुकारें</span>
                  </button>

                  {/* Complete Service */}
                  <button
                    onClick={handleComplete}
                    className="flex flex-col items-center justify-center p-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl shadow-xs transition-all text-center"
                    title="Finish current transaction and conclude customer session"
                  >
                    <div className="flex items-center gap-1 font-bold text-xs">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </div>
                    <span className="text-[10px] text-emerald-100 mt-0.5">सेवा संपन्न</span>
                  </button>

                  {/* Transfer Token */}
                  <button
                    onClick={() => {
                      setTargetTransferCounter(counters.find(c => c.id !== currentCounter.id)?.id || '');
                      setShowTransferModal(true);
                    }}
                    className="flex flex-col items-center justify-center p-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 rounded-xl border border-slate-200 transition-all text-center shadow-2xs"
                    title="Reassign customer to another desk or specialized officer"
                  >
                    <div className="flex items-center gap-1 font-bold text-xs">
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Transfer</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5">स्थानांतरण</span>
                  </button>

                  {/* Skip Token */}
                  <button
                    onClick={() => skipToken(currentlyServingToken.id)}
                    className="flex flex-col items-center justify-center p-3 bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-700 rounded-xl border border-purple-200 transition-all text-center shadow-2xs"
                    title="Temporarily hold ticket and advance to next waiting customer"
                  >
                    <div className="flex items-center gap-1 font-bold text-xs">
                      <SkipForward className="w-3.5 h-3.5" />
                      <span>Skip Token</span>
                    </div>
                    <span className="text-[10px] text-purple-600 mt-0.5">रोकें / स्किप</span>
                  </button>

                  {/* Mark No Show */}
                  <button
                    onClick={() => markNoShow(currentlyServingToken.id)}
                    className="flex flex-col items-center justify-center p-3 bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 rounded-xl border border-rose-200 transition-all text-center col-span-2 sm:col-span-4 shadow-2xs"
                    title="Record customer as absent after 3 unheeded calls"
                  >
                    <div className="flex items-center gap-1 font-bold text-xs">
                      <UserX className="w-3.5 h-3.5" />
                      <span>Mark Customer as No-Show (अनुपस्थित चिह्नित करें)</span>
                    </div>
                    <span className="text-[10px] text-rose-600 mt-0.5">Customer did not report to counter after repeated calls</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Idle state */
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#E6F8FE] text-[#0083ca] mx-auto flex items-center justify-center shadow-xs border border-[#00B5EF]/30">
                  <UserCheck className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#1A1450]">Counter {currentCounter.number} is Ready (काउंटर तैयार है)</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    {waitingQueue.length > 0 
                      ? `There are ${waitingQueue.length} customers waiting in this counter's service queue.`
                      : 'No waiting customers in this queue at the moment.'}
                  </p>
                </div>

                <button
                  onClick={handleCallNext}
                  disabled={waitingQueue.length === 0}
                  className="px-6 py-3.5 bg-[#292075] hover:bg-[#1A1450] active:scale-95 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#00B5EF]"
                  title="Call the next eligible customer using priority-first ranking"
                >
                  <PhoneCall className="w-4 h-4 text-[#00B5EF]" />
                  <span>Call Next Eligible Customer (अगला ग्राहक बुलाएं - {waitingQueue.length} Waiting)</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Call Next Bar */}
          {currentlyServingToken && (
            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">
                Finish current customer and advance queue:
              </span>
              <button
                onClick={handleCallNext}
                disabled={waitingQueue.length === 0}
                className="px-4 py-2 bg-[#292075] hover:bg-[#1A1450] active:scale-95 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-[#00B5EF]" />
                <span>Call Next Customer</span>
              </button>
            </div>
          )}

          {/* Activity Log Audit Trail */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#0083ca]" />
                <h4 className="text-xs font-bold text-[#1A1450] uppercase tracking-wider">
                  Counter Activity Audit Trail (कार्य लॉग)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">Real-time log</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {activityLogs.slice(0, 8).map(log => (
                <div key={log.id} className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      log.type === 'CALL' ? 'bg-blue-100 text-blue-800' :
                      log.type === 'COMPLETE' ? 'bg-emerald-100 text-emerald-800' :
                      log.type === 'TRANSFER' ? 'bg-amber-100 text-amber-800' :
                      log.type === 'NOSHOW' ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-slate-700">{log.message}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Waiting Queue for this Counter */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1A1450]">Queue for Counter {currentCounter.number}</h3>
                <p className="text-xs text-slate-500">Matching services assigned</p>
              </div>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-[#E6F8FE] text-[#0083ca] border border-[#00B5EF]/30">
                {waitingQueue.length} Waiting
              </span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {waitingQueue.map((tok, index) => {
                const isPriority = tok.category === 'Senior Citizen' || tok.category === 'Person with Disability';
                return (
                  <div
                    key={tok.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isPriority 
                        ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-400/30' 
                        : 'border-slate-200 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#1A1450]">
                          {tok.tokenNumber}
                        </span>
                        {isPriority && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900">
                            {tok.category === 'Senior Citizen' ? 'Elderly' : 'PwD'}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-slate-500">
                        ~{tok.estimatedMinutes}m wait
                      </span>
                    </div>

                    <div className="mt-1 text-xs text-slate-700">
                      <div className="font-semibold">{tok.customerName}</div>
                      <div className="text-slate-500 text-[11px]">{tok.serviceName}</div>
                    </div>

                    {/* Direct Call Button */}
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-mono">Position #{index + 1}</span>
                      <button
                        onClick={() => {
                          callNextToken(currentCounter.id);
                        }}
                        className="text-[11px] font-bold text-[#0083ca] hover:text-[#292075] flex items-center gap-1"
                        title="Call this customer immediately"
                      >
                        <span>Call Customer</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {waitingQueue.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No customers waiting for this counter.
                </div>
              )}
            </div>
          </div>

          {/* Today's Counter Statistics Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 text-xs space-y-2.5">
            <h4 className="font-bold text-[#1A1450] uppercase tracking-wider text-[11px]">Today's Desk Statistics</h4>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Total Customers Served:</span>
              <strong className="text-slate-800 font-mono text-sm">{currentCounter.totalServed}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Officer Avg Time:</span>
              <strong className="text-slate-800 font-mono text-sm">{currentOfficer.avgServiceTime} mins</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Desk Status:</span>
              <strong className="text-emerald-700 uppercase">{currentCounter.status}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Transfer Token Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#140F3E]/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#1A1450]">
                Transfer Token {currentlyServingToken?.tokenNumber}
              </h3>
              <button 
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select the target bank counter or specialized department to transfer this customer:
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Counter</label>
                <select
                  value={targetTransferCounter}
                  onChange={(e) => setTargetTransferCounter(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {counters.filter(c => c.id !== currentCounter.id).map(c => {
                    const off = officers.find(o => o.id === c.officerId);
                    return (
                      <option key={c.id} value={c.id}>
                        Counter {c.number} - {off?.name} ({c.type})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Service (Optional)</label>
                <select
                  value={targetTransferService}
                  onChange={(e) => setTargetTransferService(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="">Keep Same ({currentlyServingToken?.serviceName})</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteTransfer}
                className="px-4 py-2 text-xs font-bold bg-[#292075] text-white rounded-xl hover:bg-[#1A1450]"
              >
                Confirm Transfer (स्थानांतरित करें)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
