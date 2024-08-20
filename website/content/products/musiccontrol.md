---
title: Music Control
summary: A package for Godot to play MIDI files and play SoundFonts (sf2 files).
params:
    icon: 'Hi'
---

## Overview

This product is a package for using MIDI files and SoundFonts in the Godot
engine. It includes a realtime audio rendering component for rendering MIDI
events using a provided SoundFont.

Using this product lets you create advanced music games and tools using Godot.

## What You Get

### Audio rendering component

<img src="/images/cppcode.png" alt="Audio Rendering Code" width=300>

The audio rendering component is a GDExtension written in C++ that handles
audio synthesis and event scheduling. The audio renderer is capable of low
latency output and can place events at precise sample positions in the output.
The renderer runs in a separate Godot audio thread and uses lock-free algorithms
for low latency and predictable performance without glitches.

### MIDI parser

<img src="/images/midi.png" alt="Representation of MIDI file" width=300>

The MIDI parser lets you import MIDI files to your Godot project. The imported
object is a simple GDScript array of events. Advanced features of MIDI file
format are supported as extended events which can be processed or easily
ignored.

### SoundFont player
<img src="/images/waveform.png" alt="Waveform of piano note" width=300>

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
