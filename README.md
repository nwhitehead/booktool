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

## Storage

Some ideas for storage:
1. Use local files, watch for changes from app, no version control, let user do
   version control themselves outside app if desired
2. Use local files, watch for changes from app, keep track of all versions seen
   internally (somehow)
3. Use local files, read git archive file directly, commit changes to local git
   file
4. Use db locally, export/import to/from local files is special step if needed
5. Use json locally, export/import to/from local files is special step

I guess questions are: should local files be real source of truth? I think the
answer should be yes. The book tool is responsible for creating books, user
might often want to edit the text using other tools. User might want to use
version control outside the tool itself.

Next question is should book tool keep track of versions? Again I think the
answer is yes. Many users will not have version control tooling set up, at least
at first. Unacceptable to lose user work because they accidentally edit file to
erase things and save it.

Does the file versioning need to be full version control? I think the answer is
no, I don't see a need to have full version control tools for automatic save
functionality. Maybe as a special extra feature export the saved version info as
a git repo, but that is a "nice to have" feature. Essential functionality is to
have access to old versions of files, especially last saved version before long
time of no changes.

Is it OK for version history to be linear? The problem would be if user reverts
to older version, then decides they want to look at history. Should it show
branches between old updated version, and abandoned fork. Or should it just show
linear history of what files where over time? I think linear is easier,
alternate history is helpful for complicated scenarios. For writing, mostly old
versions are useful for copying out deleted things and bringing them to present.
Or reverting everything to old working state before a bunch of bad changes were
made.

So I think the decisions that make sense are these:
* Primary source of truth is text files in a local directory. That is the
current state of the project.
* App watches text files for changes. User can change the files with other
editors and things.
* App keeps track of history of directory. User can explore back in time, copy
content from old versions, and revert back to old versions.
* History is always linear. There is just a sequence of project states with
timestamps and optional notes. No branches.
* User can see diffs and changes between versions, but cannot create branches
or rewrite history.
* If user is using version control outside of the app, the linear history
version control is just a backup and doesn't matter. Can be turned off if
needed.

What is the best way to keep track of directory state and record old versions?
Could use `isomorphic-git`, but that might be too much. Probably easier to just
do snapshots. Might be harder to compute diffs and do tooling that way, not
sure. Storage is probably easier with `isomorphic-git` since we don't have to
store more than deltas (classic version control problems already solved).

## Book Contents

User has a directory full of Markdown files for chapters, along with some extra
files like CSS styles, example code to be included with syntax highlighting, and
images in hires.

While working on writing, user probably just renders and converts one chapter at
a time. Looks at one Markdown file that might include other content
(non-Markdown).

For the final book, there needs to be a way to include global options, paste
together all the chapters, and add in CSS styles and things. Markdown itself
doesn't have this. Plugins can do some of this.

One idea is to use `frontmatter` as a way of setting global options. Then maybe
just need a way to include Markdown from another Markdown file.

Decision is: look for short list of standard entrypoints, `main.md`, `index.md`
and so on. These can then include other `md` files. The include is with
`!!!include...!!!` syntax.

CSS styles are set by indicating which CSS files to load from the frontmatter.
It's hard to include CSS directly from the Markdown text because `paged.js`
needs the CSS split out.

One final remaining issue is that user might want multiple CSS files for
different purposes. One might set paper size, another handles code syntax
highlighting choices, and so on. Ideally you could do multiple frontmatters
but I don't think that is allowed.

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
