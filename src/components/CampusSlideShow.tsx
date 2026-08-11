import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  Building2,
  GraduationCap,
  Wrench,
  Network,
  Users,
  Moon,
  ArrowRight,
} from 'lucide-react';

interface SlideItem {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  imageUrl: string;
  icon: React.ElementType;
}

const slideData: SlideItem[] = [
  {
    id: 1,
    title: 'Kelulusan & Pengukuhan Alumni SMK Islam Cipasung',
    subtitle: 'Mewujudkan Generasi Santri Vokasi yang Unggul, Siap Kerja, dan Berkarakter Akhlakul Karimah',
    category: 'Acara & Momen Spesial',
    badge: 'Angkatan 2024/2025',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
    icon: GraduationCap,
  },
  {
    id: 2,
    title: 'Gedung Utama & Kompleks Kampus SMK Islam Cipasung',
    subtitle: 'Fasilitas Pembelajaran Modern Berbasis Pesantren Terpadu di Singaparna, Tasikmalaya',
    category: 'Fasilitas Kampus',
    badge: 'Akreditasi A Unggul',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
    icon: Building2,
  },
  {
    id: 3,
    title: 'Bengkel Praktik TBSM Standar Resmi AHASS Honda',
    subtitle: 'Latihan Mekanik Sepeda Motor Modern dengan Peralatan & Standar Pabrikan Honda',
    category: 'Praktik Industri',
    badge: 'Kerjasama AHASS',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
    icon: Wrench,
  },
  {
    id: 4,
    title: 'Laboratorium Fiber Optic & Cisco Academy (TJKT)',
    subtitle: 'Praktik Infrastruktur Jaringan Komputer & Fiber Optic Terakreditasi Mikrotik',
    category: 'Teknologi Jaringan',
    badge: 'Lab Fiber Optic',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80',
    icon: Network,
  },
  {
    id: 5,
    title: 'Laboratorium Perkantoran Digital & Otomasi MPLB',
    subtitle: 'Pendidikan Administrasi Perkantoran Modern dengan Sistem Informasi Terintegrasi',
    category: 'Manajemen Bisnis',
    badge: 'Digital Office',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80',
    icon: Users,
  },
  {
    id: 6,
    title: 'Kompleks Pesantren & Pembinaan Akhlak Santri Vokasi',
    subtitle: 'Mengintegrasikan Ilmu Vokasi Kejuruan dengan Nilai-nilai Pesantren Cipasung',
    category: 'Keagamaan & Karakter',
    badge: 'Pesantren Cipasung',
    imageUrl: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=1600&q=80',
    icon: Moon,
  },
  {
    id: 7,
    title: 'Kegiatan Ekstrakurikuler, Paskibra & Pramuka Vokasi',
    subtitle: 'Membentuk Jiwa Kepemimpinan, Kedisiplinan, Kreativitas, & Solidaritas Siswa',
    category: 'Kesiswaan',
    badge: 'Juara Tasikmalaya',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
    icon: Sparkles,
  },
  {
    id: 8,
    title: 'Upacara Kedisiplinan & Apel Pagi Santri Vokasi',
    subtitle: 'Membangun Karakter Santri Mandiri, Disiplin Tepat Waktu, dan Beretika Kerja',
    category: 'Pembentukan Karakter',
    badge: 'Disiplin Vokasi',
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80',
    icon: Calendar,
  },
];

interface CampusSlideShowProps {
  onOpenPpdb?: () => void;
}

export const CampusSlideShow: React.FC<CampusSlideShowProps> = ({ onOpenPpdb }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slideData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slideData.length);
  };

  const currentSlide = slideData[currentIndex];
  const IconComponent = currentSlide.icon;

  return (
    <div className="bg-slate-950 py-3 sm:py-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative group p-[1.5px] rounded-3xl overflow-hidden shadow-2xl"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* Animated Rotating Border Beam */}
          <div className="absolute inset-[-250%] animate-spin-border bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_60%,#f59e0b_75%,#38bdf8_85%,#fef08a_95%,#ffffff_100%)] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity" />

          {/* Inner Slide Box with Taller Downward Height */}
          <div className="relative z-10 bg-slate-950 rounded-[22px] overflow-hidden h-[450px] sm:h-[580px] md:h-[660px] lg:h-[720px] flex items-end">
            {/* Active Image Slide with Motion */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={currentSlide.imageUrl}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Multi-layered Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/70" />
              </motion.div>
            </AnimatePresence>

            {/* Left Navigation Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-2xl bg-slate-950/70 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 backdrop-blur-md transition duration-300 shadow-xl cursor-pointer group/btn"
              aria-label="Slide Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover/btn:-translate-x-0.5" />
            </button>

            {/* Right Navigation Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-2xl bg-slate-950/70 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 backdrop-blur-md transition duration-300 shadow-xl cursor-pointer group/btn"
              aria-label="Slide Berikutnya"
            >
              <ChevronRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-0.5" />
            </button>

            {/* Bottom Caption Container */}
            <div className="relative z-10 w-full p-4 sm:p-5 md:p-6 space-y-2 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md">
                  <IconComponent className="w-3.5 h-3.5 text-slate-950" />
                  {currentSlide.badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900/90 text-amber-300 text-[10px] sm:text-xs font-bold border border-amber-500/30 backdrop-blur-md shadow-sm">
                  {currentSlide.category}
                </span>
              </div>

              <motion.div
                key={`text-${currentSlide.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-1 max-w-3xl"
              >
                <h3 className="text-base sm:text-xl md:text-2xl font-black text-white leading-tight drop-shadow-md">
                  {currentSlide.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 font-medium drop-shadow-sm leading-relaxed line-clamp-2">
                  {currentSlide.subtitle}
                </p>
              </motion.div>

              {/* Bottom Control Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80">
                {/* Dots Navigation */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {slideData.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === currentIndex
                          ? 'w-6 sm:w-8 bg-amber-400 shadow-md'
                          : 'w-2 sm:w-2.5 bg-slate-700/80 hover:bg-slate-500'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* PPDB Button */}
                {onOpenPpdb && (
                  <button
                    onClick={onOpenPpdb}
                    className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 hover:from-amber-300 hover:to-amber-500 px-3.5 py-1.5 rounded-full text-xs font-black transition flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                  >
                    <span>Info PPDB 2026/2027</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
