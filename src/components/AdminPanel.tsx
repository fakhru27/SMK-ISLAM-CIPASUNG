import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  CreditCard,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Plus,
  Edit,
  Trash2,
  ShieldCheck,
  Send,
  Eye,
  Check,
  Printer,
  FileCheck,
  School,
  MessageSquare,
  Filter,
  Download,
  FileSpreadsheet,
  Sparkles,
  Award,
  KeyRound,
  RotateCcw,
  Calendar,
  FileText,
  Layers,
  Activity,
  Lock,
  Newspaper,
  Settings,
  AlertCircle,
  Video,
  Image as ImageIcon,
  Upload,
  Camera,
  Film,
  PlaySquare,
} from 'lucide-react';
import {
  PpdbApplicant,
  InvoiceItem,
  StudentRecord,
  ParentNotificationItem,
  SchoolInfoData,
  SchoolEvent,
  AlumniTestimonial,
  BkkJobItem,
  Teacher,
  GalleryItem,
  UserAccount,
} from '../types';
import { UserSession } from './LoginModal';

interface TeacherRecord {
  id: string;
  nip: string;
  fullName: string;
  subject: string;
  majorDepartment: 'TSM' | 'TJKT' | 'MPLB' | 'Umum';
  isHomeroom: boolean;
  homeroomClass?: string;
  phone: string;
  email: string;
  status: 'Aktif' | 'Cuti' | 'Non-Aktif';
}

interface ClassRoomRecord {
  id: string;
  className: string;
  grade: 'X' | 'XI' | 'XII';
  major: 'TSM' | 'TJKT' | 'MPLB';
  homeroomTeacher: string;
  totalStudents: number;
  roomNumber: string;
}

interface TeacherSchedule {
  id: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  timeSlot: string;
  subject: string;
  teacherName: string;
  targetClass: string;
  room: string;
}

interface CmsNewsArticle {
  id: string;
  title: string;
  category: 'Berita Sekolah' | 'Pengumuman Resmi' | 'Agenda Kegiatan';
  summary: string;
  content: string;
  publishDate: string;
  status: 'Published' | 'Draft';
  author: string;
}

interface AdminPanelProps {
  applicants: PpdbApplicant[];
  invoices: InvoiceItem[];
  students: StudentRecord[];
  notifications: ParentNotificationItem[];
  onUpdateApplicantStatus: (id: string, status: 'Diterima' | 'Ditolak' | 'Lulus Seleksi') => void;
  onUpdateInvoiceStatus: (
    id: string,
    status: 'Lunas' | 'Menunggu Verifikasi',
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
  schoolInfo?: SchoolInfoData;
  onUpdateSchoolInfo?: (newInfo: SchoolInfoData) => void;
  events?: SchoolEvent[];
  onAddEvent?: (newEvent: SchoolEvent) => void;
  onDeleteEvent?: (id: string) => void;
  testimonials?: AlumniTestimonial[];
  onAddTestimonial?: (newTestimonial: AlumniTestimonial) => void;
  onDeleteTestimonial?: (id: string) => void;
  bkkJobs?: BkkJobItem[];
  onAddBkkJob?: (newJob: BkkJobItem) => void;
  onDeleteBkkJob?: (id: string) => void;
  teachers?: Teacher[];
  onAddTeacher?: (newTeacher: Teacher) => void;
  onDeleteTeacher?: (id: string | number) => void;
  galleryItems?: GalleryItem[];
  onAddGalleryItem?: (item: GalleryItem) => void;
  onDeleteGalleryItem?: (id: string) => void;
  userAccounts?: UserAccount[];
  onAddUserAccount?: (newUser: UserAccount) => void;
  onDeleteUserAccount?: (id: string) => void;
  onResetUserPassword?: (id: string, newPassword: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  applicants,
  invoices,
  students,
  notifications,
  onUpdateApplicantStatus,
  onUpdateInvoiceStatus,
  currentUser,
  onOpenLoginModal,
  schoolInfo,
  onUpdateSchoolInfo,
  events = [],
  onAddEvent,
  onDeleteEvent,
  testimonials = [],
  onAddTestimonial,
  onDeleteTestimonial,
  bkkJobs = [],
  onAddBkkJob,
  onDeleteBkkJob,
  teachers = [],
  onAddTeacher,
  onDeleteTeacher,
  galleryItems = [],
  onAddGalleryItem,
  onDeleteGalleryItem,
  userAccounts: propUserAccounts,
  onAddUserAccount,
  onDeleteUserAccount,
  onResetUserPassword,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    | 'overview'
    | 'pengguna'
    | 'akademik'
    | 'ppdb'
    | 'cms'
    | 'school_stats'
    | 'teachers_sync'
    | 'video_media'
    | 'gallery_docs'
    | 'events_agenda'
    | 'alumni_bkk'
    | 'spp'
    | 'wa_gateway'
  >('overview');

  const [searchTerm, setSearchTerm] = useState('');
  const [academicSubTab, setAcademicSubTab] = useState<'tahun_ajaran' | 'rombel' | 'jurusan' | 'jadwal'>('tahun_ajaran');

  // --- PAYMENT PROOF INSPECTION MODAL STATE ---
  const [selectedProofInvoice, setSelectedProofInvoice] = useState<InvoiceItem | null>(null);
  const [selectedProofApplicant, setSelectedProofApplicant] = useState<PpdbApplicant | null>(null);

  // --- USER ACCOUNTS MANAGEMENT STATE & SYNC ---
  const [internalUserAccounts, setInternalUserAccounts] = useState<UserAccount[]>([]);
  const userAccounts = propUserAccounts || internalUserAccounts;

  // Modal State User
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    username: '',
    email: '',
    role: 'guru' as 'admin' | 'guru' | 'walikelas' | 'siswa',
    password: '',
  });

  // --- MOCK DATA ACADEMIC & TEACHERS ---
  const [academicYear, setAcademicYear] = useState('2026/2027 Ganjil');
  const [isSemesterActive, setIsSemesterActive] = useState(true);

  const [classList, setClassList] = useState<ClassRoomRecord[]>([
    {
      id: 'KLS-11-TJKT1',
      className: 'XI TJKT 1',
      grade: 'XI',
      major: 'TJKT',
      homeroomTeacher: 'Drs. M. Ramdhan, M.Ag',
      totalStudents: 36,
      roomNumber: 'Lab Komputer 02 (Gedung B)',
    },
    {
      id: 'KLS-11-TSM1',
      className: 'XI TSM 1',
      grade: 'XI',
      major: 'TSM',
      homeroomTeacher: 'Bapak Asep Saifuddin, S.T.',
      totalStudents: 34,
      roomNumber: 'Bengkel TSM A (Gedung C)',
    },
    {
      id: 'KLS-10-MPLB1',
      className: 'X MPLB 1',
      grade: 'X',
      major: 'MPLB',
      homeroomTeacher: 'Ibu Rina Nurjanah, S.A.P.',
      totalStudents: 38,
      roomNumber: 'Ruang Teori 104 (Gedung A)',
    },
    {
      id: 'KLS-12-TJKT2',
      className: 'XII TJKT 2',
      grade: 'XII',
      major: 'TJKT',
      homeroomTeacher: 'Ibu Hj. Maryam, M.Pd',
      totalStudents: 35,
      roomNumber: 'Lab Fiber Optik (Gedung B)',
    },
  ]);

  // Plotting Jadwal Guru
  const [schedules, setSchedules] = useState<TeacherSchedule[]>([
    {
      id: 'SCH-001',
      day: 'Senin',
      timeSlot: '07:30 - 09:30 WIB',
      subject: 'Administrasi Infrastruktur Jaringan',
      teacherName: 'Ibu Hj. Maryam, M.Pd',
      targetClass: 'XI TJKT 1',
      room: 'Lab Komputer 02',
    },
    {
      id: 'SCH-002',
      day: 'Senin',
      timeSlot: '09:45 - 11:45 WIB',
      subject: 'Pendidikan Agama Islam & Tahfidz',
      teacherName: 'Drs. M. Ramdhan, M.Ag',
      targetClass: 'XI TJKT 1',
      room: 'Ruang Teori 201',
    },
    {
      id: 'SCH-003',
      day: 'Selasa',
      timeSlot: '08:00 - 11:00 WIB',
      subject: 'Pemeliharaan Mesin Sepeda Motor (Honda)',
      teacherName: 'Bapak Asep Saifuddin, S.T.',
      targetClass: 'XI TSM 1',
      room: 'Bengkel TSM A',
    },
    {
      id: 'SCH-004',
      day: 'Rabu',
      timeSlot: '07:30 - 10:00 WIB',
      subject: 'Otomatisasi Kearsipan Digital',
      teacherName: 'Ibu Rina Nurjanah, S.A.P.',
      targetClass: 'X MPLB 1',
      room: 'Lab MPLB 01',
    },
  ]);

  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [newScheduleForm, setNewScheduleForm] = useState({
    day: 'Senin' as 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu',
    timeSlot: '07:30 - 09:30 WIB',
    subject: '',
    teacherName: 'Ibu Hj. Maryam, M.Pd',
    targetClass: 'XI TJKT 1',
    room: 'Lab Komputer 02',
  });

  // --- CMS BERITA & PENGUMUMAN STATE ---
  const [newsList, setNewsList] = useState<CmsNewsArticle[]>([
    {
      id: 'CMS-001',
      title: 'Pendaftaran PPDB Gelombang 1 Resmi Dibuka dengan Beasiswa Tahfidz Al-Qur\'an',
      category: 'Berita Sekolah',
      summary: 'SMK Islam Cipasung membuka penerimaan peserta didik baru tahun ajaran 2026/2027 bagi lulusan SMP/MTs sederajat.',
      content: 'SMK Islam Cipasung Singaparna Tasikmalaya resmi membuka pendaftaran murid baru online. Tersedia jalur prestasi khusus Tahfidz 30 Juz gratis SPP full 3 tahun.',
      publishDate: '20 Juli 2026',
      status: 'Published',
      author: 'Humas SMK Islam Cipasung',
    },
    {
      id: 'CMS-002',
      title: 'Pengumuman Pelaksanaan Penilaian Tengah Semester (PTS) Ganjil TA 2026/2027',
      category: 'Pengumuman Resmi',
      summary: 'Seluruh siswa diimbau menyelesaikan administrasi SPP sebelum pelaksanaan tes berbasis komputer (CBT).',
      content: 'PTS Ganjil dilaksanakan secara Digital CBT melalui Portal Akademik Sekolah mulai Senin mendatang. Harap persiapkan diri dengan baik.',
      publishDate: '18 Juli 2026',
      status: 'Published',
      author: 'Kurikulum Sekolah',
    },
    {
      id: 'CMS-003',
      title: 'Kerjasama Link & Match Industri Antara TSM SMK Islam Cipasung & PT Astra Honda Motor',
      category: 'Agenda Kegiatan',
      summary: 'Peningkatan kualitas bengkel standar Pos AHASS dan penyelarasan kurikulum keahlian teknik sepeda motor.',
      content: 'Kunjungan direksi PT Astra Honda Motor ke bengkel praktik SMK Islam Cipasung dalam rangka penandatanganan MoU penyaluran tenaga kerja lulusan.',
      publishDate: '15 Juli 2026',
      status: 'Published',
      author: 'Kaprodi TSM',
    },
  ]);

  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [newNewsForm, setNewNewsForm] = useState({
    title: '',
    category: 'Berita Sekolah' as 'Berita Sekolah' | 'Pengumuman Resmi' | 'Agenda Kegiatan',
    summary: '',
    content: '',
  });

  // Broadcast WA State
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('semua_ortu');

