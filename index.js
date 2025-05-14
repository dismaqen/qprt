const puppeteer = require('puppeteer');

const targetUrl = 'https://pooo.st/d/an3dukcthndb';

const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.61 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
];

const bot = async () => {
  // ⏳ Tambahan: auto-exit setelah 5.5 jam
  setTimeout(() => {
    console.log("⏳ Waktu habis, keluar...");
    process.exit(0);
  }, 5.5 * 60 * 60 * 1000); // 5.5 jam dalam milidetik

  while (true) {
    console.log('🔥 Mulai loop baru...');
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-blink-features=AutomationControlled'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(userAgent);

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'X-Forwarded-For': `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    });

    let attempts = 0;
    try {
      const initialPages = await browser.pages();

      console.log(`🌐 Membuka: ${targetUrl}`);
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(8000);

      let videoPlaying = false;

      while (attempts < 6 && !videoPlaying) {
        console.log(`▶️ Klik tombol play (percobaan ${attempts + 1})...`);
        await page.mouse.click(660, 430, { delay: 200 });
        await page.waitForTimeout(4000);

        const allPages = await browser.pages();
        const newTabs = allPages.filter(p => !initialPages.includes(p));
        for (let tab of newTabs) {
          try {
            console.log('❌ Menutup tab redirect...');
            await tab.close();
          } catch (err) {}
        }

        await page.bringToFront();
        await page.waitForTimeout(2000);

        let backTries = 0;
        while (!page.url().startsWith(targetUrl) && backTries < 25) {
          try {
            console.log(`🔙 Back cepat... (${backTries + 1}) URL: ${page.url()}`);
            await page.goBack({ waitUntil: 'domcontentloaded', timeout: 5000 });
          } catch {
            console.log('🚫 Tidak bisa back lagi.');
            break;
          }

          const currentUrl = page.url();

          if (currentUrl.startsWith(targetUrl)) {
            console.log('✅ Sudah kembali ke halaman utama.');
            break;
          }

          if (currentUrl.startsWith('about:blank')) {
            console.warn('🛑 Kembali terlalu jauh, coba maju lagi...');
            let forwardTries = 0;
            while (!page.url().startsWith(targetUrl) && forwardTries < 10) {
              try {
                await page.goForward({ waitUntil: 'domcontentloaded', timeout: 5000 });
                console.log(`⏩ Maju ke: ${page.url()}`);
              } catch {
                console.log('⚠️ Gagal maju.');
                break;
              }
              if (page.url().startsWith(targetUrl)) {
                console.log('✅ Berhasil kembali ke halaman utama.');
                break;
              }
              forwardTries++;
            }
            break;
          }

          backTries++;
        }

        console.log(`✅ Posisi sekarang: ${page.url()}`);
        const stillWrong = !page.url().startsWith(targetUrl);
        if (stillWrong) {
          console.warn('⚠️ Gagal kembali ke halaman utama.');
        }

        try {
          videoPlaying = await page.evaluate(() => {
            const video = document.querySelector('video');
            return video && !video.paused && !video.ended && video.readyState >= 2;
          });
        } catch (err) {
          console.warn('⚠️ Evaluasi video gagal.');
        }

        if (!videoPlaying) {
          console.log('⏸️ Video belum berjalan, akan ulang klik...');
        }

        attempts++;
      }

      if (videoPlaying) {
        console.log('🎬 Video dimulai, menonton selama 25 detik...');
        await page.waitForTimeout(25000);
      } else {
        console.warn('⚠️ Gagal mulai video setelah 6 percobaan.');
      }

    } catch (err) {
      console.error('⚠️ Error:', err.message);
    } finally {
      console.log('✅ Menunggu 25 detik sebelum membersihkan dan menutup browser...');
      await page.waitForTimeout(25000);

      console.log('🧹 Membersihkan data browser...');
      try {
        const client = await page.target().createCDPSession();
        await client.send('Network.clearBrowserCookies');
        await client.send('Network.clearBrowserCache');
        await client.send('Storage.clearDataForOrigin', {
          origin: targetUrl,
          storageTypes: 'all',
        });
      } catch (err) {
        console.warn('⚠️ Gagal bersihkan cache/cookies:', err.message);
      }

      console.log('✅ Menutup browser, siap loop ulang...');
      await browser.close();
    }

    await new Promise(res => setTimeout(res, 3000));
  }
};

(async () => {
  // Jalankan dua bot secara bersamaan
  await Promise.all([
    bot(),
    bot()
  ]);
})();
