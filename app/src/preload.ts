// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import puppeteer from 'puppeteer';
import fsp from 'fs/promises';

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    puppeteer: () => puppeteer.versions,
});
