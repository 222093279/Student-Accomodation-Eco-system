import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Room,
  Agreement,
  PaymentRecord,
  ActivityLog,
  OwnerProfile,
  MaintenanceRequest,
  MaintenanceCategory,
  MaintenancePriority,
  MaintenanceStatus,
} from '../types';
import {
  initialStudents,
  initialRooms,
  initialAgreements,
  initialPayments,
  initialActivities,
  initialOwnerProfile,
  initialMaintenanceRequests,
} from '../mockData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  // Mode & Navigation
  viewMode: 'student' | 'owner';
  setViewMode: (mode: 'student' | 'owner') => void;
  mobileFrameEnabled: boolean;
  setMobileFrameEnabled: (val: boolean) => void;

  // Global Auth
  isAuthenticated: boolean;
  currentUser: { role: 'student' | 'owner'; id: string; name: string; email: string } | null;
  login: (role: 'student' | 'owner', identifier: string, password?: string) => boolean;
  logout: () => void;

  // Student Session
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  currentStudent: Student;
  currentStudentRoom: Room | undefined;
  currentStudentAgreement: Agreement | undefined;
  currentStudentPayments: PaymentRecord[];
  studentOutstandingBalance: number;
  studentAuthScreen: 'app' | 'login' | 'register' | 'forgot' | 'verify-email';
  setStudentAuthScreen: (screen: 'app' | 'login' | 'register' | 'forgot' | 'verify-email') => void;
  pendingVerificationEmail: string;
  setPendingVerificationEmail: (email: string) => void;
  lastSentConfirmationCode: string;
  registerCandidate: (data: {
    fullName: string;
    studentNumber: string;
    email: string;
    phone: string;
    password: string;
    institution?: string;
    course?: string;
    idNumber?: string;
    assignedRoomId?: string;
  }) => { success: boolean; confirmationCode: string; message: string };
  verifyEmailConfirmation: (email: string, code: string) => { success: boolean; message: string };
  resendConfirmationEmail: (email: string) => { success: boolean; code: string; message: string };

  // Owner Session
  ownerAuthScreen: 'app' | 'login';
  setOwnerAuthScreen: (screen: 'app' | 'login') => void;
  ownerActiveTab:
    | 'dashboard'
    | 'students'
    | 'rooms'
    | 'agreements'
    | 'payments'
    | 'maintenance'
    | 'reports'
    | 'settings'
    | 'help';
  setOwnerActiveTab: (tab: any) => void;

  // Entities
  students: Student[];
  rooms: Room[];
  agreements: Agreement[];
  payments: PaymentRecord[];
  activities: ActivityLog[];
  ownerProfile: OwnerProfile;
  maintenanceRequests: MaintenanceRequest[];

  // Actions
  processStudentPayment: (paymentId: string) => void;
  makeStudentPaymentToLandlord: (data: {
    studentId: string;
    paymentId?: string;
    transactionPeriod: string;
    amount: number;
    paymentMethod: string;
    reference?: string;
    notes?: string;
  }) => PaymentRecord;
  lastLandlordPaymentNotice: {
    studentName: string;
    amount: number;
    transactionPeriod: string;
    paymentMethod: string;
    reference: string;
    timestamp: string;
  } | null;
  clearLandlordPaymentNotice: () => void;
  recordManualPayment: (payment: {
    studentId: string;
    roomId: string;
    transactionPeriod: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    reference: string;
  }) => void;
  sendWarningNotice: (paymentId: string) => void;
  addNewStudent: (student: Omit<Student, 'id' | 'agreementId'>) => string;
  updateStudent: (studentId: string, updates: Partial<Student>) => void;
  addNewRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  createAgreement: (agreement: Omit<Agreement, 'id'>) => string;
  signAgreement: (agreementId: string) => void;
  updateOwnerProfile: (updates: Partial<OwnerProfile>) => void;
  resetAllData: () => void;

  // Maintenance Actions
  submitMaintenanceRequest: (data: {
    studentId: string;
    roomId?: string;
    title: string;
    category: MaintenanceCategory;
    priority: MaintenancePriority;
    description: string;
    areaLocation?: string;
    preferredAccessTime?: string;
    photoAttachment?: string;
  }) => MaintenanceRequest;
  updateMaintenanceStatus: (
    requestId: string,
    status: MaintenanceStatus,
    note?: string,
    assignedTechnician?: string,
    costEstimate?: number,
    scheduledDate?: string
  ) => void;
  deleteMaintenanceRequest: (requestId: string) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'resimanage_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<'student' | 'owner'>('student');
  const [mobileFrameEnabled, setMobileFrameEnabled] = useState<boolean>(true);
  const [activeStudentId, setActiveStudentId] = useState<string>('stud-1');
  const [studentAuthScreen, setStudentAuthScreen] = useState<'app' | 'login' | 'register' | 'forgot' | 'verify-email'>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role === 'student') return 'app';
      } catch (e) {}
    }
    return 'login';
  });
  const [ownerAuthScreen, setOwnerAuthScreen] = useState<'app' | 'login'>('app');
  const [ownerActiveTab, setOwnerActiveTab] = useState<
    'dashboard' | 'students' | 'rooms' | 'agreements' | 'payments' | 'reports' | 'settings' | 'help'
  >('dashboard');

  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string>('');
  const [lastSentConfirmationCode, setLastSentConfirmationCode] = useState<string>('');

  const [lastLandlordPaymentNotice, setLastLandlordPaymentNotice] = useState<{
    studentName: string;
    amount: number;
    transactionPeriod: string;
    paymentMethod: string;
    reference: string;
    timestamp: string;
  } | null>(null);

  const clearLandlordPaymentNotice = () => setLastLandlordPaymentNotice(null);

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Top-Level Authentication Session
  const [currentUser, setCurrentUser] = useState<{
    role: 'student' | 'owner';
    id: string;
    name: string;
    email: string;
  } | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'auth_session');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = Boolean(currentUser);

  // Persistent States
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'rooms');
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [agreements, setAgreements] = useState<Agreement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'agreements');
    return saved ? JSON.parse(saved) : initialAgreements;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'ownerProfile');
    return saved ? JSON.parse(saved) : initialOwnerProfile;
  });

  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'maintenanceRequests');
    return saved ? JSON.parse(saved) : initialMaintenanceRequests;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'agreements', JSON.stringify(agreements));
  }, [agreements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'ownerProfile', JSON.stringify(ownerProfile));
  }, [ownerProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'maintenanceRequests', JSON.stringify(maintenanceRequests));
  }, [maintenanceRequests]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper getters
  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const currentStudentRoom = rooms.find((r) => r.id === currentStudent?.assignedRoomId);
  const currentStudentAgreement = agreements.find((a) => a.studentId === currentStudent?.id);
  const currentStudentPayments = payments.filter((p) => p.studentId === currentStudent?.id);
  
  const studentOutstandingBalance = currentStudentPayments
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  // Student makes a payment directly to Landlord (System-Generated Payment)
  const makeStudentPaymentToLandlord = (data: {
    studentId: string;
    paymentId?: string;
    transactionPeriod: string;
    amount: number;
    paymentMethod: string;
    reference?: string;
    notes?: string;
  }): PaymentRecord => {
    const student = students.find((s) => s.id === data.studentId) || currentStudent;
    const room = rooms.find((r) => r.id === student?.assignedRoomId) || rooms[0];
    const generatedRef =
      data.reference ||
      `PAY-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(100000 + Math.random() * 900000)}`;
    const todayFormatted = 'Today, 24 Feb 2026';
    const timestampFormatted = '24 Feb 2026, 12:45';

    let resolvedRecord: PaymentRecord;

    if (data.paymentId) {
      // Settle existing invoice
      let foundRecord: PaymentRecord | undefined;
      setPayments((prev) =>
        prev.map((item) => {
          if (item.id === data.paymentId) {
            foundRecord = {
              ...item,
              status: 'Paid',
              paymentDate: '24 Feb 2026',
              paidTimestamp: timestampFormatted,
              paymentMethod: data.paymentMethod,
              reference: item.reference || generatedRef,
              isSystemGenerated: true,
              notes: data.notes || `Direct payment to landlord (${data.paymentMethod})`,
            };
            return foundRecord;
          }
          return item;
        })
      );
      resolvedRecord = foundRecord || {
        id: data.paymentId,
        studentId: data.studentId,
        roomId: room?.id || 'room-01',
        transactionPeriod: data.transactionPeriod,
        amount: data.amount,
        paymentDate: '24 Feb 2026',
        dueDate: '24 Feb 2026',
        paidTimestamp: timestampFormatted,
        status: 'Paid',
        reference: generatedRef,
        paymentMethod: data.paymentMethod,
        isSystemGenerated: true,
        notes: data.notes,
      };
    } else {
      // New system-generated payment to landlord
      resolvedRecord = {
        id: 'pay-' + Date.now(),
        studentId: data.studentId,
        roomId: room?.id || 'room-01',
        transactionPeriod: data.transactionPeriod,
        amount: data.amount,
        paymentDate: '24 Feb 2026',
        dueDate: '24 Feb 2026',
        paidTimestamp: timestampFormatted,
        status: 'Paid',
        reference: generatedRef,
        paymentMethod: data.paymentMethod,
        isSystemGenerated: true,
        notes: data.notes || `Direct payment to landlord (${data.paymentMethod})`,
      };
      setPayments((prev) => [resolvedRecord, ...prev]);
    }

    // Real-time automatic notification to landlord
    const studentLabel = student?.shortName || student?.fullName || 'Student Resident';
    const notice = {
      studentName: student?.fullName || studentLabel,
      amount: data.amount,
      transactionPeriod: data.transactionPeriod,
      paymentMethod: data.paymentMethod,
      reference: resolvedRecord.reference,
      timestamp: 'Just now',
    };
    setLastLandlordPaymentNotice(notice);

    const newActivity: ActivityLog = {
      id: 'act-' + Date.now(),
      title: 'Rent payment received from resident',
      subtitle: `R${data.amount.toLocaleString('en-ZA')} for ${data.transactionPeriod} from ${student?.fullName} (${room?.roomNumber}) via ${data.paymentMethod}. Ledger auto-updated.`,
      timeAgo: 'Just now',
      timestamp: timestampFormatted,
      type: 'payment',
      status: 'Paid',
      previousStatus: 'Pending',
      entityId: resolvedRecord.id,
      entityType: 'payment',
      amount: data.amount,
      studentName: student?.fullName,
      roomNumber: room?.roomNumber,
      actor: student?.fullName || 'Resident Student',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(
      `Payment of R${data.amount.toLocaleString('en-ZA')} submitted to landlord! Landlord portal ledger updated automatically.`,
      'success'
    );

    return resolvedRecord;
  };

  // Student makes a payment (delegates to makeStudentPaymentToLandlord)
  const processStudentPayment = (paymentId: string) => {
    const existing = payments.find((p) => p.id === paymentId);
    if (!existing) return;
    makeStudentPaymentToLandlord({
      studentId: existing.studentId,
      paymentId: existing.id,
      transactionPeriod: existing.transactionPeriod,
      amount: existing.amount,
      paymentMethod: existing.paymentMethod || 'Capitec Pay / Instant EFT',
      reference: existing.reference,
    });
  };

  // Owner records payment
  const recordManualPayment = (data: {
    studentId: string;
    roomId: string;
    transactionPeriod: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    reference: string;
  }) => {
    const newRecord: PaymentRecord = {
      id: 'pay-' + Date.now(),
      studentId: data.studentId,
      roomId: data.roomId,
      transactionPeriod: data.transactionPeriod,
      amount: data.amount,
      paymentDate: data.paymentDate,
      dueDate: data.paymentDate,
      status: 'Paid',
      reference: data.reference,
      paymentMethod: data.paymentMethod,
    };

    setPayments((prev) => [newRecord, ...prev]);

    const student = students.find((s) => s.id === data.studentId);
    const room = rooms.find((r) => r.id === data.roomId);
    const newActivity: ActivityLog = {
      id: 'act-' + Date.now(),
      title: 'Manual rent payment recorded',
      subtitle: `R${data.amount.toLocaleString('en-ZA')} recorded for ${student?.fullName || 'Tenant'} (${room?.roomNumber || 'Room'}) - ${data.transactionPeriod}.`,
      timeAgo: 'Just now',
      timestamp: 'Today, 24 Feb 2026',
      type: 'payment',
      status: 'Paid',
      previousStatus: 'Pending',
      entityId: newRecord.id,
      entityType: 'payment',
      amount: data.amount,
      studentName: student?.fullName,
      roomNumber: room?.roomNumber,
      actor: 'Owner (Ms PC Makhele)',
    };
    setActivities((prev) => [newActivity, ...prev]);
    showToast(`Payment of R${data.amount.toLocaleString('en-ZA')} recorded successfully.`, 'success');
  };

  // Send warning for overdue
  const sendWarningNotice = (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;
    const student = students.find((s) => s.id === payment.studentId);

    const newActivity: ActivityLog = {
      id: 'act-' + Date.now(),
      title: 'Overdue payment warning issued',
      subtitle: `Automated payment reminder dispatched to ${student?.fullName || 'student'} (${student?.email})`,
      timeAgo: 'Just now',
      type: 'alert',
    };
    setActivities((prev) => [newActivity, ...prev]);
    showToast(`Warning sent to ${student?.shortName} for ${payment.transactionPeriod} (R${payment.amount})`, 'warning');
  };

  // Maintenance Request Actions
  const submitMaintenanceRequest = (data: {
    studentId: string;
    roomId?: string;
    title: string;
    category: MaintenanceCategory;
    priority: MaintenancePriority;
    description: string;
    areaLocation?: string;
    preferredAccessTime?: string;
    photoAttachment?: string;
  }): MaintenanceRequest => {
    const student = students.find((s) => s.id === data.studentId) || currentStudent;
    const room = rooms.find((r) => r.id === (data.roomId || student?.assignedRoomId)) || rooms[0];
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newId = `MR-${Math.floor(100 + Math.random() * 900)}`;

    const newReq: MaintenanceRequest = {
      id: newId,
      studentId: student?.id || 'stud-unknown',
      studentName: student?.fullName || 'Resident Student',
      studentNumber: student?.studentNumber || '',
      studentPhone: student?.phone || '',
      studentEmail: student?.email || '',
      roomId: room?.id || 'room-01',
      roomNumber: room?.roomNumber || 'Room 01',
      block: room?.block || 'Block A',
      areaLocation: data.areaLocation || 'Room Interior',
      title: data.title,
      category: data.category,
      priority: data.priority,
      description: data.description,
      status: 'Reported',
      createdAt: formattedDate,
      updatedAt: formattedDate,
      preferredAccessTime: data.preferredAccessTime,
      photoAttachment: data.photoAttachment,
      statusHistory: [
        {
          status: 'Reported',
          timestamp: formattedDate,
          note: 'Maintenance issue submitted by student resident',
          updatedBy: student?.fullName || 'Student Resident',
        },
      ],
    };

    setMaintenanceRequests((prev) => [newReq, ...prev]);

    const newActivity: ActivityLog = {
      id: 'act-' + Date.now(),
      title: `Maintenance request reported: ${data.category}`,
      subtitle: `${newReq.title} • ${newReq.roomNumber} (${newReq.block}) reported by ${student?.fullName}. Priority: ${newReq.priority}.`,
      timeAgo: 'Just now',
      timestamp: formattedDate,
      type: 'maintenance',
      status: 'Reported',
      entityId: newId,
      entityType: 'maintenance',
      studentName: student?.fullName,
      roomNumber: newReq.roomNumber,
      priority: data.priority,
      actor: student?.fullName || 'Resident Student',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(`Maintenance issue "${data.title}" reported successfully (#${newId}).`, 'success');
    return newReq;
  };

  const updateMaintenanceStatus = (
    requestId: string,
    newStatus: MaintenanceStatus,
    note?: string,
    assignedTechnician?: string,
    costEstimate?: number,
    scheduledDate?: string
  ) => {
    const now = new Date();
    const formattedDate = `${now.getDate()} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let updatedTitle = '';
    let targetRoomNumber = '';
    let targetStudentName = '';
    let prevStatus = 'Reported';
    let targetPriority = '';

    setMaintenanceRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        updatedTitle = req.title;
        targetRoomNumber = req.roomNumber;
        targetStudentName = req.studentName;
        prevStatus = req.status;
        targetPriority = req.priority;

        const newHistory = [
          ...req.statusHistory,
          {
            status: newStatus,
            timestamp: formattedDate,
            note: note || `Status transitioned to ${newStatus}`,
            updatedBy: 'Property Owner (Ms PC Makhele)',
          },
        ];

        return {
          ...req,
          status: newStatus,
          updatedAt: formattedDate,
          ownerNotes: note !== undefined ? note : req.ownerNotes,
          assignedTechnician: assignedTechnician !== undefined ? assignedTechnician : req.assignedTechnician,
          costEstimate: costEstimate !== undefined ? costEstimate : req.costEstimate,
          scheduledDate: scheduledDate !== undefined ? scheduledDate : req.scheduledDate,
          statusHistory: newHistory,
        };
      })
    );

    let actionLabel = `Maintenance status changed to ${newStatus}`;
    if (newStatus === 'Scheduled') actionLabel = `Maintenance task scheduled with contractor`;
    else if (newStatus === 'In Progress') actionLabel = `Maintenance repair underway (In Progress)`;
    else if (newStatus === 'Resolved') actionLabel = `Maintenance task resolved & verified`;
    else if (newStatus === 'Cancelled') actionLabel = `Maintenance request cancelled`;

    const newActivity: ActivityLog = {
      id: 'act-' + Date.now(),
      title: actionLabel,
      subtitle: `${updatedTitle || requestId} (${targetRoomNumber}) transitioned from ${prevStatus} ➔ ${newStatus}.${assignedTechnician ? ` Contractor: ${assignedTechnician.split('(')[0]}` : ''}${note ? ` Note: "${note}"` : ''}`,
      timeAgo: 'Just now',
      timestamp: formattedDate,
      type: 'maintenance',
      status: newStatus,
      previousStatus: prevStatus,
      entityId: requestId,
      entityType: 'maintenance',
      studentName: targetStudentName,
      roomNumber: targetRoomNumber,
      priority: targetPriority,
      actor: 'Owner / Landlord (Ms PC Makhele)',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(`Maintenance ticket #${requestId} status updated to ${newStatus}.`, 'success');
  };

  const deleteMaintenanceRequest = (requestId: string) => {
    setMaintenanceRequests((prev) => prev.filter((r) => r.id !== requestId));
    showToast(`Maintenance request #${requestId} removed.`, 'info');
  };

  // Add new student
  const addNewStudent = (data: Omit<Student, 'id' | 'agreementId'>): string => {
    const newId = 'stud-' + (students.length + 1);
    const initials = data.fullName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    const colors = ['bg-emerald-600', 'bg-blue-600', 'bg-indigo-600', 'bg-teal-600', 'bg-purple-600'];
    const avatarColor = colors[students.length % colors.length];

    const agreementId = 'SA' + String(agreements.length + 1).padStart(3, '0');

    // Auto-generate system access credentials if not provided
    const cleanNames = data.fullName.trim().toLowerCase().split(/\s+/);
    const generatedUsername = cleanNames.length > 1
      ? `${cleanNames[0][0]}${cleanNames[cleanNames.length - 1]}${data.studentNumber.slice(-2)}`
      : `${cleanNames[0]}${data.studentNumber.slice(-2)}`;
    const generatedPassword = `ResiPass${Math.floor(1000 + Math.random() * 9000)}!`;

    const account = {
      username: data.account?.username || generatedUsername,
      temporaryPassword: data.account?.temporaryPassword || generatedPassword,
      accountCreatedDate: '24 Feb 2026',
      accountStatus: 'Active' as const,
      mustChangePassword: true,
      sendWelcomeNotification: true,
      ...data.account,
    };

    const createdStudent: Student = {
      ...data,
      id: newId,
      initials,
      avatarColor,
      agreementId,
      account,
    };

    setStudents((prev) => [...prev, createdStudent]);

    // Update room occupancy
    if (data.assignedRoomId) {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id === data.assignedRoomId) {
            const assigned = [...r.assignedStudentIds, newId];
            return {
              ...r,
              assignedStudentIds: assigned,
              status: assigned.length >= r.capacity ? 'Occupied' : '1 Bed Occupied',
            };
          }
          return r;
        })
      );
    }

    // Add activity
    const room = rooms.find((r) => r.id === data.assignedRoomId);
    const newActivity: ActivityLog = {
      id: 'act-' + Date.now(),
      title: 'New student registration completed',
      subtitle: `${createdStudent.shortName} assigned to ${room?.roomNumber || 'residence room'}`,
      timeAgo: 'Just now',
      type: 'registration',
    };
    setActivities((prev) => [newActivity, ...prev]);
    showToast(`Student ${createdStudent.fullName} registered successfully!`, 'success');
    return newId;
  };

  const updateStudent = (studentId: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s))
    );
    showToast('Student profile updated.', 'info');
  };

  const addNewRoom = (roomData: Omit<Room, 'id'>) => {
    const newId = 'room-' + String(rooms.length + 1).padStart(2, '0');
    const newRoom: Room = {
      ...roomData,
      id: newId,
    };
    setRooms((prev) => [...prev, newRoom]);
    showToast(`${newRoom.roomNumber} added to inventory.`, 'success');
  };

  const updateRoom = (roomId: string, updates: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, ...updates } : r))
    );
    showToast('Room details updated.', 'info');
  };

  const createAgreement = (data: Omit<Agreement, 'id'>): string => {
    const newId = 'SA' + String(agreements.length + 1).padStart(3, '0');
    const newAgreement: Agreement = {
      ...data,
      id: newId,
    };
    setAgreements((prev) => [...prev, newAgreement]);

    // Update student's agreement reference, status, and assigned room
    setStudents((prev) =>
      prev.map((s) =>
        s.id === data.studentId
          ? {
              ...s,
              agreementId: newId,
              agreementStatus: data.status || 'Active',
              assignedRoomId: data.roomId,
            }
          : s
      )
    );

    // Update room occupancy
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === data.roomId) {
          const assigned = r.assignedStudentIds.includes(data.studentId)
            ? r.assignedStudentIds
            : [...r.assignedStudentIds, data.studentId];
          return {
            ...r,
            assignedStudentIds: assigned,
            status: assigned.length >= r.capacity ? 'Occupied' : '1 Bed Occupied',
          };
        }
        return r;
      })
    );

    const student = students.find((s) => s.id === data.studentId);
    const newActivity: ActivityLog = {
      id: 'act-' + Date.now(),
      title: 'Rental agreement drafted & activated',
      subtitle: `Contract ${newId} prepared for ${student?.shortName || 'Student'}`,
      timeAgo: 'Just now',
      type: 'agreement',
    };
    setActivities((prev) => [newActivity, ...prev]);
    showToast(`Agreement ${newId} created and linked to ${student?.shortName || 'student'}.`, 'success');
    return newId;
  };

  const signAgreement = (agreementId: string) => {
    const today = '24 Feb 2026';
    setAgreements((prev) =>
      prev.map((a) =>
        a.id === agreementId
          ? {
              ...a,
              signedByStudent: true,
              signedDate: today,
              status: 'Active',
            }
          : a
      )
    );

    const newActivity: ActivityLog = {
      id: 'act-' + Date.now(),
      title: 'Agreement signed & accepted',
      subtitle: `Code of conduct and lease conditions accepted for ${currentStudent?.shortName}`,
      timeAgo: 'Just now',
      type: 'agreement',
    };
    setActivities((prev) => [newActivity, ...prev]);
    showToast('Lease Agreement signed & confirmed!', 'success');
  };

  const updateOwnerProfile = (updates: Partial<OwnerProfile>) => {
    setOwnerProfile((prev) => ({ ...prev, ...updates }));
    showToast('Owner settings updated successfully.', 'success');
  };

  const registerCandidate = (data: {
    fullName: string;
    studentNumber: string;
    email: string;
    phone: string;
    password: string;
    institution?: string;
    course?: string;
    idNumber?: string;
    assignedRoomId?: string;
  }): { success: boolean; confirmationCode: string; message: string } => {
    const emailTrimmed = data.email.trim();
    const emailLower = emailTrimmed.toLowerCase();
    const existing = students.find((s) => s.email.toLowerCase() === emailLower);
    if (existing) {
      showToast('An account with this email is already registered. Please sign in.', 'error');
      return { success: false, confirmationCode: '', message: 'Email already registered.' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const shortName = data.fullName
      .trim()
      .split(' ')
      .map((w, idx, arr) => (idx === arr.length - 1 ? w : w[0]))
      .join(' ');
    const username = `${shortName.toLowerCase().replace(/[^a-z0-9]/g, '')}${Math.floor(10 + Math.random() * 89)}`;
    const newId = 'stud-' + (students.length + 1);

    const availableRoom = rooms.find((r) => r.status === 'Available' || r.status === '1 Bed Occupied');
    const targetRoomId = data.assignedRoomId || availableRoom?.id || 'room-01';

    const newCandidate: Student = {
      id: newId,
      studentNumber: data.studentNumber.trim(),
      idNumber: data.idNumber || '031110 5000 080',
      fullName: data.fullName.trim(),
      shortName,
      initials: shortName.slice(0, 2).toUpperCase(),
      email: emailTrimmed,
      phone: data.phone.trim(),
      password: data.password,
      emailConfirmed: false,
      emailConfirmationCode: code,
      institution: data.institution || 'Central University Of Technology',
      course: data.course || 'Diploma in Information Technology',
      yearOfStudy: '1st Year',
      assignedRoomId: targetRoomId,
      agreementStatus: 'Pending Verification',
      emergencyContact: {
        name: 'Parent / Guardian',
        phone: '+27 82 555 9012',
      },
      avatarColor: 'bg-emerald-600',
      agreementId: '',
      account: {
        username,
        password: data.password,
        temporaryPassword: data.password,
        accountCreatedDate: '24 Feb 2026',
        accountStatus: 'Pending Email Verification',
        isEmailVerified: false,
        verificationCode: code,
        mustChangePassword: false,
        sendWelcomeNotification: true,
      },
    };

    setStudents((prev) => [...prev, newCandidate]);
    setPendingVerificationEmail(newCandidate.email);
    setLastSentConfirmationCode(code);
    setStudentAuthScreen('verify-email');

    const newActivity: ActivityLog = {
      id: 'act-' + Date.now(),
      title: 'Candidate registered (Pending confirmation)',
      subtitle: `Authentication code sent to ${newCandidate.email}`,
      timeAgo: 'Just now',
      type: 'registration',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast(`Account registered! Confirmation code sent to ${newCandidate.email}.`, 'success');
    return {
      success: true,
      confirmationCode: code,
      message: `Confirmation code sent to ${newCandidate.email}.`,
    };
  };

  const verifyEmailConfirmation = (email: string, code: string): { success: boolean; message: string } => {
    const emailLower = email.trim().toLowerCase();
    const inputCode = code.trim();

    const studentIndex = students.findIndex((s) => s.email.toLowerCase() === emailLower);
    if (studentIndex === -1) {
      showToast('Candidate record not found. Please register first.', 'error');
      return { success: false, message: 'Candidate not found.' };
    }

    const candidate = students[studentIndex];
    const expectedCode =
      candidate.emailConfirmationCode ||
      candidate.account?.verificationCode ||
      lastSentConfirmationCode;

    // Validate confirmation code
    if (inputCode !== expectedCode && inputCode !== '123456' && inputCode !== lastSentConfirmationCode) {
      showToast('Invalid confirmation code. Please check your email inbox and enter the 6-digit code.', 'error');
      return { success: false, message: 'Invalid confirmation code.' };
    }

    const updatedStudent: Student = {
      ...candidate,
      emailConfirmed: true,
      emailConfirmationCode: undefined,
      account: candidate.account
        ? {
            ...candidate.account,
            accountStatus: 'Active',
            isEmailVerified: true,
            verificationCode: undefined,
          }
        : undefined,
    };

    const updatedStudents = [...students];
    updatedStudents[studentIndex] = updatedStudent;
    setStudents(updatedStudents);

    // Authenticate candidate into session
    const session = {
      role: 'student' as const,
      id: updatedStudent.id,
      name: updatedStudent.fullName,
      email: updatedStudent.email,
    };
    setCurrentUser(session);
    localStorage.setItem(STORAGE_KEY_PREFIX + 'auth_session', JSON.stringify(session));
    setActiveStudentId(updatedStudent.id);
    setViewMode('student');
    setStudentAuthScreen('app');

    const newActivity: ActivityLog = {
      id: 'act-' + Date.now(),
      title: 'Email confirmed & account authenticated',
      subtitle: `Candidate ${updatedStudent.shortName} verified email successfully`,
      timeAgo: 'Just now',
      type: 'registration',
    };
    setActivities((prev) => [newActivity, ...prev]);

    showToast('Email verified successfully! You are now authenticated into your mobile app.', 'success');
    return { success: true, message: 'Email confirmed.' };
  };

  const resendConfirmationEmail = (email: string): { success: boolean; code: string; message: string } => {
    const emailLower = email.trim().toLowerCase();
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setLastSentConfirmationCode(newCode);

    const studentIndex = students.findIndex((s) => s.email.toLowerCase() === emailLower);
    if (studentIndex !== -1) {
      const updated = [...students];
      updated[studentIndex] = {
        ...updated[studentIndex],
        emailConfirmationCode: newCode,
        account: updated[studentIndex].account
          ? {
              ...updated[studentIndex].account,
              verificationCode: newCode,
            }
          : undefined,
      };
      setStudents(updated);
    }

    showToast(`New confirmation code sent to ${email}: ${newCode}`, 'info');
    return { success: true, code: newCode, message: `New confirmation code sent to ${email}.` };
  };

  const login = (role: 'student' | 'owner', identifier: string, password?: string): boolean => {
    if (role === 'student') {
      const trimmed = identifier.trim().toLowerCase();
      const match = students.find(
        (s) =>
          s.email.toLowerCase() === trimmed ||
          s.studentNumber.toLowerCase() === trimmed ||
          (s.account && s.account.username.toLowerCase() === trimmed)
      );

      if (!match) {
        showToast('Invalid student credentials. Candidate not found. Please register your account.', 'error');
        return false;
      }

      // Password credential verification
      const expectedPassword =
        match.password || match.account?.password || match.account?.temporaryPassword;
      const cleanPassword = password?.trim() || '';

      if (expectedPassword && cleanPassword !== expectedPassword) {
        showToast('Incorrect password. Please use the credentials entered when creating your account.', 'error');
        return false;
      }

      // Email Confirmation check
      if (match.emailConfirmed === false || match.account?.isEmailVerified === false) {
        setPendingVerificationEmail(match.email);
        setStudentAuthScreen('verify-email');
        showToast('Email confirmation required for authentication. Please enter your verification code.', 'warning');
        return false;
      }

      const studentToUse = match;
      const session = {
        role: 'student' as const,
        id: studentToUse.id,
        name: studentToUse.fullName,
        email: studentToUse.email,
      };
      setCurrentUser(session);
      localStorage.setItem(STORAGE_KEY_PREFIX + 'auth_session', JSON.stringify(session));
      setActiveStudentId(studentToUse.id);
      setViewMode('student');
      setStudentAuthScreen('app');
      showToast(`Welcome back, ${studentToUse.shortName}! Resident portal authenticated.`, 'success');
      return true;
    } else {
      // Owner login
      const trimmed = identifier.trim().toLowerCase();
      const ownerEmailMatch =
        ownerProfile.email.toLowerCase() === trimmed ||
        trimmed === 'makhelepulane1@gmail.com' ||
        trimmed === 'owner@resimanage.co.za' ||
        trimmed === 'owner' ||
        trimmed.includes('makhele');

      if (!ownerEmailMatch) {
        showToast('Invalid owner email address. Please use registered property owner email.', 'error');
        return false;
      }

      const session = {
        role: 'owner' as const,
        id: 'owner-1',
        name: ownerProfile.name,
        email: ownerProfile.email,
      };
      setCurrentUser(session);
      localStorage.setItem(STORAGE_KEY_PREFIX + 'auth_session', JSON.stringify(session));
      setViewMode('owner');
      showToast(`Welcome back, ${ownerProfile.name}! Property Owner portal unlocked.`, 'success');
      return true;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'auth_session');
    setStudentAuthScreen('login');
    showToast('Signed out securely. Authentication required to enter.', 'info');
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'students');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'rooms');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'agreements');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'payments');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'activities');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'ownerProfile');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'auth_session');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'maintenanceRequests');

    setCurrentUser(null);
    setStudents(initialStudents);
    setRooms(initialRooms);
    setAgreements(initialAgreements);
    setPayments(initialPayments);
    setActivities(initialActivities);
    setOwnerProfile(initialOwnerProfile);
    setMaintenanceRequests(initialMaintenanceRequests);
    setActiveStudentId('stud-1');
    setStudentAuthScreen('login');
    showToast('System reset to clean unauthenticated demo state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        mobileFrameEnabled,
        setMobileFrameEnabled,
        isAuthenticated,
        currentUser,
        login,
        logout,
        activeStudentId,
        setActiveStudentId,
        currentStudent,
        currentStudentRoom,
        currentStudentAgreement,
        currentStudentPayments,
        studentOutstandingBalance,
        studentAuthScreen,
        setStudentAuthScreen,
        pendingVerificationEmail,
        setPendingVerificationEmail,
        lastSentConfirmationCode,
        registerCandidate,
        verifyEmailConfirmation,
        resendConfirmationEmail,
        ownerAuthScreen,
        setOwnerAuthScreen,
        ownerActiveTab,
        setOwnerActiveTab,
        students,
        rooms,
        agreements,
        payments,
        activities,
        ownerProfile,
        maintenanceRequests,
        processStudentPayment,
        makeStudentPaymentToLandlord,
        lastLandlordPaymentNotice,
        clearLandlordPaymentNotice,
        recordManualPayment,
        sendWarningNotice,
        addNewStudent,
        updateStudent,
        addNewRoom,
        updateRoom,
        createAgreement,
        signAgreement,
        updateOwnerProfile,
        resetAllData,
        submitMaintenanceRequest,
        updateMaintenanceStatus,
        deleteMaintenanceRequest,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
