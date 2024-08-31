<script setup>

import { onMounted, ref } from 'vue';
import { Previewer } from 'pagedjs';

import '/node_modules/github-markdown-css/github-markdown.css';
import '/node_modules/katex/dist/katex.min.css';
import '../test/book.css';

const content = ref(null);

onMounted(() => {
    window.addEventListener('message', (msg) => {
        const { action, payload } = msg.data;
        console.log(`Received action=${action}`);
        if (action == 'update') {
            content.value.innerHTML = payload;
        }
        if (action == 'paged') {
            content.value.innerHTML = payload;
            console.log('Page...');
        }
    });
});

</script>

<template>
    <div ref="content"></div>
</template>
