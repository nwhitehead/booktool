
<template>
    <NodeViewWrapper class="vue-component">
        <span class="content flex flex-column" @click="editing = true">
            <div v-show="!editing" ref="rendered"></div>
            <textarea v-if="editing" v-model="src"></textarea>
            <button v-if="editing" @click.stop="editing = false">Show</button>
        </span>
    </NodeViewWrapper>
</template>

<script setup>

import { onMounted, ref, watch } from 'vue';
import { nodeViewProps, NodeViewContent, NodeViewWrapper } from '@tiptap/vue-3'
import katex from 'katex';

import 'katex/dist/katex.min.css';

const props = defineProps(nodeViewProps);
const rendered = ref(null);
const src = ref('');
const editing = ref(true);

onMounted(() => {
    watch(editing, () => {
        props.updateAttributes({ src: src.value });
        katex.render(props.node.attrs.src, rendered.value, {
            throwOnError: false,
            displayMode: true,
        });
    });
});

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
        margin: 0;
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