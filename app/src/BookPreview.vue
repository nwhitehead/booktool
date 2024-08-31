<script setup>

import { onMounted, ref } from 'vue';
import { Previewer } from 'pagedjs';
//import '/node_modules/pagedjs/dist/paged.polyfill.min.js';
import '/node_modules/github-markdown-css/github-markdown.css';
import '/node_modules/katex/dist/katex.min.css';
import '../test/book.css';
import bookCssUrl from '../test/book.css?url';

const content = ref(null);

onMounted(() => {
    window.addEventListener('message', async (msg) => {
        const { action, payload } = msg.data;
        console.log(`Received action=${action}`);
        if (action == 'update') {
            content.value.innerHTML = payload;
        }
        if (action == 'paged') {
            console.log('Page...');
            let paged = new Previewer();
            content.value.innerHTML = '';
            const flow = await paged.preview(payload, [], content.value);
            console.log(`Rendered ${flow.total} pages.`);
        }
    });
});

</script>

<style>
@media screen {

p {
    background-color: #ff0;
}
    
@page {
    size: A4;
}

@page {
    margin: 0mm 0mm;
}

}

</style>

<template>
    <div>
        <div ref="content"></div>
    </div>
</template>
