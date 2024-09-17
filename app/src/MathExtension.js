
import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';

import Component from './Component.vue';

export default Node.create({
    name: 'vueComponent',

    group: 'block',

    addAttributes() {
        return {
            count: {
                default: 0,
            },
            src: {
                default: '',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'vue-component',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['vue-component', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return VueNodeViewRenderer(Component);
    },
});
