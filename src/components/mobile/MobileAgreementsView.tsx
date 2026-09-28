import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Calendar,
  CheckCircle2,
  Shield,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { PrintableAgreementModal } from '../common/PrintableAgreementModal';

export const MobileAgreementsView: React.FC = () => {
  const {
    currentStudent,
    currentStudentRoom,
    currentStudentAgreement,
    signAgreement,
    ownerProfile,
  } = useApp();

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(
    currentStudentAgreement?.signedByStudent ?? true
  );

  if (!currentStudentAgreement) {
    return (
      <div className="py-12 text-center text-slate-400 text-xs">
        No active lease agreement found for this resident.
      </div>
    );
  }

  const handleSign = () => {
    if (!agreedTerms) return;
    signAgreement(currentStudentAgreement.id);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Agreement Header Card */}
      <div className="bg-white dark:bg-slate-800/95 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Agreement Details
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            {currentStudentAgreement.status}
          </span>
        </div>

        {/* Key Contract Summary Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs pt-1 border-t border-slate-100 dark:border-slate-700/60">
          <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-medium block">
              Agreement No
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
              {currentStudentAgreement.id}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-medium block">
              Monthly Rent
            </span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">
              R{currentStudentAgreement.monthlyRental.toLocaleString('en-ZA')}.00
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-medium block">
              Start Date
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
              {currentStudentAgreement.startDate}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-medium block">
              End Date
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
              {currentStudentAgreement.endDate}
            </span>
          </div>
        </div>

        {/* Tenant Name */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Lessee (Student Resident)</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {currentStudent.fullName}
            </span>
          </div>
          <button
            onClick={() => setShowPrintModal(true)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Housing Policies / Terms & Conditions */}
      <div className="bg-white dark:bg-slate-800/95 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Housing Policies & Conduct
          </h4>
          <button
            onClick={() => setShowPrintModal(true)}
            className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium inline-flex items-center gap-0.5 hover:underline"
          >
            View Terms & Conditions
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Please read and accept the code of conduct below.
        </p>

        {/* 4 Clauses from prompt */}
        <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              1. Purpose
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentStudentAgreement.clauses.purpose}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              2. Rental Period
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentStudentAgreement.clauses.rentalPeriod}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              3. Payment Terms
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentStudentAgreement.clauses.paymentTerms}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
              4. Use of Premises
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentStudentAgreement.clauses.useOfPremises}
            </p>
          </div>
        </div>

        {/* Agreement Acceptance / Checkbox */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-xs text-slate-700 dark:text-slate-300 select-none">
              I agree to the terms and conditions and student code of conduct.
            </span>
          </label>

          {currentStudentAgreement.signedByStudent ? (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Signed on {currentStudentAgreement.signedDate || '28 Jan 2026'}
              </div>
              <button
                onClick={() => setShowPrintModal(true)}
                className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                View Signed PDF
              </button>
            </div>
          ) : (
            <button
              disabled={!agreedTerms}
              onClick={handleSign}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs text-center shadow-xs transition disabled:opacity-40"
            >
              Sign & Confirm Agreement
            </button>
          )}
        </div>
      </div>

      {/* Printable Modal */}
      <PrintableAgreementModal
        agreement={currentStudentAgreement}
        student={currentStudent}
        room={currentStudentRoom}
        owner={ownerProfile}
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
      />
    </div>
  );
};
