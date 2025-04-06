const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgent = require('user-agents');

puppeteer.use(StealthPlugin());

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const links = [
  "https://toopsoug.net/4/9180740?var=default",
  "https://shedroobsoa.net/4/9181219?var=default"
];

(async () => {
  console.log("[*] System Monitor Service Started (Stealth Mode Enabled)");

  while (true) {
    for (const url of links) {
      try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        const userAgent = new UserAgent();
        await page.setUserAgent(userAgent.toString());

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        console.log(`[${new Date().toLocaleTimeString()}] Visited: ${url}`);

        await delay(5000); // Waktu tunggu sebelum klik redirect

        // Klik otomatis jika ada link redirect
        const linksOnPage = await page.$$eval('a', as =>
          as.map(a => a.href).filter(h => h.startsWith('http') && !h.includes('google') && !h.includes('facebook'))
        );

        if (linksOnPage.length > 0) {
          const target = linksOnPage[Math.floor(Math.random() * linksOnPage.length)];
          await page.evaluate(url => window.location.href = url, target);
          console.log(`[+] Clicked redirected link: ${target}`);
        } else {
          console.log("[!] No clickable link found on redirect page.");
        }

        await delay(15000); // Delay antar sesi
        await browser.close();
      } catch (err) {
        console.error(`[${new Date().toLocaleTimeString()}] Error: ${err.message}`);
      }
    }
  }
})();
