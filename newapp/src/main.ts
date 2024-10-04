import { app, session, BrowserWindow } from 'electron';
import path from 'path';
import Squirrel from 'electron-squirrel-startup';

// async function screenshot() {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto("https://example.com");
//     //await page.screenshot({ path: "example.png" });
//     await page.pdf({ path: "example_electron.pdf" });
//     await browser.close();
// }

// contextBridge.exposeInMainWorld(
//     'electron',
//     {
//         doThing: async () => {
//             console.log('Hello from doThing');
//             ipcRenderer.send('do-a-thing');
//             await screenshot();
//             console.log('Did screenshot');
//         },
//     }
// );

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (Squirrel) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    
    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
    // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    //     callback({
    //         responseHeaders: {
    //             ...details.responseHeaders,
    //             'Content-Security-Policy': ['default-src \'self\'']
    //         }
    //     });
    // });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.