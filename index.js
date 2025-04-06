const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgent = require('user-agents');

puppeteer.use(StealthPlugin());

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Ganti link di sini
const urls = [
  "https://shedroobsoa.net/4/9181219?var=default",
  "https://toopsoug.net/4/9180740?var=default"
];

(async () => {
  console.log("[*] Starting Adsterra Bot (2 Links, Stealth Mode + Auto Click)");

  while (true) {
    for (const url of urls) {
      try {
        const browser = await puppeteer.launch({
          headless: "new",
          args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        const userAgent = new UserAgent();
        await page.setUserAgent(userAgent.toString());

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        console.log(`[${new Date().toLocaleTimeString()}] Visited: ${url}`);

        // Tunggu dan klik area tengah
        await delay(5000);
        await page.mouse.click(500, 400); // klik tengah-tengah
        console.log(`[${new Date().toLocaleTimeString()}] Clicked!`);

        await delay(10000); // Tunggu habis redirect

        await browser.close();
        await delay(5000); // Delay antar link
      } catch (err) {
        console.error(`[${new Date().toLocaleTimeString()}] Error:`, err.message);
      }
    }
  }
})();
