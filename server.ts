import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client
const aiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (aiKey) {
  aiClient = new GoogleGenAI({
    apiKey: aiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Initialize Gemini API client lazily
function getAiClient(): GoogleGenAI | null {
  const aiKey = process.env.GEMINI_API_KEY;
  if (!aiKey) return null;
  return new GoogleGenAI({
    apiKey: aiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt for SMK Islam Cipasung AI Assistant
const CIPASUNG_SYSTEM_INSTRUCTION = `
Anda adalah "Cipasung AI Assistant", asisten kecerdasan buatan cerdas, ramah, dan responsif dari SMK Islam Cipasung Singaparna, Kabupaten Tasikmalaya, Jawa Barat.
Tugas Anda adalah melayani pertanyaan dari calon siswa, orang tua murid, siswa, guru, masyarakat, dan alumni dengan bahasa Indonesia yang natural, sopan, islami, cerdas, dan variatif (seperti AI sungguhan).

Pedoman Komunikasi:
1. Sapa pengguna dengan ramah dan islami (seperti "Assalamu'alaikum", "Halo Kak/Bapak/Ibu").
2. Berikan jawaban yang relevan, spesifik, dan tidak monoton/kaku. Jika diajak mengobrol biasa, jawablah secara fleksibel dan ramah seperti AI yang luwes.
3. Gunakan format yang rapi (poin-poin/bolding jika menjelaskan rincian) agar mudah dibaca.

Informasi Utama SMK Islam Cipasung:
- Nama Sekolah: SMK Islam Cipasung Singaparna
- Yayasan: Yayasan Pondok Pesantren Cipasung
- Alamat Lengkap: Jl. KH. Ruhiat, Komplek Pesantren Cipasung, Desa Cipakat, Kec. Singaparna, Kab. Tasikmalaya, Jawa Barat 46417
- Kontak Resmi: Telepon (0265) 545123 | WhatsApp Humas & PPDB: 0812-2345-6789
- Akreditasi: A (Sangat Baik)
- Kepala Sekolah: Drs. H. Asep Mulyana, M.Pd.
- 3 Konsentrasi Keahlian / Jurusan Unggulan Resmi:
  1. TBSM / TSM (Teknik & Bisnis Sepeda Motor): Otomotif Sepeda Motor & Injeksi binaan resmi Honda (AHASS).
  2. TJKT / TKJ (Teknik Jaringan Komputer & Telekomunikasi): Fiber Optic, Networking Cisco/Mikrotik, Server & Cyber Security.
  3. MPLB (Manajemen Perkantoran & Layanan Bisnis): Perkantoran Digital, E-Office, Kearsipan, Public Speaking & Kesekretariatan.
- Keunggulan Tambahan: Kombinasi Pendidikan Vokasi Siap Kerja + Nilai Keagamaan Pesantren Cipasung, Beasiswa Tahfidz Al-Qur'an & Berprestasi, Bekerja sama dengan 45+ Industri Nasional untuk BKK / Penyaluran Kerja.
- PPDB TA 2026/2027: Gelombang 1 telah dibuka! Pendaftaran dapat dilakukan langsung via website ini di menu PPDB. Syarat: Fotokopi Ijazah/SKL, KK, Akta Kelahiran, Pasfoto 3x4, dan ikuti tes membaca Al-Qur'an & wawancara minat bakat.
- SPP & Biaya: Biaya SPP bulanan Rp 350.000. Pembayaran dapat melalui Virtual Account BSI, BRI, Mandiri, BCA, atau QRIS di portal keuangan sekolah.
- Ekstrakurikuler: Pramuka, Paskibra, IRMA/Hadroh, Futsal, Bola Voli, Pencak Silat, English Club, Robotik & Cyber Club.
`;

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Chatbot Route for School Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const aiClient = getAiClient();

    if (aiClient) {
      // Build conversation contents including history
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        // Include last 10 turns of conversation history for rich context
        const recentHistory = history.slice(-10);
        for (const item of recentHistory) {
          if (item.sender === 'user' && item.text) {
            contents.push({ role: 'user', parts: [{ text: String(item.text) }] });
          } else if (item.sender === 'assistant' && item.text) {
            contents.push({ role: 'model', parts: [{ text: String(item.text) }] });
          }
        }
      }

      // Add current user prompt
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          systemInstruction: CIPASUNG_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const replyText =
        response.text ||
        'Afwan, Cipasung AI sedang memproses informasi. Ada hal lain yang bisa saya bantu?';
      return res.json({ reply: replyText });
    }

    // Smart dynamic fallback if API key is not active in dev container
    const lower = message.toLowerCase();
    let responseText = '';

    if (lower.includes('salam') || lower.includes('halo') || lower.includes('hai') || lower.includes('assalamu')) {
      responseText = `Wa'alaikumsalam Warahmatullahi Wabarakatuh! 😊

Selamat datang di Portal Informasi SMK Islam Cipasung Singaparna. Saya Cipasung AI Assistant siap membantu Anda.

Anda dapat bertanya seputar:
• 🎓 **3 Jurusan / Konsentrasi Keahlian** (TBSM, TJKT/TKJ, MPLB)
• 📝 **PPDB Online 2026/2027** & Syarat Pendaftaran
• 💳 **Biaya SPP & Pembayaran Digital**
• 📍 **Lokasi & Kontak Humas Sekolah**

Ada yang bisa saya bantu hari ini?`;
    } else if (lower.includes('ppdb') || lower.includes('daftar') || lower.includes('syarat') || lower.includes('masuk')) {
      responseText = `📝 **Informasi PPDB SMK Islam Cipasung TA 2026/2027**

Pendaftaran Peserta Didik Baru (PPDB) telah dibuka! Anda dapat melakukan pendaftaran secara langsung melalui menu **"PPDB Online"** di website ini.

**Persyaratan Pendaftaran:**
1. Fotokopi Ijazah / Surat Keterangan Lulus (SKL) SMP/MTs
2. Fotokopi Kartu Keluarga (KK) & Akta Kelahiran
3. Pasfoto terbaru ukuran 3x4 (4 lembar)
4. Mengikuti Tes Potensi Akademik & Minat Bakat serta Tes Membaca Al-Qur'an

💡 *Tersedia Beasiswa Tahfidz Al-Qur'an & Siswa Berprestasi.* Jika ada kendala, hubungi Humas via WhatsApp **0812-2345-6789**.`;
    } else if (lower.includes('jurusan') || lower.includes('keahlian') || lower.includes('tsm') || lower.includes('tjkt') || lower.includes('tkj') || lower.includes('tbsm') || lower.includes('mplb')) {
      responseText = `🎓 **3 Konsentrasi Keahlian Unggulan SMK Islam Cipasung:**

1. **TBSM / TSM (Teknik & Bisnis Sepeda Motor)**: Otomotif Sepeda Motor injeksi binaan resmi Honda (AHASS).
2. **TJKT / TKJ (Teknik Jaringan Komputer & Telekomunikasi)**: Menguasai Jaringan Fiber Optic, Cisco/Mikrotik, Server, & Cyber Security.
3. **MPLB (Manajemen Perkantoran & Layanan Bisnis)**: Perkantoran Digital, E-Office, Kearsipan, Public Speaking, & Kesekretariatan.

Silakan pilih menu **"3 Jurusan"** di navigasi atas untuk melihat silabus & fasilitas tiap jurusan!`;
    } else if (lower.includes('spp') || lower.includes('bayar') || lower.includes('biaya') || lower.includes('uang')) {
      responseText = `💳 **Informasi Biaya & SPP Sekolah:**

• **Biaya SPP Bulanan:** Rp 350.000 / bulan.
• **Metode Pembayaran Digital:** Virtual Account BSI, BRI, Bank Mandiri, BCA, atau QRIS.
• **Portal Keuangan:** Orang tua murid dapat mengecek status & riwayat pembayaran di menu **"Pembayaran Digital"** atau **"Portal Murid/Wali"**.

Apakah Anda memerlukan bantuan simulasi tagihan SPP?`;
    } else if (lower.includes('lokasi') || lower.includes('alamat') || lower.includes('kontak') || lower.includes('wa') || lower.includes('telepon')) {
      responseText = `📍 **Alamat & Kontak Resmi SMK Islam Cipasung:**

• **Alamat:** Jl. KH. Ruhiat, Komplek Pesantren Cipasung, Desa Cipakat, Kec. Singaparna, Kab. Tasikmalaya, Jawa Barat 46417.
• **WhatsApp Humas:** 0812-2345-6789
• **Telepon Kantor:** (0265) 545123
• **Jam Operasional Sekretariat:** Senin - Sabtu (07.30 - 15.00 WIB)

Anda juga bisa melihat peta lokasi interaktif di bagian bawah halaman utama website ini.`;
    } else {
      responseText = `Terima kasih atas pertanyaan Anda! 😊

Sebagai **Cipasung AI Assistant**, saya dapat membantu memberikan informasi lengkap mengenai SMK Islam Cipasung Singaparna, meliputi:
- **Pendaftaran PPDB 2026/2027**
- **3 Jurusan Unggulan (TBSM, TJKT, MPLB) & Fasilitas Lab**
- **Sistem Pembayaran SPP Online**
- **Informasi Asrama / Pesantren Cipasung**

Silakan ajukan pertanyaan spesifik Anda, atau klik tombol opsi cepat di bawah kolom chat!`;
    }

    return res.json({ reply: responseText });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'Gagal menghubungkan ke AI Assistant',
      details: error.message || String(error),
    });
  }
});

// API Route to simulate parent WhatsApp notification dispatch
app.post('/api/notifications/send', (req, res) => {
  const { studentName, parentPhone, message, type } = req.body;
  
  if (!parentPhone || !message) {
    return res.status(400).json({ error: 'Phone and message are required' });
  }

  const notification = {
    id: `NTF-${Date.now().toString().slice(-4)}`,
    studentName: studentName || 'Siswa SMK Islam Cipasung',
    parentPhone,
    type: type || 'Pengumuman',
    message,
    sentAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    status: 'Terkirim',
    channel: 'WhatsApp',
  };

  return res.json({
    success: true,
    notification,
    whatsappUrl: `https://wa.me/${parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`,
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SMK Islam Cipasung Server running on http://localhost:${PORT}`);
  });
}

startServer();
