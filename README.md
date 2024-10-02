# BookTool

This is a standalone webapp for creating books.

Idea is you write your book in Markdown, the app converts it to PDF and epub.

## References

Atticus is the main inspiration. Looks fun.

* https://www.atticus.io/

How do you generate EPUB from HTML?

* https://iangmcdowell.com/blog/posts/laying-out-a-book-with-css/

Software for making browsers follow paged CSS styles.

* https://pagedjs.org/documentation/2-getting-started-with-paged.js/#starting-paged.js

Markdown for slides open source system:

* https://marp.app/

## Architecture

Unfortunately generating PDF from JS in the frontend is not reliable enough. I
tried to use paged.js with tools such as jsPDF but it is not adequate to the
task. Need puppeteer to do headless chrome to be consistent with PDF generation
from HTML.

Basic architecture is the application is a local-only app that is an `electron`
app. There is a `node` server that serves up `Vue` UI pages. The server can do
`puppeteer` calls to a headless chrome to generate the actual PDF as needed
locally. This way the UI can be consistent with webtech, no book data leaks to
any external servers, and local files are easy to use.

## Organization

Subirectories:
* `app` - Contains local application as an electron/Vue app
* `website` - Content for website as `hugo` site

## Things to do

[ ] CodeMirror editor working on Markdown
[ ] Markdown rendering to HTML
[ ] Support frontmatter in Markdown
[ ] Render frontmatter in HTML
[ ] Allow images and other includes (how?)
[ ] Support: code blocks with syntax highlighting
[ ] Support: subscript
[ ] Support: superscripts
[ ] Support: strikethrough
[ ] Support: footnotes
[ ] Support: header anchors
[ ] Support: custom containers with styling
[ ] Support: mark
[ ] Support: deflist
[ ] Support: abbreviations
[ ] Support: math
[ ] Support: everything in https://github.com/mb21/markdown-it-pandoc
[ ] Generate TOC from source
[ ] Generate PDF
[ ] PDF page sizes
[ ] PDF options
[ ] PDF themes
[ ] PDF fonts

## Services

This project uses the following services:
* [Namecheap](https://www.namecheap.com/) for `shimmermathlabs.com` domain registration.
* [Vultr](https://www.vultr.com/) for web server hosting
<!-- * [Supabase](https://supabase.com/) for backend database hosting -->

And of course this project uses *lots* of NPM packages, including `markdown-it` and plugins, and `pagedjs`.
