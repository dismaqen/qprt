const puppeteer = require('puppeteer');

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15",
  "Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
];

const targetURL = "https://stenexeb.xyz/4/9158566";

const delay = (ms) => new Promise(res => setTimeout(res, ms));

(async () => {
  while (true) {
    const browser = await puppeteer.launch({
      headless: false, // biar kelihatan
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const ua = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(ua);

    try {
      console.log(`🔗 Mengunjungi: ${targetURL}`);
      console.log(`🧑‍💻 UA: ${ua}`);
      await page.goto(targetURL, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      // 🕹️ Gerakin mouse random
      const box = await page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight }));
      for (let i = 0; i < 10; i++) {
        const x = Math.floor(Math.random() * box.width);
        const y = Math.floor(Math.random() * box.height);
        await page.mouse.move(x, y);
        await delay(300);
      }

      // ⏳ Tunggu redirect selesai
      await delay(7000);

      // 🎯 Cari tombol dengan teks
      const keywords = ["Continue", "Next", "Skip", "Visit"];
      let clicked = false;

      for (let keyword of keywords) {
        const button = await page.$x(`//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${keyword.toLowerCase()}')] | //button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${keyword.toLowerCase()}')]`);
        if (button.length > 0) {
          await button[0].hover();
          await delay(1000);
          await button[0].click();
          console.log(`✅ Klik tombol: ${keyword}`);
          clicked = true;
          break;
        }
      }

      if (!clicked) {
        console.log("❌ Tidak ada tombol yang cocok ditemukan.");
      }

      await delay(15000); // tunggu habis redirect kedua

    } catch (err) {
      console.error("❌ Error:", err.message);
    }

    await browser.close();
    const wait = Math.floor(Math.random() * 7000) + 5000;
    console.log(`⏱️ Delay ${(wait / 1000).toFixed(2)} detik sebelum loop ulang...\n`);
    await delay(wait);
  }
})();
