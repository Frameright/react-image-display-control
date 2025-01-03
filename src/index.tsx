import { v4 as uuidv4 } from 'uuid';

import * as React from 'react';

import { Parser } from '@frameright/image-display-control-metadata-parser';

// If true, we are either running on the server at request-time, or at
// build time, building a static (e.g. Next.js) page.
const isServerOrStatic = typeof window === 'undefined';

const isBrowser = !isServerOrStatic;

let isRunningTests = false;
try {
  // See https://stackoverflow.com/questions/50940640/how-to-determine-if-jest-is-running-the-code-or-not
  isRunningTests = process.env.JEST_WORKER_ID !== undefined;
} catch (e) {
  // Probably "ReferenceError: process is not defined", ignore.
}

// See https://docs.frameright.io/web-component/importing
if (isBrowser && !isRunningTests) {
  // Defines the <img is="image-display-control"> web component.
  import(
    '@frameright/image-display-control-web-component/dist/src/image-display-control.js'
  );
}

interface FsModule {
  readFileSync: (path: string) => Buffer;
}

let fs: FsModule | null = null;
if (!isBrowser) {
  // We need to use `require()` here with Vite/Vike in prod as otherwise
  // `import()` will happen later than the server-side rendering. However
  // `require()` isn't defined in dev mode, so then we fall back to `import()`.
  if (require) {
    // FIXME: for this to work on Next.js, we need to set
    // `config.resolve.fallback = { fs: false };` in next.config.js. See
    // https://stackoverflow.com/questions/64926174/module-not-found-cant-resolve-fs-in-next-js-application
    fs = require('fs');
  } else {
    import('fs').then((fsModule) => {
      fs = fsModule;
    });
  }
}

interface ImageSource {
  src: string; // URL

  // Optional. If provided, this is the path to the image on server, for
  // server-side rendering or static site generation. If not provided although
  // server-side rendering or static site generation is used, a warning will be
  // issued. Pass `none` to disable this warning.
  pathOnServer?: string;
}

