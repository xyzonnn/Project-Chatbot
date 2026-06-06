export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { pesan } = req.body;
  const API_KEY = process.env.OPENROUTER_API_KEY;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://namakamu.vercel.app',
        'X-Title': 'Nathra AI'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat:free',
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

    const data = await response.json();
    const jawaban = data.choices[0].message.content;
    res.status(200).json({ jawaban });

  } catch (err) {
    res.status(500).json({ jawaban: 'Sistem sedang mengalami gangguan teknis. Silakan coba kembali beberapa saat lagi.' });
  }
}
