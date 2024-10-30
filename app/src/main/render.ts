
import katexUrl from 'katex/dist/katex.min.css?url';
import fs from 'node:fs/promises';
import sass from 'sass';

import githubMarkdownUrl from 'github-markdown-css/github-markdown.css?url';
import defaultCssRaw from './pager/default.css?raw';
import pagedjsRaw from '../../node_modules/pagedjs/dist/paged.min.js?raw';
import pagerScriptRaw from './pager/script.js?raw';

import { sanitize } from './purify.ts';
import { getPage } from './browser.ts';
import { getMarkdown } from './markdown.ts';

const MAX_URL_LENGTH: number = 50;

function compile(src, scope?) {
    const scopedSrc = scope ? `
        [data-${scope}] {
            ${src.join('\n')}
        }` : src.join('\n');
    return sass.compileString(scopedSrc).css;
}

export async function render(source) {
    const md = await getMarkdown();
    let debugEnv = { references: {} };
    let env = { references: {}, frontmatter: {}, scss: [] };
    try {
        const startRenderTime = performance.now();
        const debug = md.parse(source, debugEnv);
        const rendered = md.render(source, env);
        const html = await sanitize(rendered);
        const frontmatter = env.frontmatter;
        const endRenderTime = performance.now();
        const totalRenderTime = endRenderTime - startRenderTime;
        console.log(`Markdown HTML render took ${totalRenderTime}ms`);
        // Now add all scss styles from the document, in order
        const scopedCss = compile(env.scss, 'css-scope');
        const css = compile(env.scss);
        return { html, debug, frontmatter, env, css, scopedCss }
    } catch(exception) {
        console.log(exception);
        return { exception }
    }
}

async function readAbsoluteUrl(absoluteUrl) {
    return await fs.readFile(new URL('.' + absoluteUrl, import.meta.url), { encoding: 'utf-8' });
}

export async function handleRender(event, payload) {
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
        await page.addStyleTag({ content: await readAbsoluteUrl(katexUrl) });
        // Add default styling to turn off katex-mathml which is there just for screen accessibility
        await page.addStyleTag({ content: defaultCssRaw });
        // Add paged.js package
        await page.addScriptTag({ content: pagedjsRaw });
        // Add local script that defines paginate call
        await page.addScriptTag({ content: pagerScriptRaw });
        // Call paginate and get returned pagesize
        const pagesize = await page.evaluate((cssRaw) => {
            return paginate(cssRaw);
        }, defaultCssRaw);
        return await page.pdf({
            width: `${pagesize[0]}px`,
            height: `${pagesize[1]}px`,
        });
    }
    throw `Unknown payload target '${payload.target}`;
}
