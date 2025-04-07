const puppeteer = require('puppeteer');
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15"
];

(async () => {
  while (true) {
    const browser = await puppeteer.launch({
      headless: "new", // ✅ fix warning headless deprecated
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(randomUA);

    const link = "https://stenexeb.xyz/4/9158566";
    console.log(`🔗 Mengunjungi: ${link}`);
    console.log(`🧑‍💻 UA: ${randomUA}`);

    try {
      await page.goto(link, { waitUntil: 'networkidle2', timeout: 60000 });

      await page.waitForTimeout(8000); // ⏳ Tunggu redirect

      // 🎮 Gerak mouse otomatis (natural)
      for (let i = 0; i < 5; i++) {
        const x = Math.floor(Math.random() * 800);
        const y = Math.floor(Math.random() * 600);
        await page.mouse.move(x, y, { steps: 10 });
        await page.waitForTimeout(400);
      }

      // 🎯 Klik tombol yang mengandung teks Continue/Next/Visit
      const targets = ['Continue', 'Next', 'Visit'];
      for (let txt of targets) {
        const btn = await page.$x(`//a[contains(text(), "${txt}")] | //button[contains(text(), "${txt}")]`);
        if (btn.length > 0) {
          await btn[0].click();
          console.log(`🖱️ Klik tombol: "${txt}"`);
          break;
        }
      }

      await page.waitForTimeout(10000); // tunggu setelah klik
    } catch (err) {
      console.error("❌ Error:", err.message);
    }

    await browser.close();

    const delay = Math.floor(Math.random() * 7000) + 5000;
    console.log(`⏱️ Delay ${(delay / 1000).toFixed(2)} detik sebelum loop ulang...\n`);
    await new Promise(res => setTimeout(res, delay));
  }
})();
