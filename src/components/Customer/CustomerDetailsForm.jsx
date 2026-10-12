import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  User, 
  Phone, 
  CreditCard, 
  HeartHandshake, 
  Globe, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import { useQueue } from '../../context/QueueContext';
import { ServiceIcon } from '../ServiceIcon';

export const CustomerDetailsForm = ({ selectedService, onBack, onTokenGenerated }) => {
  const { generateToken } = useQueue();

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

  const categories = [
    {
      id: 'General',
      label: 'General Citizen',
      labelHindi: 'सामान्य नागरिक',
      desc: 'Standard sequential queue processing',
      priority: false,
      tier: 'Standard FIFO'
    },
    {
      id: 'Senior Citizen',
      label: 'Senior Citizen (60+)',
      labelHindi: 'वरिष्ठ नागरिक',
      desc: 'Fast-track priority queue & dedicated seated counter',
      priority: true,
      tier: 'Priority Tier 2'
    },
    {
      id: 'Person with Disability',
      label: 'Person with Disability',
      labelHindi: 'दिव्यांगजन ग्राहक',
      desc: 'Accessible counter priority & personal officer care',
      priority: true,
      tier: 'Priority Tier 3'
    }
  ];

  const languages = ['English', 'Hindi', 'Spanish', 'French', 'Bengali', 'Marathi', 'Tamil', 'Telugu'];

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Please enter customer name (नाम दर्ज करें)';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required for SMS queue alerts (मोबाइल नंबर आवश्यक)';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const token = generateToken({
        serviceId: selectedService.id,
        customerName: formData.customerName,
        mobile: formData.mobile,
        accountNumber: formData.accountNumber,
        category: formData.category,
        language: formData.language,
        notes: formData.notes
      });

      setIsSubmitting(false);
      onTokenGenerated(token);
    }, 400);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Step Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#292075] bg-white px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-2xs active:scale-95"
          title="Return to the banking service selection grid"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Back to All Services (वापस)</span>
        </button>

        <span className="text-xs font-bold text-[#0083ca] bg-[#E6F8FE] border border-[#00B5EF]/30 px-3 py-1 rounded-full">
          Step 2 of 3: Customer Details (ग्राहक विवरण)
        </span>
      </div>

      {/* Selected Service Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F8FE] text-[#0083ca] border border-[#00B5EF]/30 flex items-center justify-center shrink-0">
            <ServiceIcon name={selectedService.icon} className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Selected Service:</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-slate-100 rounded text-slate-700">
                Prefix {selectedService.prefix}
              </span>
            </div>
            <h3 className="text-base font-bold text-[#1A1450]">{selectedService.name}</h3>
            <p className="text-xs text-slate-500">{selectedService.description}</p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="text-xs font-bold text-[#0083ca] hover:text-[#292075] bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shrink-0"
        >
          Change Service
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#1A1450]">Enter Customer Queue Information</h2>
          <p className="text-xs text-slate-500 mt-1">
            We only collect contact information required to identify your turn and send electronic queue status updates.
          </p>
        </div>

        {/* Full Name & Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] font-bold text-slate-400">Required</span>
            </div>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className={`w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.customerName 
                    ? 'border-rose-400 focus:ring-rose-200' 
                    : 'border-slate-200 focus:border-[#00B5EF] focus:ring-[#00B5EF]/20'
                }`}
              />
            </div>
            {errors.customerName && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.customerName}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] font-bold text-slate-400">Required (For SMS)</span>
            </div>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                className={`w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50/50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.mobile 
                    ? 'border-rose-400 focus:ring-rose-200' 
                    : 'border-slate-200 focus:border-[#00B5EF] focus:ring-[#00B5EF]/20'
                }`}
              />
            </div>
            {errors.mobile && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.mobile}
              </p>
            )}
          </div>
        </div>

        {/* Account Number (Optional) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Bank Account Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <span className="text-[11px] text-slate-400 italic">Not required for enquiries / new accounts</span>
          </div>
          <div className="relative">
            <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. 31098452391 (Optional - leave blank if not known)"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B5EF]/20 focus:border-[#00B5EF] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Customer Category with Visual Radios */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Customer Category <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">Select applicable priority</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const isSelected = formData.category === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#292075] bg-[#E6F8FE]/60 ring-2 ring-[#00B5EF]/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-[#292075] bg-[#292075]' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="text-xs font-bold text-[#1A1450]">{cat.label}</span>
                    </div>

                    {cat.priority && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Priority
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-hindi mb-1">{cat.labelHindi}</div>
                  <p className="text-[11px] text-slate-500 leading-snug">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preferred Language & Request Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Preferred Language (भाषा)
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B5EF]/20 focus:border-[#00B5EF] focus:bg-white transition-all appearance-none"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Description / Remarks <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={1}
                placeholder="e.g. Deposit bearer cheque Rs 50,000"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B5EF]/20 focus:border-[#00B5EF] focus:bg-white transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Banking Security Notice */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed">
            <strong className="text-amber-950 font-bold">सुरक्षा प्रतिज्ञा (SBI Security Advisory):</strong> State Bank of India will NEVER ask for your ATM PIN, Internet Banking Password, OTP, or CVV for queue management. Keep credentials confidential.
          </p>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors active:scale-95"
          >
            Cancel (रद्द करें)
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#292075] hover:bg-[#1A1450] active:scale-95 text-white text-xs font-bold shadow-md shadow-[#292075]/20 hover:shadow-lg transition-all flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#00B5EF]"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Generating SBI e-Token...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#00B5EF]" />
                <span>Generate SBI e-Token (टोकन बनाएं)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerDetailsForm;
