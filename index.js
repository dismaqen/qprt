const puppeteer = require('puppeteer');

const links = [
  "https://shedroobsoa.net/4/9181219?var=default",
  "https://shedroobsoa.net/4/9180754?var=default",
  "https://stenexeb.xyz/4/9158566",
  "https://stenexeb.xyz/4/9180687"
];

async function visitAndClick(link) {
  console.log(`[${new Date().toLocaleTimeString()}] Opening: ${link}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(link, { waitUntil: "domcontentloaded" });

  // Tunggu redirect
  await new Promise(r => setTimeout(r, 5000));

  // Klik di tengah
  await page.mouse.click(500, 500);
  await new Promise(r => setTimeout(r, 5000));

  await browser.close();
}

(async () => {
  const startTime = Date.now();
  const duration = 5 * 60 * 60 * 1000; // 5 jam

  while (true) {
    if (Date.now() - startTime >= duration) {
      console.log("⏰ Sudah 5 jam. Job akan restart otomatis via GitHub scheduler.");
      process.exit(0);
    }

    for (const link of links) {
      try {
        await visitAndClick(link);
      } catch (e) {
        console.error("Error:", e.message);
      }
    }

    console.log("Loop selesai. Restarting dalam 1 menit...\n");
    await new Promise(r => setTimeout(r, 60000));
  }
})();
