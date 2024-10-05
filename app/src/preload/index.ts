import { contextBridge } from 'electron';

import puppeteer from 'puppeteer';

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
});
