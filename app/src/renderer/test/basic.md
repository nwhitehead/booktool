---
# This is the frontmatter inside the --- fenced block.
# Format is YAML keyword style. Keywords indicate document
# metadata for PDF and EPUB generation.
title: Test Document
subtitle: Demonstration of many features of Nathan's Book Tool
date: 2024-08-19
authors:
    - name: Nathan Whitehead
      affiliations: 
        - Shimmer Math Labs
pagesize: 6x9
theme: basic
typeface: 100%
---

# Main Title

Some text is here. You can also put [links](http://www.example.com/) to URLs and things.
What is (this) magic?

This is `backtick` style.

## Section title

Hopefully this text is looking legible and easy to edit.

!!!style blah.css!!!

I ~~like~~ love writing in Markdown.

*Italics* are fun. So is **bold**. And the funnest is ***bold italics***.

Autolinking is fun at: http://www.example.com

# Extensions

This section title should be a new page.

### Attrs {.bg-primary}

```python
nums = [x for x in range(10)]
print(nums) # Print them out
```

<!-- With bracketed spans -->
What is [the answer]{.bg-primary}?

### Containers

::: spoiler
This is a spoiler container.
:::

Some text.

::: warning
Warning! Don't read the spoiler. Oops...
:::

Some math:
$$\frac{\sqrt{3x-1}}{(1+x)^2} \cdot e^{x^2} - z$$

## Terms

This is a deflist.

Term

: The definition.

Term 2 with *inline markup*

: This is the second term we are defining with *some markup* both in the term
and in the definition. Nice, huh?

## Footnotes

Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

    Subsequent paragraphs are indented to show that they
belong to the previous footnote. More text.

## Implicit Figures

![A placeholder image.](https://dummyimage.com/300x200/000/fff)

## Grid Tables

A sample grid table.


|             |          Grouping           ||
First Header  | Second Header | Third Header |
 ------------ | :-----------: | -----------: |
Content       |          *Long Cell*        ||
Content       |   **Cell**    |         Cell |

New section   |     More      |         Data |
 * one        |                              || \
 * two        |                              ||
And more      | With an escaped '\|'         ||  
[Prototype table]


## Sub and Sup

Water is just H~2~0. What in the heck^swear^ is going on?

## Task Lists

This is a task list:
- [x] Something that is finished
- [ ] Something that is not finished

## Marks

This is something ==marked==.

## Emoji

Full list of names is in [a Github file](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs).

Hello from Mars :satellite:

Emoji test: :laughing: :cry: :moon: :star: :100: :soccer:
:wink:
:kissing_heart:
:flushed:
