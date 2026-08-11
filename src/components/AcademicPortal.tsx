import React, { useState } from 'react';
import {
  LayoutDashboard,
  Award,
  Calendar,
  Clock,
  BookOpen,
  FileText,
  User,
  CheckCircle2,
  Printer,
  Download,
  GraduationCap,
  Percent,
  UserCheck,
  Users,
  Send,
  MessageSquare,
  Check,
  Sparkles,
  CreditCard,
  QrCode,
  ShieldCheck,
  Receipt,
  ArrowRight,
  Plus,
  X,
  FilePlus,
  PlusCircle,
  Trash2,
  Edit,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';
import { StudentRecord, GradeItem, AttendanceItem, InvoiceItem } from '../types';
import { UserSession } from './LoginModal';

interface AcademicPortalProps {
  students: StudentRecord[];
  gradesMap: Record<string, GradeItem[]>;
  attendanceMap: Record<string, AttendanceItem[]>;
  invoices?: InvoiceItem[];
  onUpdateInvoiceStatus?: (invoiceId: string, status: 'Menunggu Verifikasi' | 'Lunas', method: string) => void;
  onAddGrade?: (studentId: string, newGrade: GradeItem) => void;
  onDeleteGrade?: (studentId: string, gradeId: string | number) => void;
  onUpdateGrade?: (studentId: string, updatedGrade: GradeItem) => void;
  onAddAttendance?: (studentId: string, newAttendance: AttendanceItem) => void;
  onAddInvoice?: (newInvoice: InvoiceItem) => void;
  onNavigateTab?: (tab: string) => void;
  currentUser?: UserSession;
  onOpenLoginModal?: () => void;
  onSwitchRole?: (newSession: UserSession) => void;
}

export const AcademicPortal: React.FC<AcademicPortalProps> = ({
  students,
  gradesMap,
  attendanceMap,
  invoices = [],
  onUpdateInvoiceStatus,
  onAddGrade,
  onDeleteGrade,
  onUpdateGrade,
  onAddAttendance,
  onAddInvoice,
  onNavigateTab,
  currentUser,
  onOpenLoginModal,
  onSwitchRole,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'STD-2025-01');
  const [activePortalTab, setActivePortalTab] = useState<'rapor' | 'presensi' | 'spp' | 'jadwal' | 'elearning' | 'walikelas'>(() => {
    const saved = localStorage.getItem('cipasung_portal_subtab');
    if (saved) return saved as any;
    return currentUser?.role === 'walikelas' ? 'walikelas' : 'rapor';
  });

  React.useEffect(() => {
    localStorage.setItem('cipasung_portal_subtab', activePortalTab);
  }, [activePortalTab]);

  const [selectedReceiptInvoice, setSelectedReceiptInvoice] = useState<InvoiceItem | null>(null);

  // Sync state for grades map to ensure instant recalculation of average
  const [localGradesMap, setLocalGradesMap] = useState<Record<string, GradeItem[]>>(gradesMap);

  React.useEffect(() => {
    setLocalGradesMap(gradesMap);
  }, [gradesMap]);

  // Granular Role & Permission Definitions
  const isSiswa = currentUser?.role === 'siswa_wali';
  const isGuru = currentUser?.role === 'guru';
  const isWaliKelas = currentUser?.role === 'walikelas';
  const isAdmin = currentUser?.role === 'admin';

  const isAuthorized = isAdmin || isWaliKelas || isGuru;
  const canManageGrades = isAdmin || isWaliKelas || isGuru;
  const canVerifyRapor = isAdmin || isWaliKelas;
  const canInputAttendance = isAdmin || isWaliKelas || isGuru;
  const canManageSPP = isAdmin || isWaliKelas;
  const canManageSchedule = isAdmin || isWaliKelas || isGuru;
  const canManageElearning = isAdmin || isWaliKelas || isGuru;
  const canAccessWaliKelasPanel = isAdmin || isWaliKelas;

  // Auto fallback tab if current user loses access to walikelas panel
  React.useEffect(() => {
    if (!canAccessWaliKelasPanel && activePortalTab === 'walikelas') {
      setActivePortalTab('rapor');
    }
  }, [currentUser?.role, activePortalTab, canAccessWaliKelasPanel]);

  // Wali Kelas specific interactive states
  const [homeroomNotes, setHomeroomNotes] = useState<Record<string, string>>({
    'STD-2025-01': 'Sangat aktif dalam kegiatan praktikum TJKT. Tingkatkan konsistensi kehadiran sholat berjamaah.',
    'STD-2025-02': 'Menunjukkan minat tinggi pada Desain Grafis & Multimedia. Perlu perhatian pada kehadiran pagi.',
  });
  const [verifiedRapor, setVerifiedRapor] = useState<Record<string, boolean>>({
    'STD-2025-01': true,
    'STD-2025-02': false,
  });
  const [waSentStatus, setWaSentStatus] = useState<Record<string, boolean>>({});

  // Local Schedules State
  const [schedulesList, setSchedulesList] = useState([
    { id: '1', day: 'SENIN', time: '07.00 - 08.00', subject: 'Upacara Bendera & Pengarahan', teacher: 'Tim Kesiswaan', room: 'Lapangan Utama' },
    { id: '2', day: 'SENIN', time: '08.00 - 11.30', subject: 'Praktik Pemrograman Web & React', teacher: 'Budi Santoso, S.Kom.', room: 'Lab Komputer 1' },
    { id: '3', day: 'SELASA', time: '07.00 - 09.30', subject: 'Pendidikan Agama Islam & Kitab Kuning', teacher: 'Drs. M. Ramdhan, M.Ag', room: 'Ruang Teori XI-TJKT-1' },
    { id: '4', day: 'SELASA', time: '09.30 - 12.00', subject: 'Database & Cloud Infrastructure', teacher: 'Ahmad Fauzi, S.T.', room: 'Lab Cloud' },
    { id: '5', day: 'RABU', time: '07.00 - 11.00', subject: 'Bahasa Inggris Produktif / IT English', teacher: 'Siti Nurhaliza, S.Pd.', room: 'Ruang Bahasa' },
  ]);

  // Local E-Learning State
  const [elearningList, setElearningList] = useState([
    { id: '1', category: 'Modul Praktikum', title: 'Pengenalan React 19 & Tailwind CSS Vokasi Digital', teacher: 'Budi Santoso, S.Kom., M.T.', size: 'PDF 4.2 MB' },
    { id: '2', category: 'Tugas Rumah', title: 'Analisis Database Relasional & Perancangan Tabel', teacher: 'Deadline: 25 Juli 2026', size: 'PDF 1.8 MB' },
  ]);

  // Modals
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [showEditGradeModal, setShowEditGradeModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeItem | null>(null);

  const [newGradeForm, setNewGradeForm] = useState({
    subject: '',
    kkm: 75,
    nilaiTugas: 85,
    nilaiUts: 88,
    nilaiUas: 90,
  });

  const [showAddAttendanceModal, setShowAddAttendanceModal] = useState(false);
  const [newAttendanceForm, setNewAttendanceForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    status: 'Hadir' as 'Hadir' | 'Izin' | 'Sakit' | 'Alpha',
    timeIn: '07:15 WIB',
    subjectNote: 'Presensi Harian Kelas',
  });

  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [newInvoiceForm, setNewInvoiceForm] = useState({
    feeType: 'SPP Bulanan',
    monthPeriod: 'Agustus 2026',
    amount: 250000,
  });

  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [newScheduleForm, setNewScheduleForm] = useState({
    day: 'SENIN',
    time: '08.00 - 10.00',
    subject: '',
    teacher: 'Drs. M. Ramdhan, M.Ag',
    room: 'Ruang Teori XI-TJKT-1',
  });

  const [showAddElearningModal, setShowAddElearningModal] = useState(false);
  const [newElearningForm, setNewElearningForm] = useState({
    category: 'Modul Praktikum',
    title: '',
    teacher: 'Pengampu Guru TJKT',
    size: 'PDF 2.5 MB',
  });

  // Access Guard: Only accessible when logged in as Murid, Wali, Guru, or Admin
  if (currentUser?.role === 'umum') {
    return (
      <section className="py-20 bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-slate-900/90 border border-sky-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-slate-950 flex items-center justify-center mx-auto shadow-lg border border-sky-300">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-400/10 text-sky-300 border border-sky-400/30 inline-block">
              Akses Khusus Murid / Wali Murid
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Portal Nilai & Rapor Digital
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              Transkrip nilai Rapor digital, KHS semester, dan grafik kehadiran harian dilindungi dan hanya dapat diakses setelah login dengan Akun Siswa atau Wali Murid.
            </p>
          </div>
          <button
            onClick={onOpenLoginModal}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-white font-black hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Login Akun Murid / Wali Murid</span>
          </button>
        </div>
      </section>
    );
  }

  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const currentGrades = localGradesMap[selectedStudentId] || gradesMap[selectedStudentId] || [];
  const currentAttendance = attendanceMap[selectedStudentId] || [];

  // Calculate Average GPA / Rata-rata Nilai dynamically
  const avgGrade = currentGrades.length > 0
    ? (currentGrades.reduce((sum, g) => sum + Number(g.nilaiAkhir || 0), 0) / currentGrades.length).toFixed(1)
    : '0.0';

  // Handlers for grade operations
  const handleAddGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGradeForm.subject) return alert('Silakan isi nama mata pelajaran');
    const nTugas = Number(newGradeForm.nilaiTugas);
    const nUts = Number(newGradeForm.nilaiUts);
    const nUas = Number(newGradeForm.nilaiUas);
    const nAkhir = Math.round((nTugas * 0.3) + (nUts * 0.3) + (nUas * 0.4));
    let pred: 'A' | 'B' | 'C' | 'D' = 'B';
    if (nAkhir >= 90) pred = 'A';
    else if (nAkhir >= 80) pred = 'B';
    else if (nAkhir >= 70) pred = 'C';
    else pred = 'D';

    const gradeItem: GradeItem = {
      id: 'G-' + Date.now(),
      subject: newGradeForm.subject.trim(),
      kkm: Number(newGradeForm.kkm) || 75,
      nilaiTugas: nTugas,
      nilaiUts: nUts,
      nilaiUas: nUas,
      nilaiAkhir: nAkhir,
      predicate: pred,
    };

    if (onAddGrade) {
      onAddGrade(selectedStudentId, gradeItem);
    }

    setLocalGradesMap((prev) => {
      const existing = prev[selectedStudentId] || gradesMap[selectedStudentId] || [];
      return {
        ...prev,
        [selectedStudentId]: [gradeItem, ...existing],
      };
    });

    setShowAddGradeModal(false);
    setNewGradeForm({ subject: '', kkm: 75, nilaiTugas: 85, nilaiUts: 88, nilaiUas: 90 });
    alert(`✓ Mata pelajaran "${gradeItem.subject}" berhasil ditambahkan untuk ${currentStudent.fullName}! Rata-rata nilai diperbarui.`);
  };

  const handleOpenEditModal = (grade: GradeItem) => {
    setEditingGrade(grade);
    setNewGradeForm({
      subject: grade.subject,
      kkm: grade.kkm,
      nilaiTugas: grade.nilaiTugas,
      nilaiUts: grade.nilaiUts,
      nilaiUas: grade.nilaiUas,
    });
    setShowEditGradeModal(true);
  };

  const handleEditGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrade) return;
    if (!newGradeForm.subject) return alert('Silakan isi nama mata pelajaran');

    const nTugas = Number(newGradeForm.nilaiTugas);
    const nUts = Number(newGradeForm.nilaiUts);
    const nUas = Number(newGradeForm.nilaiUas);
    const nAkhir = Math.round((nTugas * 0.3) + (nUts * 0.3) + (nUas * 0.4));
    let pred: 'A' | 'B' | 'C' | 'D' = 'B';
    if (nAkhir >= 90) pred = 'A';
    else if (nAkhir >= 80) pred = 'B';
    else if (nAkhir >= 70) pred = 'C';
    else pred = 'D';

    const updatedGrade: GradeItem = {
      ...editingGrade,
      subject: newGradeForm.subject.trim(),
      kkm: Number(newGradeForm.kkm) || 75,
      nilaiTugas: nTugas,
      nilaiUts: nUts,
      nilaiUas: nUas,
      nilaiAkhir: nAkhir,
      predicate: pred,
    };

    if (onUpdateGrade) {
      onUpdateGrade(selectedStudentId, updatedGrade);
    }

    setLocalGradesMap((prev) => {
      const existing = prev[selectedStudentId] || gradesMap[selectedStudentId] || [];
      return {
        ...prev,
        [selectedStudentId]: existing.map((g) => (String(g.id) === String(editingGrade.id) ? updatedGrade : g)),
      };
    });

    setShowEditGradeModal(false);
    setEditingGrade(null);
    setNewGradeForm({ subject: '', kkm: 75, nilaiTugas: 85, nilaiUts: 88, nilaiUas: 90 });
    alert(`✓ Mata pelajaran "${updatedGrade.subject}" berhasil diperbarui! Rata-rata nilai otomatis tersinkronisasi.`);
  };

  const handleDeleteGradeSubmit = (gradeId: string | number, subjectName: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus mata pelajaran "${subjectName}" dari transkrip ${currentStudent.fullName}?`)) {
      if (onDeleteGrade) {
        onDeleteGrade(selectedStudentId, gradeId);
      }

      setLocalGradesMap((prev) => {
        const existing = prev[selectedStudentId] || gradesMap[selectedStudentId] || [];
        return {
          ...prev,
          [selectedStudentId]: existing.filter((g) => String(g.id) !== String(gradeId)),
        };
      });

      alert(`✓ Mata pelajaran "${subjectName}" berhasil dihapus dari transkrip ${currentStudent.fullName}.`);
    }
  };

  const handleAddAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const attItem: AttendanceItem = {
      date: newAttendanceForm.date,
      status: newAttendanceForm.status,
      timeIn: newAttendanceForm.timeIn,
      subjectNote: newAttendanceForm.subjectNote,
    };
    if (onAddAttendance) {
      onAddAttendance(selectedStudentId, attItem);
    }
    setShowAddAttendanceModal(false);
    alert(`Presensi ${newAttendanceForm.status} berhasil dicatat untuk ${currentStudent.fullName}!`);
  };

  const handleAddInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invItem: InvoiceItem = {
      id: `INV-${Date.now()}`,
      invoiceNo: `INV/2026/SPP/${Math.floor(100 + Math.random() * 900)}`,
      studentId: selectedStudentId,
      studentName: currentStudent.fullName,
      nis: currentStudent.nis,
      classGrade: currentStudent.classGrade,
      feeType: (newInvoiceForm.feeType as 'SPP Bulanan' | 'Uang Gedung' | 'Seragam' | 'Ujian / Prakerin') || 'SPP Bulanan',
      monthPeriod: newInvoiceForm.monthPeriod,
      amount: Number(newInvoiceForm.amount),
      status: 'Menunggu Verifikasi',
      dueDate: '10 ' + newInvoiceForm.monthPeriod,
    };
    if (onAddInvoice) {
      onAddInvoice(invItem);
    }
    setShowAddInvoiceModal(false);
    alert(`Tagihan ${newInvoiceForm.feeType} (${newInvoiceForm.monthPeriod}) berhasil diterbitkan!`);
  };

  const handleAddScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleForm.subject) return alert('Silakan isi nama mata pelajaran');
    setSchedulesList((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        day: newScheduleForm.day,
        time: newScheduleForm.time,
        subject: newScheduleForm.subject,
        teacher: newScheduleForm.teacher,
        room: newScheduleForm.room,
      },
    ]);
    setShowAddScheduleModal(false);
    setNewScheduleForm({ day: 'SENIN', time: '08.00 - 10.00', subject: '', teacher: 'Drs. M. Ramdhan, M.Ag', room: 'Ruang Teori XI-TJKT-1' });
    alert('Jadwal pelajaran baru berhasil ditambahkan!');
  };

  const handleAddElearningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newElearningForm.title) return alert('Silakan isi judul modul');
    setElearningList((prev) => [
      {
        id: Date.now().toString(),
        category: newElearningForm.category,
        title: newElearningForm.title,
        teacher: newElearningForm.teacher,
        size: newElearningForm.size,
      },
      ...prev,
    ]);
    setShowAddElearningModal(false);
    setNewElearningForm({ category: 'Modul Praktikum', title: '', teacher: 'Pengampu Guru TJKT', size: 'PDF 2.5 MB' });
    alert('Modul pembelajaran digital berhasil diunggah!');
  };

  return (
    <section className="py-12 lg:py-16 bg-slate-100/90 text-slate-800 min-h-screen bg-grid-pattern relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 text-amber-300 text-xs font-extrabold uppercase tracking-wider border border-blue-800 shadow-md">
            <LayoutDashboard className="w-4 h-4 text-amber-400" />
            {isSiswa ? 'Portal Informasi Akademik Siswa & Wali' : isGuru ? 'Portal Guru Mapel & Penilaian' : isWaliKelas ? 'Panel Pembina & Wali Kelas XI TJKT 1' : 'Portal Utama Kontrol Akademik'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            {isSiswa ? 'Portal Informasi Akademik Siswa' : isGuru ? 'Panel Guru Pengajar & Penilaian' : isWaliKelas ? 'Panel Pembina & Wali Kelas' : 'Portal Manajemen Sekolah Terpadu'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            {isSiswa
              ? 'Akses khusus siswa & wali murid: Transkrip nilai rapor digital, rekapan presensi harian, tagihan SPP online, dan materi e-learning.'
              : isGuru
              ? 'Akses guru mapel: Input nilai mata pelajaran, presensi mengajar harian, dan unggah modul pembelajaran.'
              : isWaliKelas
              ? 'Akses wali kelas: Monitoring rekap XI TJKT 1, verifikasi e-rapor kelas, catatan pengembangan karakter, dan laporan WhatsApp orang tua.'
              : 'Akses administrator utama: Pengelolaan penuh transkrip nilai, kehadiran, tagihan SPP, dan seluruh sistem sekolah.'}
          </p>
        </div>

        {/* Quick Role Simulator Bar */}
        <div className="bg-slate-950 p-3.5 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                Simulasi Hak Akses Sistem Sekolah:
              </span>
              <p className="text-xs text-slate-300 font-semibold">
                Sesi Aktif: <strong className="text-white font-extrabold">{currentUser?.name || 'Tamu'}</strong> ({isSiswa ? 'Murid / Wali' : isGuru ? 'Guru Mapel' : isWaliKelas ? 'Wali Kelas' : isAdmin ? 'Admin' : 'Umum'})
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <button
              onClick={() =>
                onSwitchRole?.({
                  role: 'siswa_wali',
                  name: 'Muhammad Rizky Pratama (Siswa XI TJKT 1)',
                  emailOrNis: '12234051',
                  avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
                  detail: 'Akses Portal Rapor Digital, SPP & E-Learning Siswa',
                })
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                isSiswa ? 'bg-sky-500 text-white shadow-md' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> 🎓 Mode Murid
            </button>
            <button
              onClick={() =>
                onSwitchRole?.({
                  role: 'guru',
                  name: 'Ibu Hj. Maryam, M.Pd (Guru Pengajar TJKT)',
                  emailOrNis: 'guru@smkislamcipasung.sch.id',
                  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
                  detail: 'Akses Input Nilai & Presensi Jam Mengajar',
                })
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                isGuru ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> 👩‍🏫 Mode Guru Mapel
            </button>
            <button
              onClick={() =>
                onSwitchRole?.({
                  role: 'walikelas',
                  name: 'Bapak Drs. M. Ramdhan, M.Ag (Wali Kelas XI TJKT 1)',
                  emailOrNis: 'walikelas@smkislamcipasung.sch.id',
                  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
                  detail: 'Akses Monitoring XI TJKT 1 & Sahkan E-Rapor',
                })
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                isWaliKelas ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" /> 👨‍🏫 Mode Wali Kelas
            </button>
            <button
              onClick={() =>
                onSwitchRole?.({
                  role: 'admin',
                  name: 'Bapak H. Sofyan, S.Kom (Administrator Utama)',
                  emailOrNis: 'admin@smkislamcipasung.sch.id',
                  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                  detail: 'Akses Penuh Pengelolaan Sistem & Data',
                })
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                isAdmin ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> 🛡️ Mode Admin
            </button>
          </div>
        </div>

        {/* Dynamic Control Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-amber-400/50 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              {isSiswa ? <GraduationCap className="w-6 h-6" /> : isGuru ? <BookOpen className="w-6 h-6" /> : isWaliKelas ? <UserCheck className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300 block">
                {isSiswa ? 'Mode Murid & Wali Murid' : isGuru ? 'Mode Guru Mapel / Pengajar' : isWaliKelas ? 'Mode Wali Kelas XI TJKT 1' : 'Mode Administrator Superuser'}
              </span>
              <p className="text-xs font-bold text-slate-200">
                {isSiswa
                  ? 'Anda memiliki hak akses khusus siswa: Melihat transkrip rapor, presensi harian, SPP, dan modul belajar. Pengeditan nilai dikunci untuk integritas data.'
                  : isGuru
                  ? 'Wewenang Guru Mapel: Tambah/edit nilai mata pelajaran, catat presensi jam pelajaran, dan unggah modul e-learning.'
                  : isWaliKelas
                  ? 'Wewenang Wali Kelas: Monitoring rekapitulasi kelas binaan, mengesahkan e-rapor, dan memberikan catatan karakter.'
                  : 'Wewenang Administrator: Kontrol penuh atas seluruh fitur, database nilai, presensi, dan tagihan SPP sekolah.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/40">
              Hak Akses Disesuaikan
            </span>
          </div>
        </div>

        {/* Student Selector & Account Card */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50/50 p-6 rounded-3xl border-2 border-slate-200/90 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900">{currentStudent.fullName}</h3>
                <span className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 text-amber-300 text-xs font-bold px-3 py-0.5 rounded-full border border-blue-800 shadow-2xs">
                  {currentStudent.classGrade}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                NIS: <span className="text-slate-800 font-mono font-bold">{currentStudent.nis}</span> | NISN: <span className="text-slate-800 font-mono font-bold">{currentStudent.nisn}</span>
              </p>
              <p className="text-xs text-blue-900 mt-1 font-bold">
                Status Akademik: <strong className="font-extrabold text-blue-950">{currentStudent.academicStatus}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="bg-white/90 px-4 py-2.5 rounded-2xl border border-slate-300 text-center w-full sm:w-auto shadow-2xs">
              <span className="text-[10px] text-slate-500 block uppercase font-extrabold">
                {isSiswa ? 'Akun Siswa Aktif:' : 'Pilih Siswa / Peserta Didik:'}
              </span>
              {isSiswa ? (
                <div className="text-xs font-extrabold text-blue-950 py-1 px-2 bg-blue-50 rounded-lg border border-blue-200 inline-block mt-0.5">
                  ✓ {currentStudent.fullName} ({currentStudent.classGrade})
                </div>
              ) : (
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-transparent text-xs font-extrabold text-blue-900 focus:outline-none cursor-pointer mt-0.5"
                >
                  {students.map((std) => (
                    <option key={std.id} value={std.id} className="bg-white text-slate-900 font-semibold">
                      {std.fullName} ({std.classGrade})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex gap-2">
              <div className="bg-white/90 p-3 rounded-2xl border border-slate-300 text-center min-w-[85px] shadow-2xs">
                <span className="text-[10px] text-slate-500 block font-extrabold">Rata-rata</span>
                <span className="text-base font-black text-slate-900">{avgGrade}</span>
              </div>
              <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-blue-900 p-3 rounded-2xl border border-blue-800 text-center min-w-[85px] shadow-sm">
                <span className="text-[10px] text-amber-300 block font-bold">Presensi</span>
                <span className="text-base font-black text-white">{currentStudent.attendanceRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Portal Sub-tabs */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 p-2 rounded-full border border-blue-800 flex flex-wrap justify-center gap-2 shadow-xl">
            <button
              onClick={() => setActivePortalTab('rapor')}
              className={`px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                activePortalTab === 'rapor'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-300'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/60'
              }`}
            >
              <Award className={`w-4 h-4 ${activePortalTab === 'rapor' ? 'text-slate-950' : 'text-amber-400'}`} /> Transkrip Rapor
            </button>

            <button
              onClick={() => setActivePortalTab('presensi')}
              className={`px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                activePortalTab === 'presensi'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-300'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/60'
              }`}
            >
              <Clock className={`w-4 h-4 ${activePortalTab === 'presensi' ? 'text-slate-950' : 'text-amber-400'}`} /> Kehadiran Presensi
            </button>

            <button
              onClick={() => setActivePortalTab('spp')}
              className={`px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                activePortalTab === 'spp'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-300'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/60'
              }`}
            >
              <CreditCard className={`w-4 h-4 ${activePortalTab === 'spp' ? 'text-slate-950' : 'text-emerald-400'}`} /> Tagihan SPP Digital
            </button>

            <button
              onClick={() => setActivePortalTab('jadwal')}
              className={`px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                activePortalTab === 'jadwal'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-300'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/60'
              }`}
            >
              <Calendar className={`w-4 h-4 ${activePortalTab === 'jadwal' ? 'text-slate-950' : 'text-amber-400'}`} /> Jadwal Pelajaran
            </button>

            <button
              onClick={() => setActivePortalTab('elearning')}
              className={`px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                activePortalTab === 'elearning'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-300'
                  : 'text-slate-300 hover:text-white hover:bg-blue-900/60'
              }`}
            >
              <BookOpen className={`w-4 h-4 ${activePortalTab === 'elearning' ? 'text-slate-950' : 'text-amber-400'}`} /> Modul E-Learning
            </button>

            {canAccessWaliKelasPanel && (
              <button
                onClick={() => setActivePortalTab('walikelas')}
                className={`px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer ${
                  activePortalTab === 'walikelas'
                    ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md border border-amber-300'
                    : 'text-slate-300 hover:text-white hover:bg-blue-900/60'
                }`}
              >
                <UserCheck className={`w-4 h-4 ${activePortalTab === 'walikelas' ? 'text-slate-950' : 'text-emerald-400'}`} /> Panel Wali Kelas
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: TRANSKRIP RAPOR */}
        {activePortalTab === 'rapor' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">Transkrip Nilai Hasil Belajar</h3>
                  {verifiedRapor[selectedStudentId] ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-300">
                      ✓ Disahkan Wali Kelas
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300">
                      Draft Belum Disahkan
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">Semester Ganjil TA 2026/2027 • Siswa: {currentStudent.fullName} ({currentStudent.nisn})</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canManageGrades && (
                  <button
                    onClick={() => setShowAddGradeModal(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" /> + Tambah Pelajaran
                  </button>
                )}
                {canVerifyRapor && (
                  <button
                    onClick={() =>
                      setVerifiedRapor((prev) => ({
                        ...prev,
                        [selectedStudentId]: !prev[selectedStudentId],
                      }))
                    }
                    className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
                      verifiedRapor[selectedStudentId]
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-400 text-slate-950'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {verifiedRapor[selectedStudentId] ? 'Rapor Disahkan' : 'Sahkan Rapor Ini'}
                  </button>
                )}

                <button
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-200 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Cetak Rapor Digital PDF
                </button>
              </div>
            </div>

            {/* Summary Statistics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium block">Total Mata Pelajaran</span>
                <span className="text-base font-black text-slate-900">{currentGrades.length} Mapel</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium block">Rata-Rata Transkrip</span>
                <span className="text-base font-black text-blue-900">{avgGrade}</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium block">Mata Pelajaran Predikat A</span>
                <span className="text-base font-black text-emerald-700">
                  {currentGrades.filter((g) => g.predicate === 'A').length} Mapel
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 font-medium block">Status Ketuntasan KKM</span>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 inline-block">
                  ✓ Semua Mapel Tuntas
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-900 text-amber-300 uppercase font-bold text-[11px]">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Mata Pelajaran</th>
                    <th className="p-3.5 text-center">KKM</th>
                    <th className="p-3.5 text-center">Tugas (30%)</th>
                    <th className="p-3.5 text-center">UTS (30%)</th>
                    <th className="p-3.5 text-center">UAS (40%)</th>
                    <th className="p-3.5 text-center text-amber-200">Nilai Akhir</th>
                    <th className="p-3.5 text-center">Predikat</th>
                    {canManageGrades && (
                      <th className="p-3.5 text-center rounded-r-xl">Aksi / Kelola Mapel</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {currentGrades.length === 0 ? (
                    <tr>
                      <td colSpan={canManageGrades ? 8 : 7} className="p-8 text-center text-slate-500">
                        <p className="mb-3 italic text-slate-600">Belum ada mata pelajaran pada transkrip {currentStudent.fullName}.</p>
                        {canManageGrades && (
                          <button
                            onClick={() => setShowAddGradeModal(true)}
                            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Plus className="w-4 h-4" /> Tambah Mata Pelajaran Baru
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    currentGrades.map((g) => (
                      <tr key={g.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 font-bold text-slate-900">{g.subject}</td>
                        <td className="p-3.5 text-center font-mono">{g.kkm}</td>
                        <td className="p-3.5 text-center font-mono">{g.nilaiTugas}</td>
                        <td className="p-3.5 text-center font-mono">{g.nilaiUts}</td>
                        <td className="p-3.5 text-center font-mono">{g.nilaiUas}</td>
                        <td className="p-3.5 text-center font-black text-emerald-700 text-sm font-mono">
                          {g.nilaiAkhir}
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                              g.predicate === 'A'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : g.predicate === 'B'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-slate-100 text-slate-800 border border-slate-300'
                            }`}
                          >
                            {g.predicate}
                          </span>
                        </td>
                        {canManageGrades && (
                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(g)}
                                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                                title="Edit Nilai & Mapel"
                              >
                                <Edit className="w-3.5 h-3.5 text-blue-600" /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteGradeSubmit(g.id, g.subject)}
                                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                                title="Hapus Mapel Dari Transkrip"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Hapus
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-3 border-t border-slate-100 text-xs gap-2">
              <span className="text-slate-500 font-medium">
                *Nilai Akhir dihitung otomatis: (30% Tugas) + (30% UTS) + (40% UAS).
              </span>
              {canManageGrades && (
                <button
                  onClick={() => setShowAddGradeModal(true)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-xl font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> + Tambah Pelajaran Baru
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRESENSI KEHADIRAN */}
        {activePortalTab === 'presensi' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Catatan Kehadiran Siswa Real-Time</h3>
                <p className="text-xs text-slate-500">Tercatat oleh Mesin Presensi Digital Sekolah &amp; Guru</p>
              </div>

              <div className="flex items-center gap-2">
                {isAuthorized && (
                  <button
                    onClick={() => setShowAddAttendanceModal(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Input Presensi Hari Ini
                  </button>
                )}
                <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl text-xs border border-emerald-200">
                  Tingkat Kehadiran: {currentStudent.attendanceRate}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {currentAttendance.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item.date}</p>
                      <p className="text-slate-500 text-[11px]">{item.subjectNote}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        item.status === 'Hadir'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Waktu: {item.timeIn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TAGIHAN SPP & PEMBAYARAN DIGITAL */}
        {activePortalTab === 'spp' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <span>Status Tagihan &amp; Pembayaran SPP Online</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Data tagihan terintegrasi langsung dengan Rekening Bank BSI / BRI &amp; Virtual Account Sekolah
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isAuthorized && (
                  <button
                    onClick={() => setShowAddInvoiceModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Terbitkan SPP Baru
                  </button>
                )}

                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('pembayaran')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <QrCode className="w-4 h-4 text-amber-300" />
                    <span>Bayar via QRIS / VA</span>
                  </button>
                )}
              </div>
            </div>

            {/* List Invoices for Current Student */}
            <div className="space-y-4">
              {invoices.filter((inv) => inv.studentId === selectedStudentId).length > 0 ? (
                invoices
                  .filter((inv) => inv.studentId === selectedStudentId)
                  .map((inv) => (
                    <div
                      key={inv.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-500">{inv.invoiceNo}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                              inv.status === 'Lunas'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border-amber-300'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900">{inv.feeType} - {inv.monthPeriod}</h4>
                        <p className="text-xs text-slate-500">
                          Jatuh Tempo: <strong className="text-slate-700">{inv.dueDate}</strong> • Metode: <strong className="text-slate-700">{inv.paymentMethod || 'Transfer Bank / QRIS'}</strong>
                        </p>
                      </div>

                      <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-0 pt-3 sm:pt-0 border-slate-200 space-y-2">
                        <span className="text-xs text-slate-500 block">Total Nominal:</span>
                        <span className="text-xl font-black text-slate-900 block">
                          Rp {inv.amount.toLocaleString('id-ID')}
                        </span>

                        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2">
                          <button
                            onClick={() => setSelectedReceiptInvoice(inv)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 border border-emerald-300 shadow-2xs"
                            title="Lihat Kuitansi & Resi Pembayaran Digital Wali Siswa"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-700" /> Lihat Resi Pembayaran
                          </button>

                          {inv.status !== 'Lunas' && (
                            <>
                              {isAuthorized && onUpdateInvoiceStatus && (
                                <button
                                  onClick={() => onUpdateInvoiceStatus(inv.id, 'Lunas', 'Konfirmasi Langsung Wali Kelas / Admin')}
                                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition cursor-pointer shadow-xs flex items-center justify-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" /> Konfirmasi Lunas (Wali Kelas / Admin)
                                </button>
                              )}

                              {onUpdateInvoiceStatus && (
                                <button
                                  onClick={() => onUpdateInvoiceStatus(inv.id, 'Lunas', 'QRIS BSI Syariah (Portal Siswa)')}
                                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs transition cursor-pointer shadow-xs"
                                >
                                  Bayar Lunas Siswa
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-2">
                  <Receipt className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">Tidak ada penunggakan tagihan SPP untuk siswa ini.</p>
                  <p className="text-[11px] text-slate-400">Seluruh kewajiban pembayaran SPP telah lunas terverifikasi.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: JADWAL PELAJARAN */}
        {activePortalTab === 'jadwal' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Jadwal Pelajaran Mingguan ({currentStudent.classGrade})
                </h3>
                <p className="text-xs text-slate-500">Plotting jam tatap muka dan pembelajaran kelas</p>
              </div>

              {isAuthorized && (
                <button
                  onClick={() => setShowAddScheduleModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Tambah Jadwal Pelajaran
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT'].map((dayName) => {
                const daySchedules = schedulesList.filter((s) => s.day.toUpperCase() === dayName);
                if (daySchedules.length === 0) return null;

                return (
                  <div key={dayName} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <span className="font-extrabold text-blue-900 text-sm block">{dayName}</span>
                    <div className="space-y-2">
                      {daySchedules.map((sch) => (
                        <div key={sch.id} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                          <p className="font-extrabold text-slate-900">{sch.time}</p>
                          <p className="text-slate-800 font-bold">{sch.subject}</p>
                          <p className="text-[11px] text-slate-500">
                            {sch.teacher} • <span className="text-blue-950 font-semibold">{sch.room}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: E-LEARNING */}
        {activePortalTab === 'elearning' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Materi &amp; Tugas Digital E-Learning
                </h3>
                <p className="text-xs text-slate-500">Materi PDF, lembar praktikum, dan tautan tugas online</p>
              </div>

              {isAuthorized && (
                <button
                  onClick={() => setShowAddElearningModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Upload Modul / Tugas Baru
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {elearningList.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded border border-emerald-200 inline-block">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h4>
                  <p className="text-slate-600">{item.teacher}</p>
                  <button
                    onClick={() => alert(`Mengunduh berkas: ${item.title}`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh Berkasi ({item.size})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PANEL WALI KELAS */}
        {activePortalTab === 'walikelas' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-8">
            {/* Header Banner Wali Kelas */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-blue-900 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-md border border-amber-300">
                  <UserCheck className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Wali Kelas Binaan
                    </span>
                    <span className="text-amber-300 text-xs font-bold">
                      Tahun Ajaran 2026/2027
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Panel Pembina Kelas XI TJKT 1
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Pembina: <strong className="text-amber-300 font-bold">Drs. M. Ramdhan, M.Ag</strong> | NIP: 197804122005011004
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
                <button
                  onClick={() => alert('Mencetak Rekapitulasi Rapor Kelas XI TJKT 1...')}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Printer className="w-3.5 h-3.5" /> Cetak E-Rapor Kelas
                </button>
                <button
                  onClick={() => alert('Laporan Rekapitulasi Kehadiran Dikirim ke Grup WhatsApp Wali Murid XI TJKT 1!')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" /> Broadcast WA Ortu Kelas
                </button>
              </div>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Total Siswa Binaan</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">36 Siswa</span>
                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                  <Check className="w-3 h-3" /> 100% Terdata Lengkap
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Rata-Rata Kehadiran</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">98.4%</span>
                <span className="text-[10px] font-semibold text-slate-500 mt-1 block">
                  Izin: 1.2% | Alpha: 0.4%
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Status E-Rapor Kelas</span>
                <span className="text-2xl font-black text-amber-600 mt-1 block">94% Sah</span>
                <span className="text-[10px] font-semibold text-amber-700 mt-1 block">
                  34/36 Siswa Disahkan
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Notifikasi WA Ortu</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">Aktif</span>
                <span className="text-[10px] font-semibold text-emerald-700 mt-1 block">
                  Siap Kirim Laporan
                </span>
              </div>
            </div>

            {/* Student Homeroom Table */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    Daftar Siswa Binaan Kelas XI TJKT 1
                  </h4>
                  <p className="text-xs text-slate-500">
                    Kelola catatan perkembangan karakter, verifikasi nilai rapor, dan status kirim laporan ke WhatsApp Orang Tua.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-900 text-slate-200 font-extrabold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Nama Siswa & NIS</th>
                      <th className="py-3.5 px-4 text-center">Rata-Rata Rapor</th>
                      <th className="py-3.5 px-4 text-center">Kehadiran</th>
                      <th className="py-3.5 px-4">Catatan Wali Kelas</th>
                      <th className="py-3.5 px-4 text-center">E-Rapor</th>
                      <th className="py-3.5 px-4 text-right">Aksi Wali Kelas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {students.map((student) => {
                      const isVerified = verifiedRapor[student.id] || false;
                      const isWaSent = waSentStatus[student.id] || false;
                      const note = homeroomNotes[student.id] || 'Sangat baik, aktif dan disiplin dalam pembelajaran.';

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={student.avatarUrl}
                                alt={student.fullName}
                                className="w-9 h-9 rounded-full object-cover border border-amber-400"
                              />
                              <div>
                                <div className="font-extrabold text-slate-900">{student.fullName}</div>
                                <div className="text-[10px] text-slate-500">
                                  NIS: <span className="font-mono">{student.nis}</span> | {student.classGrade}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                            88.5
                          </td>

                          <td className="py-3.5 px-4 text-center font-bold">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] border border-emerald-200">
                              {student.attendanceRate}%
                            </span>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <input
                              type="text"
                              value={note}
                              onChange={(e) =>
                                setHomeroomNotes((prev) => ({
                                  ...prev,
                                  [student.id]: e.target.value,
                                }))
                              }
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white"
                              placeholder="Ketik catatan wali kelas..."
                            />
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() =>
                                setVerifiedRapor((prev) => ({
                                  ...prev,
                                  [student.id]: !prev[student.id],
                                }))
                              }
                              className={`px-3 py-1 rounded-full text-[10px] font-black transition cursor-pointer ${
                                isVerified
                                  ? 'bg-emerald-500 text-white shadow-2xs'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                              }`}
                            >
                              {isVerified ? '✓ Disahkan' : 'Sahkan Rapor'}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setWaSentStatus((prev) => ({
                                  ...prev,
                                  [student.id]: true,
                                }));
                                alert(
                                  `Laporan Wali Kelas untuk ${student.fullName} berhasil dikirimkan via WhatsApp ke Nomor Orang Tua (${student.parentPhone})!`
                                );
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ml-auto ${
                                isWaSent
                                  ? 'bg-slate-100 text-slate-500 border border-slate-300'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                              }`}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{isWaSent ? 'WA Terkirim' : 'Kirim WA Ortu'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: ADD GRADE */}
        {showAddGradeModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-black text-slate-900">+ Tambah Mata Pelajaran Baru</h3>
                <button onClick={() => setShowAddGradeModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddGradeSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1">Nama Mata Pelajaran</label>
                  <input
                    type="text"
                    required
                    value={newGradeForm.subject}
                    onChange={(e) => setNewGradeForm({ ...newGradeForm, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Contoh: Pemrograman Web React"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">KKM Minimum</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={newGradeForm.kkm}
                      onChange={(e) => setNewGradeForm({ ...newGradeForm, kkm: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Nilai Tugas (30%)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={newGradeForm.nilaiTugas}
                      onChange={(e) => setNewGradeForm({ ...newGradeForm, nilaiTugas: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Nilai UTS (30%)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={newGradeForm.nilaiUts}
                      onChange={(e) => setNewGradeForm({ ...newGradeForm, nilaiUts: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Nilai UAS (40%)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={newGradeForm.nilaiUas}
                      onChange={(e) => setNewGradeForm({ ...newGradeForm, nilaiUas: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Real-time Calculation Preview */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex justify-between items-center text-blue-900">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 block">Kalkulasi Otomatis</span>
                    <span className="text-xs font-black">Nilai Akhir Rapor:</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-mono font-black text-blue-950">
                      {Math.round(
                        (Number(newGradeForm.nilaiTugas) * 0.3) +
                        (Number(newGradeForm.nilaiUts) * 0.3) +
                        (Number(newGradeForm.nilaiUas) * 0.4)
                      )}
                    </span>
                    <span className="ml-2 text-xs font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded-md">
                      Predikat {
                        Math.round(
                          (Number(newGradeForm.nilaiTugas) * 0.3) +
                          (Number(newGradeForm.nilaiUts) * 0.3) +
                          (Number(newGradeForm.nilaiUas) * 0.4)
                        ) >= 90 ? 'A' : Math.round(
                          (Number(newGradeForm.nilaiTugas) * 0.3) +
                          (Number(newGradeForm.nilaiUts) * 0.3) +
                          (Number(newGradeForm.nilaiUas) * 0.4)
                        ) >= 80 ? 'B' : Math.round(
                          (Number(newGradeForm.nilaiTugas) * 0.3) +
                          (Number(newGradeForm.nilaiUts) * 0.3) +
                          (Number(newGradeForm.nilaiUas) * 0.4)
                        ) >= 70 ? 'C' : 'D'
                      }
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddGradeModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-extrabold shadow-md cursor-pointer"
                  >
                    Simpan Mata Pelajaran
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL EDIT GRADE */}
        {showEditGradeModal && editingGrade && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-black text-slate-900">Edit Nilai Mata Pelajaran</h3>
                <button
                  onClick={() => {
                    setShowEditGradeModal(false);
                    setEditingGrade(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditGradeSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1">Nama Mata Pelajaran</label>
                  <input
                    type="text"
                    required
                    value={newGradeForm.subject}
                    onChange={(e) => setNewGradeForm({ ...newGradeForm, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">KKM Minimum</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={newGradeForm.kkm}
                      onChange={(e) => setNewGradeForm({ ...newGradeForm, kkm: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Nilai Tugas (30%)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={newGradeForm.nilaiTugas}
                      onChange={(e) => setNewGradeForm({ ...newGradeForm, nilaiTugas: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Nilai UTS (30%)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={newGradeForm.nilaiUts}
                      onChange={(e) => setNewGradeForm({ ...newGradeForm, nilaiUts: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Nilai UAS (40%)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={newGradeForm.nilaiUas}
                      onChange={(e) => setNewGradeForm({ ...newGradeForm, nilaiUas: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Real-time Calculation Preview */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex justify-between items-center text-emerald-900">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Kalkulasi Otomatis</span>
                    <span className="text-xs font-black">Nilai Akhir Barunya:</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-mono font-black text-emerald-950">
                      {Math.round(
                        (Number(newGradeForm.nilaiTugas) * 0.3) +
                        (Number(newGradeForm.nilaiUts) * 0.3) +
                        (Number(newGradeForm.nilaiUas) * 0.4)
                      )}
                    </span>
                    <span className="ml-2 text-xs font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                      Predikat {
                        Math.round(
                          (Number(newGradeForm.nilaiTugas) * 0.3) +
                          (Number(newGradeForm.nilaiUts) * 0.3) +
                          (Number(newGradeForm.nilaiUas) * 0.4)
                        ) >= 90 ? 'A' : Math.round(
                          (Number(newGradeForm.nilaiTugas) * 0.3) +
                          (Number(newGradeForm.nilaiUts) * 0.3) +
                          (Number(newGradeForm.nilaiUas) * 0.4)
                        ) >= 80 ? 'B' : Math.round(
                          (Number(newGradeForm.nilaiTugas) * 0.3) +
                          (Number(newGradeForm.nilaiUts) * 0.3) +
                          (Number(newGradeForm.nilaiUas) * 0.4)
                        ) >= 70 ? 'C' : 'D'
                      }
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditGradeModal(false);
                      setEditingGrade(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md cursor-pointer"
                  >
                    Update Nilai
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ADD ATTENDANCE */}
        {showAddAttendanceModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-black text-slate-900">Input Presensi Kehadiran</h3>
                <button onClick={() => setShowAddAttendanceModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAttendanceSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1">Tanggal Kehadiran</label>
                  <input
                    type="date"
                    required
                    value={newAttendanceForm.date}
                    onChange={(e) => setNewAttendanceForm({ ...newAttendanceForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Status Kehadiran</label>
                    <select
                      value={newAttendanceForm.status}
                      onChange={(e) => setNewAttendanceForm({ ...newAttendanceForm, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Hadir">Hadir</option>
                      <option value="Izin">Izin</option>
                      <option value="Sakit">Sakit</option>
                      <option value="Alpha">Alpha</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Waktu Masuk</label>
                    <input
                      type="text"
                      required
                      value={newAttendanceForm.timeIn}
                      onChange={(e) => setNewAttendanceForm({ ...newAttendanceForm, timeIn: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Catatan Kegiatan / Sesi</label>
                  <input
                    type="text"
                    required
                    value={newAttendanceForm.subjectNote}
                    onChange={(e) => setNewAttendanceForm({ ...newAttendanceForm, subjectNote: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAttendanceModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-extrabold shadow-md cursor-pointer"
                  >
                    Simpan Presensi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: ADD INVOICE */}
        {showAddInvoiceModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-black text-slate-900">Terbitkan Tagihan SPP Baru</h3>
                <button onClick={() => setShowAddInvoiceModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddInvoiceSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1">Jenis Pembayaran</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceForm.feeType}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, feeType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Contoh: SPP Bulanan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Periode Bulan</label>
                    <input
                      type="text"
                      required
                      value={newInvoiceForm.monthPeriod}
                      onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, monthPeriod: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Agustus 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Nominal (Rp)</label>
                    <input
                      type="number"
                      required
                      value={newInvoiceForm.amount}
                      onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, amount: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddInvoiceModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-extrabold shadow-md cursor-pointer"
                  >
                    Terbitkan Tagihan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: ADD SCHEDULE */}
        {showAddScheduleModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-black text-slate-900">Tambah Jadwal Pelajaran</h3>
                <button onClick={() => setShowAddScheduleModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddScheduleSubmit} className="space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Hari</label>
                    <select
                      value={newScheduleForm.day}
                      onChange={(e) => setNewScheduleForm({ ...newScheduleForm, day: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="SENIN">SENIN</option>
                      <option value="SELASA">SELASA</option>
                      <option value="RABU">RABU</option>
                      <option value="KAMIS">KAMIS</option>
                      <option value="JUMAT">JUMAT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Jam Pelajaran</label>
                    <input
                      type="text"
                      required
                      value={newScheduleForm.time}
                      onChange={(e) => setNewScheduleForm({ ...newScheduleForm, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="08.00 - 10.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    required
                    value={newScheduleForm.subject}
                    onChange={(e) => setNewScheduleForm({ ...newScheduleForm, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Contoh: Pemrograman Web & Mobile"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Guru Pengampu</label>
                    <input
                      type="text"
                      required
                      value={newScheduleForm.teacher}
                      onChange={(e) => setNewScheduleForm({ ...newScheduleForm, teacher: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Ruangan / Lab</label>
                    <input
                      type="text"
                      required
                      value={newScheduleForm.room}
                      onChange={(e) => setNewScheduleForm({ ...newScheduleForm, room: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddScheduleModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-extrabold shadow-md cursor-pointer"
                  >
                    Simpan Jadwal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 5: ADD E-LEARNING */}
        {showAddElearningModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl relative">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-black text-slate-900">Upload Modul / Tugas E-Learning</h3>
                <button onClick={() => setShowAddElearningModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddElearningSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-700 mb-1">Kategori Modul</label>
                  <select
                    value={newElearningForm.category}
                    onChange={(e) => setNewElearningForm({ ...newElearningForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Modul Praktikum">Modul Praktikum</option>
                    <option value="Tugas Rumah">Tugas Rumah</option>
                    <option value="Kitab Kuning">Kitab Kuning &amp; Agama</option>
                    <option value="Ujian / Quiz Online">Ujian / Quiz Online</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1">Judul Modul / Materil</label>
                  <input
                    type="text"
                    required
                    value={newElearningForm.title}
                    onChange={(e) => setNewElearningForm({ ...newElearningForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Contoh: Modul Dasar Jaringan Komputer & Cloud"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 mb-1">Pengampu / Keterangan</label>
                    <input
                      type="text"
                      required
                      value={newElearningForm.teacher}
                      onChange={(e) => setNewElearningForm({ ...newElearningForm, teacher: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1">Ukuran File / Format</label>
                    <input
                      type="text"
                      required
                      value={newElearningForm.size}
                      onChange={(e) => setNewElearningForm({ ...newElearningForm, size: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddElearningModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-amber-300 font-extrabold shadow-md cursor-pointer"
                  >
                    Upload Modul
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* MODAL KUITANSI & RESI PEMBAYARAN DIGITAL SAH */}
        {selectedReceiptInvoice && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border-2 border-emerald-500 max-w-3xl w-full p-6 space-y-6 shadow-2xl relative text-slate-800 my-8">
              <button
                onClick={() => setSelectedReceiptInvoice(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black cursor-pointer transition"
              >
                ✕
              </button>

              {/* Header Kuitansi Resmi */}
              <div className="border-b-2 border-emerald-500/30 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-50/60 -mx-6 -mt-6 p-6 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-md">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-emerald-800 uppercase tracking-widest block">
                      SMK ISLAM CIPASUNG • BENDUM KEUANGAN
                    </span>
                    <h3 className="text-xl font-black text-slate-900">Kuitansi &amp; Resi Pembayaran Digital</h3>
                    <p className="text-xs text-slate-600 font-mono font-bold">
                      No. Resi: <span className="text-emerald-700">{selectedReceiptInvoice.receiptNo || `KWT/2026/07/${selectedReceiptInvoice.nis}`}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border shadow-2xs inline-block ${
                      selectedReceiptInvoice.status === 'Lunas'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-200'
                        : selectedReceiptInvoice.status === 'Menunggu Verifikasi'
                        ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                        : 'bg-slate-800 text-white border-slate-900'
                    }`}
                  >
                    {selectedReceiptInvoice.status === 'Lunas' ? '✓ LUNAS TERVERIFIKASI' : selectedReceiptInvoice.status}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1 font-medium">Tgl Tagihan: {selectedReceiptInvoice.dueDate}</span>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Column: Image Preview / Struk Transfer */}
                <div className="md:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" /> Struk Transfer Wali:
                    </p>
                  </div>

                  <div className="relative rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-950 group shadow-inner">
                    <img
                      src={selectedReceiptInvoice.paymentProofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'}
                      alt="Struk Resi Pembayaran Wali Siswa"
                      className="w-full h-72 object-cover object-top transition duration-300 group-hover:scale-105"
                    />
                    <a
                      href={selectedReceiptInvoice.paymentProofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-3 right-3 bg-slate-900/90 text-amber-300 px-3 py-1.5 rounded-xl text-[11px] font-black border border-amber-400/40 flex items-center gap-1.5 shadow-md hover:bg-slate-950"
                    >
                      <Eye className="w-3.5 h-3.5" /> Fullscreen
                    </a>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center font-medium italic">
                    *Bukti resi transfer sah Wali Siswa yang terverifikasi di database sekolah.
                  </p>
                </div>

                {/* Right Column: Transaction & Guardian (Wali) Details */}
                <div className="md:col-span-7 space-y-4 text-xs">
                  {/* Section Wali Siswa */}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-1 mb-2 flex items-center justify-between">
                      <span>Data Wali Siswa / Pengirim</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">Terverifikasi</span>
                    </h4>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 font-medium">
                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500">Nama Wali / Pengirim:</span>
                        <strong className="text-slate-900 font-extrabold">{selectedReceiptInvoice.paymentSenderName || 'Wali Santri'}</strong>
                      </div>

                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500">Bank / Channel Pengirim:</span>
                        <strong className="text-emerald-800 font-bold">{selectedReceiptInvoice.paymentBankSender || selectedReceiptInvoice.paymentMethod || 'Transfer Virtual Account BSI'}</strong>
                      </div>

                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500">Waktu Pembayaran:</span>
                        <span className="text-slate-800 font-bold">{selectedReceiptInvoice.paymentDate || '05 Juli 2026 09:15 WIB'}</span>
                      </div>

                      {selectedReceiptInvoice.paymentNotes && (
                        <div className="pt-1 text-[11px] text-slate-600">
                          <span className="text-slate-500 block">Catatan Transfer Wali:</span>
                          <p className="italic bg-white p-2 rounded-lg border border-slate-200 mt-1 text-slate-800">{selectedReceiptInvoice.paymentNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section Siswa & Tagihan */}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-1 mb-2">
                      Detail Siswa &amp; Tagihan SPP
                    </h4>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 font-medium">
                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500">Nama Siswa:</span>
                        <strong className="text-slate-900">{selectedReceiptInvoice.studentName}</strong>
                      </div>

                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500">NIS / Kelas:</span>
                        <strong className="text-slate-900">{selectedReceiptInvoice.nis} • {selectedReceiptInvoice.classGrade}</strong>
                      </div>

                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500">Jenis &amp; Periode:</span>
                        <strong className="text-slate-900">{selectedReceiptInvoice.feeType} ({selectedReceiptInvoice.monthPeriod})</strong>
                      </div>

                      <div className="flex justify-between pt-1 items-center">
                        <span className="text-slate-700 font-bold">Total Nominal:</span>
                        <strong className="text-emerald-700 font-black text-base">Rp {selectedReceiptInvoice.amount.toLocaleString('id-ID')}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
                  >
                    <Printer className="w-4 h-4 text-emerald-400" /> Cetak Kuitansi PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const msg = `Halo Bapak/Ibu Wali dari ${selectedReceiptInvoice.studentName}, Kuitansi Resi Pembayaran SPP bulan ${selectedReceiptInvoice.monthPeriod} sejumlah Rp ${selectedReceiptInvoice.amount.toLocaleString('id-ID')} telah LUNAS terverifikasi oleh Bendahara SMK Islam Cipasung. No. Resi: ${selectedReceiptInvoice?.receiptNo || 'KWT/2026/07/001'}. Terima kasih.`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition border border-emerald-300"
                  >
                    <Send className="w-4 h-4 text-emerald-700" /> Bagikan Ke WA Wali
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedReceiptInvoice(null)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer border border-slate-300"
                  >
                    Tutup Kuitansi
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
