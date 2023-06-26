# HTML attributes and React properties

&emsp; :bulb: [GitHub Discussions](https://github.com/Frameright/react-image-display-control/discussions)

## Table of Contents

<!-- toc -->

- [`img`-like children's attributes and properties](#img-like-childrens-attributes-and-properties)
  * [Standard attributes and properties](#standard-attributes-and-properties)
    + [`src=` attribute](#src-attribute)
    + [`is=` attribute](#is-attribute)
    + [`sizes=` and `style=` attributes](#sizes-and-style-attributes)
    + [`class=` and `className=` properties](#class-and-classname-properties)
  * [Additional attributes and properties](#additional-attributes-and-properties)
    + [Standard web component `data-*=` attributes](#standard-web-component-data--attributes)
      - [`data-image-regions=` attribute](#data-image-regions-attribute)
    + [Additional properties](#additional-properties)
      - [`data-path-on-server=` property](#data-path-on-server-property)
      - [Internal properties](#internal-properties)
- [`ImageDisplayControl` component's properties](#imagedisplaycontrol-components-properties)
- [Parent DOM element's attributes](#parent-dom-elements-attributes)

<!-- tocstop -->

Attributes and properties can be set at three different levels:

```jsx
<div
  data-idc-parent
  style={{ contain: 'paint' }}
>                                   {/* on the parent DOM element */}
  <ImageDisplayControl data-debug>  {/* on the <ImageDisplayControl> component */}
    <img                            {/* on the <img>-like direct children */}
      src="https://react.frameright.io/assets/pics/skater.jpg"
      alt="Skater"
      data-avoid-no-region="off"
    />
  </ImageDisplayControl>
</div>
```

## `img`-like children's attributes and properties

### Standard attributes and properties

Keep using the attributes and properties of the child as you would otherwise,
whether it is a stock `<img>` element or, for example, a Next.js `<Image>`
component. With a few caveats:

#### `src=` attribute

The `src=` attribute is supported and mandatory. The `<ImageDisplayControl>`
component will read it:

* in order to determine if the child is an `img`-like child,
* in order to parse the image's metadata containing the Image Regions.

> **NOTE**: if the `src=` attribute points to another domain as the one hosting
> the page, make sure that the server hosting the image allows
> [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

#### `is=` attribute

The `<ImageDisplayControl>` component will set the `is="image-display-control"`
attribute on all its `<img>`-like direct children, in order to turn them into
[Image Display Control web components](https://github.com/Frameright/image-display-control-web-component).

#### `sizes=` and `style=` attributes

The web component will then responsively tweak the `sizes=` and `style=`
attributes in the browser, extending anything you might have already set. See
the web component's attribute
[documentation](https://github.com/Frameright/image-display-control-web-component/blob/main/image-display-control/docs/explanation/attributes.md)
for more details.

> **NOTE**: we are setting
[`suppressHydrationWarning`](https://legacy.reactjs.org/docs/dom-elements.html#suppresshydrationwarning)
on the `<ImageDisplayControl>` component, so that React does not complain about
the underlying DOM being tweaked.

#### `class=` and `className=` properties

We support both the standard `class=` attribute and the React `className=`
property.

### Additional attributes and properties

#### Standard web component `data-*=` attributes

Any of the web-component-specific `data-*=` attributes are supported. See the
web component's attribute
[reference](https://github.com/Frameright/image-display-control-web-component/blob/main/image-display-control/docs/reference/attributes.md)
for more details.

##### `data-image-regions=` attribute

This attribute is used for passing a list of Image Regions to the web component.
You don't have set it: the `<ImageDisplayControl>` component will do it for you
by parsing the Image Regions from the image pointed to by the `src=` attribute.

You may however set it yourself, if you want, in order to override the Image
Regions that would otherwise be parsed from the image metadata.

#### Additional properties

Some more properties on the children are being written or read by the
`<ImageDisplayControl>` component.

##### `data-path-on-server=` property

Use this property to indicate the path of the image file on the server, in order
to make server-side rendering possible. See
[Server-side rendering](ssr.md) for more details.

##### Internal properties

At the moment the `<ImageDisplayControl>` component sets the following
properties on its children for internal purposes:

* `ref=`
* `data-idc-uuid=`
* `data-src-prop=`

This is subject to change. Do not read or write these properties yourself.

## `ImageDisplayControl` component's properties

You can set the `data-debug` boolean property to `true` on the
`<ImageDisplayControl>` component in order to enable debugging traces in the
browser's console and, if applicable, in the server's logs (during
[server-side rendering](ssr.md)) or in the build logs (during static site
generation).

This would look like:

```jsx
<ImageDisplayControl data-debug>
  <img
    src="https://react.frameright.io/assets/pics/skater.jpg"
    alt="Skater"
  />
</ImageDisplayControl>
```

## Parent DOM element's attributes

By default the
[Image Display Control web component](https://github.com/Frameright/image-display-control-web-component)
will add `contain: paint;` to the `style=` attribute of its parent DOM element.
This is called
[CSS containment](https://github.com/Frameright/image-display-control-web-component/blob/main/image-display-control/docs/explanation/css-containment.md)
and is used to avoid unwanted scrollbars.

Because of this, React may notice that the DOM has been tweaked and complain
with a cryptic warning in the browser's console. To avoid this, you can either:

* proactively set `contain: paint;` on that element yourself, or
* set
  [`suppressHydrationWarning`](https://legacy.reactjs.org/docs/dom-elements.html#suppresshydrationwarning)
  on that element.

To show that you understand, please also set the `data-idc-parent` boolean
property to `true` on that element. Otherwise, the `<ImageDisplayControl>`
component will print a friendly warning to point you to this documentation.

This would look like:

```jsx
<div data-idc-parent style={{ contain: 'paint' }}>
  <ImageDisplayControl>
    <img
      src="https://react.frameright.io/assets/pics/skater.jpg"
      alt="Skater"
    />
  </ImageDisplayControl>
</div>
```
