import commandLineArguments from 'command-line-args';
import process from 'node:process';
import fs from 'node:fs/promises';
import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';

import katexUrl from 'katex/dist/katex.min.css?url';
import githubMarkdownUrl from 'github-markdown-css/github-markdown.css?url';
import defaultCssRaw from './pager/default.css?raw';
import pagedjsRaw from '../../node_modules/pagedjs/dist/paged.min.js?raw';
import pagerScriptRaw from './pager/script.js?raw';

import { getPurify } from './purify.ts';
import { getPage } from './browser.ts';
import { getMarkdown } from './render.ts';

async function render(source) {
    const purify = await getPurify();
    const md = await getMarkdown();
    let debugEnv = { references: {} };
    let env = { references: {} };
    try {
        const startRenderTime = performance.now();
        const debug = md.parse(source, debugEnv);
        const rendered = md.render(source, env);
        const html = purify.sanitize(rendered);
        const frontmatter = env.frontmatter;
        const endRenderTime = performance.now();
        const totalRenderTime = endRenderTime - startRenderTime;
        console.log(`Markdown HTML render took ${totalRenderTime}ms`);
        return { html, debug, frontmatter, env }
    } catch(exception) {
        return { exception }
    }
}

function buildFilePathUrl(absoluteUrl) {
    // Convert absolute URL from build into absolute file path with file:///
    // Need to add '.', the URL in absoluteUrl is absolute with base out/main/
    return new URL('.' + absoluteUrl, import.meta.url);
}

async function addPageCss(page, absoluteUrl) {
    const url = buildFilePathUrl(absoluteUrl);
    const contents = await fs.readFile(url, { encoding: 'utf-8' });
    await page.addStyleTag({
        content: contents,
    });
}

const MAX_URL_LENGTH: number = 50;

async function handleRender(event, payload) {
    const target = payload.target;
    const source = payload.source;
    const result = await render(source);
    if (target === 'html' || target === 'frontmatter') {
        return result;
    } else if (target === 'pdf') {
        const page = await getPage();

        // Register handlers for debugging
        page.on('console', message => console.log(`[PDF] ${message.type().substring(0, 3).toUpperCase()} ${message.text()}`))
            .on('pageerror', ({ message }) => console.log(`[PDF] ${message}`))
            .on('response', response => console.log(`[PDF] ${response.status()} ${response.url().substring(0, MAX_URL_LENGTH)}`))
            .on('requestfailed', request => console.log(`[PDF] ${request.failure().errorText} ${request.url().substring(0, MAX_URL_LENGTH)}`));
        await page.setContent(result.html);
        // Add KaTeX styles to show math properly (includes lots of inlined fonts)
        await addPageCss(page, katexUrl);
        // Add default styling to turn off katex-mathml which is there just for accessibility
        await page.addStyleTag({ content: defaultCssRaw });
        // Add paged.js package
        await page.addScriptTag({ content: pagedjsRaw });
        // Add local script that defines paginate call
        await page.addScriptTag({ content: pagerScriptRaw });
        // Call paginate and get returned pagesize
        const pagesize = await page.evaluate((cssRaw) => {
            console.log(`cssRaw=${cssRaw}`);
            return paginate(cssRaw);
        }, defaultCssRaw);
        console.log(`pagesize = ${pagesize}`);
        return await page.pdf({
            width: `${pagesize[0]}px`,
            height: `${pagesize[1]}px`,
        });
    }
    throw `Unknown payload target '${payload.target}`;
}

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
