export type MajorId = 'tsm' | 'tbsm' | 'tjkt' | 'mplb' | 'tkj' | 'pplg' | 'akl';

export interface Major {
  id: MajorId;
  code: string;
  name: string;
  fullName: string;
  description: string;
  iconName: string;
  bgGradient: string;
  accentColor: string;
  skills: string[];
  careers: string[];
  facilities: string[];
  headOfMajor: string;
  quota: number;
  registeredCount: number;
}

export interface PpdbApplicant {
  id: string;
  registrationNo?: string;
  nisn: string;
  nik: string;
  fullName: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  originSchool: string;
  address: string;
  parentName: string;
  parentPhone: string;
  selectedMajor: MajorId | string;
  secondMajor?: MajorId | string;
  status: 'Menunggu Verifikasi' | 'Diterima' | 'Ditolak' | 'Lulus Seleksi' | 'Lulus / Diterima' | 'Terverifikasi';
  registrationDate: string;
  documentsUploaded: {
    ijazah: boolean;
    kk: boolean;
    akta: boolean;
    foto: boolean;
    buktiBayar?: boolean;
  };
  notes?: string;
  paymentProofUrl?: string;
  paymentProofDate?: string;
  paymentAmount?: number;
  paymentBankSender?: string;
  paymentSenderName?: string;
}

export interface StudentRecord {
  id: string;
  nis: string;
  nisn: string;
  fullName: string;
  classGrade: string; // e.g. "XI PPLG 1"
  majorId: MajorId;
  parentName: string;
  parentPhone: string;
  gender: 'L' | 'P';
  attendanceRate: number; // percentage e.g. 96
  academicStatus: 'Aktif' | 'Alumni' | 'Cuti';
  avatarUrl: string;
}

export interface GradeItem {
  id: string;
  subject: string;
  kkm: number;
  nilaiTugas: number;
  nilaiUts: number;
  nilaiUas: number;
  nilaiAkhir: number;
  predicate: 'A' | 'B' | 'C' | 'D';
}

export interface AttendanceItem {
  date: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha';
  timeIn?: string;
  subjectNote?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  nis: string;
  classGrade: string;
  monthPeriod: string; // e.g., "Juli 2026"
  feeType: 'SPP Bulanan' | 'Uang Gedung' | 'Seragam' | 'Ujian / Prakerin';
  amount: number;
  dueDate: string;
  status: 'Belum Dibayar' | 'Menunggu Verifikasi' | 'Lunas';
  paymentMethod?: string;
  paymentDate?: string;
  virtualAccount?: string;
  qrisCode?: string;
  receiptNo?: string;
  paymentProofUrl?: string;
  paymentSenderName?: string;
  paymentBankSender?: string;
  paymentNotes?: string;
}

export interface ParentNotificationItem {
  id: string;
  studentName: string;
  parentPhone: string;
  type: 'Presensi' | 'SPP' | 'PPDB' | 'Pengumuman' | 'Darurat';
  message: string;
  sentAt: string;
  status: 'Terkirim' | 'Gagal' | 'Dibaca';
  channel: 'WhatsApp' | 'SMS';
}

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'guru' | 'walikelas' | 'siswa';
  status: 'Aktif' | 'Nonaktif';
  lastLogin: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Keagamaan' | 'Praktik Keahlian' | 'Ekstrakurikuler' | 'Prestasi' | 'Kegiatan Sekolah';
  imageUrl: string;
  description: string;
  date: string;
  author: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  author: string;
}

export interface SeoConfig {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  siteName: string;
  author: string;
  canonicalUrl: string;
  schemaType: string;
  googleSiteVerification: string;
}

export interface SchoolInfoData {
  name: string;
  npsn: string;
  accreditation: string;
  foundation: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  principal: string;
  principalPhoto?: string;
  principalMessage?: string;
  principalVideoUrl?: string;
  academicYear: string;
  heroVideoUrl?: string;
  virtualTourUrl?: string;
  heroBannerPhoto?: string;
  stats: {
    totalStudents: string;
    totalTeachers: string;
    majorsCount: string;
    majorsSubtext: string;
    employmentRate: string;
    partnerCompanies: string;
  };
}

export interface Teacher {
  id: string | number;
  name: string;
  role: string;
  category: 'pimpinan' | 'kaprog' | 'guru' | 'pesantren';
  categoryLabel: string;
  photo: string;
  quote: string;
  experience: string;
  education: string;
  badge: string;
  subject: string;
  phone?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  category: 'Akademik' | 'Keagamaan' | 'Ujian' | 'Kesiswaan' | 'PKL / BKK' | 'Umum';
  date: string; // e.g. "2026-08-10" or "10 - 15 Agustus 2026"
  time: string; // e.g. "07:30 - 14:00 WIB"
  location: string;
  description: string;
  status: 'Mendatang' | 'Berlangsung' | 'Selesai';
  organizer: string;
  isImportant?: boolean;
}

export interface AlumniTestimonial {
  id: string;
  name: string;
  graduationYear: string;
  majorName: string; // e.g., "TBSM Honda" | "TJKT Cisco" | "MPLB Perkantoran"
  currentRole: string; // e.g. "Head Mechanic", "Network Engineer"
  companyOrCampus: string; // e.g. "AHASS Motor Tasikmalaya", "Telkom Akses", "Universitas Siliwangi"
  quote: string;
  photoUrl: string;
  rating?: number;
}

export interface BkkJobItem {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  majorRequirement: string;
  jobType: 'Full-time' | 'Magang PKL' | 'Kontrak';
  location: string;
  salaryRange?: string;
  deadline: string;
  status: 'Buka' | 'Tutup';
  contactPhone: string;
  description: string;
}
