//!
//! App
//!
//! A Vue component representing the top level single-page app.
//!
<style>

</style>
<style scoped>
.h-50 {
    height: 75vh;
}
.blah {
    background-color: #ff0;
}

</style>

<template>
    <section class="section">
        <h1>The App</h1>
        <button @click="() => outputChoice = 'html'">HTML</button>
        <button @click="() => outputChoice = 'paged'">Paged</button>
        <button @click="() => outputChoice = 'frontmatter'">Frontmatter</button>
        <button @click="() => outputChoice = 'debug'">Debug</button>
        <div class="flex flex-row gap-2 w-full h-50">
            <div class="flex-1 shadow-4 overflow-scroll">
                <Codemirror
                    v-model="localModelValue"
                    :indent-with-tab="true"
                    :tab-size="4"
                    :extensions="[minimalSetup, bracketMatching(), markdownLanguage, consoleLightExtension, lineNumbers(), highlightActiveLine(), highlightActiveLineGutter(), EditorState.allowMultipleSelections.of(true), drawSelection(), rectangularSelection(), crosshairCursor()]"
                    :disabled="false"
                    @update:modelValue="newValue => { localModelValue = newValue; $emit('update:modelValue', newValue); }"
                    @ready="handleReady"
                />
            </div>
            <div class="flex-1 shadow-4">
                <iframe ref="markdownOutput" class="border-none" width="100%" height="100%" :src="iframeHtmlUrl" @load="() => { iframeLoaded = true; }">
                </iframe>
            </div>
        </div>
    </section>
</template>

<script setup>

import { ref, watch, watchEffect } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, rectangularSelection, crosshairCursor } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { minimalSetup  } from 'codemirror';
import { bracketMatching } from '@codemirror/language';
import { markdownLanguage } from '@codemirror/lang-markdown';
import { consoleLightExtension } from './codemirrorLightTheme.js';
import markdownit from 'markdown-it';
import DOMPurify from 'dompurify';

// markdown-it plugins
import { frontmatterPlugin } from '@mdit-vue/plugin-frontmatter';
import markdownBracketedSpansPlugin from 'markdown-it-bracketed-spans';
import markdownAttrsPlugin from 'markdown-it-attrs';
import markdownContainerPlugin from 'markdown-it-container';
import markdownMathPlugin from '@vscode/markdown-it-katex';
import markdownDeflistPlugin from 'markdown-it-deflist';
import markdownFootnotePlugin from 'markdown-it-footnote';
import markdownImplicitFiguresPlugin from 'markdown-it-implicit-figures';
import markdownGridTablesPlugin from 'markdown-it-gridtables';
import markdownSubPlugin from 'markdown-it-sub';
import markdownSupPlugin from 'markdown-it-sup';
import markdownTaskListsPlugin from 'markdown-it-task-lists';
import markdownMarkPlugin from 'markdown-it-mark';
import { full as markdownEmojiPlugin } from 'markdown-it-emoji';
import markdownItSourceMap from 'markdown-it-source-map';
import markdownInjectLineNumbers from 'markdown-it-inject-linenumbers';

import basicExample from '../test/basic.md?raw';
import bookCssRaw from '../test/book.css?raw';

import '/node_modules/primeflex/primeflex.css';
import '/node_modules/primeflex/themes/primeone-light.css';
import '/node_modules/github-markdown-css/github-markdown.css';

import iframeHtmlUrl from './iframe.html?url';

const outputChoice = ref('html');

// DOM element references
const markdownOutput = ref(null);
const iframeLoaded = ref(false);

