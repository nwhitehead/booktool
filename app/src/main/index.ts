import process from 'node:process';
import fs from 'node:fs/promises';
import commandLineArguments from 'command-line-args';
import commandLineUsage from 'command-line-usage';
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

// Command-line arguments
const commandLineOptions = [
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Show this usage guide.',
    },
    {
        name: 'compile',
        alias: 'c',
        type: Boolean,
        description: 'Generate output only, do not start graphical interface.',
    },
    {
        name: 'root',
        alias: 'r',
        type: String,
        typeLabel: '{underline path}',
        defaultValue: '.',
        description: 'Set root directory for document generation.',
    },
    {
        name: 'index',
        alias: 'i',
        type: String,
        typeLabel: '{underline filename}',
        lazyMultiple: true,
        defaultValue: ['index.md'],
        description: 'Set starting index filename. Can be set multiple times. The first file that exists will be used.',
    },
];

const logo = `
██████╗  ██████╗  ██████╗ ██╗  ██╗████████╗ ██████╗  ██████╗ ██╗     
██╔══██╗██╔═══██╗██╔═══██╗██║ ██╔╝╚══██╔══╝██╔═══██╗██╔═══██╗██║     
██████╔╝██║   ██║██║   ██║█████╔╝    ██║   ██║   ██║██║   ██║██║     
██╔══██╗██║   ██║██║   ██║██╔═██╗    ██║   ██║   ██║██║   ██║██║     
██████╔╝╚██████╔╝╚██████╔╝██║  ██╗   ██║   ╚██████╔╝╚██████╔╝███████╗
╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝
`;
const sections = [
    {
        content: logo,
        raw: true,
    },
    {
        header: 'BookTool',
        content: 'Convert Markdown into publications. Generate PDF, ePub, and HTM.',
    },
    {
        header: 'Main Options',
        optionList: commandLineOptions,
    }
];
const usage = commandLineUsage(sections);

async function main(options) {
    if (options.help) {
        console.log(usage);
        app.quit();
        return;
    }
    if (options.compile) {
        console.log('Compile (no GUI)');
        console.log(options);
        app.quit();
        return;
    }
    app.whenReady().then(async () => {
        ipcMain.on('set-title', handleSetTitle);
        ipcMain.handle('render', handleRender);
        createWindow();
    });
}

// Get command-line arguments
const argv = process.argv;
const options = commandLineArguments(commandLineOptions, { argv });

main(options);
