
import { hyphenate } from 'hyphen/en';
import { texLinebreakDOM } from 'tex-linebreak2';
import { Previewer } from 'pagedjs';

let paged = new Previewer();

async function addHyphens() {
    const elems = document.querySelectorAll('p');
    for (const elem of elems) {
        elem.innerHTML = await hyphenate(elem.innerHTML);
    }
}

function linebreak() {
    texLinebreakDOM('#src', { justify: true, updateOnWindowResize: false });
}

function paginate() {
    globalThis.PagedPolyfill.preview();
}

function register() {
    class MyHandler extends Paged.Handler {
        constructor(chunker, polisher, caller) {
            super(chunker, polisher, caller);
        }

        // beforePageLayout(page) {
        //     const { texLinebreakDOM } = globalThis.texLinebreak;
        //     console.log(page.width);
        //     texLinebreakDOM(document.getElementById('src').querySelectorAll('p'), { justify: true, updateOnWindowResize: false });

        //     // const ps = node.querySelectorAll('p');
        //     // console.log(node.nodeName, node, ps[0]);
        //     // console.log(page, page.endToken);
        //     // if (node.nodeName === 'P') {
        //     //     console.log('layoutNode', node, node.offsetWidth, node.offsetHeight);
        //     //     texLinebreakDOM([node], { justify: true, stripSoftHyphensFromOutputText: false, updateOnWindowResize: false });
        //     // }
        // }
        layoutNode(node) {
            if (node.nodeName === 'P') {
                console.log('layoutNode', node);
                texLinebreakDOM(node, { justify: true, stripSoftHyphensFromOutputText: false, updateOnWindowResize: false, lineWidth: 162.44 });
            }
    }
    }
    Paged.registerHandlers(MyHandler);
}

document.getElementById('buttonAddHyphens').onclick = function() {
    addHyphens();
}

document.getElementById('buttonPaginate').onclick = function() {
    paged.preview();
}
