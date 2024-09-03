<template>
    <button @click="clicked">Change</button>
    <div class="myPage" v-for="(pageContent, index) in pages" :key="index">
        <div v-html="pageContent"></div>
    </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';

const pages = ref([]);

function clicked() {
    console.log('click!');
    pages.value.push('<h1>Page 4</h1><p>More content for page 4.</p>');
    console.log(pages);
}

// Generate content for pages
function generateContent() {
    console.log('generateContent');
    // Simulated content for demonstration
    const content = [
        "<h1>Page 1</h1><p>This is content for page 1.</p>",
        "<h1>Page 2</h1><p>This is content for page 2.</p>",
        "<h1>Page 3</h1><p>This is content for page 3.</p>"
    ];
    pages.value = content;
}

generateContent();

onMounted(() => {
    // console.log('mounted');
    // let newstyle = document.createElement('style');
    // newstyle.innerHTML = rawStyle;
    // document.getElementsByTagName('head')[0].appendChild(newstyle);
    window.PagedPolyfill.preview();
});

</script>
