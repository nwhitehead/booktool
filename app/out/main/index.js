"use strict";
const { app, BrowserWindow } = require("electron");
const { join } = require("path");
const { is } = require("@electron-toolkit/utils");
const puppeteer = require("puppeteer");
async function screenshot() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://example.com");
  await page.pdf({ path: "example_electron.pdf" });
  await browser.close();
}
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html"));
  }
};
app.whenReady().then(async () => {
  createWindow();
  await screenshot();
  console.log("Created PDF");
});
