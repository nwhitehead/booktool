//!
//! App
//!
//! A Vue component representing the top level single-page app.
//!

<template>
    <section class="section">
        <h1>The App</h1>
        <div>
            <Codemirror
                v-model="localModelValue"
                :indent-with-tab="true"
                :tab-size="4"
                :extensions="[]"
                :disabled="false"
                @update:modelValue="newValue => { localModelValue = newValue; $emit('update:modelValue', newValue); }"
                @ready="handleReady"
            />
        </div>
    </section>
</template>

<script setup>

import { ref } from 'vue';
import { Codemirror } from 'vue-codemirror';

let localModelValue = ref('put stuff here');

function handleReady(event) {
    console.log('CodeMirror is ready.');
}

</script>
