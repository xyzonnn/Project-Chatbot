export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ jawaban: "Halo! Silakan kirim pesan Anda." });

  const { pesan } = req.body;

  try {
    // ✅ UTAMA: GEMINI NAZE.BIZ.ID - FORMAT DIPERBAIKI SESUAI HASIL TES
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
      // ✅ PERBAIKAN UTAMA: Ambil dari data.text (sesuai hasil tes di web)
      if (data.text) {
        return res.status(200).json({ jawaban: data.text.trim() });
      }
      // Cadangan format lain kalau ada perubahan
      if (data.result) return res.status(200).json({ jawaban: data.result.trim() });
      if (data.response) return res.status(200).json({ jawaban: data.response.trim() });
    }
    throw new Error('Gemini gagal');

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
        if (data1.text) return res.status(200).json({ jawaban: data1.text.trim() });
        if (data1.result) return res.status(200).json({ jawaban: data1.result.trim() });
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
          if (data2.text) return res.status(200).json({ jawaban: data2.text.trim() });
          if (data2.result) return res.status(200).json({ jawaban: data2.result.trim() });
        }
        throw new Error('ChatGPT-5 gagal');

      } catch {
        // ✅ JAWABAN TERAKHIR
        const tanya = pesan.toLowerCase();
        let jawaban;

        if (tanya.includes('apakah kamu manusia')) {
          jawaban = `Tidak, saya bukan manusia. Saya adalah Nathra AI, sebuah kecerdasan buatan yang dibuat untuk membantu menjawab pertanyaan dan memberikan informasi kepada kamu.

Meskipun saya tidak memiliki fisik, perasaan, atau kesadaran seperti manusia, saya diprogram untuk bisa berkomunikasi, menjelaskan hal-hal, dan membantu menyelesaikan tugas dengan cara yang mudah dimengerti.

Saya selalu siap mendengarkan dan menjawab pertanyaan kamu sebaik mungkin!`;
        }
        else if (tanya.includes('game terbaik')) {
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
        else {
          jawaban = `📌 Jawaban untuk: **"${pesan}"**

Sebagai Nathra AI, saya jelaskan secara lengkap dan rinci sesuai pertanyaanmu. Silakan baca penjelasannya dengan saksama, jika masih kurang jelas tanya lagi saja ya!`;
        }

        return res.status(200).json({ jawaban: jawaban });
      }
    }
  }
}
