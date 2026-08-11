import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAccount } from '../types';
import {
  ShieldCheck,
  UserCheck,
  Users,
  GraduationCap,
  BookOpen,
  Globe,
  Lock,
  KeyRound,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  School,
  AlertCircle,
  LogIn,
  LogOut,
  Eye,
  EyeOff,
} from 'lucide-react';

export type UserRole = 'admin' | 'guru' | 'walikelas' | 'siswa_wali' | 'umum';

export interface UserSession {
  role: UserRole;
  name: string;
  emailOrNis: string;
  avatarUrl?: string;
  detail?: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession;
  onLoginSuccess: (session: UserSession) => void;
  onLogout: () => void;
  onNavigateTab: (tabId: string) => void;
  userAccounts?: UserAccount[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  onNavigateTab,
  userAccounts = [],
}) => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'guru' | 'walikelas' | 'siswa_wali'>('admin');
  const [usernameInput, setUsernameInput] = useState('admin@smkislamcipasung.sch.id');
  const [passwordInput, setPasswordInput] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Preset demo credentials for quick testing
  const demoAccounts = {
    admin: {
      role: 'admin' as UserRole,
      name: 'Bapak H. Sofyan, S.Kom (Administrator Utama)',
      emailOrNis: 'admin@smkislamcipasung.sch.id',
      pass: 'admin123',
      detail: 'Akses Penuh Panel Kontrol Admin, Verifikasi PPDB, Validasi SPP, & Kelola Sistem',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      targetTab: 'admin',
    },
    guru: {
      role: 'guru' as UserRole,
      name: 'Ibu Hj. Maryam, M.Pd (Guru Pengajar TJKT)',
      emailOrNis: 'guru@smkislamcipasung.sch.id',
      pass: 'guru123',
      detail: 'Akses Input Nilai Mata Pelajaran, Presensi Mengajar, & Agenda Guru',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      targetTab: 'portal',
    },
    walikelas: {
      role: 'walikelas' as UserRole,
      name: 'Bapak Drs. M. Ramdhan, M.Ag (Wali Kelas XI TJKT 1)',
      emailOrNis: 'walikelas@smkislamcipasung.sch.id',
      pass: 'wali123',
      detail: 'Akses Monitoring Rekap Presensi Kelas Binaan, Verifikasi E-Rapor Kelas, & Laporan WA Ortu',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      targetTab: 'portal',
    },
    siswa_wali: {
      role: 'siswa_wali' as UserRole,
      name: 'Muhammad Rizky Pratama (Siswa XI TJKT 1)',
      emailOrNis: '12234051',
      pass: '123456',
      detail: 'Akses Portal Rapor Digital, Historis SPP QRIS, & Notifikasi WA',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      targetTab: 'portal',
    },
  };

  const handleSelectRole = (role: 'admin' | 'guru' | 'walikelas' | 'siswa_wali') => {
    setSelectedRole(role);
    setErrorMsg('');
    setSuccessMsg('');
    const demo = demoAccounts[role];
    setUsernameInput(demo.emailOrNis);
    setPasswordInput(demo.pass);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const inputClean = usernameInput.trim().toLowerCase();
    const passInput = passwordInput.trim();

    // 1. Check in synchronized system userAccounts
    const matchedAccount = userAccounts.find((usr) => {
      const uName = (usr.username || '').toLowerCase();
      const uEmail = (usr.email || '').toLowerCase();
      const uId = (usr.id || '').toLowerCase();
      const matchIdentity = uName === inputClean || uEmail === inputClean || uId === inputClean;
      if (!matchIdentity) return false;

      const expectedPass = usr.password ? usr.password.trim() : (
        usr.role === 'admin' ? 'admin123' :
        usr.role === 'guru' ? 'guru123' :
        usr.role === 'walikelas' ? 'wali123' : '123456'
      );

      return passInput === expectedPass;
    });

    if (matchedAccount) {
      const roleMapped: UserRole = matchedAccount.role === 'siswa' ? 'siswa_wali' : (matchedAccount.role as UserRole);
      const targetTab = roleMapped === 'admin' ? 'admin' : 'portal';

      const newSession: UserSession = {
        role: roleMapped,
        name: matchedAccount.name,
        emailOrNis: matchedAccount.email || matchedAccount.username,
        avatarUrl: roleMapped === 'admin'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
          : roleMapped === 'guru'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
          : roleMapped === 'walikelas'
          ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
          : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
        detail: `Akses Portal ${roleMapped.toUpperCase()} - Username: ${matchedAccount.username}`,
      };

      onLoginSuccess(newSession);
      setSuccessMsg(`Berhasil masuk sebagai ${matchedAccount.name}!`);
      setTimeout(() => {
        onClose();
        onNavigateTab(targetTab);
      }, 900);
      return;
    }

    // 2. Check preset demo accounts
    const demo = demoAccounts[selectedRole];
    if (
      (inputClean === demo.emailOrNis.toLowerCase() || inputClean === demo.role) &&
      passInput === demo.pass
    ) {
      const newSession: UserSession = {
        role: demo.role,
        name: demo.name,
        emailOrNis: demo.emailOrNis,
        avatarUrl: demo.avatarUrl,
        detail: demo.detail,
      };
      onLoginSuccess(newSession);
      setSuccessMsg(`Berhasil masuk sebagai ${demo.name}!`);
      setTimeout(() => {
        onClose();
        onNavigateTab(demo.targetTab);
      }, 900);
      return;
    }

    // 3. Fallback: check if user exists but password mismatch
    const existingUser = userAccounts.find((usr) =>
      (usr.username || '').toLowerCase() === inputClean ||
      (usr.email || '').toLowerCase() === inputClean
    );

    if (existingUser) {
      setErrorMsg(`Kata sandi salah untuk akun "${existingUser.name}"! Silakan periksa kembali password Anda.`);
    } else {
      setErrorMsg(`Akun "${usernameInput}" tidak ditemukan di sistem! Gunakan akun terdaftar dari Admin Panel atau pilih opsi Demo.`);
    }
  };

  const fillDemoCredentials = () => {
    const demo = demoAccounts[selectedRole];
    setUsernameInput(demo.emailOrNis);
    setPasswordInput(demo.pass);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl p-[2px] rounded-3xl my-auto overflow-hidden shadow-2xl shadow-amber-500/20 group"
      >
        {/* Rotating Color Beam Edge Animation */}
        <div className="absolute inset-[-250%] animate-spin-border bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_60%,#f59e0b_75%,#fef08a_88%,#ffffff_100%)] pointer-events-none opacity-90" />

        <div className="relative w-full bg-slate-900 rounded-[22px] p-6 sm:p-8 text-slate-100 overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer z-10 border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <span className="px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Portal Otentikasi Terpadu</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Login Hak Akses Multi-Pengguna
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Pilih jenis akun pengguna untuk mengakses portal &amp; fasilitas khusus SMK Islam Cipasung.
          </p>
        </div>

        {/* Active Session Status if logged in */}
        {currentUser.role !== 'umum' && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-300 font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-black text-emerald-400 tracking-wider">Sesi Aktif Saat Ini</div>
                <div className="text-xs sm:text-sm font-black text-white">{currentUser.name}</div>
                <div className="text-[11px] text-emerald-200 font-semibold">Peran: <strong className="uppercase text-amber-300">{currentUser.role}</strong></div>
              </div>
            </div>
            <button
              onClick={() => {
                onLogout();
                setSuccessMsg('Sesi telah diakhiri. Kembali ke mode umum.');
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-900/90 hover:bg-rose-800 text-rose-100 text-xs font-black transition-colors flex items-center gap-1 cursor-pointer border border-rose-700/80 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar Sesi</span>
            </button>
          </div>
        )}

        {/* 4 Role Selector Tabs (Admin, Guru, Wali Kelas, Murid/Wali) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {/* 1. Admin Sekolah */}
          <button
            type="button"
            onClick={() => handleSelectRole('admin')}
            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
              selectedRole === 'admin'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20 font-black scale-[1.02]'
                : 'bg-slate-950/90 text-slate-200 border-slate-800 hover:border-slate-700 font-bold'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <ShieldCheck className={`w-4 h-4 ${selectedRole === 'admin' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${selectedRole === 'admin' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-200'}`}>
                Akses 1
              </span>
            </div>
            <div>
              <div className="text-xs font-black truncate">Admin Sekolah</div>
              <div className={`text-[10px] font-semibold mt-0.5 truncate ${selectedRole === 'admin' ? 'text-slate-900' : 'text-slate-400'}`}>
                Pengelola Utama
              </div>
            </div>
          </button>

          {/* 2. Guru Pengajar */}
          <button
            type="button"
            onClick={() => handleSelectRole('guru')}
            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
              selectedRole === 'guru'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20 font-black scale-[1.02]'
                : 'bg-slate-950/90 text-slate-200 border-slate-800 hover:border-slate-700 font-bold'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <BookOpen className={`w-4 h-4 ${selectedRole === 'guru' ? 'text-slate-950' : 'text-sky-300'}`} />
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${selectedRole === 'guru' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-200'}`}>
                Akses 2
              </span>
            </div>
            <div>
              <div className="text-xs font-black truncate">Guru Pengajar</div>
              <div className={`text-[10px] font-semibold mt-0.5 truncate ${selectedRole === 'guru' ? 'text-slate-900' : 'text-slate-400'}`}>
                Pengampu Mapel
              </div>
            </div>
          </button>

          {/* 3. Wali Kelas */}
          <button
            type="button"
            onClick={() => handleSelectRole('walikelas')}
            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
              selectedRole === 'walikelas'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20 font-black scale-[1.02]'
                : 'bg-slate-950/90 text-slate-200 border-slate-800 hover:border-slate-700 font-bold'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <UserCheck className={`w-4 h-4 ${selectedRole === 'walikelas' ? 'text-slate-950' : 'text-emerald-400'}`} />
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${selectedRole === 'walikelas' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-200'}`}>
                Akses 3
              </span>
            </div>
            <div>
              <div className="text-xs font-black truncate">Wali Kelas</div>
              <div className={`text-[10px] font-semibold mt-0.5 truncate ${selectedRole === 'walikelas' ? 'text-slate-900' : 'text-slate-400'}`}>
                Pembina Kelas
              </div>
            </div>
          </button>

          {/* 4. Murid & Wali */}
          <button
            type="button"
            onClick={() => handleSelectRole('siswa_wali')}
            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
              selectedRole === 'siswa_wali'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/20 font-black scale-[1.02]'
                : 'bg-slate-950/90 text-slate-200 border-slate-800 hover:border-slate-700 font-bold'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <GraduationCap className={`w-4 h-4 ${selectedRole === 'siswa_wali' ? 'text-slate-950' : 'text-indigo-400'}`} />
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${selectedRole === 'siswa_wali' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-200'}`}>
                Akses 4
              </span>
            </div>
            <div>
              <div className="text-xs font-black truncate">Murid / Wali</div>
              <div className={`text-[10px] font-semibold mt-0.5 truncate ${selectedRole === 'siswa_wali' ? 'text-slate-900' : 'text-slate-400'}`}>
                Siswa &amp; Ortu
              </div>
            </div>
          </button>
        </div>

        {/* Selected Role Info Description */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 mb-6 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold text-amber-300 uppercase tracking-wide">
              Fasilitas Hak Akses {selectedRole.toUpperCase()}:
            </span>
            <p className="mt-0.5 font-semibold text-slate-200">{demoAccounts[selectedRole].detail}</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-100 mb-1.5 uppercase tracking-wide">
              {selectedRole === 'siswa_wali' ? 'NIS / NISN Siswa' : 'Email Resmi Sekolah'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder={selectedRole === 'siswa_wali' ? 'Masukkan NIS (Contoh: 12234051)' : 'email@smkislamcipasung.sch.id'}
                required
                className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              <KeyRound className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-100 mb-1.5 uppercase tracking-wide">
              Kata Sandi / PIN Keamanan
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Masukkan kata sandi..."
                required
                className="w-full px-4 py-3 pl-10 pr-10 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              <Lock className="w-4 h-4 text-amber-400/80 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-amber-400 transition-colors p-0.5 rounded cursor-pointer"
                title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-amber-400" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>



          {/* Error or Success Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/90 border border-rose-500/60 text-rose-100 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-100 text-xs font-black flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Isi Otomatis Kredensial Demo ({selectedRole.toUpperCase()})</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-xs font-black transition-all hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <LogIn className="w-4 h-4 text-slate-950" />
              <span>Masuk Ke Portal</span>
            </button>
          </div>
        </form>
        </div>
      </motion.div>
    </div>
  );
};
