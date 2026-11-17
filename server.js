
const express = require("express");
const { tiktok } = require("@coflyn/scrapr");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ status: true, message: "TikTok Downloader API aktif" });
});

app.get("/api/tiktok", async (req, res) => {
  const url = req.query.url;

  if (!url || !/^https?:\/\/(www\.|vm\.|vt\.)?tiktok\.com\//i.test(url)) {
    return res.status(400).json({
      status: false,
      message: "URL TikTok tidak valid"
    });
  }

  try {
    const result = await tiktok.snaptik(url);

    if (!result.status || !result.result?.downloads?.length) {
      return res.status(404).json({
        status: false,
        message: "Video tidak ditemukan"
      });
    }

    res.json({
      status: true,
      title: result.result.title,
      downloads: result.result.downloads
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Gagal memproses video"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
