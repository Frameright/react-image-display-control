[<img src="https://avatars.githubusercontent.com/u/35964478?s=200&v=4" align="right" width="64" height="64">](https://frameright.io)
[![npm version](https://img.shields.io/npm/v/@frameright/react-image-display-control)](https://www.npmjs.com/package/@frameright/react-image-display-control)
[![github actions](https://github.com/Frameright/react-image-display-control/actions/workflows/main.yml/badge.svg)](https://github.com/Frameright/react-image-display-control/actions/workflows/main.yml)

&nbsp;

<!-- Note: make sure all URLs in this document are absolute, and not relative
     within GitHub, as we are publishing this file to NPM and want URLs to
     remain valid there. -->

# Image Display Control React Component

An easy way to do [Image Display Control](https://frameright.io) in your React
web app. Made with :heart: by [Frameright](https://frameright.io). Power
to the pictures!

&emsp; :sparkles: [Live mobile demo](https://react.frameright.io)

## Table of Contents

<!-- toc -->

- [Overview](#overview)
  * [Without this component](#without-this-component)
  * [Basic usage](#basic-usage)
- [Image Display Control metadata](#image-display-control-metadata)
- [Installation](#installation)
- [Usage](#usage)
- [Local demo](#local-demo)
- [Dependency tree / credits](#dependency-tree--credits)
- [Support](#support)
  * [Supported environments](#supported-environments)
  * [Supported `img`-like elements and components](#supported-img-like-elements-and-components)
  * [Supported image formats](#supported-image-formats)
  * [Supported browsers](#supported-browsers)
- [Changelog](#changelog)

<!-- tocstop -->

## Overview

This [React](https://react.dev) component extends any `<img>`-like
element/component with the ability to retrieve
[Image Display Control](https://frameright.io) metadata from its image file in
order to automatically and responsively zoom in on the most interesting part of
the image.

&emsp; :sparkles: [Live mobile demo](https://react.frameright.io)

&emsp; :bulb: [GitHub Discussions](https://github.com/Frameright/react-image-display-control/discussions)

> **NOTE**: if you are not using React, you may want to have a look at the
> [Image Display Control Web component](https://github.com/Frameright/image-display-control-web-component)
> instead.

### Without this component

When an image is too big for its `<img>` HTML element, the best option browsers
offer nowadays is to use the
[`object-fit: cover;`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
CSS property in order to scale and middle-crop it:

<img src="https://raw.githubusercontent.com/Frameright/react-image-display-control/main/docs/assets/skater_middlecrop.png" align="right">

```html
<img
  src="https://react.frameright.io/assets/pics/skater.jpg"
  width="200"
  height="200"
  style="object-fit: cover;"
/>
```

This is less than optimal, as there might be, in the example above, a better
square-ish region in the image that could be displayed instead of the
middle-crop.

### Basic usage

This React component extends its `<img>`-like children with the ability to
retrieve image regions from their image metadata, and to zoom in on the best one
for the current element size:

<img src="https://raw.githubusercontent.com/Frameright/react-image-display-control/main/docs/assets/skater_withidc.png" align="right">

```html
<ImageDisplayControl>
  <img
    src="https://react.frameright.io/assets/pics/skater.jpg"
    width="200"
    height="200"
  />
</ImageDisplayControl>
```

The resulting HTML element is
[responsive](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
and will automatically reassess the best region to zoom in on when it gets
resized, e.g. when the user turns their phone from portrait to landscape.

&emsp; :sparkles: [Live mobile demo](https://react.frameright.io)

&emsp; :bulb: [GitHub Discussions](https://github.com/Frameright/react-image-display-control/discussions)

## Image Display Control metadata

Nowadays an image file (e.g. JPEG, PNG) can contain this type of image regions
in their metadata according to
[the IPTC standard](https://iptc.org/std/photometadata/specification/IPTC-PhotoMetadata#image-region).
This React component uses
[a  library](https://github.com/Frameright/image-display-control-metadata-parser)
to let the back-end or front-end extract the regions from the image file. It
then passes them to the `<img>` tag and turns it into
[a web component](https://github.com/Frameright/image-display-control-web-component),
which automatically and responsively zooms in on the best region.

Photographers, or anyone else, can use the
[Frameright app](https://frameright.app/) to define and store image regions in
the metadata of their pictures.

## Installation

In your [Node.js](https://nodejs.org/en)-based project (e.g. using
[Next.js](https://nextjs.org/) or [Vite](https://vitejs.dev/)) run:

```bash
npm install @frameright/react-image-display-control
```

&emsp; :floppy_disk:
[Importing in your project](https://github.com/Frameright/react-image-display-control/blob/main/docs/explanation/importing.md)

## Usage

```tsx
// src/MyComponent.tsx

import { ImageDisplayControl } from "@frameright/react-image-display-control";

export default function MyComponent() {
  return (
    <ImageDisplayControl>
      <img
        src="https://react.frameright.io/assets/pics/skater.jpg"
        width="200"
        height="200"
      />
    </ImageDisplayControl>
  );
}
```

This doesn't change the structure of the resulting DOM, i.e.:
* the `<img>` tag remains an `<img>` tag, and
* no new parent elements are added around it, so
* the CSS rules that used to target the `<img>` tag directly will still apply,
  and
* the `<img>` tag will still naturally take the same space and position in the
  layout.

Other `<img>`-like elements/components are supported as well, e.g.
[Next.js `<Image>`s](https://nextjs.org/docs/api-reference/next/image) or
[React-Bootstrap `<Image>`s](https://react-bootstrap.github.io/components/images/).

&emsp; :airplane:
[Advanced usage](https://github.com/Frameright/react-image-display-control/blob/main/docs/usage.md)

## Local demo

To run a local development server that serves the basic demo located in
[`example/`](exanple/), run:

```bash
cd example/
./clean-build-and-run.sh
```

&emsp; :wrench: [Contributing](https://github.com/Frameright/react-create-display-control/blob/main/docs/contributing.md)

&emsp; :bulb: [GitHub Discussions](https://github.com/Frameright/react-image-display-control/discussions)

&emsp; :sparkles: [Live mobile demo](https://react.frameright.io)

## Dependency tree / credits

- [Frameright Image Display Control web component](https://github.com/Frameright/image-display-control-web-component/)
    - [ungap/custom-elements](https://github.com/ungap/custom-elements), a polyfill
      for web components on Safari. Many thanks to
      [WebReflection](https://github.com/WebReflection)!
- [Frameright Image Display Control metadata parser](https://github.com/Frameright/image-display-control-metadata-parser/)
    - [mattiasw/ExifReader](https://github.com/mattiasw/ExifReader). Many thanks
      to [mattiasw](https://github.com/mattiasw)!
    - [image-size](https://github.com/image-size/image-size). Many thanks to
      [netroy](https://github.com/netroy)!
- [uuid](https://github.com/uuidjs/uuid)
- [React](https://react.dev/) >= 16

## Support

### Supported environments

Any [Node.js](https://nodejs.org/en)-based, [React](https://react.dev/)-based
bundled environment, with or without
[server-side rendering](https://github.com/Frameright/react-image-display-control/blob/main/docs/explanation/ssr.md),
should be supported. We have validated:

* [Vite](https://vitejs.dev/) 4.3.2,
* [vite-plugin-ssr](https://vite-plugin-ssr.com/) 0.4.124,
* [Next.js](https://nextjs.org/) 13.4.1.

### Supported `img`-like elements and components

Any direct child of `<ImageDisplayControl>` that behaves like an `<img>` element
and has an `src=` attribute should be supported. We have validated:

* `<img>` elements,
* [Next.js `<Image>`](https://nextjs.org/docs/api-reference/next/image)
  components,
* [React-Bootstrap `<Image>`](https://react-bootstrap.github.io/components/images/)
  components.

### Supported image formats

Image formats that are both commonly supported by browsers and supported by the
[Frameright Image Display Control metadata parser](https://github.com/Frameright/image-display-control-metadata-parser)
should be supported. We have validated JPEG, PNG and WebP.

### Supported browsers

The browsers supported by the
[Frameright Image Display Control web component](https://github.com/Frameright/image-display-control-web-component/)
are supported:

* Chrome 64+ (2018)
* Firefox 69+ (2019)
* Safari 15.4+ (2022)

More support can be achieved with a few tweaks:

&emsp; :mag: [Browser support](https://github.com/Frameright/image-display-control-web-component/blob/main/image-display-control/docs/explanation/browsers.md)

## Changelog

**1.0.2** and **1.0.3** (2023-06-11):
  * Fixed `import()`-related race condition leading to image regions not being
    found.

**1.0.1** (2023-06-09):
  * Fixed link on NPM.

**1.0.0** (2023-06-09):
  * Implemented the `data-path-on-server="none"` attribute to disable warnings
    when the image is not found while performing
    [server-side rendering](https://github.com/Frameright/react-image-display-control/blob/main/docs/explanation/ssr.md)
    or static site generation.

**0.0.1** (2023-05-31):
  * Initial version.
