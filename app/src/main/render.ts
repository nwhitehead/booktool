
import sass from 'sass';

import katexCssRaw from 'katex/dist/katex.min.css?raw';
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

export async function render(source, options) {
    const md = await getMarkdown(options);
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
        // Include Katex CSS in scoped and regular output (I don't know how to include it in a scope)
        const scopedCss = compile(env.scss, 'css-scope') + '\n' + katexCssRaw;
        const css = compile(env.scss) + '\n' + katexCssRaw;
        return { html, debug, frontmatter, env, css, scopedCss }
    } catch(exception) {
        console.log(exception);
        return { exception }
    }
}

export async function handleRender(event, payload) {
    const target = payload.target;
    const source = payload.source;
    const options = payload.options;
    const result = await render(source, options);
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
        await page.addStyleTag({ content: katexCssRaw });
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
