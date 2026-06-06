export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ jawaban: 'Metode tidak diizinkan' });

  const { pesan } = req.body;

  try {
    // 🔹 PAKAI API GRATIS PALING STABIL (GAK PERLU API KEY)
    const response = await fetch('https://api.simsimi.vn/v1/simtalk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: pesan,
        lc: 'id', // Bahasa Indonesia
        key: ''
      })
    });

    if (!response.ok) throw new Error('Gagal');

    const data = await response.json();
    
    if (data.success === true && data.message) {
      return res.status(200).json({ 
        jawaban: data.message 
      });
    } else {
      throw new Error('Format salah');
    }

  } catch (err) {
    console.error(err);
    // 🔹 Kalau yang atas gagal, otomatis ganti pakai cadangan
    try {
      const res2 = await fetch('https://free-chatgpt-api.p.rapidapi.com/chat-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': '5f03d8e72amsh9e8b7f4b5e1c3p1b4ejsn4d2f8a7b9c0d1e2',
          'x-rapidapi-host': 'free-chatgpt-api.p.rapidapi.com'
        },
        body: JSON.stringify({
          message: pesan
        })
      });

      const data2 = await res2.json();
      return res.status(200).json({ 
        jawaban: data2.response || 'Oke, saya mengerti.' 
      });

    } catch {
      return res.status(200).json({ 
        jawaban: 'Silakan sampaikan lagi dengan bahasa yang lebih jelas ya.' 
      });
    }
  }
}
