import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Room } from '../../types';
import {
  User,
  GraduationCap,
  Home,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  Mail,
  Phone,
  RefreshCw,
  Eye,
  EyeOff,
  Send,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  FileText,
  Lock,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStudentCreated?: (studentId: string) => void;
}

export const AddNewStudentWorkflowModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onStudentCreated,
}) => {
  const { rooms, addNewStudent, createAgreement, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: '',
    idNumber: '',
    email: '',
    phone: '',
    gender: 'Male',

    // Step 2: Academic & Room
    institution: 'Central University Of Technology',
    studentNumber: '',
    course: 'Diploma in Information Technology',
    yearOfStudy: '1st Year',
    assignedRoomId: rooms[0]?.id || 'room-01',

    // Step 3: Emergency
    emergencyName: '',
    emergencyRelationship: 'Parent / Guardian',
    emergencyPhone: '',

    // Step 4: System Access & Lease
    username: '',
    temporaryPassword: '',
    mustChangePassword: true,
    sendWelcomeNotification: true,
    draftAgreementNow: true,
    leaseTerm: '12 Months (Full Academic Year)',
    startDate: '01 February 2026',
    endDate: '30 November 2026',
    monthlyRental: rooms[0]?.monthlyRent || 2800,
    securityDeposit: rooms[0]?.monthlyRent || 2800,
    securityDepositStatus: 'Paid' as 'Paid' | 'Pending',
  });

  // Result state for Step 5
  const [createdStudentSummary, setCreatedStudentSummary] = useState<{
    id: string;
    fullName: string;
    studentNumber: string;
    username: string;
    password: string;
    roomNumber: string;
    roomBlock: string;
    agreementId?: string;
  } | null>(null);

  // Auto-generate credentials whenever name or student number changes
  useEffect(() => {
    if (!formData.username && formData.fullName) {
      const parts = formData.fullName.trim().toLowerCase().split(/\s+/);
      const suffix = formData.studentNumber ? formData.studentNumber.slice(-2) : '26';
      const genUser = parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1]}${suffix}`
        : `${parts[0]}${suffix}`;
      setFormData((prev) => ({ ...prev, username: genUser }));
    }
  }, [formData.fullName, formData.studentNumber]);

  useEffect(() => {
    if (!formData.temporaryPassword) {
      const genPass = `ResiPass${Math.floor(1000 + Math.random() * 9000)}!`;
      setFormData((prev) => ({ ...prev, temporaryPassword: genPass }));
    }
  }, []);

  if (!isOpen) return null;

  const generateNewPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newPass = `Resi#${code}26!`;
    setFormData((prev) => ({ ...prev, temporaryPassword: newPass }));
    showToast('New temporary password generated.', 'info');
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`Copied ${label} to clipboard.`, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAllVoucher = () => {
    if (!createdStudentSummary) return;
    const text = `STUDENT RESIDENCE SYSTEM ACCESS VOUCHER
Central University of Technology Accredited Accommodation
----------------------------------------
Resident Name: ${createdStudentSummary.fullName}
Student ID Number: ${createdStudentSummary.studentNumber}
Assigned Unit: ${createdStudentSummary.roomNumber} (${createdStudentSummary.roomBlock})
----------------------------------------
LOGIN CREDENTIALS:
Access Portal: https://resi-manage.app/login
Username: ${createdStudentSummary.username}
Temporary Password: ${createdStudentSummary.password}
Status: Active (Please change password on first login)
----------------------------------------`;
    handleCopy(text, 'Full Voucher Slip');
  };

  const selectedRoom = rooms.find((r) => r.id === formData.assignedRoomId) || rooms[0];

  const handleRoomChange = (roomId: string) => {
    const r = rooms.find((rm) => rm.id === roomId);
    setFormData((prev) => ({
      ...prev,
      assignedRoomId: roomId,
      monthlyRental: r ? r.monthlyRent : prev.monthlyRental,
      securityDeposit: r ? r.monthlyRent : prev.securityDeposit,
    }));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email) {
      showToast('Full name and email are mandatory.', 'warning');
      setCurrentStep(1);
      return;
    }

    const shortName = formData.fullName
      .split(' ')
      .map((w, idx, arr) => (idx === arr.length - 1 ? w : w[0]))
      .join(' ');

    const studentNumber =
      formData.studentNumber || String(Math.floor(222000000 + Math.random() * 99999));
    const username = formData.username || `${shortName.toLowerCase().replace(/\s+/g, '')}26`;
    const temporaryPassword = formData.temporaryPassword || `ResiPass${Math.floor(1000 + Math.random() * 9000)}!`;

    // 1. Create Student Entity with Auto-Generated Account
    const newStudentId = addNewStudent({
      fullName: formData.fullName,
      shortName,
      studentNumber,
      idNumber: formData.idNumber || '031110 5000 080',
      email: formData.email,
      phone: formData.phone || '+27 67 000 0000',
      password: temporaryPassword,
      emailConfirmed: true,
      institution: formData.institution,
      course: formData.course,
      yearOfStudy: formData.yearOfStudy,
      assignedRoomId: formData.assignedRoomId,
      agreementStatus: formData.draftAgreementNow ? 'Active' : 'Pending Verification',
      emergencyContact: {
        name: formData.emergencyName || 'Parent / Guardian',
        phone: formData.emergencyPhone || '+27 82 555 9012',
        relationship: formData.emergencyRelationship,
      },
      avatarColor: 'bg-emerald-600',
      initials: shortName.slice(0, 2).toUpperCase(),
      account: {
        username,
        password: temporaryPassword,
        temporaryPassword,
        accountCreatedDate: '24 Feb 2026',
        accountStatus: 'Active',
        isEmailVerified: true,
        mustChangePassword: formData.mustChangePassword,
        sendWelcomeNotification: formData.sendWelcomeNotification,
      },
    });

    let agreementId: string | undefined = undefined;

    // 2. If Lease Agreement Requested, Draft It
    if (formData.draftAgreementNow) {
      agreementId = createAgreement({
        studentId: newStudentId,
        roomId: formData.assignedRoomId,
        leaseTerm: formData.leaseTerm,
        startDate: formData.startDate,
        endDate: formData.endDate,
        monthlyRental: Number(formData.monthlyRental),
        securityDeposit: Number(formData.securityDeposit),
        securityDepositStatus: formData.securityDepositStatus,
        status: 'Active',
        signedByStudent: true,
        signedDate: '24 Feb 2026',
        clauses: {
          purpose:
            'The Premises shall be used solely as student accommodation. Any unauthorized commercial exploitation is strictly prohibited.',
          rentalPeriod:
            'The lease runs for a fixed period of 12 months, commencing on the defined Start Date, subject to compliance.',
          paymentTerms:
            'Monthly rent must be paid in full by the 1st of every calendar month. Late payments incur automated penalty percentages.',
          useOfPremises:
            'Quiet hours are enforced after 10:00 PM. No unauthorized structural or technical modifications are permitted on site.',
        },
      });
    }

    setCreatedStudentSummary({
      id: newStudentId,
      fullName: formData.fullName,
      studentNumber,
      username,
      password: temporaryPassword,
      roomNumber: selectedRoom.roomNumber,
      roomBlock: selectedRoom.block,
      agreementId,
    });

    setCurrentStep(5);
    if (onStudentCreated) {
      onStudentCreated(newStudentId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-200 dark:border-slate-800">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                Add New Student & Auto-Generate Account
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Capture essential student details and provision system access credentials.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="px-6 py-3 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          {[
            { step: 1, title: 'Personal' },
            { step: 2, title: 'Academic & Room' },
            { step: 3, title: 'Emergency Contact' },
            { step: 4, title: 'Access & Lease' },
            { step: 5, title: 'Account Slip' },
          ].map((s) => (
            <div
              key={s.step}
              className={`flex items-center gap-1.5 ${
                currentStep === s.step
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                  : currentStep > s.step
                  ? 'text-slate-700 dark:text-slate-300 font-medium'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  currentStep === s.step
                    ? 'bg-emerald-700 text-white'
                    : currentStep > s.step
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {currentStep > s.step ? '✓' : s.step}
              </div>
              <span className="hidden sm:inline text-[11px]">{s.title}</span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in text-xs">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  1. Personal & Contact Details
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Official resident information for university accreditation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Kagiso Joseph Moeketsi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500/40"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    National ID / Passport Number *
                  </label>
                  <input
                    type="text"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    placeholder="e.g. 031110 5234 081"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender / Title
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Contact Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+27 67 240 2175"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@cut.ac.za or gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!formData.fullName || !formData.email}
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span>Next: Academic & Room</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Academic & Room Allocation */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in text-xs">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  2. Academic Registration & Room Placement
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Campus affiliation and residence block assignment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    University / Institution *
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student ID Number (Registration ID) *
                  </label>
                  <input
                    type="text"
                    value={formData.studentNumber}
                    onChange={(e) => setFormData({ ...formData, studentNumber: e.target.value })}
                    placeholder="e.g. 222094182"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Faculty / Course of Study *
                  </label>
                  <input
                    type="text"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    placeholder="Diploma in Information Technology"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="1st Year">1st Year (Junior)</option>
                    <option value="2nd Year">2nd Year (Intermediate)</option>
                    <option value="3rd Year">3rd Year (Finalist)</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              {/* Room Assignment Visual Selector */}
              <div>
                <label className="block font-bold text-slate-900 dark:text-white mb-2">
                  Select Room Placement *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {rooms.map((room) => {
                    const isSelected = formData.assignedRoomId === room.id;
                    return (
                      <div
                        key={room.id}
                        onClick={() => handleRoomChange(room.id)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center gap-3 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <img
                          src={room.imageUrl}
                          alt={room.roomNumber}
                          className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {room.roomNumber}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                room.status === 'Available'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {room.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {room.block} • {room.floor}
                          </div>
                          <div className="font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                            R{room.monthlyRent.toLocaleString('en-ZA')}/month
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
                >
                  <span>Next: Emergency Contact</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Emergency Contact */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in text-xs">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  3. Emergency Contact & Next-of-Kin
                </h3>
                <p className="text-slate-500 text-[11px]">
                  Parent, guardian, or sponsor details for safety communications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyName: e.target.value })
                    }
                    placeholder="e.g. Mrs. L. Moeketsi"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Relationship to Student
                  </label>
                  <select
                    value={formData.emergencyRelationship}
                    onChange={(e) =>
                      setFormData({ ...formData, emergencyRelationship: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  >
                    <option value="Parent / Mother">Parent / Mother</option>
                    <option value="Parent / Father">Parent / Father</option>
                    <option value="Legal Guardian">Legal Guardian</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Sponsor / Bursary Liaison">Sponsor / Bursary Liaison</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Contact Telephone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.emergencyPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, emergencyPhone: e.target.value })
                      }
                      placeholder="+27 82 555 9012"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
                >
                  <span>Next: Access & Lease</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: System Access & Account Credentials Generation */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in text-xs">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    4. System Access & Account Credentials Generation
                  </h3>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Auto-generates student portal login credentials and lease contract.
                </p>
              </div>

              {/* Auto-generated Credentials Card */}
              <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 p-4 rounded-2xl border border-emerald-700/60 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-800/80">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-200">
                      Auto-Generated Portal Credentials
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    System Generated
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-emerald-300/80 block mb-1">
                      System Username / Login Handle
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950/80 rounded-xl border border-emerald-700/60 font-mono font-bold text-white text-xs focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] uppercase font-bold text-emerald-300/80">
                        Temporary Password
                      </label>
                      <button
                        type="button"
                        onClick={generateNewPassword}
                        className="text-[10px] text-emerald-400 hover:text-emerald-200 flex items-center gap-1 font-semibold"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Regenerate
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.temporaryPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, temporaryPassword: e.target.value })
                        }
                        className="w-full px-3 pr-8 py-2 bg-slate-950/80 rounded-xl border border-emerald-700/60 font-mono font-bold text-emerald-300 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 text-[11px] text-emerald-200/90">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.mustChangePassword}
                      onChange={(e) =>
                        setFormData({ ...formData, mustChangePassword: e.target.checked })
                      }
                      className="rounded border-emerald-600 bg-slate-950 text-emerald-500 focus:ring-emerald-400 w-3.5 h-3.5"
                    />
                    <span>Require password change on first student mobile login</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.sendWelcomeNotification}
                      onChange={(e) =>
                        setFormData({ ...formData, sendWelcomeNotification: e.target.checked })
                      }
                      className="rounded border-emerald-600 bg-slate-950 text-emerald-500 focus:ring-emerald-400 w-3.5 h-3.5"
                    />
                    <span>Dispatch Welcome Notification & Login Slip</span>
                  </label>
                </div>
              </div>

              {/* Lease Agreement Bundle Option */}
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="flex items-center justify-between cursor-pointer select-none">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block">
                        Draft & Activate Rental Agreement Now
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Bind resident to {selectedRoom.roomNumber} with 12-month standard lease.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.draftAgreementNow}
                    onChange={(e) =>
                      setFormData({ ...formData, draftAgreementNow: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </label>

                {formData.draftAgreementNow && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 mb-1">Monthly Rental (ZAR)</label>
                      <input
                        type="number"
                        value={formData.monthlyRental}
                        onChange={(e) =>
                          setFormData({ ...formData, monthlyRental: Number(e.target.value) })
                        }
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-emerald-700 dark:text-emerald-400 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Security Deposit (ZAR)</label>
                      <input
                        type="number"
                        value={formData.securityDeposit}
                        onChange={(e) =>
                          setFormData({ ...formData, securityDeposit: Number(e.target.value) })
                        }
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Provision Account & Save</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Generated System Access Slip & Confirmation Voucher */}
          {currentStep === 5 && createdStudentSummary && (
            <div className="space-y-4 animate-in zoom-in-95 text-xs">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Student Account & System Access Generated!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Student resident profile is registered and ready for mobile application sign in.
                </p>
              </div>

              {/* Official Credentials Slip */}
              <div className="bg-slate-50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 font-mono">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Central University of Technology Private Residence
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white font-sans mt-0.5">
                      {createdStudentSummary.fullName}
                    </div>
                    <div className="text-xs text-slate-500 font-sans">
                      Student ID: {createdStudentSummary.studentNumber} • {createdStudentSummary.roomNumber} ({createdStudentSummary.roomBlock})
                    </div>
                  </div>
                  {createdStudentSummary.agreementId && (
                    <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px] font-sans">
                      Lease: {createdStudentSummary.agreementId}
                    </span>
                  )}
                </div>

                {/* Credentials Display */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 text-[11px]">Login Portal URL:</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      resimanage.app/login
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Username / Login ID</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                        {createdStudentSummary.username}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(createdStudentSummary.username, 'Username')}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600"
                    >
                      {copiedKey === 'Username' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Temporary Password</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                        {createdStudentSummary.password}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(createdStudentSummary.password, 'Password')}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600"
                    >
                      {copiedKey === 'Password' ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-sans italic pt-1">
                  * Note: Advise the student to log into the mobile app and change this temporary password.
                </div>
              </div>

              {/* Actions for Voucher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopyAllVoucher}
                  className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Full Access Slip</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    showToast(`Credentials voucher emailed to ${formData.email} and SMS sent to ${formData.phone}`, 'success');
                  }}
                  className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Send className="w-4 h-4 text-emerald-600" />
                  <span>Resend SMS / Email</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition"
                >
                  Return to Students Directory
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
