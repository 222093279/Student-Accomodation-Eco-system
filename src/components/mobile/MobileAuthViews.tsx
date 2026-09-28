import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Lock, Mail, User, Phone, CheckCircle, Shield } from 'lucide-react';

export const MobileAuthViews: React.FC = () => {
  const {
    studentAuthScreen,
    setStudentAuthScreen,
    students,
    setActiveStudentId,
    login,
    showToast,
  } = useApp();

  const [loginEmail, setLoginEmail] = useState('mramadulwane@gmail.com');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerTerms, setRegisterTerms] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login('student', loginEmail, loginPassword);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerTerms) {
      showToast('Please accept terms and conditions', 'warning');
      return;
    }
    showToast('Account registered! Signed in.', 'success');
    setStudentAuthScreen('app');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      showToast('Please enter your student email', 'warning');
      return;
    }
    setResetSent(true);
    showToast('Password reset link sent to ' + resetEmail, 'info');
  };

  if (studentAuthScreen === 'forgot') {
    return (
      <div className="min-h-full flex flex-col justify-between p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        <div>
          <button
            onClick={() => {
              setResetSent(false);
              setStudentAuthScreen('login');
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          <h2 className="text-xl font-bold tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {resetSent ? (
            <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                Password reset link sent
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Check your inbox for instructions to securely regain account access.
              </p>
              <button
                onClick={() => setStudentAuthScreen('login')}
                className="mt-3 w-full py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500/40"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                Send Reset Link
              </button>
            </form>
          )}
        </div>

        <div className="text-center text-[11px] text-slate-400 pt-6">
          Student Accommodation Resident System
        </div>
      </div>
    );
  }

  if (studentAuthScreen === 'register') {
    return (
      <div className="min-h-full flex flex-col justify-between p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        <div>
          <button
            onClick={() => setStudentAuthScreen('login')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 block">
            Thinking Beyond
          </span>
          <h2 className="text-xl font-bold tracking-tight mt-0.5">Register Resident Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create your profile to access your room lease and payments.
          </p>

          <form onSubmit={handleRegister} className="mt-5 space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Ramadulwane Daniel Mohlomi"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="mramadulwane@gmail.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  placeholder="+27 67 240 2175"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
                  required
                />
              </div>
            </div>

            <label className="flex items-center gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={registerTerms}
                onChange={(e) => setRegisterTerms(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
              />
              <span className="text-[11px] text-slate-600 dark:text-slate-400">
                I agree to the terms and conditions
              </span>
            </label>

            <button
              type="submit"
              className="mt-2 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              Register & Continue
            </button>
          </form>
        </div>

        <div className="text-center pt-4 text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={() => setStudentAuthScreen('login')}
            className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // Default: Login View
  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div>
        <div className="mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
            RM
          </div>
          <h2 className="text-xl font-bold tracking-tight">Let's sign you in</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Welcome back. You've been missed! Login to access your dashboard, payments, and agreement updates securely.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Student ID / Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="mramadulwane@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500/40"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setStudentAuthScreen('forgot')}
                className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500/40"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-[0.99] mt-2"
          >
            Login
          </button>
        </form>

        {/* Demo Fast Account Selector */}
        <div className="mt-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
            Quick Demo Auto-Fill:
          </span>
          <div className="flex flex-col gap-1.5 text-[11px]">
            {students.map((stud) => (
              <button
                key={stud.id}
                type="button"
                onClick={() => {
                  setLoginEmail(stud.email);
                  setActiveStudentId(stud.id);
                  setStudentAuthScreen('app');
                  showToast(`Logged in as ${stud.shortName}`, 'success');
                }}
                className="text-left py-1 px-2 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-650 flex justify-between items-center transition"
              >
                <span className="font-medium truncate">{stud.fullName}</span>
                <span className="text-[10px] text-slate-400 shrink-0">{stud.studentNumber}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center pt-4 text-xs text-slate-500">
        Don't have an account?{' '}
        <button
          onClick={() => setStudentAuthScreen('register')}
          className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
        >
          Register
        </button>
      </div>
    </div>
  );
};
