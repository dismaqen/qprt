const puppeteer = require('puppeteer');

const links = [
  "https://shedroobsoa.net/4/9181219?var=default",
  "https://shedroobsoa.net/4/9180754?var=default",
  "https://stenexeb.xyz/4/9158566",
  "https://stenexeb.xyz/4/9180687"
];

const duration = 24 * 60 * 60 * 1000; // 24 jam
const restartEvery = 5 * 60 * 60 * 1000; // restart tiap 5 jam
const startTime = Date.now();

async function visitAndClick(link) {
  console.log(`[${new Date().toLocaleTimeString()}] Opening: ${link}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(link, { waitUntil: "domcontentloaded" });

  // Tunggu redirect (5 detik)
  await new Promise(r => setTimeout(r, 5000));

  // Klik di tengah
  await page.mouse.click(500, 500);

  // Tunggu 5 detik lagi setelah klik
  await new Promise(r => setTimeout(r, 5000));

  await browser.close();
}

(async () => {
  while (true) {
    const now = Date.now();

    if (now - startTime >= duration) {
      console.log("✅ Sudah 24 jam. Bot selesai.");
      break;
    }

    const loopStart = Date.now();

    for (const link of links) {
      try {
        await visitAndClick(link);
      } catch (e) {
        console.error("❌ Error visit:", e.message);
      }
    }

    const loopDuration = Date.now() - loopStart;
    const timeUntilRestart = restartEvery - loopDuration;

    if (timeUntilRestart > 0) {
      console.log(`🕒 Restart otomatis dalam ${Math.floor(timeUntilRestart / 1000)} detik...`);
      await new Promise(r => setTimeout(r, timeUntilRestart));
    }

    console.log("🔁 Restarting loop sekarang!\n");
  }
})();
