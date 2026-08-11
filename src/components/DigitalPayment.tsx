import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard,
  CheckCircle2,
  QrCode,
  Building,
  ShieldCheck,
  Search,
  Clock,
  Printer,
  Download,
  AlertCircle,
  Copy,
  Receipt,
  Sparkles,
  Upload,
} from 'lucide-react';
import { InvoiceItem, StudentRecord } from '../types';

import { UserSession } from './LoginModal';

interface DigitalPaymentProps {
  invoices: InvoiceItem[];
  students: StudentRecord[];
  onUpdateInvoiceStatus: (
    invoiceId: string,
    status: 'Menunggu Verifikasi' | 'Lunas',
    method: string,
    proofData?: {
      paymentProofUrl?: string;
      paymentSenderName?: string;
      paymentBankSender?: string;
      paymentNotes?: string;
    }
  ) => void;
  currentUser?: UserSession;
  onOpenLoginModal?: () => void;
}

export const DigitalPayment: React.FC<DigitalPaymentProps> = ({
  invoices,
  students,
  onUpdateInvoiceStatus,
  currentUser,
  onOpenLoginModal,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'STD-2025-01');
  const [activePaymentMethod, setActivePaymentMethod] = useState<'va_bsi' | 'va_bri' | 'va_mandiri' | 'va_bca' | 'qris'>('va_bsi');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [inspectInvoice, setInspectInvoice] = useState<InvoiceItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Upload Proof State
  const [proofUrl, setProofUrl] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80');
  const [senderName, setSenderName] = useState<string>('');
  const [bankSender, setBankSender] = useState<string>('BSI / Bank Syariah Indonesia');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProofUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Access Guard: Only accessible when logged in as Murid, Wali, Guru, or Admin
  if (currentUser?.role === 'umum') {
    return (
      <section className="py-20 bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-slate-900/90 border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center mx-auto shadow-lg border border-amber-300">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400/10 text-amber-300 border border-amber-400/30 inline-block">
              Akses Khusus Murid / Wali Murid
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Portal Pembayaran SPP Digital
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              Halaman tagihan SPP bulanan, riwayat kuitansi digital, dan metode QRIS/VA dilindungi dan hanya dapat diakses setelah login dengan Akun Siswa atau Wali Murid.
            </p>
          </div>
          <button
            onClick={onOpenLoginModal}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Login Akun Murid / Wali Murid</span>
          </button>
        </div>
      </section>
    );
  }

  const studentInvoices = invoices.filter((inv) => inv.studentId === selectedStudentId);
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePayInvoice = (inv: InvoiceItem) => {
    setSelectedInvoice(inv);
    setInspectInvoice(null);
  };

  const handleConfirmPayment = () => {
    if (!selectedInvoice) return;

    if (!senderName.trim()) {
      alert('⚠️ Wajib mengisi Nama Pemilik Rekening / Pengirim sebelum mengirim konfirmasi!');
      return;
    }
    if (!proofUrl) {
      alert('⚠️ Wajib mengunggah Foto / File Struk Bukti Transfer Pembayaran!');
      return;
    }

    let methodName = 'Virtual Account BSI Syariah';
    if (activePaymentMethod === 'va_bri') methodName = 'Virtual Account BRI';
    if (activePaymentMethod === 'va_mandiri') methodName = 'Virtual Account Bank Mandiri';
    if (activePaymentMethod === 'va_bca') methodName = 'Virtual Account BCA';
    if (activePaymentMethod === 'qris') methodName = 'QRIS Instant Transfer';

    const proofData = {
      paymentProofUrl: proofUrl,
      paymentSenderName: senderName.trim(),
      paymentBankSender: bankSender || 'Transfer Bank BSI / BRI',
      paymentNotes: 'Pembayaran dikonfirmasi melalui Portal SPP Online & Bukti terlampir.',
    };

    // Update status to 'Menunggu Verifikasi' - Status LUNAS only appears AFTER admin verification!
    onUpdateInvoiceStatus(selectedInvoice.id, 'Menunggu Verifikasi', methodName, proofData);

    const pendingInv: InvoiceItem = {
      ...selectedInvoice,
      status: 'Menunggu Verifikasi',
      paymentMethod: methodName,
      paymentDate: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      ...proofData,
    };

    setInspectInvoice(pendingInv);
    setSelectedInvoice(null);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 },
    });

    alert('✓ Bukti pembayaran berhasil dikirim! Status tagihan kini MENUNGGU VERIFIKASI ADMIN KEUANGAN.');
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-100/90 text-slate-800 min-h-screen bg-grid-pattern relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-extrabold uppercase tracking-wider border border-slate-800 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Sistem Pembayaran Digital Terintegrasi & Aman
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Portal Pembayaran SPP & Biaya Pendidikan
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Bayar SPP bulanan, Uang Gedung, dan biaya pendidikan online. Unggah bukti transfer untuk diverifikasi oleh Admin Keuangan sekolah.
          </p>
        </div>

        {/* Student Selector Bar */}
        <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl border-2 border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 text-amber-300 flex items-center justify-center font-extrabold text-sm border border-blue-800 shadow-sm shrink-0">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block font-extrabold uppercase tracking-wider">Pilih Siswa / Tagihan:</span>
              <select
                value={selectedStudentId}
                onChange={(e) => {
                  setSelectedStudentId(e.target.value);
                  setSelectedInvoice(null);
                  setInspectInvoice(null);
                }}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-extrabold text-slate-900 focus:outline-none focus:border-blue-700 cursor-pointer"
              >
                {students.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.fullName} ({std.classGrade} - NIS: {std.nis})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-700 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 font-semibold">
            <span>Orang Tua: <strong className="text-slate-900">{currentStudent?.parentName}</strong></span>
            <span>•</span>
            <span className="text-blue-900 font-extrabold">WA: {currentStudent?.parentPhone}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Invoice List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-blue-800" /> Daftar Tagihan Siswa
            </h3>

            {studentInvoices.length > 0 ? (
              studentInvoices.map((inv) => (
                <motion.div
                  key={inv.id}
                  whileHover={{ y: -2 }}
                  className={`p-5 rounded-3xl border-2 transition-all ${
                    inv.status === 'Lunas'
                      ? 'bg-white border-emerald-300 shadow-sm'
                      : inv.status === 'Menunggu Verifikasi'
                      ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:border-blue-600/50 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[11px] font-extrabold text-blue-800">{inv.invoiceNo}</span>
                      <h4 className="text-base font-extrabold text-slate-900">
                        {inv.feeType} - {inv.monthPeriod}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">Tenggat Waktu: {inv.dueDate}</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                        inv.status === 'Lunas'
                          ? 'bg-emerald-900 text-amber-300 border-emerald-800'
                          : inv.status === 'Menunggu Verifikasi'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      {inv.status === 'Lunas'
                        ? '✓ LUNAS'
                        : inv.status === 'Menunggu Verifikasi'
                        ? '⏳ MENUNGGU VERIFIKASI'
                        : 'Belum Dibayar'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-[11px] text-slate-500 block font-semibold">Jumlah Biaya:</span>
                      <span className="text-lg font-black text-slate-900">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {inv.status === 'Belum Dibayar' && (
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handlePayInvoice(inv)}
                          className="bg-blue-900 hover:bg-blue-950 text-amber-300 font-extrabold px-4 py-2 rounded-full text-xs shadow-md shadow-blue-950/20 transition flex items-center gap-1.5 border border-blue-800 cursor-pointer"
                        >
                          <CreditCard className="w-4 h-4 text-amber-400" /> Bayar & Upload Bukti
                        </motion.button>
                      )}

                      {inv.status === 'Menunggu Verifikasi' && (
                        <button
                          onClick={() => {
                            setInspectInvoice(inv);
                            setSelectedInvoice(null);
                          }}
                          className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold px-3.5 py-1.5 rounded-xl text-xs border border-amber-300 flex items-center gap-1.5 cursor-pointer transition"
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-700" /> Cek Bukti Transfer
                        </button>
                      )}

                      {inv.status === 'Lunas' && (
                        <button
                          onClick={() => {
                            setInspectInvoice(inv);
                            setSelectedInvoice(null);
                          }}
                          className="bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-black px-3.5 py-1.5 rounded-xl text-xs border border-emerald-300 flex items-center gap-1.5 cursor-pointer transition"
                        >
                          <Receipt className="w-3.5 h-3.5 text-emerald-700" /> Lihat Kuitansi PDF ({inv.receiptNo || 'KWT-001'})
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center p-8 bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs font-semibold">
                Tidak ada tagihan untuk siswa ini.
              </div>
            )}
          </div>

          {/* Right Column: Payment Portal Interface or Receipt */}
          <div className="lg:col-span-5">
            {/* If Payment Process Selected */}
            {selectedInvoice ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border-2 border-blue-300 p-6 space-y-5 shadow-lg text-left"
              >
                <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                  <div>
                    <span className="text-xs text-blue-800 font-extrabold uppercase tracking-wider">Proses Pembayaran SPP</span>
                    <h4 className="text-lg font-extrabold text-slate-900">
                      {selectedInvoice.feeType} ({selectedInvoice.monthPeriod})
                    </h4>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                      Rp {selectedInvoice.amount.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedInvoice(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold bg-slate-100 p-1.5 rounded-lg"
                  >
                    Batal
                  </button>
                </div>

                {/* Method Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-700 block">
                    Pilih Metode Pembayaran Aman:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-extrabold">
                    <button
                      onClick={() => setActivePaymentMethod('va_bsi')}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        activePaymentMethod === 'va_bsi'
                          ? 'bg-blue-900 text-white border-blue-800 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      BSI Syariah VA
                    </button>
                    <button
                      onClick={() => setActivePaymentMethod('va_bri')}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        activePaymentMethod === 'va_bri'
                          ? 'bg-blue-900 text-white border-blue-800 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      BRI Virtual Account
                    </button>
                    <button
                      onClick={() => setActivePaymentMethod('va_mandiri')}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                        activePaymentMethod === 'va_mandiri'
                          ? 'bg-blue-900 text-white border-blue-800 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Bank Mandiri VA
                    </button>
                    <button
                      onClick={() => setActivePaymentMethod('qris')}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-1.5 cursor-pointer ${
                        activePaymentMethod === 'qris'
                          ? 'bg-blue-900 text-white border-blue-800 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-amber-400" /> QRIS All Bank
                    </button>
                  </div>
                </div>

                {/* Payment Details Box */}
                {activePaymentMethod !== 'qris' ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] text-slate-500 block font-extrabold">
                      Nomor Virtual Account Tujuan Sekolah
                    </span>
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-300 font-mono text-base font-bold text-blue-900">
                      <span>
                        {activePaymentMethod === 'va_bsi'
                          ? '9928' + currentStudent.nis
                          : activePaymentMethod === 'va_bri'
                          ? '8801' + currentStudent.nis
                          : '8910' + currentStudent.nis}
                      </span>
                      <button
                        onClick={() =>
                          handleCopy(
                            activePaymentMethod === 'va_bsi'
                              ? '9928' + currentStudent.nis
                              : '8801' + currentStudent.nis
                          )
                        }
                        className="text-xs font-sans text-blue-700 hover:text-blue-900 flex items-center gap-1 font-extrabold cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" /> {copiedCode ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Silakan transfer sejumlah Rp {selectedInvoice.amount.toLocaleString('id-ID')} ke rekening VA di atas.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
                    <QrCode className="w-24 h-24 text-slate-900 mx-auto p-2 bg-white border border-slate-200 rounded-xl shadow-xs" />
                    <p className="text-xs font-extrabold text-slate-900">Scan QRIS Menggunakan M-Banking / e-Wallet</p>
                    <p className="text-[10px] text-slate-500 font-medium">Gopay, OVO, ShopeePay, Dana, LinkAja, M-BCA, Livin, BRImo</p>
                  </div>
                )}

                {/* MANDATORY Upload Bukti Pembayaran Section */}
                <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-300/90 space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <span className="text-xs font-black text-amber-950 flex items-center gap-1.5 uppercase">
                      <Upload className="w-4 h-4 text-amber-600" /> Wajib Unggah Bukti Transfer
                    </span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                      Syarat Verifikasi
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-800 block mb-1">
                        Nama Pemilik Rekening / Pengirim *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: H. Maman Abdurrahman"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-700"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-slate-800 block mb-1">
                        Bank / Channel Pengirim *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: BSI Mobile / BRImo / Gopay"
                        value={bankSender}
                        onChange={(e) => setBankSender(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-700"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-slate-800 block mb-1">
                        Foto / File Resi Struk Transfer *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-900 file:text-amber-300 hover:file:bg-blue-950 cursor-pointer"
                        required
                      />
                    </div>

                    {proofUrl && (
                      <div className="pt-2 flex items-center gap-3 bg-white p-2.5 rounded-xl border border-amber-200">
                        <img src={proofUrl} alt="Preview Bukti Transfer" className="w-12 h-12 object-cover rounded-lg border border-slate-300" />
                        <div className="text-[11px]">
                          <span className="text-emerald-700 font-extrabold block">✓ Bukti Transfer Terlampir</span>
                          <span className="text-slate-500 font-medium">Akan diverifikasi oleh Admin Keuangan Sekolah.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmPayment}
                  className="w-full bg-blue-900 hover:bg-blue-950 text-amber-300 font-extrabold py-3.5 rounded-full shadow-lg shadow-blue-950/20 text-xs sm:text-sm flex items-center justify-center gap-2 border border-blue-800 cursor-pointer transition"
                >
                  <CheckCircle2 className="w-5 h-5 text-amber-400" /> Konfirmasi & Kirim Bukti Ke Admin
                </motion.button>
              </motion.div>
            ) : inspectInvoice ? (
              inspectInvoice.status === 'Lunas' ? (
                /* OFFICIAL LUNAS RECEIPT CARD (DOWNLOADABLE PDF) */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl border-2 border-emerald-400 p-6 space-y-4 shadow-xl text-left relative overflow-hidden"
                >
                  <div className="text-center pb-4 border-b-2 border-slate-100 space-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto text-xl border border-emerald-300 shadow-xs">
                      <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                    </div>
                    <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest block pt-1">
                      SMK ISLAM CIPASUNG • KEUSANGAN
                    </span>
                    <h4 className="font-black text-slate-900 text-xl tracking-tight">KUITANSI DIGITAL LUNAS</h4>
                    <p className="text-xs text-blue-900 font-mono font-black">{inspectInvoice.receiptNo || 'KWT/2026/07/8892'}</p>
                  </div>

                  <div className="space-y-2.5 text-xs font-semibold bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Nama Siswa:</span>
                      <strong className="text-slate-900 font-black">{inspectInvoice.studentName} ({inspectInvoice.classGrade})</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">NIS / No. Tagihan:</span>
                      <strong className="text-blue-900 font-mono">{inspectInvoice.nis} • {inspectInvoice.invoiceNo}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Jenis Tagihan:</span>
                      <strong className="text-slate-900">{inspectInvoice.feeType} ({inspectInvoice.monthPeriod})</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Nominal Lunas:</span>
                      <strong className="text-emerald-700 font-black text-sm">
                        Rp {inspectInvoice.amount.toLocaleString('id-ID')}
                      </strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500">Metode & Pengirim:</span>
                      <span className="font-bold text-slate-900">{inspectInvoice.paymentMethod || 'Transfer Bank'} ({inspectInvoice.paymentSenderName || 'Wali Santri'})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Waktu Verifikasi Admin:</span>
                      <span className="text-slate-700">{inspectInvoice.paymentDate || '26 Juli 2026'}</span>
                    </div>
                  </div>

                  <div className="pt-2 text-center space-y-3">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-[11px] font-medium flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                      <span>Telah diverifikasi resmi oleh Bendahara Keuangan SMK Islam Cipasung.</span>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="w-full bg-blue-900 hover:bg-blue-950 text-amber-300 font-black py-3.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md border border-blue-800 cursor-pointer transition"
                    >
                      <Printer className="w-4 h-4 text-amber-400" /> Cetak / Download Kuitansi PDF
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* MENUNGGU VERIFIKASI ADMIN CARD */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl border-2 border-amber-300 p-6 space-y-4 shadow-xl text-left"
                >
                  <div className="text-center pb-3 border-b border-slate-100 space-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto text-xl border border-amber-300">
                      <Clock className="w-7 h-7 text-amber-700" />
                    </div>
                    <span className="text-[11px] font-black text-amber-800 uppercase tracking-widest block pt-1">STATUS PEMBAYARAN</span>
                    <h4 className="font-extrabold text-slate-900 text-lg">MENUNGGU VERIFIKASI ADMIN</h4>
                    <p className="text-xs text-slate-500">{inspectInvoice.invoiceNo}</p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <p className="font-extrabold text-slate-800">Resi Bukti Transfer Yang Diunggah:</p>
                    <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-slate-900">
                      <img
                        src={inspectInvoice.paymentProofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'}
                        alt="Resi Bukti Transfer"
                        className="w-full h-44 object-cover object-top"
                      />
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 font-medium">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pengirim:</span>
                        <strong className="text-slate-900">{inspectInvoice.paymentSenderName || 'Wali Santri'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Bank / Channel:</span>
                        <strong className="text-slate-900">{inspectInvoice.paymentBankSender || 'Transfer Bank'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nominal Tagihan:</span>
                        <strong className="text-blue-900 font-extrabold">Rp {inspectInvoice.amount.toLocaleString('id-ID')}</strong>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 text-[11px] leading-relaxed">
                      💡 <strong>Catatan:</strong> Bukti transfer Anda sudah masuk ke sistem Panel Admin Keuangan Sekolah. Status LUNAS dan Kuitansi PDF resmi akan diterbitkan otomatis setelah disetujui.
                    </div>
                  </div>
                </motion.div>
              )
            ) : (
              /* Default Informational Banner */
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center mx-auto text-2xl">
                  <ShieldCheck className="w-8 h-8 text-blue-800" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900">Sistem Keuangan Digital Sekolah</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Pilih salah satu tagihan di sebelah kiri untuk membayar atau mengecek kuitansi LUNAS. Setelah Anda mengunggah bukti transfer, Admin Keuangan akan memverifikasi pembayaran Anda.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

