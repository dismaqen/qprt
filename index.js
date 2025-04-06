const puppeteer = require('puppeteer');

const links = [
  "https://shedroobsoa.net/4/9181219?var=default",
  "https://shedroobsoa.net/4/9180754?var=default",
  "https://stenexeb.xyz/4/9158566",
  "https://stenexeb.xyz/4/9180687"
];

const startTime = Date.now();
const duration = 24 * 60 * 60 * 1000; // 24 jam

async function visitAndClick(link) {
  console.log(`[${new Date().toLocaleTimeString()}] Opening: ${link}`);

  const browser = await puppeteer.launch({
    headless: "new", // Pakai headless Chrome versi terbaru
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
  while (true) {
    if (Date.now() - startTime >= duration) {
      console.log("✅ Sudah 24 jam. Bot selesai.");
      process.exit(0);
    }

    for (const link of links) {
      try {
        await visitAndClick(link);
      } catch (e) {
        console.error("❌ Error:", e.message);
      }
    }

    // Langsung lanjut ke loop berikutnya tanpa nunggu
    console.log("🔁 Loop ulang...\n");
  }
})();
