import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
  Award,
  BookOpen,
  Quote,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  Phone,
  Mail,
  Building2,
} from 'lucide-react';

import { Teacher } from '../types';
import { INITIAL_TEACHERS } from '../data/mockData';

interface TeacherSlideSectionProps {
  onOpenConsultation?: () => void;
  teachers?: Teacher[];
}

export const TeacherSlideSection: React.FC<TeacherSlideSectionProps> = ({ teachers = INITIAL_TEACHERS }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<'semua' | 'pimpinan' | 'kaprog' | 'guru' | 'pesantren'>('semua');
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const listToUse = teachers && teachers.length > 0 ? teachers : INITIAL_TEACHERS;

  const filteredTeachers = selectedFilter === 'semua'
    ? listToUse
    : listToUse.filter((t) => t.category === selectedFilter);

  // Auto-advance every 4.5 seconds
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredTeachers.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlay, filteredTeachers.length, currentIndex]);

  // Reset index on filter change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedFilter]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? filteredTeachers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredTeachers.length);
  };

  const activeTeacher = filteredTeachers[currentIndex] || listToUse[0];

  return (
    <section className="py-12 sm:py-16 bg-slate-950 text-slate-100 relative overflow-hidden border-b border-slate-800/80">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8 sm:mb-12">
          <div className="flex items-center gap-2">
            <span className="px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black tracking-wide uppercase flex items-center gap-2 shadow-sm">
              <Users className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Dewan Guru & Tenaga Pendidik</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Slide Otomatis</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight max-w-3xl">
            Profil Guru & Tenaga Pendidik SMK Islam Cipasung
          </h2>
          <p className="text-slate-400 text-xs sm:text-base max-w-2xl font-medium">
            Didukung oleh praktisi kejuruan, akademisi magister, serta pengasuh pesantren yang berdedikasi mencetak generasi santri vokasi handal.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-3">
            {[
              { id: 'semua', label: 'Semua Guru' },
              { id: 'pimpinan', label: 'Pimpinan Sekolah' },
              { id: 'kaprog', label: 'Kepala Program' },
              { id: 'guru', label: 'Guru Kejuruan' },
              { id: 'pesantren', label: 'Pembina Pesantren' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer ${
                  selectedFilter === filter.id
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Slide Card */}
        <div
          className="relative group p-[2px] bg-gradient-to-br from-amber-400 via-sky-400 to-amber-500 rounded-[32px] shadow-2xl"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* Card Inner Grid Content */}
          <div className="relative z-10 bg-slate-900/95 backdrop-blur-xl rounded-[30px] p-6 sm:p-10 border border-slate-800/80 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[460px]">
            
            {/* Left Column: Teacher Photo & Badge */}
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTeacher.id}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="relative group/photo"
                >
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-4 border-amber-400/80 shadow-2xl">
                    <img
                      src={activeTeacher.photo}
                      alt={activeTeacher.name}
                      className="w-full h-full object-cover object-center group-hover/photo:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>

                  {/* Top Badge Floating */}
                  <span className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black shadow-lg border border-slate-950 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>{activeTeacher.badge}</span>
                  </span>

                  {/* Bottom Category Badge */}
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-950 text-amber-300 px-3.5 py-1 rounded-full text-xs font-black border border-amber-500/40 shadow-md whitespace-nowrap">
                    {activeTeacher.categoryLabel}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Counter Indicator */}
              <div className="text-xs font-black text-amber-400/90 font-mono bg-slate-950 px-4 py-1 rounded-full border border-slate-800">
                {currentIndex + 1} / {filteredTeachers.length} Guru & Pendidik
              </div>
            </div>

            {/* Right Column: Teacher Details, Quote, Education & Controls */}
            <div className="lg:col-span-7 space-y-5 text-left flex flex-col justify-between h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTeacher.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {/* Name & Role */}
                  <div>
                    <h3 className="text-xl sm:text-3xl font-black text-white leading-tight">
                      {activeTeacher.name}
                    </h3>
                    <p className="text-sm sm:text-base font-bold text-amber-400 mt-1 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{activeTeacher.role}</span>
                    </p>
                  </div>

                  {/* Quote Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 relative">
                    <Quote className="w-8 h-8 text-amber-400/20 absolute top-2 right-2 pointer-events-none" />
                    <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed relative z-10 font-medium">
                      "{activeTeacher.quote}"
                    </p>
                  </div>

                  {/* Key Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 text-[10px] block font-semibold">Mata Pelajaran / Keahlian</span>
                        <span className="text-white font-bold">{activeTeacher.subject}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 text-[10px] block font-semibold">Pengalaman & Masa Kerja</span>
                        <span className="text-white font-bold">{activeTeacher.experience}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5 sm:col-span-2">
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-slate-400 text-[10px] block font-semibold">Kualifikasi Pendidikan</span>
                        <span className="text-white font-bold">{activeTeacher.education}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Controls & Navigation Buttons */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                {/* Dots Navigation */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {filteredTeachers.map((t, idx) => (
                    <button
                      key={t.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex
                          ? 'w-8 sm:w-10 bg-amber-400 shadow-md'
                          : 'w-2.5 sm:w-3 bg-slate-700/80 hover:bg-slate-500'
                      }`}
                      aria-label={`Guru ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2.5 sm:p-3 rounded-xl bg-slate-950 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border border-slate-800 transition cursor-pointer shadow-md flex items-center gap-1 text-xs font-black"
                    title="Guru Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="p-2.5 sm:p-3 rounded-xl bg-slate-950 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border border-slate-800 transition cursor-pointer shadow-md flex items-center gap-1 text-xs font-black"
                    title="Guru Berikutnya"
                  >
                    <span className="hidden sm:inline">Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
