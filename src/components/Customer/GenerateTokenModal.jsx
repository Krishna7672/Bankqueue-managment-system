import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Ticket, 
  User, 
  Phone, 
  ShieldCheck, 
  CreditCard, 
  Globe, 
  HeartHandshake, 
  AlertCircle, 
  CheckCircle2,
  Search,
  Clock
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import { SbiLogo } from '../SbiLogo';
import { ServiceIcon } from '../ServiceIcon';
import { soundService } from '../../services/soundAndSpeech';

export const GenerateTokenModal = ({ isOpen, onClose, onTokenGenerated }) => {
  const { services, generateToken } = useQueue();

  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    accountNumber: '',
    category: 'General',
    language: 'English',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchService, setSearchService] = useState('');

  // Default to first active service when opened
  useEffect(() => {
    if (isOpen) {
      const activeServices = services.filter(s => s.active);
      if (activeServices.length > 0 && !selectedServiceId) {
        setSelectedServiceId(activeServices[0].id);
      }
      setErrors({});
    }
  }, [isOpen, services]);

  if (!isOpen) return null;

  const categories = [
    {
      id: 'General',
      label: 'General Citizen',
      labelHindi: 'सामान्य',
      priority: false
    },
    {
      id: 'Senior Citizen',
      label: 'Senior Citizen (60+)',
      labelHindi: 'वरिष्ठ नागरिक',
      priority: true
    },
    {
      id: 'Person with Disability',
      label: 'PwD / Divyangjan',
      labelHindi: 'दिव्यांगजन',
      priority: true
    }
  ];

  const activeServices = services.filter(s => s.active);
  const filteredServices = activeServices.filter(s => 
    s.name.toLowerCase().includes(searchService.toLowerCase()) ||
    s.category.toLowerCase().includes(searchService.toLowerCase())
  );

  const selectedService = services.find(s => s.id === selectedServiceId) || activeServices[0];

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required (नाम आवश्यक है)';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile) {
      newErrors.mobile = 'Mobile number is required for SMS updates (मोबाइल आवश्यक)';
    } else if (cleanMobile.length !== 10) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!selectedServiceId) {
      newErrors.service = 'Please select a banking service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newToken = generateToken({
        serviceId: selectedServiceId,
        customerName: formData.customerName,
        mobile: formData.mobile,
        accountNumber: formData.accountNumber,
        category: formData.category,
        language: formData.language,
        notes: formData.notes
      });

      soundService.playChime();
      setIsSubmitting(false);
      onTokenGenerated(newToken);
      onClose();
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with SBI Gradient */}
        <div className="bg-gradient-to-r from-[#292075] via-[#1B1464] to-[#140F3E] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors active:scale-95"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-1.5 flex items-center justify-center shadow-md shrink-0">
              <SbiLogo className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[10px] text-[#00B5EF] font-bold tracking-wider leading-none">
                भारतीय स्टेट बैंक • STATE BANK OF INDIA
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white mt-1">
                Instant e-Token Generator (ई-टोकन जनरेटर)
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Select your banking service and enter your contact details to generate an official branch queue token.
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Service Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Select Banking Service <span className="text-rose-500">*</span>
              </label>
              {selectedService && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#0083ca] border border-blue-100">
                  Prefix {selectedService.prefix} • ~{selectedService.avgMinutes}m wait
                </span>
              )}
            </div>

            {/* Quick search if many services */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search service (e.g. Cash, Account, Card)..."
                value={searchService}
                onChange={(e) => setSearchService(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00B5EF]"
              />
            </div>

            {/* Service Grid with Radio Selection */}
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {filteredServices.map(service => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'border-[#0083ca] bg-[#E6F8FE] text-[#1A1450] ring-1 ring-[#00B5EF]'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#292075] text-[#00B5EF]' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <ServiceIcon name={service.icon} className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold truncate leading-tight">{service.name}</div>
                      <div className="text-[9px] text-slate-400">{service.category}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.service && (
              <p className="text-xs text-rose-500 mt-1">{errors.service}</p>
            )}
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.customerName 
                      ? 'border-rose-400 focus:ring-rose-200' 
                      : 'border-slate-200 focus:border-[#00B5EF] focus:ring-[#00B5EF]/20'
                  }`}
                />
              </div>
              {errors.customerName && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.customerName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.mobile 
                      ? 'border-rose-400 focus:ring-rose-200' 
                      : 'border-slate-200 focus:border-[#00B5EF] focus:ring-[#00B5EF]/20'
                  }`}
                />
              </div>
              {errors.mobile && (
                <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.mobile}
                </p>
              )}
            </div>
          </div>

          {/* Customer Category Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Customer Priority Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(cat => {
                const isSelected = formData.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-[#292075] bg-[#E6F8FE] text-[#1A1450] ring-1 ring-[#00B5EF]/40 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{cat.label}</div>
                    <div className="text-[9px] text-slate-400 font-hindi">{cat.labelHindi}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account Number (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Bank Account Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
            </div>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. 31098452391 (leave empty if not applicable)"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B5EF]/20 focus:border-[#00B5EF] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Footer Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-start gap-2 text-[11px] text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>SBI officials will never ask for your ATM PIN or Net Banking OTP.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel (रद्द करें)
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0083ca] via-[#0092dd] to-[#00B5EF] hover:from-[#0072b2] hover:to-[#0083ca] text-white text-xs font-extrabold shadow-md shadow-[#0083ca]/25 hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Issuing Token...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Generate e-Token (टोकन बनाएं)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateTokenModal;
