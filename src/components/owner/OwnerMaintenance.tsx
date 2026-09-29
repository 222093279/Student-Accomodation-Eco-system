import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MaintenanceRequest,
  MaintenanceCategory,
  MaintenancePriority,
  MaintenanceStatus,
} from '../../types';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  User,
  MapPin,
  ChevronDown,
  ChevronRight,
  Plus,
  Send,
  Sparkles,
  Phone,
  Mail,
  Edit,
  Trash2,
  X,
  Flame,
  Zap,
  Droplet,
  Key,
  Tv,
  Archive,
  HelpCircle,
  FileSpreadsheet,
  Layers,
  LayoutGrid,
  List,
  Eye,
  Camera,
  Check,
  Building2,
  DollarSign,
  History,
  ShieldCheck,
  UserCheck,
  Wifi,
} from 'lucide-react';

const PRESET_TECHNICIANS = [
  'David Ndlovu (Certified Electrician - +27 71 884 1920)',
  'Sipho Khumalo (FastPlumb Services - +27 82 443 9081)',
  'Caretaker Themba (In-house Residence Caretaker)',
  'Cape Locksmiths & Security (+27 83 221 4402)',
  'Bloemfontein Appliance Care (+27 51 405 9182)',
  'EazyClean & Pest Management (+27 82 990 1234)',
];

const CATEGORIES: MaintenanceCategory[] = [
  'Plumbing',
  'Electrical',
  'Keys & Locks',
  'Appliances',
  'Carpentry & Furniture',
  'WiFi & Internet',
  'Cleaning & Pest',
  'Other',
];

