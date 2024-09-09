

<template>
    <button @click="toMarkdown">toMarkdown</button>
    <button @click="fromMarkdown">fromMarkdown</button>
    <div v-if="editor" class="container">
        <div class="control-group">
            <div class="button-group">
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
    <textarea v-model="markdown" class="w-full h-12rem"></textarea>
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
import { Markdown } from 'tiptap-markdown';
import { MathExtension } from '@aarkue/tiptap-math-extension';

import Container from './extensions/container.js';

import 'katex/dist/katex.min.css';
import './tiptap.scss';
import 'primeflex/primeflex.css';

let editor = ref(null);
let markdown = ref(null);

function toMarkdown() {
    if (!editor.value) {
        return;
    }
    markdown.value = editor.value.storage.markdown.getMarkdown();
}

function fromMarkdown() {
    if (!editor.value) {
        return;
    }
    editor.value.commands.setContent(markdown.value);
}

onMounted(() => {
    editor.value = new Editor({
        extensions: [
            StarterKit,
            Markdown.configure({
                transformPastedText: true,
                transformCopiedText: true,
                escape: false,
            }),
            MathExtension,
            Container,
        ],
        content: `
## Hi there,

:::warning
This is a warning.
:::

this is a *basic* example of **Tiptap**. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
* That's a bullet list with one …
* … or two list items.

Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
\`\`\`css
body {
    display: none;
}
\`\`\`

Some math:

$$x^2+y^2=z^2$$

I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.

>   Wow, that’s amazing. Good work, boy! 👏
>
>   — Mom
`,
    });
    toMarkdown();
});

// onUpdated(() => {
//     updateMarkdown();
// });

// watch(markdown, () => {
//     if (!editor.value) {
//         return;
//     }
//     console.log(`watch markdown changed`);
//     editor.value.commands.setContent(markdown.value);
// });

</script>
