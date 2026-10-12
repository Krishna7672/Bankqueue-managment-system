import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_SERVICES,
  SUPPORT_ISSUES,
  INITIAL_OFFICERS,
  INITIAL_COUNTERS,
  INITIAL_TOKENS,
  INITIAL_ACTIVITY_LOGS
} from '../data/initialData';
import { soundService } from '../services/soundAndSpeech';

const QueueContext = createContext();

const STORAGE_KEYS = {
  TOKENS: 'apex_bank_tokens_v1',
  COUNTERS: 'apex_bank_counters_v1',
  SERVICES: 'apex_bank_services_v1',
  OFFICERS: 'apex_bank_officers_v1',
  LOGS: 'apex_bank_logs_v1',
  SETTINGS: 'apex_bank_settings_v1',
  ACTIVE_USER_TOKEN: 'apex_bank_user_token_id_v1'
};

const DEFAULT_SETTINGS = {
  bankName: 'State Bank of India',
  bankNameHindi: 'भारतीय स्टेट बैंक',
  branchName: '',
  priorityElderly: true,
  priorityPwD: true,
  audioAnnouncements: true,
  soundChimes: true,
  speechVolume: 0.9,
  smsSimulation: true,
  whatsappSimulation: true,
  operatingHours: '10:00 AM - 04:00 PM (Lunch: 01:30 - 02:00 PM)'
};

