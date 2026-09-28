/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { MobileShell } from './components/mobile/MobileShell';
import { OwnerLayout } from './components/owner/OwnerLayout';
import { ToastContainer } from './components/common/ToastContainer';
import { Smartphone, Monitor, RotateCcw, Building2, LogOut, User } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    isAuthenticated,
    currentUser,
    logout,
    viewMode,
    setViewMode,
    resetAllData,
    currentStudent,
    ownerProfile,
  } = useApp();

  // If not authenticated, require login first!
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
        <LoginPage />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased">
      {/* Top Application Switcher Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 flex items-center justify-between gap-2">
          {/* Logo / Title */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-sm tracking-tight">ResiManage</span>
              <span className="text-[10px] text-emerald-400 font-medium hidden md:inline">
                • Student Residence Ecosystem
              </span>
            </div>
          </div>

          {/* Dual Portal Switcher Tabs */}
          <div className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 text-xs">
            <button
              onClick={() => setViewMode('student')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                viewMode === 'student'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Student Mobile App</span>
            </button>

            <button
              onClick={() => setViewMode('owner')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                viewMode === 'owner'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Owner Portal</span>
            </button>
          </div>

          {/* User Session & Sign Out Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <div
                className={`w-2 h-2 rounded-full ${
                  currentUser?.role === 'student' ? 'bg-emerald-400' : 'bg-blue-400'
                }`}
              />
              <span className="font-medium text-slate-200 truncate max-w-[130px]">
                {currentUser?.role === 'student' ? currentStudent.shortName : ownerProfile.name}
              </span>
              <span className="text-[10px] text-slate-400">
                ({currentUser?.role === 'student' ? 'Resident' : 'Owner'})
              </span>
            </div>

            <button
              onClick={logout}
              title="Sign out of the system"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/40 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            <button
              onClick={resetAllData}
              title="Reset initial dataset"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col min-h-0">
        {viewMode === 'student' ? <MobileShell /> : <OwnerLayout />}
      </main>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