export const OwnerMaintenance: React.FC = () => {
  const {
    maintenanceRequests,
    students,
    rooms,
    updateMaintenanceStatus,
    submitMaintenanceRequest,
    deleteMaintenanceRequest,
    showToast,
  } = useApp();

  // Filters & View State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | MaintenanceStatus>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | MaintenancePriority>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | MaintenanceCategory>('All');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  // Selected Ticket for Modal / Drawer
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceRequest | null>(null);

  // Status Update Form State (inside Modal)
  const [modalStatus, setModalStatus] = useState<MaintenanceStatus>('Reported');
  const [modalTechnician, setModalTechnician] = useState('');
  const [modalCost, setModalCost] = useState<string>('');
  const [modalScheduledDate, setModalScheduledDate] = useState('');
  const [modalNote, setModalNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // New Ticket Modal State (Owner Log)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newStudentId, setNewStudentId] = useState(students[0]?.id || '');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<MaintenanceCategory>('Plumbing');
  const [newPriority, setNewPriority] = useState<MaintenancePriority>('Medium');
  const [newLocation, setNewLocation] = useState('Room Interior');
  const [newDescription, setNewDescription] = useState('');
  const [newAccessTime, setNewAccessTime] = useState('Morning (08:00 - 12:00)');

  // Open modal handler
  const handleOpenTicket = (ticket: MaintenanceRequest) => {
    setSelectedTicket(ticket);
    setModalStatus(ticket.status);
    setModalTechnician(ticket.assignedTechnician || '');
    setModalCost(ticket.costEstimate ? String(ticket.costEstimate) : '');
    setModalScheduledDate(ticket.scheduledDate || '');
    setModalNote(ticket.ownerNotes || '');
  };

  // Submit Status Update
  const handleSaveStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setIsUpdating(true);
    setTimeout(() => {
      const costNumber = modalCost ? parseFloat(modalCost) : undefined;
      updateMaintenanceStatus(
        selectedTicket.id,
        modalStatus,
        modalNote.trim() || undefined,
        modalTechnician.trim() || undefined,
        costNumber,
        modalScheduledDate.trim() || undefined
      );

      setIsUpdating(false);
      // Update local state copy
      setSelectedTicket((prev) =>
        prev
          ? {
              ...prev,
              status: modalStatus,
              ownerNotes: modalNote.trim() || prev.ownerNotes,
              assignedTechnician: modalTechnician.trim() || prev.assignedTechnician,
              costEstimate: costNumber !== undefined ? costNumber : prev.costEstimate,
              scheduledDate: modalScheduledDate.trim() || prev.scheduledDate,
            }
          : null
      );
    }, 350);
  };

  // Create New Ticket by Owner
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const student = students.find((s) => s.id === newStudentId);
    submitMaintenanceRequest({
      studentId: newStudentId,
      roomId: student?.assignedRoomId,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      areaLocation: newLocation,
      description: newDescription.trim() || 'Ticket logged by accommodation management.',
      preferredAccessTime: newAccessTime,
    });

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Ticket ID', 'Student', 'Room', 'Category', 'Priority', 'Title', 'Status', 'Technician', 'Cost (ZAR)', 'Created At'];
    const rows = maintenanceRequests.map((r) => [
      r.id,
      r.studentName,
      r.roomNumber,
      r.category,
      r.priority,
      `"${r.title.replace(/"/g, '""')}"`,
      r.status,
      r.assignedTechnician || 'Unassigned',
      r.costEstimate || 0,
      r.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maintenance-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Maintenance export generated successfully.', 'success');
  };

  // Metrics calculations
  const totalTickets = maintenanceRequests.length;
  const reportedTickets = maintenanceRequests.filter((r) => r.status === 'Reported').length;
  const scheduledTickets = maintenanceRequests.filter((r) => r.status === 'Scheduled').length;
  const inProgressTickets = maintenanceRequests.filter((r) => r.status === 'In Progress').length;
  const resolvedTickets = maintenanceRequests.filter((r) => r.status === 'Resolved').length;
  const emergencyTickets = maintenanceRequests.filter(
    (r) => r.priority === 'Emergency' && r.status !== 'Resolved' && r.status !== 'Cancelled'
  ).length;

  const totalCost = maintenanceRequests.reduce((sum, r) => sum + (r.costEstimate || 0), 0);

  // Filtered List
  const filteredRequests = maintenanceRequests.filter((req) => {
    // Search query
    const query = searchQuery.toLowerCase();
    const matchSearch =
      !query ||
      req.id.toLowerCase().includes(query) ||
      req.title.toLowerCase().includes(query) ||
      req.studentName.toLowerCase().includes(query) ||
      req.roomNumber.toLowerCase().includes(query) ||
      req.block.toLowerCase().includes(query) ||
      (req.assignedTechnician && req.assignedTechnician.toLowerCase().includes(query));

    // Status
    const matchStatus = statusFilter === 'All' || req.status === statusFilter;

    // Priority
    const matchPriority = priorityFilter === 'All' || req.priority === priorityFilter;

    // Category
    const matchCategory = categoryFilter === 'All' || req.category === categoryFilter;

    return matchSearch && matchStatus && matchPriority && matchCategory;
  });

  const getPriorityBadge = (p: MaintenancePriority) => {
    switch (p) {
      case 'Emergency':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <Flame className="w-3 h-3 text-rose-600 animate-pulse" />
            Emergency
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Low
          </span>
        );
    }
  };

  const getStatusBadge = (status: MaintenanceStatus) => {
    switch (status) {
      case 'Reported':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
            Reported
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
            <Calendar className="w-3 h-3 text-indigo-600" />
            Scheduled
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
            In Progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Resolved
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
            Cancelled
          </span>
        );
    }
  };

  const getCategoryIcon = (cat: MaintenanceCategory) => {
    switch (cat) {
      case 'Plumbing':
        return <Droplet className="w-3.5 h-3.5 text-blue-500" />;
      case 'Electrical':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'Keys & Locks':
        return <Key className="w-3.5 h-3.5 text-rose-500" />;
      case 'Appliances':
        return <Tv className="w-3.5 h-3.5 text-purple-500" />;
      case 'Carpentry & Furniture':
        return <Archive className="w-3.5 h-3.5 text-emerald-500" />;
      case 'WiFi & Internet':
        return <Wifi className="w-3.5 h-3.5 text-cyan-500" />;
      default:
        return <Wrench className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Maintenance & Task Tracking
            </h1>
            {emergencyTickets > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white animate-pulse">
                <Flame className="w-3 h-3" />
                {emergencyTickets} Emergency
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor resident reported tickets, assign contractors, record repair costs, and broadcast status updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-medium transition shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Log New Ticket
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        {/* Total Tickets */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Tickets
            </span>
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
            {totalTickets}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">All residential tasks</p>
        </div>

        {/* Needs Action / Reported */}
        <div
          onClick={() => setStatusFilter('Reported')}
          className={`bg-white dark:bg-slate-800/90 rounded-xl p-3.5 border shadow-xs cursor-pointer transition ${
            statusFilter === 'Reported'
              ? 'border-amber-500 ring-2 ring-amber-500/20'
              : 'border-slate-200 dark:border-slate-700 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Reported / New
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1.5">
            {reportedTickets}
          </div>
          <p className="text-[10px] text-amber-600/80 mt-0.5">Needs contractor dispatch</p>
        </div>

        {/* Scheduled & In Progress */}
        <div
          onClick={() => setStatusFilter('In Progress')}
          className={`bg-white dark:bg-slate-800/90 rounded-xl p-3.5 border shadow-xs cursor-pointer transition ${
            statusFilter === 'In Progress'
              ? 'border-blue-500 ring-2 ring-blue-500/20'
              : 'border-slate-200 dark:border-slate-700 hover:border-blue-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Active / Scheduled
            </span>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <Wrench className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1.5">
            {scheduledTickets + inProgressTickets}
          </div>
          <p className="text-[10px] text-blue-600/80 mt-0.5">
            {inProgressTickets} on site, {scheduledTickets} booked
          </p>
        </div>

        {/* Resolved */}
        <div
          onClick={() => setStatusFilter('Resolved')}
          className={`bg-white dark:bg-slate-800/90 rounded-xl p-3.5 border shadow-xs cursor-pointer transition ${
            statusFilter === 'Resolved'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Resolved
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1.5">
            {resolvedTickets}
          </div>
          <p className="text-[10px] text-emerald-600/80 mt-0.5">Completed successfully</p>
        </div>

        {/* Total Cost Spend */}
        <div className="bg-white dark:bg-slate-800/90 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Maintenance Spend
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
            R{totalCost.toLocaleString('en-ZA')}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Estimated repairs cost</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket #, student name, room 01, contractor, or issue title..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Toggle & Clear Filters */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-medium transition ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-md text-xs font-medium transition ${
                  viewMode === 'kanban'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
                title="Kanban Board View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {(statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('All');
                  setPriorityFilter('All');
                  setCategoryFilter('All');
                  setSearchQuery('');
                }}
                className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Status:
            </span>
            {(['All', 'Reported', 'Scheduled', 'In Progress', 'Resolved', 'Cancelled'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition shrink-0 ${
                  statusFilter === s
                    ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          {/* Priority Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Priority:
            </span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Priorities</option>
              <option value="Emergency">Emergency</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Category:
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* VIEW: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket & Priority</th>
                  <th className="py-3 px-4">Resident & Room</th>
                  <th className="py-3 px-4">Issue Summary</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Contractor</th>
                  <th className="py-3 px-4">Cost (ZAR)</th>
                  <th className="py-3 px-4">Reported</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-2">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">
                        No maintenance requests match your filters
                      </div>
                      <div className="text-[11px] mt-0.5">Try resetting search keywords or filters.</div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr
                      key={req.id}
                      onClick={() => handleOpenTicket(req)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 cursor-pointer transition group"
                    >
                      {/* Ticket & Priority */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-800 dark:text-white">
                          #{req.id}
                        </div>
                        <div className="mt-1">{getPriorityBadge(req.priority)}</div>
                      </td>

                      {/* Resident & Room */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {req.studentName}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {req.roomNumber}
                          </span>
                          <span>({req.block})</span>
                        </div>
                      </td>

                      {/* Issue Summary */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">
                          {req.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {req.areaLocation && <span className="font-medium text-slate-700 dark:text-slate-300">{req.areaLocation} • </span>}
                          {req.description}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {getCategoryIcon(req.category)}
                          <span>{req.category}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(req.status)}
                      </td>

                      {/* Contractor */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {req.assignedTechnician ? (
                          <div className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[160px]">
                            {req.assignedTechnician.split('(')[0]}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                        {req.scheduledDate && (
                          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                            {req.scheduledDate}
                          </div>
                        )}
                      </td>

                      {/* Cost */}
                      <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-800 dark:text-slate-200">
                        {req.costEstimate ? `R${req.costEstimate.toLocaleString('en-ZA')}` : '—'}
                      </td>

                      {/* Reported */}
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        {req.createdAt.split(',')[0]}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenTicket(req)}
                            className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-800 font-medium transition"
                            title="Manage Ticket & Update Status"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove maintenance ticket #${req.id}?`)) {
                                deleteMaintenanceRequest(req.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                            title="Delete Ticket"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-3 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {filteredRequests.length} of {maintenanceRequests.length} maintenance tasks
            </span>
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              Live synchronized with student resident app
            </span>
          </div>
        </div>
      )}

      {/* VIEW: KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {(['Reported', 'Scheduled', 'In Progress', 'Resolved'] as MaintenanceStatus[]).map((columnStatus) => {
            const columnItems = filteredRequests.filter((r) => r.status === columnStatus);

            let headerBg = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
            if (columnStatus === 'Reported') headerBg = 'bg-amber-100/90 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 border-amber-300';
            else if (columnStatus === 'Scheduled') headerBg = 'bg-indigo-100/90 text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-200 border-indigo-300';
            else if (columnStatus === 'In Progress') headerBg = 'bg-blue-100/90 text-blue-900 dark:bg-blue-950/70 dark:text-blue-200 border-blue-300';
            else if (columnStatus === 'Resolved') headerBg = 'bg-emerald-100/90 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200 border-emerald-300';

            return (
              <div
                key={columnStatus}
                className="bg-slate-100/70 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200/80 dark:border-slate-800 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className={`p-2.5 rounded-lg border font-bold text-xs flex items-center justify-between mb-3 ${headerBg}`}>
                  <span>{columnStatus}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/70 text-[11px] font-extrabold">
                    {columnItems.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {columnItems.length === 0 ? (
                    <div className="h-28 flex flex-col items-center justify-center text-slate-400 text-xs border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                      <span>No tasks in {columnStatus}</span>
                    </div>
                  ) : (
                    columnItems.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => handleOpenTicket(ticket)}
                        className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-500 cursor-pointer transition space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-slate-500">
                            #{ticket.id}
                          </span>
                          {getPriorityBadge(ticket.priority)}
                        </div>

                        <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">
                          {ticket.title}
                        </h4>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-750">
                          <span className="font-medium text-slate-800 dark:text-slate-300">
                            {ticket.roomNumber} ({ticket.studentName.split(' ')[0]})
                          </span>
                          {ticket.costEstimate ? (
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                              R{ticket.costEstimate}
                            </span>
                          ) : null}
                        </div>

                        {ticket.assignedTechnician && (
                          <div className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 p-1.5 rounded truncate">
                            🔧 {ticket.assignedTechnician.split('(')[0]}
                          </div>
                        )}

                        {/* Quick Kanban Action Dropdown */}
                        <div
                          className="flex items-center justify-between pt-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[10px] text-slate-400">Move:</span>
                          <div className="flex items-center gap-1">
                            {columnStatus !== 'Scheduled' && (
                              <button
                                onClick={() => updateMaintenanceStatus(ticket.id, 'Scheduled')}
                                className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 text-[9px] font-semibold hover:bg-indigo-100"
                              >
                                Sched
                              </button>
                            )}
                            {columnStatus !== 'In Progress' && (
                              <button
                                onClick={() => updateMaintenanceStatus(ticket.id, 'In Progress')}
                                className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 text-[9px] font-semibold hover:bg-blue-100"
                              >
                                Progress
                              </button>
                            )}
                            {columnStatus !== 'Resolved' && (
                              <button
                                onClick={() => updateMaintenanceStatus(ticket.id, 'Resolved')}
                                className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 text-[9px] font-semibold hover:bg-emerald-100"
                              >
                                Resolve
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TASK MANAGEMENT MODAL & STATUS UPDATE WORKFLOW */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/60 dark:bg-slate-850 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-600 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                    #{selectedTicket.id}
                  </span>
                  {getPriorityBadge(selectedTicket.priority)}
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedTicket.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* Resident & Room Details Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Resident Student
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {selectedTicket.studentName}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Student No: <span className="font-mono font-medium">{selectedTicket.studentNumber}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    {selectedTicket.studentPhone && (
                      <a
                        href={`tel:${selectedTicket.studentPhone}`}
                        className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        {selectedTicket.studentPhone}
                      </a>
                    )}
                    {selectedTicket.studentEmail && (
                      <a
                        href={`mailto:${selectedTicket.studentEmail}`}
                        className="inline-flex items-center gap-1 text-slate-600 hover:underline"
                      >
                        <Mail className="w-3 h-3" />
                        Email
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-1 sm:border-l sm:border-slate-200 dark:sm:border-slate-700 sm:pl-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Location & Access
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {selectedTicket.roomNumber} • {selectedTicket.block}
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Area: <span className="font-medium text-slate-800 dark:text-slate-200">{selectedTicket.areaLocation}</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-400">
                    Access Window: <span className="font-medium text-slate-800 dark:text-slate-200">{selectedTicket.preferredAccessTime || 'Anytime'}</span>
                  </div>
                </div>
              </div>

              {/* Description & Photo */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Reported Issue Description:
                </span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedTicket.description}
                </p>

                {selectedTicket.photoAttachment && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">
                      Attached Resident Photo:
                    </span>
                    <img
                      src={selectedTicket.photoAttachment}
                      alt="Issue"
                      className="w-full max-h-48 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                )}
              </div>

              {/* STATUS UPDATE & CONTRACTOR DISPATCH FORM */}
              <form onSubmit={handleSaveStatusUpdate} className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-800 dark:text-emerald-400">
                  <Wrench className="w-4 h-4" />
                  <h4>Manage Task & Dispatch Status</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Status Transition Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Task Status *
                    </label>
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value as MaintenanceStatus)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    >
                      <option value="Reported">Reported (Waiting for Action)</option>
                      <option value="Scheduled">Scheduled (Contractor Booked)</option>
                      <option value="In Progress">In Progress (Repair Underway)</option>
                      <option value="Resolved">Resolved (Complete & Verified)</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Estimated Cost */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Repair Cost Estimate (ZAR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                        R
                      </span>
                      <input
                        type="number"
                        step="10"
                        value={modalCost}
                        onChange={(e) => setModalCost(e.target.value)}
                        placeholder="e.g. 450"
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      />
                    </div>
                  </div>
                </div>

                {/* Assigned Contractor */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Assigned Contractor / Technician
                    </label>
                    <span className="text-[10px] text-slate-400">Pick preset or type custom</span>
                  </div>
                  <input
                    type="text"
                    value={modalTechnician}
                    onChange={(e) => setModalTechnician(e.target.value)}
                    placeholder="e.g. David Ndlovu (Electrician) or In-house Caretaker"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                  {/* Preset technician quick buttons */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {PRESET_TECHNICIANS.slice(0, 3).map((tech, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setModalTechnician(tech)}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                      >
                        + {tech.split('(')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scheduled Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Scheduled Date & Arrival Time
                  </label>
                  <input
                    type="text"
                    value={modalScheduledDate}
                    onChange={(e) => setModalScheduledDate(e.target.value)}
                    placeholder="e.g. Wednesday 25 Feb 2026, 10:00 AM"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                {/* Resolution / Landlord Notes Broadcast */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Owner Response / Resolution Note (Visible to Student)
                    </label>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      Syncs to student mobile app
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={modalNote}
                    onChange={(e) => setModalNote(e.target.value)}
                    placeholder="e.g. Plumber dispatched with replacement valve. Please ensure bathroom floor is clear."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                {/* Save Button */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                  >
                    {isUpdating ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating Status...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save & Broadcast Update
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Status History Timeline */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  Full Task Lifecycle & Audit History
                </span>
                <div className="space-y-2 border-l-2 border-emerald-500/40 ml-2 pl-3 py-1">
                  {selectedTicket.statusHistory.map((item, idx) => (
                    <div key={idx} className="relative text-xs">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900" />
                      <div className="font-bold text-slate-800 dark:text-white flex items-center justify-between">
                        <span>{item.status}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {item.timestamp}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Updated by: {item.updatedBy}
                      </div>
                      {item.note && (
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 italic mt-0.5">
                          "{item.note}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW TICKET MODAL (Owner/Caretaker Log) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Log Property Maintenance Ticket
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 space-y-3.5 text-xs">
              {/* Select Student / Room */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Student & Room *
                </label>
                <select
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                >
                  {students.map((s) => {
                    const r = rooms.find((rm) => rm.id === s.assignedRoomId);
                    return (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({r?.roomNumber || 'Room 01'} - {r?.block || 'Block A'})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Issue Summary *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Geyser thermostat failure in Block A"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority *
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Specific Location
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Bathroom geyser pipe, main study desk"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Notes
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the issue symptoms, parts required, or findings during inspection..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
