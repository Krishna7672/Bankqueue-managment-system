import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  Clock, 
  User, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  VolumeX,
  Play,
  ArrowRight,
  ShieldCheck,
  Building2,
  Filter,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import { soundService } from '../../services/soundAndSpeech';
import { SbiLogo } from '../SbiLogo';

export const LiveQueueDisplay = () => {
  const { tokens, counters, officers, settings, setSettings } = useQueue();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCounterFilter, setSelectedCounterFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [soundActive, setSoundActive] = useState(settings.soundChimes);

  // Filter serving tokens
  const servingTokens = tokens.filter(t => {
    const isServing = t.status === 'serving';
    if (selectedCounterFilter === 'all') return isServing;
    return isServing && (t.counterNumber === selectedCounterFilter || t.counterId === selectedCounterFilter);
  });

  // Filter waiting tokens (ordered by priority & createdAt)
  const waitingTokens = tokens.filter(t => {
    const isWaiting = t.status === 'waiting';
    if (selectedCounterFilter === 'all') return isWaiting;
    return isWaiting && (t.counterNumber === selectedCounterFilter || t.counterId === selectedCounterFilter);
  });

  // Completed tokens
  const completedTokens = tokens.filter(t => t.status === 'completed').slice(0, 8);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleTestChime = (tokenNumber, counterNum, officerName) => {
    soundService.announceToken(tokenNumber, counterNum, officerName);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const toggleSound = () => {
    const nextState = !soundActive;
    setSoundActive(nextState);
    setSettings(prev => ({ ...prev, soundChimes: nextState, audioAnnouncements: nextState }));
    if (nextState) {
      soundService.playChime();
    }
  };

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#140F3E] p-6 overflow-y-auto text-white' : ''}`}>
      
      {/* Top Header Bar with Enhanced Action Controls */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl border ${
        isFullscreen 
          ? 'bg-[#1B1464] border-[#00B5EF]/40 text-white shadow-xl' 
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className="bg-[#292075] p-2 rounded-2xl shadow-xs border border-[#00B5EF]/30 shrink-0">
            <SbiLogo className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base sm:text-lg font-black tracking-tight ${isFullscreen ? 'text-white' : 'text-[#1A1450]'}`}>
                SBI LOBBY LIVE QUEUE BOARD (सजीव कतार स्थिति)
              </h2>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                LIVE UPDATES
              </span>
            </div>
            <p className={`text-xs ${isFullscreen ? 'text-slate-300' : 'text-slate-500'}`}>
              Branch #00402 • Real-time counter status and electronic token call announcements
            </p>
          </div>
        </div>

        {/* Display Controls with Descriptive Button Titles */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Refresh / Sync Button */}
          <button
            onClick={handleManualRefresh}
            className={`p-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs ${
              isFullscreen
                ? 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
            title="Force immediate queue synchronization"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#00B5EF]' : ''}`} />
            <span className="hidden sm:inline">Sync Queue</span>
          </button>

          {/* Audio Chime Test Button */}
          <button
            onClick={() => handleTestChime('C-019', '02', 'Mr. Amit Roy')}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs ${
              isFullscreen
                ? 'border-[#00B5EF]/40 bg-[#292075] text-[#00B5EF] hover:bg-slate-800'
                : 'border-slate-200 bg-[#E6F8FE] text-[#0083ca] hover:bg-sky-100'
            }`}
            title="Trigger a test audio announcement chime over speakers"
          >
            <Play className="w-3.5 h-3.5 text-[#00B5EF]" />
            <span>Test Voice Announcement (आवाज)</span>
          </button>

          {/* Fullscreen TV Kiosk Mode */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs ${
              isFullscreen
                ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
            title="Expand to Fullscreen TV Kiosk Presentation Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit TV Kiosk' : 'TV Kiosk Mode'}</span>
          </button>
        </div>
      </div>

      {/* Filter by Counter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className={`text-xs font-bold mr-1 ${isFullscreen ? 'text-slate-300' : 'text-slate-500'}`}>Filter Desk:</span>
        <button
          onClick={() => setSelectedCounterFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedCounterFilter === 'all'
              ? 'bg-[#292075] text-white shadow-xs ring-1 ring-[#00B5EF]/40'
              : isFullscreen ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          All Counters (सभी काउंटर)
        </button>
        {counters.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCounterFilter(c.number)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCounterFilter === c.number
                ? 'bg-[#292075] text-white shadow-xs ring-1 ring-[#00B5EF]/40'
                : isFullscreen ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Counter {c.number}
          </button>
        ))}
      </div>

      {/* SECTION 1: NOW SERVING (Highlighted Active Counters) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isFullscreen ? 'text-[#00B5EF]' : 'text-[#1A1450]'}`}>
              Now Serving At Counters • सेवारत काउंटर ({servingTokens.length} Active)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Please proceed when your token appears</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {counters.filter(c => selectedCounterFilter === 'all' || c.number === selectedCounterFilter).map((counter) => {
            const activeToken = tokens.find(t => (t.counterId === counter.id || t.counterNumber === counter.number) && t.status === 'serving');
            const officer = officers.find(o => o.id === counter.officerId);

            return (
              <div
                key={counter.id}
                className={`rounded-3xl border transition-all relative overflow-hidden ${
                  activeToken
                    ? isFullscreen
                      ? 'bg-[#1E1656] border-[#00B5EF] shadow-lg shadow-[#00B5EF]/10 ring-2 ring-[#00B5EF]/30'
                      : 'bg-white border-[#00B5EF] shadow-md ring-2 ring-[#00B5EF]/20'
                    : isFullscreen
                      ? 'bg-[#181242]/60 border-slate-700/60 opacity-80'
                      : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                {/* Top Counter Bar */}
                <div className={`px-4 py-2.5 flex items-center justify-between border-b ${
                  activeToken 
                    ? 'bg-[#292075] text-white border-[#00B5EF]/40' 
                    : isFullscreen
                      ? 'bg-[#1A1450] border-slate-700 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm tracking-wide text-[#00B5EF]">
                      COUNTER {counter.number}
                    </span>
                    <span className="text-[11px] opacity-90 hidden sm:inline">• {counter.type}</span>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    activeToken 
                      ? 'bg-emerald-500 text-white font-extrabold animate-pulse' 
                      : counter.status === 'open' 
                        ? 'bg-blue-100 text-blue-800'
                        : counter.status === 'busy'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                  }`}>
                    {activeToken ? 'NOW SERVING' : counter.status.toUpperCase()}
                  </span>
                </div>

                {/* Token Display Area */}
                <div className="p-5 text-center">
                  {activeToken ? (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        वर्तमान टोकन / Active Token
                      </span>
                      <div className="my-1">
                        <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                          isFullscreen ? 'text-[#00B5EF]' : 'text-[#292075]'
                        }`}>
                          {activeToken.tokenNumber}
                        </span>
                      </div>
                      <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 ${
                        isFullscreen ? 'bg-[#292075] text-[#00B5EF]' : 'bg-[#E6F8FE] text-[#0083ca]'
                      }`}>
                        {activeToken.serviceName}
                      </span>
                    </div>
                  ) : (
                    <div className="py-4">
                      <span className="text-2xl font-mono text-slate-300 font-bold">---</span>
                      <p className="text-xs text-slate-400 mt-1">Ready for next customer (उपलब्ध)</p>
                    </div>
                  )}
                </div>

                {/* Officer & Stats Footer */}
                <div className={`px-4 py-3 border-t text-xs flex items-center justify-between ${
                  isFullscreen ? 'border-slate-700/80 bg-[#160F38] text-slate-300' : 'border-slate-100 bg-slate-50 text-slate-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{officer?.name || 'Staff Officer'}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Served: {counter.totalServed}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2 & 3: UPCOMING NEXT QUEUE & RECENTLY COMPLETED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next Tokens In Line */}
        <div className={`lg:col-span-2 rounded-3xl border p-5 ${
          isFullscreen ? 'bg-[#1B1464] border-slate-700' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00B5EF]" />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isFullscreen ? 'text-white' : 'text-[#1A1450]'}`}>
                Upcoming Next In Line • आगामी टोकन ({waitingTokens.length} Waiting)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Sorted by Priority & Order</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                  isFullscreen ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <th className="pb-2.5">Token</th>
                  <th className="pb-2.5">Service</th>
                  <th className="pb-2.5">Counter</th>
                  <th className="pb-2.5">Officer</th>
                  <th className="pb-2.5">Category</th>
                  <th className="pb-2.5 text-right">Est. Wait</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {waitingTokens.slice(0, 10).map((tok, index) => {
                  return (
                    <tr 
                      key={tok.id} 
                      className={`hover:bg-[#E6F8FE]/30 transition-colors ${
                        index === 0 ? 'bg-[#E6F8FE]/40 font-semibold' : ''
                      }`}
                    >
                      <td className="py-3 font-mono font-bold text-sm text-[#1A1450] flex items-center gap-2">
                        <span>{tok.tokenNumber}</span>
                        {index === 0 && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#292075] text-[#00B5EF] font-sans uppercase font-bold">
                            Next
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-700">{tok.serviceName}</td>
                      <td className="py-3 font-medium text-slate-800">
                        Counter {tok.counterNumber}
                      </td>
                      <td className="py-3 text-slate-600">{tok.officerName}</td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tok.category === 'Person with Disability' 
                            ? 'bg-purple-100 text-purple-800'
                            : tok.category === 'Senior Citizen'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                        }`}>
                          {tok.category}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono font-medium text-slate-700">
                        ~{tok.estimatedMinutes}m
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {waitingTokens.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No customers currently waiting in the queue.
              </div>
            )}
          </div>
        </div>

        {/* Recently Completed Tokens */}
        <div className={`rounded-3xl border p-5 ${
          isFullscreen ? 'bg-[#1B1464] border-slate-700' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isFullscreen ? 'text-white' : 'text-[#1A1450]'}`}>
                Recently Completed (संपन्न सेवा)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Past Served</span>
          </div>

          <div className="space-y-2.5">
            {completedTokens.map((tok) => {
              return (
                <div 
                  key={tok.id} 
                  className={`p-2.5 rounded-2xl border flex items-center justify-between text-xs ${
                    isFullscreen ? 'bg-[#292075] border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-[#1A1450] text-sm">
                      {tok.tokenNumber}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {tok.serviceName}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-semibold block text-[11px]">
                      Counter {tok.counterNumber}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      Completed
                    </span>
                  </div>
                </div>
              );
            })}

            {completedTokens.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No completed tokens yet today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Announcement Ticker in SBI Navy & Cerulean */}
      <div className="bg-[#1A1450] text-white rounded-2xl p-3 flex items-center justify-between text-xs overflow-hidden shadow-sm border border-[#00B5EF]/30">
        <div className="flex items-center gap-3">
          <span className="bg-[#00B5EF] text-[#1A1450] font-black px-2 py-0.5 rounded text-[10px] uppercase shrink-0">
            SBI ANNOUNCEMENT / सूचना
          </span>
          <div className="overflow-hidden whitespace-nowrap">
            <span className="animate-marquee inline-block text-slate-200">
              भारतीय स्टेट बैंक में आपका स्वागत है • वरिष्ठ नागरिकों (वरिष्ठ नागरिक) एवं दिव्यांगजन ग्राहकों के लिए प्राथमिकता काउंटर उपलब्ध है • कृपया टोकन पुकारे जाने पर आवश्यक पहचान पत्र एवं दस्तावेजों के साथ संबंधित काउंटर पर संपर्क करें • सुरक्षा सूचना: SBI कभी भी OTP, पासवर्ड या ATM PIN नहीं मांगता। • टोल फ्री हेल्पलाइन: 1800 1234 / 1800 2100.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveQueueDisplay;