export function ImageDisplayControl({
  children,
  'data-debug': debug = false,
}: {
  children?: React.ReactElement | React.ReactElement[];
  'data-debug'?: boolean;
}) {
  _traceIfDebug(debug, 'Rendering...');

  const allChildren = children || [];

  // Same UUID and ref for all <img>-like children of one same
  // <ImageDisplayControl> component.
  //
  // Note: it may happen that when adding new children later, they will obtain
  // a different UUID than previous children. This is fine, as this UUID is only
  // used for finding server-side rendered image regions in the DOM on initial
  // hydration.
  // New children will not have any new server-side rendered image regions to
  // take from the DOM. Instead, all initially server-side rendered image
  // regions will be already present in the state anyway.
  const [uuid] = React.useState((): string => uuidv4());
  const ref = React.useRef(null);

  // This maps an image src to its image regions as a json string. Let's
  // initially render the web component with empty image regions. Image regions
  // will be fetched asynchronously with useEffect().
  const [imageRegionsMap, setImageRegionsMap] = React.useState(
    new Map<string, string>()
  );
  _initializeImageRegionsMap(imageRegionsMap, allChildren, debug);

  // We are going to extend all <img>-like elements by adding attributes to
  // them, in order to turn them into <img is="image-display-control"> elements
  // under the hood.
  let numImgChildren = 0;
  const extendedChildren = React.Children.map(allChildren, (child) => {
    const imageSource = _getImageSource(child);
    if (!imageSource) {
      // This child isn't an <img>-like element. No need to extend it with the
      // web component functionality.
      return child;
    }

    ++numImgChildren;

    const childProps = {
      class: null,
      className: null,
      ...(child.props as object),
    };

    const newAttrs: {
      is: string;
      class: string;
      ref: React.MutableRefObject<null>;
      'data-idc-uuid': string;
      suppressHydrationWarning: boolean;
      'data-src-prop': string;
      'data-path-on-server'?: string;
      'data-image-regions'?: string;
    } = {
      // Note: thanks to this, react will recognize this as a custom element.
      // https://react.dev/reference/react-dom/components#custom-html-elements
      is: 'image-display-control',

      // Because this is a custom element, `class=` should be used instead of
      // `className=`. However we want to allow the user to use `className=`, so
      // we copy it over to `class=`:
      class: `${childProps.class || ''} ${childProps.className || ''}`.trim(),

      ref,
      'data-idc-uuid': uuid,

      // There might be a `data-image-regions=` attribute mismatch between
      // what's rendered on the server and what's rendered during the initial
      // client-side hydration. This is because for performance reasons, if the
      // server has already parsed the image regions, we don't want to do this
      // work again in the browse. Instead we don't explicitly re-render the
      // `data-image-regions=` attribute, see below. This makes React issue a
      // warning, which we suppress here. See also
      // * https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors
      // * https://stackoverflow.com/questions/40093655/how-do-i-add-attributes-to-existing-html-elements-in-typescript-jsx
      suppressHydrationWarning: true,

      // On Next.js in prod, the react `src` prop may end up being different
      // from the rendered DOM `src` attribute. Keep track of the prop for
      // mapping.
      'data-src-prop': imageSource.src,
    };

    if (isServerOrStatic) {
      // We don't want to leak `data-path-on-server` to the client, so we remove
      // it from the attributes.
      newAttrs['data-path-on-server'] = undefined;
    }

    const knownImageRegions = imageRegionsMap.get(imageSource.src);
    if (knownImageRegions) {
      newAttrs['data-image-regions'] = knownImageRegions;
    } else {
      if (isBrowser) {
        // Note that at this point, possibly the DOM already has the attributes
        // `data-image-regions=` etc., pre-rendered by the server. In that case,
        // `cloneElement()` won't discard them, but they'll survive.
      }
    }

    const extendedChild = React.cloneElement(child, newAttrs);
    _traceIfDebug(debug, 'Rendering extended child:', extendedChild);

    return extendedChild;
  });

  // See
  // https://stackoverflow.com/questions/57847626/using-async-await-inside-a-react-functional-component
  React.useEffect(() => {
    _populateImageRegionsMap(imageRegionsMap, setImageRegionsMap, ref, debug);

    _checkParentElement(ref);
  }, [imageRegionsMap, ref, debug, numImgChildren]);

  return <>{extendedChildren}</>;
}

// This function makes sure that each <img>-like child has an entry in the map,
// worst case with no image regions.
// If we are on server-side, it tries to synchronously reads the image regions
// from the metadata of the image file on disk.
function _initializeImageRegionsMap(
  imageRegionsMap: Map<string, string>,
  children: React.ReactElement | React.ReactElement[],
  debug: boolean
) {
  _traceIfDebug(debug, 'Initializing image regions map...');

  React.Children.forEach(children, (child) => {
    _traceIfDebug(debug, 'Initializing image regions map for child:', child);

    const imageSource = _getImageSource(child);
    if (!imageSource) {
      // This child isn't an <img>-like element, skipping.
      return;
    }

    if (!imageRegionsMap.get(imageSource.src)) {
      let imageRegions = '';
      if (isServerOrStatic) {
        if (!imageSource.pathOnServer) {
          _warn(
            'Missing data-path-on-server attribute for',
            imageSource.src,
            ", can't read image regions from disk. You probably want to read " +
              'https://docs.frameright.io/react/ssr'
          );
        } else if (imageSource.pathOnServer !== 'none') {
          _traceIfDebug(
            debug,
            'Reading image regions on disk for',
            imageSource.src
          );
          imageRegions = _readImageRegionsJsonFromDisk(
            imageSource.pathOnServer,
            debug
          );
        }
      }
      imageRegionsMap.set(imageSource.src, imageRegions);
    } else {
      _traceIfDebug(debug, 'Found image regions in state for', imageSource.src);
    }
  });
}

