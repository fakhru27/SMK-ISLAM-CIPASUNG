import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  BookOpen,
  Image as ImageIcon,
  CreditCard,
  Bell,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  School,
  Sparkles,
  Phone,
  Search,
  ChevronDown,
  Layers,
  LogOut,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { LogoYayasan, LogoSmk } from './Logos';
import { UserSession } from './LoginModal';

import { SchoolInfoData } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadNotificationsCount: number;
  toggleAiAssistant: () => void;
  isAiOpen: boolean;
  currentUser: UserSession;
  onOpenLoginModal: () => void;
  onLogout?: () => void;
  schoolInfo?: SchoolInfoData;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unreadNotificationsCount,
  toggleAiAssistant,
  isAiOpen,
  currentUser,
  onOpenLoginModal,
  onLogout,
  schoolInfo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allServiceSubItems = [
    { id: 'ppdb_portal', label: 'Cek Status PPDB', desc: 'Pengumuman & SKL Siswa Baru', icon: Sparkles },
    { id: 'pembayaran', label: 'SPP Digital QRIS', desc: 'Akses Portal Murid & Wali', icon: CreditCard },
    { id: 'portal', label: 'Portal Akademik', desc: 'Nilai Rapor & Presensi', icon: LayoutDashboard },
    { id: 'seo', label: 'Pencarian SEO', desc: 'Statistik Meta Google', icon: Search },
    { id: 'notifikasi', label: 'Pesan Ortu (WA)', desc: 'Broadcast & Notifikasi Admin', icon: Bell, count: unreadNotificationsCount, adminOnly: true },
  ];

  // Filter out admin-only tools (like Pesan Ortu) from general public dropdown view
  const serviceSubItems = allServiceSubItems.filter((sub) => {
    if (sub.adminOnly) {
      return currentUser.role === 'admin';
    }
    return true;
  });

  const primaryNavItems: Array<{
    id: string;
    label: string;
    icon: any;
    isDropdown?: boolean;
    isSpecial?: boolean;
    badge?: string;
  }> = [
    { id: 'beranda', label: 'Beranda', icon: School },
    { id: 'jurusan', label: 'Jurusan', icon: GraduationCap },
    { id: 'fasilitas', label: 'Fasilitas & Lab', icon: Building },
    { id: 'services', label: 'Layanan Digital', icon: Layers, isDropdown: true },
    { id: 'galeri', label: 'Galeri & Foto', icon: ImageIcon },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserRoleClick = () => {
    if (currentUser.role === 'admin') {
      handleNavClick('admin');
    } else if (currentUser.role === 'guru' || currentUser.role === 'walikelas' || currentUser.role === 'siswa_wali') {
      handleNavClick('portal');
    } else {
      onOpenLoginModal();
    }
  };

  const getRoleButtonConfig = () => {
    switch (currentUser.role) {
      case 'admin':
        return {
          label: 'Admin',
          icon: ShieldCheck,
          isActive: activeTab === 'admin',
          colorClass: activeTab === 'admin'
            ? 'bg-amber-400 text-slate-950 border-amber-500 font-black ring-2 ring-amber-300 shadow-md'
            : 'bg-slate-900 text-amber-300 border-amber-400/80 hover:bg-slate-800 shadow-md',
          iconColor: activeTab === 'admin' ? 'text-slate-950' : 'text-amber-400',
        };
      case 'guru':
        return {
          label: 'Guru',
          icon: LayoutDashboard,
          isActive: activeTab === 'portal',
          colorClass: activeTab === 'portal'
            ? 'bg-amber-400 text-slate-950 border-amber-500 font-black ring-2 ring-amber-300 shadow-md'
            : 'bg-slate-900 text-amber-300 border-amber-400/80 hover:bg-slate-800 shadow-md',
          iconColor: activeTab === 'portal' ? 'text-slate-950' : 'text-amber-400',
        };
      case 'walikelas':
        return {
          label: 'Wali Kelas',
          icon: LayoutDashboard,
          isActive: activeTab === 'portal',
          colorClass: activeTab === 'portal'
            ? 'bg-amber-400 text-slate-950 border-amber-500 font-black ring-2 ring-amber-300 shadow-md'
            : 'bg-slate-900 text-amber-300 border-amber-400/80 hover:bg-slate-800 shadow-md',
          iconColor: activeTab === 'portal' ? 'text-slate-950' : 'text-amber-400',
        };
      case 'siswa_wali':
        return {
          label: 'Siswa',
          icon: LayoutDashboard,
          isActive: activeTab === 'portal',
          colorClass: activeTab === 'portal'
            ? 'bg-amber-400 text-slate-950 border-amber-500 font-black ring-2 ring-amber-300 shadow-md'
            : 'bg-slate-900 text-amber-300 border-amber-400/80 hover:bg-slate-800 shadow-md',
          iconColor: activeTab === 'portal' ? 'text-slate-950' : 'text-amber-400',
        };
      default:
        return {
          label: 'Log In',
          icon: Settings,
          isActive: false,
          colorClass: 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 border-amber-300 shadow-md hover:brightness-110 animate-sparkle-shimmer',
          iconColor: 'text-slate-950',
        };
    }
  };

  const roleConfig = getRoleButtonConfig();
  const RoleIcon = roleConfig.icon;

  const isServiceActive = serviceSubItems.some((sub) => sub.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-sm w-full overflow-x-clip">
      {/* Top Banner Bar (Refined Slate & Warm Gold Accent) */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-4 sm:px-8 py-1.5 text-xs text-slate-200 flex flex-wrap justify-between items-center border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-3">
          <LogoSmk size={20} showText={true} lightText={true} logoUrl={schoolInfo?.logoUrl} />
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="flex items-center gap-1.5 font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            PPDB Online 2026/2027 Resmi Dibuka!
          </span>
        </div>
        <div className="flex items-center space-x-3 text-slate-300 font-medium">
          <a href="tel:0265545123" className="hover:text-amber-300 flex items-center gap-1 transition">
            <Phone className="w-3 h-3 text-amber-300" /> (0265) 545123
          </a>
          <span>•</span>
          <a
            href="https://wa.me/6281223456789"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-300 font-bold text-amber-300 transition"
          >
            Humas: 0812-2345-6789
          </a>
        </div>
      </div>

      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logos (Yayasan & SMK) */}
        <div
          onClick={() => handleNavClick('beranda')}
          className="flex items-center gap-3 cursor-pointer group py-1 shrink-0"
        >
          <LogoSmk size={44} showText={true} lightText={false} logoUrl={schoolInfo?.logoUrl} />
        </div>

        {/* Desktop Navigation & Action Bar with Clean Spacing & Zero Overlap */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 shrink-0">
          <nav className="flex items-center gap-1 xl:gap-2">
            {primaryNavItems.map((item) => {
              if (item.isDropdown) {
                return (
                  <div key={item.id} className="relative" ref={dropdownRef}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                      className={`group px-2.5 xl:px-3 py-1.5 rounded-full text-[11px] xl:text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer border whitespace-nowrap shrink-0 ${
                        isServiceActive || servicesDropdownOpen
                          ? 'bg-slate-900 text-amber-300 border-amber-400 shadow-md'
                          : 'text-slate-800 hover:text-amber-900 bg-slate-100/90 hover:bg-amber-50 border-slate-300/80 hover:border-amber-300 shadow-2xs'
                      }`}
                    >
                      <Layers className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ${isServiceActive || servicesDropdownOpen ? 'text-amber-400 animate-bounce' : 'text-amber-600 group-hover:scale-110'}`} />
                      <span>Layanan Digital</span>
                      {unreadNotificationsCount > 0 && (
                        <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                          {unreadNotificationsCount}
                        </span>
                      )}
                      <ChevronDown className={`w-3 h-3 shrink-0 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} />
                    </motion.button>

                    {/* Dropdown Menu Popover */}
                    <AnimatePresence>
                      {servicesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 text-slate-100"
                        >
                          <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-black text-amber-300 uppercase tracking-wider">
                            Modul Portal Terintegrasi
                          </div>
                          <div className="py-1 space-y-1">
                            {serviceSubItems.map((sub) => {
                              const SubIcon = sub.icon;
                              const isSubActive = activeTab === sub.id;
                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => handleNavClick(sub.id)}
                                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-start gap-2.5 cursor-pointer ${
                                    isSubActive
                                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold shadow-sm'
                                      : 'hover:bg-slate-800 text-slate-200'
                                  }`}
                                >
                                  <SubIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSubActive ? 'text-slate-950' : 'text-amber-400'}`} />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="truncate">{sub.label}</span>
                                      {sub.count !== undefined && sub.count > 0 && (
                                        <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shrink-0">
                                          {sub.count}
                                        </span>
                                      )}
                                    </div>
                                    <p className={`text-[10px] font-medium truncate ${isSubActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                      {sub.desc}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleNavClick(item.id)}
                  className={`group px-2.5 xl:px-3 py-1.5 rounded-full text-[11px] xl:text-xs font-extrabold transition-all flex items-center gap-1.5 relative cursor-pointer shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-700'
                      : item.isSpecial
                      ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 hover:brightness-110 border border-amber-400 shadow-2xs font-black'
                      : 'text-slate-800 hover:text-amber-900 bg-slate-100/90 hover:bg-amber-50 border border-slate-300/80 hover:border-amber-300 shadow-2xs'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ${isActive ? 'text-amber-400 animate-bounce' : 'text-slate-700 group-hover:scale-110'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          <div className="h-4 w-px bg-slate-200 mx-0.5 hidden xl:block" />

          {/* Action Buttons Group */}
          <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
            {/* Cipasung AI Assistant Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={toggleAiAssistant}
              className={`px-2.5 xl:px-3 py-1.5 rounded-full text-[11px] xl:text-xs font-black transition-all flex items-center gap-1.5 border cursor-pointer shrink-0 whitespace-nowrap ${
                isAiOpen
                  ? 'bg-slate-900 text-amber-300 border-amber-400 shadow-lg'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-md hover:brightness-110'
              }`}
              title="Tanya Cipasung AI Assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 shrink-0 animate-pulse" />
              <span className="font-black">Cipasung AI</span>
            </motion.button>

            {/* Quick PPDB Direct Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleNavClick('ppdb')}
              className={`px-2.5 xl:px-3 py-1.5 text-[11px] xl:text-xs font-extrabold rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap border ${
                activeTab === 'ppdb'
                  ? 'bg-amber-400 text-slate-950 border-amber-500 font-black ring-2 ring-amber-300'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 hover:brightness-110 border-amber-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>PPDB 2026</span>
            </motion.button>

            {/* Dynamic Role & Logout Section */}
            {currentUser.role !== 'umum' ? (
              <div className="flex items-center rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 border border-amber-300/90 p-0.5 shadow-md shrink-0">
                <button
                  onClick={handleUserRoleClick}
                  className="px-3 py-1 rounded-full text-[11px] xl:text-xs font-black text-slate-950 hover:bg-slate-950/10 flex items-center gap-1.5 cursor-pointer transition-colors"
                  title={`Buka ${roleConfig.label} (${currentUser.name})`}
                >
                  <RoleIcon className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                  <span className="font-black">{roleConfig.label}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                </button>
                <div className="h-3.5 w-px bg-slate-950/20 my-auto" />
                <button
                  onClick={() => {
                    if (onLogout) onLogout();
                    handleNavClick('beranda');
                  }}
                  className="p-1.5 rounded-full text-slate-950 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                  title={`Keluar Sesi (${currentUser.name})`}
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleUserRoleClick}
                className={`px-3 xl:px-3.5 py-1.5 rounded-full text-[11px] xl:text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border shrink-0 whitespace-nowrap ${roleConfig.colorClass}`}
                title="Log In Multi-Pengguna (Admin, Guru, Murid/Wali)"
              >
                <RoleIcon className={`w-3.5 h-3.5 shrink-0 ${roleConfig.iconColor}`} />
                <span className="font-black">{roleConfig.label}</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950 text-white border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 shadow-2xl overflow-hidden"
          >
            <div className="pt-1 pb-1 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleUserRoleClick();
                }}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-between shadow-md transition-all cursor-pointer ${roleConfig.colorClass}`}
              >
                <div className="flex items-center gap-2.5">
                  <RoleIcon className={`w-4 h-4 ${roleConfig.iconColor}`} />
                  <span>
                    {currentUser.role !== 'umum'
                      ? roleConfig.label
                      : 'Log In Multi-Pengguna'}
                  </span>
                </div>
                {currentUser.role !== 'umum' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                    Sesi Aktif
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-900">
                    Masuk →
                  </span>
                )}
              </button>

              {currentUser.role !== 'umum' && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onLogout) onLogout();
                    handleNavClick('beranda');
                  }}
                  className="w-full py-2 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 bg-rose-500/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/40 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Sesi ({currentUser.name})</span>
                </button>
              )}
            </div>

            <div className="text-[10px] font-black text-amber-300 uppercase tracking-wider px-2 py-1">
              Navigasi Utama
            </div>
            {primaryNavItems
              .filter((item) => !item.isDropdown)
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}

            {/* PPDB 2026 for mobile */}
            <button
              onClick={() => handleNavClick('ppdb')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'ppdb'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-slate-950" />
                <span>PPDB 2026 (Pendaftaran Online)</span>
              </div>
              <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                Dibuka
              </span>
            </button>

            <div className="text-[10px] font-black text-amber-300 uppercase tracking-wider px-2 pt-3 pb-1 border-t border-slate-800">
              Layanan Digital & Portal
            </div>
            {serviceSubItems.map((sub) => {
              const SubIcon = sub.icon;
              const isSubActive = activeTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleNavClick(sub.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-colors cursor-pointer ${
                    isSubActive
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-slate-950' : 'text-amber-400'}`} />
                    <span>{sub.label}</span>
                  </div>
                  {sub.count !== undefined && sub.count > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {sub.count}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};



