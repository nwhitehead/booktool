//!
//! App
//!
//! A Vue component representing the top level single-page app.
//!
<style>
.h-50 {
    height: 75vh;
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
import basicExample from '../test/basic.md?raw';
import '/node_modules/primeflex/primeflex.css';
import '/node_modules/primeflex/themes/primeone-light.css';

function renderMarkdown(source) {
    let env = {};
    const result = DOMPurify.sanitize(md.render(source || '', env));
    console.log(env.frontmatter);
    return `<pre>${JSON.stringify(env.frontmatter)}</pre>${result}`;
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

const md = markdownit({
    html: true,
    breaks: false,
    linkify: true,
    quotes: '“”‘’',

}).use(frontmatterPlugin, {});

const view = shallowRef();

let localModelValue = ref(basicExample);

watch(localModelValue, (newValue, oldValue) => {

});

function handleReady(payload) {
    view.value = payload.view;
}

</script>
