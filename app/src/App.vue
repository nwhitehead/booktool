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
    <button @click="debug()">DEBUG</button>
    <div class="flex flex-row w-full">
        <div ref="editor" class="w-full"></div>
    </div>
    <textarea ref="content" class="hidden">{{ basicExample }}</textarea>
</template>

<script setup>

import { onMounted, ref, watch, watchEffect } from 'vue';
import DOMPurify from 'dompurify';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
//import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';
import {
    schema,
    defaultMarkdownParser,
    defaultMarkdownSerializer
} from 'prosemirror-markdown';

import basicExample from '../test/basic.md?raw';
import bookCssRaw from '../test/book.css?raw';

import '/node_modules/primeflex/primeflex.css';
import '/node_modules/primeflex/themes/primeone-light.css';
import '/node_modules/github-markdown-css/github-markdown.css';
import 'prosemirror-view/style/prosemirror.css';
import 'prosemirror-menu/style/menu.css';

const editor = ref(null);
const content = ref(null);

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
    marks: schema.spec.marks,
});

class ProseMirrorView {
    constructor(target, content) {
        let parsed = defaultMarkdownParser.parse(content);
        console.log(`parsed = ${parsed}`);
        this.view = new EditorView(target, {
            state: EditorState.create({
                doc: parsed,
                plugins: exampleSetup({ schema: schema }),
            })
        });
    }
    get content() {
        return defaultMarkdownSerializer.serialize(this.view.state.doc);
    }
    get raw() {
        return this.view.state.doc;
    }
    focus() {
        this.view.focus();
    }
    destroy() {
        this.view.destroy();
    }
}

let view = null;

function debug() {
    console.log(`content = ${view.content}`)
    console.log(`raw = ${view.raw}`)
}

onMounted(() => {
    view = new ProseMirrorView(editor.value, basicExample);
    const content = view.content;
});

</script>
