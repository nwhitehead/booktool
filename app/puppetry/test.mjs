
import electron from 'electron';
import pie from 'puppeteer-in-electron';
import puppeteer from 'puppeteer-core';

const main = async () => {
    await pie.initialize(electron.app);
    const browser = await pie.connect(electron.app, puppeteer);

    const window = new electron.BrowserWindow();
    const url = "https://example.com/";
    await window.loadURL(url);

    const page = await pie.getPage(browser, window);
    console.log(page.url());
    window.destroy();
};

main();
