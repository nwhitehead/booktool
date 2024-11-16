
import { hyphenate } from 'hyphen/en';
import { texLinebreakDOM } from 'tex-linebreak2';
import { Previewer, Handler } from './pagedjs/src/index.js';

let paged = new Previewer();

document.getElementById('buttonRegister').onclick = function() {

    class MyHandler extends Handler {
        constructor(chunker, polisher, caller) {
            super(chunker, polisher, caller);
        }

        onPageLayout(wrapper, token, layout) {
            console.log(wrapper, token, layout, layout.bounds.width, token.node);
            let elems;
            if (token.node.querySelectorAll) {
                elems = token.node.querySelectorAll('p');
                console.log(elems);
                texLinebreakDOM(elems, {
                    justify: true,
                    stripSoftHyphensFromOutputText: false,
                    updateOnWindowResize: false,
                    lineWidth: 100,
                });    
            }
    }
        // beforePageLayout(page) {
        // }
        // layoutNode(node, layout) {
        //     const width = layout.bounds.width;
        //     if (node.nodeName === 'P') {
        //         console.log('layoutNode', node, layout.bounds.width, layout);
        //         // const gcs = getComputedStyle(node);
        //         const gcs = getComputedStyle(layout.element);
        //         let { width, boxSizing, paddingLeft, paddingRight, textIndent, lineHeight } = getComputedStyle(node);
        //         // console.log('layoutNode', gcs);
        //         texLinebreakDOM(node, {
        //             justify: true,
        //             stripSoftHyphensFromOutputText: false,
        //             updateOnWindowResize: false,
        //             lineWidth: 200,
        //         });
        //     }
        // }
    }
    paged.registerHandlers(MyHandler);
}

document.getElementById('buttonAddHyphens').onclick = async function() {
    const elems = document.querySelectorAll('p');
    for (const elem of elems) {
        elem.innerHTML = await hyphenate(elem.innerHTML);
    }
}

document.getElementById('buttonPaginate').onclick = function() {
    paged.preview();
}
