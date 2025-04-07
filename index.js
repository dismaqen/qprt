const puppeteer = require('puppeteer');

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15",
  "Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
];

(async () => {
  while (true) {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(randomUA);

    const links = [
      "https://shedroobsoa.net/4/9181219?var=default",
      "https://shedroobsoa.net/4/9180754?var=default",
      "https://stenexeb.xyz/4/9158566",
      "https://stenexeb.xyz/4/9180687"
    ];
    const randomLink = links[Math.floor(Math.random() * links.length)];

    try {
      console.log(`🔗 Mengunjungi: ${randomLink}`);
      console.log(`🧑‍💻 UA: ${randomUA}`);
      await page.goto(randomLink, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      await new Promise(res => setTimeout(res, 2000));

      // Scroll cepat
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      console.log(`⬇️ Scroll cepat dilakukan`);

      // Klik link acak
      const linksOnPage = await page.$$('a');
      if (linksOnPage.length > 0) {
        const randomLinkIndex = Math.floor(Math.random() * linksOnPage.length);
        const href = await linksOnPage[randomLinkIndex].evaluate(el => el.href || 'null');
        await linksOnPage[randomLinkIndex].click();
        console.log(`🖱️ Klik: ${href}`);
      }

      await new Promise(res => setTimeout(res, 5000));
    } catch (err) {
      console.error("❌ Error:", err.message);
    }

    await browser.close();

    const delay = Math.floor(Math.random() * 3000) + 2000;
    console.log(`⏱️ Delay ${(delay / 1000).toFixed(2)} detik...\n`);
    await new Promise(res => setTimeout(res, delay));
  }
})();
