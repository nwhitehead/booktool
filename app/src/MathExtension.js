
import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';

import Component from './Component.vue';

export default Node.create({
    name: 'math',

    group: 'block',

    addAttributes() {
        return {
            src: {
                default: '',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'math',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['math', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return VueNodeViewRenderer(Component);
    },
});
