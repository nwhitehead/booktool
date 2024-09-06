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
    <div class="flex flex-row">
        <div ref="editor" class="w-full"></div>
    </div>
    <textarea ref="content">{{ basicExample }}</textarea>
    <section class="section">
        <div class="flex flex-row gap-2 w-full h-50">
            <div class="flex-1 shadow-4 overflow-scroll">
            </div>
        </div>
    </section>
</template>

<script setup>

import { onMounted, ref, watch, watchEffect } from 'vue';
import DOMPurify from 'dompurify';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { exampleSetup } from 'prosemirror-example-setup';

import basicExample from '../test/basic.md?raw';
import bookCssRaw from '../test/book.css?raw';

import '/node_modules/primeflex/primeflex.css';
import '/node_modules/primeflex/themes/primeone-light.css';
import '/node_modules/github-markdown-css/github-markdown.css';
import '/node_modules/prosemirror-view/style/prosemirror.css';

const editor = ref(null);
const content = ref(null);

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
    nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
    marks: schema.spec.marks
});

onMounted(() => {
    const view = new EditorView(editor.value, {
        state: EditorState.create({
            doc: DOMParser.fromSchema(mySchema).parse(basicExample),
            plugins: exampleSetup({schema: mySchema}),
        }),
    });
});

</script>
