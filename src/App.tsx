import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { PpdbAnnouncementBar } from './components/PpdbAnnouncementBar';
import { CampusSlideShow } from './components/CampusSlideShow';
import { TeacherSlideSection } from './components/TeacherSlideSection';
import { SambutanKepalaSekolah } from './components/SambutanKepalaSekolah';
import { MajorsSection } from './components/MajorsSection';
import { PpdbSection } from './components/PpdbSection';
import { PpdbStudentPortal } from './components/PpdbStudentPortal';
import { DigitalPayment } from './components/DigitalPayment';
import { AcademicPortal } from './components/AcademicPortal';
import { ParentNotification } from './components/ParentNotification';
import { GallerySection } from './components/GallerySection';
import { SeoPanel } from './components/SeoPanel';
import { AdminPanel } from './components/AdminPanel';
import { AiAssistant } from './components/AiAssistant';
import { LoginModal, UserSession } from './components/LoginModal';
import { SchoolAgendaAndAlumni } from './components/SchoolAgendaAndAlumni';
import { FasilitasUnggulan } from './components/FasilitasUnggulan';

import {
  saveDocument,
  removeDocument,
  subscribeCollection,
  fetchCollection,
} from './lib/firebase';

import {
  INITIAL_SCHOOL_INFO,
  INITIAL_MAJORS,
  INITIAL_PPDB_APPLICANTS,
  INITIAL_STUDENT_RECORDS,
  INITIAL_GRADES_MAP,
  INITIAL_ATTENDANCE_MAP,
  INITIAL_INVOICES,
  INITIAL_PARENT_NOTIFICATIONS,
  INITIAL_GALLERY_ITEMS,
  INITIAL_SEO_CONFIG,
  INITIAL_SCHOOL_EVENTS,
  INITIAL_ALUMNI_TESTIMONIALS,
  INITIAL_BKK_JOBS,
  INITIAL_TEACHERS,
  INITIAL_USER_ACCOUNTS,
} from './data/mockData';

