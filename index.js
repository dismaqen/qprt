const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Daftar link Adsterra
const links = [
    "https://shedroobsoa.net/4/9181219?var=default",
    "https://shedroobsoa.net/4/9180754?var=default",
    "https://stenexeb.xyz/4/9158566",
    "https://stenexeb.xyz/4/9180687"
];

// Fungsi untuk memeriksa proxy hidup/mati
async function checkProxy(proxy) {
    try {
        const response = await axios.get('https://www.google.com', {
            proxy: {
                host: proxy.host,
                port: proxy.port
            },
            timeout: 5000
        });
        return response.status === 200;
    } catch (error) {
        console.error(`Proxy mati: ${proxy.host}:${proxy.port}`);
        return false;
    }
}

// Fungsi untuk menggunakan proxy dari daftar dan menunggu halaman
async function visitLink(browser, link, proxy) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Mengatur proxy
    await page.authenticate({ username: proxy.username, password: proxy.password });
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if (req.resourceType() === 'document') {
            req.continue();
        } else {
            req.abort();
        }
    });

    // Stealth settings untuk menghindari deteksi
    await page.evaluateOnNewDocument(() => {
        // Menghindari deteksi sebagai bot
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
        Object.defineProperty(navigator, 'platform', { get: () => 'Win32' });
        Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
        Object.defineProperty(navigator, 'plugins', { get: () => [{ name: 'Chrome PDF Plugin' }] });
    });

    try {
        console.log(`Mengunjungi link: ${link}`);
        await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 0 });
        console.log(`Berhasil mengunjungi:
