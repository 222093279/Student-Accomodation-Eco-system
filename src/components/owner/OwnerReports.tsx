import React from 'react';
import { useApp } from '../../context/AppContext';
import { monthlyRevenueStats } from '../../mockData';
import {
  TrendingUp,
  PieChart,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Users,
} from 'lucide-react';

export const OwnerReports: React.FC = () => {
  const { rooms, students, payments, sendWarningNotice } = useApp();

  const totalRevenue = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments.filter((p) => p.status === 'Pending');
  const outstandingTotal = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const occupiedRooms = rooms.filter((r) => r.status !== 'Available').length;
  const occupancyPercent = Math.round((occupiedRooms / rooms.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Performance Reports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Analyze residence capacity rates, historical income, and accounting indicators.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          Today: 24 Feb 2026
        </span>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Occupancy Rate */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Occupancy Rate
          </span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {occupancyPercent}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Both active blocks occupied through 2026
          </p>
        </div>

        {/* Total Recorded Revenue */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Recorded Revenue
          </span>
          <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
            R37,000
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Recorded lease collections over 5 months
          </p>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Outstanding Balance
          </span>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            R{outstandingTotal.toLocaleString('en-ZA')}
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-1">
            Requires immediate payment enforcement
          </p>
        </div>
      </div>

      {/* Enforcement Alert */}
      {pendingPayments.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between text-xs">
          <div>
            <h4 className="font-bold text-amber-950 dark:text-amber-100">
              Enforce Payment Deadlines
            </h4>
            <p className="text-amber-800 dark:text-amber-300 text-[11px] mt-0.5">
              Two monthly invoices remain in unpaid or pending states. Please send automated reminders.
            </p>
          </div>
          <button
            onClick={() => {
              pendingPayments.forEach((p) => sendWarningNotice(p.id));
            }}
            className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold text-xs transition shrink-0"
          >
            Dispatch Reminders
          </button>
        </div>
      )}

      {/* Charts and Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Revenue Chart
              </h3>
              <p className="text-xs text-slate-500">Recorded income over last 5 months</p>
            </div>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-end justify-between h-44 gap-3 pt-6 border-b border-slate-200 dark:border-slate-700 pb-2">
            {monthlyRevenueStats.map((stat, idx) => {
              const heightPercent = (stat.amount / 11000) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                    {stat.label}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[44px] bg-emerald-600 hover:bg-emerald-500 rounded-t-md transition-all duration-300"
                  />
                  <span className="text-xs font-medium text-slate-500">{stat.month}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between text-[11px] text-slate-400">
            <span>Minimum: R5k</span>
            <span>Current: R10k</span>
          </div>
        </div>

        {/* Capacity Breakdown */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Capacity Breakdown
              </h3>
              <p className="text-xs text-slate-500">Unit-by-unit accommodation allocation</p>
            </div>
            <Users className="w-4 h-4 text-slate-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2 px-3">Room ID</th>
                  <th className="py-2 px-3">Assigned Tenant</th>
                  <th className="py-2 px-3">Monthly Rate</th>
                  <th className="py-2 px-3">Lease Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {rooms.map((r) => {
                  const assigned = students.filter((s) => r.assignedStudentIds.includes(s.id));
                  const tenantNames = assigned.map((s) => s.shortName).join(', ') || 'Vacant';
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        {r.roomNumber}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                        {tenantNames}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-700 dark:text-emerald-400">
                        R{r.monthlyRent.toLocaleString('en-ZA')}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                          {r.status === 'Available' ? 'Ready to Lease' : 'Active Contract'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
