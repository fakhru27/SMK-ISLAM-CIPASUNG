import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  MessageSquare,
  Send,
  Phone,
  CheckCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Users,
  ShieldAlert,
} from 'lucide-react';
import { ParentNotificationItem, StudentRecord } from '../types';
import { UserSession } from './LoginModal';

interface ParentNotificationProps {
  notifications: ParentNotificationItem[];
  students: StudentRecord[];
  onAddNotification: (notification: ParentNotificationItem) => void;
  currentUser?: UserSession;
  onOpenLoginModal?: () => void;
}

export const ParentNotification: React.FC<ParentNotificationProps> = ({
  notifications,
  students,
  onAddNotification,
  currentUser,
  onOpenLoginModal,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'STD-2025-01');

  // Access Guard: Only accessible when logged in as Admin
  if (currentUser?.role !== 'admin') {
    return (
      <section className="py-20 bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-slate-900/90 border border-teal-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 text-slate-950 flex items-center justify-center mx-auto shadow-lg border border-teal-300">
            <Bell className="w-8 h-8 text-slate-950" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-400/10 text-teal-300 border border-teal-400/30 inline-block">
              Akses Khusus Admin Sekolah
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Sistem Notifikasi WA Wali Murid
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              Modul pengiriman blast pesan WhatsApp otomatis, notifikasi presensi fingerprint, dan konfirmasi tagihan khusus dikelola oleh Administrator Sekolah.
            </p>
          </div>
          <button
            onClick={onOpenLoginModal}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600 text-slate-950 font-black hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Login Akun Admin Sekolah</span>
          </button>
        </div>
      </section>
    );
  }
  const [templateType, setTemplateType] = useState<'Presensi' | 'SPP' | 'Pengumuman' | 'PPDB'>('Presensi');
  const [customPhone, setCustomPhone] = useState(students[0]?.parentPhone || '081234567890');
  const [customMessage, setCustomMessage] = useState(
    `Yth. Orang tua ${students[0]?.fullName}, menginfokan bahwa siswa telah HADIR di SMK Islam Cipasung pada pukul 06:45 WIB. Selamat belajar!`
  );

  const [isSending, setIsSending] = useState(false);
  const [lastSentWaUrl, setLastSentWaUrl] = useState<string | null>(null);

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const handleStudentChange = (stdId: string) => {
    setSelectedStudentId(stdId);
    const std = students.find((s) => s.id === stdId);
    if (std) {
      setCustomPhone(std.parentPhone);
      updatePresetMessage(templateType, std);
    }
  };

  const updatePresetMessage = (type: string, std: StudentRecord) => {
    if (type === 'Presensi') {
      setCustomMessage(
        `Yth. Bapak/Ibu ${std.parentName}, menginfokan bahwa ${std.fullName} (${std.classGrade}) telah HADIR di SMK Islam Cipasung pada pukul 06:45 WIB.`
      );
    } else if (type === 'SPP') {
      setCustomMessage(
        `Yth. Orang tua ${std.fullName}, pengingat tagihan SPP Bulan Juli 2026 sebesar Rp 350.000. Pembayaran dapat dilakukan via Virtual Account / QRIS di portal sekolah.`
      );
    } else if (type === 'Pengumuman') {
      setCustomMessage(
        `Yth. Bapak/Ibu Wali Murid SMK Islam Cipasung, diimbau menghadiri Pengajian Rutin & Silaturahmi Pesantren Cipasung pada Sabtu besok pukul 08.00 WIB.`
      );
    } else if (type === 'PPDB') {
      setCustomMessage(
        `Selamat! Pendaftaran calon siswa baru SMK Islam Cipasung TA 2026/2027 telah terverifikasi. Silakan cek kartu bukti pendaftaran di website.`
      );
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhone || !customMessage) return;

    setIsSending(true);

    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: currentStudent?.fullName || 'Siswa',
          parentPhone: customPhone,
          message: customMessage,
          type: templateType,
        }),
      });

      const data = await res.json();
      if (data.notification) {
        onAddNotification(data.notification);
        setLastSentWaUrl(data.whatsappUrl);
      }
    } catch (err) {
      console.error('Error sending notification:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-100/90 text-slate-800 min-h-screen bg-grid-pattern relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 text-xs font-extrabold uppercase tracking-wider border border-slate-800 shadow-2xs">
            <Bell className="w-4 h-4 text-amber-400" />
            Notifikasi Otomatis Pesan Orang Tua
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Sistem Notifikasi WhatsApp Orang Tua
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Kirim dan pantau notifikasi presensi kedatangan siswa, pengingat SPP, dan pengumuman sekolah secara otomatis ke WhatsApp Orang Tua.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: WhatsApp Message Broadcast Tool */}
          <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-slate-200/90 p-6 sm:p-8 shadow-lg space-y-6 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-900" /> Simulator Pengiriman Notifikasi WA
              </h3>
              <span className="bg-blue-900 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-800 shadow-2xs">
                API WhatsApp Active
              </span>
            </div>

            <form onSubmit={handleSendNotification} className="space-y-4">
              {/* Target Student Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Pilih Siswa Penerima:
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleStudentChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-extrabold focus:outline-none focus:border-blue-700 cursor-pointer"
                >
                  {students.map((std) => (
                    <option key={std.id} value={std.id}>
                      {std.fullName} ({std.classGrade}) - Ortu: {std.parentName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template Type Buttons */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Pilih Kategori Pesan:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Presensi', 'SPP', 'Pengumuman', 'PPDB'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setTemplateType(type);
                        updatePresetMessage(type, currentStudent);
                      }}
                      className={`py-2 px-3 rounded-full text-xs font-extrabold transition cursor-pointer border ${
                        templateType === type
                          ? 'bg-blue-900 text-white border-blue-800 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Nomor WhatsApp Orang Tua:
                </label>
                <input
                  type="tel"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-blue-700 font-mono"
                />
              </div>

              {/* Message Content Area */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Isi Pesan Notifikasi:
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-700 leading-relaxed"
                />
              </div>

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSending}
                className="w-full bg-blue-900 hover:bg-blue-950 text-amber-300 font-extrabold py-3.5 rounded-full shadow-lg shadow-blue-950/20 text-xs sm:text-sm flex items-center justify-center gap-2 border border-blue-800 cursor-pointer transition"
              >
                <Send className="w-4 h-4 text-amber-400" />
                {isSending ? 'Mengirim Pesan...' : 'Kirim Pesan WhatsApp Sekarang'}
              </motion.button>

              {lastSentWaUrl && (
                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 font-bold flex items-center justify-between">
                  <span>Pesan berhasil dibuat untuk pengiriman WhatsApp!</span>
                  <a
                    href={lastSentWaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-900 text-amber-300 font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1 hover:bg-blue-950 border border-blue-800 transition"
                  >
                    Buka WhatsApp <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Notification Log Feed */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-900" /> Riwayat Notifikasi Terkirim
            </h3>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {notifications.map((ntf) => (
                <motion.div
                  key={ntf.id}
                  whileHover={{ y: -2 }}
                  className="p-4 rounded-3xl bg-white border-2 border-slate-200/90 space-y-2 text-xs shadow-sm text-slate-800"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-slate-900">{ntf.studentName}</span>
                    <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-700" /> {ntf.sentAt}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed text-[11px] bg-slate-50 p-3 rounded-2xl border border-slate-200 font-medium">
                    "{ntf.message}"
                  </p>

                  <div className="flex justify-between items-center text-[10px] pt-1">
                    <span className="text-blue-900 font-extrabold flex items-center gap-1">
                      <Phone className="w-3 h-3 text-blue-700" /> WA: {ntf.parentPhone}
                    </span>
                    <span className="bg-blue-900 text-amber-300 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-800">
                      <CheckCheck className="w-3.5 h-3.5 text-amber-400" /> {ntf.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

