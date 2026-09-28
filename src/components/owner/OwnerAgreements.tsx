import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Agreement } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Printer,
  Edit2,
  CheckCircle2,
  Clock,
  X,
  ExternalLink,
  ShieldCheck,
  User,
  Home,
} from 'lucide-react';
import { PrintableAgreementModal } from '../common/PrintableAgreementModal';

export const OwnerAgreements: React.FC = () => {
  const {
    agreements,
    students,
    rooms,
    createAgreement,
    ownerProfile,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form for drafting lease
  const [newAgreementForm, setNewAgreementForm] = useState({
    studentId: '',
    roomId: '',
    leaseTerm: '12 Months (Full Academic Year)',
    startDate: '01 February 2026',
    endDate: '30 November 2026',
    monthlyRental: 3000,
    securityDeposit: 3000,
    securityDepositStatus: 'Paid' as const,
    agreeTerms: true,
  });

  const filteredAgreements = agreements.filter((agr) => {
    const student = students.find((s) => s.id === agr.studentId);
    const room = rooms.find((r) => r.id === agr.roomId);

    return (
      agr.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.studentNumber.includes(searchQuery) ||
      room?.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgreementForm.studentId || !newAgreementForm.roomId) {
      showToast('Please select both a student and a room', 'warning');
      return;
    }

    createAgreement({
      studentId: newAgreementForm.studentId,
      roomId: newAgreementForm.roomId,
      leaseTerm: newAgreementForm.leaseTerm,
      startDate: newAgreementForm.startDate,
      endDate: newAgreementForm.endDate,
      monthlyRental: Number(newAgreementForm.monthlyRental),
      securityDeposit: Number(newAgreementForm.securityDeposit),
      securityDepositStatus: newAgreementForm.securityDepositStatus,
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

    setIsCreateModalOpen(false);
  };

  const getStudent = (id: string) => students.find((s) => s.id === id);
  const getRoom = (id: string) => rooms.find((r) => r.id === id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Rental Agreements
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track and manage legally binding digital contracts with your student tenants.
          </p>
        </div>
        <button
          onClick={() => {
            const firstUnassignedStudent = students[0];
            const firstAvailableRoom = rooms.find((r) => r.status === 'Available') || rooms[0];
            setNewAgreementForm({
              studentId: firstUnassignedStudent?.id || '',
              roomId: firstAvailableRoom?.id || '',
              leaseTerm: '12 Months (Full Academic Year)',
              startDate: '01 February 2026',
              endDate: '30 November 2026',
              monthlyRental: firstAvailableRoom ? firstAvailableRoom.monthlyRent : 2800,
              securityDeposit: firstAvailableRoom ? firstAvailableRoom.monthlyRent : 2800,
              securityDepositStatus: 'Paid',
              agreeTerms: true,
            });
            setIsCreateModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Agreement
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student, ID or agreement REF..."
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
      </div>

      {/* Agreements Table */}
      <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">REF</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Room Assigned</th>
                <th className="py-3 px-4">Rent Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredAgreements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No agreements found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredAgreements.map((agr) => {
                  const student = getStudent(agr.studentId);
                  const room = getRoom(agr.roomId);

                  return (
                    <tr
                      key={agr.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {agr.id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                        {student?.fullName || 'Assigned Student'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                        {student?.studentNumber}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">{room?.roomNumber}</span>
                        <span className="text-[10px] text-slate-400 block">
                          {room ? `${room.block}` : ''}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-700 dark:text-emerald-400">
                        R{agr.monthlyRental.toLocaleString('en-ZA')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            agr.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {agr.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedAgreement(agr)}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-medium text-[11px] transition"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAgreement(agr);
                            setShowPrintModal(true);
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-medium text-[11px] border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1 transition"
                        >
                          <Printer className="w-3 h-3" />
                          Print
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

      {/* Agreement Details Modal */}
      {selectedAgreement && !showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Agreement Details - REF: {selectedAgreement.id}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Student Resident: {getStudent(selectedAgreement.studentId)?.fullName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAgreement(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Financial & Term Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Lease Term
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedAgreement.leaseTerm}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Start Date
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedAgreement.startDate}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    End Date
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedAgreement.endDate}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Monthly Rental
                  </span>
                  <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
                    R{selectedAgreement.monthlyRental.toLocaleString('en-ZA')}.00
                  </span>
                </div>
              </div>

              {/* Associated Student & Room Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Associated Student Information
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {getStudent(selectedAgreement.studentId)?.fullName}
                  </div>
                  <div className="text-slate-500">
                    Student ID: {getStudent(selectedAgreement.studentId)?.studentNumber}
                  </div>
                  <div className="text-slate-500">
                    Course: {getStudent(selectedAgreement.studentId)?.course}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Assigned Room Details
                  </span>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {getRoom(selectedAgreement.roomId)?.roomNumber} ({getRoom(selectedAgreement.roomId)?.block})
                  </div>
                  <div className="text-slate-500">
                    Floor: {getRoom(selectedAgreement.roomId)?.floor}
                  </div>
                  <div className="text-slate-500">
                    Type: {getRoom(selectedAgreement.roomId)?.roomType}
                  </div>
                </div>
              </div>

              {/* Standard Contract Clauses */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                  Enforced Terms & Conditions
                </h4>
                <div className="space-y-2 text-slate-600 dark:text-slate-300 text-xs">
                  <p>
                    <strong className="text-slate-900 dark:text-white">1. Purpose:</strong>{' '}
                    {selectedAgreement.clauses.purpose}
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">2. Rental Period:</strong>{' '}
                    {selectedAgreement.clauses.rentalPeriod}
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">3. Payment Terms:</strong>{' '}
                    {selectedAgreement.clauses.paymentTerms}
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">4. Use of Premises:</strong>{' '}
                    {selectedAgreement.clauses.useOfPremises}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
              <button
                onClick={() => setShowPrintModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-xs transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Agreement
              </button>
              <button
                onClick={() => setSelectedAgreement(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg"
              >
                Back to Agreements
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Agreement Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Create Lease Agreement
                </h3>
                <p className="text-xs text-slate-500">
                  Bind a student to an available room by drafting a new digital rental agreement.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">
                    Select Student *
                  </label>
                  <select
                    value={newAgreementForm.studentId}
                    onChange={(e) => {
                      const selectedStud = students.find((s) => s.id === e.target.value);
                      const studentRoom = selectedStud?.assignedRoomId
                        ? rooms.find((r) => r.id === selectedStud.assignedRoomId)
                        : null;
                      setNewAgreementForm({
                        ...newAgreementForm,
                        studentId: e.target.value,
                        roomId: studentRoom ? studentRoom.id : newAgreementForm.roomId,
                        monthlyRental: studentRoom ? studentRoom.monthlyRent : newAgreementForm.monthlyRental,
                        securityDeposit: studentRoom ? studentRoom.monthlyRent : newAgreementForm.securityDeposit,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium"
                    required
                  >
                    <option value="">Search and select student</option>
                    {students.map((s) => {
                      const hasAg = agreements.some((a) => a.studentId === s.id);
                      const r = rooms.find((rm) => rm.id === s.assignedRoomId);
                      return (
                        <option key={s.id} value={s.id}>
                          {s.fullName} ({s.studentNumber}) • {r?.roomNumber || 'Unassigned'}{' '}
                          {hasAg ? '✓ Has Lease' : '★ Needs Agreement'}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">
                    Select Room *
                  </label>
                  <select
                    value={newAgreementForm.roomId}
                    onChange={(e) => {
                      const selRoom = rooms.find((r) => r.id === e.target.value);
                      setNewAgreementForm({
                        ...newAgreementForm,
                        roomId: e.target.value,
                        monthlyRental: selRoom ? selRoom.monthlyRent : 2800,
                        securityDeposit: selRoom ? selRoom.monthlyRent : 2800,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                    required
                  >
                    <option value="">Select vacant room</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roomNumber} - {r.block} ({r.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">
                    Agreement Start Date
                  </label>
                  <input
                    type="text"
                    value={newAgreementForm.startDate}
                    onChange={(e) =>
                      setNewAgreementForm({ ...newAgreementForm, startDate: e.target.value })
                    }
                    placeholder="e.g. 01 Feb 2026"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">
                    Agreement End Date
                  </label>
                  <input
                    type="text"
                    value={newAgreementForm.endDate}
                    onChange={(e) =>
                      setNewAgreementForm({ ...newAgreementForm, endDate: e.target.value })
                    }
                    placeholder="e.g. 30 Nov 2026"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">
                    Monthly Rent (ZAR)
                  </label>
                  <input
                    type="number"
                    value={newAgreementForm.monthlyRental}
                    onChange={(e) =>
                      setNewAgreementForm({
                        ...newAgreementForm,
                        monthlyRental: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">
                    Security Deposit Required (ZAR)
                  </label>
                  <input
                    type="number"
                    value={newAgreementForm.securityDeposit}
                    onChange={(e) =>
                      setNewAgreementForm({
                        ...newAgreementForm,
                        securityDeposit: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAgreementForm.agreeTerms}
                    onChange={(e) =>
                      setNewAgreementForm({
                        ...newAgreementForm,
                        agreeTerms: e.target.checked,
                      })
                    }
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    I agree to the system generated terms and conditions, lease compliance templates and legal guidelines.
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newAgreementForm.agreeTerms}
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  Create Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Modal */}
      {selectedAgreement && (
        <PrintableAgreementModal
          agreement={selectedAgreement}
          student={getStudent(selectedAgreement.studentId)}
          room={getRoom(selectedAgreement.roomId)}
          owner={ownerProfile}
          isOpen={showPrintModal}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};
