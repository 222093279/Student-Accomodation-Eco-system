import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  Calendar,
  X,
  Menu,
  Shield,
  Wrench,
} from 'lucide-react';
import { OwnerDashboard } from './OwnerDashboard';
import { OwnerStudents } from './OwnerStudents';
import { OwnerRooms } from './OwnerRooms';
import { OwnerAgreements } from './OwnerAgreements';
import { OwnerPayments } from './OwnerPayments';
import { OwnerMaintenance } from './OwnerMaintenance';
import { OwnerReports } from './OwnerReports';
import { OwnerSettings } from './OwnerSettings';
import { OwnerHelp } from './OwnerHelp';
import { OwnerActivityFeed } from './OwnerActivityFeed';

export const OwnerLayout: React.FC = () => {
  const {
    ownerActiveTab,
    setOwnerActiveTab,
    ownerProfile,
    payments,
    maintenanceRequests,
    activities,
    logout,
    showToast,
  } = useApp();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);

  const pendingCount = payments.filter((p) => p.status === 'Pending').length;
  const activeMaintenanceCount = maintenanceRequests.filter(
    (r) => r.status === 'Reported' || r.status === 'Scheduled' || r.status === 'In Progress'
  ).length;

  interface NavItem {
    id: 'dashboard' | 'students' | 'rooms' | 'agreements' | 'payments' | 'maintenance' | 'reports' | 'settings' | 'help';
    label: string;
    icon: any;
    badge?: number | null;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'rooms', label: 'Rooms', icon: Home },
    { id: 'agreements', label: 'Agreements', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'maintenance', label: 'Maintenance & Tasks', icon: Wrench, badge: activeMaintenanceCount > 0 ? activeMaintenanceCount : null },
    { id: 'reports', label: 'Performance Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  const renderActiveView = () => {
    switch (ownerActiveTab) {
      case 'dashboard':
        return <OwnerDashboard onNavigate={setOwnerActiveTab} />;
      case 'students':
        return <OwnerStudents />;
      case 'rooms':
        return <OwnerRooms />;
      case 'agreements':
        return <OwnerAgreements />;
      case 'payments':
        return <OwnerPayments />;
      case 'maintenance':
        return <OwnerMaintenance />;
      case 'reports':
        return <OwnerReports />;
      case 'settings':
        return <OwnerSettings />;
      case 'help':
        return <OwnerHelp />;
      default:
        return <OwnerDashboard onNavigate={setOwnerActiveTab} />;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-xs">
            OP
          </div>
          <div>
            <div className="font-bold text-sm text-white tracking-tight">Owner Portal</div>
            <div className="text-[10px] text-slate-400 font-medium">Accommodation Mgmt</div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-none text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = ownerActiveTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setOwnerActiveTab(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${
                isActive
                  ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[9px]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Property Owner Profile & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2.5 mb-3 px-1">
          <div className="w-8 h-8 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center font-bold text-xs">
            PC
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-xs text-white truncate">{ownerProfile.name}</div>
            <div className="text-[10px] text-slate-400 truncate">{ownerProfile.title}</div>
          </div>
        </div>

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-medium transition"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex shrink-0">{sidebarContent}</aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-900 dark:text-white capitalize">
                {ownerActiveTab}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500">Student Accommodation Owner Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Today: 24 Feb 2026</span>
            </div>

            <button
              onClick={() => setIsActivityDrawerOpen(!isActivityDrawerOpen)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Recent Activity & Notifications"
            >
              <Bell className="w-4 h-4" />
              {activities.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{renderActiveView()}</div>
        </main>
      </div>

      {/* Real-Time Activity Feed Drawer */}
      {isActivityDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsActivityDrawerOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col p-4 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Real-Time Activity Feed
                  </h3>
                  <p className="text-[10px] text-slate-500">Live notifications for rent & maintenance</p>
                </div>
              </div>
              <button
                onClick={() => setIsActivityDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-0.5">
              <OwnerActivityFeed
                onNavigate={setOwnerActiveTab}
                onClose={() => setIsActivityDrawerOpen(false)}
                showFilters={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-sm w-full p-5 space-y-4 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Logout Confirmation
              </h3>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to log out of the Student Accommodation Management System? All unsaved updates will be discarded.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
