export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ jawaban: "Halo! Silakan kirim pesan Anda." });

  const { pesan } = req.body;

  try {
    // 🔹 API UTAMA: FreeGPT (Paling Pintar, Tanpa Daftar/Kunci)
    const resUtama = await fetch('https://api.freegpt.plus/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Anda adalah Nathra AI, asisten cerdas, sopan, ramah, dan selalu menjawab dengan Bahasa Indonesia yang baik, jelas, dan lengkap. Jangan gunakan bahasa gaul, jawab sejelas mungkin.`
          },
          { role: 'user', content: pesan }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const dataUtama = await resUtama.json();
    if (dataUtama.choices?.[0]?.message?.content) {
      return res.status(200).json({ jawaban: dataUtama.choices[0].message.content.trim() });
    }
    throw new Error('Utama gagal');

  } catch {
    try {
      // 🔹 API CADANGAN 1: Simsimi (Gratis, Tanpa Daftar)
      const resCadangan1 = await fetch('https://api.simsimi.vn/v1/simtalk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ text: pesan, lc: 'id' })
      });
      const dataCad1 = await resCadangan1.json();
      if (dataCad1.success && dataCad1.message) {
        return res.status(200).json({ jawaban: dataCad1.message });
      }
      throw new Error('Cadangan 1 gagal');

    } catch {
      try {
        // 🔹 API CADANGAN 2: Affiliateplus (Paling Stabil)
        const resCadangan2 = await fetch('https://api.affiliateplus.xyz/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: pesan, user: 'nathra' })
        });
        const dataCad2 = await resCadangan2.json();
        if (dataCad2.reply) {
          return res.status(200).json({ jawaban: dataCad2.reply });
        }
        throw new Error('Cadangan 2 gagal');

      } catch {
        // 🔹 JAWABAN TERAKHIR (Pasti ada balasan)
        const jawabanAman = [
          "Saya sudah membaca pesan Anda. Silakan sampaikan lebih jelas lagi supaya saya bisa bantu dengan tepat.",
          "Baik, saya mengerti maksud Anda. Ada lagi yang ingin dibicarakan?",
          "Tentu saja, saya siap membantu kapan saja.",
          "Pertanyaan menarik! Bisa dijelaskan sedikit lagi?",
          "Siap, saya akan jawab sebaik mungkin untuk Anda."
        ];
        const acak = jawabanAman[Math.floor(Math.random() * jawabanAman.length)];
        return res.status(200).json({ jawaban: acak });
      }
    }
  }
}
