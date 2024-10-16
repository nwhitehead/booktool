import fs from 'node:fs/promises';
import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { is } from '@electron-toolkit/utils';

import markdownit from 'markdown-it';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

// markdown-it plugins
import { frontmatterPlugin } from './frontmatterPlugin.ts';
import markdownBracketedSpansPlugin from 'markdown-it-bracketed-spans';
import markdownAttrsPlugin from 'markdown-it-attrs';
import markdownContainerPlugin from 'markdown-it-container';
// The @vscode/markdown-it-katex plugin seems to have trouble with our build chain, use older syntax for import.
const markdownMathPlugin = require('@vscode/markdown-it-katex').default;
import markdownDeflistPlugin from 'markdown-it-deflist';
import markdownFootnotePlugin from 'markdown-it-footnote';
import markdownImplicitFiguresPlugin from 'markdown-it-implicit-figures';
import markdownTablesPlugin from 'markdown-it-multimd-table-ext';
import markdownSubPlugin from 'markdown-it-sub';
import markdownSupPlugin from 'markdown-it-sup';
import markdownTaskListsPlugin from 'markdown-it-task-lists';
import markdownMarkPlugin from 'markdown-it-mark';
import { full as markdownEmojiPlugin } from 'markdown-it-emoji';

import puppeteer from 'puppeteer';

import katexUrl from 'katex/dist/katex.min.css?url';
import githubMarkdownUrl from 'github-markdown-css/github-markdown.css?url';
import defaultCss from './default.css?raw';


const containerNames = [ 'spoiler', 'warning' ];

function multiuseContainers(names, md) {
    for (const name of names) {
        md = md.use(markdownContainerPlugin, name);
    }
    return md;
}

const md = multiuseContainers(containerNames, markdownit({
    html: true,
    breaks: false,
    linkify: true,
    quotes: '“”‘’',
})
.use(frontmatterPlugin, {})
.use(markdownAttrsPlugin, {})
.use(markdownBracketedSpansPlugin, {})
.use(markdownMathPlugin, {})
.use(markdownDeflistPlugin)
.use(markdownFootnotePlugin)
.use(markdownImplicitFiguresPlugin, {
    figcaption: true,
    keepAlt: true,
})
.use(markdownTablesPlugin, {
    multiline: true,
})
.use(markdownSubPlugin)
.use(markdownSupPlugin)
.use(markdownTaskListsPlugin)
.use(markdownMarkPlugin)
.use(markdownEmojiPlugin)
);

function injectSourceMap(token) {
    // Given a token, add attributes to source range of lines
    // If there is no map, just ignore
    if (token.map) {
        token.attrPush(['data-source-line-start', token.map[0] + 1])
        token.attrPush(['data-source-line-end', token.map.at(-1) + 1])
    }
}

// Rule to inject source lines into output
// This adds attributes to tokens at rule stage
// This is needed for fence blocks, which are transformed during rules phase before rendering
function injectLineNumbers(originalFunction){
    return (tokens, idx, options, env, slf) => {
        injectSourceMap(tokens[idx]);
        return originalFunction(tokens, idx, options, env, slf);
    }
}
md.renderer.rules.fence = injectLineNumbers(md.renderer.rules.fence);

// Inject source lines into all _open style tokens.
const originalRenderToken = md.renderer.renderToken.bind(md.renderer);
md.renderer.renderToken = function (tokens, idx, options) {
    const token = tokens[idx];
    if (token.map !== null && token.type.endsWith('_open')) {
        injectSourceMap(token);
    }
    return originalRenderToken(tokens, idx, options);
};

// Math needs extra work to get sourcemap
function generateAttrs(attrs) {
    const attrStrings = attrs.map((attr) => `${attr[0]}="${attr[1]}"`);
    return attrStrings.join(' ');
}

const originalMathBlockRenderer = md.renderer.rules.math_block;
md.renderer.rules.math_block = function(tokens, idx, options, env, slf) {
    // Inject sourcemap to attrs
    injectSourceMap(tokens[idx]);
    // Now manually generate attrs for wrapping div
    // Call original katex renderer inside
    const attrString = generateAttrs(tokens[idx].attrs);
    return `<div class="katex-block" ${attrString}>${originalMathBlockRenderer(tokens, idx, options, env, slf)}</div>`;
};

// Make links open in new tab
var defaultRenderLinkOpen = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};
md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet('target', '_blank');
  return defaultRenderLinkOpen(tokens, idx, options, env, self);
};

let purifyCached = null;

async function getPurify() {
    if (purifyCached) {
        return purifyCached;
    }
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    purifyCached = purify;
    return purify;
}

async function getPage() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    return page;
}

async function render(source) {
    const purify = await getPurify();
    let debugEnv = { references: {} };
    let env = { references: {} };
    const startRenderTime = performance.now();
    const debug = md.parse(source, debugEnv);
    const output = purify.sanitize(md.render(source, env));
    const endRenderTime = performance.now();
    const totalRenderTime = endRenderTime - startRenderTime;

}

async function addPageCss(page, absoluteUrl) {
    // Convert absolute URL from build into absolute file path with file:///
    const url = new URL('.' + absoluteUrl, import.meta.url);
    const contents = await fs.readFile(url, { encoding: 'utf-8' });
    await page.addStyleTag({
        content: cssContents,
    });
}

async function handleRender(event, payload) {
    const purify = await getPurify();
    const source = payload.source || '';
    let debugEnv = { references: {} };
    let env = { references: {} };
    const startRenderTime = performance.now();
    const debug = md.parse(source, debugEnv);
    const output = purify.sanitize(md.render(source, env));
    const endRenderTime = performance.now();
    const totalRenderTime = endRenderTime - startRenderTime;
    console.log(`Markdown HTML render took ${totalRenderTime}ms`);
    const page = await getPage();
    await page.setContent(output);
    // Add custom styling to turn off katex-mathml which is there just for accessibility
    await page.addStyleTag({ content: defaultCss });
    // Compute URL for file that is compiled katex styles
    // Need to add '.', the URL in katexUrl is absolute with base out/main/
    const url = new URL('.' + katexUrl, import.meta.url);
    console.log(`url=${url}`);
    const cssContents = await fs.readFile(url, 'utf-8');
    await page.addStyleTag({
        content: cssContents,
    });
    await page.pdf({ path: "dist/example_title.pdf" });
    return {
        frontmatter: env.frontmatter,
        debug: debug,
        html: output,
    };
}

function handleSetTitle(event, title) {
    console.log('Setting title');
    const contents = event.sender;
    const win = BrowserWindow.fromWebContents(contents);
    win?.setTitle(title);
}

async function handleGeneratePDF(event, contents) {
    console.log('Generating PDF');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://example.com");
    //await page.screenshot({ path: "example.png" });
    await page.pdf({ path: "dist/example_electron.pdf" });
    await browser.close();
    console.log('Done generating PDF');
    return 'thepdf';
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

app.whenReady().then(async () => {
    ipcMain.on('set-title', handleSetTitle);
    ipcMain.handle('generatePDF', handleGeneratePDF);
    ipcMain.handle('render', handleRender);
    createWindow();
});
