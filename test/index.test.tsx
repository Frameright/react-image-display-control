import * as React from 'react';
import { createRoot } from 'react-dom/client';

// Workaround for "ReferenceError: TextDecoder is not defined". See
// * https://stackoverflow.com/questions/68468203/why-am-i-getting-textencoder-is-not-defined-in-jest
// * https://mattbatman.com/textencoder-textdecoder-jest-and-jsdom/
import { TextDecoder } from 'util';
Object.defineProperty(window, 'TextDecoder', {
  writable: true,
  value: TextDecoder,
});
// eslint-disable-next-line import/first
import { ImageDisplayControl } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(<ImageDisplayControl></ImageDisplayControl>);
    root.unmount();
  });
});
