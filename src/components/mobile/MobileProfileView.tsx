import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  GraduationCap,
  Mail,
  Phone,
  Home,
  Clock,
  LogOut,
  Edit3,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  Shield,
} from 'lucide-react';

export const MobileProfileView: React.FC = () => {
  const {
    currentStudent,
    currentStudentRoom,
    activities,
    students,
    setActiveStudentId,
    setStudentAuthScreen,
    updateStudent,
    logout,
    showToast,
  } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentStudent.fullName,
    email: currentStudent.email,
    phone: currentStudent.phone,
    emergencyName: currentStudent.emergencyContact.name,
    emergencyPhone: currentStudent.emergencyContact.phone,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(currentStudent.id, {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
      },
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Student Identity Card */}
      <div className="bg-white dark:bg-slate-800/95 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-14 h-14 rounded-2xl ${currentStudent.avatarColor} text-white flex items-center justify-center font-bold text-lg shadow-sm`}
          >
            {currentStudent.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                Student Resident
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                #{currentStudent.studentNumber}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white truncate mt-1">
              {currentStudent.fullName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {currentStudent.course}
            </p>
          </div>
        </div>

        {/* Quick Details List */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{currentStudent.institution}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Home className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {currentStudentRoom?.roomNumber} • {currentStudentRoom?.block} ({currentStudentRoom?.floor})
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{currentStudent.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{currentStudent.phone}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
          <button
            onClick={logout}
            className="py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-semibold text-xs inline-flex items-center justify-center gap-1.5 transition border border-rose-200/50 dark:border-rose-900"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Switch Resident Switcher (Quick Demo helper) */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Switch Demo Resident
          </span>
          <Users className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {students.map((stud) => (
            <button
              key={stud.id}
              onClick={() => {
                setActiveStudentId(stud.id);
                showToast(`Switched view to ${stud.shortName}`, 'info');
              }}
              className={`p-2 rounded-xl text-center border transition ${
                currentStudent.id === stud.id
                  ? 'bg-emerald-700 text-white border-emerald-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              <div className="text-xs font-bold truncate">{stud.shortName}</div>
              <div className="text-[10px] opacity-80 truncate">
                {stud.assignedRoomId === 'room-01' ? 'Room 01' : stud.assignedRoomId === 'room-02' ? 'Room 02' : 'Room 03'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white dark:bg-slate-800/95 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Recent Activity
          </h4>
          <Clock className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="space-y-3 text-xs">
          {activities.slice(0, 5).map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-850 last:border-none last:pb-0"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 dark:text-white text-xs">
                  {act.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {act.subtitle}
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">{act.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Edit Resident Profile
              </span>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                  required
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Emergency Contact
                </span>
                <div className="space-y-2">
                  <div>
                    <label className="block text-slate-500 mb-0.5">Contact Name</label>
                    <input
                      type="text"
                      value={formData.emergencyName}
                      onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-0.5">Contact Telephone</label>
                    <input
                      type="text"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
