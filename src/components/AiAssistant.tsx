import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Loader2,
  BookOpen,
  GraduationCap,
  CreditCard,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface AiAssistantProps {
  isOpen: boolean;
  onOpen?: () => void;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
}

// Client-side smart knowledge responder for Vercel / GitHub Pages static deployments
function generateClientSmartReply(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('salam') || lower.includes('halo') || lower.includes('hai') || lower.includes('assalamu')) {
    return `Wa'alaikumsalam Warahmatullahi Wabarakatuh! 😊

Selamat datang di Portal Resmi **SMK Islam Cipasung Singaparna**. Saya **Cipasung AI Assistant** siap membantu Anda 24/7.

Silakan pilih atau tanyakan informasi mengenai:
• 🎓 **3 Jurusan Vokasi** (TBSM Binaan Honda, TJKT Jaringan/Cyber, MPLB Perkantoran)
• 📝 **Pendaftaran PPDB Online 2026/2027**
• 💳 **Informasi Biaya SPP & QRIS/Virtual Account**
• 📍 **Alamat Komplek Pesantren Cipasung & WhatsApp Humas**

Ada yang bisa saya bantu?`;
  }

  if (lower.includes('ppdb') || lower.includes('daftar') || lower.includes('syarat') || lower.includes('masuk') || lower.includes('biaya pendaftaran')) {
    return `📝 **Informasi PPDB SMK Islam Cipasung 2026/2027**

Pendaftaran telah dibuka secara online dan offline di Kampus SMK Islam Cipasung!

**Persyaratan Berkas:**
1. Fotokopi Ijazah / SKL SMP/MTs (2 lembar)
2. Fotokopi Kartu Keluarga (KK) & Akta Kelahiran
3. Pasfoto 3x4 berlatar belakang merah/biru (4 lembar)
4. Mengikuti tes wawancara minat bakat & tes baca Al-Qur'an

💡 *Tersedia Beasiswa Tahfidz Qur'an & Beasiswa Prestasi.*
Daftar langsung melalui tombol **"PPDB Online"** di menu atas website ini, atau konsultasi via WhatsApp Humas di **0812-2345-6789**.`;
  }

  if (lower.includes('jurusan') || lower.includes('tsm') || lower.includes('tjkt') || lower.includes('tkj') || lower.includes('tbsm') || lower.includes('mplb') || lower.includes('keahlian') || lower.includes('prospek')) {
    return `🎓 **3 Konsentrasi Keahlian Unggulan SMK Islam Cipasung:**

1. 🏍️ **TBSM (Teknik & Bisnis Sepeda Motor)**
   • Kurikulum binaan resmi Astra Honda Motor (AHASS).
   • Peluang kerja: Mekanik profesional AHASS, Wirausaha Bengkel Mandiri, Quality Control Otomotif.

2. 💻 **TJKT (Teknik Jaringan Komputer & Telekomunikasi)**
   • Penguasaan Fiber Optic, Cisco, Mikrotik Router, Linux Server, & Cyber Security.
   • Peluang kerja: Network Engineer, IT Support Specialist, System Administrator, ISP Operator.

3. 💼 **MPLB (Manajemen Perkantoran & Layanan Bisnis)**
   • Otomatisasi Perkantoran Digital, Kesekretariatan, Public Speaking, E-Commerce & Filing Systems.
   • Peluang kerja: Staff Administrasi Kantor, Executive Assistant, Customer Service, Public Relations.

Klik menu **"3 Jurusan"** di navbar untuk melihat silabus lengkap!`;
  }

  if (lower.includes('spp') || lower.includes('bayar') || lower.includes('biaya') || lower.includes('uang') || lower.includes('rekening') || lower.includes('qris')) {
    return `💳 **Informasi Biaya SPP & Sistem Pembayaran Digital:**

• **SPP Bulanan:** Rp 350.000 / bulan
• **Metode Pembayaran:** 
  - Virtual Account Bank (BSI, BRI, Bank Mandiri, BCA)
  - Scan QRIS (GoPay, OVO, ShopeePay, Dana, LinkAja, Mobile Banking)
  - Pembayaran Langsung di Loket Keuangan Sekolah

Orang tua / Wali murid dapat memantau riwayat pembayaran dan mencetak kuitansi melalui menu **"Pembayaran Digital"** atau **"Portal Murid/Wali"**.`;
  }

  if (lower.includes('lokasi') || lower.includes('alamat') || lower.includes('kontak') || lower.includes('wa') || lower.includes('whatsapp') || lower.includes('telepon') || lower.includes('peta') || lower.includes('posisi')) {
    return `📍 **Alamat & Kontak Resmi SMK Islam Cipasung:**

• **Alamat:** Jl. KH. Ruhiat, Komplek Pondok Pesantren Cipasung, Desa Cipakat, Kec. Singaparna, Kab. Tasikmalaya, Jawa Barat 46417.
• **WhatsApp Humas PPDB:** 0812-2345-6789
• **Telepon Sekretariat:** (0265) 545123
• **Email Resmi:** info@smkislamcipasung.sch.id
• **Jam Layanan:** Senin - Sabtu (07.30 - 15.00 WIB)

Peta lokasi Google Maps interaktif tersedia di bagian paling bawah halaman website ini!`;
  }

  if (lower.includes('guru') || lower.includes('kepala sekolah') || lower.includes('pengajar') || lower.includes('tendik') || lower.includes('staf') || lower.includes('pendidik')) {
    return `👨‍🏫 **Jajaran Pendidik & Tenaga Kependidikan SMK Islam Cipasung:**

• **Kepala Sekolah:** Drs. H. Ahmad Syafi'i, M.Pd.
• **Pengasuh Pesantren:** Komplek Pondok Pesantren Cipasung Singaparna.
• **Tenaga Pendidik:** 45+ Guru Berkompetensi Sertifikasi & Praktisi Industri dari PT Astra Honda, Telkom Indonesia, serta Akademisi Terkemuka.

Foto dan profil lengkap seluruh guru dapat Anda tampilkan melalui menu **"Profil Guru"** atau slide perkenalan di halaman utama!`;
  }

  if (lower.includes('logo') || lower.includes('foto') || lower.includes('ubah') || lower.includes('admin') || lower.includes('edit')) {
    return `⚙️ **Panduan Mengubah Logo & Foto Sekolah (Admin Panel):**

Untuk mengedit Logo Sekolah, Foto Kepala Sekolah, maupun Data Guru:
1. Klik tombol **"Portal / Login Admin"** di menu atas atau footer.
2. Masukkan PIN Admin: **123456** (atau Akun Admin Guru).
3. Buka tab **"Profil Sekolah & Logo"** untuk mengunggah logo baru / foto Kepala Sekolah.
4. Buka tab **"Manajemen Guru & Tendik"** untuk menambah, mengedit, atau mengganti foto guru!`;
  }

  return `Terima kasih atas pertanyaan Anda! 😊

Saya **Cipasung AI Assistant** siap membantu memberikan informasi seputar SMK Islam Cipasung Singaparna. 

Informasi populer yang sering ditanyakan:
• **PPDB 2026/2027** — Syarat & pendaftaran online
• **3 Jurusan Vokasi** — TBSM, TJKT, MPLB
• **Biaya SPP & QRIS** — Nominal & cara bayar digital
• **Alamat & WhatsApp** — Komplek Pesantren Cipasung (0812-2345-6789)

Ada topik lain yang ingin Anda ketahui?`;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onOpen, onClose, setActiveTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Assalamu’alaikum! Saya **Cipasung AI Assistant** powered by Gemini AI. Ada yang bisa saya bantu mengenai PPDB 2026/2027, Informasi Jurusan Vokasi, Biaya SPP, atau Lokasi SMK Islam Cipasung?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      let replyText = '';

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            history: currentMessages,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.reply) {
            replyText = data.reply;
          }
        }
      } catch (fetchError) {
        console.warn('Backend /api/chat unreachable, falling back to client-side Cipasung AI engine:', fetchError);
      }

      // If backend call was unavailable or failed (e.g. static host on Vercel / GitHub Pages), use smart local responder
      if (!replyText) {
        replyText = generateClientSmartReply(query);
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Error in AI assistant response:', error);
      const fallbackReply = generateClientSmartReply(query);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={onOpen}
          className="relative px-4 py-3 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 rounded-full shadow-2xl shadow-amber-500/40 border-2 border-amber-300 flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all cursor-pointer font-black text-xs sm:text-sm group ring-4 ring-amber-400/20"
          title="Buka Cipasung AI Assistant (Tanya 24 Jam)"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-slate-950 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950 animate-ping" />
          </div>
          <span className="font-black tracking-tight">Cipasung AI</span>
          <span className="bg-slate-950 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-black border border-amber-400/80 shadow-xs hidden sm:inline-block">
            Tanya 24/7
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col h-[540px]">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-4 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold shadow-sm">
            <Sparkles className="w-5 h-5 animate-pulse text-amber-200" />
          </div>
          <div>
            <h3 className="font-black text-sm text-white flex items-center gap-1.5">
              Cipasung AI Assistant
            </h3>
            <p className="text-[10px] text-emerald-100 flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
              Powered by Gemini AI • Responsive 24/7
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/20 text-emerald-100 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/80 text-xs text-slate-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white shadow-sm flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] p-3.5 rounded-2xl space-y-1.5 ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white font-medium rounded-tr-none shadow-sm'
                  : 'bg-white text-slate-800 border border-slate-200/80 shadow-sm rounded-tl-none'
              }`}
            >
              {msg.sender === 'assistant' ? (
                <div className="prose prose-xs max-w-none text-slate-800 leading-relaxed space-y-2 font-sans">
                  <Markdown>{msg.text}</Markdown>
                </div>
              ) : (
                <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
              )}
              <span
                className={`text-[9px] block text-right font-mono ${
                  msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-emerald-700 text-xs py-2 bg-emerald-50 px-3 rounded-full w-fit border border-emerald-200 shadow-sm">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span className="font-semibold">Cipasung AI sedang berpikir & menyusun jawaban...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[10px]">
        <button
          onClick={() => handleSendMessage('Apa saja syarat pendaftaran PPDB 2026?')}
          className="bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-3 py-1 rounded-full flex-shrink-0 flex items-center gap-1 transition cursor-pointer"
        >
          <BookOpen className="w-3 h-3 text-emerald-600" /> Syarat PPDB
        </button>
        <button
          onClick={() => handleSendMessage('Sebutkan 3 jurusan di SMK Islam Cipasung (TBSM, TJKT, MPLB) beserta prospek kerjanya')}
          className="bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-3 py-1 rounded-full flex-shrink-0 flex items-center gap-1 transition cursor-pointer"
        >
          <GraduationCap className="w-3 h-3 text-emerald-600" /> Detail Jurusan
        </button>
        <button
          onClick={() => handleSendMessage('Berapa rincian SPP bulanan dan cara bayarnya?')}
          className="bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 px-3 py-1 rounded-full flex-shrink-0 flex items-center gap-1 transition cursor-pointer"
        >
          <CreditCard className="w-3 h-3 text-emerald-600" /> Biaya SPP
        </button>
      </div>

      {/* Input Field Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Tanyakan hal seputar sekolah di sini..."
          className="flex-1 bg-slate-50 border border-slate-300 rounded-full px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={isLoading || !inputQuery.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-2.5 rounded-full transition flex items-center justify-center shadow-md cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
