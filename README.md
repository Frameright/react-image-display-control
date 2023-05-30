[<img src="https://avatars.githubusercontent.com/u/35964478?s=200&v=4" align="right" width="64" height="64">](https://frameright.io)
[![npm version](https://img.shields.io/npm/v/@frameright/react-image-display-control)](https://www.npmjs.com/package/@frameright/react-image-display-control)
[![github actions](https://github.com/AurelienLourot/react-image-display-control/actions/workflows/main.yml/badge.svg)](https://github.com/AurelienLourot/react-image-display-control/actions/workflows/main.yml)

&nbsp;

<!-- Note: make sure all URLs in this document are absolute, and not relative
     within GitHub, as we are publishing this file to NPM and want URLs to
     remain valid there. -->

# Image Display Control React Component

An easy way to retrieve [Image Display Control](https://frameright.io) metadata
out of images. Made with :heart: by [Frameright](https://frameright.io). Power
to the pictures!

## Table of Contents

<!-- toc -->

  * [Overview](#overview)
    + [Without this component](#without-this-component)
    + [Basic usage](#basic-usage)
  * [Image Display Control metadata](#image-display-control-metadata)
  * [Installation](#installation)
  * [Usage](#usage)
  * [Local demo](#local-demo)
  * [Dependency tree / credits](#dependency-tree--credits)
  * [Support](#support)
    + [Supported `img`-like elements and components](#supported-img-like-elements-and-components)
    + [Supported image formats](#supported-image-formats)
    + [Supported environments](#supported-environments)
    + [Supported browsers](#supported-browsers)
  * [Changelog](#changelog)
- [TSDX React User Guide](#tsdx-react-user-guide)
  * [Commands](#commands)
  * [Configuration](#configuration)
    + [Jest](#jest)
    + [Bundle analysis](#bundle-analysis)
      - [Setup Files](#setup-files)
      - [React Testing Library](#react-testing-library)
    + [Rollup](#rollup)
    + [TypeScript](#typescript)
  * [Continuous Integration](#continuous-integration)
    + [GitHub Actions](#github-actions)
  * [Optimizations](#optimizations)
  * [Module Formats](#module-formats)
  * [Deploying the Example Playground](#deploying-the-example-playground)
  * [Named Exports](#named-exports)
  * [Including Styles](#including-styles)
  * [Publishing to NPM](#publishing-to-npm)
  * [Usage with Lerna](#usage-with-lerna)

<!-- tocstop -->

## Overview

This [React](https://react.dev) component extends any `<img>`-like
element/component with the ability to retrieve
[Image Display Control](https://frameright.io) metadata from the image file in
order to automatically and responsively zoom in on the most interesting part of
the image.

### Without this component

When an image is too big for its `<img>` HTML element, the best option browsers
offer nowadays is to use the
[`object-fit: cover;`](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
CSS property in order to scale and middle-crop it:

<img src="https://raw.githubusercontent.com/AurelienLourot/react-image-display-control/main/docs/assets/skater_middlecrop.png" align="right">

```html
<img
  src="https://webc.frameright.io/assets/pics/skater.jpg"
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
retrieve image regions from the image metadata, and to zoom in on the best one
for the current element size:

<img src="https://raw.githubusercontent.com/AurelienLourot/react-image-display-control/main/docs/assets/skater_withidc.png" align="right">

```html
<ImageDisplayControl>
  <img
    src="https://webc.frameright.io/assets/pics/skater.jpg"
    width="200"
    height="200"
  />
</ImageDisplayControl>
```

The resulting HTML element is
[responsive](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
and will automatically reassess the best region to zoom in on when it gets
resized, e.g. when the user turns their phone from portrait to landscape.

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

## Usage

```tsx
// src/MyComponent.tsx

import { ImageDisplayControl } from "@frameright/react-image-display-control";

export default function MyComponent() {
  return (
    <ImageDisplayControl>
      <img
        src="https://webc.frameright.io/assets/pics/skater.jpg"
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
[Advanced usage](https://github.com/AurelienLourot/react-image-display-control/blob/main/docs/usage.md)

## Local demo

To run a local development server that serves the basic demo located in
[`example/`](exanple/), run:

```bash
cd example/
npm build
npm start
```

&emsp; :wrench: [Contributing](https://github.com/AurelienLourot/react-create-display-control/blob/main/docs/contributing.md)

## Dependency tree / credits

## Support

### Supported `img`-like elements and components

### Supported image formats

### Supported environments

### Supported browsers

## Changelog

---

# TSDX React User Guide

Congrats! You just saved yourself hours of work by bootstrapping this project with TSDX. Let’s get you oriented with what’s here and how to use it.

> This TSDX setup is meant for developing React component libraries (not apps!) that can be published to NPM. If you’re looking to build a React-based app, you should use `create-react-app`, `razzle`, `nextjs`, `gatsby`, or `react-static`.

> If you’re new to TypeScript and React, checkout [this handy cheatsheet](https://github.com/sw-yx/react-typescript-cheatsheet/)

## Commands

TSDX scaffolds your new library inside `/src`, and also sets up a [Parcel-based](https://parceljs.org) playground for it inside `/example`.

The recommended workflow is to run TSDX in one terminal:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run the example inside another:

```bash
cd example
npm i # or yarn to install dependencies
npm start # or yarn start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure TSDX is running in watch mode like we recommend above. **No symlinking required**, we use [Parcel's aliasing](https://parceljs.org/module_resolution.html#aliases).

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

### Bundle analysis

#### Setup Files

This is the folder structure we set up for you:

```txt
/example
  index.html
  index.tsx       # test your component here in a demo app
  package.json
  tsconfig.json
/src
  index.tsx       # EDIT THIS
/test
  blah.test.tsx   # EDIT THIS
.gitignore
package.json
README.md         # EDIT THIS
tsconfig.json
```

#### React Testing Library

We do not set up `react-testing-library` for you yet, we welcome contributions and documentation on this.

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### GitHub Actions

One action is added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Deploying the Example Playground

The Playground is just a simple [Parcel](https://parceljs.org) app, you can deploy it anywhere you would normally deploy that. Here are some guidelines for **manually** deploying with the Netlify CLI (`npm i -g netlify-cli`):

```bash
cd example # if not already in the example folder
npm run build # builds to dist
netlify deploy # deploy the dist folder
```

Alternatively, if you already have a git repo connected, you can set up continuous deployment with Netlify:

```bash
netlify init
# build command: yarn build && cd example && yarn && yarn build
# directory to deploy: example/dist
# pick yes for netlify.toml
```

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

## Including Styles

There are many ways to ship styles, including with CSS-in-JS. TSDX has no opinion on this, configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so that it can be imported separately by your users and run through their bundler's loader.

## Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).

## Usage with Lerna

When creating a new package with TSDX within a project set up with Lerna, you might encounter a `Cannot resolve dependency` error when trying to run the `example` project. To fix that you will need to make changes to the `package.json` file _inside the `example` directory_.

The problem is that due to the nature of how dependencies are installed in Lerna projects, the aliases in the example project's `package.json` might not point to the right place, as those dependencies might have been installed in the root of your Lerna project.

Change the `alias` to point to where those packages are actually installed. This depends on the directory structure of your Lerna project, so the actual path might be different from the diff below.

```diff
   "alias": {
-    "react": "../node_modules/react",
-    "react-dom": "../node_modules/react-dom"
+    "react": "../../../node_modules/react",
+    "react-dom": "../../../node_modules/react-dom"
   },
```

An alternative to fixing this problem would be to remove aliases altogether and define the dependencies referenced as aliases as dev dependencies instead. [However, that might cause other problems.](https://github.com/palmerhq/tsdx/issues/64)
