
// Main thread has already added paged.min.js to headless browser context.
// Already detects when it is in a browser context and puts in globalThis.
const { Previewer } = globalThis.PagedModule;

async function main() {
    let paged = new Previewer();
    await paged.preview();
    const page = document.getElementsByClassName('pagedjs_page')[0];
    console.log(`pagesize = ${page.offsetWidth} x ${page.offsetHeight}`);
    globalThis.pagesize = [page.offsetWidth, page.offsetHeight];
    // 794 x 1123 for A4
    // 680 x 680 for 180mm x 180mm
}

main();