export const QueueProvider = ({ children }) => {
  // Load from localStorage or defaults
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [counters, setCounters] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUNTERS);
    return saved ? JSON.parse(saved) : INITIAL_COUNTERS;
  });

  const [officers, setOfficers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OFFICERS);
    return saved ? JSON.parse(saved) : INITIAL_OFFICERS;
  });

  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOKENS);
    return saved ? JSON.parse(saved) : INITIAL_TOKENS;
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Current active token for customer kiosk session
  const [userTokenId, setUserTokenId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_TOKEN) || 'tok-110';
  });

  // Authentication role: null (public customer), 'staff', or 'admin'
  const [authRole, setAuthRole] = useState(null);
  const [currentAuthUser, setCurrentAuthUser] = useState(null);

  // Currently logged-in / active staff counter
  const [activeStaffCounterId, setActiveStaffCounterId] = useState('counter-3');

  const loginStaff = ({ role, officer }) => {
    setAuthRole(role);
    setCurrentAuthUser(officer);
    if (officer) {
      // Find counter assigned to this officer
      const matchedCounter = counters.find(c => c.officerId === officer.id);
      if (matchedCounter) {
        setActiveStaffCounterId(matchedCounter.id);
      }
    }
  };

  const logoutStaff = () => {
    setAuthRole(null);
    setCurrentAuthUser(null);
  };

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUNTERS, JSON.stringify(counters));
  }, [counters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFICERS, JSON.stringify(officers));
  }, [officers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    soundService.toggleSound(settings.soundChimes);
    soundService.toggleSpeech(settings.audioAnnouncements);
    soundService.volume = settings.speechVolume;
  }, [settings]);

  useEffect(() => {
    if (userTokenId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_TOKEN, userTokenId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_TOKEN);
    }
  }, [userTokenId]);

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEYS.TOKENS && e.newValue) {
        setTokens(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEYS.COUNTERS && e.newValue) {
        setCounters(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEYS.LOGS && e.newValue) {
        setActivityLogs(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Helper to add log
  const logActivity = (type, message, counter = '') => {
    const newLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      type,
      message,
      counter
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // Helper to get active user token object
  const userToken = tokens.find(t => t.id === userTokenId) || null;

  // 1. Generate Token
  const generateToken = ({
    serviceId,
    customerName,
    mobile,
    accountNumber = '',
    category = 'General',
    language = 'English',
    notes = '',
    issueId = null
  }) => {
    const service = services.find(s => s.id === serviceId) || {
      id: serviceId,
      name: 'General Enquiry',
      prefix: 'G',
      avgMinutes: 8
    };

    // Calculate sequential token number
    const prefix = service.prefix || 'T';
    const samePrefixTokens = tokens.filter(t => t.tokenNumber.startsWith(prefix + '-'));
    
    // Find highest sequence number today
    let maxSeq = 0;
    samePrefixTokens.forEach(t => {
      const parts = t.tokenNumber.split('-');
      if (parts.length === 2) {
        const num = parseInt(parts[1], 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    });
    const nextSeqNum = maxSeq + 1;
    const tokenNumber = `${prefix}-${String(nextSeqNum).padStart(3, '0')}`;

    // Find best compatible counter
    const compatibleCounters = counters.filter(c => 
      c.assignedServices.includes(serviceId) && c.status !== 'closed'
    );
    const chosenCounter = compatibleCounters.length > 0
      ? compatibleCounters[0]
      : counters.find(c => c.status !== 'closed') || counters[0];

    const chosenOfficer = officers.find(o => o.id === chosenCounter.officerId) || officers[0];

    // Calculate customers ahead
    const waitingSameQueue = tokens.filter(t => 
      t.status === 'waiting' && 
      (t.serviceId === serviceId || (chosenCounter && chosenCounter.assignedServices.includes(t.serviceId)))
    );
    const customersAhead = waitingSameQueue.length;

    // Estimate waiting time (adjust for Senior Citizen or PwD priority)
    const baseMinutes = service.avgMinutes || 8;
    let estimatedMinutes = Math.max(3, (customersAhead * baseMinutes) + (chosenCounter.status === 'busy' ? 5 : 2));
    if (category === 'Person with Disability' || category === 'Senior Citizen') {
      estimatedMinutes = Math.max(3, Math.round(estimatedMinutes * 0.5));
    }

    const newToken = {
      id: `tok-${Date.now()}`,
      tokenNumber,
      serviceId: service.id,
      serviceName: service.name,
      customerName: customerName.trim(),
      mobile: mobile.trim(),
      accountNumber: accountNumber.trim(),
      category,
      language,
      notes: notes.trim(),
      issueId,
      status: 'waiting',
      counterId: chosenCounter.id,
      counterNumber: chosenCounter.number,
      officerId: chosenOfficer.id,
      officerName: chosenOfficer.name,
      createdAt: new Date().toISOString(),
      calledAt: null,
      completedAt: null,
      customersAhead,
      estimatedMinutes
    };

    setTokens(prev => [newToken, ...prev]);
    setUserTokenId(newToken.id);

    logActivity(
      'GENERATE',
      `New token ${tokenNumber} issued to ${customerName} (${category}) for ${service.name}`,
      `Counter ${chosenCounter.number}`
    );

    return newToken;
  };

  // 2. Call Next Token for a Counter
  const callNextToken = (counterId) => {
    const counter = counters.find(c => c.id === counterId);
    if (!counter) return null;

    // Find all waiting tokens that this counter can serve
    const eligibleTokens = tokens.filter(t => 
      t.status === 'waiting' && 
      (counter.assignedServices.includes(t.serviceId) || counter.assignedServices.length === 0)
    );

    if (eligibleTokens.length === 0) {
      return null;
    }

    // Sort by Priority first (PwD & Senior Citizen), then by CreatedAt timestamp
    eligibleTokens.sort((a, b) => {
      const getPriorityScore = (token) => {
        if (settings.priorityPwD && token.category === 'Person with Disability') return 3;
        if (settings.priorityElderly && token.category === 'Senior Citizen') return 2;
        return 1;
      };

      const scoreA = getPriorityScore(a);
      const scoreB = getPriorityScore(b);

      if (scoreA !== scoreB) {
        return scoreB - scoreA; // higher score first
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const nextToken = eligibleTokens[0];
    const officer = officers.find(o => o.id === counter.officerId);

    // Update tokens
    setTokens(prev => prev.map(t => {
      // If previous token was serving at this counter, mark completed or auto-handle
      if (t.counterId === counter.id && t.status === 'serving') {
        return {
          ...t,
          status: 'completed',
          completedAt: new Date().toISOString()
        };
      }
      if (t.id === nextToken.id) {
        return {
          ...t,
          status: 'serving',
          counterId: counter.id,
          counterNumber: counter.number,
          officerId: officer ? officer.id : t.officerId,
          officerName: officer ? officer.name : t.officerName,
          calledAt: new Date().toISOString()
        };
      }
      return t;
    }));

    // Update Counter state
    setCounters(prev => prev.map(c => {
      if (c.id === counter.id) {
        return {
          ...c,
          status: 'busy',
          currentToken: nextToken.tokenNumber,
          totalServed: c.totalServed + (c.currentToken ? 1 : 0)
        };
      }
      return c;
    }));

    // Audio & Voice Announcement
    if (settings.audioAnnouncements || settings.soundChimes) {
      soundService.announceToken(nextToken.tokenNumber, counter.number, officer ? officer.name : '');
    }

    logActivity(
      'CALL',
      `Officer ${officer ? officer.name : 'Staff'} called token ${nextToken.tokenNumber} to Counter ${counter.number}`,
      `Counter ${counter.number}`
    );

    return nextToken;
  };

  // 3. Recall Token (re-announce token)
  const recallToken = (tokenId) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return;

    soundService.announceToken(token.tokenNumber, token.counterNumber, token.officerName);
    logActivity('RECALL', `Recalled token ${token.tokenNumber} to Counter ${token.counterNumber}`, `Counter ${token.counterNumber}`);
  };

  // 4. Mark Serving
  const markServing = (tokenId) => {
    setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, status: 'serving' } : t));
    const token = tokens.find(t => t.id === tokenId);
    if (token) {
      logActivity('SERVING', `Serving commenced for token ${token.tokenNumber}`, `Counter ${token.counterNumber}`);
    }
  };

  // 5. Complete Service
  const completeService = (tokenId, notes = '') => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return;

    setTokens(prev => prev.map(t => {
      if (t.id === tokenId) {
        return {
          ...t,
          status: 'completed',
          completedAt: new Date().toISOString(),
          completionNotes: notes || t.notes
        };
      }
      return t;
    }));

    // Update counter
    setCounters(prev => prev.map(c => {
      if (c.id === token.counterId || c.number === token.counterNumber) {
        return {
          ...c,
          status: 'open',
          currentToken: null,
          totalServed: c.totalServed + 1
        };
      }
      return c;
    }));

    // Update officer
    if (token.officerId) {
      setOfficers(prev => prev.map(o => {
        if (o.id === token.officerId) {
          return {
            ...o,
            servedToday: o.servedToday + 1
          };
        }
        return o;
      }));
    }

    logActivity('COMPLETE', `Service completed for token ${token.tokenNumber} (${token.serviceName})`, `Counter ${token.counterNumber}`);
  };

  // 6. Skip Token
  const skipToken = (tokenId) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return;

    setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, status: 'skipped' } : t));
    setCounters(prev => prev.map(c => {
      if (c.id === token.counterId) {
        return { ...c, status: 'open', currentToken: null };
      }
      return c;
    }));

    logActivity('SKIP', `Token ${token.tokenNumber} skipped by officer`, `Counter ${token.counterNumber}`);
  };

  // 7. Mark No-Show
  const markNoShow = (tokenId) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return;

    setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, status: 'noshow' } : t));
    setCounters(prev => prev.map(c => {
      if (c.id === token.counterId) {
        return { ...c, status: 'open', currentToken: null };
      }
      return c;
    }));

    logActivity('NOSHOW', `Token ${token.tokenNumber} marked as No-Show`, `Counter ${token.counterNumber}`);
  };

  // 8. Transfer Token
  const transferToken = (tokenId, targetCounterId, targetServiceId) => {
    const token = tokens.find(t => t.id === tokenId);
    const targetCounter = counters.find(c => c.id === targetCounterId);
    const targetService = services.find(s => s.id === targetServiceId);

    if (!token || !targetCounter) return;

    const targetOfficer = officers.find(o => o.id === targetCounter.officerId);

    setTokens(prev => prev.map(t => {
      if (t.id === tokenId) {
        return {
          ...t,
          counterId: targetCounter.id,
          counterNumber: targetCounter.number,
          officerId: targetOfficer ? targetOfficer.id : t.officerId,
          officerName: targetOfficer ? targetOfficer.name : t.officerName,
          serviceId: targetService ? targetService.id : t.serviceId,
          serviceName: targetService ? targetService.name : t.serviceName,
          status: 'waiting' // transferred to target waiting queue
        };
      }
      return t;
    }));

    // If source counter was serving this token, free up source counter
    setCounters(prev => prev.map(c => {
      if (c.id === token.counterId && c.currentToken === token.tokenNumber) {
        return { ...c, status: 'open', currentToken: null };
      }
      return c;
    }));

    logActivity(
      'TRANSFER',
      `Token ${token.tokenNumber} transferred to Counter ${targetCounter.number} (${targetOfficer?.name || ''})`,
      `Counter ${targetCounter.number}`
    );
  };

  // 9. Cancel Token
  const cancelToken = (tokenId) => {
    const token = tokens.find(t => t.id === tokenId);
    if (!token) return;

    setTokens(prev => prev.map(t => t.id === tokenId ? { ...t, status: 'cancelled' } : t));
    if (token.counterId) {
      setCounters(prev => prev.map(c => {
        if (c.id === token.counterId && c.currentToken === token.tokenNumber) {
          return { ...c, status: 'open', currentToken: null };
        }
        return c;
      }));
    }

    logActivity('CANCEL', `Token ${token.tokenNumber} was cancelled`, `Counter ${token.counterNumber || 'Kiosk'}`);
  };

  // Counter management
  const updateCounter = (counterId, updates) => {
    setCounters(prev => prev.map(c => c.id === counterId ? { ...c, ...updates } : c));
    logActivity('CONFIG', `Counter ${counterId} configuration updated`);
  };

  const toggleCounterStatus = (counterId) => {
    setCounters(prev => prev.map(c => {
      if (c.id === counterId) {
        const nextStatus = c.status === 'open' ? 'paused' : c.status === 'paused' ? 'closed' : 'open';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Service management
  const updateService = (serviceId, updates) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, ...updates } : s));
  };

  // Reset to default mock data
  const resetToDemoData = () => {
    setTokens(INITIAL_TOKENS);
    setCounters(INITIAL_COUNTERS);
    setOfficers(INITIAL_OFFICERS);
    setServices(INITIAL_SERVICES);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setUserTokenId('tok-110');
    localStorage.clear();
    logActivity('RESET', 'System queue state restored to pristine demonstration data');
  };

  return (
    <QueueContext.Provider
      value={{
        services,
        counters,
        officers,
        tokens,
        activityLogs,
        settings,
        setSettings,
        userToken,
        userTokenId,
        setUserTokenId,
        authRole,
        currentAuthUser,
        loginStaff,
        logoutStaff,
        activeStaffCounterId,
        setActiveStaffCounterId,
        generateToken,
        callNextToken,
        recallToken,
        markServing,
        completeService,
        skipToken,
        markNoShow,
        transferToken,
        cancelToken,
        updateCounter,
        toggleCounterStatus,
        updateService,
        resetToDemoData,
        logActivity
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
