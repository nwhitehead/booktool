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
</style>

<template>
    <section class="section">
        <h1>The App</h1>
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
            <div class="flex-1 shadow-4  overflow-scroll">
                <div v-html="renderMarkdown(localModelValue)">
                </div>
            </div>
        </div>
    </section>
    <div class="shadow-4" ref="pagedOutput">
    </div>
</template>

<script setup>

import { ref, shallowRef, watch } from 'vue';
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
import interfaceCssUrl from '../test/interface.css?url';
import '/node_modules/primeflex/primeflex.css';
import '/node_modules/primeflex/themes/primeone-light.css';
import '/node_modules/github-markdown-css/github-markdown.css';
import '/node_modules/katex/dist/katex.min.css';

const pagedOutput = ref(null);

function renderMarkdown(source) {
    let env = {};
    const result = DOMPurify.sanitize(md.render(source || '', env));
    return `<pre class="surface-100">${JSON.stringify(env.frontmatter, null, 4)}</pre>\n${result}`;
}

let count = 0;

async function renderPaged(source, element) {
    const cnt = count++;
    let env = {};
    console.log(`Start HTML render ${cnt}`);
    const output = DOMPurify.sanitize(md.render(source || '', env));
    console.log(`End HTML render ${cnt}`);
    let paged = new Previewer();
    // Clean element first
    element.replaceChildren();
    console.log(`Start pagedjs render ${cnt}`);
    const flow = await paged.preview(output, [interfaceCssUrl], element);
    console.log(`End pagedjs render ${cnt}`);
    console.log("Rendered", flow.total, "pages.");
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

watch(localModelValue, async (newValue, oldValue) => {
    console.log(newValue);
    await renderPaged(newValue, pagedOutput.value);
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
