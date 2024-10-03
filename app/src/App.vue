<template>
    <h1>💖 Hello World!</h1>
    <p>Welcome to your flashy Electron application.</p>
    <button @click="number += 1;">Increment</button>
    <p>Clicked {{  number }} times</p>
</template>
  
<script setup>

import { ref } from 'vue';

import './index.css';

let number = ref(0);

</script>
