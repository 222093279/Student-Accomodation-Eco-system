import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  CreditCard,
  Bell,
  FileText,
  Save,
  Shield,
  CheckCircle,
  Building,
} from 'lucide-react';

export const OwnerSettings: React.FC = () => {
  const { ownerProfile, updateOwnerProfile, showToast } = useApp();

  const [form, setForm] = useState({
    name: ownerProfile.name,
    email: ownerProfile.email,
    phone: ownerProfile.phone,
    alternativePhone: ownerProfile.alternativePhone,
    bankName: ownerProfile.bankName,
    accountNumber: ownerProfile.accountNumber,
    accountType: ownerProfile.accountType,
    paymentReference: ownerProfile.paymentReference,
    newBookings: ownerProfile.notifications.newBookings,
    rentPayments: ownerProfile.notifications.rentPayments,
    maintenanceAlerts: ownerProfile.notifications.maintenanceAlerts,
  });

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'rules'>('profile');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOwnerProfile({
      name: form.name,
      email: form.email,
      phone: form.phone,
      alternativePhone: form.alternativePhone,
      bankName: form.bankName,
      accountNumber: form.accountNumber,
      accountType: form.accountType,
      paymentReference: form.paymentReference,
      notifications: {
        newBookings: form.newBookings,
        rentPayments: form.rentPayments,
        maintenanceAlerts: form.maintenanceAlerts,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Profile & Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your owner profile, portal configuration and preferences.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'profile'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            Owner Settings
          </button>
          <button
            onClick={() => setActiveSubTab('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'rules'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            Terms & Conduct Rules
          </button>
        </div>
      </div>

      {activeSubTab === 'profile' ? (
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
              <User className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">
                  Alternative Phone
                </label>
                <input
                  type="text"
                  value={form.alternativePhone}
                  onChange={(e) => setForm({ ...form, alternativePhone: e.target.value })}
                  placeholder="Not set"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Banking Details (For Student Payments) */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Banking Details (For Payments)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Displayed on student mobile payment screens and official printed lease contracts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">
                  Account Type
                </label>
                <select
                  value={form.accountType}
                  onChange={(e) => setForm({ ...form, accountType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <option value="Cheque">Cheque</option>
                  <option value="Current">Current</option>
                  <option value="Savings">Savings</option>
                  <option value="Transmission">Transmission</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">
                  Default Payment Reference
                </label>
                <input
                  type="text"
                  value={form.paymentReference}
                  onChange={(e) => setForm({ ...form, paymentReference: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Notifications Preferences */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700">
              <Bell className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Notifications Preferences
              </h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    New Bookings
                  </div>
                  <div className="text-[11px] text-slate-500">
                    When a student applies for a room or signs a lease
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.newBookings}
                  onChange={(e) => setForm({ ...form, newBookings: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Rent Payments
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Get notified on monthly receipts and bank transfer confirmations
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.rentPayments}
                  onChange={(e) => setForm({ ...form, rentPayments: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Maintenance Alerts
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Student reported issue messages (geyser, kitchen, plumbing)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.maintenanceAlerts}
                  onChange={(e) => setForm({ ...form, maintenanceAlerts: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </form>
      ) : (
        /* Rules & Terms View */
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Standard Lease Agreement Draft & House Rules
              </h3>
              <p className="text-slate-500 text-[11px]">
                Define lease policies, deposit terms, and rules governing the residency.
              </p>
            </div>
            <button
              onClick={() => showToast('Rules updated successfully', 'success')}
              className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg font-semibold"
            >
              Modify Rules
            </button>
          </div>

          <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                1. Purpose
              </span>
              These rules and conditions govern the rental of student accommodation and the behavior
              guidelines within the residence premises. All parties are bound strictly to peaceful
              coexistence. The Premises shall be used solely as student accommodation. Any unauthorized
              commercial exploitation is strictly prohibited.
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                2. Rental Period
              </span>
              The active lease period is designated for exactly 12 months, commencing formally on 01
              February 2026 and concluding on 30 November 2026, subject to mutual extension policies
              and compliance verification.
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                3. Payment Terms
              </span>
              Monthly rent payments are due on or before the 1st of each calendar month. Late
              payments may result in administrative penalties, interest accrual, or system warnings.
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                4. Use of Premises & Conduct
              </span>
              The designated rooms and residence spaces are strictly restricted to student
              accommodation purposes. Subletting, industrial workspace operations, or unrecognized
              commercial events are prohibited. Quiet hours are enforced after 10:00 PM.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
