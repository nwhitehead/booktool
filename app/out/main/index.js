"use strict";
const electron = require("electron");
const path = require("path");
const is = {
  dev: !electron.app.isPackaged
};
({
  isWindows: process.platform === "win32",
  isMacOS: process.platform === "darwin",
  isLinux: process.platform === "linux"
});
const puppeteer = require("puppeteer");
async function screenshot() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://example.com");
  await page.pdf({ path: "example_electron.pdf" });
  await browser.close();
}
const createWindow = () => {
  const win = new electron.BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    win.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    win.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
};
electron.app.whenReady().then(async () => {
  createWindow();
  await screenshot();
  console.log("Created PDF");
});
