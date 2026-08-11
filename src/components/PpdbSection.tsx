import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  CheckCircle2,
  Search,
  User,
  Users,
  GraduationCap,
  FileCheck,
  Printer,
  Download,
  AlertCircle,
  Clock,
  Sparkles,
  QrCode,
  ArrowRight,
  RefreshCw,
  Upload,
} from 'lucide-react';
import { Major, MajorId, PpdbApplicant } from '../types';

interface PpdbSectionProps {
  majors: Major[];
  applicants: PpdbApplicant[];
  onAddApplicant: (applicant: PpdbApplicant) => void;
  preselectedMajorId?: MajorId;
}

export const PpdbSection: React.FC<PpdbSectionProps> = ({
  majors,
  applicants,
  onAddApplicant,
  preselectedMajorId,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'status'>('form');

  // Form Steps: 1: Siswa, 2: Ortu, 3: Jurusan, 4: Berkas, 5: Selesai
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    nisn: '',
    nik: '',
    gender: 'L' as 'L' | 'P',
    birthPlace: 'Tasikmalaya',
    birthDate: '2010-06-15',
    originSchool: '',
    address: '',
    parentName: '',
    parentPhone: '',
    selectedMajor: preselectedMajorId || ('tsm' as MajorId),
    secondMajor: 'tjkt' as MajorId,
    documentsUploaded: {
      ijazah: true,
      kk: true,
      akta: true,
      foto: true,
    },
    paymentProofUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    paymentSenderName: '',
    paymentBankSender: 'Transfer Bank BRI / BSI',
  });

  const handleProofFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, paymentProofUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generated Registration Result State
  const [lastSubmittedApplicant, setLastSubmittedApplicant] = useState<PpdbApplicant | null>(null);

  // Status Checker Query State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<PpdbApplicant | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocToggle = (docKey: 'ijazah' | 'kk' | 'akta' | 'foto') => {
    setFormData((prev) => ({
      ...prev,
      documentsUploaded: {
        ...prev.documentsUploaded,
        [docKey]: !prev.documentsUploaded[docKey],
      },
    }));
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.nisn || !formData.parentPhone) {
      alert('Mohon lengkapi Nama Lengkap, NISN, dan Nomor WhatsApp Orang Tua.');
      return;
    }

    const regId = `PPDB-2026-${String(applicants.length + 1).padStart(3, '0')}`;
    const newApplicant: PpdbApplicant = {
      id: regId,
      nisn: formData.nisn,
      nik: formData.nik || '3206' + Math.floor(Math.random() * 1000000000000),
      fullName: formData.fullName,
      gender: formData.gender,
      birthPlace: formData.birthPlace,
      birthDate: formData.birthDate,
      originSchool: formData.originSchool || 'SMP / MTs Sederajat',
      address: formData.address || 'Singaparna, Tasikmalaya',
      parentName: formData.parentName || 'Orang Tua Siswa',
      parentPhone: formData.parentPhone,
      selectedMajor: formData.selectedMajor,
      secondMajor: formData.secondMajor,
      status: 'Menunggu Verifikasi',
      registrationDate: new Date().toISOString().split('T')[0],
      documentsUploaded: formData.documentsUploaded,
      paymentProofUrl: formData.paymentProofUrl,
      paymentSenderName: formData.paymentSenderName || formData.parentName || 'Wali Calon Siswa',
      paymentBankSender: formData.paymentBankSender || 'Transfer Bank BRI / BSI',
      paymentProofDate: new Date().toLocaleDateString('id-ID'),
      paymentAmount: 250000,
      notes: 'Pendaftaran online melalui portal resmi SMK Islam Cipasung & Bukti Transfer terlampir.',
    };

    onAddApplicant(newApplicant);
    setLastSubmittedApplicant(newApplicant);
    setCurrentStep(5);

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    const found = applicants.find(
      (app) =>
        app.id.toLowerCase() === query ||
        app.nisn === query ||
        app.fullName.toLowerCase().includes(query)
    );

    setSearchResult(found || null);
    setHasSearched(true);
  };

  const selectedMajorObj = majors.find((m) => m.id === formData.selectedMajor) || majors[0];

  return (
    <section className="py-12 lg:py-16 bg-slate-100/90 text-slate-800 min-h-screen bg-grid-pattern relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 text-amber-300 text-xs font-extrabold uppercase tracking-wider border border-blue-800 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Penerimaan Peserta Didik Baru (PPDB) TA 2026/2027
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Pendaftaran Siswa Baru SMK Islam Cipasung
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Daftar secara mandiri, unggah berkas, dan dapatkan bukti pendaftaran langsung secara instant.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 p-2 rounded-full border border-blue-800 flex gap-2 shadow-xl">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveSubTab('form')}
              className={`px-6 py-2.5 rounded-full font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                activeSubTab === 'form'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-300'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/60'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${activeSubTab === 'form' ? 'text-slate-950' : 'text-amber-400'}`} /> Formulir Pendaftaran
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveSubTab('status')}
              className={`px-6 py-2.5 rounded-full font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                activeSubTab === 'status'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-300'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/60'
              }`}
            >
              <Search className={`w-4 h-4 ${activeSubTab === 'status' ? 'text-slate-950' : 'text-amber-400'}`} /> Cek Status Pendaftaran
            </motion.button>
          </div>
        </div>

        {/* TAB 1: FORMULIR PENDAFTARAN */}
        {activeSubTab === 'form' && (
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 rounded-3xl border-2 border-blue-800/90 p-6 sm:p-8 lg:p-10 shadow-2xl text-white relative overflow-hidden">
            {currentStep < 5 && (
              <>
                {/* Step Indicator */}
                <div className="mb-8 space-y-3">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-black uppercase tracking-wider">
                    <span className={currentStep >= 1 ? 'text-amber-300' : 'text-slate-400'}>
                      1. Data Siswa
                    </span>
                    <span className={currentStep >= 2 ? 'text-amber-300' : 'text-slate-400'}>
                      2. Data Ortu
                    </span>
                    <span className={currentStep >= 3 ? 'text-amber-300' : 'text-slate-400'}>
                      3. Pilih Jurusan
                    </span>
                    <span className={currentStep >= 4 ? 'text-amber-300' : 'text-slate-400'}>
                      4. Unggah Berkas
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-blue-950 rounded-full overflow-hidden border border-blue-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 transition-all duration-300 shadow-md"
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmitRegistration} className="space-y-6">
                  {/* STEP 1: DATA SISWA */}
                  {currentStep === 1 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <h3 className="text-lg font-black text-amber-300 flex items-center gap-2 pb-2 border-b border-blue-800">
                        <User className="w-5 h-5 text-amber-400" /> Data Calon Peserta Didik
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-200 mb-1">
                            Nama Lengkap Calon Siswa *
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Contoh: Muhammad Rizky Pratama"
                            className="w-full bg-slate-900/90 border border-blue-800 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-amber-400 placeholder-slate-400"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-200 mb-1">
                            NISN (Nomor Induk Siswa Nasional) *
                          </label>
                          <input
                            type="text"
                            name="nisn"
                            value={formData.nisn}
                            onChange={handleInputChange}
                            placeholder="Contoh: 0081234567"
                            className="w-full bg-slate-900/90 border border-blue-800 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-amber-400 placeholder-slate-400"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-200 mb-1">
                            NIK (Nomor Induk Kependudukan)
                          </label>
                          <input
                            type="text"
                            name="nik"
                            value={formData.nik}
                            onChange={handleInputChange}
                            placeholder="16 Digit NIK di Kartu Keluarga"
                            className="w-full bg-slate-900/90 border border-blue-800 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-amber-400 placeholder-slate-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-200 mb-1">
                            Jenis Kelamin *
                          </label>
                          <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full bg-slate-900/90 border border-blue-800 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
                          >
                            <option value="L" className="bg-slate-900 text-white">Laki-laki</option>
                            <option value="P" className="bg-slate-900 text-white">Perempuan</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-200 mb-1">
                            Tempat / Tanggal Lahir
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              name="birthPlace"
                              value={formData.birthPlace}
                              onChange={handleInputChange}
                              placeholder="Tempat"
                              className="bg-slate-900/90 border border-blue-800 rounded-xl px-3 py-3 text-sm text-white font-semibold focus:outline-none focus:border-amber-400 placeholder-slate-400"
                            />
                            <input
                              type="date"
                              name="birthDate"
                              value={formData.birthDate}
                              onChange={handleInputChange}
                              className="bg-slate-900/90 border border-blue-800 rounded-xl px-3 py-3 text-sm text-white font-semibold focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-200 mb-1">
                            Sekolah Asal (SMP / MTs) *
                          </label>
                          <input
                            type="text"
                            name="originSchool"
                            value={formData.originSchool}
                            onChange={handleInputChange}
                            placeholder="Contoh: SMP Negeri 1 Singaparna / MTs Cipasung"
                            className="w-full bg-slate-900/90 border border-blue-800 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-amber-400 placeholder-slate-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-200 mb-1">
                          Alamat Lengkap Rumah
                        </label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={2}
                          placeholder="Alamat RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten"
                          className="w-full bg-slate-900/90 border border-blue-800 rounded-xl px-4 py-3 text-sm text-white font-semibold focus:outline-none focus:border-amber-400 placeholder-slate-400"
                        />
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black px-6 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:brightness-110 transition cursor-pointer border border-amber-300"
                        >
                          Lanjut: Data Orang Tua <ArrowRight className="w-4 h-4 text-slate-950 font-black" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: DATA ORANG TUA */}
                  {currentStep === 2 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                        <Users className="w-5 h-5 text-blue-900" /> Data Orang Tua / Wali Siswa
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 mb-1">
                            Nama Ayah / Ibu / Wali *
                          </label>
                          <input
                            type="text"
                            name="parentName"
                            value={formData.parentName}
                            onChange={handleInputChange}
                            placeholder="Contoh: Drs. Maman Abdurrahman"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-700"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 mb-1">
                            Nomor WhatsApp Orang Tua (Aktif Notifikasi) *
                          </label>
                          <input
                            type="tel"
                            name="parentPhone"
                            value={formData.parentPhone}
                            onChange={handleInputChange}
                            placeholder="Contoh: 081234567890"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-700"
                            required
                          />
                          <span className="text-[11px] text-blue-900 mt-1 block font-extrabold">
                            * Sistem otomatis akan mengirimkan konfirmasi presensi & tagihan SPP ke nomor ini.
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-5 py-3 rounded-full text-xs sm:text-sm transition cursor-pointer"
                        >
                          Kembali
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="bg-blue-900 hover:bg-blue-950 text-amber-300 font-extrabold px-6 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-950/20 transition cursor-pointer border border-blue-800"
                        >
                          Lanjut: Pilih Jurusan <ArrowRight className="w-4 h-4 text-amber-400" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: PILIH JURUSAN */}
                  {currentStep === 3 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                        <GraduationCap className="w-5 h-5 text-blue-900" /> Pilihan Konsentrasi Keahlian
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold text-blue-900 mb-1">
                            Pilihan 1 (Utama) *
                          </label>
                          <select
                            name="selectedMajor"
                            value={formData.selectedMajor}
                            onChange={handleInputChange}
                            className="w-full bg-blue-50/70 border-2 border-blue-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-extrabold focus:outline-none focus:border-blue-700 cursor-pointer"
                          >
                            {majors.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.code} - {m.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-slate-700 mb-1">
                            Pilihan 2 (Cadangan)
                          </label>
                          <select
                            name="secondMajor"
                            value={formData.secondMajor}
                            onChange={handleInputChange}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-700 cursor-pointer"
                          >
                            {majors.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.code} - {m.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Selected Major Highlight Card */}
                      <div className="p-5 rounded-2xl bg-blue-900 text-white border border-blue-800 flex items-center gap-4 shadow-md">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-blue-700 flex items-center justify-center font-black text-amber-300 text-lg shrink-0">
                          {selectedMajorObj.code}
                        </div>
                        <div className="text-xs space-y-1">
                          <p className="font-extrabold text-white text-sm">{selectedMajorObj.fullName}</p>
                          <p className="text-slate-300 leading-relaxed font-medium">{selectedMajorObj.description}</p>
                          <p className="text-amber-300 font-extrabold mt-1">
                            Sisa Kuota: {selectedMajorObj.quota - selectedMajorObj.registeredCount} Kursi
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-5 py-3 rounded-full text-xs sm:text-sm transition cursor-pointer"
                        >
                          Kembali
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(4)}
                          className="bg-blue-900 hover:bg-blue-950 text-amber-300 font-extrabold px-6 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-950/20 transition cursor-pointer border border-blue-800"
                        >
                          Lanjut: Unggah Berkas <ArrowRight className="w-4 h-4 text-amber-400" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: UNGGAH BERKAS */}
                  {currentStep === 4 && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                      <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
                        <FileCheck className="w-5 h-5 text-blue-900" /> Checklist & Upload Dokumen Berkas
                      </h3>

                      <p className="text-xs text-slate-600 font-medium">
                        Centang berkas yang sudah siap diserahkan / diunggah. Berkas asli dapat dibawa saat seleksi tes wawancara di kampus SMK Islam Cipasung.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                          onClick={() => handleDocToggle('ijazah')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition ${
                            formData.documentsUploaded.ijazah
                              ? 'bg-blue-50/80 border-blue-300 text-slate-900'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          <div className="text-xs">
                            <p className="font-extrabold text-sm text-slate-900">1. Fotokopi Ijazah / SKL SMP</p>
                            <p className="text-[11px] text-slate-500 font-semibold">Legalisir 2 Lembar</p>
                          </div>
                          <CheckCircle2
                            className={`w-6 h-6 ${
                              formData.documentsUploaded.ijazah ? 'text-blue-900' : 'text-slate-300'
                            }`}
                          />
                        </div>

                        <div
                          onClick={() => handleDocToggle('kk')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition ${
                            formData.documentsUploaded.kk
                              ? 'bg-blue-50/80 border-blue-300 text-slate-900'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          <div className="text-xs">
                            <p className="font-extrabold text-sm text-slate-900">2. Kartu Keluarga (KK)</p>
                            <p className="text-[11px] text-slate-500 font-semibold">Fotokopi 2 Lembar</p>
                          </div>
                          <CheckCircle2
                            className={`w-6 h-6 ${
                              formData.documentsUploaded.kk ? 'text-blue-900' : 'text-slate-300'
                            }`}
                          />
                        </div>

                        <div
                          onClick={() => handleDocToggle('akta')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition ${
                            formData.documentsUploaded.akta
                              ? 'bg-blue-50/80 border-blue-300 text-slate-900'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          <div className="text-xs">
                            <p className="font-extrabold text-sm text-slate-900">3. Akta Kelahiran</p>
                            <p className="text-[11px] text-slate-500 font-semibold">Fotokopi 2 Lembar</p>
                          </div>
                          <CheckCircle2
                            className={`w-6 h-6 ${
                              formData.documentsUploaded.akta ? 'text-blue-900' : 'text-slate-300'
                            }`}
                          />
                        </div>

                        <div
                          onClick={() => handleDocToggle('foto')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition ${
                            formData.documentsUploaded.foto
                              ? 'bg-blue-50/80 border-blue-300 text-slate-900'
                              : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                        >
                          <div className="text-xs">
                            <p className="font-extrabold text-sm text-slate-900">4. Pasfoto 3x4 (Latar Merah)</p>
                            <p className="text-[11px] text-slate-500 font-semibold">Cetakan 4 Lembar</p>
                          </div>
                          <CheckCircle2
                            className={`w-6 h-6 ${
                              formData.documentsUploaded.foto ? 'text-blue-900' : 'text-slate-300'
                            }`}
                          />
                        </div>
                      </div>

                      {/* PPDB Payment Proof Upload Card */}
                      <div className="p-5 rounded-2xl bg-indigo-50/90 border-2 border-indigo-200 space-y-3">
                        <div className="flex items-center justify-between border-b border-indigo-200/80 pb-2">
                          <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5 uppercase tracking-wide">
                            <Upload className="w-4 h-4 text-indigo-700" /> Unggah Bukti Transfer Biaya Pendaftaran PPDB (Rp 250.000)
                          </span>
                          <span className="text-[10px] bg-indigo-200/80 text-indigo-900 px-2.5 py-0.5 rounded-full font-bold">
                            Rekening BSI: 7182-9900-11
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="text-[11px] font-extrabold text-slate-800 block mb-1">
                              Nama Pemilik Rekening / Wali Pengirim *
                            </label>
                            <input
                              type="text"
                              name="paymentSenderName"
                              placeholder="Contoh: H. Maman Abdurrahman"
                              value={formData.paymentSenderName}
                              onChange={handleInputChange}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-extrabold text-slate-800 block mb-1">
                              Bank / E-Wallet Pengirim *
                            </label>
                            <input
                              type="text"
                              name="paymentBankSender"
                              placeholder="Contoh: Transfer BSI Mobile / BRImo"
                              value={formData.paymentBankSender}
                              onChange={handleInputChange}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-extrabold text-slate-800 block mb-1">
                            Foto / File Resi Struk Bukti Transfer:
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProofFileUpload}
                            className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-indigo-900 file:text-amber-300 hover:file:bg-indigo-950 cursor-pointer"
                          />
                        </div>

                        {formData.paymentProofUrl && (
                          <div className="pt-1 flex items-center gap-3 bg-white p-2.5 rounded-xl border border-indigo-200">
                            <img
                              src={formData.paymentProofUrl}
                              alt="Bukti Transfer PPDB"
                              className="w-12 h-12 object-cover rounded-lg border border-slate-300"
                            />
                            <div className="text-[11px]">
                              <p className="font-extrabold text-indigo-950">Foto Struk Siap Diunggah</p>
                              <p className="text-slate-500">Akan diverifikasi oleh Panitia PPDB SMK Islam Cipasung.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold">Konfirmasi Pendaftaran</p>
                          <p className="text-[11px] text-amber-800 font-medium">
                            Dengan mengklik "Kirim Pendaftaran", data Anda akan tersimpan di sistem PPDB SMK Islam Cipasung dan Anda akan mendapatkan Kartu Pendaftaran Digital.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-5 py-3 rounded-full text-xs sm:text-sm transition cursor-pointer"
                        >
                          Kembali
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-900 hover:bg-blue-950 text-amber-300 font-extrabold px-8 py-3.5 rounded-full text-xs sm:text-sm shadow-lg shadow-blue-950/20 flex items-center gap-2 transition cursor-pointer border border-blue-800"
                        >
                          <CheckCircle2 className="w-5 h-5 text-amber-400" />
                          Kirim Pendaftaran PPDB 2026
                        </button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </>
            )}

            {/* STEP 5: REGISTRATION CARD / BUKTI PENDAFTARAN SUKSES */}
            {currentStep === 5 && lastSubmittedApplicant && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center mx-auto text-2xl shadow-xs">
                  <CheckCircle2 className="w-10 h-10 text-blue-800" />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Pendaftaran PPDB Berhasil Disimpan!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-lg mx-auto font-medium">
                    Selamat! Data calon siswa a.n{' '}
                    <span className="text-blue-900 font-extrabold">{lastSubmittedApplicant.fullName}</span> telah terdaftar.
                  </p>
                </div>

                {/* Print Registration Slip Card */}
                <div className="max-w-2xl mx-auto bg-slate-50 border-2 border-blue-300 rounded-3xl p-6 text-left space-y-4 shadow-md relative">
                  <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                    <div>
                      <h4 className="font-extrabold text-lg text-slate-900">SMK ISLAM CIPASUNG</h4>
                      <p className="text-xs text-blue-900 font-extrabold">KARTU BUKTI PENDAFTARAN PPDB 2026/2027</p>
                      <p className="text-[11px] text-slate-500 font-medium">Singaparna, Kabupaten Tasikmalaya</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-blue-900 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-800">
                        {lastSubmittedApplicant.id}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                        Tgl: {lastSubmittedApplicant.registrationDate}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                    <div>
                      <span className="text-slate-500 block">Nama Lengkap:</span>
                      <span className="font-black text-slate-900 text-sm">
                        {lastSubmittedApplicant.fullName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">NISN / NIK:</span>
                      <span className="font-bold text-slate-900">{lastSubmittedApplicant.nisn}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Sekolah Asal:</span>
                      <span className="font-bold text-slate-900">{lastSubmittedApplicant.originSchool}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Pilihan Jurusan:</span>
                      <span className="font-extrabold text-blue-900 uppercase">
                        {lastSubmittedApplicant.selectedMajor}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Orang Tua / Wali:</span>
                      <span className="font-bold text-slate-900">{lastSubmittedApplicant.parentName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Status Awal:</span>
                      <span className="bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded text-[11px] border border-amber-200">
                        {lastSubmittedApplicant.status}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <QrCode className="w-8 h-8 text-slate-800" />
                      <span>Scan verifikasi Panitia PPDB</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-medium">Panitia PPDB SMK Islam Cipasung</p>
                      <p className="text-xs font-extrabold text-blue-900">TERVERIFIKASI SISTEM</p>
                    </div>
                  </div>
                </div>

                {/* Print & Action Buttons */}
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-900 hover:bg-blue-950 text-amber-300 font-extrabold px-6 py-2.5 rounded-full text-xs flex items-center gap-2 shadow-md border border-blue-800 transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-amber-400" /> Cetak Kartu Bukti
                  </button>

                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setLastSubmittedApplicant(null);
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold px-6 py-2.5 rounded-full text-xs flex items-center gap-2 transition cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" /> Daftar Siswa Lain
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* TAB 2: CEK STATUS PENDAFTARAN */}
        {activeSubTab === 'status' && (
          <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-6 sm:p-8 shadow-md max-w-3xl mx-auto space-y-6 text-slate-800">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-slate-900">Cek Status Hasil Seleksi PPDB</h3>
              <p className="text-xs text-slate-600 font-medium">
                Masukkan Kode Pendaftaran (contoh: PPDB-2026-001) atau NISN calon siswa.
              </p>
            </div>

            <form onSubmit={handleSearchStatus} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masukkan Nomor Pendaftaran / NISN..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-700"
              />
              <button
                type="submit"
                className="bg-blue-900 hover:bg-blue-950 text-amber-300 font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md border border-blue-800 transition cursor-pointer"
              >
                <Search className="w-4 h-4 text-amber-400" /> Cari
              </button>
            </form>

            {hasSearched && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 border-t border-slate-200">
                {searchResult ? (
                  <div className="bg-slate-50 p-5 rounded-2xl border-2 border-blue-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs text-blue-900 font-extrabold">{searchResult.id}</span>
                        <h4 className="text-lg font-extrabold text-slate-900">{searchResult.fullName}</h4>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                          searchResult.status === 'Diterima' || searchResult.status === 'Lulus Seleksi'
                            ? 'bg-blue-900 text-amber-300 border-blue-800'
                            : searchResult.status === 'Menunggu Verifikasi'
                            ? 'bg-amber-100 text-amber-900 border-amber-200'
                            : 'bg-rose-100 text-rose-800 border-rose-200'
                        }`}
                      >
                        {searchResult.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-semibold">
                      <div>
                        <span className="text-slate-400">NISN:</span> {searchResult.nisn}
                      </div>
                      <div>
                        <span className="text-slate-400">Pilihan Jurusan:</span>{' '}
                        <span className="text-blue-900 font-extrabold uppercase">{searchResult.selectedMajor}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Sekolah Asal:</span> {searchResult.originSchool}
                      </div>
                      <div>
                        <span className="text-slate-400">Tanggal Daftar:</span> {searchResult.registrationDate}
                      </div>
                    </div>

                    {searchResult.notes && (
                      <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 italic font-medium">
                        Catatan Panitia: "{searchResult.notes}"
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-slate-50 rounded-2xl text-slate-500 text-xs font-semibold">
                    <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    Data pendaftaran tidak ditemukan. Pastikan Nomor Pendaftaran atau NISN yang dimasukkan sudah benar.
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

