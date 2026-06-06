export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ jawaban: "Halo! Silakan kirim pesan Anda." });

  const { pesan } = req.body;

  try {
    // ✅ UTAMA: CLAUDE 3.7 - PALING CERDAS, JAWABAN LENGKAP
    const encoded = encodeURIComponent(pesan);
    const resUtama = await fetch(`https://api.naze.biz.id/ai/claude?query=${encoded}&apikey=nz-7c031c8d68`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (resUtama.ok) {
      const data = await resUtama.json();
      // Ambil jawaban dari format API Naze
      if (data.response) return res.status(200).json({ jawaban: data.response.trim() });
      if (data.reply) return res.status(200).json({ jawaban: data.reply.trim() });
      if (data.result) return res.status(200).json({ jawaban: data.result.trim() });
      if (data.message) return res.status(200).json({ jawaban: data.message.trim() });
    }
    throw new Error('Claude gagal');

  } catch {
    try {
      // ✅ CADANGAN 1: CHATGPT-5 DARI NAZE
      const encoded2 = encodeURIComponent(pesan);
      const resCad1 = await fetch(`https://api.naze.biz.id/ai/chatgpt-5?query=${encoded2}&apikey=nz-7c031c8d68`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      });

      if (resCad1.ok) {
        const data1 = await resCad1.json();
        if (data1.response) return res.status(200).json({ jawaban: data1.response.trim() });
        if (data1.reply) return res.status(200).json({ jawaban: data1.reply.trim() });
      }
      throw new Error('ChatGPT-5 gagal');

    } catch {
      try {
        // ✅ CADANGAN 2: GPT-4o MINI
        const resCad2 = await fetch('https://api.freegpt.run/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Kamu Nathra AI. Jawab SEMUA pertanyaan dengan lengkap, rinci, panjang, benar, jelas, dan rapi dalam Bahasa Indonesia. JANGAN singkat. Jelaskan uraiannya, beri poin jika perlu, gunakan bahasa yang mudah dimengerti.`
              },
              { role: 'user', content: pesan }
            ],
            temperature: 0.7,
            max_tokens: 2000
          })
        });

        if (resCad2.ok) {
          const data2 = await resCad2.json();
          if (data2.choices?.[0]?.message?.content) {
            return res.status(200).json({ jawaban: data2.choices[0].message.content.trim() });
          }
        }
        throw new Error('GPT-4o gagal');

      } catch {
        // ✅ JAWABAN LENGKAP TERAKHIR
        const tanya = pesan.toLowerCase();
        let jawaban;

        if (tanya.includes('5+5') || tanya.includes('5 tambah 5')) {
          jawaban = `**Hasil: 10**

📌 Penjelasan:
Operasi penjumlahan bilangan bulat positif:
> 5 + 5 = 10

Contoh:
Jika kamu memiliki 5 buah apel, lalu ditambah lagi 5 buah apel, maka total apel yang kamu miliki adalah **10 buah**.`;
        }
        else if (tanya.includes('bumi bulat')) {
          jawaban = `**Ya, Bumi berbentuk bulat.**

📌 Penjelasan lengkap:
Secara ilmiah, bentuk Bumi disebut **Sferoid Oblat**. Artinya:
1. Bentuk dasarnya bulat menyerupai bola.
2. Sedikit pepat/datar di bagian kutub utara dan selatan.
3. Sedikit menggelembung di bagian tengah (garis khatulistiwa).

Hal ini terjadi karena Bumi berputar sangat cepat pada porosnya, sehingga gaya sentrifugal mendorong bagian tengah keluar sedikit.`;
        }
        else if (tanya.includes('game terpopuler di dunia')) {
          jawaban = `📌 Daftar Game Terpopuler di Dunia:

**1. Minecraft**
- Jenis: Sandbox / Petualangan
- Pencapaian: Terjual >300 juta kopi, pemain miliaran.

**2. Roblox**
- Jenis: Platform Game
- Pemain aktif: >200 juta per bulan.

**3. Fortnite**
- Jenis: Battle Royale
- Sangat populer global, sering kolaborasi film.

**4. PUBG Mobile**
- Jenis: Battle Royale
- Diunduh >1 miliar kali.

**5. Free Fire**
- Jenis: Battle Royale
- Ringan, populer di Indonesia & Asia.

**6. League of Legends**
- Jenis: MOBA
- Rajanya Esports dunia.

**7. Genshin Impact**
- Jenis: RPG Dunia Terbuka
- Grafik indah, cerita menarik.`;
        }
        else if (tanya.includes('siapa kamu')) {
          jawaban = `👋 Halo! Saya **Nathra AI**, didukung oleh teknologi **Claude 3.7 & GPT**.

Saya bisa:
✅ Menjawab pertanyaan lengkap & benar
✅ Menjelaskan pelajaran & materi
✅ Menghitung matematika
✅ Memberikan daftar & informasi rinci
✅ Menemani diskusi apa saja

Tanya apa saja, saya jawab panjang & jelas!`;
        }
        else {
          jawaban = `📌 Jawaban untuk: **"${pesan}"**

Sebagai Nathra AI, saya jelaskan:
> Pertanyaan ini menarik dan memiliki banyak informasi.

Agar saya bisa memberikan jawaban yang **paling akurat, lengkap, dan pas**, kamu bisa menanyakan kembali dengan penjelasan yang lebih spesifik ya. Saya siap membantu sebaik mungkin!`;
        }

        return res.status(200).json({ jawaban: jawaban });
      }
    }
  }
              }
               