// On client-side, for each key of the map, which is an image src, fetch/parse
// the image regions from the image's metadata, if it hasn't been done already,
// and populate the map accordingly.
// Not only it populates the map, but it also calls the provided react state
// setter.
//
// Note: imgChildRef is a ref to one of the <img>-like children.
async function _populateImageRegionsMap(
  imageRegionsMap: Map<string, string>,
  setImageRegionsMap: React.Dispatch<React.SetStateAction<Map<string, string>>>,
  imgChildRef: React.MutableRefObject<HTMLImageElement | null>,
  debug: boolean
) {
  _traceIfDebug(debug, 'Populating image regions map if needed...');

  // Building a map of image regions from the pre-rendered DOM, if any.
  const imageRegionsMapFromDom = new Map<string, string>();
  for (const child of _getImgChildren(imgChildRef)) {
    const imageSource = _getImageSource(child);
    if (imageSource) {
      _traceIfDebug(
        debug,
        'Reading image regions from DOM for',
        imageSource.src,
        '...'
      );

      const imageRegions = child.dataset.imageRegions;
      if (imageRegions) {
        imageRegionsMapFromDom.set(imageSource.src, imageRegions);
      }
    }
  }

  let modified = false;
  for (const [src, imageRegions] of imageRegionsMap) {
    if (!imageRegions) {
      const imageRegionsFromDom = imageRegionsMapFromDom.get(src);
      if (imageRegionsFromDom) {
        // No need to fetch/parse the image regions from the image's metadata,
        // we already have them from the pre-rendered DOM.
        _traceIfDebug(debug, 'Populating image regions from DOM for', src);
        imageRegionsMap.set(src, imageRegionsFromDom);
      } else {
        // The regions for this image haven't been fetched yet. Let's fetch them
        // now.
        _traceIfDebug(
          debug,
          'Image regions not found in DOM for',
          src,
          ', fetching...'
        );

        let arrayBuffer: ArrayBuffer;
        try {
          // Notes:
          // * may or may not be in cache yet.
          // * may lead to CORS-related errors.
          const image = await fetch(src);

          arrayBuffer = await image.arrayBuffer();
        } catch (error) {
          _warn('Error fetching image:', error);
          continue;
        }

        // Because of the awaits, the regions may have been populated already by
        // another promise. Let's check again:
        if (imageRegionsMap.get(src)) {
          _traceIfDebug(
            debug,
            'Image regions for',
            src,
            'already populated meanwhile, aborting.'
          );
          continue;
        }

        await _waitForImports(debug);
        const regions = _readImageRegionsJsonFromBuffer(arrayBuffer);
        if (regions) {
          _traceIfDebug(
            debug,
            'Populating image regions from metadata for',
            src
          );
          imageRegionsMap.set(src, regions);
          modified = true;
        }
      }
    }
  }

  if (modified) {
    _traceIfDebug(debug, 'Updating image regions map in state.');
    setImageRegionsMap(new Map(imageRegionsMap));
  } else {
    _traceIfDebug(debug, 'Image regions map in state is up-to-date.');
  }

  _traceIfDebug(debug, 'Image regions map in state:', imageRegionsMap);
}

// Note: imgChildRef is a ref to one of the <img>-like children.
function _checkParentElement(
  imgChildRef: React.MutableRefObject<HTMLImageElement | null>
) {
  const child = imgChildRef.current;
  if (child) {
    const parent = child.parentElement;
    if (parent && !parent.dataset.idcParent) {
      _warn(
        "Parent element of <ImageDisplayControl> doesn't have a " +
          "'data-idc-parent' attribute. You probably want to read " +
          'https://docs.frameright.io/react/attributes#parent-dom-elements-attributes'
      );
    }
  }
}

