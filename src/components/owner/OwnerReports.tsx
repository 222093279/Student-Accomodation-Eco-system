import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  trailing12MonthsPerformanceData,
  paymentChannelsBreakdown,
  roomsHistoricalPerformance,
  MonthlyPerformanceRecord,
} from '../../data/reportsData';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Users,
  Building,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CreditCard,
  Percent,
  Clock,
  Send,
  Printer,
  ChevronDown,
  Layers,
  Sparkles,
  Info,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line,
  ComposedChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

export const OwnerReports: React.FC = () => {
  const { rooms, students, payments, sendWarningNotice, showToast } = useApp();

  // Filter States
  const [selectedBlock, setSelectedBlock] = useState<'All' | 'Block A' | 'Block B'>('All');
  const [selectedViewTab, setSelectedViewTab] = useState<'all' | 'occupancy' | 'revenue' | 'collection'>('all');
  const [occupancyMetricType, setOccupancyMetricType] = useState<'rate' | 'beds'>('rate');
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'monthKey' | 'collectedRevenue' | 'occupancyRate' | 'collectionRate'>('monthKey');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtered 12-month data based on Block selection
  const filtered12MonthData = useMemo(() => {
    return trailing12MonthsPerformanceData.map((month) => {
      if (selectedBlock === 'Block A') {
        const blockRate = month.blockAOccupancyRate;
        const blockCap = 2; // Room 01, Room 03 (2 beds)
        const blockOccupied = Math.round((blockRate / 100) * blockCap);
        const billed = month.singleSuitesOccupied >= 2 ? 5300 : 2500;
        const collected = Math.round(billed * (month.collectionRate / 100));
        return {
          ...month,
          occupancyRate: blockRate,
          totalBedsCapacity: blockCap,
          occupiedBeds: blockOccupied,
          vacantBeds: blockCap - blockOccupied,
          targetRevenue: 5300,
          billedRevenue: billed,
          collectedRevenue: collected,
          pendingRevenue: billed - collected,
        };
      }
      if (selectedBlock === 'Block B') {
        const blockRate = month.blockBOccupancyRate;
        const blockCap = 3; // Room 02 (2 beds), Room 04 (1 bed)
        const blockOccupied = Math.round((blockRate / 100) * blockCap);
        const billed = Math.round(month.billedRevenue * 0.6);
        const collected = Math.round(billed * (month.collectionRate / 100));
        return {
          ...month,
          occupancyRate: blockRate,
          totalBedsCapacity: blockCap,
          occupiedBeds: blockOccupied,
          vacantBeds: blockCap - blockOccupied,
          targetRevenue: 6500,
          billedRevenue: billed,
          collectedRevenue: collected,
          pendingRevenue: billed - collected,
        };
      }
      return month;
    });
  }, [selectedBlock]);

  // Aggregate Metrics over 12 Months
  const summaryMetrics = useMemo(() => {
    const totalCollected = filtered12MonthData.reduce((sum, m) => sum + m.collectedRevenue, 0);
    const totalBilled = filtered12MonthData.reduce((sum, m) => sum + m.billedRevenue, 0);
    const totalTarget = filtered12MonthData.reduce((sum, m) => sum + m.targetRevenue, 0);
    const totalMaintenance = filtered12MonthData.reduce((sum, m) => sum + m.maintenanceExpense, 0);
    const netIncome = totalCollected - totalMaintenance;

    const avgOccupancy = Math.round(
      filtered12MonthData.reduce((sum, m) => sum + m.occupancyRate, 0) / filtered12MonthData.length
    );
    const avgCollectionRate = Number(
      (
        filtered12MonthData.reduce((sum, m) => sum + m.collectionRate, 0) / filtered12MonthData.length
      ).toFixed(1)
    );

    const onTimeTotal = filtered12MonthData.reduce((sum, m) => sum + m.onTimePaymentsCount, 0);
    const graceTotal = filtered12MonthData.reduce((sum, m) => sum + m.gracePeriodPaymentsCount, 0);
    const lateTotal = filtered12MonthData.reduce((sum, m) => sum + m.latePaymentsCount, 0);
    const invoicesTotal = filtered12MonthData.reduce((sum, m) => sum + m.totalInvoicesIssued, 0);

    const onTimePercent = Math.round((onTimeTotal / invoicesTotal) * 100);
    const gracePercent = Math.round((graceTotal / invoicesTotal) * 100);
    const latePercent = Math.round((lateTotal / invoicesTotal) * 100);

    return {
      totalCollected,
      totalBilled,
      totalTarget,
      totalMaintenance,
      netIncome,
      avgOccupancy,
      avgCollectionRate,
      onTimePercent,
      gracePercent,
      latePercent,
      invoicesTotal,
    };
  }, [filtered12MonthData]);

  // Live pending payments for immediate enforcement
  const pendingPayments = payments.filter((p) => p.status === 'Pending');
  const outstandingTotal = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  // Sorting & filtering for table
  const sortedTableData = useMemo(() => {
    return [...filtered12MonthData]
      .filter((item) => {
        if (!tableSearchQuery) return true;
        const q = tableSearchQuery.toLowerCase();
        return (
          item.monthLabel.toLowerCase().includes(q) ||
          item.quarter.toLowerCase().includes(q) ||
          (item.academicMilestone && item.academicMilestone.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? valA.localeCompare(valB as string)
            : (valB as string).localeCompare(valA);
        }
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [filtered12MonthData, tableSearchQuery, sortField, sortOrder]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Month',
      'Quarter',
      'Occupancy Rate (%)',
      'Occupied Beds',
      'Total Capacity',
      'Target Revenue (ZAR)',
      'Billed Revenue (ZAR)',
      'Collected Revenue (ZAR)',
      'Pending Revenue (ZAR)',
      'Collection Rate (%)',
      'Academic Milestone',
    ];

    const rows = filtered12MonthData.map((d) => [
      `"${d.monthLabel}"`,
      `"${d.quarter}"`,
      d.occupancyRate,
      d.occupiedBeds,
      d.totalBedsCapacity,
      d.targetRevenue,
      d.billedRevenue,
      d.collectedRevenue,
      d.pendingRevenue,
      d.collectionRate,
      `"${d.academicMilestone || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ResiManage_12Month_Performance_Report_${selectedBlock.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Performance report downloaded as CSV', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  // Format currency
  const formatZAR = (val: number) => `R${val.toLocaleString('en-ZA')}`;

  // Custom Chart Tooltips
  const CustomOccupancyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: MonthlyPerformanceRecord = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs min-w-[200px]">
          <div className="font-bold text-emerald-400 border-b border-slate-700 pb-1 mb-2 flex items-center justify-between">
            <span>{data.monthLabel}</span>
            <span className="text-[10px] text-slate-300 font-normal">{data.quarter}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Occupancy Rate:</span>
              <span className="font-bold text-white">{data.occupancyRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Beds Occupied:</span>
              <span className="font-semibold text-slate-200">
                {data.occupiedBeds} / {data.totalBedsCapacity} beds
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-800">
              <span className="text-slate-400">Block A / B:</span>
              <span className="text-slate-300">
                {data.blockAOccupancyRate}% / {data.blockBOccupancyRate}%
              </span>
            </div>
            {data.academicMilestone && (
              <div className="pt-1.5 text-[10px] text-emerald-300 italic border-t border-slate-800">
                📍 {data.academicMilestone}
              </div>
            )}
          </div>
        </div>
      );
    };
    return null;
  };

  const CustomRevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: MonthlyPerformanceRecord = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs min-w-[220px]">
          <div className="font-bold text-emerald-400 border-b border-slate-700 pb-1 mb-2 flex items-center justify-between">
            <span>{data.monthLabel}</span>
            <span className="text-[10px] text-slate-300 font-normal">Revenue Audit</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Collected Income:</span>
              <span className="font-bold text-emerald-400">{formatZAR(data.collectedRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Total Invoiced:</span>
              <span className="font-semibold text-slate-200">{formatZAR(data.billedRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Target Potential:</span>
              <span className="text-indigo-300 font-semibold">{formatZAR(data.targetRevenue)}</span>
            </div>
            {data.pendingRevenue > 0 && (
              <div className="flex justify-between items-center text-amber-400">
                <span>Pending / Late:</span>
                <span className="font-bold">+{formatZAR(data.pendingRevenue)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1.5 border-t border-slate-800 text-[11px]">
              <span className="text-slate-400">Collection Efficiency:</span>
              <span className="font-bold text-emerald-300">{data.collectionRate}%</span>
            </div>
          </div>
        </div>
      );
    };
    return null;
  };

  const CustomCollectionTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: MonthlyPerformanceRecord = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs min-w-[210px]">
          <div className="font-bold text-emerald-400 border-b border-slate-700 pb-1 mb-2 flex items-center justify-between">
            <span>{data.monthLabel}</span>
            <span className="text-[10px] text-slate-300 font-normal">Collection Speed</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-emerald-400 font-medium">On-Time (Due 1st):</span>
              <span className="font-bold text-white">{data.onTimePaymentsCount} invoices</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-400 font-medium">Grace Period (2-7th):</span>
              <span className="font-semibold text-white">{data.gracePeriodPaymentsCount} invoices</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-400 font-medium">Overdue / Warning:</span>
              <span className="font-semibold text-white">{data.latePaymentsCount} invoices</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-slate-800">
              <span className="text-slate-400">Avg Settlement Speed:</span>
              <span className="font-bold text-slate-200">{data.averagePaymentDaysToClear} days</span>
            </div>
          </div>
        </div>
      );
    };
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Performance Reports
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              <Sparkles className="w-3 h-3" />
              12-Month Trailing View
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Historical analytics visualizing residence occupancy density, monthly rental revenue trends, and payment collection success (March 2025 – February 2026).
          </p>
        </div>

        {/* Global Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Residence Filter */}
          <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedBlock('All')}
              className={`px-2.5 py-1.5 rounded-md transition ${
                selectedBlock === 'All'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Blocks
            </button>
            <button
              onClick={() => setSelectedBlock('Block A')}
              className={`px-2.5 py-1.5 rounded-md transition ${
                selectedBlock === 'Block A'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Block A
            </button>
            <button
              onClick={() => setSelectedBlock('Block B')}
              className={`px-2.5 py-1.5 rounded-md transition ${
                selectedBlock === 'Block B'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Block B
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      {/* Trailing 12-Month Executive KPI Cards (4 metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 12-Month Avg Occupancy */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Avg Occupancy (12M)
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {summaryMetrics.avgOccupancy}%
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3 h-3" />
              +5.4% YoY
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Peak: 100% (Semester terms)</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Target &gt;90%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${summaryMetrics.avgOccupancy}%` }}
            />
          </div>
        </div>

        {/* Card 2: Total 12-Month Realized Revenue */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Revenue (12M)
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatZAR(summaryMetrics.totalCollected)}
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3 h-3" />
              +8.1%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Invoiced: {formatZAR(summaryMetrics.totalBilled)}</span>
            <span className="font-semibold text-blue-700 dark:text-blue-400">
              Avg {formatZAR(Math.round(summaryMetrics.totalCollected / 12))}/mo
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((summaryMetrics.totalCollected / summaryMetrics.totalBilled) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Card 3: Collection Success Rate */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Collection Success
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {summaryMetrics.avgCollectionRate}%
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              12M Average
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>On-Time: {summaryMetrics.onTimePercent}%</span>
            <span className="font-medium text-emerald-700 dark:text-emerald-300">
              0 Defaults / Bad Debt
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${summaryMetrics.avgCollectionRate}%` }}
            />
          </div>
        </div>

        {/* Card 4: Net Operating Income (NOI) */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Net Operating Income
            </span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {formatZAR(summaryMetrics.netIncome)}
            </div>
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
              91.6% margin
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Maintenance: {formatZAR(summaryMetrics.totalMaintenance)}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Capitec EFT</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `91.6%` }}
            />
          </div>
        </div>
      </div>

      {/* Enforcement Alert Banner if Pending Payments Exist */}
      {pendingPayments.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-950 dark:text-amber-100 text-sm">
                Active Arrears & Payment Enforcement ({pendingPayments.length} Invoices)
              </h4>
              <p className="text-amber-800 dark:text-amber-300 text-xs mt-0.5">
                Outstanding balance of <span className="font-bold">{formatZAR(outstandingTotal)}</span> detected in the active billing ledger. Dispatched automated notices achieve an average 96.1% resolution rate.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              pendingPayments.forEach((p) => sendWarningNotice(p.id));
              showToast(`Enforcement notices dispatched for ${pendingPayments.length} invoices`, 'info');
            }}
            className="px-3.5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold text-xs shadow-xs transition shrink-0 flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Dispatch Automated Reminders
          </button>
        </div>
      )}

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setSelectedViewTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            selectedViewTab === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All 3 Visualizations
        </button>
        <button
          onClick={() => setSelectedViewTab('occupancy')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            selectedViewTab === 'occupancy'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Occupancy Rates
        </button>
        <button
          onClick={() => setSelectedViewTab('revenue')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            selectedViewTab === 'revenue'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Revenue Trends
        </button>
        <button
          onClick={() => setSelectedViewTab('collection')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            selectedViewTab === 'collection'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Collection Success
        </button>
      </div>

      {/* ======================================================== */}
      {/* CHART 1: Occupancy Rates Over Last 12 Months (Recharts) */}
      {/* ======================================================== */}
      {(selectedViewTab === 'all' || selectedViewTab === 'occupancy') && (
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Residence Occupancy Rates (Last 12 Months)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Visualizing capacity density, semester intake peaks (Feb/Aug), and vacation troughs across {selectedBlock === 'All' ? 'all residence blocks' : selectedBlock}.
              </p>
            </div>

            {/* Toggle metric display */}
            <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-750 p-0.5 text-xs font-medium">
              <button
                onClick={() => setOccupancyMetricType('rate')}
                className={`px-2.5 py-1 rounded-md transition ${
                  occupancyMetricType === 'rate'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 dark:text-slate-300'
                }`}
              >
                Occupancy %
              </button>
              <button
                onClick={() => setOccupancyMetricType('beds')}
                className={`px-2.5 py-1 rounded-md transition ${
                  occupancyMetricType === 'beds'
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 dark:text-slate-300'
                }`}
              >
                Beds Count
              </button>
            </div>
          </div>

          {/* Recharts Area / Bar Chart Container */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {occupancyMetricType === 'rate' ? (
                <AreaChart
                  data={filtered12MonthData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
                  <XAxis
                    dataKey="shortMonth"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomOccupancyTooltip />} />
                  <ReferenceLine
                    y={90}
                    stroke="#059669"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Target Benchmark (90%)',
                      position: 'insideTopRight',
                      fill: '#059669',
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="occupancyRate"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#occupancyGradient)"
                    name="Occupancy Rate"
                    activeDot={{ r: 6, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={filtered12MonthData}
                  margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
                  <XAxis
                    dataKey="shortMonth"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    domain={[0, 6]}
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v} beds`}
                  />
                  <Tooltip content={<CustomOccupancyTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                  />
                  <Bar
                    dataKey="occupiedBeds"
                    name="Occupied Beds"
                    fill="#059669"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="vacantBeds"
                    name="Vacant Beds"
                    fill="#cbd5e1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Academic Term Annotations & Context */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-750 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-750/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Semester 1 Intake</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">100% Full Capacity</span>
              <span className="text-[10px] text-emerald-600 block">Mar – May 2025</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-750/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Winter Vacation</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">80% Occupancy</span>
              <span className="text-[10px] text-slate-500 block">Jun – Jul 2025</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-750/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Semester 2 Intake</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">100% Full Capacity</span>
              <span className="text-[10px] text-emerald-600 block">Aug – Oct 2025</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-750/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">2026 Academic Cycle</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">80% – 100% (Active)</span>
              <span className="text-[10px] text-emerald-600 block">Jan – Feb 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHART 2: Monthly Rental Revenue Trends (Recharts)       */}
      {/* ======================================================== */}
      {(selectedViewTab === 'all' || selectedViewTab === 'revenue') && (
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Monthly Rental Revenue Trends (Last 12 Months)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Comparing collected lease payments against billed rent and target revenue potential over the 12-month trailing cycle.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-xs bg-emerald-600" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Collected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-xs bg-amber-500" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Pending / Delayed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-indigo-500" />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Target Potential</span>
              </div>
            </div>
          </div>

          {/* Recharts Composed Chart */}
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={filtered12MonthData}
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
                <XAxis
                  dataKey="shortMonth"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomRevenueTooltip />} />
                <Bar
                  dataKey="collectedRevenue"
                  name="Collected Revenue"
                  fill="#059669"
                  stackId="revenue"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="pendingRevenue"
                  name="Pending / Delayed"
                  fill="#f59e0b"
                  stackId="revenue"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Line
                  type="monotone"
                  dataKey="targetRevenue"
                  name="Target Potential"
                  stroke="#6366f1"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#6366f1' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Statistics Highlights */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-750 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Total Billed:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {formatZAR(summaryMetrics.totalBilled)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Total Realized:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatZAR(summaryMetrics.totalCollected)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Avg Monthly Run Rate:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {formatZAR(Math.round(summaryMetrics.totalCollected / 12))} / month
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Peak Month:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Aug 2025 (R29,500)</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CHART 3: Payment Collection Success & Distribution       */}
      {/* ======================================================== */}
      {(selectedViewTab === 'all' || selectedViewTab === 'collection') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 12-Month Collection Success Breakdown (2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Payment Collection Success & Timing (Last 12 Months)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Categorized invoice settlement speed: On-Time (1st of month), Grace Period (2nd–7th), and Overdue recoveries.
                </p>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                96.1% 12M Avg
              </span>
            </div>

            {/* Recharts Stacked Invoices Chart */}
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filtered12MonthData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} vertical={false} />
                  <XAxis
                    dataKey="shortMonth"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    domain={[0, 6]}
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip content={<CustomCollectionTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                  />
                  <Bar
                    dataKey="onTimePaymentsCount"
                    name="On-Time (Due 1st)"
                    fill="#059669"
                    stackId="collections"
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="gracePeriodPaymentsCount"
                    name="Grace Period (2nd-7th)"
                    fill="#3b82f6"
                    stackId="collections"
                    maxBarSize={36}
                  />
                  <Bar
                    dataKey="latePaymentsCount"
                    name="Overdue / Reminded"
                    fill="#f59e0b"
                    stackId="collections"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-750 grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/40">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">On-Time Success</span>
                <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                  {summaryMetrics.onTimePercent}%
                </span>
                <span className="text-[10px] text-slate-500 block">Due 1st of month</span>
              </div>
              <div className="p-2 rounded-lg bg-blue-50/60 dark:bg-blue-950/40">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Grace Resolution</span>
                <span className="text-base font-extrabold text-blue-700 dark:text-blue-400">
                  {summaryMetrics.gracePercent}%
                </span>
                <span className="text-[10px] text-slate-500 block">Settled by 7th</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/40">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Late Recoveries</span>
                <span className="text-base font-extrabold text-amber-700 dark:text-amber-400">
                  {summaryMetrics.latePercent}%
                </span>
                <span className="text-[10px] text-slate-500 block">100% recovered</span>
              </div>
            </div>
          </div>

          {/* Payment Methods Breakdown (Donut Chart) */}
          <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Payment Channels
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                12-month settlement channels by student residents.
              </p>

              {/* Recharts Pie / Donut Chart */}
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentChannelsBreakdown}
                      dataKey="totalAmount"
                      nameKey="channel"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {paymentChannelsBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [formatZAR(Number(value)), 'Total Volume']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center text in donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Capitec</span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">60.1%</span>
                </div>
              </div>
            </div>

            {/* Channel List */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-750">
              {paymentChannelsBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 dark:text-slate-300 truncate text-[11px]">
                      {item.channel}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white shrink-0 text-[11px]">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Unit-By-Unit 12-Month Performance Breakdown              */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Residence Units Capacity & 12-Month Yield
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Unit-by-unit accommodation allocation, monthly rate, and trailing 12-month revenue performance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roomsHistoricalPerformance.map((room) => {
            const currentRoomState = rooms.find((r) => r.id === room.roomId);
            const isAvailable = currentRoomState?.status === 'Available';
            return (
              <div
                key={room.roomId}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-850/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {room.roomName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isAvailable
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {currentRoomState?.status || room.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    {room.type}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Monthly Rate:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {formatZAR(room.monthlyRate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">12M Occupancy:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {room.averageOccupancy12M}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">12M Revenue:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatZAR(room.totalRevenue12M)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Collection Rate:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {room.collectionRate12M}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${room.averageOccupancy12M}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* Detailed 12-Month Historical Data Ledger Table           */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-slate-800/90 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                12-Month Performance Audit Ledger
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Monthly breakdown showing occupancy percentage, target vs actual revenue, and collection resolution rates.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search month, quarter..."
              value={tableSearchQuery}
              onChange={(e) => setTableSearchQuery(e.target.value)}
              className="px-3 py-1.5 pl-8 text-xs bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 w-48 sm:w-60"
            />
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th
                  onClick={() => handleSort('monthKey')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <div className="flex items-center gap-1">
                    Month / Period
                    {sortField === 'monthKey' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th className="py-2.5 px-3">Academic Context</th>
                <th
                  onClick={() => handleSort('occupancyRate')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    Occupancy
                    {sortField === 'occupancyRate' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">Target</th>
                <th className="py-2.5 px-3 text-right">Invoiced</th>
                <th
                  onClick={() => handleSort('collectedRevenue')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 text-right"
                >
                  <div className="flex items-center justify-end gap-1">
                    Collected
                    {sortField === 'collectedRevenue' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th className="py-2.5 px-3 text-right">Pending</th>
                <th
                  onClick={() => handleSort('collectionRate')}
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    Collection %
                    {sortField === 'collectionRate' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
              {sortedTableData.map((row) => {
                const isOptimal = row.collectionRate >= 95;
                const isWarning = row.collectionRate < 92;
                return (
                  <tr key={row.monthKey} className="hover:bg-slate-50 dark:hover:bg-slate-750/70 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                      {row.monthLabel}
                      <span className="block text-[10px] font-normal text-slate-400">{row.quarter}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                      <span className="text-[11px]">{row.academicMilestone || 'Standard Academic Period'}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <span
                          className={`font-bold ${
                            row.occupancyRate >= 90
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {row.occupancyRate}%
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({row.occupiedBeds}/{row.totalBedsCapacity})
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500 dark:text-slate-400 font-medium">
                      {formatZAR(row.targetRevenue)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300 font-medium">
                      {formatZAR(row.billedRevenue)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700 dark:text-emerald-400">
                      {formatZAR(row.collectedRevenue)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {row.pendingRevenue > 0 ? (
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          {formatZAR(row.pendingRevenue)}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">R0</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          isOptimal
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isWarning
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {row.collectionRate}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {isOptimal ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            Target Met
                          </>
                        ) : isWarning ? (
                          <>
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            Follow-up
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            Healthy
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Owner Financial Intelligence Callout */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-950 dark:text-emerald-100 text-sm">
              Residence Owner Financial Intelligence & Forecasting
            </h4>
            <div className="mt-1 text-emerald-900 dark:text-emerald-200 space-y-1">
              <p>
                • <strong>Capitec Bank Instant Reconciliation:</strong> 60.1% of residents pay via Capitec EFT, clearing funds with zero interbank delay (average clearance speed: 1.8 days).
              </p>
              <p>
                • <strong>Semester 1 Retention & Revenue Forecast:</strong> 2026 Academic Term bookings are tracking at 100% occupancy for Block A and 83.3% for Block B, projecting a minimum annual gross revenue of R345,000.
              </p>
              <p>
                • <strong>Zero Bad Debt Record:</strong> Across the trailing 12 months, 100% of overdue lease fees were recovered before 30-day default thresholds using automated reminder dispatch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
