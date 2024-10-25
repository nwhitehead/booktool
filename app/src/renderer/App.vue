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
    src: url("/fonts/Reey.otf") format("opentype");
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
            <div class="flex-1 shadow-4 overflow-scroll p-4">
                <div ref="markdownOutput" class="border-none" width="100%" height="100%" @dblclick="handleDoubleClick" />
            </div>
        </div>
    </section>
</template>

<script setup>

import { ref, shallowRef, watchEffect, onMounted, onBeforeUnmount } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, rectangularSelection, crosshairCursor, ViewPlugin } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { minimalSetup  } from 'codemirror';
import { bracketMatching } from '@codemirror/language';
import { markdownLanguage } from '@codemirror/lang-markdown';
import { consoleLightExtension } from './codemirrorLightTheme.ts';

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

import 'katex/dist/katex.min.css';
import 'primeflex/primeflex.css';
import 'primeflex/themes/primeone-light.css';
import 'github-markdown-css/github-markdown.css';

const outputChoice = ref('html');

// DOM element references
const markdownOutput = ref(null);

async function renderMarkdown(source, format, element) {
    if (!element) {
        console.log('No element to render to');
        return;
    }

    // Generate sanitized HTML content from markdown source (also extracts frontmatter)
    const result = await electronAPI.render({ target: 'html', source: localModelValue.value });

    if (result.exception) {
        element.innerHTML = `<span class="exception">${JSON.stringify(result.exception.message, null, 4)}</span>`;
        return;
    }

    if (format == 'frontmatter') {
        element.innerHTML = `<pre>${JSON.stringify(result.frontmatter, null, 4)}</pre><pre>${JSON.stringify(result.env, null, 4)}</pre>`;
        return;
    } else if (format == 'html') {
        element.innerHTML = result.html;
        return;
    } else if (format == 'debug') {
        element.innerHTML = `<pre>${JSON.stringify(result.debug, null, 4)}</pre>`;
        return;
    } else if (format == 'paged') {
        element.innerHTML = result.html;
        return;
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

onMounted(() => {
    watchEffect(() => {
        updateView();
    });
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

function handleEditorJump(start, end) {
    console.log(`Switching to range ${start} - ${end}`);
    const view = editorView.value;
    const state = view.state;
    const srcLine = start;
    view.dispatch({
        selection: {anchor: state.doc.line(srcLine).from},
        scrollIntoView: true,
    });
    view.focus();
    centerView(view);
}

function findSource(elem) {
    /// Find sourcemap range of elem
    /// Trickles up the DOM looking for data-source-line-start/end
    while (elem) {
        const start = elem.getAttribute('data-source-line-start');
        const end = elem.getAttribute('data-source-line-end');
        if (start && end) {
            return [start, end];
        }
        elem = elem.parentElement;
    }
    // Could not find sourcemap range anywhere in ancestors
    return null;
}

function handleDoubleClick(evt) {
    const src = findSource(evt.target);
    if (src) {
        handleEditorJump(src[0], src[1]);
    }
}

async function generatePDF() {
    const result = await electronAPI.render({ target: 'pdf', source: localModelValue.value });
    const pdfBlob = new Blob([result], { type: 'application/pdf' });
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL, '_blank');
}
</script>
