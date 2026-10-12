import React, { useState, useEffect } from 'react';
import { useQueue } from '../../context/QueueContext';
import { ServiceSelector } from './ServiceSelector';
import { CustomerDetailsForm } from './CustomerDetailsForm';
import { TokenConfirmation } from './TokenConfirmation';
import { CustomerSupportQueue } from './CustomerSupportQueue';
import { SimulatedNotificationModal } from './SimulatedNotificationModal';

export const CustomerPortal = ({ currentView, onViewLiveQueue, onGoToSupport, resetTrigger }) => {
  const { userToken, setUserTokenId } = useQueue();

  const [step, setStep] = useState('select-service');
  const [selectedService, setSelectedService] = useState(null);
  
  // Notification modal state
  const [modalType, setModalType] = useState('sms');
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // When resetTrigger fires (e.g. user clicked "Generate Token" at top), return to service selection
  useEffect(() => {
    if (resetTrigger) {
      setSelectedService(null);
      setStep('select-service');
    }
  }, [resetTrigger]);

  const handleSelectService = (service) => {
    setSelectedService(service);
    setStep('details-form');
  };

  const handleTokenGenerated = (newToken) => {
    setUserTokenId(newToken.id);
    setStep('confirmation');
  };

  const handleNewToken = () => {
    setSelectedService(null);
    setStep('select-service');
  };

  return (
    <div className="space-y-6">
      {step === 'select-service' && (
        <ServiceSelector
          userToken={userToken}
          onViewToken={() => setStep('confirmation')}
          onSelectService={handleSelectService}
          onGoToSupport={onGoToSupport}
        />
      )}

      {step === 'details-form' && selectedService && (
        <CustomerDetailsForm
          selectedService={selectedService}
          onBack={() => setStep('select-service')}
          onTokenGenerated={handleTokenGenerated}
        />
      )}

      {step === 'confirmation' && (
        <TokenConfirmation
          token={userToken}
          onViewLiveQueue={onViewLiveQueue}
          onNewToken={handleNewToken}
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

      {/* Simulated SMS and WhatsApp Notification Modal */}
      <SimulatedNotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        type={modalType}
        token={userToken}
      />
    </div>
  );
};

export default CustomerPortal;
