<script setup>

import { onMounted, ref } from 'vue';

import '/node_modules/github-markdown-css/github-markdown.css';
import '/node_modules/katex/dist/katex.min.css';
import '../test/book.css';

const content = ref(null);

onMounted(() => {
    window.addEventListener('message', (msg) => {
        console.log('Received', msg.data);
        const { action, payload } = msg.data;
        if (action == 'update') {
            content.value.innerHTML = payload;
        }
    });
});

</script>

<template>
    <div ref="content"></div>
</template>
