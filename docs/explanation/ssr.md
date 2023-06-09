# Server-side rendering and static site generation

&emsp; :bulb: [GitHub Discussions](https://github.com/Frameright/react-image-display-control/discussions)

## Table of Contents

<!-- toc -->

- [In any environment](#in-any-environment)
- [In Next.js](#in-nextjs)

<!-- tocstop -->

If your environment supports it, React will not only render the component in the
browser but also:

* on the server during
  [server-side rendering](https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering),
  or even
* at build time, on the machine used for building your app, during
  [static site generation](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation).

This is the case with [Next.js](https://nextjs.org/) or
[vite-plugin-ssr](https://vite-plugin-ssr.com/) for example.

## In any environment

In the browser, the component will fetch the Image Regions from the image
pointed to by the `src=` attribute. On server or at build time however, the
component can't do the same because:

* The URL may not be accessible from the server or build machine.
* The component is expected to render synchronously (i.e. without asynchronous
  network requests).

For this reason the component needs to know where to find the image file on
disk, so that it can read the Image Regions from its metadata already at
build time or during server-side rendering. This can be achieved by setting
the `data-path-on-server=` property on the component's `<img>`-like children.

This looks like this:

```tsx
// /src/MyApp.tsx

// npm install @frameright/react-image-display-control
import { ImageDisplayControl } from "@frameright/react-image-display-control";

// In Vite (+ SSR), a static import to an image yields a string containing the
// URL of the image accessible from the browser.
import skaterUrl from "./assets/skater.jpg";

const isServer = typeof window === "undefined";
const skaterPathOnServer = isServer
  ? process.cwd() + "/src/assets/skater.jpg"
  : null;

export function MyApp() {
  return (
    <ImageDisplayControl>
      <img
        src={skaterUrl}
        data-path-on-server={skaterPathOnServer}
        alt="Skater"
      />
    </ImageDisplayControl>
  );
}
```

If you don't provide a `data-path-on-server=` property, the component will issue
a warning at build time or during server-side rendering pointing at this
documentation. To disable this warning, please pass
`data-path-on-server="none"`.

## In Next.js

In Next.js, static imports to images result in an object of type
[`StaticImageData`](https://github.com/vercel/next.js/blob/canary/packages/next/src/client/image.tsx#L62),
accepted as value for the `src=` property of the
[`<Image>`](https://nextjs.org/docs/api-reference/next/image) component.

This allows us to provide some syntactic sugar: instead of passing a
`data-path-on-server=` property, you can set a `pathOnServer` property on the
`StaticImageData` object. This looks like this:

```tsx
// /pages/MyPage.tsx

import Image from "next/image";

// npm install @frameright/react-image-display-control
import { ImageDisplayControl } from "@frameright/react-image-display-control";

// In Next.js, a static import to an image yields a StaticImageData object.
import skater from "../images/skater.jpg";
skater["pathOnServer"] = process.cwd() + "/images/skater.jpg";

export default function MyPage() {
  return (
    <ImageDisplayControl>
      <Image
        src={skater}
        alt="Skater"
      />
    </ImageDisplayControl>
  );
}
```
