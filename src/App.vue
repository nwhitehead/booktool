//!
//! App
//!
//! A Vue component representing the top level single-page app.
//!

<template>
    <section class="section">
        <h1>The App</h1>
        <div>
            <Codemirror
                v-model="localModelValue"
                :indent-with-tab="true"
                :tab-size="4"
                :extensions="[markdownLanguage, consoleLightExtension]"
                :disabled="false"
                @update:modelValue="newValue => { localModelValue = newValue; $emit('update:modelValue', newValue); }"
                @ready="handleReady"
            />
        </div>
    </section>
</template>

<script setup>

import { ref } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import { markdownLanguage } from '@codemirror/lang-markdown';
import { consoleLightExtension } from './codemirrorLightTheme.js';

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

let localModelValue = ref(`
# Main Title

Some text is here. You can also put [links](http://www.example.com/) to URLs and things.

## Section title

Hopefully this text is looking legible and easy to edit.

`);

function handleReady(event) {
    console.log('CodeMirror is ready.');
}

</script>
