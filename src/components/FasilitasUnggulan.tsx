import React, { useState } from 'react';
import {
  Server,
  Wrench,
  Monitor,
  BookOpen,
  Tv,
  Building,
  CheckCircle2,
  Sparkles,
  Download,
  Eye,
  Award,
  ShieldCheck,
  Layers,
  Search,
  ArrowRight,
  ChevronRight,
  X,
  Zap,
  Cpu,
  Wifi,
  Library,
  GraduationCap,
} from 'lucide-react';

export interface FacilityItem {
  id: string;
  name: string;
  category: 'tjkt' | 'tsm' | 'mplb' | 'umum' | 'elibrary';
  categoryLabel: string;
  imageUrl: string;
  shortDesc: string;
  fullDesc: string;
  capacity: string;
  industryStandard: string;
  equipment: string[];
  features: string[];
  pdfUrl?: string;
}

const facilityData: FacilityItem[] = [
  {
    id: 'fac-tjkt-1',
    name: 'Lab Fiber Optic & Cisco Networking (TJKT)',
    category: 'tjkt',
    categoryLabel: 'Lab Komputer TJKT',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'Laboratorium jaringan komputer tingkat lanjut dengan perangkat Cisco Router, Mikrotik RouterBoard, dan Fusion Splicer Fiber Optic.',
    fullDesc: 'Lab Fiber Optic & Networking SMK Islam Cipasung didesain khusus standar Industri Telekomunikasi (PT Telkom Indonesia). Dilengkapi dengan server rack dedicated, perangkat splicer kabel serat optik OTDR, Mikrotik Enterprise Router, serta 40 unit PC High-Performance untuk praktikum CCNA dan Network Administrator.',
    capacity: '40 Praktikan / Sesi',
    industryStandard: 'Standar Industri Telkom & Mikrotik Academy',
    equipment: [
      '3x Fusion Splicer Fiber Optic Pro',
      '1x Optical Time Domain Reflectometer (OTDR)',
      '10x Cisco Switch & Router Catalyst Series',
      '40x PC Workstation Core i7 / 16GB RAM',
      '1x Dedicated Server Rack Datacenter',
    ],
    features: ['Sertifikasi Mikrotik MTCNA', 'Uji Kompetensi Serat Optik', 'Akses Server Lokal & Cloud'],
  },
  {
    id: 'fac-tsm-1',
    name: 'Bengkel Otomotif Standard AHASS Honda (TSM)',
    category: 'tsm',
    categoryLabel: 'Bengkel Sepeda Motor TSM',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'Bengkel praktikum teknik sepeda motor lengkap dengan Dyno Tester, Hydraulic Bike Lift, PGM-FI Diagnostic Tool, dan Special Tools.',
    fullDesc: 'Fasilitas bengkel TSM binaan Astra Honda Motor (AHM) yang mensimulasikan lingkungan bengkel resmi AHASS. Siswa belajar melakukan service berkala, bongkar pasang mesin injection (PGM-FI), perbaikan kelistrikan, dan pengujian performa mesin menggunakan Dyno Test modern.',
    capacity: '35 Siswa / Sesi Praktik',
    industryStandard: 'Standar Binaan Astra Honda Motor (AHM)',
    equipment: [
      '6x Bike Lift Hydraulics',
      '4x Hi-DS Honda Diagnostic Scanner',
      '1x Chassis Dyno Test Machine',
      '12x Engine Stand PGM-FI Injection',
      'Lengkap 100+ Set Special Service Tools (SST)',
    ],
    features: ['Service Berkala Standar AHASS', 'Diagnosa Sistem Injeksi Komputer', 'Sertifikasi Teknisi Muda Honda'],
  },
  {
    id: 'fac-mplb-1',
    name: 'Lab Perkantoran Digital & Front Office (MPLB)',
    category: 'mplb',
    categoryLabel: 'Lab Office & Simulasi MPLB',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'Simulasi ruang kantor modern lengkap dengan resepsionis (front office), ruang rapat eksekutif, serta perangkat kearsipan digital.',
    fullDesc: 'Laboratorium Manajemen Perkantoran dan Layanan Bisnis didesain sesuai standar korporat terkini. Dilengkapi dengan perangkat filing system elektronik, mesin ketik cepat standar ISO, telepon PABX multi-line untuk simulasi korespondensi bisnis, serta ruang rapat berteknologi Smart Board.',
    capacity: '36 Siswa / Sesi Praktik',
    industryStandard: 'Standar Mitra Industri Perbankan & BUMN',
    equipment: [
      '36x PC Administrasi Perkantoran & ERP',
      '1x Set Intercom PABX Multi-Line',
      '1x Smart TV Interactive Conference System',
      '1x Meja Resepsionis & Front Office Suite',
      'Sistem Kearsipan Elektronik (E-Filing)',
    ],
    features: ['Simulasi Protocol Officer & Customer Service', 'Kearsipan Berbasis AI & Cloud', 'Sertifikasi Operator Komputer Perkantoran'],
  },
  {
    id: 'fac-elibrary-1',
    name: 'Perpustakaan Digital (E-Library SMK)',
    category: 'elibrary',
    categoryLabel: 'Perpustakaan Digital',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'Akses ribuan judul e-book pelajaran SMK, jurnal teknik industri, karya tulis ilmiah siswa, dan modul Kurikulum Merdeka.',
    fullDesc: 'Perpustakaan Digital SMK Islam Cipasung menyediakan layanan peminjaman buku digital berbasis QR-Code dan unduhan PDF gratis untuk seluruh siswa & guru. Terintegrasi dengan portal pembelajaran e-learning sekolah.',
    capacity: 'Akses Online 24/7 & Ruang Baca 50 Tempat DUDUK',
    industryStandard: 'Terakreditasi A Perpustakaan Nasional RI',
    equipment: [
      '15x Unit Tablet Touchscreen E-Book Reader',
      'Akses Katalog Online SLIMS (Senayan Library)',
      'Ruang Baca Ber-AC dengan Wi-Fi 200 Mbps',
      'Koleksi 3.500+ Judul Buku Teknik & Keagamaan',
    ],
    features: ['Pinjam Buku Digital Pakai NISN', 'Unduh Modul Pembelajaran PDF', 'Ruang Literasi & Diskusi Kelompok'],
    pdfUrl: '#',
  },
  {
    id: 'fac-podcast-1',
    name: 'Studio Creative & Broadcasting Podcast',
    category: 'umum',
    categoryLabel: 'Fasilitas Umum & Media',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'Studio multimedia kedap suara untuk konten kreatif, podcast pembelajaran, wawancara alumni, dan penyiaran radio digital sekolah.',
    fullDesc: 'Fasilitas kreatif berstandar profesional yang dimanfaatkan oleh ekstrakurikuler Sinematografi, Jurnalistik, dan Praktik Kehumasan SMK Islam Cipasung. Dilengkapi kamera mirrorless 4K, mikrofon condenser podcast multi-channel, dan lighting studio.',
    capacity: '8-10 Orang / Sesi Rekaman',
    industryStandard: 'Standar Studio Broadcasting Digital',
    equipment: [
      '4x Shure Podcast Condenser Microphones',
      '2x Sony Mirrorless 4K Broadcast Cameras',
      '1x Rodecaster Pro II Audio Mixer Console',
      'Dinding Peredam Acoustic Foam Professional',
    ],
    features: ['Produksi Konten Youtube & Tiktok Sekolah', 'Ruang Wawancara IDUKA & Alumni', 'Pelatihan Public Speaking & Digital Marketing'],
  },
  {
    id: 'fac-masjid-1',
    name: 'Masjid Al-Ikhlas & Gedung Olahraga Multifungsi',
    category: 'umum',
    categoryLabel: 'Fasilitas Umum & Karakter',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800',
    shortDesc: 'Pusat kegiatan keagamaan, shalat berjamaah, pembinaan akhlak santri SMK, serta fasilitas olahraga indoor futsal & badminton.',
    fullDesc: 'Sebagai Sekolah Menengah Kejuruan Berbasis Pesantren, SMK Islam Cipasung memprioritaskan keseimbangan ilmu pengetahuan dan ketakwaan. Masjid megah dua lantai ini digunakan untuk shalat dhuha bersama, pembacaan Al-Quran harian, serta pengajian rutin.',
    capacity: 'Kapasitas 1.200 Jamaah',
    industryStandard: 'Fasilitas Pembentukan Karakter Relijius',
    equipment: [
      'Sound System Audio Crystal-Clear',
      'Lapangan Futsal & Badminton InDoor',
      'Area Wudhu Luas & Suci Clean Standard',
      'Pendingin Ruangan & Karpet Masjid Premium',
    ],
    features: ['Shalat Dhuha Berjamaah Setiap Pagi', 'Kajian Kitab Kuning & Tahfidz', 'Turnamen Olahraga Antar Kelas'],
  },
];

