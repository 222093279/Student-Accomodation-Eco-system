import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MaintenanceRequest,
  MaintenanceCategory,
  MaintenancePriority,
} from '../../types';
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Camera,
  ChevronRight,
  Plus,
  Send,
  Sparkles,
  Info,
  X,
  UserCheck,
  MapPin,
  Check,
  ShieldAlert,
  Flame,
  Zap,
  Droplet,
  Key,
  Tv,
  Wifi,
  Archive,
  HelpCircle,
  Phone,
  MessageSquare,
  History,
} from 'lucide-react';

interface Props {
  initialTab?: 'list' | 'create';
}

const CATEGORIES: {
  id: MaintenanceCategory;
  label: string;
  sub: string;
  icon: any;
  color: string;
}[] = [
  { id: 'Plumbing', label: 'Plumbing', sub: 'Taps, shower, toilet, geyser', icon: Droplet, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900' },
  { id: 'Electrical', label: 'Electrical', sub: 'Sockets, lights, circuit trip', icon: Zap, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900' },
  { id: 'Keys & Locks', label: 'Keys & Locks', sub: 'Door cylinder, handle, keys', icon: Key, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900' },
  { id: 'Appliances', label: 'Appliances', sub: 'Fridge, stove, microwave', icon: Tv, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900' },
  { id: 'Carpentry & Furniture', label: 'Furniture', sub: 'Desk, bed, wardrobe, door', icon: Archive, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900' },
  { id: 'WiFi & Internet', label: 'WiFi & Network', sub: 'Connection drop, weak signal', icon: Wifi, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-900' },
  { id: 'Cleaning & Pest', label: 'Cleaning & Pest', sub: 'Hygiene, deep clean, pests', icon: Sparkles, color: 'text-teal-500 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-900' },
  { id: 'Other', label: 'Other Repairs', sub: 'General maintenance issue', icon: HelpCircle, color: 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
];

const PRESET_LOCATIONS = [
  'Ensuite Bathroom',
  'Study Desk Area',
  'Bedroom / Sleeping Area',
  'Window & Blinds',
  'Room Entrance Door',
  'Wardrobe / Closet',
  'Common Area / Kitchenette',
];

const PRESET_PHOTOS = [
  {
    label: 'Plumbing / Leak',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Electrical Socket',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Door Lock / Handle',
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&auto=format&fit=crop&q=80',
  },
];

export const MobileMaintenanceView: React.FC<Props> = ({ initialTab = 'list' }) => {
  const {
    currentStudent,
    currentStudentRoom,
    maintenanceRequests,
    submitMaintenanceRequest,
    ownerProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'list' | 'create'>(initialTab);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceRequest | null>(null);

  // Form States
  const [category, setCategory] = useState<MaintenanceCategory>('Plumbing');
  const [title, setTitle] = useState('');
  const [areaLocation, setAreaLocation] = useState(PRESET_LOCATIONS[0]);
  const [priority, setPriority] = useState<MaintenancePriority>('Medium');
  const [description, setDescription] = useState('');
  const [preferredAccessTime, setPreferredAccessTime] = useState<string>('Morning (08:00 - 12:00)');
  const [photoAttachment, setPhotoAttachment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customLocation, setCustomLocation] = useState(false);

  // Student's specific requests
  const studentRequests = maintenanceRequests.filter(
    (r) => r.studentId === currentStudent?.id || r.roomNumber === currentStudentRoom?.roomNumber
  );

  const activeRequests = studentRequests.filter(
    (r) => r.status === 'Reported' || r.status === 'Scheduled' || r.status === 'In Progress'
  );

  const resolvedRequests = studentRequests.filter((r) => r.status === 'Resolved');

  const filteredRequests = studentRequests.filter((r) => {
    if (statusFilter === 'active') {
      return r.status === 'Reported' || r.status === 'Scheduled' || r.status === 'In Progress';
    }
    if (statusFilter === 'resolved') {
      return r.status === 'Resolved';
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitMaintenanceRequest({
        studentId: currentStudent?.id || 'stud-1',
        roomId: currentStudentRoom?.id || 'room-01',
        title: title.trim(),
        category,
        priority,
        areaLocation,
        description: description.trim() || 'Resident reported maintenance request for assigned room.',
        preferredAccessTime,
        photoAttachment: photoAttachment || undefined,
      });

      setIsSubmitting(false);
      // Reset form
      setTitle('');
      setDescription('');
      setPhotoAttachment('');
      setPriority('Medium');
      setActiveTab('list');
      setStatusFilter('active');
    }, 450);
  };

  const getPriorityBadge = (p: MaintenancePriority) => {
    switch (p) {
      case 'Emergency':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            <Flame className="w-3 h-3 text-rose-600 animate-pulse" />
            Emergency
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            High Priority
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

  const getStatusBadge = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'Reported':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3 text-amber-600" />
            Reported
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <Calendar className="w-3 h-3 text-indigo-600" />
            Scheduled
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
            In Progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Resolved
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            Cancelled
          </span>
        );
    }
  };

  const renderStepTracker = (status: MaintenanceRequest['status']) => {
    const steps = ['Reported', 'Scheduled', 'In Progress', 'Resolved'];
    const currentIdx = steps.indexOf(status);

    return (
      <div className="py-2.5 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60 my-2.5">
        <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 mb-1.5">
          <span>Tracker</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Step {Math.max(1, currentIdx + 1)} of 4
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {steps.map((step, idx) => {
            const isCompleted = currentIdx >= idx;
            const isCurrent = currentIdx === idx;
            return (
              <div key={step} className="flex flex-col items-center gap-1">
                <div
                  className={`h-1.5 w-full rounded-full transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 dark:bg-emerald-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
                <span
                  className={`text-[9px] text-center truncate w-full ${
                    isCurrent
                      ? 'font-bold text-emerald-700 dark:text-emerald-400'
                      : isCompleted
                      ? 'font-medium text-slate-700 dark:text-slate-300'
                      : 'text-slate-400'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Banner & Room Context */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
              <Wrench className="w-3.5 h-3.5" />
              Resident Maintenance Hub
            </div>
            <h2 className="text-base font-bold text-white mt-0.5">
              {currentStudentRoom?.roomNumber || 'Assigned Room'} • {currentStudentRoom?.block || 'Block A'}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab(activeTab === 'create' ? 'list' : 'create')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition shadow-xs active:scale-[0.98] ${
              activeTab === 'create'
                ? 'bg-white/20 text-white hover:bg-white/30'
                : 'bg-white text-emerald-950 hover:bg-emerald-50'
            }`}
          >
            {activeTab === 'create' ? (
              <>View My Requests</>
            ) : (
              <>
                <Plus className="w-4 h-4 text-emerald-700" />
                Report Issue
              </>
            )}
          </button>
        </div>

        {/* Quick Stats Chips */}
        <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-emerald-700/60 text-[11px]">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-700/60 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {activeRequests.length} active issue{activeRequests.length !== 1 ? 's' : ''}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-700/60 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            {resolvedRequests.length} resolved
          </span>
        </div>
      </div>

      {/* Sub-Navigation Switcher */}
      <div className="grid grid-cols-2 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('list')}
          className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeTab === 'list'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <span>My Requests</span>
          {activeRequests.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500 text-slate-950 font-bold">
              {activeRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeTab === 'create'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Plus className="w-3.5 h-3.5 text-emerald-600" />
          <span>New Request Form</span>
        </button>
      </div>

      {/* VIEW: SUBMIT ISSUE FORM */}
      {activeTab === 'create' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-start gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Report Room or Residence Issue
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Landlord and caretaker will be notified instantly. SLA: Emergency (2h), Standard (24h).
                </p>
              </div>
            </div>

            {/* 1. Category Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                1. Select Issue Category *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div
                          className={`text-xs font-bold truncate ${
                            isSelected ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {cat.label}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {cat.sub}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Issue Title / Brief */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                2. Issue Summary / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Shower tap constantly dripping hot water"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
              {/* Quick suggestion pills */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {[
                  'Light bulb not working',
                  'Water tap leaking',
                  'Door lock jamming',
                  'Power socket dead',
                  'Drain blocked',
                ].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setTitle(sug)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Location in Room */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  3. Location inside {currentStudentRoom?.roomNumber || 'Room'} *
                </label>
                <button
                  type="button"
                  onClick={() => setCustomLocation(!customLocation)}
                  className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium"
                >
                  {customLocation ? 'Pick preset' : 'Custom location'}
                </button>
              </div>

              {!customLocation ? (
                <div className="grid grid-cols-2 gap-1.5">
                  {PRESET_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setAreaLocation(loc)}
                      className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-medium border transition truncate ${
                        areaLocation === loc
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={areaLocation}
                  onChange={(e) => setAreaLocation(e.target.value)}
                  placeholder="e.g. Under sink, balcony latch, ceiling near fan"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              )}
            </div>

            {/* 4. Urgency / Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                4. Priority Level *
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Low', 'Medium', 'High', 'Emergency'] as MaintenancePriority[]).map((p) => {
                  const isSelected = priority === p;
                  let selectedStyle = 'border-slate-300 text-slate-700';
                  if (isSelected) {
                    if (p === 'Emergency') selectedStyle = 'border-rose-600 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 font-bold ring-1 ring-rose-500';
                    else if (p === 'High') selectedStyle = 'border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 font-bold ring-1 ring-amber-500';
                    else if (p === 'Medium') selectedStyle = 'border-blue-600 bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-200 font-bold ring-1 ring-blue-500';
                    else selectedStyle = 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 font-bold ring-1 ring-emerald-500';
                  } else {
                    selectedStyle = 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40';
                  }
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 px-1 text-center rounded-xl text-xs border transition ${selectedStyle}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {priority === 'Emergency' && '🚨 Immediate risk: Electrical spark, continuous flooding, or room security compromised.'}
                {priority === 'High' && '⚠️ Needs urgent technician dispatch within 12-24 hours.'}
                {priority === 'Medium' && 'ℹ️ Normal maintenance queue (routine fix within 1-2 days).'}
                {priority === 'Low' && '✨ Cosmetic or minor repair that does not prevent normal room use.'}
              </p>
            </div>

            {/* 5. Detailed Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                5. Detailed Description *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what is happening, when it started, and any symptoms noticed..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* 6. Access Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                6. Preferred Access Window for Caretaker
              </label>
              <select
                value={preferredAccessTime}
                onChange={(e) => setPreferredAccessTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="Morning (08:00 - 12:00)">Morning (08:00 - 12:00)</option>
                <option value="Afternoon (12:00 - 17:00)">Afternoon (12:00 - 17:00)</option>
                <option value="Anytime with Notice">Anytime with WhatsApp/SMS Notice</option>
                <option value="Student Must Be Present">Resident Must Be Present</option>
              </select>
            </div>

            {/* 7. Photo Attachment */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  7. Attach Issue Photo (Optional)
                </label>
                {photoAttachment && (
                  <button
                    type="button"
                    onClick={() => setPhotoAttachment('')}
                    className="text-[10px] text-rose-500 hover:text-rose-600 font-semibold"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              {photoAttachment ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-36">
                  <img
                    src={photoAttachment}
                    alt="Attached issue"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium backdrop-blur-xs">
                    Photo attached
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_PHOTOS.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPhotoAttachment(preset.url)}
                        className="group relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition text-left"
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-16 object-cover group-hover:scale-105 transition"
                        />
                        <div className="p-1 bg-white dark:bg-slate-800 text-[9px] font-medium text-slate-700 dark:text-slate-300 truncate">
                          {preset.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submission Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting Maintenance Request...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Submit Request to Landlord
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2">
                Logged tickets appear instantly in the Owner Management Portal.
              </p>
            </div>
          </div>
        </form>
      )}

      {/* VIEW: REQUESTS LIST & TRACKING */}
      {activeTab === 'list' && (
        <div className="space-y-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All ({studentRequests.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 flex items-center gap-1 ${
                statusFilter === 'active'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Active ({activeRequests.length})
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 flex items-center gap-1 ${
                statusFilter === 'resolved'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Check className="w-3 h-3" />
              Resolved ({resolvedRequests.length})
            </button>
          </div>

          {/* Empty State */}
          {filteredRequests.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  No {statusFilter === 'active' ? 'Active' : ''} Maintenance Issues
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  Your room is in good order! If any repair or assistance is needed, submit a quick ticket.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('create')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Report an Issue
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  {/* Top Metadata Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        #{req.id}
                      </span>
                      {getPriorityBadge(req.priority)}
                    </div>
                    {getStatusBadge(req.status)}
                  </div>

                  {/* Title & Location */}
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                    {req.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {req.areaLocation || req.roomNumber}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {req.createdAt}
                    </span>
                  </div>

                  {/* Description preview */}
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                    {req.description}
                  </p>

                  {/* Visual Step Tracker */}
                  {req.status !== 'Cancelled' && renderStepTracker(req.status)}

                  {/* Landlord / Technician Notes Banner */}
                  {(req.assignedTechnician || req.ownerNotes) && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-[11px] space-y-1">
                      {req.assignedTechnician && (
                        <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300 font-semibold">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Assigned: {req.assignedTechnician}</span>
                        </div>
                      )}
                      {req.scheduledDate && (
                        <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 text-[10px]">
                          <Calendar className="w-3 h-3 text-emerald-600" />
                          <span>Scheduled Date: {req.scheduledDate}</span>
                        </div>
                      )}
                      {req.ownerNotes && (
                        <div className="text-[10px] text-slate-700 dark:text-slate-300 italic pt-0.5 border-t border-emerald-200/60 dark:border-emerald-800/60">
                          "Landlord: {req.ownerNotes}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedTicket(req)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800"
                    >
                      <span>View Details & Timeline</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    {req.photoAttachment && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                        <Camera className="w-3 h-3" />
                        Photo attached
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TICKET DETAILS MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    #{selectedTicket.id}
                  </span>
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedTicket.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Details Body */}
            <div className="space-y-3.5 py-3 text-xs">
              {/* Status & Category */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block uppercase">
                    Current Status
                  </span>
                  <div className="mt-0.5">{getStatusBadge(selectedTicket.status)}</div>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block uppercase">
                    Category
                  </span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedTicket.category}
                  </div>
                </div>
              </div>

              {/* Location & Time */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {selectedTicket.areaLocation} ({selectedTicket.roomNumber})
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Reported On:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {selectedTicket.createdAt}
                  </span>
                </div>
                {selectedTicket.preferredAccessTime && (
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">Access Window:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {selectedTicket.preferredAccessTime}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Issue Description
                </span>
                <p className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 leading-relaxed text-xs">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Photo preview if present */}
              {selectedTicket.photoAttachment && (
                <div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Photo Evidence
                  </span>
                  <img
                    src={selectedTicket.photoAttachment}
                    alt="Maintenance photo"
                    className="w-full h-36 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                </div>
              )}

              {/* Assigned Contractor details */}
              {selectedTicket.assignedTechnician && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl space-y-1">
                  <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider">
                    Technician Assigned
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-xs">
                    {selectedTicket.assignedTechnician}
                  </div>
                  {selectedTicket.scheduledDate && (
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Scheduled: {selectedTicket.scheduledDate}
                    </div>
                  )}
                  {selectedTicket.ownerNotes && (
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        Owner note:
                      </span>{' '}
                      {selectedTicket.ownerNotes}
                    </div>
                  )}
                </div>
              )}

              {/* Status Timeline History */}
              <div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  Activity Timeline
                </span>
                <div className="space-y-2 border-l-2 border-emerald-500/40 ml-2 pl-3 py-1">
                  {selectedTicket.statusHistory.map((item, idx) => (
                    <div key={idx} className="relative text-[11px]">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white dark:border-slate-900" />
                      <div className="font-bold text-slate-800 dark:text-white flex items-center justify-between">
                        <span>{item.status}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {item.timestamp}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        by {item.updatedBy}
                      </div>
                      {item.note && (
                        <div className="text-[10px] text-slate-600 dark:text-slate-300 italic mt-0.5">
                          "{item.note}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Landlord Contact Support */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <a
                  href={`tel:${ownerProfile.phone}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-200 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Call Landlord
                </a>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
