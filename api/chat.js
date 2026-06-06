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

    // Ambil query
    const { pesan, media } = req.query;

    // Validasi
    if (!pesan) {
      return res.status(400).json({
        status: false,
        message: "Masukkan parameter ?pesan="
      });
    }

    // Prompt AI
    const prompt =
      "Kamu Nathra AI. Jawab lengkap, jelas, panjang, rapi, dan gunakan Bahasa Indonesia.";

    // Request API Naze
    const response = await fetch(
      `https://api.naze.biz.id/ai/gemini?query=${encodeURIComponent(pesan)}&prompt=${encodeURIComponent(prompt)}&media=${encodeURIComponent(media || "")}&apikey=nz-7c031c8d68`
    );

    // Ambil JSON
    const data = await response.json();

    console.log(data);

    /*
      FORMAT RESPONSE NAZE:
      {
        status: true,
        text: "Halo! ..."
      }
    */

    // FIX HASIL
    const hasil =
      data?.text ||
      data?.result ||
      data?.response ||
      data?.message ||
      data?.answer ||
      "AI tidak memberikan jawaban.";

    // Response akhir
    return res.status(200).json({
      status: true,
      creator: "Nathra AI",
      jawaban: hasil
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      status: false,
      error: err.message
    });

  }
      }
