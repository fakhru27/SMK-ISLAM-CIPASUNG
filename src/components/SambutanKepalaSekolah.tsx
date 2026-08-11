import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Quote,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  School,
  X,
  HeartHandshake,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';

import { SchoolInfoData } from '../types';

interface SambutanProps {
  onOpenPpdb?: () => void;
  onOpenAi?: () => void;
  schoolInfo?: SchoolInfoData;
}

export const SambutanKepalaSekolah: React.FC<SambutanProps> = ({ onOpenPpdb, onOpenAi, schoolInfo }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const principalName = schoolInfo?.principal || 'Drs. H. Ahmad Sanusi, M.Pd.';
  const principalPhoto = schoolInfo?.principalPhoto || '/src/assets/images/kepala_sekolah_smk_1784774272474.jpg';
  const principalMessage = schoolInfo?.principalMessage || 'Puji dan syukur marilah kita panjatkan ke hadirat Allah SWT. Selamat datang di portal resmi informasi & pendaftaran SMK Islam Cipasung. Kami berkomitmen menyelenggarakan pendidikan kejuruan yang tidak hanya melatih keterampilan kerja berstandar DUDI, tetapi juga membentuk karakter Islami berlandaskan nilai-nilai pesantren.';

  return (
    <section className="py-12 sm:py-16 bg-slate-950 text-slate-100 relative overflow-hidden border-t border-slate-800">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header Badge */}
        <div className="flex flex-col items-center text-center space-y-3 mb-10 sm:mb-12">
          <span className="px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black tracking-wide uppercase flex items-center gap-2 shadow-sm">
            <School className="w-3.5 h-3.5 text-amber-400" />
            <span>Pesan & Visi Pimpinan Sekolah</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight max-w-3xl">
            Sambutan Kepala SMK Islam Cipasung
          </h2>
          <p className="text-slate-400 text-xs sm:text-base max-w-2xl font-medium">
            Mewujudkan generasi santri vokasi yang unggul dalam teknologi, siap kerja, dan berkarakter akhlakul karimah.
          </p>
        </div>

        {/* Main Content Box */}
        <div className="relative group p-[2px] bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-400 rounded-[32px] shadow-2xl">
          {/* Inner Content Glass Container */}
          <div className="relative z-10 bg-slate-900/90 backdrop-blur-xl rounded-[30px] p-6 sm:p-8 lg:p-12 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Principal Photo with Gold Badge */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative my-3 sm:my-0">
              <div className="relative w-full max-w-[260px] sm:max-w-xs lg:max-w-sm aspect-[4/5] rounded-[28px] overflow-hidden border-4 border-amber-400/40 shadow-2xl group-hover:border-amber-400 transition-all duration-300">
                <img
                  src={principalPhoto}
                  alt={principalName}
                  className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />

                {/* Bottom Name overlay inside photo */}
                <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 right-2.5 sm:left-4 sm:right-4 text-center z-10 bg-slate-950/70 backdrop-blur-md p-2 sm:p-3 rounded-2xl border border-white/10">
                  <span className="inline-block px-2.5 py-0.5 bg-amber-400 text-slate-950 text-[9px] sm:text-[10px] font-black rounded-full uppercase tracking-wider mb-0.5 shadow-md">
                    Kepala Sekolah
                  </span>
                  <h3 className="text-xs sm:text-base lg:text-lg font-black text-white leading-tight">
                    {principalName}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-amber-200 font-semibold mt-0.5">
                    NPSN. {schoolInfo?.npsn || '20268153'} • {schoolInfo?.accreditation || 'Akreditasi A'}
                  </p>
                </div>
              </div>

              {/* Floating Akreditasi A Badge */}
              <div className="absolute -top-4 -right-1 sm:-right-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 p-2 sm:p-3 rounded-2xl shadow-xl border border-amber-200 flex items-center gap-1.5 sm:gap-2 font-black text-xs z-20">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 shrink-0 animate-bounce" />
                <div className="text-left">
                  <div className="text-[8px] sm:text-[10px] uppercase font-bold text-slate-900 leading-none">Status Resmi</div>
                  <div className="text-[10px] sm:text-xs font-black">Akreditasi A Unggul</div>
                </div>
              </div>
            </div>

            {/* Right Column: Welcoming Speech Summary & Quote */}
            <div className="lg:col-span-7 space-y-6 text-slate-200">
              {/* Quote Header Icon */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300">
                  <Quote className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Assalamu’alaikum Warahmatullahi Wabarakatuh
                  </h3>
                  <p className="text-xs text-amber-400 font-bold">
                    Sambutan Hangat dari Pimpinan Sekolah
                  </p>
                </div>
              </div>

              {/* Speech Body Excerpt */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                <p className="text-slate-200 font-medium italic border-l-4 border-amber-400 pl-4 py-1 bg-amber-400/5 rounded-r-xl">
                  "{principalMessage}"
                </p>
                <p>
                  Di era transformasi digital dan pesatnya perkembangan industri 4.0, SMK Islam Cipasung terus berinovasi melalui <strong className="text-amber-300">3 Konsentrasi Keahlian Unggulan</strong> (TBSM Honda, TJKT Fiber Optic, dan MPLB Perkantoran Digital). Kami melengkapi fasilitas pembelajaran dengan sarana terkini serta layanan digital terpadu seperti notifikasi presensi WhatsApp wali murid, pembayaran SPP QRIS, dan sistem informasi akademik 24 jam.
                </p>
              </div>

              {/* 3 Pillars List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                  <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-white">Santri Vokasi</h4>
                    <p className="text-[11px] text-slate-400 font-medium leading-snug">Akhlakul karimah & kemandirian.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                  <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-white">Mitra Industri DUDI</h4>
                    <p className="text-[11px] text-slate-400 font-medium leading-snug">Kurikulum standar AHASS & Axioo.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black text-white">Layanan Digital</h4>
                    <p className="text-[11px] text-slate-400 font-medium leading-snug">Sistem pintar terintegrasi 24/7.</p>
                  </div>
                </div>
              </div>

              {/* Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setModalOpen(true)}
                  className="px-5 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Baca Sambutan Selengkapnya</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </motion.button>

                {onOpenPpdb && (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={onOpenPpdb}
                    className="px-5 py-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <span>Daftar PPDB Online 2026</span>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  </motion.button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Full Speech Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto my-auto"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4 border-b border-slate-800 pb-5 mb-6">
                <img
                  src="/src/assets/images/kepala_sekolah_smk_1784774272474.jpg"
                  alt="Kepala Sekolah"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase">
                    Sambutan Resmi Kepala Sekolah
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                    Drs. H. Ahmad Sanusi, M.Pd.
                  </h3>
                  <p className="text-xs text-slate-400">Kepala SMK Islam Cipasung Singaparna</p>
                </div>
              </div>

              {/* Modal Full Text */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                <p className="font-bold text-white">
                  Assalamu’alaikum Warahmatullahi Wabarakatuh,
                </p>

                <p>
                  Puji syukur senantiasa kita panjatkan kehadirat Allah SWT yang telah melimpahkan rahmat, taufik, dan hidayah-Nya. Shalawat serta salam semoga tercurah kepada junjungan kita Nabi Agung Muhammad SAW, keluarga, para sahabat, serta para pengikutnya hingga akhir zaman.
                </p>

                <p>
                  Selamat datang di portal resmi sekolah digital SMK Islam Cipasung Singaparna Tasikmalaya. Di bawah naungan luhur <strong>Yayasan Pesantren Cipasung</strong>, kami berkomitmen menyelenggarakan pendidikan kejuruan yang memadukan keunggulan ilmu pengetahuan, keterampilan vokasi berstandar industri, serta pembinaan akhlakul karimah berbasis pesantren.
                </p>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    Fokus Utama Pengembangan Pendidikan Kami:
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                    <li><strong className="text-white">Pendidikan Karakter & Moral:</strong> Membentuk pribadi santri yang disiplin, jujur, serta beretika tinggi dalam bermasyarakat.</li>
                    <li><strong className="text-white">Penguatan Vokasi & DUDI:</strong> Menjalin kemitraan erat dengan Dunia Usaha dan Dunia Industri (DUDI) seperti Honda AHASS, Axioo, serta instansi pemerintahan.</li>
                    <li><strong className="text-white">Digitalisasi Manajemen Sekolah:</strong> Menghadirkan kemudahan layanan bagi siswa dan wali murid melalui teknologi informasi terpadu.</li>
                  </ul>
                </div>

                <p>
                  Harapan kami, seluruh siswa-siswi SMK Islam Cipasung tidak hanya siap bersaing dalam dunia kerja dan wirausaha, namun juga menjadi insan yang bermanfaat bagi agama, bangsa, dan negara.
                </p>

                <p className="italic text-slate-400 pt-2 border-t border-slate-800">
                  Wassalamu’alaikum Warahmatullahi Wabarakatuh.
                </p>

                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black text-amber-300">Singaparna, Tasikmalaya</div>
                    <div className="text-xs font-bold text-white">Kepala SMK Islam Cipasung</div>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-2.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    Tutup Sambutan
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
