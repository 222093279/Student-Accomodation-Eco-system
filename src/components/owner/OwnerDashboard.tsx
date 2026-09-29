import React from 'react';
import { useApp } from '../../context/AppContext';
import { monthlyRevenueStats } from '../../mockData';
import {
  Users,
  Home,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Send,
  CheckCircle2,
  Calendar,
  BarChart3,
  Wrench,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { OwnerActivityFeed } from './OwnerActivityFeed';

interface Props {
  onNavigate: (tab: any) => void;
}

export const OwnerDashboard: React.FC<Props> = ({ onNavigate }) => {
  const {
    students,
    rooms,
    agreements,
    payments,
    activities,
    maintenanceRequests,
    sendWarningNotice,
  } = useApp();

  const totalStudents = students.length;
  const availableRooms = rooms.filter((r) => r.status === 'Available').length;
  const occupiedRooms = rooms.length - availableRooms;
  const activeAgreements = agreements.filter((a) => a.status === 'Active').length;

  const pendingPayments = payments.filter((p) => p.status === 'Pending');
  const outstandingTotal = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const totalRevenue = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeMaintenance = maintenanceRequests.filter(
    (r) => r.status === 'Reported' || r.status === 'Scheduled' || r.status === 'In Progress'
  );
  const emergencyMaintenance = activeMaintenance.filter((r) => r.priority === 'Emergency');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time stats and management overview of your student residence.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('maintenance')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-semibold shadow-xs hover:bg-slate-800 transition"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
            Maintenance Hub
            {activeMaintenance.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold">
                {activeMaintenance.length}
              </span>
            )}
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Performance Reports
          </button>
        </div>
      </div>

      {/* KPI Cards Row (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Students */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-500/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Students
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {totalStudents}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            100% Occupancy rate
          </p>
        </div>

        {/* Total Rooms Available */}
        <div
          onClick={() => onNavigate('rooms')}
          className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-500/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Rooms Available
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {availableRooms}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {occupiedRooms} rooms currently active
          </p>
        </div>

        {/* Active Agreements */}
        <div
          onClick={() => onNavigate('agreements')}
          className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-500/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Agreements
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {activeAgreements}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Verified & active through 2026
          </p>
        </div>

        {/* Active Maintenance Requests */}
        <div
          onClick={() => onNavigate('maintenance')}
          className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-amber-500/50 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Maintenance Tasks
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 flex items-baseline gap-2">
            <span>{activeMaintenance.length}</span>
            {emergencyMaintenance.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                {emergencyMaintenance.length} Urgent
              </span>
            )}
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 font-medium">
            {activeMaintenance.filter((r) => r.status === 'Reported').length} need contractor dispatch
          </p>
        </div>
      </div>

      {/* Outstanding Payments Alert Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0">
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
            onClick={() => onNavigate('payments')}
            className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-xs transition self-start sm:self-center shrink-0"
          >
            Review Invoices
          </button>
        </div>

        {/* Quick Pending Items preview */}
        <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/60 grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {pendingPayments.slice(0, 3).map((item) => {
            const student = students.find((s) => s.id === item.studentId);
            return (
              <div
                key={item.id}
                className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {student?.shortName || 'Student'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    R{item.amount.toLocaleString('en-ZA')} • Due: {item.dueDate}
                  </span>
                </div>
                <button
                  onClick={() => sendWarningNotice(item.id)}
                  className="px-2 py-1 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200 text-amber-900 dark:text-amber-200 text-[10px] font-bold rounded flex items-center gap-1 transition"
                  title="Send immediate WhatsApp / SMS / Email reminder"
                >
                  <Send className="w-2.5 h-2.5" />
                  Send Warning
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Maintenance Tasks Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Active Maintenance & Repairs Queue
              </h3>
              <p className="text-[11px] text-slate-500">
                {activeMaintenance.length} issues currently active or reported by residents
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('maintenance')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 self-start sm:self-center"
          >
            <span>Manage All Tasks in Maintenance Hub</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {maintenanceRequests.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('maintenance')}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-emerald-500 cursor-pointer transition space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-500">
                  #{item.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : item.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : item.status === 'Scheduled'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                {item.title}
              </h4>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                <span>
                  {item.roomNumber} ({item.studentName.split(' ')[0]})
                </span>
                <span className="text-[10px] text-slate-400">{item.createdAt.split(',')[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Revenue Chart & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Revenue
              </h3>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Total: R{totalRevenue.toLocaleString('en-ZA')}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Recorded rental income over past 5 months
            </p>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-3">
            <div className="flex items-end justify-between h-40 gap-3 pt-4 border-b border-slate-200 dark:border-slate-700 pb-2">
              {monthlyRevenueStats.map((stat, idx) => {
                const heightPercent = (stat.amount / 12000) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition">
                      {stat.label}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[42px] bg-emerald-600 hover:bg-emerald-500 rounded-t-md transition-all duration-300 relative"
                    />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {stat.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Low: R5,000 (Sep)</span>
              <button
                onClick={() => onNavigate('reports')}
                className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                View 12-Month Performance Reports <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Real-Time Recent Activities Feed */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
          <OwnerActivityFeed onNavigate={onNavigate} maxItems={8} showFilters={true} />
        </div>
      </div>
    </div>
  );
};
