import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  CreditCard,
  FileText,
  User,
  Wifi,
  Battery,
  Signal,
  Smartphone,
  Maximize2,
  ChevronDown,
} from 'lucide-react';
import { MobileRoomsView } from './MobileRoomsView';
import { MobilePaymentsView } from './MobilePaymentsView';
import { MobileAgreementsView } from './MobileAgreementsView';
import { MobileProfileView } from './MobileProfileView';
import { MobileAuthViews } from './MobileAuthViews';

export const MobileShell: React.FC = () => {
  const {
    currentStudent,
    studentAuthScreen,
    mobileFrameEnabled,
    setMobileFrameEnabled,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rooms' | 'payments' | 'agreements' | 'profile'>('rooms');

  // Extract greeting name (e.g. Mohlomi, Matlhoane, Moloi)
  const getGreetingName = () => {
    if (!currentStudent) return 'Student';
    const parts = currentStudent.fullName.split(' ');
    return parts[parts.length - 1];
  };

  const renderContent = () => {
    if (studentAuthScreen !== 'app') {
      return <MobileAuthViews />;
    }

    switch (activeTab) {
      case 'rooms':
        return <MobileRoomsView onNavigateToAgreement={() => setActiveTab('agreements')} />;
      case 'payments':
        return <MobilePaymentsView />;
      case 'agreements':
        return <MobileAgreementsView />;
      case 'profile':
        return <MobileProfileView />;
      default:
        return <MobileRoomsView onNavigateToAgreement={() => setActiveTab('agreements')} />;
    }
  };

  const contentInner = (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 select-none overflow-hidden">
      {/* iOS / Flutter Status Bar */}
      <div className="pt-2 px-6 pb-1 flex items-center justify-between text-xs font-semibold shrink-0 z-20">
        <span className="font-mono text-[11px] tracking-tight text-slate-800 dark:text-slate-200">
          9:41
        </span>
        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
          <Signal className="w-3 h-3" />
          <Wifi className="w-3 h-3" />
          <Battery className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* App Header (When authenticated) */}
      {studentAuthScreen === 'app' && (
        <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-800/80 shrink-0 z-10">
          <div className="flex items-center justify-between">
            {/* User Greeting */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-9 h-9 rounded-xl ${currentStudent?.avatarColor || 'bg-emerald-600'} text-white flex items-center justify-center font-bold text-xs shadow-xs hover:ring-2 hover:ring-emerald-400 transition`}
                title="View Profile"
              >
                {currentStudent?.initials || 'ST'}
              </button>
              <div>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="text-left font-bold text-sm text-slate-900 dark:text-white leading-tight hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                >
                  Hello, {getGreetingName()} 👋
                </button>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Student Resident</span>
                  {currentStudent?.emailConfirmed && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Current Tab Label / Room pill */}
            <div className="text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                {activeTab}
              </span>
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                {currentStudent?.assignedRoomId === 'room-01'
                  ? 'Room 01'
                  : currentStudent?.assignedRoomId === 'room-02'
                  ? 'Room 02'
                  : currentStudent?.assignedRoomId === 'room-03'
                  ? 'Room 03'
                  : 'Room 04'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2 scrollbar-none">
        {renderContent()}
      </div>

      {/* Bottom Navigation Bar (When authenticated) */}
      {studentAuthScreen === 'app' && (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-3 py-2 shrink-0 z-20">
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
                activeTab === 'rooms'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Rooms</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
                activeTab === 'payments'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Payments</span>
            </button>

            <button
              onClick={() => setActiveTab('agreements')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
                activeTab === 'agreements'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Agreements</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition ${
                activeTab === 'profile'
                  ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Profile</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-2 sm:px-4 min-h-[calc(100vh-60px)]">
      {/* Top Mobile Controls Helper */}
      <div className="w-full max-w-sm flex items-center justify-between mb-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-4 h-4 text-emerald-700" />
          <span>Flutter Mobile Resident Client</span>
        </div>
        <button
          onClick={() => setMobileFrameEnabled(!mobileFrameEnabled)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] transition font-medium"
        >
          {mobileFrameEnabled ? 'Fit Full Width' : 'Phone Frame'}
        </button>
      </div>

      {/* Frame Container */}
      {mobileFrameEnabled ? (
        <div className="relative w-full max-w-[390px] h-[780px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-[7px] border-slate-900 ring-1 ring-slate-800/80 flex flex-col overflow-hidden">
          {/* Dynamic Island / Speaker Pill */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-center pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950/80 mr-3 border border-slate-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          </div>
          {/* Inner Screen */}
          <div className="w-full h-full rounded-[34px] overflow-hidden flex flex-col">
            {contentInner}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md h-[780px] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          {contentInner}
        </div>
      )}
    </div>
  );
};
