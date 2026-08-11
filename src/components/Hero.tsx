import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Network,
  Building2,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Users,
  Award,
  Building,
  CheckCircle2,
  CreditCard,
  Bell,
  Play,
  X,
  ShieldCheck,
  Zap,
  Star,
  Laptop,
  ChevronRight,
  Compass,
  Globe,
  Lock,
  Calendar,
  Moon,
  MapPin,
  Clock,
  ChevronLeft,
  School,
  Quote,
  Briefcase,
  Image as ImageIcon,
} from 'lucide-react';
import { LogoYayasan, LogoSmk } from './Logos';

import { UserSession } from './LoginModal';
import { SchoolInfoData } from '../types';

interface HeroProps {
  setActiveTab: (tab: string) => void;
  openAiAssistant: () => void;
  currentUser?: UserSession;
  onOpenLoginModal?: () => void;
  schoolInfo?: SchoolInfoData;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab, openAiAssistant, currentUser, onOpenLoginModal, schoolInfo }) => {
  const [activeMajorPreview, setActiveMajorPreview] = useState<'depan' | 'tsm' | 'tjkt' | 'mplb'>('depan');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  // Slide Profil Guru & Tenaga Pendidik
  const [currentGuruIndex, setCurrentGuruIndex] = useState(0);

  const teacherList = [
    {
      name: 'Bapak H. Sofyan, S.Kom',
      role: 'Kepala Sekolah & Guru IT / Komputer',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      quote: 'Mewujudkan lulusan vokasi terampil, berkarakter Islami, dan siap bersaing di era industri digital.',
      experience: '20+ Thn Mengabdi',
      badge: 'Kepala Sekolah',
    },
    {
      name: 'Ibu Dra. Hj. Nani Herlina, M.Pd',
      role: 'Waka Kurikulum & Kepala Program MPLB',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      quote: 'Mencetak staf administrasi digital dan manajemen sekretaris yang profesional serta berakhlak mulia.',
      experience: '16 Thn Mengabdi',
      badge: 'Asesor BNSP',
    },
    {
      name: 'Bapak Drs. H. Ahmad Sanusi, M.T',
      role: 'Kaprog TSM & Kepala Lab AHASS Honda',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      quote: 'Keahlian teknik otomotif standar pabrikan Honda untuk mempersiapkan mekanik ahli berstandar industri.',
      experience: '18 Thn Mengabdi',
      badge: 'Instruktur AHASS',
    },
    {
      name: 'Ust. Abdul Hamid, S.Pd.I, M.Ag',
      role: 'Pengasuh Pesantren & Guru PAI',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      quote: 'Menyeimbangkan keilmuan agama pesantren dan teknologi modern untuk keberkahan hidup siswa.',
      experience: '12 Thn Mengabdi',
      badge: 'Pengasuh Santri',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const guruTimer = setInterval(() => {
      setCurrentGuruIndex((prev) => (prev + 1) % teacherList.length);
    }, 5000);
    return () => clearInterval(guruTimer);
  }, [teacherList.length]);

  // Format Jam Real-time
  const timeString = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Format Tanggal Masehi
  const dateString = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Jadwal Sholat Singaparna (Kab. Tasikmalaya - Standar NU Online & Kemenag)
  const prayerTimes = [
    { name: 'Subuh', time: '04:38', minutes: 4 * 60 + 38 },
    { name: 'Terbit', time: '05:54', minutes: 5 * 60 + 54 },
    { name: 'Dzuhur', time: '11:56', minutes: 11 * 60 + 56 },
    { name: 'Ashar', time: '15:18', minutes: 15 * 60 + 18 },
    { name: 'Maghrib', time: '17:53', minutes: 17 * 60 + 53 },
    { name: 'Isya', time: '19:05', minutes: 19 * 60 + 5 },
  ];

  const currentMins = now.getHours() * 60 + now.getMinutes();

  // Menentukan jadwal sholat berikutnya yang aktif
  let nextPrayerIndex = prayerTimes.findIndex((p) => p.minutes > currentMins);
  if (nextPrayerIndex === -1) nextPrayerIndex = 0; // Jika lewat Isya, berikutnya Subuh

  const majorPhotos = {
    depan: {
      title: 'Gedung Utama Kampus SMK Islam Cipasung',
      subtitle: 'Kompleks Pesantren Cipasung, Singaparna - Gedung Pembelajaran Modern, Masjid & Lingkungan Asri',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
      badge: 'Gedung Utama & Kampus SMK',
      icon: School,
      stats: 'Akreditasi A • Berdiri Sejak 1998',
      color: 'from-amber-500 to-emerald-600',
    },
    tsm: {
      title: 'Bengkel Standar AHASS Honda (TSM)',
      subtitle: 'Teknik Sepeda Motor - Otomotif Injeksi PGM-FI & Computer ECU Diagnostic',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1000&auto=format&fit=crop&q=80',
      badge: 'Binaan Resmi AHASS Honda',
      icon: Wrench,
      stats: '100% Peralatan Diagnostic Modern',
      color: 'from-amber-500 to-orange-600',
    },
    tjkt: {
      title: 'Laboratorium Fiber Optic & Cisco (TJKT)',
      subtitle: 'Teknik Jaringan Komputer & Telekomunikasi - Splicing Fiber Optic, Router & Cyber Security',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1000&auto=format&fit=crop&q=80',
      badge: 'Lab Mikrotik & Cisco 1 Gbps',
      icon: Network,
      stats: 'Splicer & Server Rack Ready',
      color: 'from-emerald-500 to-teal-700',
    },
    mplb: {
      title: 'Ruang Simulasi E-Office Perkantoran (MPLB)',
      subtitle: 'Manajemen Perkantoran & Layanan Bisnis - Digital Archiving, Public Speaking & E-Office',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80',
      badge: 'Simulasi Perkantoran Digital',
      icon: Building2,
      stats: 'Cloud Archiving & Typing 10 Jari',
      color: 'from-blue-600 to-indigo-700',
    },
  };

  const currentPhoto = majorPhotos[activeMajorPreview];

  return (
    <div className="relative overflow-hidden bg-slate-100/90 text-slate-800 pt-4 pb-12 lg:pb-16 bg-grid-pattern">
      {/* Background Animated Glow Spheres & Ambient Grid Overlays */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 z-10">
        
        {/* Hero Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Brand, Value Proposition & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 group relative p-[2px] bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-400 rounded-3xl shadow-2xl flex flex-col justify-between"
          >
            <div className="relative z-10 w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-[22px] p-5 sm:p-8 lg:p-9 border border-slate-800 flex flex-col justify-between space-y-6 overflow-hidden text-white">
              {/* Ambient background glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Top Logo Duo Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 relative z-10">
                <LogoSmk size={36} showText={true} lightText={true} logoUrl={schoolInfo?.logoUrl} />
                
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-xs font-black border border-amber-300 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                    Akreditasi A Unggul
                  </span>
                </div>
              </div>

              {/* Main Title & Description */}
              <div className="space-y-4 relative z-10">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight">
                  Mencetak Generasi <br />
                  <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">
                    Vokasi Unggul & Berakhlak
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium max-w-2xl">
                  Selamat datang di portal resmi <strong className="text-white">SMK Islam Cipasung Singaparna</strong>. Pendidikan kejuruan berbasis pesantren terpadu dengan 3 Konsentrasi Keahlian Industri (<strong className="text-amber-300">TSM, TJKT, MPLB</strong>), dilengkapi sistem presensi WhatsApp & pembayaran SPP digital.
                </p>
              </div>

              {/* Interactive Major Selection Selector Chips */}
              <div className="space-y-2 pt-1 relative z-10">
                <p className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-300 shrink-0" /> Pilih 3 Konsentrasi Keahlian Utama:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'tsm', label: 'TSM', name: 'Sepeda Motor AHASS', icon: Wrench },
                    { id: 'tjkt', label: 'TJKT', name: 'Jaringan & Fiber Optic', icon: Network },
                    { id: 'mplb', label: 'MPLB', name: 'Perkantoran Digital', icon: Building2 },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isActive = activeMajorPreview === m.id;
                    return (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={m.id}
                        onClick={() => setActiveMajorPreview(m.id as any)}
                        className={`p-2 sm:p-3 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer min-w-0 ${
                          isActive
                            ? 'border-amber-400 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black shadow-lg'
                            : 'border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className={`font-extrabold text-xs sm:text-sm ${isActive ? 'text-slate-950' : 'text-white'}`}>{m.label}</span>
                          <div className={`p-1 sm:p-1.5 rounded-xl shrink-0 ${isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-amber-300'}`}>
                            <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </div>
                        </div>
                        <span className={`text-[10px] sm:text-[11px] font-semibold mt-1 truncate block ${isActive ? 'text-slate-900' : 'text-slate-300'}`}>{m.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* CTA Buttons - Responsive & Aligned for all devices */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 pt-2 relative z-10">
                {/* 1. Daftar PPDB Online 2026 */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('ppdb')}
                  className="px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto shadow-lg shadow-amber-500/20 border border-amber-300"
                >
                  <BookOpen className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>Daftar PPDB Online 2026</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </motion.button>

                {/* 2. Detail 3 Jurusan */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('jurusan')}
                  className="px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer flex-1 sm:flex-initial shadow-md border border-amber-300"
                >
                  <GraduationCap className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>Detail 3 Jurusan</span>
                </motion.button>

                {/* 3. Bursa Kerja BKK */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveTab('jurusan')}
                  className="px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer flex-1 sm:flex-initial shadow-md border border-amber-300"
                >
                  <Briefcase className="w-4 h-4 text-slate-950 shrink-0" />
                  <span>Bursa Kerja (BKK)</span>
                </motion.button>
              </div>

              {/* Quick Guarantees / Features */}
              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-200 font-bold relative z-10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Kurikulum Merdeka DUDI</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Bengkel Resmi AHASS</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Beasiswa Santri Tahfidz</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Gedung Utama Sekolah, Jadwal Sholat, Profil Guru & Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-4 justify-between"
          >
            {/* 1. JADWAL SHOLAT & KALENDER HIJRIAH WIDGET */}
            <div className="group relative p-[2px] bg-gradient-to-br from-amber-400 via-emerald-400 to-amber-500 rounded-3xl shadow-xl transition-all duration-300">
              <div className="relative z-10 bg-slate-900/95 backdrop-blur-md p-4 sm:p-5 rounded-[22px] border border-amber-500/40 text-white space-y-3">
                {/* Header & Hijri Date + Real-time Clock */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 font-black shadow-md">
                      <Moon className="w-4 h-4 shrink-0 fill-slate-950" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white leading-tight flex items-center gap-2">
                        <span>Jadwal Sholat & Kalender Islam</span>
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-amber-300 font-bold flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>9 Safar 1448 H • {dateString}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-black text-amber-300 bg-slate-950 px-2.5 py-1 rounded-full border border-amber-400/40 shadow-inner font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                      <span>{timeString} WIB</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-[9px] font-bold text-slate-400">
                      <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                      <span>Singaparna, Tasikmalaya</span>
                    </div>
                  </div>
                </div>

                {/* Prayer Times Grid with Dynamic Active/Next Prayer Highlight */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 text-center">
                  {prayerTimes.map((p, idx) => {
                    const isNext = idx === nextPrayerIndex;
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center ${
                          isNext
                            ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 text-slate-950 border-amber-300 font-black shadow-md scale-105 ring-2 ring-amber-300/50'
                            : 'bg-slate-950/80 text-slate-200 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className={`text-[9px] sm:text-[10px] uppercase font-extrabold ${isNext ? 'text-slate-950' : 'text-slate-400'}`}>
                          {p.name}
                        </span>
                        <span className={`text-xs sm:text-sm font-black mt-0.5 ${isNext ? 'text-slate-950' : 'text-amber-300'}`}>
                          {p.time}
                        </span>
                        {isNext && (
                          <span className="mt-0.5 text-[8px] font-black bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded-full shadow-2xs">
                            Berikutnya
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Subtext info & Sync Status with NU Online / Kemenag */}
                <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block shrink-0" />
                    <span>Sinkron NU Online & Kemenag Kab. Tasikmalaya</span>
                  </span>
                  <span className="text-amber-300/90 font-bold">
                    Singaparna (GMT+7)
                  </span>
                </div>
              </div>
            </div>

            {/* 2. SLIDE PROFIL GURU & TENAGA PENDIDIK */}
            <div className="group relative p-[2px] bg-gradient-to-br from-amber-400 via-blue-500 to-amber-500 rounded-3xl shadow-xl transition-all duration-300">
              <div className="relative z-10 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-3.5 sm:p-4 rounded-[22px] border border-blue-800/80 text-white space-y-2.5">
                {/* Header with Nav Controls */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-amber-400 text-slate-950 font-black shadow-md">
                      <Users className="w-4 h-4 shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white leading-tight">Profil Guru & Pendidik</h4>
                      <p className="text-[10px] text-amber-300 font-bold">SMK Islam Cipasung Singaparna</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentGuruIndex((prev) => (prev === 0 ? teacherList.length - 1 : prev - 1))}
                      className="p-1 rounded-full bg-slate-950/80 border border-slate-800 text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition cursor-pointer"
                      title="Guru Sebelumnya"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-extrabold text-slate-400 font-mono px-1">
                      {currentGuruIndex + 1}/{teacherList.length}
                    </span>
                    <button
                      onClick={() => setCurrentGuruIndex((prev) => (prev + 1) % teacherList.length)}
                      className="p-1 rounded-full bg-slate-950/80 border border-slate-800 text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition cursor-pointer"
                      title="Guru Berikutnya"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Teacher Active Slide Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentGuruIndex}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800/80"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={teacherList[currentGuruIndex].photo}
                        alt={teacherList[currentGuruIndex].name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border-2 border-amber-400 shadow-md"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[8px] font-black px-1 rounded-full border border-slate-950 shrink-0">
                        {teacherList[currentGuruIndex].badge}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="text-xs font-black text-white truncate">
                          {teacherList[currentGuruIndex].name}
                        </h5>
                        <span className="text-[9px] font-bold text-amber-300/90 bg-slate-900 px-1.5 py-0.2 rounded-full border border-slate-800 shrink-0">
                          {teacherList[currentGuruIndex].experience}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-amber-400/90 truncate">
                        {teacherList[currentGuruIndex].role}
                      </p>
                      <p className="text-[10px] text-slate-300 italic line-clamp-1 leading-tight">
                        "{teacherList[currentGuruIndex].quote}"
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Dots Indicator & Link to Academic Portal */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-1.5">
                    {teacherList.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentGuruIndex(i)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          i === currentGuruIndex ? 'w-4 bg-amber-400' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setActiveTab('akademik')}
                    className="text-[10px] font-black text-amber-300 hover:text-white flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>Lihat Semua Guru</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            {/* 3. Interactive Image Showcase Card with Motion */}
            <div className="group relative p-[2px] bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 rounded-3xl shadow-xl transition-all duration-300">
              <div className="relative z-10 rounded-[22px] overflow-hidden bg-slate-900 border border-slate-700/80 h-64 sm:h-72 lg:h-[300px] flex flex-col justify-between p-4">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeMajorPreview}
                    src={currentPhoto.image}
                    alt={currentPhoto.title}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                  />
                </AnimatePresence>

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />

                {/* Top Bar inside Showcase Image: Badge & Tabs */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/60 shadow-lg flex items-center gap-1.5 text-[11px] font-extrabold text-amber-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
                    <span>{currentPhoto.badge}</span>
                  </motion.div>

                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-xs font-black border border-amber-300 cursor-pointer hover:scale-105 transition-transform"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Profil Video</span>
                  </button>
                </div>

                {/* Bottom Overlay with Category Switcher Tabs */}
                <div className="relative z-10 space-y-2 text-white pt-6">
                  {/* Category Switcher Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { id: 'depan', label: 'Gedung Utama' },
                      { id: 'tsm', label: 'TSM Honda' },
                      { id: 'tjkt', label: 'TJKT Cisco' },
                      { id: 'mplb', label: 'MPLB Office' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveMajorPreview(tab.id as any)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black transition cursor-pointer shrink-0 ${
                          activeMajorPreview === tab.id
                            ? 'bg-amber-400 text-slate-950 shadow-md ring-1 ring-amber-300'
                            : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1 bg-slate-950/90 px-2 py-0.5 rounded-full border border-slate-800">
                        <Zap className="w-3 h-3 text-amber-300" /> {currentPhoto.stats}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                      {currentPhoto.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-medium">
                      {currentPhoto.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Key Interactive Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-2">
          {[
            { value: schoolInfo?.stats?.totalStudents || '1,240+', label: 'Siswa Aktif Belajar', icon: Users },
            { value: schoolInfo?.stats?.majorsCount || '3 Jurusan', label: schoolInfo?.stats?.majorsSubtext || 'TSM • TJKT • MPLB', icon: GraduationCap },
            { value: schoolInfo?.stats?.employmentRate || '98%', label: 'Terserap Kerja / Kuliah', icon: Award },
            { value: schoolInfo?.stats?.partnerCompanies || '45+', label: 'Mitra Industri MoU', icon: Building },
          ].map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative p-[2px] bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-400 rounded-2xl sm:rounded-3xl shadow-xl transition-all duration-300 min-w-0"
              >
                <div className="relative z-10 p-3 sm:p-5 rounded-[14px] sm:rounded-[22px] bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-500 flex items-center gap-2.5 sm:gap-4 text-white min-w-0">
                  <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-950 text-amber-300 border border-slate-900 shrink-0 shadow-md">
                    <StatIcon className="w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="text-base sm:text-xl md:text-2xl font-black text-white leading-tight truncate">
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-xs font-extrabold text-amber-50 leading-tight block break-words mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Shortcut Interactive Grid - Revamped Akses Layanan Digital Utama */}
        <div className="group relative p-[3px] bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-400 rounded-[32px] shadow-2xl transition-all">
          {/* Main Soft Elegant Gold/Slate Outer Backdrop ("PUTIH KOTAK") */}
          <div className="relative z-10 bg-gradient-to-br from-amber-50/90 via-slate-50 to-amber-100/70 rounded-[28px] p-5 sm:p-8 lg:p-10 text-slate-950 space-y-8 overflow-hidden shadow-md border border-amber-200/50">
            {/* Ambient Soft Glow Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-300/60 pb-6 relative z-10">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-4 py-1.5 rounded-full bg-slate-950 text-amber-300 text-xs font-black shadow-md flex items-center gap-1.5 border border-slate-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse-sparkle" />
                    Portal Layanan Terpadu 24/7
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/90 text-emerald-300 text-xs font-black border border-slate-900 shadow-2xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 animate-ping" />
                    Sistem Terintegrasi Realtime
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                  Akses Layanan Digital Utama
                </h2>
                <p className="text-sm sm:text-base text-slate-800 max-w-3xl font-extrabold leading-relaxed">
                  Pilih modul layanan sistem informasi SMK Islam Cipasung di bawah ini untuk mengakses pendaftaran PPDB Online, pembayaran SPP QRIS, portal transkrip akademik, notifikasi WhatsApp wali murid, serta panel administrasi sekolah.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-black text-amber-300 bg-slate-950 px-4 py-2.5 rounded-full border border-slate-900 shadow-md flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-300" /> Akses Instan Cepat
                </span>
              </div>
            </div>

            {/* Service Cards Separated into Row 1 (Public) & Row 2 (Restricted Access) */}
            <div className="space-y-6 relative z-10">
              {/* Row 1: Layanan Publik & Akses Umum */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: 'ppdb',
                    title: 'PPDB Online 2026/2027',
                    subtitle: 'Formulir pendaftaran calon siswa baru, cek status seleksi kelulusan, dan unduh kartu pendaftaran resmi.',
                    badge: 'UMUM • PPDB OPEN',
                    badgeColor: 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-black border-2 border-amber-300 shadow-lg',
                    icon: BookOpen,
                    features: ['Form 3 Menit', 'Cek Status Seleksi', 'Kartu Ujian PDF'],
                    isPublic: true,
                  },
                  {
                    id: 'jurusan',
                    title: 'Program Studi Keahlian',
                    subtitle: 'Informasi konsentrasi keahlian unggulan (TSM Honda, TJKT Cisco, MPLB Perkantoran Modern).',
                    badge: 'UMUM • JURUSAN',
                    badgeColor: 'bg-gradient-to-r from-orange-400 via-amber-400 to-amber-500 text-slate-950 font-black border-2 border-orange-300 shadow-lg',
                    icon: GraduationCap,
                    features: ['Kurikulum Industri', 'Lab Praktik Standar', 'Peluang Kerja DUDI'],
                    isPublic: true,
                  },
                  {
                    id: 'galeri',
                    title: 'Bursa Kerja & Magang (BKK)',
                    subtitle: 'Penyaluran kerja alumni ke 45+ mitra industri nasional (AHASS, Cisco, Telkom), magang PKL, serta galeri kegiatan santri.',
                    badge: 'UMUM • BKK & MAGANG DUDI',
                    badgeColor: 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 font-black border-2 border-emerald-300 shadow-lg',
                    icon: Briefcase,
                    features: ['Penyaluran Kerja 98%', 'Magang PKL Industri', 'Sertifikasi BNSP'],
                    isPublic: true,
                  },
                ].map((service) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={service.id}
                      whileHover={{ y: -6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(service.id)}
                      className="group relative p-[2px] bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-400 rounded-[24px] shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      <div className="relative z-10 w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-[22px] p-4 sm:p-6 lg:p-7 flex flex-col justify-between text-white border border-slate-800/90 group-hover:border-amber-400/80 transition-colors">
                        <div className="space-y-3 sm:space-y-4">
                          {/* Card Top: Icon & Bold Metallic Sharp Badge */}
                          <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center border-2 border-amber-300 shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0">
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <span className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md border-2 flex items-center gap-1.5 shrink-0 whitespace-nowrap max-w-full overflow-hidden text-ellipsis ${service.badgeColor}`}>
                              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-slate-950" />
                              <span>{service.badge}</span>
                            </span>
                          </div>

                          {/* Card Main Typography */}
                          <div className="pt-1">
                            <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                              {service.title}
                            </h3>
                            <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed mt-1.5">
                              {service.subtitle}
                            </p>
                          </div>

                          {/* Feature Pills */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {service.features.map((feat, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-extrabold bg-slate-900/90 text-amber-300 border border-slate-800 transition-colors flex items-center gap-1 sm:gap-1.5 shadow-2xs"
                              >
                                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Bottom CTA Link */}
                        <div className="pt-4 mt-4 sm:pt-5 sm:mt-5 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-black text-amber-300 group-hover:text-amber-200 flex items-center gap-1.5">
                            <span>Buka Layanan Portal</span>
                          </span>
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center transition-all duration-300 shadow-md border border-amber-300">
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Row 2: Layanan Terbatas (Akses Khusus Login) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: 'pembayaran',
                    title: 'Pembayaran SPP Digital',
                    subtitle: 'Cek rincian tagihan bulanan SPP, pembayaran otomatis via QRIS / VA Bank, serta unduh kuitansi resmi lunas.',
                    badge: 'AKSES MURID / WALI',
                    badgeColor: 'bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 text-slate-950 font-black border-2 border-emerald-300 shadow-lg',
                    icon: CreditCard,
                    features: ['Scan QRIS Instant', 'Verifikasi Otomatis', 'Kuitansi Digital'],
                    protected: true,
                  },
                  {
                    id: 'portal',
                    title: 'Portal Nilai & Akademik',
                    subtitle: 'Transkrip nilai Rapor digital, statistik KHS per semester, serta rekapitulasi presensi harian siswa.',
                    badge: 'AKSES MURID / WALI',
                    badgeColor: 'bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400 text-slate-950 font-black border-2 border-sky-300 shadow-lg',
                    icon: Laptop,
                    features: ['Transkrip Nilai', 'Rangking Paralel', 'Grafik Kehadiran'],
                    protected: true,
                  },
                  {
                    id: 'admin',
                    title: 'Panel Admin & Pengelola',
                    subtitle: 'Modul khusus verifikasi pendaftar PPDB, manajemen tagihan SPP, input nilai guru, serta audit pembayaran.',
                    badge: 'KHUSUS ADMIN SEKOLAH',
                    badgeColor: 'bg-gradient-to-r from-fuchsia-400 via-purple-400 to-pink-400 text-slate-950 font-black border-2 border-fuchsia-300 shadow-lg',
                    icon: ShieldCheck,
                    features: ['Verifikasi Berkas', 'Export Excel Data', 'Audit Pembayaran'],
                    adminOnly: true,
                  },
                ].map((service) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={service.id}
                      whileHover={{ y: -6, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(service.id)}
                      className="group relative p-[2px] bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-400 rounded-[24px] shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      <div className="relative z-10 w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-[22px] p-4 sm:p-6 lg:p-7 flex flex-col justify-between text-white border border-slate-800/90 group-hover:border-amber-400/80 transition-colors">
                        <div className="space-y-3 sm:space-y-4">
                          {/* Card Top: Icon & Bold Metallic Sharp Badge */}
                          <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center border-2 border-amber-300 shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0">
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <span className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md border-2 flex items-center gap-1.5 shrink-0 whitespace-nowrap max-w-full overflow-hidden text-ellipsis ${service.badgeColor}`}>
                              <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-slate-950" />
                              <span>{service.badge}</span>
                            </span>
                          </div>

                          {/* Card Main Typography */}
                          <div className="pt-1">
                            <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                              {service.title}
                            </h3>
                            <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed mt-1.5">
                              {service.subtitle}
                            </p>
                          </div>

                          {/* Feature Pills */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {service.features.map((feat, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-extrabold bg-slate-900/90 text-amber-300 border border-slate-800 transition-colors flex items-center gap-1 sm:gap-1.5 shadow-2xs"
                              >
                                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                                {feat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Bottom CTA Link */}
                        <div className="pt-4 mt-4 sm:pt-5 sm:mt-5 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-black text-amber-300 group-hover:text-amber-200 flex items-center gap-1.5">
                            <span>Buka Layanan Portal</span>
                          </span>
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center transition-all duration-300 shadow-md border border-amber-300">
                            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Video Modal Preview */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200"
            >
              <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 fill-white text-amber-400" />
                  <span className="font-extrabold text-sm">Profil Video & Fasilitas SMK Islam Cipasung</span>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-1 rounded-full hover:bg-blue-800 text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-slate-800">
                <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center border border-slate-200 shadow-inner">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                    <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/50 animate-bounce">
                      <Play className="w-8 h-8 fill-slate-950 ml-1" />
                    </div>
                    <h4 className="font-extrabold text-base sm:text-lg">
                      Video Tur Kampus & Bengkel Praktik 3 Jurusan
                    </h4>
                    <p className="text-xs text-slate-300 max-w-md">
                      Saksikan suasana belajar vokasi industri berbasis pesantren di SMK Islam Cipasung Singaparna Tasikmalaya.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setIsVideoModalOpen(false)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-6 py-2.5 rounded-full text-xs transition cursor-pointer"
                  >
                    Tutup Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

