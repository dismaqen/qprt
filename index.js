const puppeteer = require('puppeteer');

(async () => {
  while (true) {
    const browser = await puppeteer.launch({
      headless: true, // <-- ini bikin browser gak kelihatan
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Daftar link yang akan dikunjungi secara acak
    const links = [
      "https://shedroobsoa.net/4/9181219?var=default",
      "https://shedroobsoa.net/4/9180754?var=default",
      "https://stenexeb.xyz/4/9158566",
      "https://stenexeb.xyz/4/9180687"
    ];

    // Pilih link acak dari daftar
    const randomLink = links[Math.floor(Math.random() * links.length)];

    try {
      console.log(`🔗 Mengunjungi link: ${randomLink} (headless)...`);
      await page.goto(randomLink, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Tunggu 5 detik biar halaman stabil
      await new Promise(res => setTimeout(res, 5000));

      // Simulasi klik acak
      const x = Math.floor(Math.random() * 800) + 100;
      const y = Math.floor(Math.random() * 400) + 100;
      await page.mouse.click(x, y);
      console.log(`🖱️ Klik acak di (${x}, ${y})`);

      // Tunggu 10 detik biar klik ke-record
      await new Promise(res => setTimeout(res, 10000));
    } catch (err) {
      console.error("❌ Error:", err.message);
    }

    await browser.close();

    const delay = Math.floor(Math.random() * 10000) + 5000;
    console.log(`⏱️ Tunggu ${delay / 1000} detik sebelum loop lagi...\n`);
    await new Promise(res => setTimeout(res, delay));
  }
})();
