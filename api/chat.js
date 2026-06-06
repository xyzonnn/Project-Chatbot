export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ jawaban: "Halo! Silakan kirim pesan Anda." });

  const { pesan } = req.body;

  try {
    // ✅ UTAMA: CLAUDE 3.7 dari NAZE.BIZ.ID (DIKENYALISIR FORMATNYA)
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
      // ⚠️ BENERIN: Ambil langsung isi jawaban dari API Naze
      // Format asli Naze: {status: true, result: "isi jawaban disini"}
      if (data.result) {
        return res.status(200).json({ jawaban: data.result.trim() });
      }
      if (data.data) {
        return res.status(200).json({ jawaban: data.data.trim() });
      }
      if (data.content) {
        return res.status(200).json({ jawaban: data.content.trim() });
      }
      if (data.message) {
        return res.status(200).json({ jawaban: data.message.trim() });
      }
    }
    throw new Error('Claude gagal');

  } catch {
    try {
      // ✅ CADANGAN 1: CHATGPT-5 dari NAZE.BIZ.ID
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
        if (data1.result) {
          return res.status(200).json({ jawaban: data1.result.trim() });
        }
        if (data1.data) {
          return res.status(200).json({ jawaban: data1.data.trim() });
        }
      }
      throw new Error('ChatGPT-5 gagal');

    } catch {
      // ✅ CADANGAN 2: GPT-4o MINI (JAGA-JAGA)
      const resCad2 = await fetch('https://api.freegpt.run/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Kamu Nathra AI. Jawab SEMUA pertanyaan dengan lengkap, rinci, panjang, benar, jelas, dan rapi dalam Bahasa Indonesia. JANGAN singkat. Jika ditanya daftar nama, tulis banyak contohnya.`
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
    }
  }
              }
                                       
