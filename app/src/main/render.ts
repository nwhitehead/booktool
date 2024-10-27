import markdownit from 'markdown-it';

// markdown-it plugins
import frontmatterPlugin from './plugins/frontmatterPlugin.ts';
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
import markdownIncludePlugin from 'markdown-it-include';
import { full as markdownEmojiPlugin } from 'markdown-it-emoji';
import markdownCssIncludePlugin from './plugins/cssIncludePlugin.ts';

import { cacheFunction } from './cache.ts';

export function initMarkdown() {

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
        .use(markdownIncludePlugin, {
            bracesAreOptional: true,
            root: './resources',
        })
        .use(markdownCssIncludePlugin, {
            bracesAreOptional: true,
            root: './resources',
        })
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
    function injectLineNumbers(originalFunction) {
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

    return md;
}

export const getMarkdown = cacheFunction(initMarkdown);
