import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord } from '../../types';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  Receipt,
  X,
  FileCheck,
} from 'lucide-react';

export const OwnerPayments: React.FC = () => {
  const {
    payments,
    students,
    rooms,
    recordManualPayment,
    sendWarningNotice,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  // Form state for recording payment
  const [recordForm, setRecordForm] = useState({
    studentId: '',
    roomId: '',
    transactionPeriod: 'February 2026',
    amount: 2500,
    paymentDate: '24 Feb 2026',
    paymentMethod: 'EFT / Bank Transfer',
    reference: `EFT-${Math.floor(100000000 + Math.random() * 900000000)}`,
  });

  const pendingPayments = payments.filter((p) => p.status === 'Pending');
  const outstandingTotal = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter((p) => {
    const student = students.find((s) => s.id === p.studentId);
    const matchesSearch =
      student?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.transactionPeriod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'paid') return matchesSearch && p.status === 'Paid';
    if (activeTab === 'pending') return matchesSearch && p.status === 'Pending';
    return matchesSearch;
  });

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordForm.studentId) {
      showToast('Please select a student resident', 'warning');
      return;
    }

    const student = students.find((s) => s.id === recordForm.studentId);
    const roomId = recordForm.roomId || student?.assignedRoomId || 'room-01';

    recordManualPayment({
      studentId: recordForm.studentId,
      roomId,
      transactionPeriod: recordForm.transactionPeriod,
      amount: Number(recordForm.amount),
      paymentDate: recordForm.paymentDate,
      paymentMethod: recordForm.paymentMethod,
      reference: recordForm.reference || `REC-${Date.now().toString().slice(-6)}`,
    });

    setIsRecordModalOpen(false);
  };

  const getStudent = (id: string) => students.find((s) => s.id === id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Payments Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor historical student lease transactions and payment collections.
          </p>
        </div>
        <button
          onClick={() => {
            const firstStudent = students[0];
            setRecordForm({
              studentId: firstStudent?.id || '',
              roomId: firstStudent?.assignedRoomId || 'room-01',
              transactionPeriod: 'March 2026',
              amount: 2800,
              paymentDate: '24 Feb 2026',
              paymentMethod: 'EFT / Bank Transfer',
              reference: `EFT-${Math.floor(100000000 + Math.random() * 900000000)}`,
            });
            setIsRecordModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Record New Payment
        </button>
      </div>

      {/* Outstanding Alert Box */}
      {pendingPayments.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/60 rounded-lg text-amber-800 dark:text-amber-300 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                Outstanding Payments Alert
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                There are {pendingPayments.length} outstanding invoices totaling R{outstandingTotal.toLocaleString('en-ZA')} requiring immediate attention.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('pending')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold self-start md:self-center shrink-0 shadow-xs"
          >
            Filter Pending Invoices
          </button>
        </div>
      )}

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
          {(
            [
              { id: 'all', label: 'All Payments' },
              { id: 'paid', label: 'Paid' },
              { id: 'pending', label: 'Pending' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-1.5 rounded-md font-semibold transition ${
                activeTab === t.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student, period or reference..."
            className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Transaction Period</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No payment records match this filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const student = getStudent(p.studentId);
                  const isPaid = p.status === 'Paid';

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {student?.shortName || 'Student'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {student?.studentNumber}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                        {p.transactionPeriod}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        R{p.amount.toLocaleString('en-ZA')}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {isPaid ? p.paymentDate : `Due: ${p.dueDate}`}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {isPaid ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                        {p.reference}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        {isPaid ? (
                          <button
                            onClick={() => setSelectedReceipt(p)}
                            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-[11px] font-medium inline-flex items-center gap-1 transition"
                          >
                            <Receipt className="w-3 h-3 text-emerald-600" />
                            Receipt
                          </button>
                        ) : (
                          <button
                            onClick={() => sendWarningNotice(p.id)}
                            className="px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 text-amber-800 dark:text-amber-200 text-[11px] font-bold inline-flex items-center gap-1 transition"
                          >
                            <Send className="w-3 h-3" />
                            Send Warning
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Record Lease Payment
                </h3>
                <p className="text-xs text-slate-500">
                  Input manual digital lease collections or bank transfers from tenants.
                </p>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">
                  Select Student Tenant *
                </label>
                <select
                  value={recordForm.studentId}
                  onChange={(e) => {
                    const stud = students.find((s) => s.id === e.target.value);
                    setRecordForm({
                      ...recordForm,
                      studentId: e.target.value,
                      roomId: stud?.assignedRoomId || 'room-01',
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  required
                >
                  <option value="">Select resident tenant</option>
                  {students.map((s) => {
                    const r = rooms.find((rm) => rm.id === s.assignedRoomId);
                    return (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({r?.roomNumber || 'Room'})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">
                  Transaction Period *
                </label>
                <select
                  value={recordForm.transactionPeriod}
                  onChange={(e) =>
                    setRecordForm({ ...recordForm, transactionPeriod: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <option value="January 2026">January 2026</option>
                  <option value="February 2026">February 2026</option>
                  <option value="March 2026">March 2026</option>
                  <option value="April 2026">April 2026</option>
                  <option value="May 2026">May 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">
                  Amount (R) *
                </label>
                <input
                  type="number"
                  value={recordForm.amount}
                  onChange={(e) =>
                    setRecordForm({ ...recordForm, amount: Number(e.target.value) })
                  }
                  placeholder="2500.00"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">
                  Payment Date
                </label>
                <input
                  type="text"
                  value={recordForm.paymentDate}
                  onChange={(e) =>
                    setRecordForm({ ...recordForm, paymentDate: e.target.value })
                  }
                  placeholder="24 Feb 2026"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={recordForm.paymentMethod}
                  onChange={(e) =>
                    setRecordForm({ ...recordForm, paymentMethod: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <option value="EFT / Bank Transfer">EFT / Bank Transfer</option>
                  <option value="Capitec Bank EFT">Capitec Bank EFT</option>
                  <option value="Cash Deposit">Cash Deposit</option>
                  <option value="Debit Card">Debit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">
                  Invoice/Confirmation Reference
                </label>
                <input
                  type="text"
                  value={recordForm.reference}
                  onChange={(e) =>
                    setRecordForm({ ...recordForm, reference: e.target.value })
                  }
                  placeholder="EFT-994821034-MOLOI"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-sm w-full p-5 space-y-3 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                Official Payment Receipt
              </span>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2">
              <FileCheck className="w-10 h-10 text-emerald-600 mx-auto mb-1" />
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                R{selectedReceipt.amount.toLocaleString('en-ZA')}.00
              </div>
              <span className="text-[11px] text-slate-400">
                Ref: {selectedReceipt.reference}
              </span>
            </div>

            <div className="space-y-1.5 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Student:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {getStudent(selectedReceipt.studentId)?.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Period:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedReceipt.transactionPeriod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Settled On:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedReceipt.paymentDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Channel:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedReceipt.paymentMethod}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('Receipt dispatched to student email', 'info');
                setSelectedReceipt(null);
              }}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs transition"
            >
              Email Receipt to Tenant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