export const FasilitasUnggulan: React.FC<{ onOpenPpdb?: () => void }> = ({ onOpenPpdb }) => {
  const [activeFilter, setActiveFilter] = useState<'semua' | 'tjkt' | 'tsm' | 'mplb' | 'umum' | 'elibrary'>('semua');
  const [selectedFacility, setSelectedFacility] = useState<FacilityItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFacilities = facilityData.filter((item) => {
    const matchesFilter = activeFilter === 'semua' || item.category === activeFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.industryStandard.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 text-white relative overflow-hidden" id="fasilitas">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-widest shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Sarana Prasarana &amp; Laboratorium Modern
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Fasilitas Unggulan <br />
            <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
              SMK Islam Cipasung
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
            Didukung oleh peralatan standar industri nasional (AHM, Telkom, Mikrotik), laboratorium praktikum canggih, serta perpustakaan digital terintegrasi untuk mencetak lulusan siap kerja &amp; berkarakter santri.
          </p>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-3 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-md">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <button
              onClick={() => setActiveFilter('semua')}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'semua'
                  ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" /> Semua Fasilitas ({facilityData.length})
            </button>
            <button
              onClick={() => setActiveFilter('tjkt')}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'tjkt'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" /> Lab TJKT
            </button>
            <button
              onClick={() => setActiveFilter('tsm')}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'tsm'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" /> Bengkel TSM
            </button>
            <button
              onClick={() => setActiveFilter('mplb')}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'mplb'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" /> Lab MPLB
            </button>
            <button
              onClick={() => setActiveFilter('elibrary')}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'elibrary'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Library className="w-4 h-4" /> Perpustakaan Digital
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari lab / alat / fasilitas..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 text-xs text-white rounded-2xl border border-slate-700 focus:outline-none focus:border-amber-400 placeholder:text-slate-500 font-semibold"
            />
          </div>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden hover:border-amber-400/60 transition-all duration-300 flex flex-col group shadow-xl hover:-translate-y-1.5"
            >
              {/* Image & Badge */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={fac.imageUrl}
                  alt={fac.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/40">
                  {fac.categoryLabel}
                </span>
                <span className="absolute bottom-3 left-3 right-3 text-xs font-bold text-amber-200 bg-blue-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-blue-800/80 inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{fac.industryStandard}</span>
                </span>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed line-clamp-3">
                    {fac.shortDesc}
                  </p>
                </div>

                {/* Key Equipment Pills */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Inventaris &amp; Alat Utama:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {fac.equipment.slice(0, 3).map((eq, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-200 text-[11px] font-semibold border border-slate-700/80 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate max-w-[180px]">{eq}</span>
                      </span>
                    ))}
                    {fac.equipment.length > 3 && (
                      <span className="px-2 py-1 rounded-lg bg-amber-400/10 text-amber-300 text-[11px] font-bold border border-amber-400/30">
                        +{fac.equipment.length - 3} Alat Lagi
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-3">
                  <button
                    onClick={() => setSelectedFacility(fac)}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 hover:from-amber-400 hover:to-amber-500 text-amber-300 hover:text-slate-950 font-black text-xs transition-all duration-300 flex items-center justify-center gap-2 border border-blue-800 hover:border-amber-400 cursor-pointer shadow-md"
                  >
                    <Eye className="w-4 h-4" /> Detail Fasilitas &amp; Spesifikasi <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* E-Library Direct Feature Highlight Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-8 rounded-3xl border-2 border-amber-400/50 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              <Library className="w-4 h-4" /> E-Library &amp; Buku Digital SMK
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Unduh Modul &amp; Pinjam Buku Pelajaran Digital Secara Gratis
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
              Seluruh siswa SMK Islam Cipasung dan calon peserta didik baru dapat mengakses ribuan buku paket Kurikulum Merdeka, e-book praktikum TJKT, TSM, &amp; MPLB secara digital melalui akun NISN masing-masing.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => {
                const elib = facilityData.find((f) => f.id === 'fac-elibrary-1');
                if (elib) setSelectedFacility(elib);
              }}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer transition"
            >
              <BookOpen className="w-4 h-4" /> Buka E-Library Digital
            </button>
            {onOpenPpdb && (
              <button
                onClick={onOpenPpdb}
                className="px-6 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" /> Daftar PPDB 2026/2027
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DETAIL FACILITY SPECIFICATION MODAL */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full border border-amber-400/50 shadow-2xl overflow-hidden relative my-8">
            {/* Modal Header */}
            <div className="relative h-64">
              <img
                src={selectedFacility.imageUrl}
                alt={selectedFacility.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <button
                onClick={() => setSelectedFacility(null)}
                className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-950 text-white p-2 rounded-full border border-slate-700 cursor-pointer transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 space-y-1">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider inline-block">
                  {selectedFacility.categoryLabel}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">{selectedFacility.name}</h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-xs max-h-[60vh] overflow-y-auto">
              {/* Industry Standard Badge */}
              <div className="p-3.5 bg-blue-950/80 rounded-2xl border border-blue-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Sertifikasi &amp; Mitram Industri:</span>
                    <span className="font-extrabold text-amber-300 text-xs">{selectedFacility.industryStandard}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">Kapasitas Sesi:</span>
                  <span className="font-bold text-white text-xs">{selectedFacility.capacity}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-black text-amber-300 text-xs uppercase tracking-wider">Deskripsi Lengkap Fasilitas:</h4>
                <p className="text-slate-300 font-medium leading-relaxed">{selectedFacility.fullDesc}</p>
              </div>

              {/* Equipment Inventory Grid */}
              <div className="space-y-2">
                <h4 className="font-black text-amber-300 text-xs uppercase tracking-wider">Daftar Perangkat &amp; Inventaris Utama:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedFacility.equipment.map((eq, i) => (
                    <div key={i} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-200 font-semibold">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{eq}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keunggulan & Layanan */}
              <div className="space-y-2">
                <h4 className="font-black text-amber-300 text-xs uppercase tracking-wider">Keunggulan Pembelajaran &amp; Sertifikasi:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFacility.features.map((feat, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[11px] font-medium">
                *SMK Islam Cipasung - Kampus Berstandar Industri (IDUKA)
              </span>
              <button
                onClick={() => setSelectedFacility(null)}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl cursor-pointer transition"
              >
                Tutup Spesifikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
