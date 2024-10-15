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
@font-face {
    font-family: "Reey";
    src: url("fonts/Reey.otf") format("opentype");
}

h1 {
    font-family: "Reey";
}

</style>

<template>
    <section class="section">
        <h1>The App</h1>
        <button @click="() => outputChoice = 'html'">HTML</button>
        <button @click="() => outputChoice = 'paged'">Paged</button>
        <button @click="() => outputChoice = 'frontmatter'">Frontmatter</button>
        <button @click="() => outputChoice = 'debug'">Debug</button>
        <button @click="generatePDF">PDF</button>
        <div class="flex flex-row gap-2 w-full h-50">
            <div class="flex-1 shadow-4 overflow-scroll">
                <Codemirror
                    v-model="localModelValue"
                    :indent-with-tab="true"
                    :tab-size="4"
                    :extensions="codemirrorExtensions"
                    :disabled="false"
                    @ready="handleReady"
                />
            </div>
            <div class="flex-1 shadow-4">
                <iframe ref="markdownOutput" class="border-none" width="100%" height="100%" :src="iframeHtmlUrl" @load="handleIframeLoad">
                </iframe>
            </div>
        </div>
    </section>
</template>

<script setup>

import { ref, shallowRef, watch, watchEffect, onMounted, onBeforeUnmount } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, rectangularSelection, crosshairCursor, ViewPlugin } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { minimalSetup  } from 'codemirror';
import { bracketMatching } from '@codemirror/language';
import { markdownLanguage } from '@codemirror/lang-markdown';
import { consoleLightExtension } from './codemirrorLightTheme.js';

const codemirrorExtensions = [
    minimalSetup,
    bracketMatching(),
    markdownLanguage,
    consoleLightExtension,
    lineNumbers(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    EditorState.allowMultipleSelections.of(true),
    drawSelection(),
    rectangularSelection(),
    crosshairCursor(),
];


import basicExample from './test/basic.md?raw';
import bookCssRaw from './test/book.css?raw';

import 'primeflex/primeflex.css';
import 'primeflex/themes/primeone-light.css';
import 'github-markdown-css/github-markdown.css';

import iframeHtmlUrl from './iframe.html?url';
import iframeTsUrl from './iframeMain.ts?url';

const outputChoice = ref('html');

// DOM element references
const markdownOutput = ref(null);
const iframeLoaded = ref(false);

function handleIframeLoad() {
    iframeLoaded.value = true;
    console.log(markdownOutput.value.contentDocument.body);
    console.log(`iframeUrl=${iframeTsUrl}`);
}

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
    const result = await electronAPI.render({ source: localModelValue.value });

    if (format == 'frontmatter') {
        element.contentWindow.postMessage({
            action: 'update',
            payload: {
                html: `<pre>${JSON.stringify(result.frontmatter, null, 4)}</pre>`,
            },
        });
    } else if (format == 'html') {
        element.contentWindow.postMessage({
            action: 'update',
            payload: {
                html: result.html,
            },
        });
    } else if (format == 'debug') {
        element.contentWindow.postMessage({
            action: 'update',
            payload: {
                html: `<pre>${JSON.stringify(result.debug, null, 4)}</pre>`,
            },
        });
    } else if (format == 'paged') {
        element.contentWindow.postMessage({
            action: 'paged',
            payload: {
                html: result.html,
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

const editorView = shallowRef();

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
    // Only .view of payload is valid (others are out of date???)
    editorView.value = payload.view;
}

/// Find DOM element that actually has scroller
function findScrollContainer(node) {
    while (node && node.scrollHeight <= node.clientHeight) {
      node = node.parentElement;
    }
    return node;
}

/// Given CodeMirror view, center it on the main selection
function centerView(view) {
    const cursor = view.coordsAtPos(view.state.selection.main.head);
    const scrollDOM = findScrollContainer(view.scrollDOM);
    const scroller = scrollDOM.getBoundingClientRect();
    if (cursor) {
        let curMid = (cursor.top + cursor.bottom) / 2;
        let eltMid = (scroller.top + scroller.bottom) / 2;
        // Don't change if it's just a few pixels
        if (Math.abs(curMid - eltMid) > 5) {
            scrollDOM.scrollTop += curMid - eltMid;
        }
    }
}

function handleMessage(msg) {
    const { action, payload } = msg.data;
    if (action === 'dblclick') {
        if (!payload || payload.length !== 2) {
            console.warn(`Edit range not right size payload=${payload}`);
            return;
        }
        console.log(`Switching to range ${payload[0]} - ${payload[1]}`);
        const view = editorView.value;
        const state = view.state;
        const srcLine = payload[0];
        view.dispatch({
            selection: {anchor: state.doc.line(srcLine).from},
            scrollIntoView: true,
        });
        view.focus();
        centerView(view);
    }
}

onMounted(() => {
    window.addEventListener('message', handleMessage);
});

onBeforeUnmount(() => {
    window.removeEventListener('message', handleMessage);
});

async function generatePDF() {
    // const doc = markdownOutput.value.contentDocument.body.innerHTML;
    // console.log(`doc=${doc}`);
    const result = await electronAPI.render({ source: localModelValue.value });
    console.log(`result=${JSON.stringify(result, null, 2)}`);
}
</script>
