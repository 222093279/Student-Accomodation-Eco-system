import React from 'react';
import { Agreement, Student, Room, OwnerProfile } from '../../types';
import { Printer, X, Download, ShieldCheck, CheckCircle } from 'lucide-react';

interface Props {
  agreement: Agreement;
  student?: Student;
  room?: Room;
  owner: OwnerProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintableAgreementModal: React.FC<Props> = ({
  agreement,
  student,
  room,
  owner,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-semibold text-slate-900">
              Student Accommodation Rental Agreement - {agreement.id}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium shadow-xs transition"
            >
              <Printer className="w-4 h-4" />
              Print / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contract Content (Print-ready) */}
        <div className="p-8 overflow-y-auto space-y-6 text-sm text-slate-800 leading-relaxed font-sans print:p-0">
          <div className="text-center border-b border-slate-200 pb-5">
            <span className="text-xs uppercase tracking-widest font-semibold text-slate-500">
              Republic of South Africa • Free State
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-950 mt-1">
              OFFICIAL STUDENT RESIDENCE LEASE AGREEMENT
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Ref: <span className="font-mono font-semibold">{agreement.id}</span> · Central University of Technology Accredited Private Accommodation
            </p>
          </div>

          {/* Parties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
            <div>
              <div className="font-bold text-slate-950 uppercase tracking-wider text-[11px] mb-1">
                Lessor / Property Owner
              </div>
              <p className="font-medium text-slate-900">{owner.name}</p>
              <p className="text-slate-600">Designation: {owner.title}</p>
              <p className="text-slate-600">Email: {owner.email}</p>
              <p className="text-slate-600">Contact: {owner.phone}</p>
            </div>
            <div>
              <div className="font-bold text-slate-950 uppercase tracking-wider text-[11px] mb-1">
                Student Resident / Lessee
              </div>
              <p className="font-medium text-slate-900">{student?.fullName || 'Tenant'}</p>
              <p className="text-slate-600">Student ID: {student?.studentNumber}</p>
              <p className="text-slate-600">National ID: {student?.idNumber}</p>
              <p className="text-slate-600">Institution: {student?.institution}</p>
              <p className="text-slate-600">Course: {student?.course}</p>
            </div>
          </div>

          {/* Premises and Key Financials */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border border-slate-200 rounded-lg p-3 text-center bg-slate-50/50">
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-semibold block">Room Unit</span>
              <span className="text-sm font-bold text-slate-900">{room?.roomNumber || 'Assigned'}</span>
              <span className="text-[11px] text-slate-600 block">{room?.block} · {room?.floor}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-semibold block">Lease Term</span>
              <span className="text-sm font-bold text-slate-900">{agreement.leaseTerm}</span>
              <span className="text-[11px] text-slate-600 block">{agreement.startDate} – {agreement.endDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-semibold block">Monthly Rent</span>
              <span className="text-sm font-bold text-emerald-800">R{agreement.monthlyRental.toLocaleString('en-ZA')}.00</span>
              <span className="text-[11px] text-slate-600 block">Due by 1st of month</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 font-semibold block">Deposit</span>
              <span className="text-sm font-bold text-slate-900">R{agreement.securityDeposit.toLocaleString('en-ZA')}.00</span>
              <span className="text-[11px] text-emerald-700 font-medium block">
                {agreement.securityDepositStatus === 'Paid' ? '✓ Fully Paid' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Legal Clauses */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b pb-1">
              Terms & Conditions / Code of Conduct
            </h3>

            <div className="space-y-3 text-xs leading-relaxed text-slate-700">
              <div>
                <span className="font-bold text-slate-900">1. Purpose: </span>
                {agreement.clauses.purpose}
              </div>
              <div>
                <span className="font-bold text-slate-900">2. Rental Period: </span>
                {agreement.clauses.rentalPeriod}
              </div>
              <div>
                <span className="font-bold text-slate-900">3. Payment Terms: </span>
                {agreement.clauses.paymentTerms} Payments must be deposited directly into the landlord's verified banking account below using student reference <span className="font-mono font-semibold">{agreement.id}</span>.
              </div>
              <div>
                <span className="font-bold text-slate-900">4. Use of Premises & Code of Conduct: </span>
                {agreement.clauses.useOfPremises}
              </div>
            </div>
          </div>

          {/* Banking Details Box */}
          <div className="border border-emerald-200 bg-emerald-50/60 rounded-lg p-3 text-xs">
            <div className="font-bold text-emerald-950 mb-1">Payment & Banking Details:</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-emerald-900">
              <div>Bank: <span className="font-semibold">{owner.bankName}</span></div>
              <div>Account No: <span className="font-semibold font-mono">{owner.accountNumber}</span></div>
              <div>Account Type: <span className="font-semibold">{owner.accountType}</span></div>
              <div>Reference: <span className="font-semibold font-mono">{agreement.id}</span></div>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="border-b border-slate-400 pb-8 text-slate-400 font-mono text-center italic">
                {owner.name}
              </div>
              <div className="mt-2 font-medium text-slate-900">Lessor Signature (Property Owner)</div>
              <div className="text-slate-500 text-[11px]">Date: 24 Jan 2026 · Authenticated Digital Seal</div>
            </div>
            <div>
              <div className="border-b border-slate-400 pb-8 text-slate-400 font-mono text-center italic flex items-end justify-center">
                {agreement.signedByStudent ? (
                  <span className="text-emerald-700 font-serif font-bold text-sm tracking-widest">
                    ✓ SIGNED DIGITALLY BY {student?.shortName || 'RESIDENT'}
                  </span>
                ) : (
                  <span className="text-amber-600 font-sans">Pending Student Acceptance</span>
                )}
              </div>
              <div className="mt-2 font-medium text-slate-900">Lessee Signature (Student Resident)</div>
              <div className="text-slate-500 text-[11px]">
                {agreement.signedByStudent ? `Signed on: ${agreement.signedDate || '28 Jan 2026'}` : 'Awaiting confirmation'}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Student Accommodation Management System • SA Gov Compliant</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
