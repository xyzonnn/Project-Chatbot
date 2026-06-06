export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");

  try {

    const { pesan } = req.query;

    if (!pesan) {
      return res.status(400).json({
        status: false,
        message: "Masukkan ?pesan="
      });
    }

    const prompt =
      "Kamu Nathra AI. Jawab lengkap dan jelas dalam Bahasa Indonesia.";

    const response = await fetch(
      `https://api.naze.biz.id/ai/gemini?query=${encodeURIComponent(pesan)}&prompt=${encodeURIComponent(prompt)}&apikey=nz-7c031c8d68`
    );

    const data = await response.json();

    console.log(data);

    // FIX
    return res.status(200).json({
      status: true,
      jawaban: data.text
    });

  } catch (err) {

    return res.status(500).json({
      status: false,
      error: err.message
    });

  }
}
