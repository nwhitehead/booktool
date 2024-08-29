//!
//! App
//!
//! A Vue component representing the top level single-page app.
//!
<style>
.h-50 {
    height: 75vh;
}
.spoiler {
    padding: 5px 15px 5px 15px;
    margin: 5px;
    border-width: 10px;
    border-style: solid;
    border-image: repeating-linear-gradient( 45deg, #ff0,#ff0 3%, #888 3%, #888 6%) 10;
}
.warning {
    padding: 5px 15px 5px 15px;
    margin: 5px;
    border-width: 10px;
    border-style: solid;
    border-image: repeating-linear-gradient( 45deg, #f00,#f00 3%, #eee 3%, #eee 6%) 10;
}

p {
    background-color: #f0f;
}

</style>

<template>
    <p>Test</p>
    <section class="section">
        <h1>The App</h1>
        <button @click="() => outputChoice = 'html'">HTML</button>
        <button @click="() => outputChoice = 'paged'">Paged</button>
        <button @click="() => outputChoice = 'frontmatter'">Frontmatter</button>
        <div class="flex flex-row gap-2 w-screen h-50">
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
            <div class="flex-1 shadow-4 overflow-scroll">
                <div ref="markdownOutput">
                </div>
            </div>
        </div>
    </section>
    <div class="shadow-4" ref="pagedOutput">
    </div>
</template>

<script setup>

import { ref, watchEffect } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, rectangularSelection, crosshairCursor } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { minimalSetup  } from 'codemirror';
import { bracketMatching } from '@codemirror/language';
import { markdownLanguage } from '@codemirror/lang-markdown';
import { consoleLightExtension } from './codemirrorLightTheme.js';
import markdownit from 'markdown-it';
import DOMPurify from 'dompurify';
import { frontmatterPlugin } from '@mdit-vue/plugin-frontmatter';
import markdownBracketedSpansPlugin from 'markdown-it-bracketed-spans';
import markdownAttrsPlugin from 'markdown-it-attrs';
import markdownContainerPlugin from 'markdown-it-container';
import markdownKatexPlugin from '@vscode/markdown-it-katex';
import markdownDeflistPlugin from 'markdown-it-deflist';
import markdownFootnotePlugin from 'markdown-it-footnote';
import markdownImplicitFiguresPlugin from 'markdown-it-implicit-figures';
import markdownGridTablesPlugin from 'markdown-it-gridtables';
import markdownSubPlugin from 'markdown-it-sub';
import markdownSupPlugin from 'markdown-it-sup';
import markdownTaskListsPlugin from 'markdown-it-task-lists';
import markdownMarkPlugin from 'markdown-it-mark';
import { full as markdownEmojiPlugin } from 'markdown-it-emoji';
import { Previewer } from 'pagedjs';
import basicExample from '../test/basic.md?raw';
//import bookCssUrl from '/book.css?url';
import '/node_modules/primeflex/primeflex.css';
import '/node_modules/primeflex/themes/primeone-light.css';
import '/node_modules/github-markdown-css/github-markdown.css';
import '/node_modules/katex/dist/katex.min.css';

const outputChoice = ref("paged");

// DOM element references
const markdownOutput = ref(null);

async function renderMarkdown(source, format, element) {
    if (element === null) {
        return;
    }
    // Generate sanitized HTML content from markdown source (also extracts frontmatter)
    let env = {};
    const startRenderTime = performance.now();
    const output = DOMPurify.sanitize(md.render(source || '', env));
    const endRenderTime = performance.now();
    const totalRenderTime = endRenderTime - startRenderTime;
    console.log(`Markdown HTML render took ${totalRenderTime}ms`);

    // Clear anything in the element
    element.replaceChildren();

    if (format == 'frontmatter') {
        element.innerHTML = `<pre class="surface-100">${JSON.stringify(env.frontmatter, null, 4)}</pre>`;
    } else if (format == 'html') {
        element.innerHTML = output;
    } else if (format == 'paged') {
        // Generate paged output
        const startPageRenderTime = performance.now();
        let paged = new Previewer();
        //console.log(`URL for style is ${bookCssUrl}`);
        const flow = await paged.preview(output, null, element);
        const endPageRenderTime = performance.now();
        const totalPageRenderTime = endPageRenderTime - startPageRenderTime;
        console.log(`Paged HTML render took ${totalPageRenderTime}ms for ${flow.total} pages.`);
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
.use(markdownKatexPlugin)
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
);

const editorObject = ref();

let localModelValue = ref(basicExample);

watchEffect(async () => {
    await renderMarkdown(localModelValue.value, outputChoice.value, markdownOutput.value);
    // await renderPaged(newValue, pagedOutput.value);
    // const state = editorObject.value.state;
    // console.log(state);
    // if (state) {
    //     const ranges = state.selection.ranges;
    //     const selected = ranges.reduce((r, range) => r + range.to - range.from, 0);
    //     const cursor = ranges[0].anchor;
    //     const length = state.doc.length;
    //     const lines = state.doc.lines;
    //     console.log(length);
    // }
});

function handleReady(payload) {
    editorObject.value = payload;
}

</script>
