import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  Download,
  Calendar,
  UserCheck,
  Award,
  Sparkles,
  QrCode,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  UploadCloud,
  FileSpreadsheet,
  Building,
  School,
  Phone,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { PpdbApplicant } from '../types';

interface PpdbStudentPortalProps {
  applicants: PpdbApplicant[];
  onAddApplicant?: (applicant: PpdbApplicant) => void;
  onNavigateTab: (tab: string) => void;
  onOpenLoginModal?: () => void;
}

export const PpdbStudentPortal: React.FC<PpdbStudentPortalProps> = ({
  applicants,
  onNavigateTab,
  onOpenLoginModal,
}) => {
  const [searchRegNo, setSearchRegNo] = useState('');
  const [activeApplicant, setActiveApplicant] = useState<PpdbApplicant | null>(applicants[0] || null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Local Upload Document Simulation
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({
    ijazah: true,
    kk: true,
    akta: true,
    foto: true,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setHasSearched(true);

    const term = searchRegNo.trim().toLowerCase();
    if (!term) {
      setActiveApplicant(applicants[0] || null);
      return;
    }

    const found = applicants.find(
      (app) =>
        (app.registrationNo || app.id).toLowerCase() === term ||
        app.nisn.toLowerCase() === term ||
        app.fullName.toLowerCase().includes(term)
    );

    if (found) {
      setActiveApplicant(found);
      if (found.status === 'Diterima' || found.status === 'Lulus Seleksi' || (found.status as string) === 'Terverifikasi') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } else {
      setActiveApplicant(null);
      setSearchError(`Data pendaftaran untuk "${searchRegNo}" tidak ditemukan. Pastikan Nomor Pendaftaran (PPDB-2026-...) atau NISN sudah benar.`);
    }
  };

  const getStatusBadge = (status: PpdbApplicant['status']) => {
    switch (status) {
      case 'Diterima':
      case 'Lulus Seleksi':
      case 'Lulus / Diterima':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: CheckCircle2,
          text: 'LULUS / DITERIMA',
        };
      case 'Terverifikasi':
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          icon: ShieldCheck,
          text: 'BERKAS TERVERIFIKASI',
        };
      case 'Ditolak':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: AlertCircle,
          text: 'TIDAK LOLOS SELEKSI',
        };
      default:
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: Clock,
          text: 'MENUNGGU VERIFIKASI',
        };
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-950 text-slate-100 min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-indigo-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/30 shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            Portal Khusus Calon Siswa Baru PPDB
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Cek Status Pendaftaran & Hasil Kelulusan PPDB
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
            Sistem Informasi Terpadu SMK Islam Cipasung. Masukkan Nomor Pendaftaran atau NISN untuk memantau status seleksi, unduh SKL, dan informasi daftar ulang.
          </p>
        </div>

        {/* Search Bar Card */}
        <div className="bg-slate-900/90 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchRegNo}
                onChange={(e) => setSearchRegNo(e.target.value)}
                placeholder="Masukkan No. Pendaftaran (misal: PPDB-2026-001) atau NISN..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-amber-100 placeholder-slate-500 font-semibold focus:outline-none focus:border-amber-400 text-sm transition"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black hover:brightness-110 transition shadow-lg flex items-center justify-center gap-2 text-sm shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Cek Status Sekarang</span>
            </button>
          </form>

          {/* Preset Sample Quick Buttons */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span className="font-semibold text-slate-400">Atau pilih pendaftar contoh:</span>
            <div className="flex flex-wrap gap-2">
              {applicants.slice(0, 4).map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    setSearchRegNo(app.registrationNo || app.id);
                    setActiveApplicant(app);
                    setSearchError('');
                  }}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                    activeApplicant?.id === app.id
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/60'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {app.fullName} ({app.registrationNo || app.id})
                </button>
              ))}
            </div>
          </div>

          {searchError && (
            <div className="mt-4 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* ACTIVE APPLICANT PORTAL VIEW */}
        {activeApplicant && (
          <div className="space-y-8">
            {/* Top Overview Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                    No. Reg: {activeApplicant.registrationNo || activeApplicant.id}
                  </span>
                  {(() => {
                    const badge = getStatusBadge(activeApplicant.status);
                    const Icon = badge.icon;
                    return (
                      <span className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${badge.bg}`}>
                        <Icon className="w-3.5 h-3.5" />
                        <span>{badge.text}</span>
                      </span>
                    );
                  })()}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white">{activeApplicant.fullName}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span>Asal Sekolah: <strong className="text-white font-semibold">{activeApplicant.originSchool}</strong></span>
                  <span>•</span>
                  <span>NISN: <strong className="text-amber-300 font-mono font-bold">{activeApplicant.nisn}</strong></span>
                  <span>•</span>
                  <span>Tanggal Daftar: <strong className="text-white font-semibold">{activeApplicant.registrationDate}</strong></span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-right w-full md:w-auto shrink-0 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Jurusan Pilihan Utama:</span>
                <span className="text-lg font-black text-amber-400 uppercase tracking-wide block">
                  {activeApplicant.selectedMajor.toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-400 block font-medium">
                  Pilihan Kedua: {activeApplicant.secondMajor ? activeApplicant.secondMajor.toUpperCase() : 'TSM'}
                </span>
              </div>
            </div>

            {/* INTERACTIVE TIMELINE ALUR PENDAFTARAN */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <span>Alur Progress Pendaftaran &amp; Seleksi</span>
                  </h3>
                  <p className="text-xs text-slate-400">Pantau tahapan proses seleksi penerimaan siswa baru</p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  Terintegrasi Sistem Admin
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Step 1 */}
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-xs font-extrabold text-white">Formulir Online</h4>
                  <p className="text-[11px] text-emerald-300 font-medium">Data pendaftaran telah diterima sistem.</p>
                </div>

                {/* Step 2 */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  activeApplicant.status !== 'Menunggu Verifikasi'
                    ? 'bg-emerald-950/40 border-emerald-500/40'
                    : 'bg-amber-950/40 border-amber-500/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center ${
                      activeApplicant.status !== 'Menunggu Verifikasi' ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                    }`}>2</span>
                    {activeApplicant.status !== 'Menunggu Verifikasi' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    )}
                  </div>
                  <h4 className="text-xs font-extrabold text-white">Verifikasi Administrasi</h4>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {activeApplicant.status !== 'Menunggu Verifikasi' ? 'Berkas lengkap &amp; valid.' : 'Sedang diverifikasi panitia.'}
                  </p>
                </div>

                {/* Step 3 */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  activeApplicant.status === 'Diterima' || activeApplicant.status === 'Lulus Seleksi' || (activeApplicant.status as string) === 'Lulus / Diterima'
                    ? 'bg-emerald-950/40 border-emerald-500/40'
                    : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center ${
                      activeApplicant.status === 'Diterima' || activeApplicant.status === 'Lulus Seleksi' || (activeApplicant.status as string) === 'Lulus / Diterima' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>3</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-xs font-extrabold text-white">Tes &amp; Wawancara</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Tes Pemetaan &amp; Minat Kejuruan.</p>
                </div>

                {/* Step 4 */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  activeApplicant.status === 'Diterima' || activeApplicant.status === 'Lulus Seleksi' || (activeApplicant.status as string) === 'Lulus / Diterima'
                    ? 'bg-emerald-950/40 border-emerald-500/40'
                    : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center ${
                      activeApplicant.status === 'Diterima' || activeApplicant.status === 'Lulus Seleksi' || (activeApplicant.status as string) === 'Lulus / Diterima' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>4</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="text-xs font-extrabold text-white">Pengumuman Kelulusan</h4>
                  <p className="text-[11px] text-slate-400 font-medium">SKL Digital terbit resmi.</p>
                </div>

                {/* Step 5 */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 font-black text-xs flex items-center justify-center">5</span>
                    <School className="w-4 h-4 text-slate-500" />
                  </div>
                  <h4 className="text-xs font-extrabold text-white">Daftar Ulang &amp; MPLS</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Pengambilan seragam &amp; atribut.</p>
                </div>
              </div>
            </div>

            {/* BUKTI TRANSFER & PEMBAYARAN PPDB CARD */}
            <div className="bg-slate-900/90 border border-indigo-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-extrabold text-white">Bukti Pembayaran & Transfer PPDB Online</h4>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                  activeApplicant.status === 'Diterima'
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}>
                  {activeApplicant.status === 'Diterima' ? '✓ VERIFIKASI LUNAS' : 'MENUNGGU VERIFIKASI ADMIN'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                <div className="md:col-span-5">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 group">
                    <img
                      src={activeApplicant.paymentProofUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'}
                      alt="Struk Transfer PPDB"
                      className="w-full h-44 object-cover object-top"
                    />
                    <a
                      href={activeApplicant.paymentProofUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-2 right-2 bg-slate-900/90 text-amber-300 px-2.5 py-1 rounded-lg text-[10px] font-extrabold border border-amber-400/30 flex items-center gap-1"
                    >
                      Buka Resi Full
                    </a>
                  </div>
                </div>

                <div className="md:col-span-7 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2 font-medium">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Nominal Biaya PPDB:</span>
                    <strong className="text-amber-300 font-extrabold text-sm">Rp {(activeApplicant.paymentAmount || 250000).toLocaleString('id-ID')}</strong>
                  </div>

                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Pengirim / Wali:</span>
                    <strong className="text-white">{activeApplicant.paymentSenderName || activeApplicant.parentName}</strong>
                  </div>

                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Bank / Channel:</span>
                    <strong className="text-white">{activeApplicant.paymentBankSender || 'Transfer Bank BRI / BSI'}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Tanggal Unggah:</span>
                    <span className="text-slate-300">{activeApplicant.paymentProofDate || activeApplicant.registrationDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* OFFICIAL ACCEPTANCE LETTER (SURAT KETERANGAN LULUS) */}
            {(activeApplicant.status === 'Diterima' || activeApplicant.status === 'Lulus Seleksi' || (activeApplicant.status as string) === 'Lulus / Diterima') && (
              <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-emerald-950/60 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">Surat Keterangan Lulus (SKL) Digital</h3>
                      <p className="text-xs text-emerald-300 font-medium">No. Surat: 421.5/SKL-PPDB/SMK-IC/2026</p>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak SKL Resmi (PDF)</span>
                  </button>
                </div>

                <div className="bg-slate-950/80 p-6 rounded-2xl border border-emerald-500/30 space-y-4 text-xs text-slate-200 leading-relaxed">
                  <p className="font-bold text-amber-300">
                    SELAMAT! Berdasarkan hasil rapat Panitia Penerimaan Peserta Didik Baru (PPDB) SMK Islam Cipasung Tahun Ajaran 2026/2027, Anda dinyatakan:
                  </p>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-1">
                    <span className="text-xs text-emerald-300 uppercase font-bold tracking-wider">STATUS KELULUSAN</span>
                    <h4 className="text-xl font-black text-emerald-400 uppercase">DITERIMA SEBAGAI SISWA BARU</h4>
                    <p className="text-xs text-white font-semibold">
                      Program Keahlian: <strong className="text-amber-400 font-extrabold uppercase">{activeApplicant.selectedMajor}</strong>
                    </p>
                  </div>

                  {/* Sesi Selanjutnya & Schedule Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <Calendar className="w-4 h-4" />
                        <span>Jadwal Daftar Ulang & Seragam:</span>
                      </div>
                      <p className="text-slate-300 font-medium">Senin - Rabu, 3 - 5 Agustus 2026 (08.00 - 14.00 WIB)</p>
                      <p className="text-slate-400 text-[11px]">Tempat: Ruang Sekretariat PPDB SMK Islam Cipasung</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 text-blue-300 font-bold">
                        <School className="w-4 h-4" />
                        <span>Masa Orientasi (MPLS):</span>
                      </div>
                      <p className="text-slate-300 font-medium">Senin - Rabu, 10 - 12 Agustus 2026</p>
                      <p className="text-slate-400 text-[11px]">Wajib mengenakan pakaian seragam SMP/MTs asal</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENT CHECKLIST & UPLOAD */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Upload Verification */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-amber-400" />
                  <span>Kelengkapan Berkas Fisik / Digital</span>
                </h3>

                <div className="space-y-3 text-xs">
                  {[
                    { key: 'ijazah', label: 'Fotokopi / Scan Ijazah SMP / MTs (Legalisir)' },
                    { key: 'kk', label: 'Fotokopi Kartu Keluarga (KK)' },
                    { key: 'akta', label: 'Fotokopi Akta Kelahiran' },
                    { key: 'foto', label: 'Pasfoto Ukuran 3x4 (4 Lembar)' },
                  ].map((doc) => (
                    <div
                      key={doc.key}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <span className="font-semibold text-slate-300">{doc.label}</span>
                      <button
                        onClick={() =>
                          setUploadedDocs((prev) => ({ ...prev, [doc.key]: !prev[doc.key] }))
                        }
                        className={`px-3 py-1 rounded-xl font-bold text-[11px] transition flex items-center gap-1 cursor-pointer ${
                          uploadedDocs[doc.key]
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {uploadedDocs[doc.key] ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Sudah Diunggah</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Unggah Berkas</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Help & Contact Panitia */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    <Phone className="w-5 h-5 text-amber-400" />
                    <span>Layanan Bantuan Panitia PPDB</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Ada kendala atau pertanyaan seputar berkas pendaftaran? Hubungi Panitia PPDB SMK Islam Cipasung via WhatsApp resmi:
                  </p>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <p className="font-bold text-amber-300">Hotline PPDB WhatsApp:</p>
                    <p className="text-slate-200 font-mono font-bold">0821-2345-6789 / 0852-9876-5432</p>
                    <p className="text-slate-400 text-[11px]">Jam Kerja: Senin - Sabtu (08.00 - 15.00 WIB)</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onNavigateTab('ppdb')}
                    className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Formulir Pendaftaran Baru</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={onOpenLoginModal}
                    className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Login Akun Siswa</span>
                    <UserCheck className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
