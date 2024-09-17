
<template>
    <NodeViewWrapper class="math">
        <span class="content flex flex-column" @click="editing = true">
            <div v-show="!editing" ref="rendered"></div>
            <textarea v-if="editing" v-model="src"></textarea>
            <button v-if="editing" @click.stop="editing = false">Show</button>
        </span>
    </NodeViewWrapper>
</template>

<script setup>

import { onMounted, ref, watch } from 'vue';
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import katex from 'katex';

import 'katex/dist/katex.min.css';

const props = defineProps(nodeViewProps);
const rendered = ref(null);
const src = ref('');
const editing = ref(true);

onMounted(() => {
    watch(editing, () => {
        console.log(props.selected);
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

    .math {
        background-color: var(--purple-light);
        border: 2px solid var(--purple);
        border-radius: 0.5rem;
        margin: 0;
        position: static;

        .content {
            margin-top: 1.5rem;
            padding: 1rem;
        }
    }
}
</style>