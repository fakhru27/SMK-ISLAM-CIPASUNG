import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { LogoYayasan, LogoSmk } from './Logos';

import { SchoolInfoData } from '../types';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  schoolInfo?: SchoolInfoData;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, schoolInfo }) => {
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: School Logo & Description */}
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              <LogoSmk size={40} showText={true} lightText={true} logoUrl={schoolInfo?.logoUrl} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mewujudkan lulusan vokasi industri unggul yang mahir dalam teknologi modern, berkarakter Islami berpondasikan pesantren, serta siap kerja di era digital nasional.
            </p>
            <p className="text-xs text-amber-300/90 font-cinzel italic leading-relaxed border-l-2 border-amber-400 pl-3 pt-0.5 my-1">
              "Dan katakanlah: Bekerjalah kamu, maka Allah dan Rasul-Nya serta orang-orang mu'min akan melihat pekerjaanmu itu." <span className="text-amber-400 font-semibold font-sans not-italic block mt-1 text-[11px]">(QS. At-Taubah: 105)</span>
            </p>
          </div>

          {/* Column 2: Konsentrasi Keahlian (Majors) */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white tracking-wider uppercase border-l-2 border-amber-400 pl-2.5 font-cinzel">
              Konsentrasi Keahlian
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleTabClick('jurusan')}
                  className="hover:text-amber-300 flex items-center gap-2 transition text-left font-medium cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  Teknik Sepeda Motor (TSM - Otomotif AHASS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('jurusan')}
                  className="hover:text-amber-300 flex items-center gap-2 transition text-left font-medium cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  Teknik Jaringan Komputer & Telekomunikasi (TJKT / TKJ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('jurusan')}
                  className="hover:text-amber-300 flex items-center gap-2 transition text-left font-medium cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Manajemen Perkantoran & Layanan Bisnis (MPLB)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Akses Cepat */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white tracking-wider uppercase border-l-2 border-blue-500 pl-2.5 font-cinzel">
              Akses Layanan
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleTabClick('ppdb')}
                  className="hover:text-amber-300 flex items-center gap-2 transition cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  Pendaftaran PPDB Online 2026/2027
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('pembayaran')}
                  className="hover:text-amber-300 flex items-center gap-2 transition cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Pembayaran SPP Digital & QRIS
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('fasilitas')}
                  className="hover:text-amber-300 flex items-center gap-2 transition cursor-pointer text-amber-300 font-bold"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  Fasilitas &amp; E-Library Digital
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('portal')}
                  className="hover:text-amber-300 flex items-center gap-2 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  Portal Akademik &amp; Transkrip Nilai
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('notifikasi')}
                  className="hover:text-amber-300 flex items-center gap-2 transition cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  Notifikasi Orang Tua (WhatsApp)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabClick('galeri')}
                  className="hover:text-amber-300 flex items-center gap-2 transition cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Galeri & Foto Kegiatan Santri
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Kontak & Lokasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-white tracking-wider uppercase border-l-2 border-emerald-500 pl-2.5 font-cinzel">
              Kontak & Lokasi Sekolah
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <a
                href="https://www.google.com/maps/search/?api=1&query=SMK+Islam+Cipasung+Singaparna+Tasikmalaya"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 group hover:text-amber-300 transition cursor-pointer"
                title="Klik untuk membuka lokasi SMK Islam Cipasung di Google Maps"
              >
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="leading-relaxed group-hover:underline group-hover:text-amber-300">
                  Jl. KH. Ruhiat, Komplek Pesantren Cipasung, Desa Cipakat, Kec. Singaparna, Kab. Tasikmalaya, Jawa Barat 46417
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400/80 group-hover:text-amber-300 shrink-0 mt-0.5" />
              </a>
              <a
                href="tel:0265545123"
                className="flex items-center gap-2.5 hover:text-amber-300 transition cursor-pointer"
              >
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>(0265) 545123 / 0812-2345-6789</span>
              </a>
              <a
                href="mailto:info@smkislamcipasung.sch.id"
                className="flex items-center gap-2.5 hover:text-amber-300 transition cursor-pointer"
              >
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>info@smkislamcipasung.sch.id</span>
              </a>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Senin - Sabtu: 07.00 - 16.00 WIB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-2">
          <p>© 2026 SMK Islam Cipasung Singaparna</p>
          <div className="flex items-center gap-4">
            <button onClick={() => handleTabClick('seo')} className="hover:text-amber-300 transition cursor-pointer">
              Pencarian SEO
            </button>
            <span>•</span>
            <button onClick={() => handleTabClick('admin')} className="hover:text-amber-300 transition cursor-pointer">
              Panel Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