import {
  PpdbApplicant,
  InvoiceItem,
  ParentNotificationItem,
  MajorId,
  SeoConfig,
  SchoolInfoData,
  SchoolEvent,
  AlumniTestimonial,
  BkkJobItem,
  Teacher,
  GalleryItem,
  UserAccount,
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash) return hash;
    const saved = localStorage.getItem('cipasung_active_tab');
    return saved || 'beranda';
  });

  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<UserSession>(() => {
    const saved = localStorage.getItem('cipasung_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to restore user session:', e);
      }
    }
    return {
      role: 'umum',
      name: 'Tamu / Umum',
      emailOrNis: 'umum',
    };
  });

  // Sync activeTab with localStorage & URL Hash so page reload stays on active tab
  useEffect(() => {
    localStorage.setItem('cipasung_active_tab', activeTab);
    if (window.location.hash !== `#${activeTab}`) {
      window.history.replaceState(null, '', `#${activeTab}`);
    }
  }, [activeTab]);

  // Listen for browser Back/Forward or manual URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync currentUser session with localStorage
  useEffect(() => {
    localStorage.setItem('cipasung_user_session', JSON.stringify(currentUser));
  }, [currentUser]);

  // Core Persistent State
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfoData>(() => {
    const saved = localStorage.getItem('cipasung_school_info');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_INFO;
  });

  const [majors, setMajors] = useState(INITIAL_MAJORS);
  const [applicants, setApplicants] = useState<PpdbApplicant[]>(() => {
    const saved = localStorage.getItem('cipasung_ppdb_applicants');
    return saved ? JSON.parse(saved) : INITIAL_PPDB_APPLICANTS;
  });

  const [students] = useState(INITIAL_STUDENT_RECORDS);
  const [gradesMap, setGradesMap] = useState<Record<string, typeof INITIAL_GRADES_MAP['STD-2025-01']>>(() => {
    const saved = localStorage.getItem('cipasung_grades_map');
    return saved ? JSON.parse(saved) : INITIAL_GRADES_MAP;
  });

  const [attendanceMap, setAttendanceMap] = useState<Record<string, typeof INITIAL_ATTENDANCE_MAP['STD-2025-01']>>(() => {
    const saved = localStorage.getItem('cipasung_attendance_map');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_MAP;
  });

  const [invoices, setInvoices] = useState<InvoiceItem[]>(() => {
    const saved = localStorage.getItem('cipasung_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [notifications, setNotifications] = useState<ParentNotificationItem[]>(() => {
    const saved = localStorage.getItem('cipasung_notifications');
    return saved ? JSON.parse(saved) : INITIAL_PARENT_NOTIFICATIONS;
  });

  const [events, setEvents] = useState<SchoolEvent[]>(() => {
    const saved = localStorage.getItem('cipasung_events');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_EVENTS;
  });

  const [testimonials, setTestimonials] = useState<AlumniTestimonial[]>(() => {
    const saved = localStorage.getItem('cipasung_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_ALUMNI_TESTIMONIALS;
  });

  const [bkkJobs, setBkkJobs] = useState<BkkJobItem[]>(() => {
    const saved = localStorage.getItem('cipasung_bkk_jobs');
    return saved ? JSON.parse(saved) : INITIAL_BKK_JOBS;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('cipasung_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('cipasung_gallery_items');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY_ITEMS;
  });

  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('cipasung_user_accounts');
    return saved ? JSON.parse(saved) : INITIAL_USER_ACCOUNTS;
  });

  const [seoConfig, setSeoConfig] = useState<SeoConfig>(INITIAL_SEO_CONFIG);
  const [preselectedMajorForPpdb, setPreselectedMajorForPpdb] = useState<MajorId>('tsm');

  // Firebase Firestore Initial Data Seeding & Realtime Listeners
  useEffect(() => {
    async function initFirestoreData() {
      // Seed PPDB Applicants if Firestore empty
      const existingApps = await fetchCollection<PpdbApplicant>('ppdbApplicants');
      if (existingApps.length === 0) {
        for (const app of INITIAL_PPDB_APPLICANTS) {
          await saveDocument('ppdbApplicants', app, app.id);
        }
      } else {
        setApplicants(existingApps);
      }

      // Seed Invoices
      const existingInvoices = await fetchCollection<InvoiceItem>('invoices');
      if (existingInvoices.length === 0) {
        for (const inv of INITIAL_INVOICES) {
          await saveDocument('invoices', inv, inv.id);
        }
      } else {
        setInvoices(existingInvoices);
      }

      // Seed Events
      const existingEvents = await fetchCollection<SchoolEvent>('events');
      if (existingEvents.length === 0) {
        for (const ev of INITIAL_SCHOOL_EVENTS) {
          await saveDocument('events', ev, ev.id);
        }
      } else {
        setEvents(existingEvents);
      }

      // Seed Teachers
      const existingTeachers = await fetchCollection<Teacher>('teachers');
      if (existingTeachers.length === 0) {
        for (const t of INITIAL_TEACHERS) {
          await saveDocument('teachers', t, String(t.id));
        }
      } else {
        setTeachers(existingTeachers);
      }

      // Seed BKK Jobs
      const existingJobs = await fetchCollection<BkkJobItem>('bkkJobs');
      if (existingJobs.length === 0) {
        for (const job of INITIAL_BKK_JOBS) {
          await saveDocument('bkkJobs', job, job.id);
        }
      } else {
        setBkkJobs(existingJobs);
      }

      // Seed Gallery
      const existingGallery = await fetchCollection<GalleryItem>('galleryItems');
      if (existingGallery.length === 0) {
        for (const gal of INITIAL_GALLERY_ITEMS) {
          await saveDocument('galleryItems', gal, gal.id);
        }
      } else {
        setGalleryItems(existingGallery);
      }

      // Seed User Accounts
      const existingUsers = await fetchCollection<UserAccount>('userAccounts');
      if (existingUsers.length === 0) {
        for (const u of INITIAL_USER_ACCOUNTS) {
          await saveDocument('userAccounts', u, u.id);
        }
      } else {
        setUserAccounts(existingUsers);
      }
    }

    initFirestoreData();

    // Subscribe to realtime changes from Firestore
    const unsubApps = subscribeCollection<PpdbApplicant>('ppdbApplicants', (data) => {
      if (data && data.length) setApplicants(data);
    });
    const unsubInvoices = subscribeCollection<InvoiceItem>('invoices', (data) => {
      if (data && data.length) setInvoices(data);
    });
    const unsubEvents = subscribeCollection<SchoolEvent>('events', (data) => {
      if (data && data.length) setEvents(data);
    });
    const unsubTeachers = subscribeCollection<Teacher>('teachers', (data) => {
      if (data && data.length) setTeachers(data);
    });
    const unsubJobs = subscribeCollection<BkkJobItem>('bkkJobs', (data) => {
      if (data && data.length) setBkkJobs(data);
    });
    const unsubGallery = subscribeCollection<GalleryItem>('galleryItems', (data) => {
      if (data && data.length) setGalleryItems(data);
    });
    const unsubUsers = subscribeCollection<UserAccount>('userAccounts', (data) => {
      if (data && data.length) setUserAccounts(data);
    });

    return () => {
      unsubApps();
      unsubInvoices();
      unsubEvents();
      unsubTeachers();
      unsubJobs();
      unsubGallery();
      unsubUsers();
    };
  }, []);

  // Save changes to localStorage & Firebase
  useEffect(() => {
    localStorage.setItem('cipasung_grades_map', JSON.stringify(gradesMap));
  }, [gradesMap]);

  useEffect(() => {
    localStorage.setItem('cipasung_attendance_map', JSON.stringify(attendanceMap));
  }, [attendanceMap]);

  const handleAddGrade = (studentId: string, newGrade: typeof INITIAL_GRADES_MAP['STD-2025-01'][0]) => {
    setGradesMap((prev) => {
      const existing = prev[studentId] || [];
      const updated = {
        ...prev,
        [studentId]: [newGrade, ...existing],
      };
      localStorage.setItem('cipasung_grades_map', JSON.stringify(updated));
      return updated;
    });
    saveDocument('studentGrades', { studentId, ...newGrade }, String(newGrade.id));
  };

  const handleDeleteGrade = (studentId: string, gradeId: string | number) => {
    setGradesMap((prev) => {
      const existing = prev[studentId] || [];
      const updated = {
        ...prev,
        [studentId]: existing.filter((g) => String(g.id) !== String(gradeId)),
      };
      localStorage.setItem('cipasung_grades_map', JSON.stringify(updated));
      return updated;
    });
    removeDocument('studentGrades', String(gradeId));
  };

  const handleUpdateGrade = (studentId: string, updatedGrade: typeof INITIAL_GRADES_MAP['STD-2025-01'][0]) => {
    setGradesMap((prev) => {
      const existing = prev[studentId] || [];
      const updated = {
        ...prev,
        [studentId]: existing.map((g) => (String(g.id) === String(updatedGrade.id) ? updatedGrade : g)),
      };
      localStorage.setItem('cipasung_grades_map', JSON.stringify(updated));
      return updated;
    });
    saveDocument('studentGrades', { studentId, ...updatedGrade }, String(updatedGrade.id));
  };

  const handleAddAttendance = (studentId: string, newAttendance: typeof INITIAL_ATTENDANCE_MAP['STD-2025-01'][0]) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: [newAttendance, ...(prev[studentId] || [])],
    }));
    saveDocument('studentAttendance', { studentId, ...newAttendance });
  };

  const handleAddInvoice = (newInvoice: InvoiceItem) => {
    setInvoices((prev) => [newInvoice, ...prev]);
    saveDocument('invoices', newInvoice, newInvoice.id);
  };

  const handleAddUserAccount = (newUser: UserAccount) => {
    setUserAccounts((prev) => [newUser, ...prev]);
    saveDocument('userAccounts', newUser, newUser.id);
  };

  const handleDeleteUserAccount = (id: string) => {
    setUserAccounts((prev) => prev.filter((u) => u.id !== id));
    removeDocument('userAccounts', id);
  };

  const handleResetUserPassword = (id: string, newPassword: string) => {
    setUserAccounts((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = { ...u, password: newPassword };
          saveDocument('userAccounts', updated, id);
          return updated;
        }
        return u;
      })
    );
  };

  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [newTeacher, ...prev]);
    saveDocument('teachers', newTeacher, String(newTeacher.id));
  };

  const handleDeleteTeacher = (id: string | number) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    removeDocument('teachers', String(id));
  };

  const handleAddGalleryItem = (item: GalleryItem) => {
    setGalleryItems((prev) => [item, ...prev]);
    saveDocument('galleryItems', item, item.id);
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryItems((prev) => prev.filter((g) => g.id !== id));
    removeDocument('galleryItems', id);
  };

  const handleAddEvent = (newEvent: SchoolEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    saveDocument('events', newEvent, newEvent.id);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    removeDocument('events', id);
  };

  const handleAddTestimonial = (newTestimonial: AlumniTestimonial) => {
    setTestimonials((prev) => [newTestimonial, ...prev]);
    saveDocument('testimonials', newTestimonial, newTestimonial.id);
  };

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    removeDocument('testimonials', id);
  };

  const handleAddBkkJob = (newJob: BkkJobItem) => {
    setBkkJobs((prev) => [newJob, ...prev]);
    saveDocument('bkkJobs', newJob, newJob.id);
  };

  const handleDeleteBkkJob = (id: string) => {
    setBkkJobs((prev) => prev.filter((j) => j.id !== id));
    removeDocument('bkkJobs', id);
  };

  const handleUpdateSchoolInfo = (info: SchoolInfoData) => {
    setSchoolInfo(info);
    saveDocument('schoolInfo', info, 'main');
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cipasung_school_info', JSON.stringify(schoolInfo));
  }, [schoolInfo]);

  useEffect(() => {
    localStorage.setItem('cipasung_ppdb_applicants', JSON.stringify(applicants));
  }, [applicants]);

  useEffect(() => {
    localStorage.setItem('cipasung_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('cipasung_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handler functions
  const handleAddApplicant = (newApplicant: PpdbApplicant) => {
    setApplicants((prev) => [newApplicant, ...prev]);
    saveDocument('ppdbApplicants', newApplicant, newApplicant.id);

    // Update major registered count
    setMajors((prevMajors) =>
      prevMajors.map((m) =>
        m.id === newApplicant.selectedMajor
          ? { ...m, registeredCount: m.registeredCount + 1 }
          : m
      )
    );
  };

  const handleUpdateApplicantStatus = (
    id: string,
    status: 'Diterima' | 'Ditolak' | 'Lulus Seleksi'
  ) => {
    setApplicants((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const updated = { ...app, status };
          saveDocument('ppdbApplicants', updated, id);
          return updated;
        }
        return app;
      })
    );
  };

  const handleUpdateInvoiceStatus = (
    invoiceId: string,
    status: 'Lunas' | 'Menunggu Verifikasi',
    method: string,
    proofData?: {
      paymentProofUrl?: string;
      paymentSenderName?: string;
      paymentBankSender?: string;
      paymentNotes?: string;
    }
  ) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const updated: InvoiceItem = {
            ...inv,
            status,
            paymentMethod: method || inv.paymentMethod || 'Transfer Bank',
            paymentDate: inv.paymentDate || (new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'),
            receiptNo: status === 'Lunas' ? (inv.receiptNo || `KWT/2026/07/${Math.floor(1000 + Math.random() * 9000)}`) : inv.receiptNo,
            ...(proofData || {}),
          };
          saveDocument('invoices', updated, invoiceId);
          return updated;
        }
        return inv;
      })
    );
  };

  const handleAddNotification = (newNotif: ParentNotificationItem) => {
    setNotifications((prev) => [newNotif, ...prev]);
    saveDocument('notifications', newNotif, newNotif.id);
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-slate-950 font-sans text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Dynamic Header Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadNotificationsCount={notifications.filter((n) => n.status === 'Terkirim').length}
        toggleAiAssistant={() => setIsAiOpen(!isAiOpen)}
        isAiOpen={isAiOpen}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        schoolInfo={schoolInfo}
        onLogout={() =>
          setCurrentUser({
            role: 'umum',
            name: 'Tamu / Umum',
            emailOrNis: 'umum',
          })
        }
      />

      {/* Main Content Sections Routing */}
      <main className="flex-1">
        {activeTab === 'beranda' && (
          <>
            <PpdbAnnouncementBar onOpenPpdb={(targetTab) => setActiveTab(targetTab || 'ppdb')} />
            <CampusSlideShow onOpenPpdb={() => setActiveTab('ppdb')} />
            <Hero
              setActiveTab={setActiveTab}
              openAiAssistant={() => setIsAiOpen(true)}
              currentUser={currentUser}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              schoolInfo={schoolInfo}
            />
            <SambutanKepalaSekolah
              onOpenPpdb={() => setActiveTab('ppdb')}
              onOpenAi={() => setIsAiOpen(true)}
              schoolInfo={schoolInfo}
            />
            <MajorsSection
              majors={majors}
              setActiveTab={setActiveTab}
              setSelectedMajorForPpdb={setPreselectedMajorForPpdb}
            />
            <TeacherSlideSection teachers={teachers} />
            <FasilitasUnggulan onOpenPpdb={() => setActiveTab('ppdb')} />
            <PpdbSection
              majors={majors}
              applicants={applicants}
              onAddApplicant={handleAddApplicant}
              preselectedMajorId={preselectedMajorForPpdb}
            />
            <SchoolAgendaAndAlumni
              events={events}
              testimonials={testimonials}
              bkkJobs={bkkJobs}
              onOpenPpdb={() => setActiveTab('ppdb')}
            />
            <GallerySection galleryItems={galleryItems} />
          </>
        )}

        {activeTab === 'jurusan' && (
          <MajorsSection
            majors={majors}
            setActiveTab={setActiveTab}
            setSelectedMajorForPpdb={setPreselectedMajorForPpdb}
          />
        )}

        {activeTab === 'fasilitas' && (
          <FasilitasUnggulan onOpenPpdb={() => setActiveTab('ppdb')} />
        )}

        {activeTab === 'ppdb' && (
          <PpdbSection
            majors={majors}
            applicants={applicants}
            onAddApplicant={handleAddApplicant}
            preselectedMajorId={preselectedMajorForPpdb}
          />
        )}

        {activeTab === 'ppdb_portal' && (
          <PpdbStudentPortal
            applicants={applicants}
            onAddApplicant={handleAddApplicant}
            onNavigateTab={setActiveTab}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeTab === 'pembayaran' && (
          <DigitalPayment
            invoices={invoices}
            students={students}
            onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            currentUser={currentUser}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeTab === 'portal' && (
          <AcademicPortal
            students={students}
            gradesMap={gradesMap}
            attendanceMap={attendanceMap}
            invoices={invoices}
            onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            onAddGrade={handleAddGrade}
            onDeleteGrade={handleDeleteGrade}
            onUpdateGrade={handleUpdateGrade}
            onAddAttendance={handleAddAttendance}
            onAddInvoice={handleAddInvoice}
            onNavigateTab={setActiveTab}
            currentUser={currentUser}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onSwitchRole={setCurrentUser}
          />
        )}

        {activeTab === 'notifikasi' && (
          <ParentNotification
            notifications={notifications}
            students={students}
            onAddNotification={handleAddNotification}
            currentUser={currentUser}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}

        {activeTab === 'galeri' && (
          <GallerySection galleryItems={galleryItems} />
        )}

        {activeTab === 'seo' && (
          <SeoPanel
            seoConfig={seoConfig}
            onUpdateSeo={setSeoConfig}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            applicants={applicants}
            invoices={invoices}
            students={students}
            notifications={notifications}
            onUpdateApplicantStatus={handleUpdateApplicantStatus}
            onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            currentUser={currentUser}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            schoolInfo={schoolInfo}
            onUpdateSchoolInfo={setSchoolInfo}
            events={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            testimonials={testimonials}
            onAddTestimonial={handleAddTestimonial}
            onDeleteTestimonial={handleDeleteTestimonial}
            bkkJobs={bkkJobs}
            onAddBkkJob={handleAddBkkJob}
            onDeleteBkkJob={handleDeleteBkkJob}
            teachers={teachers}
            onAddTeacher={handleAddTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            galleryItems={galleryItems}
            onAddGalleryItem={handleAddGalleryItem}
            onDeleteGalleryItem={handleDeleteGalleryItem}
            userAccounts={userAccounts}
            onAddUserAccount={handleAddUserAccount}
            onDeleteUserAccount={handleDeleteUserAccount}
            onResetUserPassword={handleResetUserPassword}
          />
        )}
      </main>

      {/* Floating AI Assistant Trigger & Drawer */}
      <AiAssistant
        isOpen={isAiOpen}
        onOpen={() => setIsAiOpen(true)}
        onClose={() => setIsAiOpen(false)}
        setActiveTab={setActiveTab}
      />

      {/* Multi-Role Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(session) => setCurrentUser(session)}
        onLogout={() =>
          setCurrentUser({
            role: 'umum',
            name: 'Tamu / Umum',
            emailOrNis: 'umum',
          })
        }
        onNavigateTab={setActiveTab}
        userAccounts={userAccounts}
      />

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} schoolInfo={schoolInfo} />
    </div>
  );
}

export default App;
