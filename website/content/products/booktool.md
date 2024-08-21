---
title: Book Tool
summary: Simple software for creating books from Markdown.
---

## Overview

This product is an application that creates books in PDF and EPUB format from
your content written in Markdown. Can be used for all kinds of content from
technical manuals, academic reports, informational guides, and general fiction.

## What You Get

### PDF Generation

<img src="/images/book.jpg" alt="PDF generation component" width=300>

The PDF rendering component is a lightning fast engine that takes your content
and produces PDF output.
* Preview as you type
* Regenerate and download updated PDF output whenever needed
* Sensible default values for page size, theme, layout
* Out-of-the-box support for Markdown extensions for common situations
* Setup configuration from within your source, no complicated menus
<!--
* Errors and warnings in source content will be shown for debugging but do not stop output generation
-->


### Configuration

<img src="/images/letters.jpg" alt="Typography" width=300>

Book Tool supports configuration of:
* Ouptut page size and orientation
* Typeface size and options
* Typeface selection
* Margins and spacing
* Page color
* Text and decoration colors

### Markdown Features

The Markdown parser used by Book Tool supports the following features and more:
* Classic Markdown (sections, bold, links, etc.)
* Github Flavored Markdown features: tables, strikethrough, task lists
* 

### Examples

Book Tool includes dozens of example projects showing:
* Basic Markdown for simple documents
* Setting page size and options for flashy guides
* Advanced Markdown features

The SoundFont player lets you import SoundFont instruments into Godot and use
them to play MIDI events. The player supports loading `.sf2`, `.sf3`, and `.sfo`
file formats. Each file can contain multiple instruments and multiple samples
per instrument.

### Demonstration Projects

The demonstration projects show off the capabilities of the product. The first
project plays a MIDI file with in-game controls for adjusting instruments,
tempo, and other parameters. It also allows the user to play a virtual keyboard
along with the music. A second project is a rhythm game demonstration showing
how to combine a song in MP3 format with MIDI events that indicate game events.

### Documentation

The documentation includes API-level descriptions of the classes, methods, and
variables provided by the product. Also included are a setup and installation
guide and an extensive user manual that covers many different use case
scenarios.

### Source Code

You get full source code to everything, including C++ renderer code and
GDScript interface code.

## Technical Specifications

The audio renderer component:
* Uses 32-bit floating point sample format
* Compatible with 22.05kHz, 44.1kHz, 48kHz, and 96kHz samplerates
* Pre-compiled for:
    * Windows (32-bit)
    * Windows (64-bit)
    * MacOS (Universal)
    * iOS (Universal)
    * Android (ARM 32-bit)
    * Android (ARM 64-bit)
    * Linux x86 (64-bit)

The SoundFont player supports:
* `.sf2`, `.sf3`, and `.sfo` formats
* Unlimited logical channels
* Up to 1024 simultaneous voices
* Realtime waveform pitch resampling with quality levels:
    * Linear interpolation (default)
    * Cubic Hermite polynomial interpolation
    * 2x oversampling with sinc interpolation
* Multiple player objects in a scene
* Immediate mode interface for sending events with lowest latency
* Scheduled events for sample-precise positioning in output
