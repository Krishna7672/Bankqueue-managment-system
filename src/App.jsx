import React, { useState } from 'react';
import { QueueProvider, useQueue } from './context/QueueContext';
import { Header } from './components/Header';
import { CustomerPortal } from './components/Customer/CustomerPortal';
import { CustomerSupportQueue } from './components/Customer/CustomerSupportQueue';
import { LiveQueueDisplay } from './components/LiveQueue/LiveQueueDisplay';
import { StaffDashboard } from './components/Staff/StaffDashboard';
import { AdminPortal } from './components/Admin/AdminPortal';
import { TokenConfirmation } from './components/Customer/TokenConfirmation';
import { SimulatedNotificationModal } from './components/Customer/SimulatedNotificationModal';
import { 
  Building2, 
  ShieldCheck, 
  HeartHandshake, 
  Clock, 
  Phone, 
  MapPin, 
  LifeBuoy,
  Tv,
  Ticket,
  Lock,
  PlusCircle
} from 'lucide-react';

const MainContent = () => {
  const [currentTab, setCurrentTab] = useState('customer');
  const [customerResetTrigger, setCustomerResetTrigger] = useState(0);
  const { userToken, setUserTokenId, authRole } = useQueue();

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [modalType, setModalType] = useState('sms');

  const handleGenerateToken = () => {
    setCurrentTab('customer');
    setCustomerResetTrigger(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 overflow-x-hidden w-full max-w-full">
      
      {/* Primary Header */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onGenerateToken={handleGenerateToken}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 overflow-x-hidden">
        {currentTab === 'customer' && (
          <CustomerPortal
            resetTrigger={customerResetTrigger}
            onViewLiveQueue={() => setCurrentTab('display')}
            onGoToSupport={() => setCurrentTab('support')}
          />
        )}

        {currentTab === 'support' && (
          <CustomerSupportQueue
            onBack={() => setCurrentTab('customer')}
            onTokenGenerated={(newToken) => {
              setUserTokenId(newToken.id);
              setCurrentTab('customer');
            }}
          />
        )}

        {currentTab === 'display' && (
          <LiveQueueDisplay onGenerateToken={handleGenerateToken} />
        )}

        {currentTab === 'staff' && (
          authRole ? (
            <StaffDashboard />
          ) : (
            <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-lg text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#E6F8FE] text-[#292075] mx-auto flex items-center justify-center border border-[#00B5EF]/40 shadow-xs">
                <Lock className="w-8 h-8 text-[#0083ca]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1A1450]">SBI Staff Access Restricted</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  The Single Window Operator (SWO) workstation is restricted to authorized branch employees only. Customers cannot access this area.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('customer')}
                className="w-full py-2.5 px-4 bg-[#292075] text-white rounded-xl text-xs font-bold hover:bg-[#1A1450] transition-colors"
              >
                Return to Customer Token Portal
              </button>
            </div>
          )
        )}

        {currentTab === 'admin' && (
          authRole === 'admin' ? (
            <AdminPortal />
          ) : (
            <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-lg text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-700 mx-auto flex items-center justify-center border border-rose-200 shadow-xs">
                <ShieldCheck className="w-8 h-8 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1A1450]">Branch Manager Access Required</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  The Admin Operations & Policy portal requires Branch Administrator credentials. Customer access is strictly restricted.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('customer')}
                className="w-full py-2.5 px-4 bg-[#292075] text-white rounded-xl text-xs font-bold hover:bg-[#1A1450] transition-colors"
              >
                Return to Customer Portal
              </button>
            </div>
          )
        )}

        {currentTab === 'token-detail' && (
          <TokenConfirmation
            token={userToken}
            onViewLiveQueue={() => setCurrentTab('display')}
            onNewToken={handleGenerateToken}
            onOpenSMSModal={() => {
              setModalType('sms');
              setShowNotificationModal(true);
            }}
            onOpenWhatsappModal={() => {
              setModalType('whatsapp');
              setShowNotificationModal(true);
            }}
          />
        )}
      </main>

      {/* Global Notification Preview Modal */}
      <SimulatedNotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        type={modalType}
        token={userToken}
      />

      {/* Banking Footer with SBI Branding */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
            
            {/* Col 1: Bank Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#292075] p-1 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#292075] font-black text-xs">
                    SBI
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#292075]">भारतीय स्टेट बैंक</div>
                  <strong className="text-[#1A1450] font-black">STATE BANK OF INDIA</strong>
                </div>
              </div>
              <p className="text-slate-500 leading-relaxed">
                The banker to every Indian. Official Branch e-Token & Grahak Mitra Queue Management System.
              </p>
            </div>

            {/* Col 2: Quick Jump */}
            <div>
              <h4 className="font-bold text-[#292075] uppercase tracking-wider mb-2.5">त्वरित लिंक / Quick Access</h4>
              <ul className="space-y-1.5 text-slate-600">
                <li>
                  <button onClick={() => setCurrentTab('customer')} className="hover:text-[#0083ca] transition-colors">
                    • e-Token Kiosk (टोकन पर्ची)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('support')} className="hover:text-[#0083ca] transition-colors">
                    • CMS Grievance Redressal (शिकायत निवारण)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('display')} className="hover:text-[#0083ca] transition-colors">
                    • Live Lobby TV Display Board
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('staff')} className="hover:text-[#0083ca] transition-colors">
                    • SWO & Officer Counter Desk
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('admin')} className="hover:text-[#0083ca] transition-colors">
                    • Branch Operations & Audit Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Assistance & Priority */}
            <div>
              <h4 className="font-bold text-[#292075] uppercase tracking-wider mb-2.5">वरिष्ठ नागरिक एवं सहायता</h4>
              <ul className="space-y-2 text-slate-500">
                <li className="flex items-start gap-2">
                  <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Dedicated priority counter assistance for Senior Citizens (Varishta Nagrik) and Persons with Disability (Divyangjan).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#0083ca] shrink-0 mt-0.5" />
                  <span>Branch Hours: Mon - Sat 10:00 AM to 04:00 PM (Lunch 01:30 - 02:00 PM, 2nd & 4th Sat Holiday).</span>
                </li>
              </ul>
            </div>

            {/* Col 4: Privacy & Security */}
            <div>
              <h4 className="font-bold text-[#292075] uppercase tracking-wider mb-2.5">सुरक्षा एवं हेल्पलाइन</h4>
              <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>SBI Cyber Security Advisory</span>
                </div>
                <p className="text-amber-900 leading-relaxed text-[11px]">
                  SBI officials will NEVER ask for your ATM PIN, Net Banking Password, OTP, or CVV. Never share confidential details.
                </p>
                <div className="text-[10px] font-bold text-[#292075] font-mono pt-1">
                  Toll Free: 1800 1234 / 1800 2100
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>© 2026 State Bank of India. All rights reserved. Grahak Mitra Queue Management System.</span>
            <span>Version 3.0.0 (SBI Brand UI) • Secure Branch e-Token Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <QueueProvider>
      <MainContent />
    </QueueProvider>
  );
}

export default App;
