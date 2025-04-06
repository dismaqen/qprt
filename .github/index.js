const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgent = require('user-agents');
const axios = require('axios');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

puppeteer.use(StealthPlugin());

// Ganti sesuai token + repo lu
const GITHUB_TOKEN = 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
const GITHUB_REPO = 'username/repo'; // contoh: 'cuanboss/adsterra-bot'
const GITHUB_WORKFLOW = 'system-monitor.yml';

const links = [
  'https://toopsoug.net/4/9180740?var=default',
  'https://shedroobsoa.net/4/9181219?var=default'
];

async function visitLink(url) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(new UserAgent().toString());

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log(`[${new Date().toLocaleTimeString()}] Visited: ${url}`);

    await delay(5000);

    // Coba klik elemen tengah halaman
    await page.mouse.move(500, 500);
    await page.mouse.click(500, 500);
    await delay(5000);

    // Klik link random jika ada
    const links = await page.$$('a');
    if (links.length > 0) {
      const rand = links[Math.floor(Math.random() * links.length)];
      await rand.click();
      console.log(`[${new Date().toLocaleTimeString()}] Clicked a link.`);
      await delay(5000);
    }

    await browser.close();
  } catch (err) {
    console.error(`[${new Date().toLocaleTimeString()}] Error visiting: ${url}`, err.message);
  }
}

async function restartWorkflow() {
  try {
    await axios.post(
      `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${GITHUB_WORKFLOW}/dispatches`,
      { ref: 'main' },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );
    console.log('[*] Workflow restarted via API.');
  } catch (err) {
    console.error('[!] Failed to restart workflow:', err.message);
  }
}

(async () => {
  console.log('[*] Starting Stealth Adsterra Bot with Auto-Restart Mode...');
  const startTime = Date.now();
  const restartDelay = 1000 * 60 * 340; // restart after ~5h40m (before GitHub 6h limit)

  while (true) {
    for (const url of links) {
      await visitLink(url);
      await delay(15000);
    }

    // Cek waktu jalan
    if (Date.now() - startTime > restartDelay) {
      await restartWorkflow();
      break;
    }
  }
})();
