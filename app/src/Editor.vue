

<template>
    <div v-if="editor" class="container">
        <div class="control-group">
            <div class="button-group">
                <button @click="debug">
                    Debug
                </button>
                <button @click="editor.chain().focus().setMath().run()">
                    Math
                </button>
                <button @click="editor.chain().focus().toggleBold().run()"
                    :disabled="!editor.can().chain().focus().toggleBold().run()"
                    :class="{ 'is-active': editor.isActive('bold') }">
                    <strong>B</strong>
                </button>
                <button @click="editor.chain().focus().toggleItalic().run()"
                    :disabled="!editor.can().chain().focus().toggleItalic().run()"
                    :class="{ 'is-active': editor.isActive('italic') }">
                    <em>i</em>
                </button>
                <button @click="editor.chain().focus().toggleStrike().run()"
                    :disabled="!editor.can().chain().focus().toggleStrike().run()"
                    :class="{ 'is-active': editor.isActive('strike') }">
                    <s>s</s>
                </button>
                <button @click="editor.chain().focus().toggleCode().run()"
                    :disabled="!editor.can().chain().focus().toggleCode().run()"
                    :class="{ 'is-active': editor.isActive('code') }">
                    Code
                </button>
                <button @click="editor.chain().focus().unsetAllMarks().run()">
                    Clear marks
                </button>
                <button @click="editor.chain().focus().clearNodes().run()">
                    Clear nodes
                </button>
                <button @click="editor.chain().focus().setParagraph().run()"
                    :class="{ 'is-active': editor.isActive('paragraph') }">
                    Paragraph
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
                    H1
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
                    H2
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
                    H3
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
                    H4
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
                    H5
                </button>
                <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
                    :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
                    H6
                </button>
                <button @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'is-active': editor.isActive('bulletList') }">
                    Bullet list
                </button>
                <button @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'is-active': editor.isActive('orderedList') }">
                    Ordered list
                </button>
                <button @click="editor.chain().focus().toggleCodeBlock().run()"
                    :class="{ 'is-active': editor.isActive('codeBlock') }">
                    Code block
                </button>
                <button @click="editor.chain().focus().toggleBlockquote().run()"
                    :class="{ 'is-active': editor.isActive('blockquote') }">
                    Blockquote
                </button>
                <button @click="editor.chain().focus().setHorizontalRule().run()">
                    Horizontal rule
                </button>
                <button @click="editor.chain().focus().setHardBreak().run()">
                    Hard break
                </button>
                <button @click="editor.chain().focus().undo().run()"
                    :disabled="!editor.can().chain().focus().undo().run()">
                    Undo
                </button>
                <button @click="editor.chain().focus().redo().run()"
                    :disabled="!editor.can().chain().focus().redo().run()">
                    Redo
                </button>
            </div>
        </div>
        <editor-content :editor="editor" />
    </div>
</template>

<style>
.warning {
    padding: 5px 15px 5px 15px;
    margin: 5px;
    border-width: 10px;
    border-style: solid;
    border-image: repeating-linear-gradient( 45deg, #f00,#f00 3%, #eee 3%, #eee 6%) 10;
}
</style>

<script setup>

import { ref, onMounted, onUpdated, watch, watchEffect } from 'vue';
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { MathExtension } from '@aarkue/tiptap-math-extension';
import { mergeAttributes, Node } from '@tiptap/core';

import Container from './extensions/container.js';
import VueComponent from './MathExtension.js';

import './tiptap.scss';
import 'primeflex/primeflex.css';

let editor = ref(null);

const CustomNode = Node.create({
  name: 'myNode',
  // This node is inline
  group: 'inline',
  inline: true,
  selectable: true,
  atom: true,

  parseHTML() {
    return [
        {
            tag: `div[data-type="${this.name}"]`,
        }
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    const attributes = mergeAttributes({ 'data-type': this.name }, this.options.HTMLAttributes, HTMLAttributes);
    return ['div', attributes, 0 ];
  },
  addCommands() {
    return {
        setMath: () => ({ commands }) => {
            return commands.setNode(this.name);
        },
    }
  },

  // Your code goes here.
});

function debug() {
    console.log('Debug');
    console.log(editor.value.getJSON());
}

onMounted(() => {
    editor.value = new Editor({
        extensions: [
            StarterKit,
            MathExtension,
            Container,
            CustomNode,
            VueComponent,
        ],
        content: `
        <p>Some text.</p>
        <vue-component count="10"></vue-component>
        <p>Some more text.</p>
`,
    });
});

</script>
