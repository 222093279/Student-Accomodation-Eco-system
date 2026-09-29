export interface StudentAccount {
  username: string;
  password?: string;
  temporaryPassword?: string;
  accountCreatedDate: string;
  accountStatus: 'Active' | 'Pending Email Verification' | 'Pending First Login';
  isEmailVerified?: boolean;
  verificationCode?: string;
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
  password?: string;
  emailConfirmed?: boolean;
  emailConfirmationCode?: string;
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
  isSystemGenerated?: boolean;
  notes?: string;
  paidTimestamp?: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  type: 'payment' | 'registration' | 'agreement' | 'maintenance' | 'alert';
  timestamp?: string; // Formatted date & time, e.g. "24 Feb 2026, 12:45"
  status?: string; // e.g. 'Paid', 'Pending', 'Reported', 'Scheduled', 'In Progress', 'Resolved', 'Cancelled'
  previousStatus?: string;
  entityId?: string; // e.g. 'MR-101', 'PAY-2026-084'
  entityType?: 'maintenance' | 'payment' | 'agreement' | 'student';
  actor?: string; // e.g. 'Student (RD Mohlomi)', 'Owner (Ms PC Makhele)', 'System Auto-Payment'
  amount?: number;
  roomNumber?: string;
  studentName?: string;
  priority?: string;
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

export type MaintenanceCategory =
  | 'Plumbing'
  | 'Electrical'
  | 'Carpentry & Furniture'
  | 'Appliances'
  | 'WiFi & Internet'
  | 'Keys & Locks'
  | 'Cleaning & Pest'
  | 'Other';

export type MaintenancePriority = 'Low' | 'Medium' | 'High' | 'Emergency';

export type MaintenanceStatus = 'Reported' | 'Scheduled' | 'In Progress' | 'Resolved' | 'Cancelled';

export interface MaintenanceStatusUpdate {
  status: MaintenanceStatus;
  timestamp: string;
  note?: string;
  updatedBy: string;
}

export interface MaintenanceRequest {
  id: string; // e.g. "MR-101"
  studentId: string;
  studentName: string;
  studentNumber: string;
  studentPhone?: string;
  studentEmail?: string;
  roomId: string;
  roomNumber: string;
  block: string;
  areaLocation?: string; // e.g. "Ensuite Bathroom", "Study Desk Area"
  title: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  description: string;
  status: MaintenanceStatus;
  createdAt: string;
  updatedAt: string;
  preferredAccessTime?: string;
  assignedTechnician?: string;
  scheduledDate?: string;
  ownerNotes?: string;
  costEstimate?: number;
  photoAttachment?: string;
  statusHistory: MaintenanceStatusUpdate[];
}
