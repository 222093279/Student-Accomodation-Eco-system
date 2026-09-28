import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Lock,
  Mail,
  User,
  Phone,
  CheckCircle,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  Inbox,
  Send,
  AlertCircle,
  GraduationCap,
  Hash,
} from 'lucide-react';

export const MobileAuthViews: React.FC = () => {
  const {
    studentAuthScreen,
    setStudentAuthScreen,
    pendingVerificationEmail,
    setPendingVerificationEmail,
    lastSentConfirmationCode,
    registerCandidate,
    verifyEmailConfirmation,
    resendConfirmationEmail,
    login,
    showToast,
  } = useApp();

  // Login form state (empty - candidate enters their own credentials)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Registration state (candidate credentials)
  const [registerName, setRegisterName] = useState('');
  const [registerStudentNumber, setRegisterStudentNumber] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [registerTerms, setRegisterTerms] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Email confirmation state
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Handle Login with candidate credentials
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      showToast('Please enter both your registered email/student ID and password', 'warning');
      return;
    }

    setIsLoggingIn(true);
    setTimeout(() => {
      login('student', loginEmail.trim(), loginPassword);
      setIsLoggingIn(false);
    }, 350);
  };

  // Handle Candidate Registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerName.trim()) {
      showToast('Please enter your full name', 'warning');
      return;
    }
    if (!registerStudentNumber.trim()) {
      showToast('Please enter your student number or ID', 'warning');
      return;
    }
    if (!registerEmail.trim() || !registerEmail.includes('@')) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }
    if (!registerPassword || registerPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!registerTerms) {
      showToast('Please accept the residence terms and conditions', 'warning');
      return;
    }

    setIsRegistering(true);
    setTimeout(() => {
      const result = registerCandidate({
        fullName: registerName,
        studentNumber: registerStudentNumber,
        email: registerEmail,
        phone: registerPhone || '+27 67 000 0000',
        password: registerPassword,
      });

      setIsRegistering(false);
      if (result.success) {
        // Form cleared for security
        setRegisterPassword('');
        setRegisterConfirmPassword('');
      }
    }, 400);
  };

  // Handle Email Verification Code submission
  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      showToast('Please enter the 6-digit confirmation code', 'warning');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const targetEmail = pendingVerificationEmail || registerEmail || loginEmail;
      const res = verifyEmailConfirmation(targetEmail, verificationCode.trim());
      setIsVerifying(false);
      if (res.success) {
        setVerificationCode('');
      }
    }, 400);
  };

  // Handle Resending Confirmation Email
  const handleResendCode = () => {
    const targetEmail = pendingVerificationEmail || registerEmail || loginEmail;
    if (!targetEmail) {
      showToast('No candidate email found. Please sign up first.', 'error');
      return;
    }
    setIsResending(true);
    setTimeout(() => {
      resendConfirmationEmail(targetEmail);
      setIsResending(false);
    }, 500);
  };

  // Handle Forgot Password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      showToast('Please enter your registered student email', 'warning');
      return;
    }
    setResetSent(true);
    showToast('Password reset link sent to ' + resetEmail, 'info');
  };

  // ==========================================
  // VIEW: Email Verification / Confirmation
  // ==========================================
  if (studentAuthScreen === 'verify-email') {
    const targetEmail = pendingVerificationEmail || registerEmail || loginEmail || 'candidate@university.ac.za';
    return (
      <div className="min-h-full flex flex-col justify-between p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        <div>
          <button
            onClick={() => setStudentAuthScreen('login')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold mb-3 shadow-xs">
            <Mail className="w-6 h-6" />
          </div>

          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 block">
            Authentication Required
          </span>
          <h2 className="text-xl font-bold tracking-tight mt-0.5">Email Confirmation</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            We have sent an authentication verification code to confirm your registered account:
          </p>
          <div className="mt-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 break-all border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span>{targetEmail}</span>
            <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">
              Pending
            </span>
          </div>

          {/* Interactive Simulated University Mail Preview Banner */}
          <div className="mt-4 p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/70 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200 text-[11px]">
                <Inbox className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulated Email Notification (Inbox)</span>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Just now</span>
            </div>
            <div className="text-[11px] text-slate-700 dark:text-slate-300">
              <strong>Subject:</strong> ResiManage • Confirm Student Account Authentication
            </div>
            <div className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-emerald-100 dark:border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
                  6-Digit Verification Code:
                </span>
                <span className="font-mono text-base font-extrabold tracking-widest text-emerald-700 dark:text-emerald-400">
                  {lastSentConfirmationCode || '839204'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setVerificationCode(lastSentConfirmationCode || '839204');
                  showToast('Code copied to input field!', 'info');
                }}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold shadow-xs transition"
              >
                Auto-Fill Code
              </button>
            </div>
          </div>

          {/* Code Submission Form */}
          <form onSubmit={handleVerifyEmail} className="mt-5 space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter 6-Digit Confirmation Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 839204"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-mono tracking-widest text-center font-bold focus:ring-2 focus:ring-emerald-500/40 text-slate-900 dark:text-white"
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying || verificationCode.length < 6}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
            >
              {isVerifying ? 'Authenticating...' : 'Confirm & Authenticate Account'}
            </button>
          </form>

          {/* Resend actions */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Didn't get the email?</span>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
            >
              <Send className="w-3 h-3" />
              {isResending ? 'Resending...' : 'Resend Email'}
            </button>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-400 pt-4">
          ResiManage Student Residence • Secure Credential Authentication
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: Forgot Password
  // ==========================================
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
            Enter your registered candidate email address and we'll dispatch instructions to reset your password.
          </p>

          {resetSent ? (
            <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-100">
                Password reset link dispatched
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Check your inbox at <strong>{resetEmail}</strong> for recovery steps.
              </p>
              <button
                onClick={() => setStudentAuthScreen('login')}
                className="mt-3 w-full py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your student email"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500/40 text-slate-900 dark:text-white"
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

  // ==========================================
  // VIEW: Register Candidate Account
  // ==========================================
  if (studentAuthScreen === 'register') {
    return (
      <div className="min-h-full flex flex-col justify-between p-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-y-auto">
        <div>
          <button
            onClick={() => setStudentAuthScreen('login')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>

          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 block">
            Student Registration
          </span>
          <h2 className="text-xl font-bold tracking-tight mt-0.5">Create Candidate Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Register your credentials to access residence rooms, payments, and lease agreements.
          </p>

          <form onSubmit={handleRegister} className="mt-4 space-y-2.5">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="e.g. Sibusiso Dlamini"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Student ID / Number */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Student Number / University ID *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={registerStudentNumber}
                  onChange={(e) => setRegisterStudentNumber(e.target.value)}
                  placeholder="e.g. 222049182"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Email Address (For Verification) *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="e.g. sibusiso@cut.ac.za"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  placeholder="+27 71 234 5678"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Create Password * (Min 6 chars)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={registerTerms}
                onChange={(e) => setRegisterTerms(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 mt-0.5"
              />
              <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                I agree to the ResiManage student residence terms and consent to email verification.
              </span>
            </label>

            <button
              type="submit"
              disabled={isRegistering}
              className="mt-3 w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              {isRegistering ? 'Registering & Sending Email...' : 'Create Account & Send Confirmation'}
            </button>
          </form>
        </div>

        <div className="text-center pt-3 text-xs text-slate-500">
          Already registered?{' '}
          <button
            onClick={() => setStudentAuthScreen('login')}
            className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
          >
            Sign In with Your Credentials
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: Candidate Login View (Default)
  // (NO DEMO ACCOUNTS DISPLAYED)
  // ==========================================
  return (
    <div className="min-h-full flex flex-col justify-between p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <div>
        <div className="mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-xs">
            RM
          </div>
          <h2 className="text-xl font-bold tracking-tight">Resident Candidate Login</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Please log in using your registered candidate credentials (student email and password created during account registration).
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Registered Student Email or ID
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your student email or ID"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500/40 text-slate-900 dark:text-white"
                required
                autoFocus
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
                type={showLoginPassword ? 'text' : 'password'}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-9 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-emerald-500/40 text-slate-900 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-[0.99] mt-2 flex items-center justify-center gap-1.5"
          >
            {isLoggingIn ? 'Authenticating...' : 'Sign In with Credentials'}
          </button>
        </form>

        {/* Security & Authenticity Notice */}
        <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-2.5 text-xs">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Only registered candidates who have completed registration and verified their email address can authenticate into this mobile application.
          </p>
        </div>
      </div>

      <div className="text-center pt-4 text-xs text-slate-500">
        New resident candidate?{' '}
        <button
          onClick={() => setStudentAuthScreen('register')}
          className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
        >
          Create Candidate Account
        </button>
      </div>
    </div>
  );
};
