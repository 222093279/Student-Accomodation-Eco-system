import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityLog } from '../../types';
import {
  Clock,
  CreditCard,
  Wrench,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Flame,
  User,
  MapPin,
  ArrowRight,
  Filter,
  Search,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  FileText,
  DollarSign,
  Activity,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

interface Props {
  onNavigate?: (tab: any) => void;
  maxItems?: number;
  showFilters?: boolean;
  compact?: boolean;
  onClose?: () => void;
}

export const OwnerActivityFeed: React.FC<Props> = ({
  onNavigate,
  maxItems,
  showFilters = true,
  compact = false,
  onClose,
}) => {
  const { activities } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'maintenance' | 'payment' | 'other'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Count types
  const maintenanceCount = activities.filter((a) => a.type === 'maintenance').length;
  const paymentCount = activities.filter((a) => a.type === 'payment').length;

  const filteredActivities = activities.filter((act) => {
    // Type Filter
    if (filterType === 'maintenance' && act.type !== 'maintenance') return false;
    if (filterType === 'payment' && act.type !== 'payment') return false;
    if (filterType === 'other' && (act.type === 'maintenance' || act.type === 'payment')) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = act.title.toLowerCase().includes(q);
      const matchSubtitle = act.subtitle.toLowerCase().includes(q);
      const matchStudent = act.studentName?.toLowerCase().includes(q);
      const matchRoom = act.roomNumber?.toLowerCase().includes(q);
      const matchEntity = act.entityId?.toLowerCase().includes(q);
      return matchTitle || matchSubtitle || matchStudent || matchRoom || matchEntity;
    }

    return true;
  });

  const displayedActivities = maxItems ? filteredActivities.slice(0, maxItems) : filteredActivities;

  const getActivityIcon = (act: ActivityLog) => {
    if (act.type === 'payment') {
      return (
        <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 shrink-0">
          <CreditCard className="w-4 h-4" />
        </div>
      );
    }

    if (act.type === 'maintenance') {
      if (act.status === 'Resolved') {
        return (
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      }
      if (act.status === 'In Progress') {
        return (
          <div className="p-2 rounded-xl bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 shrink-0">
            <Wrench className="w-4 h-4" />
          </div>
        );
      }
      if (act.status === 'Scheduled') {
        return (
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
        );
      }
      if (act.priority === 'Emergency') {
        return (
          <div className="p-2 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 shrink-0">
            <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
        );
      }
      return (
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 shrink-0">
          <Clock className="w-4 h-4" />
        </div>
      );
    }

    if (act.type === 'agreement') {
      return (
        <div className="p-2 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 shrink-0">
          <FileText className="w-4 h-4" />
        </div>
      );
    }

    return (
      <div className="p-2 rounded-xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 shrink-0">
        <Activity className="w-4 h-4" />
      </div>
    );
  };

  const handleItemClick = (act: ActivityLog) => {
    if (!onNavigate) return;
    if (act.type === 'maintenance') {
      onNavigate('maintenance');
      if (onClose) onClose();
    } else if (act.type === 'payment') {
      onNavigate('payments');
      if (onClose) onClose();
    } else if (act.type === 'agreement') {
      onNavigate('agreements');
      if (onClose) onClose();
    } else if (act.type === 'registration') {
      onNavigate('students');
      if (onClose) onClose();
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Top Header & Live Indicator */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Live Recent Activity</span>
            </h3>
            <p className="text-[10px] text-slate-500">
              Real-time audit log of maintenance status changes and rent receipts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live Sync
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      {showFilters && (
        <div className="space-y-2">
          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition shrink-0 ${
                filterType === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              All ({activities.length})
            </button>
            <button
              onClick={() => setFilterType('maintenance')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition shrink-0 flex items-center gap-1 ${
                filterType === 'maintenance'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Wrench className="w-3 h-3" />
              Maintenance ({maintenanceCount})
            </button>
            <button
              onClick={() => setFilterType('payment')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition shrink-0 flex items-center gap-1 ${
                filterType === 'payment'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              Rent Payments ({paymentCount})
            </button>
          </div>

          {/* Search box for activity feed */}
          {!compact && (
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter activities by resident, room, ticket ID, or note..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Activities List */}
      <div className="space-y-2 overflow-y-auto max-h-[360px] pr-1 scrollbar-thin">
        {displayedActivities.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <Clock className="w-8 h-8 mx-auto mb-1.5 opacity-40" />
            <div className="font-semibold text-slate-600 dark:text-slate-300">
              No recent activities found
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Status changes on maintenance tickets and payments will appear here in real-time.
            </div>
          </div>
        ) : (
          displayedActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => handleItemClick(act)}
              className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/90 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 transition cursor-pointer group space-y-1.5"
            >
              {/* Row 1: Icon, Title, and Time */}
              <div className="flex items-start gap-2.5">
                {getActivityIcon(act)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs truncate">
                      {act.title}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 shrink-0">
                      {act.timeAgo}
                    </span>
                  </div>

                  {/* Status Transition Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    {act.previousStatus && act.status && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[9px] font-mono font-semibold">
                        <span>{act.previousStatus}</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                          {act.status}
                        </span>
                      </span>
                    )}

                    {act.amount !== undefined && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                        +R{act.amount.toLocaleString('en-ZA')}
                      </span>
                    )}

                    {act.roomNumber && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-500 font-medium">
                        <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                        {act.roomNumber}
                      </span>
                    )}

                    {act.entityId && (
                      <span className="text-[9px] font-mono font-bold text-slate-400 bg-white dark:bg-slate-900 px-1 py-0.2 rounded border border-slate-200 dark:border-slate-800">
                        #{act.entityId}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Subtitle Description */}
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug pl-11">
                {act.subtitle}
              </p>

              {/* Row 3: Actor & Action Shortcut */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700/40 pl-11">
                <span>By: {act.actor || 'System'}</span>
                {onNavigate && (
                  <span className="inline-flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 font-semibold group-hover:underline">
                    {act.type === 'maintenance'
                      ? 'View Ticket'
                      : act.type === 'payment'
                      ? 'View Payment'
                      : 'View'}
                    <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Summary / Jump */}
      {onNavigate && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">
            Showing {displayedActivities.length} of {activities.length} logged events
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('maintenance')}
              className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              <span>Maintenance</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              onClick={() => onNavigate('payments')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
            >
              <span>Payments</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
