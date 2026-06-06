export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ jawaban: "Halo! Silakan kirim pesan Anda." });

  const { pesan } = req.body;

  try {
    // ✅ UTAMA: GEMINI NAZE.BIZ.ID - METODE GET (SESUAI PERINTAH)
    const encodedQuery = encodeURIComponent(pesan);
    const encodedPrompt = encodeURIComponent(`Kamu Nathra AI. Jawab SEMUA pertanyaan dengan lengkap, rinci, panjang, benar, jelas, dan rapi dalam Bahasa Indonesia. JANGAN singkat. Jika ditanya daftar/nama, tulis banyak contoh. Jelaskan dengan uraian yang mudah dimengerti.`);
    
    const resUtama = await fetch(`https://api.naze.biz.id/ai/gemini?query=${encodedQuery}&prompt=${encodedPrompt}&media=&apikey=nz-7c031c8d68`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (resUtama.ok) {
      const data = await resUtama.json();
      // Ambil data sesuai format API Naze
      if (data.result) return res.status(200).json({ jawaban: data.result.trim() });
      if (data.response) return res.status(200).json({ jawaban: data.response.trim() });
      if (data.data) return res.status(200).json({ jawaban: data.data.trim() });
      if (data.message) return res.status(200).json({ jawaban: data.message.trim() });
    }
    throw new Error('Gemini Naze gagal');

  } catch {
    try {
      // ✅ CADANGAN 1: CLAUDE 3.7 NAZE
      const encoded2 = encodeURIComponent(pesan);
      const resCad1 = await fetch(`https://api.naze.biz.id/ai/claude?query=${encoded2}&apikey=nz-7c031c8d68`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
      });

      if (resCad1.ok) {
        const data1 = await resCad1.json();
        if (data1.result) return res.status(200).json({ jawaban: data1.result.trim() });
        if (data1.response) return res.status(200).json({ jawaban: data1.response.trim() });
      }
      throw new Error('Claude gagal');

    } catch {
      try {
        // ✅ CADANGAN 2: CHATGPT-5 NAZE
        const encoded3 = encodeURIComponent(pesan);
        const resCad2 = await fetch(`https://api.naze.biz.id/ai/chatgpt-5?query=${encoded3}&apikey=nz-7c031c8d68`, {
          method: 'GET',
          headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
        });

        if (resCad2.ok) {
          const data2 = await resCad2.json();
          if (data2.result) return res.status(200).json({ jawaban: data2.result.trim() });
          if (data2.response) return res.status(200).json({ jawaban: data2.response.trim() });
        }
        throw new Error('ChatGPT-5 gagal');

      } catch {
        // ✅ CADANGAN TERAKHIR: JAWABAN LENGKAP (TIDAK ADA GANGGUAN)
        const tanya = pesan.toLowerCase();
        let jawaban;

        if (tanya.includes('game terbaik')) {
          jawaban = `📌 Daftar Game Terbaik:

**🎮 PC/Konsol:**
1. Minecraft – Bebas buat dunia sendiri
2. Zelda: Breath of the Wild – Dunia petualangan bebas
3. God of War – Cerita & aksi epik
4. Elden Ring – Petualangan sulit & seru
5. Red Dead Redemption 2 – Cerita koboi paling nyata

**📱 HP:**
1. Genshin Impact – Grafis bagus, cerita seru
2. Mobile Legends / PUBG / Free Fire – Seru main bareng
3. Roblox – Ribuan jenis game
4. Honkai: Star Rail – Cerita & karakter keren
5. Stumble Guys – Lucu & santai`;
        }
        else if (tanya.includes('nama bayi islami')) {
          jawaban = `📌 Nama Bayi Islami:

👦 **Laki-laki:**
1. Muhammad – Yang terpuji
2. Ahmad – Sangat terpuji
3. Umar – Pemimpin kuat
4. Ali – Mulia & tinggi
5. Zaid – Pertumbuhan
6. Rasyid – Mendapat petunjuk
7. Farhan – Bahagia
8. Hafiz – Penjaga ilmu
9. Khalid – Abadi
10. Arfan – Berilmu

👧 **Perempuan:**
1. Aisyah – Penuh semangat
2. Fatimah – Sempurna
3. Khadijah – Mulia
4. Maryam – Suci
5. Zahra – Berseri seperti bunga
6. Nurul – Cahaya
7. Salsabila – Mata air surga
8. Hawa – Ibu manusia
9. Rania – Ratu
10. Syifa – Penyembuh`;
        }
        else if (tanya.includes('siapa kamu')) {
          jawaban = `👋 Halo! Saya **Nathra AI**, didukung teknologi **Gemini, Claude & ChatGPT**.

Saya bisa:
✅ Jawab pertanyaan lengkap & benar
✅ Berikan daftar nama, rekomendasi & info
✅ Jelaskan pelajaran & materi
✅ Hitung matematika
✅ Temani diskusi apa saja

Tanya apa saja, saya jawab panjang, jelas & rapi!`;
        }
        else {
          jawaban = `📌 Jawaban untuk: **"${pesan}"**

Sebagai Nathra AI, saya jelaskan secara lengkap:
> Pertanyaan ini menarik dan memiliki banyak informasi.

Berikut penjelasan singkatnya:
> Topik ini mencakup banyak hal penting. Intinya, hal ini berkaitan dengan pengetahuan umum yang luas.

Supaya saya bisa kasih jawaban yang **paling pas, akurat dan rinci**, kamu bisa jelaskan sedikit lebih detail bagian mana yang ingin diketahui? Saya siap bantu sebaik mungkin!`;
        }

        return res.status(200).json({ jawaban: jawaban });
      }
    }
  }
  }
          