// Note: imgChildRef is a ref to one of the <img>-like children.
function _getImgChildren(
  imgChildRef: React.MutableRefObject<HTMLImageElement | null>
): HTMLImageElement[] {
  const child = imgChildRef.current;
  if (child) {
    // Note: we use the UUID to make sure we don't catch neighboring images
    // managed by another <ImageDisplayControl>:
    //
    // <div> <-- DOM parent of all the <img>s
    //   <ImageDisplayControl> <-- doesn't produce a DOM element
    //     <img data-idc-uuid="123" />
    //     <img data-idc-uuid="123" />
    //   </ImageDisplayControl>
    //   <ImageDisplayControl> <-- doesn't produce a DOM element
    //     <img data-idc-uuid="456" /> <-- DOM sibling of the previous <img>s
    //   </ImageDisplayControl>
    // </div>
    const uuid = child.dataset.idcUuid;
    if (uuid) {
      const parent = child.parentElement;
      if (parent) {
        return Array.from(
          parent.querySelectorAll('[data-idc-uuid="' + uuid + '"]')
        );
      }
    }
  }
  return [];
}

// To be used only on server-side.
function _readImageRegionsJsonFromDisk(
  pathOnServer: string,
  debug: boolean
): string {
  if (!fs) {
    _warn("fs module not available, can't read image regions from disk.");
    return '';
  }

  let result = '';
  try {
    _traceIfDebug(debug, 'Reading image regions from', pathOnServer);
    const buffer = fs.readFileSync(pathOnServer);
    result = _readImageRegionsJsonFromBuffer(buffer);
    _traceIfDebug(debug, 'Found image regions:', result);
  } catch (error) {
    _warn('Error while reading image regions from disk:', error);
  }
  return result;
}

function _readImageRegionsJsonFromBuffer(buffer: Buffer | ArrayBuffer): string {
  const parser = new Parser(buffer);
  const regions = parser.getIdcMetadata('rectangle', 'crop');
  return JSON.stringify(regions);
}

function _getImageSource(
  element: React.ReactElement | HTMLImageElement
): ImageSource | null {
  if (!_isImgElement(element)) {
    return null;
  }

  let result: ImageSource | null = null;
  if ('props' in element) {
    // React element

    const elementProps = {
      src: {},
      'data-path-on-server': null,
      ...(element.props as object),
    };

    if (typeof elementProps.src === 'string') {
      result = {
        src: elementProps.src,
      };
    } else if ('src' in elementProps.src) {
      // This typically happen when statically importing an image on Next.js,
      // the resulting object being an instance of StaticImageData.
      result = {
        src: elementProps.src.src as string,
      };

      if ('pathOnServer' in elementProps.src) {
        result.pathOnServer = elementProps.src.pathOnServer as string;
      }
    } else {
      _warn('Unknown src= attribute format: ', elementProps.src);
      return null;
    }

    if (elementProps['data-path-on-server']) {
      result.pathOnServer = elementProps['data-path-on-server'];
    }
  } else {
    // HTML element

    result = {
      src:
        element.attributes.getNamedItem('data-src-prop')?.value ||
        element.attributes.getNamedItem('src')?.value ||
        element.src,
    };
  }

  return result;
}

// Returns true if the element is an <img>-like element, i.e. also Next.js
// <Image> or react-bootstrap <Image> elements, for example.
function _isImgElement(
  element: React.ReactElement | HTMLImageElement
): boolean {
  if ('props' in element) {
    // React element

    const elementProps = {
      src: null,
      ...(element.props as object),
    };

    return !!elementProps.src;
  } else if ('attributes' in element) {
    // HTML element
    return !!element.attributes.getNamedItem('src')?.value;
  }
  return false;
}

// FIXME: workaround for async import() on Vite/Vike in dev mode.
async function _waitForImports(debug: boolean) {
  for (const waitMs of [100, 200, 500, 1000, 1000]) {
    if (fs || isBrowser) {
      _traceIfDebug(debug, 'All imports have resolved.');
      return;
    }
    _traceIfDebug(debug, 'Waiting for imports to resolve...');
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  _warn('Some imports are still missing, image regions will not be available.');
}

const consolePrefix = '[idc]';

function _warn(...args: any[]) {
  console.warn(consolePrefix, '[warn]', ...args);
}

function _traceIfDebug(debug: boolean, ...args: any[]) {
  if (debug) {
    console.log(consolePrefix, '[debug]', ...args);
  }
}
