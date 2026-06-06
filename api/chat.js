export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");

  try {

    const { pesan, media } = req.query;

    if (!pesan && !media) {
      return res.status(400).json({
        status: false,
        message: "Masukkan ?pesan="
      });
    }

    // Prompt AI
    const prompt =
      "Kamu Nathra AI. Jawab lengkap, panjang, jelas, rapi, dan gunakan Bahasa Indonesia.";

    // URL API
    const url =
      `https://api.naze.biz.id/ai/gemini?query=${encodeURIComponent(pesan || "")}&prompt=${encodeURIComponent(prompt)}&media=${encodeURIComponent(media || "")}&apikey=nz-7c031c8d68`;

    // Fetch
    const response = await fetch(url);

    // JSON
    const data = await response.json();

    console.log(data);

    // FIX RESULT
    const jawaban =
      data?.result?.text ||
      "AI tidak memberikan jawaban.";

    // Response
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
