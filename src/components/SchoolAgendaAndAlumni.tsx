import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Star,
  Quote,
  Briefcase,
  Users,
  ChevronRight,
  Sparkles,
  Building2,
  PhoneCall,
  CheckCircle2,
  Award,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { SchoolEvent, AlumniTestimonial, BkkJobItem } from '../types';

interface SchoolAgendaAndAlumniProps {
  events: SchoolEvent[];
  testimonials: AlumniTestimonial[];
  bkkJobs: BkkJobItem[];
  onOpenPpdb?: () => void;
}

export const SchoolAgendaAndAlumni: React.FC<SchoolAgendaAndAlumniProps> = ({
  events,
  testimonials,
  bkkJobs,
  onOpenPpdb,
}) => {
  const [activeTab, setActiveTab] = useState<'agenda' | 'alumni' | 'bkk'>('agenda');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');

  // Filter events by category
  const filteredEvents = categoryFilter === 'Semua'
    ? events
    : events.filter((e) => e.category === categoryFilter);

  return (
    <section className="py-16 sm:py-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Radial Glow Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-emerald-500/5 to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black tracking-wide uppercase flex items-center gap-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Pusat Informasi &amp; Karir Cipasung</span>
          </span>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl">
            Agenda Kegiatan Sekolah, Testimoni Alumni &amp; Bursa Kerja (BKK)
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-medium">
            Akses jadwal kegiatan akademik terdekat, berita sukses kelulusan alumni, serta informasi lowongan magang &amp; penyaluran kerja mitra industri.
          </p>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('agenda')}
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'agenda'
                  ? 'bg-amber-400 text-slate-950 shadow-lg border-2 border-amber-300 scale-105'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwal Agenda Kegiatan ({events.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('alumni')}
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'alumni'
                  ? 'bg-amber-400 text-slate-950 shadow-lg border-2 border-amber-300 scale-105'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Kisah Sukses Alumni ({testimonials.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bkk')}
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'bkk'
                  ? 'bg-amber-400 text-slate-950 shadow-lg border-2 border-amber-300 scale-105'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Bursa Kerja BKK ({bkkJobs.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: JADWAL & AGENDA KEGIATAN SEKOLAH */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                <Filter className="w-4 h-4" />
                <span>Filter Kategori Agenda:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {['Semua', 'Akademik', 'Keagamaan', 'Ujian', 'PKL / BKK', 'Kesiswaan'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Event List Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => (
                <motion.div
                  key={evt.id}
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 rounded-3xl p-6 border border-slate-800/90 hover:border-amber-400/60 shadow-xl flex flex-col justify-between relative overflow-hidden group transition"
                >
                  {/* Top Status & Category Badge */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                        <Tag className="w-3 h-3 text-amber-400" />
                        <span>{evt.category}</span>
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          evt.status === 'Berlangsung'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                            : evt.status === 'Mendatang'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        ● {evt.status}
                      </span>
                    </div>

                    {/* Event Title */}
                    <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {evt.title}
                    </h3>

                    {/* Event Details Box */}
                    <div className="space-y-2 py-3 px-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs">
                      <div className="flex items-center gap-2 text-slate-200 font-bold">
                        <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 font-medium">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 font-medium truncate">
                        <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {evt.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>Penyelenggara: {evt.organizer}</span>
                    {evt.isImportant && (
                      <span className="text-amber-400 font-black flex items-center gap-1">
                        ★ Agenda Penting
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: TESTIMONI ALUMNI & KISAH SUKSES */}
        {activeTab === 'alumni' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((alm) => (
              <motion.div
                key={alm.id}
                whileHover={{ y: -4 }}
                className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800/90 hover:border-amber-400/60 shadow-xl relative overflow-hidden flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Rating & Quote Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(alm.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-amber-400/20 group-hover:text-amber-400/40 transition-colors" />
                  </div>

                  {/* Quote text */}
                  <p className="text-sm sm:text-base italic text-slate-200 font-medium leading-relaxed">
                    "{alm.quote}"
                  </p>
                </div>

                {/* Alumni Info Row */}
                <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center gap-4">
                  <img
                    src={alm.photoUrl}
                    alt={alm.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-base font-black text-white group-hover:text-amber-300 transition-colors truncate">
                      {alm.name}
                    </h4>
                    <p className="text-xs text-amber-300 font-extrabold truncate">
                      {alm.currentRole}
                    </p>
                    <p className="text-xs text-slate-400 font-medium truncate">
                      {alm.companyOrCampus} • <span className="text-slate-300">{alm.graduationYear} ({alm.majorName})</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* TAB 3: BURSA KERJA KHUSUS (BKK) */}
        {activeTab === 'bkk' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {bkkJobs.map((job) => (
                <motion.div
                  key={job.id}
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 rounded-3xl p-6 border border-slate-800 hover:border-amber-400/60 shadow-xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {job.jobType}
                      </span>
                      <span className="text-xs font-bold text-amber-300">
                        Batas: {job.deadline}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-white">{job.title}</h3>

                    <div className="space-y-1.5 text-xs text-slate-300 font-medium">
                      <div className="flex items-center gap-2 text-amber-300 font-bold">
                        <Building2 className="w-4 h-4 shrink-0" />
                        <span>{job.companyName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{job.majorRequirement}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <a
                      href={`https://wa.me/${job.contactPhone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 hover:bg-amber-300 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5" /> Lamar via BKK WA
                    </a>
                    {job.salaryRange && (
                      <span className="text-[11px] font-mono font-bold text-slate-300">
                        {job.salaryRange}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
