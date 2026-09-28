export interface StudentAccount {
  username: string;
  temporaryPassword?: string;
  accountCreatedDate: string;
  accountStatus: 'Active' | 'Pending First Login';
  mustChangePassword?: boolean;
  sendWelcomeNotification?: boolean;
}

export interface Student {
  id: string;
  studentNumber: string;
  idNumber: string;
  fullName: string;
  shortName: string;
  initials: string;
  email: string;
  phone: string;
  institution: string;
  course: string;
  yearOfStudy?: string;
  assignedRoomId: string;
  agreementStatus: 'Active' | 'Pending Verification' | 'Terminated';
  emergencyContact: {
    name: string;
    phone: string;
    relationship?: string;
  };
  avatarColor: string;
  agreementId: string;
  account?: StudentAccount;
}

export interface Room {
  id: string;
  roomNumber: string;
  block: string;
  floor: string;
  roomType: string;
  capacity: number;
  bedsCount: string;
  monthlyRent: number;
  status: 'Occupied' | '1 Bed Occupied' | 'Available';
  assignedStudentIds: string[];
  amenities: string[];
  imageUrl: string;
  description: string;
}

export interface AgreementClause {
  title: string;
  number: string;
  content: string;
}

export interface Agreement {
  id: string; // e.g. "SA001"
  studentId: string;
  roomId: string;
  leaseTerm: string;
  startDate: string;
  endDate: string;
  monthlyRental: number;
  securityDeposit: number;
  securityDepositStatus: 'Paid' | 'Pending';
  status: 'Active' | 'Pending Verification' | 'Terminated';
  signedByStudent: boolean;
  signedDate?: string;
  clauses: {
    purpose: string;
    rentalPeriod: string;
    paymentTerms: string;
    useOfPremises: string;
  };
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  roomId: string;
  transactionPeriod: string; // e.g. "February 2026"
  amount: number;
  paymentDate: string | null;
  dueDate: string;
  status: 'Paid' | 'Pending';
  reference: string;
  paymentMethod: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  type: 'payment' | 'registration' | 'agreement' | 'maintenance' | 'alert';
}

export interface OwnerProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  alternativePhone: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  paymentReference: string;
  notifications: {
    newBookings: boolean;
    rentPayments: boolean;
    maintenanceAlerts: boolean;
  };
}
