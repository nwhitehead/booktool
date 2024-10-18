
// Main thread has already added paged.min.js to headless browser context.
// Already detects when it is in a browser context and puts in globalThis.
const { Previewer } = globalThis.PagedModule;

async function paginate() {
    // Paginate contents, return page size in pixels
    let paged = new Previewer();
    // Call with default arguments, just paginates everything and replaces body
    await paged.preview();
    // Get page size by looking at offsetWidth and height of first page
    const page = document.getElementsByClassName('pagedjs_page')[0];
    console.log(`pagesize = ${page.offsetWidth} x ${page.offsetHeight}`);
    return [page.offsetWidth, page.offsetHeight];
}
