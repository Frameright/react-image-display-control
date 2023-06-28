# Supported environments

## Supported web frameworks

Any [Node.js](https://nodejs.org/en)-based, [React](https://react.dev/)-based
bundled environment, with or without
[server-side rendering](https://github.com/Frameright/react-image-display-control/blob/main/docs/explanation/ssr.md),
should be supported. We have validated:

* [Vite](https://vitejs.dev/) 4.3.2,
* [vite-plugin-ssr](https://vite-plugin-ssr.com/) 0.4.124,
* [Next.js](https://nextjs.org/) 13.4.1.

## Supported `<img>`-like elements and components

Any direct child of `<ImageDisplayControl>` that behaves like an `<img>` element
and has an `src=` attribute should be supported. We have validated:

* `<img>` elements,
* [Next.js `<Image>`](https://nextjs.org/docs/api-reference/next/image)
  components,
* [React-Bootstrap `<Image>`](https://react-bootstrap.github.io/components/images/)
  components.

## Supported image formats

Image formats that are both commonly supported by browsers and supported by the
[Frameright Image Display Control metadata parser](https://github.com/Frameright/image-display-control-metadata-parser)
should be supported. We have validated JPEG, PNG and WebP.

## Supported browsers

The browsers supported by the
[Frameright Image Display Control web component](https://github.com/Frameright/image-display-control-web-component/)
are supported:

* Chrome 64+ (2018)
* Firefox 69+ (2019)
* Safari 15.4+ (2022)

More support can be achieved with a few tweaks:

&emsp; :mag: [Browser support](https://github.com/Frameright/image-display-control-web-component/blob/main/image-display-control/docs/explanation/browsers.md)
