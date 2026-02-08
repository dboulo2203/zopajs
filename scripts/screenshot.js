const puppeteer = require('puppeteer');
const path = require('path');

// Usage: node scripts/screenshot.js <url> [output_path]
// Example: node scripts/screenshot.js http://localhost/zopajs/views/listes/listes.html
const url = process.argv[2];
const outputPath = process.argv[3] || path.join(__dirname, '..', 'screenshot.png');

if (!url) {
    console.error('Usage: node scripts/screenshot.js <url> [output_path]');
    process.exit(1);
}

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
        // Attendre un peu pour que le JS s'execute
        await new Promise(r => setTimeout(r, 1500));
        await page.screenshot({ path: outputPath, fullPage: true });
        console.log('Screenshot saved: ' + outputPath);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
