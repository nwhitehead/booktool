const { app, BrowserWindow } = require('electron');
const puppeteer = require('puppeteer');

async function screenshot() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://example.com");
    //await page.screenshot({ path: "example.png" });
    await page.pdf({ path: "example_electron.pdf" });
    await browser.close();
}


const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    });

    win.loadFile('index.html');
}

app.whenReady().then(async () => {
    createWindow();
    await screenshot();
    console.log('Created PDF');
});
