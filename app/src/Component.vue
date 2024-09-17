
<template>
    <NodeViewWrapper class="vue-component">
        <label contenteditable="false">Vue Component</label>

        <div class="content">
            <div ref="rendered"></div>
            <button @click="increase">
                This button has been clicked {{ node.attrs.count }} times.
            </button>
            <NodeViewContent class="content is-editable" />
        </div>
    </NodeViewWrapper>
</template>

<script setup>

import { ref } from 'vue';
import { nodeViewProps, NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
import katex from 'katex';

import 'katex/dist/katex.min.css';


const props = defineProps(nodeViewProps);
const rendered = ref(null);

function generateMath() {
    return katex;
}

function getNodeContentText(node) {
    let contents = node.content.content;
    if (contents.length === 0) {
        return '';
    }
    return contents[0].text;
}

function increase() {
    props.updateAttributes({
        count: props.node.attrs.count + 1,
    });
    const src = getNodeContentText(props.node);
    katex.render(src, rendered.value, {
        throwOnError: false,
        displayMode: true,
    });
}

</script>
  
<style lang="scss">
:root {
    --purple: rgb(125, 40, 128);
    --light-purple: rgb(212, 103, 216);
    --white: #fff;
}

.tiptap {

    /* Vue component */
    .vue-component {
        background-color: var(--purple-light);
        border: 2px solid var(--purple);
        border-radius: 0.5rem;
        margin: 2rem 0;
        position: relative;

        label {
            background-color: var(--purple);
            border-radius: 0 0 0.5rem 0;
            color: var(--white);
            font-size: 0.75rem;
            font-weight: bold;
            padding: 0.25rem 0.5rem;
            position: absolute;
            top: 0;
        }

        .content {
            margin-top: 1.5rem;
            padding: 1rem;
        }
    }
}
</style>