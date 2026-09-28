import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  GraduationCap,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  X,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, students, ownerProfile, addNewStudent, showToast } = useApp();

  const [role, setRole] = useState<'student' | 'owner'>('student');
  const [identifier, setIdentifier] = useState('mramadulwane@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regForm, setRegForm] = useState({
    fullName: '',
    email: '',
    studentNumber: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false,
  });

  const handleRoleSwitch = (newRole: 'student' | 'owner') => {
    setRole(newRole);
    setErrorMessage('');
    if (newRole === 'student') {
      setIdentifier('mramadulwane@gmail.com');
      setPassword('••••••••••••');
    } else {
      setIdentifier(ownerProfile.email || 'makhelepulane1@gmail.com');
      setPassword('••••••••••••');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage(role === 'student' ? 'Please enter your student ID or email.' : 'Please enter your owner email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = login(role, identifier, password);
      setIsLoading(false);
      if (!success) {
        setErrorMessage('Invalid credentials. Please verify your details or use demo quick-login.');
      }
    }, 400);
  };

  const handleQuickStudentLogin = (studEmail: string) => {
    setIdentifier(studEmail);
    setPassword('••••••••••••');
    login('student', studEmail);
  };

  const handleQuickOwnerLogin = () => {
    setIdentifier(ownerProfile.email);
    setPassword('••••••••••••');
    login('owner', ownerProfile.email);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    showToast(`Password reset link dispatched to ${forgotEmail}`, 'info');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.termsAgreed) {
      showToast('Please accept terms and conditions', 'warning');
      return;
    }
    if (regForm.password !== regForm.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const shortName = regForm.fullName
      .split(' ')
      .map((w, idx, arr) => (idx === arr.length - 1 ? w : w[0]))
      .join(' ');

    addNewStudent({
      fullName: regForm.fullName,
      shortName,
      studentNumber: regForm.studentNumber || String(Math.floor(222000000 + Math.random() * 99999)),
      idNumber: '031110 5000 080',
      email: regForm.email,
      phone: regForm.phone || '+27 67 000 0000',
      institution: 'Central University Of Technology',
      course: 'Diploma in Information Technology',
      assignedRoomId: 'room-01',
      agreementStatus: 'Active',
      emergencyContact: {
        name: 'Parent / Guardian',
        phone: '+27 82 555 9012',
      },
      avatarColor: 'bg-emerald-600',
      initials: shortName.slice(0, 2).toUpperCase(),
    });

    setShowRegisterModal(false);
    login('student', regForm.email);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 font-sans selection:bg-emerald-600 selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-700/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-900/15 rounded-full blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-white shadow-md shadow-emerald-950">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
              <span>ResiManage</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Secure Access Gateway
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Student Accommodation Management System • Free State
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Accredited Resident & Landlord Portal</span>
        </div>
      </header>

      {/* Main Authentication Box */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-black/80">
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => handleRoleSwitch('student')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                role === 'student'
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Resident</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('owner')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                role === 'owner'
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Property Owner</span>
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {role === 'student' ? "Let's sign you in" : 'Owner Portal Sign In'}
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {role === 'student'
                ? "Welcome back. You've been missed! Login to access your room details, rental agreements, and payment records."
                : 'Welcome Back. Login to your property dashboard to manage student tenants, check occupancy, and review rental income.'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800 text-rose-200 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {role === 'student' ? 'Student ID / Email Address' : 'Property Owner Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    role === 'student'
                      ? 'mramadulwane@gmail.com or 222082927'
                      : 'makhelepulane1@gmail.com'
                  }
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span className="text-xs text-slate-400">Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/60 transition flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : `Sign In to ${role === 'student' ? 'Student Resident App' : 'Owner Portal'}`}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* Quick Demo Logins Box */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2.5">
              1-Click Demo Resident Credentials:
            </span>

            {role === 'student' ? (
              <div className="flex flex-col gap-1.5 text-xs">
                {students.map((stud) => (
                  <button
                    key={stud.id}
                    type="button"
                    onClick={() => handleQuickStudentLogin(stud.email)}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-700/60 transition text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-md ${stud.avatarColor} text-white font-bold text-[10px] flex items-center justify-center`}
                      >
                        {stud.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200 group-hover:text-white flex items-center gap-1.5">
                          <span>{stud.fullName}</span>
                          {stud.account?.username && (
                            <span className="font-mono text-[10px] text-emerald-400">
                              (@{stud.account.username})
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ID: {stud.studentNumber} • {stud.email}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition">
                      Sign In →
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleQuickOwnerLogin}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-700/60 transition text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
                    PC
                  </div>
                  <div>
                    <div className="font-bold text-slate-200 group-hover:text-white text-xs">
                      {ownerProfile.name}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {ownerProfile.email} • {ownerProfile.title}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400">
                  Enter Portal →
                </span>
              </button>
            )}
          </div>

          {/* Register Prompt */}
          <div className="mt-5 text-center text-xs text-slate-400">
            {role === 'student' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(true)}
                  className="text-emerald-400 hover:underline font-bold"
                >
                  Register
                </button>
              </>
            ) : (
              <span>Need help setting up your portal? Contact university support.</span>
            )}
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 py-4 border-t border-slate-900 text-center sm:flex sm:justify-between text-[11px] text-slate-500">
        <div>
          Central University Of Technology • Accredited Student Housing Management System
        </div>
        <div className="mt-2 sm:mt-0 flex justify-center gap-4 text-slate-400">
          <span>Capitec Bank Integrated</span>
          <span>•</span>
          <span>POPIA Compliant</span>
          <span>•</span>
          <span>Support: +27 67 240 2175</span>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-xs text-slate-200 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Reset Password</h3>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="py-4 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-sm">Reset link dispatched</h4>
                <p className="text-slate-400 text-xs">
                  We sent password recovery instructions to <strong className="text-emerald-300">{forgotEmail}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSuccess(false);
                  }}
                  className="mt-3 w-full py-2 bg-emerald-700 text-white rounded-xl font-semibold"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <p className="text-slate-400 leading-relaxed">
                  Enter your registered student or owner email address and we'll send you an encrypted link to reset your password.
                </p>

                <div>
                  <label className="block text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. mramadulwane@gmail.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-750"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-xs"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Register Resident Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-xs text-slate-200 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  Thinking Beyond
                </span>
                <h3 className="font-bold text-base text-white">Register Resident Account</h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  placeholder="Ramadulwane Daniel Mohlomi"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">University / Student ID *</label>
                <input
                  type="text"
                  value={regForm.studentNumber}
                  onChange={(e) => setRegForm({ ...regForm, studentNumber: e.target.value })}
                  placeholder="222082927"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  placeholder="mramadulwane@gmail.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  placeholder="+27 67 240 2175"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Password *</label>
                  <input
                    type="password"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    value={regForm.confirmPassword}
                    onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                    required
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={regForm.termsAgreed}
                  onChange={(e) => setRegForm({ ...regForm, termsAgreed: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span className="text-[11px] text-slate-400">
                  I agree to the student code of conduct and residence tenancy terms and conditions.
                </span>
              </label>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-750"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Register & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
