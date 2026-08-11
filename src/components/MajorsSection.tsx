import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code2,
  Network,
  Wrench,
  Building2,
  Calculator,
  CheckCircle2,
  Briefcase,
  Cpu,
  Users,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { Major, MajorId } from '../types';

interface MajorsSectionProps {
  majors: Major[];
  setActiveTab: (tab: string) => void;
  setSelectedMajorForPpdb: (majorId: MajorId) => void;
}

export const MajorsSection: React.FC<MajorsSectionProps> = ({
  majors,
  setActiveTab,
  setSelectedMajorForPpdb,
}) => {
  const [selectedMajorId, setSelectedMajorId] = useState<MajorId>('tsm');

  const getMajorIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return Wrench;
      case 'Network':
        return Network;
      case 'Building2':
        return Building2;
      case 'Code2':
        return Code2;
      case 'Calculator':
        return Calculator;
      default:
        return Wrench;
    }
  };

  const currentMajor = majors.find((m) => m.id === selectedMajorId) || majors[0];
  const IconComponent = getMajorIcon(currentMajor.iconName);

  const handleApplyMajor = (id: MajorId) => {
    setSelectedMajorForPpdb(id);
    setActiveTab('ppdb');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-100/90 text-slate-800 min-h-screen bg-grid-pattern relative overflow-hidden">
      {/* Background Ambient Blue Glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-extrabold uppercase tracking-wider border border-slate-800 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Kurikulum Merdeka Vokasi 2026
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            3 Konsentrasi Keahlian Unggulan
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Didesain khusus bersama dunia usaha & industri (DUDI) untuk memastikan lulusan SMK Islam Cipasung langsung siap kerja di bengkel resmi Honda, industri IT fiber optic, perkantoran digital, atau melanjutkan studi.
          </p>
        </div>

        {/* Major Selection Tabs */}
        <div className="flex flex-wrap justify-center gap-3">
          {majors.map((major) => {
            const Icon = getMajorIcon(major.iconName);
            const isSelected = major.id === selectedMajorId;
            return (
              <motion.button
                key={major.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMajorId(major.id)}
                className={`px-5 py-3 rounded-full font-extrabold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-md cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 text-amber-300 border-blue-800 shadow-blue-950/20'
                    : 'bg-gradient-to-r from-white via-slate-50 to-blue-50/30 hover:border-blue-300 text-slate-800 border-slate-200/90'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400 animate-pulse' : 'text-blue-800'}`} />
                <span>{major.code}</span>
                <span className="hidden md:inline font-semibold text-xs opacity-90">
                  - {major.name}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Selected Major Detail Card with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMajor.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="bg-gradient-to-br from-white via-slate-50 to-blue-50/60 rounded-3xl border-2 border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden text-slate-800"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Info & Quota */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 p-3.5 flex items-center justify-center text-amber-300 shadow-lg border border-blue-800">
                    <IconComponent className="w-9 h-9" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-blue-900 uppercase tracking-widest bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-full border border-blue-200">
                      Kode Jurusan: {currentMajor.code}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug mt-1">
                      {currentMajor.fullName}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                  {currentMajor.description}
                </p>

                {/* Quota Progress Bar */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-50 via-white to-blue-50/40 border-2 border-slate-200/90 space-y-2.5 shadow-sm">
                  <div className="flex justify-between text-xs sm:text-sm font-bold">
                    <span className="text-slate-800 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-800" /> Kuota Siswa PPDB 2026/2027
                    </span>
                    <span className="text-blue-900 font-extrabold">
                      {currentMajor.registeredCount} / {currentMajor.quota} Pendaftar ({Math.round((currentMajor.registeredCount / currentMajor.quota) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentMajor.registeredCount / currentMajor.quota) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-600 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Sisa kuota: <span className="text-blue-900 font-extrabold bg-amber-300/80 px-2 py-0.5 rounded-full">{currentMajor.quota - currentMajor.registeredCount} kursi</span> lagi. Segera daftarkan diri Anda sebelum pendaftaran ditutup.
                  </p>
                </div>

                {/* Key Skills Checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase text-slate-600 tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-900" /> Kompetensi Utama Yang Dipelajari
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentMajor.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-blue-50/30 border border-slate-200/90 text-xs sm:text-sm text-slate-800 font-bold flex items-center gap-3 shadow-2xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-blue-800 flex-shrink-0" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Opportunities */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold uppercase text-slate-600 tracking-wider flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-900" /> Peluang Kerja & Karier Lulusan
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentMajor.careers.map((career, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 text-amber-300 border border-blue-800 text-xs px-4 py-1.5 rounded-full font-extrabold shadow-2xs"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleApplyMajor(currentMajor.id)}
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-black px-8 py-4 rounded-full shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2.5 text-xs sm:text-sm border border-amber-300 cursor-pointer transition-all"
                  >
                    <BookOpen className="w-4 h-4 text-slate-950" />
                    Pilih {currentMajor.code} & Daftar PPDB Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Right Column: Lab Facilities & Kaprog */}
              <div className="lg:col-span-5 space-y-6">
                {/* Lab Photo Card */}
                <div className="rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/40 border-2 border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-md">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Fasilitas Laboratorium Praktik
                  </h4>
                  <div className="h-52 rounded-2xl overflow-hidden relative shadow-inner">
                    <img
                      src={
                        currentMajor.id === 'pplg'
                          ? 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'
                          : currentMajor.id === 'tkj'
                          ? 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80'
                          : currentMajor.id === 'tbsm'
                          ? 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80'
                          : currentMajor.id === 'mplb'
                          ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80'
                          : 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={currentMajor.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-800 shadow-sm">
                      Lab Standards {currentMajor.code}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-bold">
                    {currentMajor.facilities.map((fac, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-800" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Head of Major */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 text-white border border-blue-800 flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center text-lg border border-amber-300 shadow-md shrink-0">
                    {currentMajor.headOfMajor.split(' ')[0][0]}
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-300 uppercase font-black tracking-wider">
                      Ketua Konsentrasi Keahlian
                    </span>
                    <h5 className="text-sm font-bold text-white">{currentMajor.headOfMajor}</h5>
                    <p className="text-xs text-slate-300 font-semibold">SMK Islam Cipasung</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

