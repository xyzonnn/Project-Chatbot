export default async function handler(req, res) {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  // OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {

    // GET QUERY
    const { pesan, media } = req.query;

    // VALIDASI
    if (!pesan && !media) {
      return res.status(400).json({
        status: false,
        message: "Masukkan parameter ?pesan="
      });
    }

    // PROMPT AI
    const prompt =
      "Kamu Nathra AI. Jawab lengkap, panjang, jelas, rapi, dan gunakan Bahasa Indonesia.";

    // URL API NAZE
    const url =
      `https://api.naze.biz.id/ai/gemini?query=${encodeURIComponent(pesan || "")}&prompt=${encodeURIComponent(prompt)}&media=${encodeURIComponent(media || "")}&apikey=nz-7c031c8d68`;

    // FETCH
    const response = await fetch(url);

    // RAW TEXT
    const raw = await response.text();

    console.log(raw);

    // PARSE JSON
    let data;

    try {
      data = JSON.parse(raw);
    } catch {

      return res.status(500).json({
        status: false,
        error: "Response bukan JSON",
        raw
      });

    }

    // HASIL
    const jawaban =
      data.text ||
      data.result ||
      data.message ||
      data.response ||
      "AI tidak memberikan jawaban.";

    // RESPONSE
    return res.status(200).json({
      status: true,
      creator: "Nathra AI",
      jawaban
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      status: false,
      error: err.message
    });

  }
}