async function renderMarkdown(source, format, element) {
    if (!element) {
        console.log('No element to render to');
        return;
    }
    const iframe = element.contentDocument;
    if (!iframe || !iframe.body) {
        console.log('No iframe');
        return;
    }
    // Generate sanitized HTML content from markdown source (also extracts frontmatter)
    let env = {};
    const startRenderTime = performance.now();
    const output = DOMPurify.sanitize(md.render(source || '', env));
    const endRenderTime = performance.now();
    const totalRenderTime = endRenderTime - startRenderTime;
    console.log(`Markdown HTML render took ${totalRenderTime}ms`);

    if (format == 'frontmatter') {
        element.contentWindow.postMessage({
            action: 'update',
            payload: {
                html: `<pre>${JSON.stringify(env.frontmatter, null, 4)}</pre>`,
            },
        });
    } else if (format == 'html') {
        element.contentWindow.postMessage({
            action: 'update',
            payload: {
                html: output,
            },
        });
    } else if (format == 'debug') {
        element.contentWindow.postMessage({
            action: 'update',
            payload: {
                html: `<pre>${JSON.stringify(md.parse(source, { references: {} }), null, 2)}</pre>`,
            },
        });
    } else if (format == 'paged') {
        element.contentWindow.postMessage({
            action: 'paged',
            payload: {
                html: output,
                css: bookCssRaw,
            },
        });
    }
}

const Theme = EditorView.theme({
    "&": {
        fontSize: "10.5pt",
        border: "1px solid #c0c0c0"
    },
    ".cm-content": {
        fontFamily: "Menlo, Monaco, Lucida Console, monospace",
        minHeight: "200px"
    },
    ".cm-gutters": {
        minHeight: "200px"
    },
    ".cm-scroller": {
        overflow: "auto",
        maxHeight: "600px"
    }
});

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
.use(markdownMathPlugin)
.use(markdownDeflistPlugin)
.use(markdownFootnotePlugin)
.use(markdownImplicitFiguresPlugin, {
    figcaption: true,
    keepAlt: true,
})
.use(markdownGridTablesPlugin)
.use(markdownSubPlugin)
.use(markdownSupPlugin)
.use(markdownTaskListsPlugin)
.use(markdownMarkPlugin)
.use(markdownEmojiPlugin)
//.use(markdownInjectLineNumbers)
);

//
// Inject line numbers for sync scroll. Notes:
//
// - We track only headings and paragraphs on first level. That's enough.
// - Footnotes content causes jumps. Level limit filter it automatically.
function injectLineNumbers (tokens, idx, options, env, slf) {
    if (tokens[idx].map /* && tokens[idx].level === 0 */) {
        const lineStart = tokens[idx].map[0];
        const lineEnd = tokens[idx].map.at(-1);
        console.log(`injectLineNubmers ${tokens[idx].map}`);
        tokens[idx].attrJoin('class', 'line');
        tokens[idx].attrSet('data-line', String(lineStart));
        tokens[idx].attrSet('data-line-end', String(lineEnd));
    }
    return slf.renderToken(tokens, idx, options, env, slf);
}

md.renderer.rules.paragraph_open = md.renderer.rules.heading_open = injectLineNumbers;
md.renderer.rules.footnote_open = injectLineNumbers;
const def_math_block= md.renderer.rules.math_block;
console.log(def_math_block);
md.renderer.rules.math_block = function(tokens, idx, options, env, slf) {
    console.log(`math_block wrapper ${idx}`);
    if (tokens[idx].map /* && tokens[idx].level === 0 */) {
        const line = tokens[idx].map[0];
        console.log(`math_block wrapper line=${line}`);
        const res = def_math_block(tokens, idx, options, env, slf);
        tokens[idx].attrJoin('class', 'line');
        tokens[idx].attrSet('data-line', String(line));
        return res;
    }
    return def_math_block(tokens, idx, options, env, slf);
};

const editorObject = ref();

let localModelValue = ref(basicExample);

function updateView() {
    renderMarkdown(localModelValue.value, outputChoice.value, markdownOutput.value);
}

watchEffect(() => {
    updateView();
});

watch(iframeLoaded, () => {
    updateView();
});

function handleReady(payload) {
    editorObject.value = payload;
}

</script>
