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

I ~~like~~ love writing in Markdown.

*Italics* are fun. So is **bold**. And the funnest is ***bold italics***.

Autolinking is fun at: http://www.example.com

## Extensions

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
$\sqrt{3x-1}+(1+x)^2$
