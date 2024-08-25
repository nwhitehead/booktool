---
title: Book Index
summary: Software to create a professional index for your book.
---

## Overview

This product is a software application that uses artificial intelligence to help you
create a professional index for your book.

## How it works

You supply your book content in PDF format. The software extracts text from your
PDF and builds the index. The final index will be returned to you as additional
PDF pages. You'll also get other convenient formats that can be pasted into your
original book source (formatted text to paste into Microsoft Word, HTML,
Markdown).

The PDF book content you supply will be used for the page numbers and page
ranges in the index. This means the final index will depend on your text
content, input paper size, typefaces, margins, and other layout choices. If
anything changes in your input the index will need to be regenerated to update
page numbers.

To control index generation you can select many options. You can choose your
desired level of detail in the index, desired level of term redundancy, and
choose which indexing conventions to follow. You can provide a list of terms
that must appear in the index, and a list of terms you do not want to appear in
the index.

## Technology

Internally the software works by "reading" your content

## What You Get

### PDF Generation

<img src="/images/book.jpg" alt="PDF generation component" width=300>

The PDF rendering component is a lightning fast engine that takes your content
and produces PDF output.
* Preview as you type
* Regenerate and download updated PDF output whenever needed
* Sensible default values for page size, theme, layout
* Out-of-the-box support for Markdown extensions for common situations
* Setup configuration from within your source
<!--
* Errors and warnings in source content will be shown for debugging but do not stop output generation
-->

### EPUB Generation

The EPUB generation component is also lightning fast. It takes the same content
as the PDF generator but produces sophisticated EPUB documents that work on all
major reading platforms. EPUB allows the reader to resize pages, change margins
and line spacing, and set custom font sizes.
* Preview as you type
* Regenerate and download updated EPUB output whenever needed
* Sensible default values for layout and options
* Out-of-the-box support for Markdown extensions for common situations
* Setup configuration from within your source

### Configuration

<img src="/images/letters.jpg" alt="Typography" width=300>

Book Tool supports configuration of:
* Output page size and orientation
* Typeface size and options
* Typeface selection
* Margins and spacing
* Page color
* Text and decoration colors

Depending on the reader's platform, for EPUB output some configuration choices
may have no effect or may be updated manually by the reader.

### Markdown Features

The Markdown parser used by Book Tool supports the following features and more:
* Classic Markdown: sections, bold, italics, links, etc.
* Standard extensions: tables, strikethrough, lists
* Code blocks with syntax highlighting (291 languages supported)
* Custom content containers with styling (e.g. "Warning" or "Note")
* Footnotes
* Emoji
* Superscript, subscript
* Advanced math
* Inline index marks (for working index with any page size)
* Definition lists

### Examples

Book Tool includes dozens of example projects showing:
* Basic Markdown for simple documents
* Setting page size and options for flashy guides
* Advanced Markdown features
* Supported content types for adding images

### Application

The application itself runs on the following platforms:
* Any computer able to run the Google Chrome browser
* 
