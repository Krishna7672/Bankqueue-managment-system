import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Volume2, 
  VolumeX, 
  Tv, 
  UserCheck, 
  ShieldCheck, 
  Ticket, 
  LifeBuoy, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  PhoneCall,
  Lock,
  LogOut,
  User
} from 'lucide-react';
import { useQueue } from '../context/QueueContext';
import { soundService } from '../services/soundAndSpeech';
import { SbiLogo } from './SbiLogo';
import { StaffLoginModal } from './Auth/StaffLoginModal';

export const Header = ({ currentTab, setCurrentTab }) => {
  const { 
    userToken, 
    settings, 
    setSettings, 
    resetToDemoData,
    authRole,
    currentAuthUser,
    loginStaff,
    logoutStaff
  } = useQueue();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundActive, setSoundActive] = useState(settings.soundChimes);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSound = () => {
    const nextState = !soundActive;
    setSoundActive(nextState);
    setSettings(prev => ({ ...prev, soundChimes: nextState, audioAnnouncements: nextState }));
    if (nextState) {
      soundService.playChime();
    }
  };

  const handleLogout = () => {
    logoutStaff();
    setCurrentTab('customer');
  };

  // Base Customer Navigation Items (Always visible to public)
  const customerNavItems = [
    { id: 'customer', label: 'Get e-Token', icon: Ticket, badge: 'e-Parchi' },
    { id: 'support', label: 'CMS Grievance', icon: LifeBuoy, badge: 'Priority' },
    { id: 'display', label: 'Live TV Board', icon: Tv, badge: 'Live' },
  ];

  // Authorized Staff Items
  const staffNavItems = [
    { id: 'staff', label: 'Counter Desk', icon: UserCheck, badge: 'SWO' },
  ];

  // Authorized Admin Items
  const adminNavItems = [
    { id: 'staff', label: 'Counter Desk', icon: UserCheck, badge: 'SWO' },
    { id: 'admin', label: 'Branch Admin', icon: ShieldCheck, badge: 'Manager' },
  ];

  // Determine which navigation tabs to display based on authentication
  const currentNavItems = [
    ...customerNavItems,
    ...(authRole === 'staff' ? staffNavItems : []),
    ...(authRole === 'admin' ? adminNavItems : [])
  ];

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        {/* Top SBI Official Information Strip */}
        <div className="bg-[#1A1450] text-white text-[11px] px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#292075]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#00B5EF] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SBI Branch #00402 (Connaught Place, New Delhi)
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-[#00B5EF]" />
              Toll Free: <strong className="text-white">1800 1234 / 1800 2100</strong>
            </span>
            <span className="text-slate-500 hidden md:inline">|</span>
            <span className="text-slate-300 hidden md:inline">
              Hours: 10:00 AM - 04:00 PM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
              <Clock className="w-3.5 h-3.5 text-[#00B5EF]" />
              <span>
                {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                {' • '}
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </span>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset queue back to pristine SBI branch demo data?')) {
                  resetToDemoData();
                }
              }}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20"
              title="Reset queue state"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-4 py-2">
            
            {/* SBI Logo and Official Bilingual Title */}
            <div 
              onClick={() => setCurrentTab('customer')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="relative shrink-0">
                <SbiLogo className="w-11 h-11 drop-shadow-sm group-hover:scale-105 transition-transform" />
              </div>

              <div className="border-l border-slate-200 pl-3">
                <div className="text-[12px] font-bold text-[#292075] tracking-wide leading-none">
                  भारतीय स्टेट बैंक
                </div>
                <div className="text-base font-black text-[#1A1450] tracking-tight leading-tight flex items-center gap-2">
                  <span>STATE BANK OF INDIA</span>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 bg-[#E6F8FE] text-[#0083ca] border border-[#00B5EF]/30 rounded">
                    Grahak Mitra
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  Branch e-Token & Queue Management Portal
                </p>
              </div>
            </div>

            {/* Public Navigation Links (Admin/Staff only visible when authenticated!) */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
              {currentNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#292075] text-white shadow-sm ring-1 ring-[#00B5EF]/40'
                        : 'text-slate-700 hover:text-[#292075] hover:bg-white/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#00B5EF]' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-[#00B5EF] text-[#1A1450]' : 'bg-[#E6F8FE] text-[#0083ca]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Utilities & Auth Control */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Audio Toggle */}
              <button
                onClick={toggleSound}
                className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  soundActive 
                    ? 'border-[#00B5EF]/40 bg-[#E6F8FE] text-[#0083ca] hover:bg-sky-100'
                    : 'border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
                title={soundActive ? 'Loudspeaker Voice Announcements ON' : 'Loudspeaker Announcements MUTED'}
              >
                {soundActive ? <Volume2 className="w-4 h-4 text-[#0083ca]" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline text-xs font-bold">{soundActive ? 'Sound On' : 'Muted'}</span>
              </button>

              {/* Active User Token Ticket Pill */}
              {userToken && (
                <button
                  onClick={() => setCurrentTab('token-detail')}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#292075] to-[#1B1464] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:shadow transition-all border border-[#00B5EF]/30"
                  title="View your current SBI e-Token pass"
                >
                  <Ticket className="w-4 h-4 text-[#00B5EF]" />
                  <span className="font-mono text-sm tracking-wide">{userToken.tokenNumber}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${
                    userToken.status === 'serving' ? 'bg-emerald-400 text-emerald-950 animate-pulse' :
                    userToken.status === 'completed' ? 'bg-slate-200 text-slate-800' : 'bg-white/20 text-white'
                  }`}>
                    {userToken.status}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                </button>
              )}

              {/* SEPARATE AUTHENTICATION GATEWAY: Staff / Admin Login Button */}
              {authRole ? (
                /* Authenticated State Banner & Logout */
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] uppercase font-bold text-[#0083ca] block">
                      {authRole === 'admin' ? 'Branch Manager' : 'Counter Officer'}
                    </span>
                    <span className="text-xs font-bold text-[#1A1450] block truncate max-w-[120px]">
                      {currentAuthUser?.name || 'Administrator'}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
                    title="Log out from staff workstation"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                /* Public Customer State -> Official Login Gateway */
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#292075] hover:bg-[#1A1450] text-white text-xs font-bold shadow-xs border border-[#00B5EF]/30 transition-all hover:ring-2 hover:ring-[#00B5EF]/40"
                  title="Official SBI Staff & Admin Login"
                >
                  <Lock className="w-3.5 h-3.5 text-[#00B5EF]" />
                  <span>Staff Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Bar */}
          <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-100 overflow-x-auto gap-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex flex-col items-center py-1 px-2 text-[11px] font-bold rounded-lg whitespace-nowrap ${
                    isActive ? 'text-[#292075] font-extrabold' : 'text-slate-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#00B5EF]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Staff Login Authentication Modal */}
      <StaffLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={({ role, officer }) => {
          loginStaff({ role, officer });
          if (role === 'admin') {
            setCurrentTab('admin');
          } else {
            setCurrentTab('staff');
          }
        }}
      />
    </>
  );
};

export default Header;
