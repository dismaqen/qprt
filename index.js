const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgent = require('user-agents');

puppeteer.use(StealthPlugin());

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const targets = [
  "https://toopsoug.net/4/9180740?var=default",
  "https://shedroobsoa.net/4/9181219?var=default"
];

(async () => {
  console.log("[*] Bot jalan dengan stealth mode aktif...");

  while (true) {
    for (const url of targets) {
      try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        const userAgent = new UserAgent();
        await page.setUserAgent(userAgent.toString());

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        console.log(`[${new Date().toLocaleTimeString()}] Kunjungi: ${url}`);

        await page.mouse.move(100, 100);
        await delay(1000);
        await page.mouse.move(200, 200);
        await page.mouse.move(300, 150);
        await page.evaluate(() => {
          window.scrollBy(0, 500);
        });
        await delay(3000);

        const links = await page.$$('a');
        if (links.length > 0) {
          await links[0].click();
          console.log("Klik link berhasil.");
          await delay(5000);
        }

        await delay(10000);
        await browser.close();
      } catch (err) {
        console.error(`[${new Date().toLocaleTimeString()}] Error:`, err.message);
      }
    }
  }
})();