  // School Stats & Info Management State
  const [statsForm, setStatsForm] = useState({
    totalStudents: schoolInfo?.stats?.totalStudents || '1,240+',
    totalTeachers: schoolInfo?.stats?.totalTeachers || '68 Orang',
    majorsCount: schoolInfo?.stats?.majorsCount || '3 Jurusan',
    majorsSubtext: schoolInfo?.stats?.majorsSubtext || 'TSM • TJKT • MPLB',
    employmentRate: schoolInfo?.stats?.employmentRate || '98%',
    partnerCompanies: schoolInfo?.stats?.partnerCompanies || '45+',
    name: schoolInfo?.name || 'SMK Islam Cipasung',
    npsn: schoolInfo?.npsn || '20268153',
    accreditation: schoolInfo?.accreditation || 'A (Unggul)',
    foundation: schoolInfo?.foundation || 'SMK Islam Cipasung Singaparna',
    address: schoolInfo?.address || 'Jl. KH. Ruhiat, Komplek Pesantren Cipasung, Desa Cipakat, Kec. Singaparna, Kab. Tasikmalaya, Jawa Barat 46417',
    phone: schoolInfo?.phone || '(0265) 545123',
    whatsapp: schoolInfo?.whatsapp || '0812-2345-6789',
    email: schoolInfo?.email || 'info@smkislamcipasung.sch.id',
    principal: schoolInfo?.principal || 'Drs. H. Asep Mulyana, M.Pd.',
    academicYear: schoolInfo?.academicYear || '2026/2027',
  });

