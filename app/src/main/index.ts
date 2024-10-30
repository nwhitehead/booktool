import commandLineArguments from 'command-line-args';
import process from 'node:process';
import fs from 'node:fs/promises';
import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';

import { handleRender } from './render.ts';

function handleSetTitle(event, title) {
    console.log('Setting title');
    const contents = event.sender;
    const win = BrowserWindow.fromWebContents(contents);
    win?.setTitle(title);
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        // ...(process.platform === 'linux' ? { icon } : {}),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    });

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        win.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
        win.loadFile(join(__dirname, '../renderer/index.html'));
    }
}

// Get command-line arguments
const argv = process.argv;
const commandLineOptions = [
    { name: 'nogui', alias: 'i', type: Boolean },
    { name: 'root', alias: 'r', type: String },
];
const options = commandLineArguments(commandLineOptions, { argv });
if (options.nogui) {
    console.log('No GUI');
    console.log(options);
    app.quit();
} else {
    app.whenReady().then(async () => {
        ipcMain.on('set-title', handleSetTitle);
        ipcMain.handle('render', handleRender);
        createWindow();
    });
}
