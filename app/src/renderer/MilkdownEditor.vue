<template>
    <Milkdown />
</template>

<script setup lang="ts">

import { Editor, rootCtx, defaultValueCtx } from '@milkdown/kit/core';
import { nord } from '@milkdown/theme-nord';
import { Milkdown, useEditor } from '@milkdown/vue';
import { commonmark } from '@milkdown/kit/preset/commonmark';
import { math } from '@milkdown/plugin-math';
import { InputRule } from "prosemirror-inputrules";
import { $inputRule, $node, $remark } from '@milkdown/kit/utils';
import directive from 'remark-directive';

const remarkDirective = $remark('remarkDirective', () => directive);
const iframeNode = $node('iframe', () => ({
    group: 'block',
    atom: true,
    isolating: true,
    marks: '',
    attrs: {
        src: { default: null },
    },
    parseDOM: [{
        tag: 'iframe',
        getAttrs: (dom) => ({
            src: (dom as HTMLElement).getAttribute('src'),
        }),
    }],
    toDOM: (node: Node) => [
        'iframe',
        {...node.attrs, 'contenteditable': false},
        0,
    ],
    parseMarkdown: {
        match: (node) => node.type === 'leafDirective' && node.name === 'iframe',
        runner: (state, node, type) => {
            state.addNode(type, { src: (node.attributes as { src: string }).src });
        },
    },
    toMarkdown: {
        match: (node) => node.type.name === 'iframe',
        runner: (state, node) => {
            state.addNode('leafDirective', undefined, undefined, {
                name: 'iframe',
                attributes: { src: node.attrs.src },
            });
        },
    },
}));
const inputRule = $inputRule((ctx) => new InputRule(/::iframe\{src\="(?<src>[^"]+)?"?\}/, (state, match, start, end) => {
    const [okay, src = ''] = match;
    const { tr } = state;
    if (okay) {
        tr.replaceWith(start - 1, end, iframeNode.type(ctx).create({ src }));
    }
    return tr;
}));
const iframePlugin = [...remarkDirective, iframeNode, inputRule];

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
    .use(math)
    .use(iframePlugin);
});

</script>

