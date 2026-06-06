export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");

  try {

    const { pesan, media } = req.query;

    const prompt =
      "Kamu Nathra AI. Jawab lengkap dalam Bahasa Indonesia.";

    const url =
      `https://api.naze.biz.id/ai/gemini?query=${encodeURIComponent(pesan || "")}&prompt=${encodeURIComponent(prompt)}&media=${encodeURIComponent(media || "")}&apikey=nz-7c031c8d68`;

    console.log("URL:", url);

    const response = await fetch(url);

    // DEBUG
    console.log("STATUS:", response.status);

    const raw = await response.text();

    console.log("RAW:", raw);

    // BALIKIN RAW LANGSUNG
    return res.status(200).json({
      status: true,
      raw: raw
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      status: false,
      error: err.message
    });

  }
}