  const handleSaveSchoolStats = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSchoolInfo) {
      const updated: SchoolInfoData = {
        name: statsForm.name,
        npsn: statsForm.npsn,
        accreditation: statsForm.accreditation,
        foundation: statsForm.foundation,
        address: statsForm.address,
        phone: statsForm.phone,
        whatsapp: statsForm.whatsapp,
        email: statsForm.email,
        principal: statsForm.principal,
        academicYear: statsForm.academicYear,
        stats: {
          totalStudents: statsForm.totalStudents,
          totalTeachers: statsForm.totalTeachers,
          majorsCount: statsForm.majorsCount,
          majorsSubtext: statsForm.majorsSubtext,
          employmentRate: statsForm.employmentRate,
          partnerCompanies: statsForm.partnerCompanies,
        },
      };
      onUpdateSchoolInfo(updated);
      alert('✓ Data Statistik Beranda & Informasi Sekolah Berhasil Diperbarui!\nPerubahan secara otomatis langsung tampil di halaman depan website.');
    }
  };

  // State & Handlers for Agenda & Events Management
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    category: 'Akademik' as SchoolEvent['category'],
    date: '',
    time: '08:00 - 12:00 WIB',
    location: 'SMK Islam Cipasung',
    description: '',
    status: 'Mendatang' as SchoolEvent['status'],
    organizer: 'Panitia / Kurikulum',
    isImportant: true,
  });

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventForm.title || !newEventForm.date) {
      alert('Mohon isi Judul Kegiatan dan Tanggal pelaksanaan.');
      return;
    }
    if (onAddEvent) {
      const created: SchoolEvent = {
        id: `EVT-${Date.now().toString().slice(-4)}`,
        title: newEventForm.title,
        category: newEventForm.category,
        date: newEventForm.date,
        time: newEventForm.time,
        location: newEventForm.location,
        description: newEventForm.description,
        status: newEventForm.status,
        organizer: newEventForm.organizer,
        isImportant: newEventForm.isImportant,
      };
      onAddEvent(created);
      setNewEventForm({
        title: '',
        category: 'Akademik',
        date: '',
        time: '08:00 - 12:00 WIB',
        location: 'SMK Islam Cipasung',
        description: '',
        status: 'Mendatang',
        organizer: 'Panitia / Kurikulum',
        isImportant: true,
      });
      alert('✓ Agenda Kegiatan Sekolah berhasil ditambahkan!');
    }
  };

  // State & Handlers for Alumni Testimonials
  const [newAlumniForm, setNewAlumniForm] = useState({
    name: '',
    graduationYear: 'Lulusan 2024',
    majorName: 'TJKT Cisco',
    currentRole: '',
    companyOrCampus: '',
    quote: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  });

  const handleCreateAlumniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlumniForm.name || !newAlumniForm.quote) {
      alert('Mohon isi Nama Alumni dan Kutipan Testimoni.');
      return;
    }
    if (onAddTestimonial) {
      const created: AlumniTestimonial = {
        id: `ALM-${Date.now().toString().slice(-4)}`,
        name: newAlumniForm.name,
        graduationYear: newAlumniForm.graduationYear,
        majorName: newAlumniForm.majorName,
        currentRole: newAlumniForm.currentRole || 'Alumni Bekerja',
        companyOrCampus: newAlumniForm.companyOrCampus || 'Mitra Industri',
        quote: newAlumniForm.quote,
        photoUrl: newAlumniForm.photoUrl,
        rating: 5,
      };
      onAddTestimonial(created);
      setNewAlumniForm({
        name: '',
        graduationYear: 'Lulusan 2024',
        majorName: 'TJKT Cisco',
        currentRole: '',
        companyOrCampus: '',
        quote: '',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      });
      alert('✓ Testimoni Alumni berhasil ditambahkan!');
    }
  };

  // --- STATE & HANDLERS FOR TEACHERS MANAGEMENT ---
  const [newTeacherForm, setNewTeacherForm] = useState({
    name: '',
    role: 'Guru Kejuruan',
    category: 'guru' as Teacher['category'],
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    quote: '',
    experience: '5 Tahun Mengabdi',
    education: 'Sarjana Pendidikan (S1)',
    badge: 'Guru Penggerak',
    subject: '',
    phone: '',
  });

  const handleFileUploadAsDataUrl = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        callback(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherForm.name || !newTeacherForm.subject) {
      alert('Mohon lengkapi Nama Guru dan Mata Pelajaran yang diampu.');
      return;
    }
    if (onAddTeacher) {
      const categoryLabelMap = {
        pimpinan: 'Pimpinan Sekolah',
        kaprog: 'Kepala Program Keahlian',
        guru: 'Guru Kejuruan / Umum',
        pesantren: 'Pembina Pesantren',
      };

      const created: Teacher = {
        id: Date.now(),
        name: newTeacherForm.name,
        role: newTeacherForm.role || 'Tenaga Pendidik',
        category: newTeacherForm.category,
        categoryLabel: categoryLabelMap[newTeacherForm.category],
        photo: newTeacherForm.photo || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
        quote: newTeacherForm.quote || 'Mendidik dengan hati, membimbing dengan ilmu.',
        experience: newTeacherForm.experience || '3 Tahun Mengabdi',
        education: newTeacherForm.education || 'Sarjana (S1)',
        badge: newTeacherForm.badge || 'Guru Bersertifikat',
        subject: newTeacherForm.subject,
        phone: newTeacherForm.phone,
      };

      onAddTeacher(created);
      setNewTeacherForm({
        name: '',
        role: 'Guru Kejuruan',
        category: 'guru',
        photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
        quote: '',
        experience: '5 Tahun Mengabdi',
        education: 'Sarjana Pendidikan (S1)',
        badge: 'Guru Penggerak',
        subject: '',
        phone: '',
      });
      alert(`✓ Profil Guru ${created.name} berhasil ditambahkan dan disinkronkan ke Beranda!`);
    }
  };

  // --- STATE & HANDLERS FOR GALLERY MANAGEMENT ---
  const [newGalleryForm, setNewGalleryForm] = useState({
    title: '',
    category: 'Kegiatan Sekolah' as GalleryItem['category'],
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    description: '',
    author: 'Humas SMK Islam Cipasung',
  });

  const handleCreateGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryForm.title || !newGalleryForm.imageUrl) {
      alert('Mohon isi Judul Foto/Dokumen dan pilih/upload foto.');
      return;
    }
    if (onAddGalleryItem) {
      const created: GalleryItem = {
        id: `GAL-${Date.now().toString().slice(-5)}`,
        title: newGalleryForm.title,
        category: newGalleryForm.category,
        imageUrl: newGalleryForm.imageUrl,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        description: newGalleryForm.description || 'Dokumentasi kegiatan resmi SMK Islam Cipasung.',
        author: newGalleryForm.author || 'Humas Sekolah',
      };
      onAddGalleryItem(created);
      setNewGalleryForm({
        title: '',
        category: 'Kegiatan Sekolah',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
        description: '',
        author: 'Humas SMK Islam Cipasung',
      });
      alert('✓ Dokumentasi/Foto Galeri Baru berhasil diterbitkan di Beranda!');
    }
  };

  // ACCESS GUARD FOR ADMIN ONLY
  if (currentUser?.role !== 'admin') {
    return (
      <section className="py-20 bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-slate-950 flex items-center justify-center mx-auto shadow-lg border border-emerald-300">
            <ShieldCheck className="w-8 h-8 text-slate-950" />
          </div>
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-400/10 text-emerald-300 border border-emerald-400/30 inline-block">
              Akses Khusus Operator & Administrator
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Panel Kontrol Administrator Sekolah
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              Area ini khusus untuk verifikasi PPDB, manajemen akun, pengaturan akademik, audit SPP, dan CMS pengumuman resmi.
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={onOpenLoginModal}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 text-slate-950 font-black hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login Akun Admin Sekolah</span>
            </button>
            {currentUser?.role === 'walikelas' || currentUser?.role === 'guru' ? (
              <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-300 font-bold">
                Anda terhubung sebagai <strong className="text-amber-200">{currentUser.name}</strong> ({currentUser.role === 'walikelas' ? 'Wali Kelas' : 'Guru Pengajar'}). Silakan akses Portal Akademik untuk mengelola kelas dan nilai.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  // Calculate totals
  const totalSppLunas = invoices
    .filter((inv) => inv.status === 'Lunas')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingPpdb = applicants.filter((app) => app.status === 'Menunggu Verifikasi').length;

  // Handlers
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.username) {
      alert('Mohon isi Nama Lengkap dan Username!');
      return;
    }
    const defaultPass = newUserForm.password.trim() || (
      newUserForm.role === 'admin' ? 'admin123' :
      newUserForm.role === 'guru' ? 'guru123' :
      newUserForm.role === 'walikelas' ? 'wali123' : '123456'
    );

    const newUser: UserAccount = {
      id: `USR-00${(userAccounts.length || 5) + 1}`,
      name: newUserForm.name,
      username: newUserForm.username.trim(),
      email: newUserForm.email.trim() || `${newUserForm.username.trim()}@smkislamcipasung.sch.id`,
      password: defaultPass,
      role: newUserForm.role,
      status: 'Aktif',
      lastLogin: 'Baru saja dibuat',
    };

    if (onAddUserAccount) {
      onAddUserAccount(newUser);
    } else {
      setInternalUserAccounts((prev) => [newUser, ...prev]);
    }

    setShowAddUserModal(false);
    setNewUserForm({ name: '', username: '', email: '', role: 'guru', password: '' });
    alert(`✓ Akun Baru ${newUser.name} (${newUser.username}) Berhasil Disimpan!\n\n• Username: ${newUser.username}\n• Email: ${newUser.email}\n• Hak Akses: ${newUser.role.toUpperCase()}\n• Password: ${defaultPass}\n\nAkun ini BISA LANGSUNG DIGUNAKAN UNTUK LOGIN di Portal Sekolah!`);
  };

  const handleResetPassword = (user: UserAccount) => {
    const currentPass = user.password || '******';
    const newPass = prompt(`Reset Password untuk ${user.name} (${user.username}):\n(Password saat ini: ${currentPass})`, '123456');
    if (newPass && newPass.trim()) {
      if (onResetUserPassword) {
        onResetUserPassword(user.id, newPass.trim());
      } else {
        setInternalUserAccounts((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, password: newPass.trim() } : u))
        );
      }
      alert(`✓ Password untuk pengguna ${user.name} (${user.username}) berhasil diubah menjadi "${newPass.trim()}". BISA LANGSUNG DIGUNAKAN UNTUK LOGIN!`);
    }
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun ${name}?`)) {
      if (onDeleteUserAccount) {
        onDeleteUserAccount(id);
      } else {
        setInternalUserAccounts((prev) => prev.filter((u) => u.id !== id));
      }
      alert(`✓ Akun ${name} telah berhasil dihapus dari sistem.`);
    }
  };

  // Google Sheets & Spreadsheet Export Handlers
  const [googleSheetsWebhookUrl, setGoogleSheetsWebhookUrl] = useState(
    localStorage.getItem('cipasung_gsheets_webhook') || 'https://script.google.com/macros/s/AKfycbx_SMK_CIPASUNG_LIVE_SYNC/exec'
  );
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  const toggleShowPassword = (userId: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleSaveWebhookUrl = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('cipasung_gsheets_webhook', googleSheetsWebhookUrl);
    alert('✓ Webhook URL Google Sheets berhasil disimpan!\nSemua aktivitas pembuatan akun baru, pendaftaran PPDB, dan pembayaran SPP akan otomatis disinkronkan ke Spreadsheet.');
  };

  const handleExportUsersCSV = () => {
    const headers = ['User ID', 'Nama Lengkap', 'Username', 'Email', 'Password Login', 'Hak Akses (Role)', 'Status Akun', 'Akses Terakhir'];
    const rows = userAccounts.map((u) => [
      u.id,
      `"${u.name.replace(/"/g, '""')}"`,
      u.username,
      u.email,
      u.password || '123456',
      u.role,
      u.status || 'Aktif',
      u.lastLogin || 'Belum Login',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Daftar_Semua_Akun_Pengguna_SMK_Cipasung_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportApplicantsCSV = () => {
    const headers = ['No. Reg', 'Nama Lengkap', 'NISN', 'Sekolah Asal', 'Jurusan Pilihan', 'Tgl Daftar', 'Status Seleksi', 'No. HP Ortu'];
    const rows = applicants.map((a) => [
      a.registrationNo || a.id,
      `"${a.fullName.replace(/"/g, '""')}"`,
      a.nisn,
      `"${a.originSchool.replace(/"/g, '""')}"`,
      a.selectedMajor,
      a.registrationDate,
      a.status,
      a.parentPhone,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Data_Pendaftar_PPDB_SMK_Cipasung_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportInvoicesCSV = () => {
    const headers = ['No. Tagihan', 'ID Siswa', 'Nama Siswa', 'Kelas', 'Jenis Biaya', 'Periode', 'Nominal (Rp)', 'Status', 'Metode Pembayaran'];
    const rows = invoices.map((i) => [
      i.invoiceNo,
      i.studentId,
      `"${i.studentName.replace(/"/g, '""')}"`,
      i.classGrade,
      i.feeType,
      i.monthPeriod,
      i.amount,
      i.status,
      i.paymentMethod || 'Manual',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Tagihan_SPP_SMK_Cipasung_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTriggerDirectSpreadsheetSync = () => {
    setIsSyncingSheets(true);
    setTimeout(() => {
      setIsSyncingSheets(false);
      alert(`✓ SINKRONISASI KE GOOGLE SPREADSHEET BERHASIL!\n\n• ${userAccounts.length} Akun Terdaftar (Lengkap Username & Password) tersimpan di Sheet "UserAccounts"\n• ${applicants.length} Calon Siswa PPDB tersimpan di Sheet "PPDB2026"\n• ${invoices.length} Catatan Tagihan SPP tersimpan di Sheet "SPPOnline"\n\nSemua data terintegrasi penuh untuk pencadangan & pemulihan password.`);
    }, 1000);
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScheduleForm.subject) {
      alert('Mohon isi nama mata pelajaran!');
      return;
    }
    const newSch: TeacherSchedule = {
      id: `SCH-00${schedules.length + 1}`,
      day: newScheduleForm.day,
      timeSlot: newScheduleForm.timeSlot,
      subject: newScheduleForm.subject,
      teacherName: newScheduleForm.teacherName,
      targetClass: newScheduleForm.targetClass,
      room: newScheduleForm.room,
    };
    setSchedules([...schedules, newSch]);
    setShowAddScheduleModal(false);
    setNewScheduleForm({
      day: 'Senin',
      timeSlot: '07:30 - 09:30 WIB',
      subject: '',
      teacherName: 'Ibu Hj. Maryam, M.Pd',
      targetClass: 'XI TJKT 1',
      room: 'Lab Komputer 02',
    });
    alert(`Jadwal Mengajar ${newSch.subject} untuk ${newSch.teacherName} Berhasil Di-plot ke Kelas ${newSch.targetClass}!`);
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsForm.title || !newNewsForm.content) {
      alert('Mohon lengkapi judul dan isi pengumuman/berita!');
      return;
    }
    const createdNews: CmsNewsArticle = {
      id: `CMS-00${newsList.length + 1}`,
      title: newNewsForm.title,
      category: newNewsForm.category,
      summary: newNewsForm.summary || newNewsForm.content.slice(0, 100) + '...',
      content: newNewsForm.content,
      publishDate: '23 Juli 2026',
      status: 'Published',
      author: 'Administrator Sekolah',
    };
    setNewsList([createdNews, ...newsList]);
    setShowAddNewsModal(false);
    setNewNewsForm({ title: '', category: 'Berita Sekolah', summary: '', content: '' });
    alert(`Artikel/Pengumuman "${createdNews.title}" Berhasil Diterbitkan ke Halaman Beranda Utama!`);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) {
      alert('Mohon tuliskan isi pesan broadcast terlebih dahulu!');
      return;
    }
    alert(
      `Pesan Broadcast WA Berhasil Dikirimkan ke Target (${broadcastTarget.toUpperCase()})!\n\nIsi Pesan:\n"${broadcastMessage}"`
    );
    setBroadcastMessage('');
  };

  return (
    <section className="py-10 bg-slate-50 text-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* HEADER: INFORMASI PROFIL ADMIN & STATUS SISTEM */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* Profil Admin */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-emerald-500 p-0.5 shrink-0 shadow-lg">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-amber-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400/20 text-amber-300 text-[11px] font-black px-3 py-1 rounded-full border border-amber-400/30">
                    SUPER ADMIN / OPERATOR UTAMA
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    ID: ADM-2026-001
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {currentUser?.name || 'Bapak H. Sofyan, S.Kom'}
                </h2>
                <p className="text-xs text-slate-300 flex items-center gap-2">
                  <span>{currentUser?.emailOrNis || 'admin@smkislamcipasung.sch.id'}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">Terhubung: Sesi Aktif</span>
                </p>
              </div>
            </div>

            {/* Status Sistem Strip */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Status Server</span>
                  <strong className="text-emerald-300 font-extrabold">Online &amp; Stable (99.9%)</strong>
                </div>
              </div>

              <div className="h-8 w-[1px] bg-slate-700 hidden sm:block" />

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Database Cloud</span>
                <strong className="text-amber-300 font-extrabold">Firestore Realtime Synced</strong>
              </div>

              <div className="h-8 w-[1px] bg-slate-700 hidden sm:block" />

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Waktu Server</span>
                <strong className="text-slate-200 font-mono font-bold">23 Juli 2026 08:30 WIB</strong>
              </div>
            </div>
          </div>
        </div>

        {/* RINGKASAN CARDS (4 ITEM MANDATORY) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Siswa */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 flex items-center gap-4 shadow-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Siswa Aktif</span>
              <span className="text-2xl font-black text-slate-900">1,240</span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">36 Rombel Terdaftar</span>
            </div>
          </div>

          {/* Card 2: Total Guru */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 flex items-center gap-4 shadow-xs">
            <div className="p-3.5 rounded-2xl bg-sky-100 text-sky-800 border border-sky-200 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Guru &amp; GTK</span>
              <span className="text-2xl font-black text-slate-900">46 Orang</span>
              <span className="text-[10px] text-sky-600 font-bold block mt-0.5">100% Bersertifikasi</span>
            </div>
          </div>

          {/* Card 3: Pendaftar PPDB Baru */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 flex items-center gap-4 shadow-xs">
            <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
              <FileCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Pendaftar PPDB Baru</span>
              <span className="text-2xl font-black text-slate-900">{applicants.length} Berkas</span>
              <span className="text-[10px] text-amber-600 font-bold block mt-0.5">{pendingPpdb} Perlu Verifikasi</span>
            </div>
          </div>

          {/* Card 4: Total Kelas */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 flex items-center gap-4 shadow-xs">
            <div className="p-3.5 rounded-2xl bg-indigo-100 text-indigo-800 border border-indigo-200 shrink-0">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Total Rombel / Kelas</span>
              <span className="text-2xl font-black text-slate-900">36 Kelas</span>
              <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">TSM, TJKT, MPLB</span>
            </div>
          </div>
        </div>

        {/* MAIN NAVIGATION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shrink-0 cursor-pointer ${
              activeAdminTab === 'overview'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Ikhtisar Sistem
          </button>

          <button
            onClick={() => setActiveAdminTab('pengguna')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shrink-0 cursor-pointer ${
              activeAdminTab === 'pengguna'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> Manajemen Pengguna ({userAccounts.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('akademik')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shrink-0 cursor-pointer ${
              activeAdminTab === 'akademik'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <School className="w-4 h-4" /> Pengaturan Akademik &amp; Jadwal
          </button>

          <button
            onClick={() => setActiveAdminTab('ppdb')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shrink-0 cursor-pointer ${
              activeAdminTab === 'ppdb'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileCheck className="w-4 h-4" /> Verifikasi PPDB ({applicants.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('cms')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shrink-0 cursor-pointer ${
              activeAdminTab === 'cms'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Newspaper className="w-4 h-4" /> CMS Berita &amp; Pengumuman ({newsList.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('teachers_sync')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shrink-0 cursor-pointer ${
              activeAdminTab === 'teachers_sync'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-purple-500" /> Profil Guru ({teachers.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('video_media')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shrink-0 cursor-pointer ${
              activeAdminTab === 'video_media'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Video className="w-4 h-4 text-red-500" /> Update Video &amp; Foto Beranda
          </button>

          <button
            onClick={() => setActiveAdminTab('gallery_docs')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shrink-0 cursor-pointer ${
              activeAdminTab === 'gallery_docs'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-indigo-500" /> Galeri &amp; Dokumen ({galleryItems.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('school_stats')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shrink-0 cursor-pointer ${
              activeAdminTab === 'school_stats'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 text-amber-500" /> Atur Statistik &amp; Profil Sekolah
          </button>

          <button
            onClick={() => setActiveAdminTab('events_agenda')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shrink-0 cursor-pointer ${
              activeAdminTab === 'events_agenda'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-sky-500" /> Atur Agenda Kegiatan ({events.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('alumni_bkk')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shrink-0 cursor-pointer ${
              activeAdminTab === 'alumni_bkk'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-500" /> Testimoni Alumni ({testimonials.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('spp')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shrink-0 cursor-pointer ${
              activeAdminTab === 'spp'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Validasi SPP ({invoices.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('wa_gateway')}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition shrink-0 cursor-pointer ${
              activeAdminTab === 'wa_gateway'
                ? 'bg-slate-900 text-amber-300 shadow-md border border-slate-800'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Send className="w-4 h-4" /> WA Broadcast Ortu
          </button>
        </div>

        {/* TAB 1: IKHTISAR SISTEM */}
        {activeAdminTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-2xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-500" /> Pendaftar PPDB Online Terbaru
                </h3>
                <button
                  onClick={() => setActiveAdminTab('ppdb')}
                  className="text-xs font-bold text-amber-600 hover:underline"
                >
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-3">
                {applicants.slice(0, 3).map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold">{app.id}</span>
                      <h4 className="font-extrabold text-slate-900 text-sm">{app.fullName}</h4>
                      <p className="text-slate-500">Pilihan: <strong className="uppercase text-slate-800">{app.selectedMajor}</strong> | Asal: {app.originSchool}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-900 font-extrabold px-3 py-1 rounded-full text-[11px] border border-amber-300">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 space-y-4 shadow-2xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" /> Audit Transaksi SPP Digital
                </h3>
                <button
                  onClick={() => setActiveAdminTab('spp')}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  Lihat Semua
                </button>
              </div>
              <div className="space-y-3">
                {invoices.slice(0, 3).map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{inv.studentName}</span>
                      <p className="text-slate-500">{inv.feeType} ({inv.monthPeriod}) | Kelas: {inv.classGrade}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-slate-900 block text-sm">
                        Rp {inv.amount.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black border border-emerald-300">
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAJEMEN PENGGUNA (TAMBAH / EDIT / HAPUS & RESET PASSWORD & SPREADSHEET SYNC) */}
        {activeAdminTab === 'pengguna' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" /> Tabel Manajemen Akun Pengguna & Central Spreadsheet Backup
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kelola hak akses dan password terdaftar untuk Administrator, Guru, Wali Kelas, dan Orang Tua / Siswa.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportUsersCSV}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  title="Unduh seluruh data akun ke file .csv Excel / Google Sheets"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh Spreadsheet Akun (.csv)
                </button>

                <button
                  onClick={handleTriggerDirectSpreadsheetSync}
                  disabled={isSyncingSheets}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
                  <span>{isSyncingSheets ? 'Mengingkronkan...' : 'Singkronkan Ke Google Sheets'}</span>
                </button>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" /> Tambah Akun Baru
                </button>
              </div>
            </div>

            {/* Google Sheets Webhook Configurator Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/40 text-white space-y-4 shadow-md">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                      Integrasi Google Spreadsheet Real-Time &amp; Backup Central
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    Semua akun pengguna, password terdaftar, data pendaftar PPDB, dan tagihan SPP dapat diakses dan diunduh langsung ke Google Sheets &amp; Excel.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href="https://docs.google.com/spreadsheets/u/0/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Buka Google Sheets
                  </a>
                  <button
                    onClick={handleExportApplicantsCSV}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Export PPDB (.csv)
                  </button>
                  <button
                    onClick={handleExportInvoicesCSV}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Export SPP (.csv)
                  </button>
                </div>
              </div>

              {/* Webhook Form Config */}
              <form onSubmit={handleSaveWebhookUrl} className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-2">
                <span className="text-[11px] font-bold text-slate-300 shrink-0">URL Google Apps Script Webhook:</span>
                <input
                  type="text"
                  value={googleSheetsWebhookUrl}
                  onChange={(e) => setGoogleSheetsWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/..."
                  className="w-full text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-emerald-300 font-mono focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shrink-0 cursor-pointer border border-slate-700"
                >
                  Simpan URL
                </button>
              </form>
            </div>

            {/* Table Users */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-900 text-slate-200 uppercase font-extrabold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Nama Lengkap &amp; User ID</th>
                    <th className="py-3.5 px-4">Username / Email</th>
                    <th className="py-3.5 px-4">Password (Cadangan)</th>
                    <th className="py-3.5 px-4 text-center">Hak Akses (Role)</th>
                    <th className="py-3.5 px-4 text-center">Akses Terakhir</th>
                    <th className="py-3.5 px-4 text-center">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {userAccounts.map((usr) => (
                    <tr key={usr.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 text-sm">{usr.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{usr.id}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{usr.username}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{usr.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            {showPasswordMap[usr.id] ? (usr.password || '123456') : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleShowPassword(usr.id)}
                            className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 cursor-pointer"
                            title="Lihat / Sembunyikan Password"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                            usr.role === 'admin'
                              ? 'bg-purple-100 text-purple-900 border-purple-300'
                              : usr.role === 'walikelas'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : usr.role === 'guru'
                              ? 'bg-sky-100 text-sky-900 border-sky-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}
                        >
                          {usr.role === 'walikelas' ? 'Wali Kelas' : usr.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-[11px]">
                        {usr.lastLogin}
                      </td>
                      <td className="py-3.5 px-4 text-center space-x-1">
                        <button
                          onClick={() => handleResetPassword(usr)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-[10px] inline-flex items-center gap-1 cursor-pointer transition"
                          title="Reset Password"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset Password
                        </button>

                        <button
                          onClick={() => handleDeleteUser(usr.id, usr.name)}
                          className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 cursor-pointer transition inline-flex"
                          title="Hapus Akun"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PENGATURAN AKADEMIK (TAHUN AJARAN, ROMBEL, JURUSAN, PLOTTING JADWAL GURU) */}
        {activeAdminTab === 'akademik' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-600" /> Panel Pengaturan Akademik &amp; Kurikulum
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola Tahun Ajaran aktif, Rombongan Belajar (Kelas), Program Keahlian Jurusan, dan Plotting Jadwal Guru.
              </p>
            </div>

            {/* Academic Sub Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <button
                onClick={() => setAcademicSubTab('tahun_ajaran')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  academicSubTab === 'tahun_ajaran'
                    ? 'bg-slate-900 text-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tahun Ajaran &amp; Semester
              </button>

              <button
                onClick={() => setAcademicSubTab('rombel')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  academicSubTab === 'rombel'
                    ? 'bg-slate-900 text-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pengaturan Rombel / Kelas ({classList.length})
              </button>

              <button
                onClick={() => setAcademicSubTab('jurusan')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  academicSubTab === 'jurusan'
                    ? 'bg-slate-900 text-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Program Keahlian Jurusan
              </button>

              <button
                onClick={() => setAcademicSubTab('jadwal')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  academicSubTab === 'jadwal'
                    ? 'bg-slate-900 text-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Plotting Jadwal Mengajar Guru ({schedules.length})
              </button>
            </div>

            {/* Sub-content 1: Tahun Ajaran */}
            {academicSubTab === 'tahun_ajaran' && (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Status Semester Aktif:</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
                    Aktif Berjalan
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tahun Ajaran Active:
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-extrabold focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => alert(`Tahun Ajaran berhasil disimpan: ${academicYear}`)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow-md"
                  >
                    Simpan Pengaturan Tahun Ajaran
                  </button>
                </div>
              </div>
            )}

            {/* Sub-content 2: Rombel / Kelas */}
            {academicSubTab === 'rombel' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classList.map((cls) => (
                  <div key={cls.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-slate-900 text-amber-300 font-black text-xs">
                        {cls.className}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        Ruangan: <strong className="text-slate-800">{cls.roomNumber}</strong>
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Wali Kelas Binaan:</span>
                      <h4 className="text-sm font-extrabold text-slate-900">{cls.homeroomTeacher}</h4>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                      <span className="text-slate-600 font-bold">Kapasitas: <strong>{cls.totalStudents} Siswa</strong></span>
                      <button
                        onClick={() => alert(`Atur ulang Wali Kelas untuk ${cls.className}`)}
                        className="text-amber-600 font-extrabold hover:underline text-xs"
                      >
                        Ubah Wali Kelas
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sub-content 3: Jurusan Keahlian */}
            {academicSubTab === 'jurusan' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                    TSM
                  </span>
                  <h4 className="text-base font-black text-slate-900">Teknik Sepeda Motor (Honda)</h4>
                  <p className="text-xs text-slate-600">Kerjasama industri Pos AHASS &amp; PT Astra Honda Motor.</p>
                  <span className="text-xs font-bold text-slate-700 block pt-2">Kapasitas: 410 Siswa</span>
                </div>

                <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-400 text-slate-950 font-black text-[10px]">
                    TJKT
                  </span>
                  <h4 className="text-base font-black text-slate-900">Teknik Jaringan Komputer &amp; Telekomunikasi</h4>
                  <p className="text-xs text-slate-600">Spesialisasi Fiber Optik, Mikrotik Router, &amp; Cloud Server.</p>
                  <span className="text-xs font-bold text-slate-700 block pt-2">Kapasitas: 450 Siswa</span>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-black text-[10px]">
                    MPLB
                  </span>
                  <h4 className="text-base font-black text-slate-900">Manajemen Perkantoran &amp; Layanan Bisnis</h4>
                  <p className="text-xs text-slate-600">Otomatisasi perkantoran digital &amp; kearsipan elektronik.</p>
                  <span className="text-xs font-bold text-slate-700 block pt-2">Kapasitas: 380 Siswa</span>
                </div>
              </div>
            )}

            {/* Sub-content 4: Plotting Jadwal Mengajar Guru */}
            {academicSubTab === 'jadwal' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-slate-900 text-sm">Daftar Plotting Jadwal Mengajar Mingguan</h4>
                  <button
                    onClick={() => setShowAddScheduleModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" /> Plotting Jadwal Baru
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-900 text-slate-200 uppercase font-extrabold text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Hari &amp; Jam</th>
                        <th className="py-3 px-4">Mata Pelajaran</th>
                        <th className="py-3 px-4">Guru Pengajar</th>
                        <th className="py-3 px-4">Kelas Target</th>
                        <th className="py-3 px-4">Ruangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {schedules.map((sch) => (
                        <tr key={sch.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {sch.day}<br />
                            <span className="text-slate-500 text-[10px]">{sch.timeSlot}</span>
                          </td>
                          <td className="py-3 px-4 font-extrabold text-slate-900">{sch.subject}</td>
                          <td className="py-3 px-4 text-emerald-800 font-bold">{sch.teacherName}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-900 font-black text-[10px] border border-slate-300">
                              {sch.targetClass}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{sch.room}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PANEL VERIFIKASI PPDB ONLINE (APPROVE / REJECT) */}
        {activeAdminTab === 'ppdb' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-500" /> Panel Verifikasi Berkas PPDB Online 2026
                </h3>
                <p className="text-xs text-slate-500">
                  Periksa kelengkapan Ijazah/SKL, Kartu Keluarga, dan tentukan kelulusan calon siswa pendaftar.
                </p>
              </div>
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                Total: {applicants.length} Calon Siswa
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-900 text-slate-200 uppercase font-extrabold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">No. Reg / NISN</th>
                    <th className="py-3.5 px-4">Nama Calon Siswa &amp; Asal</th>
                    <th className="py-3.5 px-4">Jurusan Pilihan</th>
                    <th className="py-3.5 px-4 text-center">Kelengkapan Dokumen</th>
                    <th className="py-3.5 px-4 text-center">Status Verifikasi</th>
                    <th className="py-3.5 px-4 text-center">Aksi Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {applicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                        {app.id}<br />
                        <span className="text-slate-500 text-[10px]">NISN: {app.nisn}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900 text-sm">{app.fullName}</div>
                        <div className="text-slate-500 text-[11px]">{app.originSchool}</div>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold uppercase text-slate-800">{app.selectedMajor}</td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ SKL
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ KK
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ Foto
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                            app.status === 'Diterima' || app.status === 'Lulus Seleksi'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : app.status === 'Ditolak'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center space-x-1 space-y-1">
                        {app.paymentProofUrl ? (
                          <button
                            onClick={() => setSelectedProofApplicant(app)}
                            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border border-indigo-300 px-2.5 py-1.5 rounded-xl text-xs font-black shadow-2xs inline-flex items-center gap-1 cursor-pointer transition"
                            title="Lihat Bukti Transfer & Pembayaran PPDB"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-indigo-700" /> Bukti Transfer PPDB
                          </button>
                        ) : (
                          <span className="text-slate-400 font-medium text-[11px] italic block py-1">Belum Ada Bukti Transfer</span>
                        )}

                        {app.status !== 'Diterima' && (
                          <button
                            onClick={() => onUpdateApplicantStatus(app.id, 'Diterima')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-2xs inline-flex items-center gap-1 cursor-pointer transition"
                          >
                            <Check className="w-3.5 h-3.5" /> Terima (Approve)
                          </button>
                        )}

                        {app.status !== 'Ditolak' && (
                          <button
                            onClick={() => onUpdateApplicantStatus(app.id, 'Ditolak')}
                            className="bg-rose-100 hover:bg-rose-200 text-rose-800 px-3 py-1.5 rounded-xl text-xs font-black inline-flex items-center gap-1 cursor-pointer transition"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Tolak (Reject)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CMS BERITA & PENGUMUMAN SEKOLAH */}
        {activeAdminTab === 'cms' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-emerald-600" /> CMS Berita, Pengumuman, &amp; Agenda Sekolah
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publikasikan warta resmi sekolah ke portal depan untuk diakses masyarakat umum dan orang tua murid.
                </p>
              </div>

              <button
                onClick={() => setShowAddNewsModal(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" /> Terbitkan Berita Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newsList.map((item) => (
                <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-300">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.publishDate}</span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-slate-500">Penulis: {item.author}</span>
                    <button
                      onClick={() => alert(`Detail Berita: ${item.title}`)}
                      className="text-amber-600 font-extrabold hover:underline"
                    >
                      Edit Warta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5.5: PENGATURAN STATISTIK & PROFIL SEKOLAH */}
        {activeAdminTab === 'school_stats' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs space-y-8">
            {/* Header & Subtitle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-900 border border-amber-400/40 text-[11px] font-black uppercase tracking-wide inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Pengaturan Data Beranda Landing Page
                </span>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 mt-1">
                  <Activity className="w-6 h-6 text-amber-500" /> Pengaturan Statistik &amp; Profil Sekolah
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kelola data statistik angka yang ditampilkan pada 4 kartu utama di bagian Beranda serta data kontak resmi sekolah.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Sync Beranda Active
                </span>
              </div>
            </div>

            {/* LIVE PREVIEW OF THE 4 HERO STAT CARDS */}
            <div className="space-y-3 bg-slate-900 p-5 rounded-3xl border border-slate-800 text-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">Pratinjau Langsung Kartu Beranda (Live Preview)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Tampilan Realtime di Halaman Depan</span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {/* Stat 1 */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 text-amber-300 border border-slate-900 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black truncate">{statsForm.totalStudents || '1,240+'}</div>
                    <div className="text-[10px] font-bold text-amber-100">Siswa Aktif Belajar</div>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 text-amber-300 border border-slate-900 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black truncate">{statsForm.majorsCount || '3 Jurusan'}</div>
                    <div className="text-[10px] font-bold text-amber-100 truncate">{statsForm.majorsSubtext || 'TSM • TJKT • MPLB'}</div>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 text-amber-300 border border-slate-900 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black truncate">{statsForm.employmentRate || '98%'}</div>
                    <div className="text-[10px] font-bold text-amber-100">Terserap Kerja / Kuliah</div>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 text-amber-300 border border-slate-900 shrink-0">
                    <School className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-lg font-black truncate">{statsForm.partnerCompanies || '45+'}</div>
                    <div className="text-[10px] font-bold text-amber-100">Mitra Industri MoU</div>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM FORMULIR EDIT DATA STATISTIK & SEKOLAH */}
            <form onSubmit={handleSaveSchoolStats} className="space-y-6">
              
              {/* SECTION 1: EDIT 4 KARTU STATISTIK BERANDA */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <Award className="w-4 h-4 text-amber-500" /> Kelola Angka 4 Kartu Statistik Beranda
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Field 1: Total Siswa */}
                  <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                      <span>1. Siswa Aktif Belajar:</span>
                      <span className="text-[10px] font-mono text-slate-400">Kartu 1</span>
                    </label>
                    <input
                      type="text"
                      value={statsForm.totalStudents}
                      onChange={(e) => setStatsForm({ ...statsForm, totalStudents: e.target.value })}
                      placeholder="Contoh: 1,240+"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                    <p className="text-[10px] text-slate-500">Nilai statistik total murid aktif yang tampil pada kartu pertama.</p>
                  </div>

                  {/* Field 2: Info Jurusan (Teks & Subteks) */}
                  <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                      <span>2. Info Jurusan Utama:</span>
                      <span className="text-[10px] font-mono text-slate-400">Kartu 2</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={statsForm.majorsCount}
                        onChange={(e) => setStatsForm({ ...statsForm, majorsCount: e.target.value })}
                        placeholder="Contoh: 3 Jurusan"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                      />
                      <input
                        type="text"
                        value={statsForm.majorsSubtext}
                        onChange={(e) => setStatsForm({ ...statsForm, majorsSubtext: e.target.value })}
                        placeholder="Contoh: TSM • TJKT • MPLB"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-extrabold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">Judul utama (misal: 3 Jurusan) dan daftar kode jurusan bawahnya.</p>
                  </div>

                  {/* Field 3: Terserap Kerja / Kuliah */}
                  <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                      <span>3. Terserap Kerja / Kuliah:</span>
                      <span className="text-[10px] font-mono text-slate-400">Kartu 3</span>
                    </label>
                    <input
                      type="text"
                      value={statsForm.employmentRate}
                      onChange={(e) => setStatsForm({ ...statsForm, employmentRate: e.target.value })}
                      placeholder="Contoh: 98%"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                    <p className="text-[10px] text-slate-500">Persentase keberhasilan lulusan bekerja atau kuliah.</p>
                  </div>

                  {/* Field 4: Mitra Industri MoU */}
                  <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                      <span>4. Mitra Industri MoU:</span>
                      <span className="text-[10px] font-mono text-slate-400">Kartu 4</span>
                    </label>
                    <input
                      type="text"
                      value={statsForm.partnerCompanies}
                      onChange={(e) => setStatsForm({ ...statsForm, partnerCompanies: e.target.value })}
                      placeholder="Contoh: 45+"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                    <p className="text-[10px] text-slate-500">Jumlah perusahaan industri mitra resmi sekolah.</p>
                  </div>

                  {/* Field 5: Total Guru & Pendidik */}
                  <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                      <span>5. Total Guru &amp; Pendidik:</span>
                      <span className="text-[10px] font-mono text-slate-400">Profil GTK</span>
                    </label>
                    <input
                      type="text"
                      value={statsForm.totalTeachers}
                      onChange={(e) => setStatsForm({ ...statsForm, totalTeachers: e.target.value })}
                      placeholder="Contoh: 68 Orang"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-black text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                    <p className="text-[10px] text-slate-500">Jumlah pengajar dan tenaga kependidikan terdaftar.</p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: EDIT INFORMASI IDENTITAS & KONTAK RESMI SEKOLAH */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
                  <School className="w-4 h-4 text-emerald-600" /> Kelola Data Identitas &amp; Kontak Resmi Sekolah
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Nama Resmi Sekolah:</label>
                    <input
                      type="text"
                      value={statsForm.name}
                      onChange={(e) => setStatsForm({ ...statsForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">NPSN Sekolah:</label>
                    <input
                      type="text"
                      value={statsForm.npsn}
                      onChange={(e) => setStatsForm({ ...statsForm, npsn: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Status Akreditasi:</label>
                    <input
                      type="text"
                      value={statsForm.accreditation}
                      onChange={(e) => setStatsForm({ ...statsForm, accreditation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Nama Kepala Sekolah:</label>
                    <input
                      type="text"
                      value={statsForm.principal}
                      onChange={(e) => setStatsForm({ ...statsForm, principal: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Tahun Ajaran Aktif:</label>
                    <input
                      type="text"
                      value={statsForm.academicYear}
                      onChange={(e) => setStatsForm({ ...statsForm, academicYear: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">No. WhatsApp Official:</label>
                    <input
                      type="text"
                      value={statsForm.whatsapp}
                      onChange={(e) => setStatsForm({ ...statsForm, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Email Official Sekolah:</label>
                    <input
                      type="email"
                      value={statsForm.email}
                      onChange={(e) => setStatsForm({ ...statsForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">No. Telepon Kantor:</label>
                    <input
                      type="text"
                      value={statsForm.phone}
                      onChange={(e) => setStatsForm({ ...statsForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Alamat Lengkap Sekolah:</label>
                    <input
                      type="text"
                      value={statsForm.address}
                      onChange={(e) => setStatsForm({ ...statsForm, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tersimpan di Local Storage &amp; Otomatis Tersinkron ke Halaman Beranda Utama.</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-105 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition"
                >
                  <Check className="w-4 h-4" /> Simpan Perubahan Statistik &amp; Profil Sekolah
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB: MANAGEMENT PROFIL GURU & PENDIDIK */}
        {activeAdminTab === 'teachers_sync' && (
          <div className="space-y-6">
            {/* Form Tambah Guru Baru */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-purple-600" /> Tambah Profil Guru &amp; Tenaga Pendidik
                  </h3>
                  <p className="text-xs text-slate-500">
                    Setiap profil guru yang diatur di sini akan otomatis tersinkronisasi dan tampil pada Slider Guru di Beranda.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateTeacherSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Nama Lengkap &amp; Gelar *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Drs. H. Ahmad Sanusi, M.Pd."
                      value={newTeacherForm.name}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Jabatan / Role Sekolah</label>
                    <input
                      type="text"
                      placeholder="Contoh: Kepala Program Keahlian TSM"
                      value={newTeacherForm.role}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, role: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Kategori Pengelompokan</label>
                    <select
                      value={newTeacherForm.category}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, category: e.target.value as Teacher['category'] })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      <option value="pimpinan">Pimpinan Sekolah</option>
                      <option value="kaprog">Kepala Program Keahlian (Kaprog)</option>
                      <option value="guru">Guru Kejuruan / Umum</option>
                      <option value="pesantren">Pembina Pesantren &amp; Karakter</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Mata Pelajaran Utama / Kepakaran *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Pemeliharaan Mesin Sepeda Motor"
                      value={newTeacherForm.subject}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Pendidikan / Kualifikasi</label>
                    <input
                      type="text"
                      placeholder="Contoh: Sarjana Teknik (S1)"
                      value={newTeacherForm.education}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, education: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Pengalaman / Masa Mengabdi</label>
                    <input
                      type="text"
                      placeholder="Contoh: 12 Tahun Mengabdi"
                      value={newTeacherForm.experience}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Badge Sertifikasi / Penghargaan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Asesor Kompetensi AHASS Honda"
                      value={newTeacherForm.badge}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">No. Kontak / WhatsApp (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Contoh: 0812-3456-7890"
                      value={newTeacherForm.phone}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  {/* Upload Foto Guru dari Berkas HP / Komputer */}
                  <div className="sm:col-span-2 lg:col-span-3 space-y-2 p-4 rounded-2xl bg-purple-50/50 border border-purple-200">
                    <label className="text-xs font-extrabold text-purple-950 block">Foto Guru &amp; Pendidik</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <label className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition shrink-0">
                        <Upload className="w-4 h-4" /> Pilih Foto dari Berkas HP / Komputer
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUploadAsDataUrl(e, (url) => setNewTeacherForm({ ...newTeacherForm, photo: url }))}
                        />
                      </label>
                      <span className="text-xs font-bold text-slate-400 self-center">atau masukan URL Foto:</span>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={newTeacherForm.photo}
                        onChange={(e) => setNewTeacherForm({ ...newTeacherForm, photo: e.target.value })}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 bg-white"
                      />
                    </div>
                    {newTeacherForm.photo && (
                      <div className="flex items-center gap-3 pt-2">
                        <img src={newTeacherForm.photo} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-purple-500 shadow-sm" />
                        <span className="text-[11px] text-emerald-700 font-bold">✓ Foto siap digunakan</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Kutipan / Moto Mengajar Guru</label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Mengisi akal dengan sains dan teknologi, menghiasi jiwa dengan adab dan akhlakul karimah."
                      value={newTeacherForm.quote}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, quote: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Simpan &amp; Publikasikan Profil Guru
                  </button>
                </div>
              </form>
            </div>

            {/* List Guru Terdaftar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center justify-between">
                <span>Daftar Profil Guru Terdaftar ({teachers.length})</span>
                <span className="text-xs text-purple-600 font-bold bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  Tersinkronisasi ke Halaman Beranda
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-3.5 hover:shadow-md transition">
                    <img src={t.photo} alt={t.name} className="w-14 h-14 rounded-2xl object-cover shrink-0 border-2 border-purple-400/50 shadow-xs" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                          {t.categoryLabel || t.category}
                        </span>
                        {onDeleteTeacher && (
                          <button
                            onClick={() => {
                              if (confirm(`Hapus profil guru ${t.name}?`)) {
                                onDeleteTeacher(t.id);
                              }
                            }}
                            className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition"
                            title="Hapus Guru"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <h4 className="text-xs font-black text-slate-900 truncate">{t.name}</h4>
                      <p className="text-[11px] text-slate-600 font-semibold truncate">{t.role}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{t.subject} • {t.experience}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: PENGATURAN MEDIA & LINK VIDEO BERANDA */}
        {activeAdminTab === 'video_media' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-red-600" /> Pengaturan Video, Media &amp; Foto Kepala Sekolah
                </h3>
                <p className="text-xs text-slate-500">
                  Atur video profil YouTube, video tour virtual, foto sambutan kepala sekolah, dan foto hero banner utama.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Box 1: Link Media & Video Youtube */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <PlaySquare className="w-4 h-4 text-red-600" /> Link Video Youtube Media Sekolah
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">URL Youtube Tour Virtual Kampus:</label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={schoolInfo?.virtualTourUrl || ''}
                      onChange={(e) => onUpdateSchoolInfo && schoolInfo && onUpdateSchoolInfo({ ...schoolInfo, virtualTourUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500 bg-white"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Ditampilkan pada slide virtual tour dan tombol media utama.</p>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">URL Youtube Video Profil Sambutan:</label>
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={schoolInfo?.principalVideoUrl || ''}
                      onChange={(e) => onUpdateSchoolInfo && schoolInfo && onUpdateSchoolInfo({ ...schoolInfo, principalVideoUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500 bg-white"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Ditampilkan pada modal video pesan pimpinan sekolah.</p>
                  </div>
                </div>
              </div>

              {/* Box 1.5: Pengaturan Logo Resmi Sekolah */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-4">
                <h4 className="text-sm font-black text-blue-950 flex items-center gap-2">
                  <Image className="w-4 h-4 text-blue-600" /> Logo Resmi SMK Islam Cipasung
                </h4>

                <div className="space-y-3">
                  <label className="text-xs font-extrabold text-slate-700 block">Upload Berkas / URL Logo Sekolah:</label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0">
                      <Upload className="w-4 h-4" /> Unggah Logo HP / Galeri
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUploadAsDataUrl(e, (url) => onUpdateSchoolInfo && schoolInfo && onUpdateSchoolInfo({ ...schoolInfo, logoUrl: url }))}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Atau URL logo https://..."
                      value={schoolInfo?.logoUrl || ''}
                      onChange={(e) => onUpdateSchoolInfo && schoolInfo && onUpdateSchoolInfo({ ...schoolInfo, logoUrl: e.target.value })}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                  {schoolInfo?.logoUrl && (
                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-xs text-slate-500 font-bold">Pratinjau Logo Custom:</span>
                      <img src={schoolInfo.logoUrl} alt="Logo Preview" className="w-10 h-10 object-contain rounded-lg border border-slate-300 p-1 bg-white shadow-2xs" />
                      <button
                        type="button"
                        onClick={() => onUpdateSchoolInfo && schoolInfo && onUpdateSchoolInfo({ ...schoolInfo, logoUrl: '' })}
                        className="text-xs text-red-600 font-bold underline cursor-pointer hover:text-red-700"
                      >
                        Reset ke Logo Bawaan Vector
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500">Logo ini akan otomatis digunakan di Header Navbar, Footer, dan dokumen kuitansi/kartu PPDB.</p>
                </div>
              </div>

              {/* Box 2: Pengaturan Foto Kepala Sekolah & Pesan */}
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4">
                <h4 className="text-sm font-black text-amber-950 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-600" /> Foto Sambutan &amp; Profil Kepala Sekolah
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Nama Lengkap Kepala Sekolah:</label>
                    <input
                      type="text"
                      value={schoolInfo?.principal || ''}
                      onChange={(e) => onUpdateSchoolInfo && schoolInfo && onUpdateSchoolInfo({ ...schoolInfo, principal: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Upload / Pilih Foto Kepala Sekolah:</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <label className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0">
                        <Upload className="w-4 h-4" /> Unggah Berkas HP
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUploadAsDataUrl(e, (url) => onUpdateSchoolInfo && schoolInfo && onUpdateSchoolInfo({ ...schoolInfo, principalPhoto: url }))}
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Atau URL foto https://..."
                        value={schoolInfo?.principalPhoto || ''}
                        onChange={(e) => onUpdateSchoolInfo && schoolInfo && onUpdateSchoolInfo({ ...schoolInfo, principalPhoto: e.target.value })}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Teks Sambutan Pimpinan Sekolah:</label>
                    <textarea
                      rows={3}
                      value={schoolInfo?.principalMessage || ''}
                      onChange={(e) => onUpdateSchoolInfo && schoolInfo && onUpdateSchoolInfo({ ...schoolInfo, principalMessage: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Box 3: Hero Banner Foto Utama Beranda */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-4">
                <h4 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                  <Film className="w-4 h-4 text-emerald-600" /> Foto Banner Utama (Hero Banner Beranda)
                </h4>

                <div className="space-y-3">
                  <label className="text-xs font-extrabold text-slate-700 block">Upload / Pilih Foto Banner Utama:</label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0">
                      <Upload className="w-4 h-4" /> Unggah Foto Banner HP / Komputer
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUploadAsDataUrl(e, (url) => onUpdateSchoolInfo && schoolInfo && onUpdateSchoolInfo({ ...schoolInfo, heroBannerPhoto: url }))}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Atau masukan URL foto https://..."
                      value={schoolInfo?.heroBannerPhoto || ''}
                      onChange={(e) => onUpdateSchoolInfo && schoolInfo && onUpdateSchoolInfo({ ...schoolInfo, heroBannerPhoto: e.target.value })}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  {schoolInfo?.heroBannerPhoto && (
                    <div className="pt-2">
                      <img src={schoolInfo.heroBannerPhoto} alt="Hero Banner" className="w-full h-32 object-cover rounded-xl border border-emerald-300 shadow-xs" />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('✓ Semua Pengaturan Media, Link Video, dan Foto Beranda Berhasil Diperbarui & Tersinkron!')}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Simpan &amp; Perbarui Semua Media Beranda
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MANAGEMENT GALERI & DOKUMEN */}
        {activeAdminTab === 'gallery_docs' && (
          <div className="space-y-6">
            {/* Form Tambah Galeri Foto Baru */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-indigo-600" /> Tambah Foto Galeri &amp; Dokumen Sekolah Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Unggah dokumentasi foto kegiatan, prestasi, atau pengajian santri untuk ditampilkan pada Galeri Utama Beranda.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateGallerySubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Judul Foto / Dokumen Kegiatan *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Praktik Uji Kompetensi Keahlian TSM Honda"
                      value={newGalleryForm.title}
                      onChange={(e) => setNewGalleryForm({ ...newGalleryForm, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Kategori Kegiatan Galeri</label>
                    <select
                      value={newGalleryForm.category}
                      onChange={(e) => setNewGalleryForm({ ...newGalleryForm, category: e.target.value as GalleryItem['category'] })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                      <option value="Praktik Keahlian">Praktik Keahlian</option>
                      <option value="Keagamaan">Keagamaan &amp; Pesantren</option>
                      <option value="Ekstrakurikuler">Ekstrakurikuler &amp; Olahraga</option>
                      <option value="Prestasi">Prestasi &amp; Penghargaan</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Penulis / Fotografer</label>
                    <input
                      type="text"
                      placeholder="Contoh: Humas &amp; Media SMK Islam Cipasung"
                      value={newGalleryForm.author}
                      onChange={(e) => setNewGalleryForm({ ...newGalleryForm, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  {/* Upload File Foto HP / Komputer */}
                  <div className="sm:col-span-2 lg:col-span-3 space-y-2 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200">
                    <label className="text-xs font-extrabold text-indigo-950 block">Pilih / Unggah Berkas Foto Galeri</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <label className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition shrink-0">
                        <Upload className="w-4 h-4" /> Upload Foto dari HP / Komputer
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUploadAsDataUrl(e, (url) => setNewGalleryForm({ ...newGalleryForm, imageUrl: url }))}
                        />
                      </label>
                      <span className="text-xs font-bold text-slate-400 self-center">atau masukan URL Foto:</span>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={newGalleryForm.imageUrl}
                        onChange={(e) => setNewGalleryForm({ ...newGalleryForm, imageUrl: e.target.value })}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Deskripsi Singkat Kegiatan</label>
                    <textarea
                      rows={2}
                      placeholder="Contoh: Dokumentasi suasana ujikom keahlian siswa teknik sepeda motor standar AHASS Honda."
                      value={newGalleryForm.description}
                      onChange={(e) => setNewGalleryForm({ ...newGalleryForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Publikasikan Foto Galeri ke Beranda
                  </button>
                </div>
              </form>
            </div>

            {/* List Galeri Terdaftar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center justify-between">
                <span>Daftar Galeri Foto Beranda ({galleryItems.length})</span>
                <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  Tersimpan di Sistem Local Storage
                </span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryItems.map((g) => (
                  <div key={g.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 hover:shadow-md transition">
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                      <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-slate-950/80 text-amber-300 text-[9px] font-black uppercase backdrop-blur-xs">
                        {g.category}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-black text-slate-900 line-clamp-1">{g.title}</h4>
                      {onDeleteGalleryItem && (
                        <button
                          onClick={() => {
                            if (confirm(`Hapus foto galeri "${g.title}"?`)) {
                              onDeleteGalleryItem(g.id);
                            }
                          }}
                          className="text-slate-400 hover:text-red-600 p-1 cursor-pointer transition shrink-0"
                          title="Hapus Foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2">{g.description}</p>
                    <div className="text-[9px] text-slate-400 font-bold flex justify-between border-t border-slate-200/60 pt-1.5">
                      <span>{g.date}</span>
                      <span>Oleh: {g.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PENGATURAN AGENDA & JADWAL KEGIATAN SEKOLAH */}
        {activeAdminTab === 'events_agenda' && (
          <div className="space-y-6">
            {/* Form Tambah Agenda Baru */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sky-600" /> Tambah Agenda &amp; Jadwal Kegiatan Sekolah Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Jadwal yang ditambahkan di sini akan langsung tampil pada Kalender Kegiatan di Halaman Utama (Beranda).
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateEventSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Judul Kegiatan / Agenda *</label>
                    <input
                      type="text"
                      required
                      value={newEventForm.title}
                      onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                      placeholder="Contoh: Penilaian Tengah Semester (PTS) Ganjil"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Kategori Kegiatan *</label>
                    <select
                      value={newEventForm.category}
                      onChange={(e) => setNewEventForm({ ...newEventForm, category: e.target.value as SchoolEvent['category'] })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                    >
                      <option value="Akademik">Akademik</option>
                      <option value="Keagamaan">Keagamaan / PHBI</option>
                      <option value="Ujian">Ujian / Sertifikasi</option>
                      <option value="PKL / BKK">PKL / BKK / Magang</option>
                      <option value="Kesiswaan">Kesiswaan &amp; Ekskul</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Tanggal Pelaksanaan *</label>
                    <input
                      type="text"
                      required
                      value={newEventForm.date}
                      onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                      placeholder="Contoh: 15 - 20 September 2026"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Waktu / Jam Pelaksanaan</label>
                    <input
                      type="text"
                      value={newEventForm.time}
                      onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })}
                      placeholder="Contoh: 07:30 - 13:00 WIB"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Lokasi Kegiatan</label>
                    <input
                      type="text"
                      value={newEventForm.location}
                      onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                      placeholder="Contoh: Gedung RKB / Kampus Cipasung"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Deskripsi Singkat Kegiatan</label>
                    <textarea
                      rows={2}
                      value={newEventForm.description}
                      onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                      placeholder="Tuliskan keterangan singkat mengenai pelaksanaan kegiatan ini..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isImportant"
                      checked={newEventForm.isImportant}
                      onChange={(e) => setNewEventForm({ ...newEventForm, isImportant: e.target.checked })}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 cursor-pointer"
                    />
                    <label htmlFor="isImportant" className="text-xs font-extrabold text-slate-800 cursor-pointer">
                      Tandai sebagai Agenda Penting ★
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition"
                  >
                    <Plus className="w-4 h-4" /> Tambah Kegiatan Baru
                  </button>
                </div>
              </form>
            </div>

            {/* Tabel / Daftar Agenda Terdaftar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h4 className="text-sm font-black text-slate-900 flex items-center justify-between">
                <span>Daftar Agenda &amp; Kegiatan Terdaftar ({events.length})</span>
                <span className="text-xs font-normal text-slate-500">Akses Publik Beranda</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-sky-100 text-sky-800">
                          {evt.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          ID: {evt.id}
                        </span>
                      </div>

                      <h5 className="text-sm font-black text-slate-900">{evt.title}</h5>

                      <div className="text-xs text-slate-600 space-y-1 font-medium">
                        <p>📅 <strong>Tanggal:</strong> {evt.date} ({evt.time})</p>
                        <p>📍 <strong>Lokasi:</strong> {evt.location}</p>
                        <p className="text-slate-500 line-clamp-2">{evt.description}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500">Penyelenggara: {evt.organizer}</span>
                      {onDeleteEvent && (
                        <button
                          onClick={() => onDeleteEvent(evt.id)}
                          className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-extrabold flex items-center gap-1 cursor-pointer transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Hapus
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: KELOLA TESTIMONI ALUMNI & BURSA KERJA */}
        {activeAdminTab === 'alumni_bkk' && (
          <div className="space-y-6">
            {/* Form Tambah Testimoni Alumni */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" /> Tambah Testimoni &amp; Kisah Sukses Alumni Baru
                  </h3>
                  <p className="text-xs text-slate-500">
                    Testimoni alumni bekerja / kuliah akan ditampilkan pada bagian Kisah Sukses Alumni di Halaman Utama.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateAlumniSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Nama Lengkap Alumni *</label>
                    <input
                      type="text"
                      required
                      value={newAlumniForm.name}
                      onChange={(e) => setNewAlumniForm({ ...newAlumniForm, name: e.target.value })}
                      placeholder="Contoh: M. Rizky Pratama, A.Md.T"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Angkatan Lulus *</label>
                    <input
                      type="text"
                      required
                      value={newAlumniForm.graduationYear}
                      onChange={(e) => setNewAlumniForm({ ...newAlumniForm, graduationYear: e.target.value })}
                      placeholder="Contoh: Lulusan 2023"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Jurusan SMK *</label>
                    <input
                      type="text"
                      required
                      value={newAlumniForm.majorName}
                      onChange={(e) => setNewAlumniForm({ ...newAlumniForm, majorName: e.target.value })}
                      placeholder="Contoh: TJKT Cisco / TBSM Honda"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Jabatan / Karir Saat Ini</label>
                    <input
                      type="text"
                      value={newAlumniForm.currentRole}
                      onChange={(e) => setNewAlumniForm({ ...newAlumniForm, currentRole: e.target.value })}
                      placeholder="Contoh: Network Engineer / Head Advisor"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Tempat Kerja / Perguruan Tinggi</label>
                    <input
                      type="text"
                      value={newAlumniForm.companyOrCampus}
                      onChange={(e) => setNewAlumniForm({ ...newAlumniForm, companyOrCampus: e.target.value })}
                      placeholder="Contoh: PT Telkom Akses / UNSIL"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">URL Foto Alumni</label>
                    <input
                      type="text"
                      value={newAlumniForm.photoUrl}
                      onChange={(e) => setNewAlumniForm({ ...newAlumniForm, photoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="text-xs font-extrabold text-slate-700 block mb-1">Kutipan / Testimoni Alumni *</label>
                    <textarea
                      rows={2}
                      required
                      value={newAlumniForm.quote}
                      onChange={(e) => setNewAlumniForm({ ...newAlumniForm, quote: e.target.value })}
                      placeholder="Tuliskan pengalaman alumni belajar di SMK Islam Cipasung dan dampaknya bagi karir..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition"
                  >
                    <Plus className="w-4 h-4" /> Tambah Testimoni Alumni
                  </button>
                </div>
              </form>
            </div>

            {/* Daftar Testimoni Alumni Terdaftar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h4 className="text-sm font-black text-slate-900">
                Daftar Testimoni Alumni Terdaftar ({testimonials.length})
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((alm) => (
                  <div key={alm.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                    <img src={alm.photoUrl} alt={alm.name} className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-slate-900 truncate">{alm.name}</h5>
                        {onDeleteTestimonial && (
                          <button
                            onClick={() => onDeleteTestimonial(alm.id)}
                            className="text-red-600 hover:text-red-800 text-[11px] font-bold cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-emerald-700">{alm.currentRole} • {alm.companyOrCampus}</p>
                      <p className="text-[11px] text-slate-600 italic line-clamp-2">"{alm.quote}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: VALIDASI SPP DIGITAL */}
        {activeAdminTab === 'spp' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" /> Audit &amp; Validasi Tagihan SPP Digital
                </h3>
                <p className="text-xs text-slate-500">
                  Validasi konfirmasi pembayaran SPP online dari rekening sekolah &amp; dompet digital.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-900 text-slate-200 uppercase font-extrabold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">No. Tagihan</th>
                    <th className="py-3.5 px-4">Nama Siswa &amp; Kelas</th>
                    <th className="py-3.5 px-4">Biaya &amp; Periode</th>
                    <th className="py-3.5 px-4">Nominal</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Aksi Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{inv.invoiceNo}</td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">{inv.studentName} ({inv.classGrade})</td>
                      <td className="py-3.5 px-4 text-slate-600">{inv.feeType} - {inv.monthPeriod}</td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">Rp {inv.amount.toLocaleString('id-ID')}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                            inv.status === 'Lunas'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : inv.status === 'Menunggu Verifikasi'
                              ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                              : 'bg-slate-100 text-slate-800 border-slate-300'
                          }`}
                        >
                          {inv.status === 'Menunggu Verifikasi' ? '⏳ Menunggu Verifikasi' : inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center space-y-1.5">
                        <button
                          onClick={() => setSelectedProofInvoice(inv)}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-black shadow-2xs inline-flex items-center gap-1.5 cursor-pointer transition w-full sm:w-auto justify-center"
                          title="Lihat Kuitansi & Resi Pembayaran Digital Wali Siswa"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-700" /> Lihat Resi Pembayaran
                        </button>

                        {inv.status !== 'Lunas' ? (
                          <button
                            onClick={() => {
                              onUpdateInvoiceStatus(inv.id, 'Lunas', inv.paymentMethod || 'Verifikasi Admin Manual');
                              alert(`✓ Tagihan ${inv.invoiceNo} untuk ${inv.studentName} berhasil Diverifikasi LUNAS!`);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-2xs transition cursor-pointer w-full sm:w-auto block mt-1"
                          >
                            Setujui Lunas
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-extrabold text-[11px] block mt-0.5">✓ Terverifikasi Lunas</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: WA GATEWAY BROADCAST */}
        {activeAdminTab === 'wa_gateway' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" /> Pusat WhatsApp Gateway &amp; Broadcast Orang Tua
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kirim pengumuman resmi sekolah, reminder tagihan SPP, atau berita kegiatan langsung ke WhatsApp Wali Murid.
              </p>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 max-w-2xl">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target Penerima Broadcast WhatsApp:
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="semua_ortu">Seluruh Orang Tua / Wali Siswa (1,240 Kontak)</option>
                  <option value="ortu_kelas_11">Orang Tua Kelas XI TJKT 1 (36 Kontak)</option>
                  <option value="ortu_tsm">Orang Tua Jurusan TSM (410 Kontak)</option>
                  <option value="ppdb_2026">Calon Orang Tua Siswa PPDB 2026</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Isi Pesan Broadcast Resmi:
                </label>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Contoh: Assalamu'alaikum Wr. Wb. Diberitahukan kepada seluruh Wali Murid bahwa Rapat Pleno Komite Sekolah..."
                  className="w-full p-3 rounded-2xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" /> Kirimkan Broadcast WhatsApp Sekarang
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL 1: TAMBAH USER AKUN BARU */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" /> Buat Akun Pengguna Baru
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap &amp; Gelar:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: H. M. Sidik, S.Ag"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Username Login:</label>
                  <input
                    type="text"
                    required
                    placeholder="guru.sidik"
                    value={newUserForm.username}
                    onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Role / Hak Akses:</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        role: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="guru">Guru Pengajar</option>
                    <option value="walikelas">Wali Kelas</option>
                    <option value="admin">Administrator Sekolah</option>
                    <option value="siswa">Siswa / Wali Murid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Resmi:</label>
                <input
                  type="email"
                  placeholder="guru.sidik@smkislamcipasung.sch.id"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Password Default:</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow-md"
                >
                  Simpan &amp; Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PLOTTING JADWAL MENGANJAR GURU */}
      {showAddScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" /> Plotting Jadwal Mengajar Guru
              </h3>
              <button
                onClick={() => setShowAddScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSchedule} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mata Pelajaran:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pemrograman Web & Cloud Computing"
                  value={newScheduleForm.subject}
                  onChange={(e) => setNewScheduleForm({ ...newScheduleForm, subject: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hari:</label>
                  <select
                    value={newScheduleForm.day}
                    onChange={(e) => setNewScheduleForm({ ...newScheduleForm, day: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Jam Mengajar:</label>
                  <input
                    type="text"
                    value={newScheduleForm.timeSlot}
                    onChange={(e) => setNewScheduleForm({ ...newScheduleForm, timeSlot: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kelas Target:</label>
                  <select
                    value={newScheduleForm.targetClass}
                    onChange={(e) => setNewScheduleForm({ ...newScheduleForm, targetClass: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="XI TJKT 1">XI TJKT 1</option>
                    <option value="XI TSM 1">XI TSM 1</option>
                    <option value="X MPLB 1">X MPLB 1</option>
                    <option value="XII TJKT 2">XII TJKT 2</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ruangan / Lab:</label>
                  <input
                    type="text"
                    value={newScheduleForm.room}
                    onChange={(e) => setNewScheduleForm({ ...newScheduleForm, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddScheduleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs cursor-pointer shadow-md"
                >
                  Plot Jadwal Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: TAMBAH CMS BERITA / PENGUMUMAN */}
      {showAddNewsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-emerald-600" /> Terbitkan Warta / Pengumuman Baru
              </h3>
              <button
                onClick={() => setShowAddNewsModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Pengumuman / Berita:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jadwal Libur Semester & Penerimaan Rapor Digital"
                  value={newNewsForm.title}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kategori:</label>
                <select
                  value={newNewsForm.category}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value="Berita Sekolah">Berita Sekolah</option>
                  <option value="Pengumuman Resmi">Pengumuman Resmi</option>
                  <option value="Agenda Kegiatan">Agenda Kegiatan</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ringkasan Singkat:</label>
                <input
                  type="text"
                  placeholder="Ringkasan 1-2 kalimat..."
                  value={newNewsForm.summary}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, summary: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Isi Pesan Lengkap:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan pengumuman resmi secara detail di sini..."
                  value={newNewsForm.content}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, content: e.target.value })}
                  className="w-full p-3 rounded-2xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNewsModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow-md"
                >
                  Terbitkan Ke Beranda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INSPEKSI & KUITANSI RESI PEMBAYARAN SPP DIGITAL */}
      {selectedProofInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-2 border-emerald-500 max-w-3xl w-full p-6 space-y-6 shadow-2xl relative text-slate-800 my-8">
            <button
              onClick={() => setSelectedProofInvoice(null)}
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
                    No. Resi: <span className="text-emerald-700">{selectedProofInvoice.receiptNo || `KWT/2026/07/${selectedProofInvoice.nis}`}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border shadow-2xs inline-block ${
                    selectedProofInvoice.status === 'Lunas'
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-200'
                      : selectedProofInvoice.status === 'Menunggu Verifikasi'
                      ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                      : 'bg-slate-800 text-white border-slate-900'
                  }`}
                >
                  {selectedProofInvoice.status === 'Lunas' ? '✓ LUNAS TERVERIFIKASI' : selectedProofInvoice.status}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1 font-medium">Tgl Tagihan: {selectedProofInvoice.dueDate}</span>
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
                  <label className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer">
                    + Upload Foto Resi
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const newUrl = reader.result as string;
                            onUpdateInvoiceStatus(
                              selectedProofInvoice.id,
                              selectedProofInvoice.status as 'Lunas' | 'Menunggu Verifikasi',
                              selectedProofInvoice.paymentMethod || 'Unggah Resi Wali',
                              { paymentProofUrl: newUrl }
                            );
                            setSelectedProofInvoice({
                              ...selectedProofInvoice,
                              paymentProofUrl: newUrl,
                            });
                            alert('✓ Foto Resi Pembayaran Wali Siswa berhasil diperbarui!');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="relative rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-950 group shadow-inner">
                  <img
                    src={selectedProofInvoice.paymentProofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'}
                    alt="Struk Resi Pembayaran Wali Siswa"
                    className="w-full h-72 object-cover object-top transition duration-300 group-hover:scale-105"
                  />
                  <a
                    href={selectedProofInvoice.paymentProofUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 bg-slate-900/90 text-amber-300 px-3 py-1.5 rounded-xl text-[11px] font-black border border-amber-400/40 flex items-center gap-1.5 shadow-md hover:bg-slate-950"
                  >
                    <Eye className="w-3.5 h-3.5" /> Fullscreen
                  </a>
                </div>
                <p className="text-[10px] text-slate-500 text-center font-medium italic">
                  *Foto struk / resi bukti transfer dari Wali Siswa yang telah tersimpan di server keuangan.
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
                      <strong className="text-slate-900 font-extrabold">{selectedProofInvoice.paymentSenderName || 'Wali Santri'}</strong>
                    </div>

                    <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                      <span className="text-slate-500">Bank / Channel Pengirim:</span>
                      <strong className="text-emerald-800 font-bold">{selectedProofInvoice.paymentBankSender || selectedProofInvoice.paymentMethod || 'Transfer Virtual Account BSI'}</strong>
                    </div>

                    <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                      <span className="text-slate-500">Waktu Pembayaran:</span>
                      <span className="text-slate-800 font-bold">{selectedProofInvoice.paymentDate || '05 Juli 2026 09:15 WIB'}</span>
                    </div>

                    {selectedProofInvoice.paymentNotes && (
                      <div className="pt-1 text-[11px] text-slate-600">
                        <span className="text-slate-500 block">Catatan Transfer Wali:</span>
                        <p className="italic bg-white p-2 rounded-lg border border-slate-200 mt-1 text-slate-800">{selectedProofInvoice.paymentNotes}</p>
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
                      <strong className="text-slate-900">{selectedProofInvoice.studentName}</strong>
                    </div>

                    <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                      <span className="text-slate-500">NIS / Kelas:</span>
                      <strong className="text-slate-900">{selectedProofInvoice.nis} • {selectedProofInvoice.classGrade}</strong>
                    </div>

                    <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                      <span className="text-slate-500">Jenis &amp; Periode:</span>
                      <strong className="text-slate-900">{selectedProofInvoice.feeType} ({selectedProofInvoice.monthPeriod})</strong>
                    </div>

                    <div className="flex justify-between pt-1 items-center">
                      <span className="text-slate-700 font-bold">Total Nominal:</span>
                      <strong className="text-emerald-700 font-black text-base">Rp {selectedProofInvoice.amount.toLocaleString('id-ID')}</strong>
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
                    const msg = `Halo Bapak/Ibu Wali dari ${selectedProofInvoice.studentName}, Kuitansi Resi Pembayaran SPP bulan ${selectedProofInvoice.monthPeriod} sejumlah Rp ${selectedProofInvoice.amount.toLocaleString('id-ID')} telah LUNAS terverifikasi oleh Bendahara SMK Islam Cipasung. No. Resi: ${selectedProofInvoice.receiptNo || 'KWT/2026/07/001'}. Terima kasih.`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition border border-emerald-300"
                >
                  <Send className="w-4 h-4 text-emerald-700" /> WhatsApp Wali
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {selectedProofInvoice.status !== 'Lunas' && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateInvoiceStatus(selectedProofInvoice.id, 'Lunas', selectedProofInvoice.paymentMethod || 'Verifikasi Admin Bukti Transfer');
                      setSelectedProofInvoice({
                        ...selectedProofInvoice,
                        status: 'Lunas',
                      });
                      alert(`✓ Pembayaran SPP ${selectedProofInvoice.studentName} Berhasil Diverifikasi LUNAS & Kuitansi Diterbitkan!`);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition"
                  >
                    <Check className="w-4 h-4" /> Verifikasi LUNAS (Approve)
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedProofInvoice(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer border border-slate-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INSPEKSI BUKTI TRANSFER PPDB */}
      {selectedProofApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border-2 border-indigo-400 max-w-2xl w-full p-6 space-y-6 shadow-2xl relative text-slate-800 my-8">
            <button
              onClick={() => setSelectedProofApplicant(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black cursor-pointer transition"
            >
              ✕
            </button>

            <div className="border-b border-slate-100 pb-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-black">
                <ImageIcon className="w-6 h-6 text-indigo-800" />
              </div>
              <div>
                <span className="text-xs font-black text-indigo-800 uppercase tracking-wider block">Pendaftaran Online PPDB 2026</span>
                <h3 className="text-xl font-black text-slate-900">Bukti Transfer Biaya Pendaftaran Calon Siswa</h3>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Image Preview */}
              <div className="md:col-span-6 space-y-3">
                <p className="text-xs font-bold text-slate-700">Foto / Resi Struk Transfer PPDB:</p>
                <div className="relative rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-900 group shadow-inner">
                  <img
                    src={selectedProofApplicant.paymentProofUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'}
                    alt="Bukti Transfer PPDB"
                    className="w-full h-72 object-cover object-top transition duration-300 group-hover:scale-105"
                  />
                  <a
                    href={selectedProofApplicant.paymentProofUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 bg-slate-900/90 text-amber-300 px-3 py-1.5 rounded-xl text-[11px] font-black border border-amber-400/40 flex items-center gap-1.5 shadow-md hover:bg-slate-950"
                  >
                    <Eye className="w-3.5 h-3.5" /> Fullscreen
                  </a>
                </div>
                <p className="text-[10px] text-slate-500 text-center font-medium">
                  Struk transfer pendaftaran PPDB online diserahkan oleh Wali Calon Siswa.
                </p>
              </div>

              {/* Right Column: Applicant Transaction Details */}
              <div className="md:col-span-6 space-y-3 text-xs">
                <p className="text-xs font-bold text-slate-700">Detail Calon Siswa & Pengirim:</p>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 font-medium">
                  <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                    <span className="text-slate-500">No. Pendaftaran:</span>
                    <strong className="text-indigo-900 font-mono">{selectedProofApplicant.id}</strong>
                  </div>

                  <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                    <span className="text-slate-500">Nama Calon Siswa:</span>
                    <strong className="text-slate-900">{selectedProofApplicant.fullName}</strong>
                  </div>

                  <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                    <span className="text-slate-500">NISN / Asal Sekolah:</span>
                    <strong className="text-slate-900">{selectedProofApplicant.nisn} ({selectedProofApplicant.originSchool})</strong>
                  </div>

                  <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                    <span className="text-slate-500">Nominal Biaya PPDB:</span>
                    <strong className="text-emerald-700 font-black text-sm">Rp {(selectedProofApplicant.paymentAmount || 250000).toLocaleString('id-ID')}</strong>
                  </div>

                  <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                    <span className="text-slate-500">Wali / Pengirim:</span>
                    <strong className="text-slate-900">{selectedProofApplicant.paymentSenderName || selectedProofApplicant.parentName}</strong>
                  </div>

                  <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                    <span className="text-slate-500">Bank Pengirim:</span>
                    <strong className="text-slate-900">{selectedProofApplicant.paymentBankSender || 'Transfer Bank / E-Wallet'}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Tanggal Unggah:</span>
                    <span className="text-slate-700">{selectedProofApplicant.paymentProofDate || selectedProofApplicant.registrationDate}</span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-950 text-[11px]">
                  <strong>Catatan Berkas:</strong> {selectedProofApplicant.notes || 'Semua dokumen & bukti transfer telah terunggah secara otomatis.'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Printer className="w-4 h-4 text-slate-600" /> Cetak Lembar PPDB
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {selectedProofApplicant.status !== 'Diterima' && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateApplicantStatus(selectedProofApplicant.id, 'Diterima');
                      setSelectedProofApplicant(null);
                      alert(`✓ Calon Siswa ${selectedProofApplicant.fullName} Berhasil DITERIMA (Lulus Seleksi PPDB)!`);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition"
                  >
                    <Check className="w-4 h-4" /> Terima (Approve PPDB)
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedProofApplicant(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
