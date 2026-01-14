import puppeteer from 'puppeteer';

async function test() {
    console.log("Trying to launch browser...");
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox']
        });
        console.log("Browser launched!");
        const page = await browser.newPage();
        await page.goto('https://example.com');
        console.log("Page title:", await page.title());
        await browser.close();
        console.log("Done.");
    } catch (e) {
        console.error("FAIL:", e);
    }
}
test();
