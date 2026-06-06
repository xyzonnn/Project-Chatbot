export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ jawaban: 'Metode tidak diizinkan' });

  const { pesan } = req.body;
  const API_KEY = process.env.OPENROUTER_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ jawaban: 'API Key belum diatur' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://project-chatbot.vercel.app',
        'X-Title': 'Nathra AI'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-thinking-exp:free',
        messages: [
          { 
            role: 'system', 
            content: `Anda adalah Nathra AI. Jawablah pertanyaan pengguna dengan bahasa Indonesia yang baku, jelas, singkat, sopan, dan langsung pada inti. Jangan gunakan kata-kata gaul, istilah berlebihan, atau gaya bahasa yang tidak formal. Berikan informasi yang akurat dan mudah dipahami.` 
          },
          { role: 'user', content: pesan }
        ],
        temperature: 0.5,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      throw new Error('Koneksi ke layanan AI gagal');
    }

    const data = await response.json();
    
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      const jawaban = data.choices[0].message.content;
      return res.status(200).json({ jawaban: jawaban.trim() });
    } else {
      throw new Error('Format respon tidak sesuai');
    }

  } catch (err) {
    res.status(200).json({ 
      jawaban: 'Maaf, sistem sedang sibuk atau tidak terhubung. Silakan coba lagi sebentar.' 
    });
  }
}
