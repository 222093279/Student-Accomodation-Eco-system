import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Student, Room } from '../../types';
import {
  Search,
  Plus,
  User,
  GraduationCap,
  Phone,
  Mail,
  Home,
  FileText,
  CreditCard,
  X,
  Edit2,
  CheckCircle,
  Clock,
  ChevronRight,
  Shield,
  Printer,
  KeyRound,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Building2,
  Calendar,
} from 'lucide-react';
import { PrintableAgreementModal } from '../common/PrintableAgreementModal';

export const OwnerStudents: React.FC = () => {
  const {
    students,
    rooms,
    agreements,
    payments,
    addNewStudent,
    updateStudent,
    createAgreement,
    ownerProfile,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentModalTab, setStudentModalTab] = useState<'personal' | 'agreements' | 'payments'>('personal');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // System credentials inspector modal
  const [viewCredentialsStudent, setViewCredentialsStudent] = useState<Student | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Dedicated Draft Agreement Modal state
  const [isDraftAgreementModalOpen, setIsDraftAgreementModalOpen] = useState(false);
  const [draftAgreementTarget, setDraftAgreementTarget] = useState<Student | null>(null);
  const [draftAgreementForm, setDraftAgreementForm] = useState({
    studentId: '',
    roomId: 'room-01',
    leaseTerm: '12 Months (Full Academic Year)',
    startDate: '01 February 2026',
    endDate: '30 November 2026',
    monthlyRental: 2800,
    securityDeposit: 2800,
    securityDepositStatus: 'Paid' as 'Paid' | 'Pending',
    status: 'Active' as 'Active' | 'Pending Verification',
  });

  // Post-student creation success & agreement prompt modal
  const [createdStudentResult, setCreatedStudentResult] = useState<{
    student: Student;
    tempPassword: string;
    username: string;
    room?: Room;
  } | null>(null);

  // New Student Form State
  const [newStudentForm, setNewStudentForm] = useState({
    fullName: '',
    shortName: '',
    studentNumber: '',
    idNumber: '',
    email: '',
    phone: '',
    institution: 'Central University Of Technology',
    course: 'Diploma in Information Technology',
    yearOfStudy: '2nd Year',
    assignedRoomId: 'room-03',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: 'Parent / Guardian',
    // System Access Account settings
    username: '',
    temporaryPassword: '',
    requirePasswordChange: true,
    sendWelcomeNotification: true,
  });

  // Generate initial random password and username helper
  const generateNewPassword = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `ResiPass${randomNum}!`;
  };

  const generateUsernameFromName = (name: string, studNum: string) => {
    const clean = name.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const suffix = studNum ? studNum.slice(-2) : '26';
    if (clean.length === 0) return `resident${suffix}`;
    if (clean.length === 1) return `${clean[0]}${suffix}`;
    const initial = clean[0][0];
    const surname = clean[clean.length - 1];
    return `${initial}${surname}${suffix}`;
  };

  // Open Add Student Modal with freshly initialized credentials
  const handleOpenAddStudentModal = () => {
    const defaultRoom = rooms.find((r) => r.status === 'Available' || r.status === '1 Bed Occupied') || rooms[0];
    const initialPass = generateNewPassword();
    const initialStudNum = String(Math.floor(222000000 + Math.random() * 99999));

    setNewStudentForm({
      fullName: '',
      shortName: '',
      studentNumber: initialStudNum,
      idNumber: '031110 5234 081',
      email: '',
      phone: '+27 67 ',
      institution: 'Central University Of Technology',
      course: 'Diploma in Information Technology',
      yearOfStudy: '2nd Year',
      assignedRoomId: defaultRoom ? defaultRoom.id : 'room-01',
      emergencyContactName: '',
      emergencyContactPhone: '+27 82 ',
      emergencyContactRelationship: 'Parent / Guardian',
      username: `student${initialStudNum.slice(-2)}`,
      temporaryPassword: initialPass,
      requirePasswordChange: true,
      sendWelcomeNotification: true,
    });
    setIsAddModalOpen(true);
  };

  // Handle Full Name change: automatically suggest shortName and username if not customized
  const handleFullNameChange = (val: string) => {
    const words = val.trim().split(/\s+/).filter(Boolean);
    const suggestedShort = words.length > 1
      ? words.map((w, idx) => (idx === words.length - 1 ? w : w[0])).join(' ')
      : val;

    const suggestedUser = generateUsernameFromName(val, newStudentForm.studentNumber);

    setNewStudentForm((prev) => ({
      ...prev,
      fullName: val,
      shortName: prev.shortName === '' || prev.shortName === suggestedShort ? suggestedShort : prev.shortName,
      username: suggestedUser,
    }));
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentNumber.includes(searchQuery) ||
      (s.account && s.account.username.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRoom =
      selectedRoomFilter === 'all' || s.assignedRoomId === selectedRoomFilter;

    return matchesSearch && matchesRoom;
  });

  // Open Draft Agreement for a specific student
  const handleOpenDraftAgreementForStudent = (student: Student) => {
    const assignedRoom = rooms.find((r) => r.id === student.assignedRoomId) || rooms[0];
    setDraftAgreementTarget(student);
    setDraftAgreementForm({
      studentId: student.id,
      roomId: student.assignedRoomId || assignedRoom?.id || 'room-01',
      leaseTerm: '12 Months (Full Academic Year)',
      startDate: '01 February 2026',
      endDate: '30 November 2026',
      monthlyRental: assignedRoom ? assignedRoom.monthlyRent : 2800,
      securityDeposit: assignedRoom ? assignedRoom.monthlyRent : 2800,
      securityDepositStatus: 'Paid',
      status: 'Active',
    });
    setIsDraftAgreementModalOpen(true);
  };

  // Save Agreement
  const handleSaveDraftAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftAgreementForm.studentId || !draftAgreementForm.roomId) {
      showToast('Student and room must be designated', 'warning');
      return;
    }

    const newAgrId = createAgreement({
      studentId: draftAgreementForm.studentId,
      roomId: draftAgreementForm.roomId,
      leaseTerm: draftAgreementForm.leaseTerm,
      startDate: draftAgreementForm.startDate,
      endDate: draftAgreementForm.endDate,
      monthlyRental: Number(draftAgreementForm.monthlyRental),
      securityDeposit: Number(draftAgreementForm.securityDeposit),
      securityDepositStatus: draftAgreementForm.securityDepositStatus,
      status: draftAgreementForm.status,
      signedByStudent: true,
      signedDate: '24 Feb 2026',
      clauses: {
        purpose:
          'The Premises shall be used solely as student accommodation. Any unauthorized commercial exploitation is strictly prohibited.',
        rentalPeriod:
          'The lease runs for a fixed period of 12 months, commencing on the defined Start Date, subject to compliance.',
        paymentTerms:
          'Monthly rent must be paid in full by the 1st of every calendar month into Capitec Bank. Late payments incur automated penalty percentages.',
        useOfPremises:
          'Quiet hours are enforced after 10:00 PM. No unauthorized structural or technical modifications are permitted on site.',
      },
    });

    setIsDraftAgreementModalOpen(false);
    setDraftAgreementTarget(null);
    showToast(`Lease Agreement ${newAgrId} successfully activated!`, 'success');
  };

  // Create Student and Auto-Generate System Account
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.fullName.trim() || !newStudentForm.email.trim()) {
      showToast('Please fill in required student name and email', 'warning');
      return;
    }

    const shortName =
      newStudentForm.shortName.trim() ||
      newStudentForm.fullName
        .trim()
        .split(' ')
        .map((w, idx, arr) => (idx === arr.length - 1 ? w : w[0]))
        .join(' ');

    const username = newStudentForm.username.trim() || generateUsernameFromName(newStudentForm.fullName, newStudentForm.studentNumber);
    const tempPassword = newStudentForm.temporaryPassword.trim() || generateNewPassword();

    const createdStudentPayload = {
      fullName: newStudentForm.fullName.trim(),
      shortName,
      studentNumber: newStudentForm.studentNumber.trim() || String(Math.floor(222000000 + Math.random() * 99999)),
      idNumber: newStudentForm.idNumber.trim() || '031110 5000 080',
      email: newStudentForm.email.trim(),
      phone: newStudentForm.phone.trim() || '+27 67 000 0000',
      institution: newStudentForm.institution,
      course: newStudentForm.course,
      yearOfStudy: newStudentForm.yearOfStudy,
      assignedRoomId: newStudentForm.assignedRoomId,
      agreementStatus: 'Pending Verification' as const,
      emergencyContact: {
        name: newStudentForm.emergencyContactName.trim() || 'Parent / Guardian',
        phone: newStudentForm.emergencyContactPhone.trim() || '+27 82 555 9012',
        relationship: newStudentForm.emergencyContactRelationship,
      },
      avatarColor: 'bg-teal-600',
      initials: shortName.slice(0, 2).toUpperCase(),
      account: {
        username,
        temporaryPassword: tempPassword,
        accountCreatedDate: '24 Feb 2026',
        accountStatus: 'Active' as const,
        mustChangePassword: newStudentForm.requirePasswordChange,
        sendWelcomeNotification: newStudentForm.sendWelcomeNotification,
      },
    };

    const newStudentId = addNewStudent(createdStudentPayload);

    const createdRoom = rooms.find((r) => r.id === newStudentForm.assignedRoomId);
    const fullCreatedStudent: Student = {
      ...createdStudentPayload,
      id: newStudentId,
      agreementId: '',
    };

    setIsAddModalOpen(false);

    // Prompt owner with auto-generated credentials and immediate option to add agreement!
    setCreatedStudentResult({
      student: fullCreatedStudent,
      tempPassword,
      username,
      room: createdRoom,
    });
  };

  // Update existing student
  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    updateStudent(selectedStudent.id, {
      fullName: selectedStudent.fullName,
      email: selectedStudent.email,
      phone: selectedStudent.phone,
      assignedRoomId: selectedStudent.assignedRoomId,
      agreementStatus: selectedStudent.agreementStatus,
      emergencyContact: selectedStudent.emergencyContact,
    });
    setIsEditModalOpen(false);
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    showToast('Copied to clipboard!', 'info');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const currentAgreement = agreements.find(
    (a) => a.studentId === selectedStudent?.id
  );
  const currentRoom = rooms.find(
    (r) => r.id === selectedStudent?.assignedRoomId
  );
  const currentPayments = payments.filter(
    (p) => p.studentId === selectedStudent?.id
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Students Directory</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold border border-emerald-300/40">
              {students.length} Residents
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage, onboard student residents, provision system access accounts, and execute rental agreements.
          </p>
        </div>

        {/* Action Button: Add New Student */}
        <button
          onClick={handleOpenAddStudentModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-900/20 transition self-start sm:self-auto group"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          <span>+ Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, ID number, username or email..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
        <div className="w-full sm:w-56">
          <select
            value={selectedRoomFilter}
            onChange={(e) => setSelectedRoomFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <option value="all">Filter Room (All Rooms)</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.roomNumber} ({r.block})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Student Resident</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Room Assigned</th>
                <th className="py-3 px-4">System Access Account</th>
                <th className="py-3 px-4">Agreement Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No students match the criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stud) => {
                  const room = rooms.find((r) => r.id === stud.assignedRoomId);
                  const agr = agreements.find((a) => a.studentId === stud.id);
                  const hasAgreement = Boolean(agr);

                  return (
                    <tr
                      key={stud.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg ${stud.avatarColor} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                          >
                            {stud.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {stud.fullName}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {stud.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {stud.studentNumber}
                      </td>

                      {/* Room */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {room?.roomNumber || 'Unassigned'}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {room ? `${room.block} • ${room.floor}` : ''}
                        </span>
                      </td>

                      {/* System Account Badge */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setViewCredentialsStudent(stud)}
                          title="Click to view and copy student system credentials"
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 text-[11px] font-mono border border-slate-200 dark:border-slate-600 transition group"
                        >
                          <KeyRound className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>@{stud.account?.username || stud.shortName.toLowerCase().replace(/\s+/g, '')}</span>
                          <span className="text-[9px] uppercase px-1 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold ml-0.5">
                            {stud.account?.accountStatus === 'Pending First Login' ? 'Pending' : 'Active'}
                          </span>
                        </button>
                      </td>

                      {/* Agreement Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            hasAgreement && stud.agreementStatus === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/40'
                          }`}
                        >
                          {hasAgreement && stud.agreementStatus === 'Active' ? (
                            <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          )}
                          <span>{hasAgreement ? agr?.id || 'Active Lease' : 'No Lease Bound'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedStudent(stud);
                            setStudentModalTab('personal');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 text-slate-800 dark:text-slate-200 font-medium text-[11px] transition"
                        >
                          View Profile
                        </button>

                        {/* Dedicated Agreement Action */}
                        {hasAgreement ? (
                          <button
                            onClick={() => {
                              setSelectedStudent(stud);
                              setStudentModalTab('agreements');
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
                          >
                            <FileText className="w-3 h-3" />
                            <span>View Lease</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenDraftAgreementForStudent(stud)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition"
                          >
                            <Plus className="w-3 h-3" />
                            <span>+ Add Agreement</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedStudent(stud);
                            setIsEditModalOpen(true);
                          }}
                          className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 text-[11px] transition"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW STUDENT & AUTO-GENERATE SYSTEM ACCESS WORKFLOW           */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Onboard New Student & Generate System Access
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Register student tenant details, assign accommodation, and provision login credentials.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleCreateStudent} className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Section 1: Essential Student Profile */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                    Essential Personal & Academic Details
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      value={newStudentForm.fullName}
                      onChange={(e) => handleFullNameChange(e.target.value)}
                      placeholder="e.g. Ramadulwane Daniel Mohlomi"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      Preferred / Short Name
                    </label>
                    <input
                      type="text"
                      value={newStudentForm.shortName}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, shortName: e.target.value })}
                      placeholder="e.g. RD Mohlomi"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      University / Student ID Number *
                    </label>
                    <input
                      type="text"
                      value={newStudentForm.studentNumber}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewStudentForm({
                          ...newStudentForm,
                          studentNumber: val,
                          username: generateUsernameFromName(newStudentForm.fullName, val),
                        });
                      }}
                      placeholder="e.g. 222082927"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      National ID / Passport Number
                    </label>
                    <input
                      type="text"
                      value={newStudentForm.idNumber}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, idNumber: e.target.value })}
                      placeholder="e.g. 031110 5234 081"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      Email Address (Login ID) *
                    </label>
                    <input
                      type="email"
                      value={newStudentForm.email}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                      placeholder="mramadulwane@gmail.com"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      Mobile Phone Number
                    </label>
                    <input
                      type="text"
                      value={newStudentForm.phone}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                      placeholder="+27 67 240 2175"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      Academic Institution
                    </label>
                    <input
                      type="text"
                      value={newStudentForm.institution}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, institution: e.target.value })}
                      placeholder="Central University Of Technology"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                      Qualification / Course
                    </label>
                    <input
                      type="text"
                      value={newStudentForm.course}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, course: e.target.value })}
                      placeholder="Diploma in Information Technology"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Room Assignment */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                    Accommodation Assignment
                  </h4>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    Select Residence Room *
                  </label>
                  <select
                    value={newStudentForm.assignedRoomId}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, assignedRoomId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roomNumber} — {r.block} • {r.floor} ({r.roomType} • R{r.monthlyRent.toLocaleString('en-ZA')}/month) — Status: {r.status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section 3: AUTO-GENERATED SYSTEM ACCESS ACCOUNT */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/20 to-slate-900 border border-emerald-500/30 dark:border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                          Auto-Generated Student System Account
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Credentials provisioned for logging into the ResiManage Student Mobile Application.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      System Access
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {/* Auto Username */}
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        System Username (Auto-Generated)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={newStudentForm.username}
                          onChange={(e) => setNewStudentForm({ ...newStudentForm, username: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-950/80 rounded-lg border border-slate-700 text-xs font-mono text-emerald-400 focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setNewStudentForm({
                              ...newStudentForm,
                              username: generateUsernameFromName(newStudentForm.fullName, newStudentForm.studentNumber),
                            })
                          }
                          title="Regenerate username"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Auto Temporary Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-slate-300">
                          Temporary Access Password
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setNewStudentForm({
                              ...newStudentForm,
                              temporaryPassword: generateNewPassword(),
                            })
                          }
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Regenerate
                        </button>
                      </div>
                      <input
                        type="text"
                        value={newStudentForm.temporaryPassword}
                        onChange={(e) =>
                          setNewStudentForm({
                            ...newStudentForm,
                            temporaryPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-950/80 rounded-lg border border-slate-700 text-xs font-mono text-emerald-400 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* System Access Flags */}
                  <div className="space-y-1.5 pt-1 text-[11px] text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStudentForm.requirePasswordChange}
                        onChange={(e) =>
                          setNewStudentForm({
                            ...newStudentForm,
                            requirePasswordChange: e.target.checked,
                          })
                        }
                        className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                      />
                      <span>Require resident to change temporary password on initial mobile login</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newStudentForm.sendWelcomeNotification}
                        onChange={(e) =>
                          setNewStudentForm({
                            ...newStudentForm,
                            sendWelcomeNotification: e.target.checked,
                          })
                        }
                        className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                      />
                      <span>Dispatch automated welcome email containing access credentials to student</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 4: Emergency Contact */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2 text-xs">
                  Emergency Contact Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1">
                      Contact Name & Relationship
                    </label>
                    <input
                      type="text"
                      value={newStudentForm.emergencyContactName}
                      onChange={(e) =>
                        setNewStudentForm({
                          ...newStudentForm,
                          emergencyContactName: e.target.value,
                        })
                      }
                      placeholder="e.g. Mrs. Mohlomi (Parent)"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 mb-1">
                      Contact Telephone Number
                    </label>
                    <input
                      type="text"
                      value={newStudentForm.emergencyContactPhone}
                      onChange={(e) =>
                        setNewStudentForm({
                          ...newStudentForm,
                          emergencyContactPhone: e.target.value,
                        })
                      }
                      placeholder="+27 82 555 9012"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create Student Account & Onboard</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CONFIRMATION & IMMEDIATE LEASE AGREEMENT CREATION CALLOUT         */}
      {/* ========================================================================= */}
      {createdStudentResult && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl max-w-lg w-full p-6 text-xs space-y-5 animate-in zoom-in-95">
            {/* Header */}
            <div className="text-center space-y-1.5 pb-2 border-b border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                Student Account Successfully Created!
              </h3>
              <p className="text-xs text-slate-400">
                System access has been generated for{' '}
                <strong className="text-emerald-300">{createdStudentResult.student.fullName}</strong>.
              </p>
            </div>

            {/* Credential Slip Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <span>Account Access Slip</span>
                <span className="text-emerald-400">Active</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Resident ID</span>
                  <span className="text-white font-semibold">{createdStudentResult.student.studentNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Assigned Room</span>
                  <span className="text-white font-semibold">{createdStudentResult.room?.roomNumber || 'Room 03'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Username</span>
                  <span className="text-emerald-300 font-bold">{createdStudentResult.username}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Temporary Password</span>
                  <span className="text-emerald-300 font-bold">{createdStudentResult.tempPassword}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `Student: ${createdStudentResult.student.fullName}\nUsername: ${createdStudentResult.username}\nPassword: ${createdStudentResult.tempPassword}\nRoom: ${createdStudentResult.room?.roomNumber || 'Assigned'}`,
                      'all-creds'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-[11px] font-semibold transition"
                >
                  {copiedKey === 'all-creds' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'all-creds' ? 'Credentials Copied!' : 'Copy Credentials'}</span>
                </button>
              </div>
            </div>

            {/* CALLOUT: ADD STUDENT AGREEMENT */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 to-slate-900 border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h4 className="font-extrabold text-white text-xs">
                  Next Step: Add Lease Agreement for {createdStudentResult.student.shortName}
                </h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                The account is ready for system login. Would you like to draft and link their official 12-month accommodation lease agreement now?
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                type="button"
                onClick={() => setCreatedStudentResult(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
              >
                Done (Return to Directory)
              </button>
              <button
                type="button"
                onClick={() => {
                  const stud = createdStudentResult.student;
                  setCreatedStudentResult(null);
                  handleOpenDraftAgreementForStudent(stud);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-950 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Draft & Add Agreement Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: DEDICATED DRAFT & ADD STUDENT AGREEMENT MODAL                     */}
      {/* ========================================================================= */}
      {isDraftAgreementModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-200 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    Draft & Add Student Lease Agreement
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bind student resident to room and activate digital tenancy agreement.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDraftAgreementModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDraftAgreement} className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Target Student Info Pill */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {draftAgreementTarget?.initials || 'ST'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-xs block">
                      {draftAgreementTarget?.fullName}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Student ID: {draftAgreementTarget?.studentNumber} • {draftAgreementTarget?.course}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
                  New Lease
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    Assigned Residence Room *
                  </label>
                  <select
                    value={draftAgreementForm.roomId}
                    onChange={(e) => {
                      const selRoom = rooms.find((r) => r.id === e.target.value);
                      setDraftAgreementForm({
                        ...draftAgreementForm,
                        roomId: e.target.value,
                        monthlyRental: selRoom ? selRoom.monthlyRent : draftAgreementForm.monthlyRental,
                        securityDeposit: selRoom ? selRoom.monthlyRent : draftAgreementForm.securityDeposit,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                    required
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roomNumber} ({r.block} • {r.floor}) - R{r.monthlyRent.toLocaleString('en-ZA')}/mo
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    Lease Term *
                  </label>
                  <input
                    type="text"
                    value={draftAgreementForm.leaseTerm}
                    onChange={(e) =>
                      setDraftAgreementForm({ ...draftAgreementForm, leaseTerm: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    Start Date *
                  </label>
                  <input
                    type="text"
                    value={draftAgreementForm.startDate}
                    onChange={(e) =>
                      setDraftAgreementForm({ ...draftAgreementForm, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    End Date *
                  </label>
                  <input
                    type="text"
                    value={draftAgreementForm.endDate}
                    onChange={(e) =>
                      setDraftAgreementForm({ ...draftAgreementForm, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    Monthly Rental (ZAR) *
                  </label>
                  <input
                    type="number"
                    value={draftAgreementForm.monthlyRental}
                    onChange={(e) =>
                      setDraftAgreementForm({
                        ...draftAgreementForm,
                        monthlyRental: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-emerald-700 dark:text-emerald-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    Security Deposit (ZAR) *
                  </label>
                  <input
                    type="number"
                    value={draftAgreementForm.securityDeposit}
                    onChange={(e) =>
                      setDraftAgreementForm({
                        ...draftAgreementForm,
                        securityDeposit: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    Security Deposit Status
                  </label>
                  <select
                    value={draftAgreementForm.securityDepositStatus}
                    onChange={(e) =>
                      setDraftAgreementForm({
                        ...draftAgreementForm,
                        securityDepositStatus: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="Paid">Paid in Full</option>
                    <option value="Pending">Payment Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1 font-semibold">
                    Agreement Status
                  </label>
                  <select
                    value={draftAgreementForm.status}
                    onChange={(e) =>
                      setDraftAgreementForm({
                        ...draftAgreementForm,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <option value="Active">Active & Verified</option>
                    <option value="Pending Verification">Pending Verification</option>
                  </select>
                </div>
              </div>

              {/* Standard Clauses Preview */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                  Legal Clauses Included:
                </span>
                <p>1. Purpose: Sole student residence, no unauthorized commercial exploitation.</p>
                <p>2. Rental Period: Fixed 12-month period adhering to CUT academic schedule.</p>
                <p>3. Payment Terms: Due by 1st of each calendar month into Capitec Bank account.</p>
                <p>4. Use of Premises: Quiet hours after 10:00 PM and student code of conduct.</p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsDraftAgreementModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-900/30 transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Create & Activate Agreement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: SYSTEM CREDENTIALS INSPECTOR MODAL                                */}
      {/* ========================================================================= */}
      {viewCredentialsStudent && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 text-xs text-slate-200 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">System Login Credentials</h3>
              </div>
              <button
                onClick={() => setViewCredentialsStudent(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Resident Full Name
                </span>
                <span className="text-white font-semibold text-sm">
                  {viewCredentialsStudent.fullName}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono">
                <div>
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>Username</span>
                    <button
                      onClick={() =>
                        copyToClipboard(viewCredentialsStudent.account?.username || '', 'user-clip')
                      }
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'user-clip' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="text-emerald-300 font-bold text-xs">
                    {viewCredentialsStudent.account?.username || viewCredentialsStudent.shortName.toLowerCase().replace(/\s+/g, '')}
                  </div>
                </div>

                <div className="pt-1.5 border-t border-slate-850">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>Password / Access Key</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          viewCredentialsStudent.account?.temporaryPassword || 'ResiPass2026!',
                          'pass-clip'
                        )
                      }
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'pass-clip' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="text-emerald-300 font-bold text-xs">
                    {viewCredentialsStudent.account?.temporaryPassword || '••••••••••••'}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed">
                The resident can sign into the Student Mobile App using either this username or their registered email address (<strong className="text-slate-300">{viewCredentialsStudent.email}</strong>).
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewCredentialsStudent(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: STUDENT PROFILE DETAILS DRAWER / MODAL                            */}
      {/* ========================================================================= */}
      {selectedStudent && !isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 border border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${selectedStudent.avatarColor} text-white font-bold text-sm flex items-center justify-center shadow-xs`}
                >
                  {selectedStudent.initials}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {selectedStudent.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {selectedStudent.studentNumber} • Room {currentRoom?.roomNumber || 'None'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-4 text-xs font-semibold">
              <button
                onClick={() => setStudentModalTab('personal')}
                className={`py-3 border-b-2 transition ${
                  studentModalTab === 'personal'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Personal Info
              </button>
              <button
                onClick={() => setStudentModalTab('agreements')}
                className={`py-3 border-b-2 transition ${
                  studentModalTab === 'agreements'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Rental Agreements ({currentAgreement ? '1 Active' : '0'})
              </button>
              <button
                onClick={() => setStudentModalTab('payments')}
                className={`py-3 border-b-2 transition ${
                  studentModalTab === 'payments'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Payment History ({currentPayments.length})
              </button>
            </div>

            {/* Modal Tab Body */}
            <div className="p-6 overflow-y-auto flex-1 text-xs">
              {studentModalTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Full Legal Name
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {selectedStudent.fullName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        National ID Number
                      </span>
                      <span className="font-mono text-slate-900 dark:text-white">
                        {selectedStudent.idNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Email Address
                      </span>
                      <span className="text-slate-900 dark:text-white">{selectedStudent.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Mobile Phone
                      </span>
                      <span className="text-slate-900 dark:text-white">{selectedStudent.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Institution
                      </span>
                      <span className="text-slate-900 dark:text-white">
                        {selectedStudent.institution}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Course</span>
                      <span className="text-slate-900 dark:text-white">{selectedStudent.course}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Assigned Accommodation
                      </span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {currentRoom ? `${currentRoom.roomNumber} (${currentRoom.block})` : 'Unassigned'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        System Username
                      </span>
                      <span className="text-slate-900 dark:text-white font-mono">
                        @{selectedStudent.account?.username || 'auto'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                      Emergency Contact
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Contact Name</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {selectedStudent.emergencyContact.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Telephone</span>
                        <span className="text-slate-900 dark:text-white">
                          {selectedStudent.emergencyContact.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {studentModalTab === 'agreements' && (
                <div className="space-y-4">
                  {currentAgreement ? (
                    <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                            Agreement #{currentAgreement.id}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            {currentAgreement.leaseTerm}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[10px]">
                          {currentAgreement.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Start Date</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {currentAgreement.startDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">End Date</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {currentAgreement.endDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Monthly Rental</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            R{currentAgreement.monthlyRental.toLocaleString('en-ZA')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Security Deposit</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            R{currentAgreement.securityDeposit.toLocaleString('en-ZA')} (Paid)
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-750">
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          ✓ Legally Binding Active Lease
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenDraftAgreementForStudent(selectedStudent)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Draft Updated Lease
                          </button>
                          <button
                            onClick={() => setShowPrintModal(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Print / View Agreement
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 px-4 text-center bg-slate-50 dark:bg-slate-850 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
                      <FileText className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          No Rental Agreement Attached Yet
                        </h4>
                        <p className="text-slate-500 text-xs max-w-sm mx-auto mt-0.5">
                          This student account has been registered, but does not yet have an active lease contract drafted.
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenDraftAgreementForStudent(selectedStudent)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-xs transition"
                      >
                        <Plus className="w-4 h-4" />
                        Draft New Lease Agreement Now
                      </button>
                    </div>
                  )}
                </div>
              )}

              {studentModalTab === 'payments' && (
                <div className="space-y-2">
                  {currentPayments.length === 0 ? (
                    <div className="py-8 text-center text-slate-400">
                      No payment records found.
                    </div>
                  ) : (
                    currentPayments.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {p.transactionPeriod} Rent
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {p.status === 'Paid' ? `Paid on ${p.paymentDate}` : `Due: ${p.dueDate}`} • Ref: {p.reference}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900 dark:text-white">
                            R{p.amount.toLocaleString('en-ZA')}.00
                          </div>
                          <span
                            className={`text-[10px] font-semibold ${
                              p.status === 'Paid'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-between">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-semibold hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: EDIT STUDENT MODAL                                                */}
      {/* ========================================================================= */}
      {isEditModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 animate-in zoom-in-95 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Edit Student Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={selectedStudent.fullName}
                  onChange={(e) =>
                    setSelectedStudent({ ...selectedStudent, fullName: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  value={selectedStudent.email}
                  onChange={(e) =>
                    setSelectedStudent({ ...selectedStudent, email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={selectedStudent.phone}
                  onChange={(e) =>
                    setSelectedStudent({ ...selectedStudent, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Room Assignment</label>
                <select
                  value={selectedStudent.assignedRoomId}
                  onChange={(e) =>
                    setSelectedStudent({ ...selectedStudent, assignedRoomId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.roomNumber} ({r.block})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: PRINTABLE LEASE AGREEMENT MODAL                                   */}
      {/* ========================================================================= */}
      {currentAgreement && (
        <PrintableAgreementModal
          agreement={currentAgreement}
          student={selectedStudent || undefined}
          room={currentRoom}
          owner={ownerProfile}
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
