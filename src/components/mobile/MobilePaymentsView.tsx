import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord } from '../../types';
import {
  CreditCard,
  Building,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Receipt,
  X,
  Copy,
  Check,
  Download,
} from 'lucide-react';

export const MobilePaymentsView: React.FC = () => {
  const {
    currentStudent,
    currentStudentRoom,
    currentStudentPayments,
    studentOutstandingBalance,
    processStudentPayment,
    ownerProfile,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'pending'>('all');
  const [selectedPaymentForPay, setSelectedPaymentForPay] = useState<PaymentRecord | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredPayments = currentStudentPayments.filter((p) => {
    if (activeTab === 'paid') return p.status === 'Paid';
    if (activeTab === 'pending') return p.status === 'Pending';
    return true;
  });

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName} to clipboard`, 'info');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePayConfirm = () => {
    if (!selectedPaymentForPay) return;
    setIsProcessing(true);
    setTimeout(() => {
      processStudentPayment(selectedPaymentForPay.id);
      setIsProcessing(false);
      setSelectedReceipt(selectedPaymentForPay);
      setSelectedPaymentForPay(null);
    }, 700);
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Outstanding Balance Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-md border border-slate-700/80">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span>Outstanding Balance</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {studentOutstandingBalance > 0 ? 'Action Required' : 'Settled'}
          </span>
        </div>
        <div className="text-2xl font-extrabold tracking-tight mt-1 text-white">
          R{studentOutstandingBalance.toLocaleString('en-ZA')}.00
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {studentOutstandingBalance > 0
            ? 'Monthly rental payments must be settled by the 1st of each month.'
            : 'All current invoices are cleared. Thank you for paying on time!'}
        </p>

        {studentOutstandingBalance > 0 && (
          <button
            onClick={() => {
              const firstPending = currentStudentPayments.find((p) => p.status === 'Pending');
              if (firstPending) setSelectedPaymentForPay(firstPending);
            }}
            className="mt-3.5 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Make Payment Now
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
        {(['all', 'paid', 'pending'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 rounded-lg capitalize font-medium transition text-center ${
              activeTab === tab
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Invoices List */}
      <div className="space-y-3">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No records found for this filter.
          </div>
        ) : (
          filteredPayments.map((payment) => {
            const isPaid = payment.status === 'Paid';
            return (
              <div
                key={payment.id}
                className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {payment.transactionPeriod}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isPaid ? `Paid: ${payment.paymentDate}` : `Due: ${payment.dueDate}`}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      isPaid
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {isPaid ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {payment.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-700/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Amount</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      R{payment.amount.toLocaleString('en-ZA')}.00
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Reference</span>
                    <span className="font-mono text-slate-600 dark:text-slate-300 text-[11px]">
                      {payment.reference}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-2">
                  {isPaid ? (
                    <button
                      onClick={() => setSelectedReceipt(payment)}
                      className="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                      View Receipt
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedPaymentForPay(payment)}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Make Payment
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Payment Details Modal */}
      {selectedPaymentForPay && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl max-w-sm w-full p-5 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Payment Details
              </span>
              <button
                onClick={() => setSelectedPaymentForPay(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                  {selectedPaymentForPay.transactionPeriod} Rent
                </span>
                <div className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-0.5">
                  R{selectedPaymentForPay.amount.toLocaleString('en-ZA')}.00
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Due date: {selectedPaymentForPay.dueDate}
                </span>
              </div>

              {/* Verified Banking Info */}
              <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px]">
                    Lessor Banking Information
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    Verified Account
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Bank</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {ownerProfile.bankName}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Account No</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900 dark:text-white">
                    <span>{ownerProfile.accountNumber}</span>
                    <button
                      onClick={() => handleCopy(ownerProfile.accountNumber, 'Account Number')}
                      className="p-1 hover:text-emerald-600"
                    >
                      {copiedField === 'Account Number' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Reference</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    <span>{currentStudent.agreementId}</span>
                    <button
                      onClick={() => handleCopy(currentStudent.agreementId, 'Reference')}
                      className="p-1 hover:text-emerald-600"
                    >
                      {copiedField === 'Reference' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Beneficiary</span>
                  <span className="text-slate-800 dark:text-slate-200">{ownerProfile.name}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Clicking confirm simulates instant instant-clearing EFT through Capitec Pay / Ozow
                payment gateway. Your receipt will be generated immediately.
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  disabled={isProcessing}
                  onClick={handlePayConfirm}
                  className="flex-1 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs text-center shadow-md transition disabled:opacity-50"
                >
                  {isProcessing ? 'Processing EFT...' : `Pay R${selectedPaymentForPay.amount.toLocaleString('en-ZA')}.00 Now`}
                </button>
                <button
                  onClick={() => setSelectedPaymentForPay(null)}
                  className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt View Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 max-h-[85vh] overflow-y-auto animate-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Payment Receipt
              </span>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Payment Successful
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transaction ID: {selectedReceipt.reference}
              </p>
              <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 my-2">
                R{selectedReceipt.amount.toLocaleString('en-ZA')}.00
              </div>
            </div>

            <div className="mt-4 space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Period:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedReceipt.transactionPeriod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {currentStudent.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room Unit:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {currentStudentRoom?.roomNumber} ({currentStudentRoom?.block})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Paid Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedReceipt.paymentDate || 'Today'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedReceipt.paymentMethod}
                </span>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => {
                  showToast('Receipt saved to device documents.', 'success');
                  setSelectedReceipt(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs text-center shadow-xs transition inline-flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
