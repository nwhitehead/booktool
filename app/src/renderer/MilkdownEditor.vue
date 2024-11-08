<template>
    <Milkdown />
</template>

<script setup>

import { Editor, rootCtx, defaultValueCtx } from '@milkdown/kit/core';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, useEditor } from '@milkdown/vue';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { math } from '@milkdown/plugin-math';

const txt =
`# Milkdown Vue Commonmark

> You're scared of a place where you're needed.

This is a demo for using Milkdown with **Vue**.`

useEditor((root) => {
  return Editor.make()
    .config(nord)
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, txt)
    })
    .use(commonmark)
    .use(math);
});

</script>

